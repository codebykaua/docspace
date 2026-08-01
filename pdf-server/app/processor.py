from __future__ import annotations

import json
import math
import os
import re
import shutil
import subprocess
import tempfile
import time
import zipfile
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Callable, Iterable

import fitz  # PyMuPDF
import pikepdf
from PIL import Image

PDF_TOTAL_LIMIT = 4_000_000
PDF_PAGE_LIMIT = 500_000
PDF_TOTAL_TARGET = 3_700_000
PDF_PAGE_TARGET = 450_000


@dataclass
class PdfAnalysis:
    opens: bool
    page_count: int
    total_bytes: int
    largest_page_bytes: int
    oversized_pages: list[int]
    searchable_pages: int
    non_searchable_pages: list[int]
    invalid_fonts: list[str]
    fonts_embedded: bool
    unicode_mapping_ok: bool
    all_pages_render: bool
    page_sizes: list[int]
    error: str = ""

    @property
    def searchable(self) -> bool:
        return self.page_count > 0 and not self.non_searchable_pages

    @property
    def size_ok(self) -> bool:
        return self.total_bytes < PDF_TOTAL_LIMIT and not self.oversized_pages

    @property
    def fonts_ok(self) -> bool:
        return not self.invalid_fonts and self.fonts_embedded and self.unicode_mapping_ok

    @property
    def valid(self) -> bool:
        return self.opens and self.page_count > 0 and self.size_ok and self.searchable and self.fonts_ok and self.all_pages_render


@dataclass
class FileResult:
    original_name: str
    status: str
    page_count: int = 0
    original_bytes: int = 0
    final_bytes: int = 0
    largest_page_bytes: int = 0
    problems: list[str] | None = None
    corrections: list[str] | None = None
    ocr_pages: int = 0
    compressed_pages: int = 0
    searchable: bool = False
    fonts_valid: bool = False
    structure_valid: bool = False
    output_relative_path: str = ""
    reason: str = ""

    def __post_init__(self) -> None:
        self.problems = list(self.problems or [])
        self.corrections = list(self.corrections or [])


def run_command(args: list[str], timeout: int = 3600, cwd: Path | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(
        args,
        cwd=str(cwd) if cwd else None,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
        timeout=timeout,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


def executable(name: str) -> str | None:
    return shutil.which(name)


def safe_name(name: str) -> str:
    clean = Path(str(name or "arquivo.pdf")).name
    clean = re.sub(r"[^A-Za-z0-9À-ÿ._() -]+", "-", clean).strip(" .")
    if not clean:
        clean = "arquivo.pdf"
    return clean[:180]


def unique_path(folder: Path, name: str) -> Path:
    name = safe_name(name)
    candidate = folder / name
    if not candidate.exists():
        return candidate
    stem, suffix = candidate.stem, candidate.suffix
    index = 2
    while True:
        candidate = folder / f"{stem}-{index}{suffix}"
        if not candidate.exists():
            return candidate
        index += 1


def safe_extract_zip(zip_path: Path, destination: Path, *, max_files: int, max_total_bytes: int) -> list[Path]:
    destination.mkdir(parents=True, exist_ok=True)
    extracted: list[Path] = []
    total = 0
    with zipfile.ZipFile(zip_path, "r") as archive:
        members = archive.infolist()
        if len(members) > max_files * 4:
            raise ValueError(f"ZIP contém arquivos demais ({len(members)}).")
        for member in members:
            if member.is_dir():
                continue
            normalized = member.filename.replace("\\", "/")
            parts = [part for part in normalized.split("/") if part not in ("", ".")]
            if not parts or any(part == ".." for part in parts) or normalized.startswith("/"):
                raise ValueError("ZIP contém caminho inseguro.")
            if member.flag_bits & 0x1:
                raise ValueError("ZIP criptografado não é aceito.")
            total += int(member.file_size)
            if total > max_total_bytes:
                raise ValueError("ZIP excede o limite descompactado do trabalho.")
            ratio = (member.file_size / max(1, member.compress_size)) if member.compress_size else member.file_size
            if member.file_size > 50_000_000 and ratio > 250:
                raise ValueError("Possível ZIP bomb detectado.")
            if not normalized.lower().endswith(".pdf"):
                continue
            target = unique_path(destination, Path(normalized).name)
            with archive.open(member, "r") as source, target.open("wb") as output:
                shutil.copyfileobj(source, output, length=1024 * 1024)
            extracted.append(target)
            if len(extracted) > max_files:
                raise ValueError(f"O limite é de {max_files} PDFs por trabalho.")
    return extracted


def _pdf_font_scan(path: Path) -> tuple[list[str], bool, bool]:
    invalid: set[str] = set()
    embedded_ok = True
    unicode_ok = True
    try:
        with pikepdf.Pdf.open(path) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):
                resources = page.obj.get("/Resources", None)
                if not resources:
                    continue
                fonts = resources.get("/Font", None)
                if not fonts:
                    continue
                for key, font_ref in fonts.items():
                    try:
                        font = font_ref.get_object() if hasattr(font_ref, "get_object") else font_ref
                        subtype = str(font.get("/Subtype", ""))
                        base_name = str(font.get("/BaseFont", key))
                        descriptor = font.get("/FontDescriptor", None)
                        is_type3 = subtype == "/Type3"
                        has_tounicode = font.get("/ToUnicode", None) is not None
                        is_embedded = False
                        if descriptor:
                            descriptor = descriptor.get_object() if hasattr(descriptor, "get_object") else descriptor
                            is_embedded = any(descriptor.get(item, None) is not None for item in ("/FontFile", "/FontFile2", "/FontFile3"))
                        descendants = font.get("/DescendantFonts", None)
                        if descendants:
                            for descendant_ref in descendants:
                                descendant = descendant_ref.get_object() if hasattr(descendant_ref, "get_object") else descendant_ref
                                desc_descriptor = descendant.get("/FontDescriptor", None)
                                if desc_descriptor:
                                    desc_descriptor = desc_descriptor.get_object() if hasattr(desc_descriptor, "get_object") else desc_descriptor
                                    is_embedded = is_embedded or any(desc_descriptor.get(item, None) is not None for item in ("/FontFile", "/FontFile2", "/FontFile3"))
                        if is_type3:
                            invalid.add(f"Página {page_number}: {base_name} ({subtype})")
                        if not is_embedded:
                            embedded_ok = False
                            invalid.add(f"Página {page_number}: {base_name} não incorporada")
                        if not has_tounicode and subtype in ("/Type0", "/TrueType", "/Type1", "/Type3"):
                            unicode_ok = False
                            invalid.add(f"Página {page_number}: {base_name} sem ToUnicode")
                    except Exception as exc:
                        invalid.add(f"Página {page_number}: fonte ilegível ({type(exc).__name__})")
                        embedded_ok = False
                        unicode_ok = False
    except Exception as exc:
        return [f"Falha ao analisar fontes: {exc}"], False, False
    return sorted(invalid), embedded_ok, unicode_ok


def _meaningful_text(text: str) -> bool:
    cleaned = re.sub(r"\s+", " ", str(text or "")).strip()
    alnum = re.findall(r"[A-Za-zÀ-ÿ0-9]", cleaned)
    words = re.findall(r"[A-Za-zÀ-ÿ0-9]{2,}", cleaned)
    return len(alnum) >= 8 and len(words) >= 2


def analyze_pdf(path: Path) -> PdfAnalysis:
    total_bytes = path.stat().st_size if path.exists() else 0
    page_sizes: list[int] = []
    non_searchable: list[int] = []
    searchable_pages = 0
    render_ok = True
    try:
        doc = fitz.open(path)
        if doc.is_encrypted:
            raise ValueError("PDF protegido por senha.")
        page_count = doc.page_count
        for index in range(page_count):
            page = doc.load_page(index)
            text = page.get_text("text") or ""
            if _meaningful_text(text):
                searchable_pages += 1
            else:
                # Página realmente vazia não exige OCR.
                drawings = len(page.get_drawings())
                images = len(page.get_images(full=True))
                if images or drawings or page.rect.get_area() > 0:
                    non_searchable.append(index + 1)
            try:
                pix = page.get_pixmap(matrix=fitz.Matrix(0.18, 0.18), alpha=False)
                if not pix.samples:
                    render_ok = False
            except Exception:
                render_ok = False
            single = fitz.open()
            single.insert_pdf(doc, from_page=index, to_page=index)
            data = single.tobytes(garbage=4, deflate=True, clean=True)
            page_sizes.append(len(data))
            single.close()
        doc.close()
        invalid_fonts, embedded_ok, unicode_ok = _pdf_font_scan(path)
        oversized = [i + 1 for i, size in enumerate(page_sizes) if size >= PDF_PAGE_LIMIT]
        return PdfAnalysis(
            opens=True,
            page_count=page_count,
            total_bytes=total_bytes,
            largest_page_bytes=max(page_sizes or [0]),
            oversized_pages=oversized,
            searchable_pages=searchable_pages,
            non_searchable_pages=non_searchable,
            invalid_fonts=invalid_fonts,
            fonts_embedded=embedded_ok,
            unicode_mapping_ok=unicode_ok,
            all_pages_render=render_ok,
            page_sizes=page_sizes,
        )
    except Exception as exc:
        return PdfAnalysis(
            opens=False,
            page_count=0,
            total_bytes=total_bytes,
            largest_page_bytes=0,
            oversized_pages=[],
            searchable_pages=0,
            non_searchable_pages=[],
            invalid_fonts=[],
            fonts_embedded=False,
            unicode_mapping_ok=False,
            all_pages_render=False,
            page_sizes=[],
            error=str(exc),
        )


def rewrite_structure(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if executable("qpdf"):
        result = run_command(["qpdf", "--object-streams=generate", "--stream-data=compress", str(source), str(destination)], timeout=1800)
        if result.returncode == 0 and destination.exists():
            return
    with pikepdf.Pdf.open(source) as pdf:
        root = pdf.Root
        for key in ("/OpenAction", "/AA"):
            if key in root:
                del root[key]
        names = root.get("/Names", None)
        if names:
            for key in ("/JavaScript", "/EmbeddedFiles"):
                if key in names:
                    del names[key]
        pdf.save(destination, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate, linearize=True)


def ocr_pdf(source: Path, destination: Path, *, language: str, force: bool, optimize: int = 1) -> tuple[bool, str]:
    if not executable("ocrmypdf"):
        return False, "OCRmyPDF não instalado."
    args = [
        "ocrmypdf",
        "--output-type", "pdf",
        "--language", language or "por+eng",
        "--rotate-pages",
        "--deskew",
        "--clean-final",
        "--optimize", str(max(0, min(3, optimize))),
        "--jobs", str(max(1, int(os.getenv("PDF_CORRECTOR_OCR_JOBS", "2")))),
        "--tesseract-timeout", "300",
    ]
    args.append("--force-ocr" if force else "--skip-text")
    args.extend([str(source), str(destination)])
    result = run_command(args, timeout=7200)
    return result.returncode == 0 and destination.exists(), (result.stderr or result.stdout)[-1200:]


def ghostscript_compress(source: Path, destination: Path, *, dpi: int, jpeg_quality: int, gray: bool) -> tuple[bool, str]:
    gs = executable("gs") or executable("gswin64c")
    if not gs:
        return False, "Ghostscript não instalado."
    color_strategy = "/Gray" if gray else "/LeaveColorUnchanged"
    args = [
        gs, "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.7", "-dNOPAUSE", "-dQUIET", "-dBATCH",
        "-dDetectDuplicateImages=true", "-dCompressFonts=true", "-dSubsetFonts=true", "-dEmbedAllFonts=true",
        "-dAutoRotatePages=/None", "-dPreserveAnnots=true", "-dPrinted=false",
        "-dDownsampleColorImages=true", "-dColorImageDownsampleType=/Bicubic", f"-dColorImageResolution={dpi}",
        "-dDownsampleGrayImages=true", "-dGrayImageDownsampleType=/Bicubic", f"-dGrayImageResolution={dpi}",
        "-dDownsampleMonoImages=true", "-dMonoImageDownsampleType=/Subsample", f"-dMonoImageResolution={max(200, dpi)}",
        f"-dJPEGQ={jpeg_quality}", f"-sColorConversionStrategy={color_strategy}",
        f"-sOutputFile={destination}", str(source),
    ]
    result = run_command(args, timeout=7200)
    return result.returncode == 0 and destination.exists(), (result.stderr or result.stdout)[-1200:]


def rasterize_pdf(source: Path, destination: Path, *, dpi: int, jpeg_quality: int, grayscale: bool) -> None:
    src = fitz.open(source)
    out = fitz.open()
    zoom = max(0.5, dpi / 72.0)
    matrix = fitz.Matrix(zoom, zoom)
    try:
        for index in range(src.page_count):
            page = src.load_page(index)
            pix = page.get_pixmap(matrix=matrix, alpha=False, colorspace=fitz.csGRAY if grayscale else fitz.csRGB)
            image = Image.frombytes("L" if grayscale else "RGB", [pix.width, pix.height], pix.samples)
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                temp_image = Path(tmp.name)
            try:
                image.save(temp_image, format="JPEG", quality=jpeg_quality, optimize=True, progressive=True, dpi=(dpi, dpi))
                target = out.new_page(width=page.rect.width, height=page.rect.height)
                target.insert_image(target.rect, filename=str(temp_image), keep_proportion=False, overlay=True)
            finally:
                temp_image.unlink(missing_ok=True)
        out.save(destination, garbage=4, deflate=True, clean=True)
    finally:
        out.close()
        src.close()


def _problems_from_analysis(analysis: PdfAnalysis) -> list[str]:
    problems: list[str] = []
    if not analysis.opens:
        problems.append(f"Estrutura inválida: {analysis.error or 'não abre'}")
        return problems
    if analysis.total_bytes >= PDF_TOTAL_LIMIT:
        problems.append("PDF acima de 4 MB")
    if analysis.oversized_pages:
        problems.append(f"Página(s) acima de 500 KB: {', '.join(map(str, analysis.oversized_pages[:20]))}")
    if analysis.non_searchable_pages:
        problems.append(f"Página(s) não pesquisável(is): {', '.join(map(str, analysis.non_searchable_pages[:20]))}")
    if analysis.invalid_fonts:
        problems.append("Fontes inválidas, não incorporadas ou sem Unicode")
    if not analysis.all_pages_render:
        problems.append("Uma ou mais páginas não renderizam normalmente")
    return problems


def _candidate_is_better(candidate: PdfAnalysis, current: PdfAnalysis | None) -> bool:
    if current is None:
        return True
    score = (
        int(candidate.valid) * 10_000,
        int(candidate.opens) * 1000,
        int(candidate.searchable) * 500,
        int(candidate.fonts_ok) * 300,
        int(candidate.size_ok) * 200,
        -len(candidate.oversized_pages) * 20,
        -len(candidate.non_searchable_pages) * 20,
        -candidate.total_bytes,
    )
    other = (
        int(current.valid) * 10_000,
        int(current.opens) * 1000,
        int(current.searchable) * 500,
        int(current.fonts_ok) * 300,
        int(current.size_ok) * 200,
        -len(current.oversized_pages) * 20,
        -len(current.non_searchable_pages) * 20,
        -current.total_bytes,
    )
    return score > other


def correct_pdf(source: Path, output: Path, *, mode: str, language: str, work_dir: Path, progress: Callable[[str], None]) -> FileResult:
    original = analyze_pdf(source)
    result = FileResult(
        original_name=source.name,
        status="FALHA",
        page_count=original.page_count,
        original_bytes=source.stat().st_size,
        problems=_problems_from_analysis(original),
        searchable=original.searchable,
        fonts_valid=original.fonts_ok,
        structure_valid=original.opens and original.all_pages_render,
    )
    if not original.opens:
        result.reason = original.error or "PDF não abre."
        return result

    mode = mode if mode in {"auto", "preserve", "compatibility"} else "auto"
    language = language or "por+eng"
    attempts: list[tuple[str, Path, PdfAnalysis]] = []
    current_source = source
    best_path: Path | None = None
    best_analysis: PdfAnalysis | None = None

    def consider(label: str, path: Path) -> PdfAnalysis:
        nonlocal best_path, best_analysis
        analysis = analyze_pdf(path)
        attempts.append((label, path, analysis))
        if _candidate_is_better(analysis, best_analysis):
            best_path, best_analysis = path, analysis
        return analysis

    progress("Reparando estrutura")
    repaired = work_dir / "01-reparado.pdf"
    try:
        rewrite_structure(current_source, repaired)
        current_source = repaired
        current = consider("Estrutura reescrita", repaired)
        result.corrections.append("Estrutura interna reescrita e objetos perigosos removidos")
    except Exception as exc:
        current = original
        result.corrections.append(f"Reescrita estrutural não aplicada: {exc}")

    needs_force_ocr = mode == "compatibility" or bool(current.invalid_fonts)
    needs_ocr = needs_force_ocr or bool(current.non_searchable_pages)

    if needs_ocr:
        progress("Executando OCR e normalizando fontes")
        ocr_out = work_dir / "02-ocr.pdf"
        ok, detail = ocr_pdf(current_source, ocr_out, language=language, force=needs_force_ocr, optimize=1)
        if ok:
            current_source = ocr_out
            current = consider("OCR", ocr_out)
            result.ocr_pages = current.page_count if needs_force_ocr else len(original.non_searchable_pages)
            result.corrections.append("OCR executado com camada pesquisável e fonte Unicode")
            if needs_force_ocr:
                result.corrections.append("Páginas reconstruídas para remover fontes antigas incompatíveis")
        else:
            result.corrections.append(f"OCR direto falhou: {detail[:240]}")
            # Compatibilidade máxima: rasterização seguida de OCR.
            progress("Reconstruindo páginas para compatibilidade máxima")
            raster = work_dir / "02-raster.pdf"
            page_target = min(PDF_PAGE_TARGET, max(24_000, PDF_TOTAL_TARGET // max(1, original.page_count)))
            dpi = 150 if page_target >= 80_000 else 110
            quality = 68 if page_target >= 80_000 else 52
            rasterize_pdf(current_source, raster, dpi=dpi, jpeg_quality=quality, grayscale=True)
            raster_ocr = work_dir / "03-raster-ocr.pdf"
            ok2, detail2 = ocr_pdf(raster, raster_ocr, language=language, force=True, optimize=2)
            if ok2:
                current_source = raster_ocr
                current = consider("Rasterização + OCR", raster_ocr)
                result.ocr_pages = current.page_count
                result.corrections.append("Documento totalmente reconstruído e OCR reaplicado")
            else:
                result.corrections.append(f"OCR de compatibilidade falhou: {detail2[:240]}")

    if current.valid:
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(current_source, output)
        final = current
    else:
        progress("Comprimindo adaptativamente")
        profiles = [
            (200, 82, False),
            (170, 74, False),
            (150, 66, True),
            (120, 56, True),
            (96, 45, True),
        ]
        if mode == "preserve":
            profiles = profiles[:3]
        for index, (dpi, quality, gray) in enumerate(profiles, start=1):
            compressed = work_dir / f"04-comprimido-{index}.pdf"
            ok, detail = ghostscript_compress(current_source, compressed, dpi=dpi, jpeg_quality=quality, gray=gray)
            if not ok:
                result.corrections.append(f"Compressão {dpi} DPI falhou: {detail[:180]}")
                continue
            candidate = consider(f"Compressão {dpi} DPI", compressed)
            result.corrections.append(f"Compressão adaptativa aplicada em {dpi} DPI")
            result.compressed_pages = candidate.page_count
            if candidate.valid:
                current_source = compressed
                current = candidate
                break
            # Se a compressão mexeu na camada textual, OCR novamente.
            if candidate.non_searchable_pages or candidate.invalid_fonts:
                repaired_ocr = work_dir / f"05-pos-ocr-{index}.pdf"
                ok_ocr, _ = ocr_pdf(compressed, repaired_ocr, language=language, force=bool(candidate.invalid_fonts), optimize=2)
                if ok_ocr:
                    candidate = consider(f"Compressão + OCR {dpi} DPI", repaired_ocr)
                    if candidate.valid:
                        current_source = repaired_ocr
                        current = candidate
                        break

        if not current.valid and mode != "preserve":
            progress("Aplicando reconstrução final")
            # Meta por página considera simultaneamente 500 KB/página e 4 MB/PDF.
            target_per_page = min(PDF_PAGE_TARGET, max(18_000, PDF_TOTAL_TARGET // max(1, original.page_count)))
            final_profiles = [
                (120, 58),
                (96, 48),
                (82, 40),
                (72, 34),
            ]
            for index, (dpi, quality) in enumerate(final_profiles, start=1):
                raster = work_dir / f"06-final-raster-{index}.pdf"
                rasterize_pdf(source, raster, dpi=dpi, jpeg_quality=quality, grayscale=True)
                ocr_out = work_dir / f"07-final-ocr-{index}.pdf"
                ok, _ = ocr_pdf(raster, ocr_out, language=language, force=True, optimize=3)
                if not ok:
                    continue
                candidate = consider(f"Reconstrução final {dpi} DPI", ocr_out)
                result.ocr_pages = candidate.page_count
                result.compressed_pages = candidate.page_count
                result.corrections.append(f"Compatibilidade máxima aplicada ({dpi} DPI; meta aproximada {target_per_page // 1000} KB/página)")
                if candidate.valid:
                    current_source = ocr_out
                    current = candidate
                    break

        final = analyze_pdf(current_source)
        if final.valid:
            output.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(current_source, output)
        elif best_path is not None and best_analysis is not None and best_analysis.valid:
            output.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(best_path, output)
            final = best_analysis

    result.page_count = final.page_count
    result.final_bytes = final.total_bytes
    result.largest_page_bytes = final.largest_page_bytes
    result.searchable = final.searchable
    result.fonts_valid = final.fonts_ok
    result.structure_valid = final.opens and final.all_pages_render

    if final.valid and output.exists():
        result.status = "CORRIGIDO" if result.problems else "VALIDADO"
        if final.total_bytes > original.total_bytes:
            result.corrections.append("Arquivo validado; a camada OCR aumentou ligeiramente o tamanho")
        result.output_relative_path = output.name
        return result

    result.status = "FALHA"
    failed = []
    if not final.opens:
        failed.append("estrutura inválida")
    if final.total_bytes >= PDF_TOTAL_LIMIT:
        failed.append("arquivo ainda acima de 4 MB")
    if final.oversized_pages:
        failed.append("página ainda acima de 500 KB")
    if final.non_searchable_pages:
        failed.append("páginas ainda não pesquisáveis")
    if final.invalid_fonts or not final.fonts_embedded or not final.unicode_mapping_ok:
        failed.append("fontes ainda inválidas")
    if not final.all_pages_render:
        failed.append("falha de renderização")
    result.reason = ", ".join(failed) or "não passou na validação final"
    return result


def format_bytes(value: int) -> str:
    value = int(value or 0)
    if value < 1000:
        return f"{value} B"
    if value < 1_000_000:
        return f"{value / 1000:.1f} KB"
    return f"{value / 1_000_000:.2f} MB"


def report_text(results: list[FileResult], started_at: float, finished_at: float) -> str:
    corrected = sum(1 for item in results if item.status in {"CORRIGIDO", "VALIDADO"})
    failed = sum(1 for item in results if item.status == "FALHA")
    lines = [
        "RELATÓRIO DE CORREÇÃO E VALIDAÇÃO DE PDFs — DOCSPACE",
        "=" * 64,
        f"Arquivos analisados: {len(results)}",
        f"Corrigidos/validados: {corrected}",
        f"Não corrigidos: {failed}",
        f"Tempo total: {max(0, finished_at - started_at):.1f} segundos",
        "",
    ]
    for item in results:
        lines.extend([
            f"Arquivo: {item.original_name}",
            f"Status: {item.status}",
            "",
            "Problemas encontrados:",
            *([f"- {problem}" for problem in item.problems] or ["- Nenhum problema obrigatório encontrado"]),
            "",
            "Correções:",
            *([f"- {correction}" for correction in item.corrections] or ["- Somente validação"]),
            "",
            f"Páginas: {item.page_count}",
            f"Tamanho original: {format_bytes(item.original_bytes)}",
            f"Tamanho final: {format_bytes(item.final_bytes)}",
            f"Maior página: {format_bytes(item.largest_page_bytes)}",
            f"Páginas com OCR: {item.ocr_pages}",
            f"Páginas comprimidas: {item.compressed_pages}",
            f"Texto pesquisável: {'SIM' if item.searchable else 'NÃO'}",
            f"Fontes válidas: {'SIM' if item.fonts_valid else 'NÃO'}",
            f"Estrutura válida: {'SIM' if item.structure_valid else 'NÃO'}",
        ])
        if item.reason:
            lines.append(f"Motivo da falha: {item.reason}")
        lines.extend(["", "-" * 64, ""])
    return "\n".join(lines)


def process_job(
    job_dir: Path,
    *,
    mode: str,
    language: str,
    max_files: int,
    max_total_bytes: int,
    update: Callable[[dict], None],
    cancelled: Callable[[], bool],
) -> dict:
    started_at = time.time()
    input_dir = job_dir / "input"
    work_root = job_dir / "work"
    output_root = job_dir / "output"
    corrected_dir = output_root / "CORRIGIDOS"
    failed_dir = output_root / "NAO-CORRIGIDOS"
    extracted_dir = job_dir / "extracted"
    for folder in (work_root, corrected_dir, failed_dir, extracted_dir):
        folder.mkdir(parents=True, exist_ok=True)

    pdfs: list[Path] = []
    total_unpacked = 0
    for source in sorted(input_dir.iterdir()):
        if source.suffix.lower() == ".pdf":
            pdfs.append(source)
            total_unpacked += source.stat().st_size
        elif source.suffix.lower() == ".zip":
            target = extracted_dir / source.stem
            found = safe_extract_zip(source, target, max_files=max_files, max_total_bytes=max_total_bytes - total_unpacked)
            pdfs.extend(found)
            total_unpacked += sum(item.stat().st_size for item in found)
            # Após a extração segura, o ZIP de entrada não é mais necessário.
            source.unlink(missing_ok=True)
        if len(pdfs) > max_files:
            raise ValueError(f"O trabalho excedeu o limite de {max_files} PDFs.")
        if total_unpacked > max_total_bytes:
            raise ValueError("O trabalho excedeu o limite total descompactado.")

    if not pdfs:
        raise ValueError("Nenhum PDF foi encontrado nos arquivos enviados.")

    results: list[FileResult] = []
    update({"phase": "processing", "totalPdfs": len(pdfs), "processedPdfs": 0, "progress": 5, "message": f"{len(pdfs)} PDF(s) encontrado(s)."})

    for index, source in enumerate(pdfs, start=1):
        if cancelled():
            raise RuntimeError("PROCESSAMENTO_CANCELADO")
        name = safe_name(source.name)
        update({
            "phase": "processing",
            "currentFile": name,
            "processedPdfs": index - 1,
            "progress": 5 + int(((index - 1) / max(1, len(pdfs))) * 88),
            "message": f"Analisando {index}/{len(pdfs)}: {name}",
        })
        file_work = work_root / f"{index:04d}"
        file_work.mkdir(parents=True, exist_ok=True)
        output_path = unique_path(corrected_dir, name)
        try:
            item = correct_pdf(
                source,
                output_path,
                mode=mode,
                language=language,
                work_dir=file_work,
                progress=lambda phase, idx=index, total=len(pdfs), filename=name: update({
                    "phase": "processing",
                    "currentFile": filename,
                    "processedPdfs": idx - 1,
                    "progress": 5 + int((((idx - 1) + 0.5) / max(1, total)) * 88),
                    "message": f"{phase}: {filename}",
                }),
            )
        except Exception as exc:
            item = FileResult(
                original_name=name,
                status="FALHA",
                original_bytes=source.stat().st_size,
                reason=str(exc),
                problems=["Falha inesperada durante o processamento"],
            )
        if item.status == "FALHA":
            failed_target = unique_path(failed_dir, name)
            shutil.copy2(source, failed_target)
            item.output_relative_path = f"NAO-CORRIGIDOS/{failed_target.name}"
            output_path.unlink(missing_ok=True)
        else:
            item.output_relative_path = f"CORRIGIDOS/{output_path.name}"
        results.append(item)
        # Mantém o uso de disco previsível mesmo em lotes com centenas de PDFs.
        shutil.rmtree(file_work, ignore_errors=True)
        source.unlink(missing_ok=True)
        update({
            "phase": "processing",
            "processedPdfs": index,
            "correctedPdfs": sum(1 for r in results if r.status in {"CORRIGIDO", "VALIDADO"}),
            "failedPdfs": sum(1 for r in results if r.status == "FALHA"),
            "progress": 5 + int((index / max(1, len(pdfs))) * 88),
            "message": f"Concluído {index}/{len(pdfs)}: {name}",
        })

    finished_at = time.time()
    report = report_text(results, started_at, finished_at)
    (output_root / "RELATORIO-DE-CORRECAO.txt").write_text(report, encoding="utf-8")
    (output_root / "relatorio.json").write_text(json.dumps([asdict(item) for item in results], ensure_ascii=False, indent=2), encoding="utf-8")

    result_zip = job_dir / "RESULTADO-CORRECAO-PDFS.zip"
    update({"phase": "packaging", "progress": 95, "message": "Criando ZIP final..."})
    with zipfile.ZipFile(result_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6, allowZip64=True) as archive:
        for path in sorted(output_root.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(output_root).as_posix())

    # O download usa apenas o ZIP final. Remove cópias e intermediários para não
    # lotar o disco durante as 72 horas de retenção do resultado.
    for folder in (output_root, work_root, extracted_dir, input_dir):
        shutil.rmtree(folder, ignore_errors=True)

    summary = {
        "totalPdfs": len(results),
        "correctedPdfs": sum(1 for item in results if item.status in {"CORRIGIDO", "VALIDADO"}),
        "failedPdfs": sum(1 for item in results if item.status == "FALHA"),
        "resultBytes": result_zip.stat().st_size,
        "durationSeconds": round(finished_at - started_at, 1),
        "resultFileName": "RESULTADO-CORRECAO-PDFS.zip",
    }
    update({"phase": "done", "progress": 100, "message": "ZIP final pronto para download.", **summary})
    return summary
