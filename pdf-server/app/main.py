from __future__ import annotations

import asyncio
import base64
import binascii
import subprocess
import tempfile
import hashlib
import hmac
import json
import os
import secrets
import shutil
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

from .processor import process_job, safe_name, analyze_pdf, ghostscript_compress, ocr_pdf, rewrite_structure

DATA_DIR = Path(os.getenv("PDF_CORRECTOR_DATA_DIR", "/data/docspace-pdf-jobs")).resolve()
MAX_FILES = int(os.getenv("PDF_CORRECTOR_MAX_FILES", "500"))
MAX_FILE_BYTES = int(os.getenv("PDF_CORRECTOR_MAX_FILE_BYTES", str(500 * 1024 * 1024)))
MAX_JOB_BYTES = int(os.getenv("PDF_CORRECTOR_MAX_JOB_BYTES", str(5 * 1024 * 1024 * 1024)))
CHUNK_BYTES = int(os.getenv("PDF_CORRECTOR_CHUNK_BYTES", str(8 * 1024 * 1024)))
JOB_TTL_HOURS = int(os.getenv("PDF_CORRECTOR_JOB_TTL_HOURS", "72"))
MAX_CONCURRENT_JOBS = max(1, int(os.getenv("PDF_CORRECTOR_CONCURRENCY", "1")))
RENDER_SECRET = os.getenv("RENDER_API_SECRET", "").strip()
SECRET = RENDER_SECRET
ALLOWED_ORIGINS = [item.strip() for item in os.getenv("PDF_CORRECTOR_ALLOWED_ORIGINS", "https://codebykaua.github.io").split(",") if item.strip()]

DATA_DIR.mkdir(parents=True, exist_ok=True)
metadata_lock = asyncio.Lock()
worker_tasks: list[asyncio.Task] = []
stop_event = asyncio.Event()


class CreateJobRequest(BaseModel):
    mode: str = Field(default="auto", pattern="^(auto|preserve|compatibility)$")
    language: str = Field(default="por+eng", max_length=32)
    expectedFiles: int = Field(default=1, ge=1, le=MAX_FILES)
    expectedBytes: int = Field(default=0, ge=0, le=MAX_JOB_BYTES)


class InitFileRequest(BaseModel):
    name: str = Field(min_length=1, max_length=240)
    size: int = Field(ge=1, le=MAX_FILE_BYTES)
    type: str = Field(default="application/octet-stream", max_length=120)


class CompleteFileRequest(BaseModel):
    chunks: int = Field(ge=1, le=100_000)


class LegacyPdfRequest(BaseModel):
    fileBase64: str | None = None
    pdfBase64: str | None = None
    fileName: str = "documento.pdf"
    level: str = "balanced"
    language: str = "por"
    force: bool = False


class LegacyDocxRequest(BaseModel):
    docxBase64: str
    fileName: str = "documento.docx"


def require_render_secret(x_render_secret: str | None = Header(default=None)) -> None:
    if not RENDER_SECRET:
        raise HTTPException(status_code=503, detail="RENDER_API_SECRET não configurado no serviço.")
    if not x_render_secret or not secrets.compare_digest(str(x_render_secret), RENDER_SECRET):
        raise HTTPException(status_code=401, detail="Acesso negado.")


def decode_legacy_base64(value: str | None, max_bytes: int = 70 * 1024 * 1024) -> bytes:
    text = str(value or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Arquivo em base64 ausente.")
    if "," in text and text.lower().startswith("data:"):
        text = text.split(",", 1)[1]
    try:
        data = base64.b64decode(text, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail="Arquivo em base64 inválido.")
    if not data or len(data) > max_bytes:
        raise HTTPException(status_code=400, detail="Arquivo vazio ou grande demais para esta rota.")
    return data


def encode_b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def verify_token(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    if not SECRET:
        raise HTTPException(status_code=503, detail="RENDER_API_SECRET não configurado no serviço.")
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Token de upload ausente.")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload_part, signature_part = token.split(".", 1)
        expected = hmac.new(SECRET.encode("utf-8"), payload_part.encode("utf-8"), hashlib.sha256).digest()
        supplied = b64url_decode(signature_part)
        if not hmac.compare_digest(expected, supplied):
            raise ValueError("assinatura")
        payload = json.loads(b64url_decode(payload_part).decode("utf-8"))
        if payload.get("scope") != "pdf-corrector":
            raise ValueError("escopo")
        if int(payload.get("exp", 0)) <= int(time.time()):
            raise ValueError("expirado")
        if not payload.get("uid"):
            raise ValueError("usuário")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Token de upload inválido ou expirado.")


def job_dir(job_id: str) -> Path:
    try:
        parsed = uuid.UUID(str(job_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Trabalho não encontrado.")
    return DATA_DIR / str(parsed)


def metadata_path(folder: Path) -> Path:
    return folder / "job.json"


def read_meta(folder: Path) -> dict[str, Any]:
    path = metadata_path(folder)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Trabalho não encontrado.")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        raise HTTPException(status_code=500, detail="Metadados do trabalho estão corrompidos.")


def write_meta(folder: Path, data: dict[str, Any]) -> None:
    data["updatedAt"] = int(time.time())
    temp = metadata_path(folder).with_suffix(".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    temp.replace(metadata_path(folder))


def require_owner(folder: Path, identity: dict[str, Any]) -> dict[str, Any]:
    data = read_meta(folder)
    if str(data.get("ownerId")) != str(identity.get("uid")):
        raise HTTPException(status_code=403, detail="Este trabalho pertence a outro usuário.")
    return data


def public_status(data: dict[str, Any]) -> dict[str, Any]:
    keys = [
        "jobId", "status", "phase", "progress", "message", "currentFile", "expectedFiles",
        "uploadedFiles", "uploadedBytes", "totalPdfs", "processedPdfs", "correctedPdfs",
        "failedPdfs", "resultBytes", "durationSeconds", "resultFileName", "downloadKey", "createdAt", "updatedAt",
    ]
    return {key: data.get(key) for key in keys if key in data}


async def update_job(folder: Path, patch: dict[str, Any]) -> None:
    async with metadata_lock:
        data = read_meta(folder)
        data.update(patch)
        write_meta(folder, data)


def update_job_sync(folder: Path, patch: dict[str, Any]) -> None:
    # Processador roda em uma thread única por trabalho. O arquivo temporário evita gravação parcial.
    data = read_meta(folder)
    data.update(patch)
    write_meta(folder, data)


def is_cancelled(folder: Path) -> bool:
    try:
        return read_meta(folder).get("status") == "cancelled"
    except Exception:
        return True


async def process_one_job(folder: Path) -> None:
    data = read_meta(folder)
    if data.get("status") not in {"queued", "processing"}:
        return
    await update_job(folder, {"status": "processing", "phase": "starting", "progress": 2, "message": "Preparando processamento..."})
    try:
        summary = await asyncio.to_thread(
            process_job,
            folder,
            mode=str(data.get("mode") or "auto"),
            language=str(data.get("language") or "por+eng"),
            max_files=MAX_FILES,
            max_total_bytes=MAX_JOB_BYTES,
            update=lambda patch: update_job_sync(folder, patch),
            cancelled=lambda: is_cancelled(folder),
        )
        await update_job(folder, {"status": "done", "phase": "done", "progress": 100, **summary})
    except Exception as exc:
        if str(exc) == "PROCESSAMENTO_CANCELADO" or is_cancelled(folder):
            await update_job(folder, {"status": "cancelled", "phase": "cancelled", "message": "Processamento cancelado."})
        else:
            await update_job(folder, {"status": "failed", "phase": "failed", "message": str(exc)[:1000], "error": str(exc)[:3000]})


async def worker_loop(worker_number: int) -> None:
    while not stop_event.is_set():
        chosen: Path | None = None
        for folder in sorted(DATA_DIR.iterdir(), key=lambda path: path.stat().st_mtime if path.exists() else 0):
            if not folder.is_dir() or not metadata_path(folder).exists():
                continue
            try:
                data = read_meta(folder)
            except Exception:
                continue
            if data.get("status") == "queued":
                marker = folder / f"worker-{worker_number}.lock"
                try:
                    marker.touch(exist_ok=False)
                except FileExistsError:
                    continue
                # Impede dois workers de pegarem o mesmo trabalho.
                other_locks = list(folder.glob("worker-*.lock"))
                if len(other_locks) > 1:
                    marker.unlink(missing_ok=True)
                    continue
                chosen = folder
                break
        if chosen is not None:
            try:
                await process_one_job(chosen)
            finally:
                for marker in chosen.glob("worker-*.lock"):
                    marker.unlink(missing_ok=True)
        else:
            try:
                await asyncio.wait_for(stop_event.wait(), timeout=2.0)
            except asyncio.TimeoutError:
                pass


async def cleanup_loop() -> None:
    while not stop_event.is_set():
        cutoff = time.time() - JOB_TTL_HOURS * 3600
        for folder in list(DATA_DIR.iterdir()):
            if not folder.is_dir():
                continue
            try:
                data = read_meta(folder)
                updated = int(data.get("updatedAt", data.get("createdAt", 0)))
                if updated and updated < cutoff and data.get("status") not in {"processing", "queued"}:
                    shutil.rmtree(folder, ignore_errors=True)
            except Exception:
                continue
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=1800)
        except asyncio.TimeoutError:
            pass


@asynccontextmanager
async def lifespan(_: FastAPI):
    stop_event.clear()
    # Trabalhos que estavam processando quando o processo reiniciou voltam para a fila.
    for folder in DATA_DIR.iterdir():
        if folder.is_dir() and metadata_path(folder).exists():
            try:
                data = read_meta(folder)
                if data.get("status") == "processing":
                    data.update({"status": "queued", "phase": "resuming", "message": "Retomando após reinicialização do serviço."})
                    write_meta(folder, data)
            except Exception:
                continue
    worker_tasks.extend(asyncio.create_task(worker_loop(index + 1)) for index in range(MAX_CONCURRENT_JOBS))
    worker_tasks.append(asyncio.create_task(cleanup_loop()))
    yield
    stop_event.set()
    await asyncio.gather(*worker_tasks, return_exceptions=True)
    worker_tasks.clear()


app = FastAPI(title="DocSpace PDF Corrector", version="1.61.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Chunk-Index"],
    expose_headers=["Content-Length", "Content-Disposition"],
)


@app.exception_handler(HTTPException)
async def http_error_handler(_: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"success": False, "message": exc.detail})


@app.get("/health")
async def health():
    dependencies = {
        "libreoffice": bool(shutil.which("libreoffice")),
        "ghostscript": bool(shutil.which("gs") or shutil.which("gswin64c")),
        "qpdf": bool(shutil.which("qpdf")),
        "ocrmypdf": bool(shutil.which("ocrmypdf")),
        "tesseract": bool(shutil.which("tesseract")),
        "pdftotext": bool(shutil.which("pdftotext")),
    }
    ok = all(dependencies.values()) and bool(SECRET) and bool(RENDER_SECRET)
    return JSONResponse(
        status_code=200 if ok else 503,
        content={
            "ok": ok,
            "service": "docspace-pdf-corrector",
            "version": "1.61.0",
            "dependencies": dependencies,
            "secretConfigured": bool(SECRET),
            "renderSecretConfigured": bool(RENDER_SECRET),
            "maxFiles": MAX_FILES,
            "maxFileBytes": MAX_FILE_BYTES,
            "maxJobBytes": MAX_JOB_BYTES,
            "chunkBytes": CHUNK_BYTES,
        },
    )


@app.post("/api/convert-docx-to-pdf")
async def convert_docx_to_pdf(payload: LegacyDocxRequest, _: None = Depends(require_render_secret)):
    data = decode_legacy_base64(payload.docxBase64, max_bytes=20 * 1024 * 1024)
    with tempfile.TemporaryDirectory(prefix="docspace-docx-") as temp_name:
        temp = Path(temp_name)
        source = temp / safe_name(payload.fileName if payload.fileName.lower().endswith(".docx") else "documento.docx")
        source.write_bytes(data)
        command = ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", str(temp), str(source)]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=300, check=False)
        output = temp / f"{source.stem}.pdf"
        if result.returncode != 0 or not output.exists():
            raise HTTPException(status_code=500, detail="Falha ao converter DOCX com LibreOffice.")
        safe_pdf = temp / "safe.pdf"
        rewrite_structure(output, safe_pdf)
        return {
            "success": True,
            "protected": True,
            "pdfBase64": encode_b64(safe_pdf),
            "fileName": f"{source.stem}.pdf",
            "originalBytes": len(data),
            "outputBytes": safe_pdf.stat().st_size,
            "strategy": "libreoffice",
        }


@app.post("/api/pdf/compress")
async def legacy_compress_pdf(payload: LegacyPdfRequest, _: None = Depends(require_render_secret)):
    data = decode_legacy_base64(payload.fileBase64 or payload.pdfBase64)
    profile = {
        "screen": (120, 55, True),
        "strong": (120, 55, True),
        "printer": (220, 84, False),
        "light": (220, 84, False),
        "balanced": (170, 72, False),
    }.get(str(payload.level or "balanced"), (170, 72, False))
    with tempfile.TemporaryDirectory(prefix="docspace-compress-") as temp_name:
        temp = Path(temp_name)
        source = temp / "input.pdf"
        source.write_bytes(data)
        repaired = temp / "repaired.pdf"
        rewrite_structure(source, repaired)
        output = temp / "compressed.pdf"
        ok, detail = ghostscript_compress(repaired, output, dpi=profile[0], jpeg_quality=profile[1], gray=profile[2])
        if not ok:
            output = repaired
        analysis = analyze_pdf(output)
        return {
            "success": True,
            "pdfBase64": encode_b64(output),
            "fileName": f"{Path(safe_name(payload.fileName)).stem}-compactado.pdf",
            "originalBytes": len(data),
            "outputBytes": output.stat().st_size,
            "finalBytes": output.stat().st_size,
            "strategy": "ghostscript" if ok else "qpdf-structural",
            "hadText": analysis.searchable_pages > 0,
            "message": "PDF comprimido e regravado com segurança." if ok else f"PDF regravado estruturalmente. {detail[:120]}",
        }


@app.post("/api/pdf/ocr")
async def legacy_ocr_pdf(payload: LegacyPdfRequest, _: None = Depends(require_render_secret)):
    data = decode_legacy_base64(payload.fileBase64 or payload.pdfBase64)
    with tempfile.TemporaryDirectory(prefix="docspace-ocr-") as temp_name:
        temp = Path(temp_name)
        source = temp / "input.pdf"
        output = temp / "ocr.pdf"
        source.write_bytes(data)
        before = analyze_pdf(source)
        ok, detail = ocr_pdf(source, output, language=payload.language or "por", force=bool(payload.force), optimize=2)
        if not ok:
            raise HTTPException(status_code=500, detail=f"Falha ao executar OCR. {detail[:240]}")
        after = analyze_pdf(output)
        return {
            "success": True,
            "pdfBase64": encode_b64(output),
            "fileName": f"{Path(safe_name(payload.fileName)).stem}-ocr.pdf",
            "originalBytes": len(data),
            "outputBytes": output.stat().st_size,
            "finalBytes": output.stat().st_size,
            "strategy": "ocrmypdf-force" if payload.force else "ocrmypdf-skip-text",
            "hadText": before.searchable_pages > 0,
            "searchable": after.searchable,
            "message": "OCR aplicado e PDF pesquisável gerado.",
        }


@app.post("/api/jobs")
async def create_job(payload: CreateJobRequest, identity: dict[str, Any] = Depends(verify_token)):
    job_id = str(uuid.uuid4())
    folder = job_dir(job_id)
    (folder / "input").mkdir(parents=True, exist_ok=False)
    (folder / "uploads").mkdir(parents=True, exist_ok=True)
    now = int(time.time())
    data = {
        "jobId": job_id,
        "ownerId": str(identity["uid"]),
        "status": "uploading",
        "phase": "uploading",
        "progress": 0,
        "message": "Aguardando arquivos.",
        "mode": payload.mode,
        "language": payload.language,
        "expectedFiles": payload.expectedFiles,
        "expectedBytes": payload.expectedBytes,
        "uploadedFiles": 0,
        "uploadedBytes": 0,
        "files": {},
        "downloadKey": secrets.token_urlsafe(32),
        "createdAt": now,
        "updatedAt": now,
    }
    write_meta(folder, data)
    return {"success": True, "jobId": job_id, "chunkBytes": CHUNK_BYTES, "maxFiles": MAX_FILES, "maxFileBytes": MAX_FILE_BYTES, "maxJobBytes": MAX_JOB_BYTES}


@app.post("/api/jobs/{job_id}/files/init")
async def init_file(job_id: str, payload: InitFileRequest, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    if data.get("status") != "uploading":
        raise HTTPException(status_code=409, detail="O trabalho não aceita mais arquivos.")
    ext = Path(payload.name).suffix.lower()
    if ext not in {".pdf", ".zip"}:
        raise HTTPException(status_code=400, detail="Envie apenas PDF ou ZIP contendo PDFs.")
    if int(data.get("uploadedFiles", 0)) + len([f for f in data.get("files", {}).values() if not f.get("complete")]) >= MAX_FILES:
        raise HTTPException(status_code=400, detail=f"Limite de {MAX_FILES} arquivos de entrada atingido.")
    reserved = sum(int(item.get("size", 0)) for item in data.get("files", {}).values())
    if reserved + payload.size > MAX_JOB_BYTES:
        raise HTTPException(status_code=400, detail="O trabalho excede o limite total de upload.")
    file_id = secrets.token_hex(12)
    clean_name = safe_name(payload.name)
    file_upload_dir = folder / "uploads" / file_id
    file_upload_dir.mkdir(parents=True, exist_ok=False)
    data.setdefault("files", {})[file_id] = {
        "id": file_id,
        "name": clean_name,
        "size": payload.size,
        "type": payload.type,
        "nextChunk": 0,
        "receivedBytes": 0,
        "complete": False,
    }
    write_meta(folder, data)
    return {"success": True, "fileId": file_id, "name": clean_name, "chunkBytes": CHUNK_BYTES}


@app.put("/api/jobs/{job_id}/files/{file_id}/chunks/{chunk_index}")
async def upload_chunk(job_id: str, file_id: str, chunk_index: int, request: Request, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    item = data.get("files", {}).get(file_id)
    if not item:
        raise HTTPException(status_code=404, detail="Arquivo de upload não encontrado.")
    if item.get("complete"):
        raise HTTPException(status_code=409, detail="Arquivo já concluído.")
    if chunk_index != int(item.get("nextChunk", 0)):
        raise HTTPException(status_code=409, detail=f"Chunk fora de ordem. Esperado: {item.get('nextChunk', 0)}.")
    body = await request.body()
    if not body or len(body) > CHUNK_BYTES:
        raise HTTPException(status_code=400, detail="Chunk vazio ou grande demais.")
    remaining = int(item["size"]) - int(item.get("receivedBytes", 0))
    if len(body) > remaining:
        raise HTTPException(status_code=400, detail="Chunk excede o tamanho declarado do arquivo.")
    chunk_path = folder / "uploads" / file_id / f"{chunk_index:08d}.part"
    chunk_path.write_bytes(body)
    item["receivedBytes"] = int(item.get("receivedBytes", 0)) + len(body)
    item["nextChunk"] = chunk_index + 1
    data["uploadedBytes"] = sum(int(value.get("receivedBytes", 0)) for value in data.get("files", {}).values())
    expected = max(1, int(data.get("expectedBytes", 0) or sum(int(value.get("size", 0)) for value in data.get("files", {}).values())))
    data["progress"] = min(60, int((int(data["uploadedBytes"]) / expected) * 60))
    data["message"] = f"Enviando {item['name']}..."
    write_meta(folder, data)
    return {"success": True, "receivedBytes": item["receivedBytes"], "nextChunk": item["nextChunk"]}


@app.post("/api/jobs/{job_id}/files/{file_id}/complete")
async def complete_file(job_id: str, file_id: str, payload: CompleteFileRequest, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    item = data.get("files", {}).get(file_id)
    if not item:
        raise HTTPException(status_code=404, detail="Arquivo de upload não encontrado.")
    if item.get("complete"):
        return {"success": True, "name": item["name"], "size": item["size"]}
    if int(item.get("receivedBytes", 0)) != int(item["size"]):
        raise HTTPException(status_code=409, detail="Upload incompleto.")
    if int(item.get("nextChunk", 0)) != payload.chunks:
        raise HTTPException(status_code=409, detail="Quantidade de chunks divergente.")
    chunks_dir = folder / "uploads" / file_id
    chunks = sorted(chunks_dir.glob("*.part"))
    if len(chunks) != payload.chunks:
        raise HTTPException(status_code=409, detail="Nem todos os chunks foram encontrados.")
    target = folder / "input" / item["name"]
    if target.exists():
        target = folder / "input" / f"{target.stem}-{file_id[:6]}{target.suffix}"
    with target.open("wb") as output:
        for chunk in chunks:
            with chunk.open("rb") as source:
                shutil.copyfileobj(source, output, length=1024 * 1024)
    if target.stat().st_size != int(item["size"]):
        target.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="Arquivo reconstruído com tamanho incorreto.")
    shutil.rmtree(chunks_dir, ignore_errors=True)
    item["complete"] = True
    item["storedName"] = target.name
    data["uploadedFiles"] = sum(1 for value in data.get("files", {}).values() if value.get("complete"))
    data["message"] = f"Arquivo recebido: {item['name']}"
    write_meta(folder, data)
    return {"success": True, "name": target.name, "size": target.stat().st_size}


@app.post("/api/jobs/{job_id}/start")
async def start_job(job_id: str, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    if data.get("status") in {"queued", "processing", "done"}:
        return {"success": True, **public_status(data)}
    completed = [value for value in data.get("files", {}).values() if value.get("complete")]
    if not completed:
        raise HTTPException(status_code=400, detail="Nenhum arquivo foi enviado completamente.")
    data.update({"status": "queued", "phase": "queued", "progress": 1, "message": "Trabalho adicionado à fila."})
    write_meta(folder, data)
    return {"success": True, **public_status(data)}


@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    return {"success": True, **public_status(data)}


@app.delete("/api/jobs/{job_id}")
async def cancel_job(job_id: str, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    if data.get("status") == "done":
        shutil.rmtree(folder, ignore_errors=True)
        return {"success": True, "message": "Trabalho excluído."}
    data.update({"status": "cancelled", "phase": "cancelled", "message": "Cancelamento solicitado."})
    write_meta(folder, data)
    return {"success": True, "message": "Cancelamento solicitado."}


@app.get("/api/jobs/{job_id}/download")
async def download_job(job_id: str, identity: dict[str, Any] = Depends(verify_token)):
    folder = job_dir(job_id)
    data = require_owner(folder, identity)
    if data.get("status") != "done":
        raise HTTPException(status_code=409, detail="O resultado ainda não está pronto.")
    result = folder / "RESULTADO-CORRECAO-PDFS.zip"
    if not result.exists():
        raise HTTPException(status_code=404, detail="ZIP final não encontrado.")
    return FileResponse(
        result,
        media_type="application/zip",
        filename="RESULTADO-CORRECAO-PDFS.zip",
        headers={"Cache-Control": "no-store"},
    )


@app.get("/api/public/jobs/{job_id}/download")
async def public_download_job(job_id: str, key: str = Query(min_length=20, max_length=200)):
    folder = job_dir(job_id)
    data = read_meta(folder)
    if not secrets.compare_digest(str(data.get("downloadKey") or ""), str(key or "")):
        raise HTTPException(status_code=403, detail="Chave de download inválida.")
    if data.get("status") != "done":
        raise HTTPException(status_code=409, detail="O resultado ainda não está pronto.")
    result = folder / "RESULTADO-CORRECAO-PDFS.zip"
    if not result.exists():
        raise HTTPException(status_code=404, detail="ZIP final não encontrado.")
    return FileResponse(
        result,
        media_type="application/zip",
        filename="RESULTADO-CORRECAO-PDFS.zip",
        headers={"Cache-Control": "no-store"},
    )
