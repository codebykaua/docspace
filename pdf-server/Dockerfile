FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    libreoffice-writer \
    poppler-utils \
    qpdf \
    tesseract-ocr \
    tesseract-ocr-por \
    tesseract-ocr-eng \
    unpaper \
    pngquant \
    jbig2dec \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app

RUN mkdir -p /data/docspace-pdf-jobs
ENV PDF_CORRECTOR_DATA_DIR=/data/docspace-pdf-jobs \
    PORT=10000

EXPOSE 10000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
