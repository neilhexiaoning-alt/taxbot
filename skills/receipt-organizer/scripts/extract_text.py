#!/usr/bin/env python3
"""Extract text content from receipt files (PDFs and images) in a directory.

Usage:
    python extract_text.py <directory>

For each file in the directory, attempts text extraction:
  - PDF files: extracted via pdfplumber / PyPDF2 / pymupdf (tries in order)
  - Image files: marked as needing manual review (no OCR)

Output format (one block per file):
    ======== receipt_001.pdf ========
    <extracted text or status message>

Exits with code 1 if directory not found or no files.
"""

import os
import sys

MAX_TEXT_PER_FILE = 3000  # chars per file, to avoid huge output

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"}


def _try_pdfplumber(filepath):
    try:
        import pdfplumber
        parts = []
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    parts.append(t.strip())
        return "\n".join(parts) if parts else None
    except ImportError:
        return None
    except Exception as e:
        return f"[pdfplumber error: {e}]"


def _try_pypdf2(filepath):
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(filepath)
        parts = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                parts.append(t.strip())
        return "\n".join(parts) if parts else None
    except ImportError:
        return None
    except Exception as e:
        return f"[PyPDF2 error: {e}]"


def _try_pymupdf(filepath):
    try:
        import fitz
        doc = fitz.open(filepath)
        parts = []
        for page in doc:
            t = page.get_text()
            if t:
                parts.append(t.strip())
        return "\n".join(parts) if parts else None
    except ImportError:
        return None
    except Exception as e:
        return f"[pymupdf error: {e}]"


def extract_pdf(filepath):
    """Try to extract text from a PDF using available libraries."""
    for fn in [_try_pdfplumber, _try_pypdf2, _try_pymupdf]:
        result = fn(filepath)
        if result is not None:
            return result
    return None  # no library available


def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_text.py <directory>", file=sys.stderr)
        sys.exit(1)

    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"Error: not a directory: {directory}", file=sys.stderr)
        sys.exit(1)

    files = sorted(f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f)))
    if not files:
        print("No files found in directory.", file=sys.stderr)
        sys.exit(1)

    no_pdf_lib = False

    for name in files:
        filepath = os.path.join(directory, name)
        ext = os.path.splitext(name)[1].lower()

        print(f"======== {name} ========")

        if ext == ".pdf":
            text = extract_pdf(filepath)
            if text is None:
                no_pdf_lib = True
                print("[no-pdf-library]")
            elif text.startswith("["):
                # error message
                print(text)
            else:
                if len(text) > MAX_TEXT_PER_FILE:
                    text = text[:MAX_TEXT_PER_FILE] + "\n...(truncated)"
                print(text)
        elif ext in IMAGE_EXTENSIONS:
            print("[image-file]")
        else:
            print("[unsupported-format]")

        print()

    if no_pdf_lib:
        print("WARNING: no PDF library found. Install one: pip install pdfplumber", file=sys.stderr)


if __name__ == "__main__":
    main()
