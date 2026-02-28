#!/usr/bin/env python3
"""Search file names and content by keyword in a folder.

Usage:
    python search_files.py <folder> <keyword> [--max-results N]

Searches both file names and file content (for supported formats).
Outputs matching files with context snippets.

Exits with code 1 if folder not found or no keyword provided.
"""

import argparse
import os
import sys

MAX_CONTENT_PER_FILE = 3000
DEFAULT_MAX_RESULTS = 20
CONTEXT_CHARS = 100  # chars before/after match to show

TEXT_EXTENSIONS = {".txt", ".md", ".csv", ".json", ".xml", ".html", ".htm", ".log"}


def _read_text_file(filepath):
    """Read a plain text file with encoding fallback."""
    for enc in ["utf-8", "utf-8-sig", "gbk", "gb2312", "latin-1"]:
        try:
            with open(filepath, "r", encoding=enc) as f:
                return f.read(MAX_CONTENT_PER_FILE)
        except (UnicodeDecodeError, UnicodeError):
            continue
    return None


def _read_pdf(filepath):
    """Extract text from PDF."""
    try:
        import pdfplumber
        parts = []
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    parts.append(t.strip())
                if sum(len(p) for p in parts) > MAX_CONTENT_PER_FILE:
                    break
        text = "\n".join(parts)
        return text[:MAX_CONTENT_PER_FILE] if text else None
    except ImportError:
        return None
    except Exception:
        return None


def _read_docx(filepath):
    """Extract text from DOCX."""
    try:
        from docx import Document
        doc = Document(filepath)
        parts = []
        total = 0
        for para in doc.paragraphs:
            parts.append(para.text)
            total += len(para.text)
            if total > MAX_CONTENT_PER_FILE:
                break
        text = "\n".join(parts)
        return text[:MAX_CONTENT_PER_FILE] if text else None
    except ImportError:
        return None
    except Exception:
        return None


def extract_text(filepath):
    """Extract text from a file based on its extension."""
    ext = os.path.splitext(filepath)[1].lower()
    if ext in TEXT_EXTENSIONS:
        return _read_text_file(filepath)
    elif ext == ".pdf":
        return _read_pdf(filepath)
    elif ext in (".docx", ".doc"):
        return _read_docx(filepath)
    return None


def find_snippets(text, keyword, max_snippets=3):
    """Find context snippets around keyword matches."""
    text_lower = text.lower()
    keyword_lower = keyword.lower()
    snippets = []
    start = 0
    while len(snippets) < max_snippets:
        idx = text_lower.find(keyword_lower, start)
        if idx == -1:
            break
        snip_start = max(0, idx - CONTEXT_CHARS)
        snip_end = min(len(text), idx + len(keyword) + CONTEXT_CHARS)
        snippet = text[snip_start:snip_end].replace("\n", " ").strip()
        if snip_start > 0:
            snippet = "..." + snippet
        if snip_end < len(text):
            snippet = snippet + "..."
        snippets.append(snippet)
        start = idx + len(keyword)
    return snippets


def format_size(size_bytes):
    """Format file size."""
    if size_bytes < 1024:
        return f"{size_bytes}B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f}KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f}MB"


def main():
    parser = argparse.ArgumentParser(description="Search files by keyword.")
    parser.add_argument("folder", help="Folder to search in")
    parser.add_argument("keyword", help="Search keyword")
    parser.add_argument("--max-results", type=int, default=DEFAULT_MAX_RESULTS, help="Max results")
    args = parser.parse_args()

    folder = os.path.normpath(args.folder)
    keyword = args.keyword.strip()

    if not os.path.isdir(folder):
        print(f"Error: directory not found: {folder}", file=sys.stderr)
        sys.exit(1)

    # Empty keyword: list all files mode
    if not keyword:
        all_files = []
        for dirpath, _dirnames, filenames in os.walk(folder):
            for name in filenames:
                full_path = os.path.join(dirpath, name)
                rel_path = os.path.relpath(full_path, folder)
                try:
                    stat = os.stat(full_path)
                    size = stat.st_size
                except OSError:
                    size = 0
                all_files.append((rel_path, size))
        all_files.sort(key=lambda x: x[0])
        print(f"=== ALL FILES ({len(all_files)}) ===")
        for rel_path, size in all_files:
            print(f"  {rel_path} ({format_size(size)})")
        print(f"\nTotal: {len(all_files)} file(s)")
        sys.exit(0)

    keyword_lower = keyword.lower()
    name_matches = []
    content_matches = []

    for dirpath, _dirnames, filenames in os.walk(folder):
        for name in filenames:
            full_path = os.path.join(dirpath, name)
            rel_path = os.path.relpath(full_path, folder)

            # Filename match
            if keyword_lower in name.lower():
                try:
                    size = os.path.getsize(full_path)
                except OSError:
                    size = 0
                name_matches.append((rel_path, size))

            # Content match (skip very large files)
            try:
                if os.path.getsize(full_path) > 50 * 1024 * 1024:  # skip >50MB
                    continue
            except OSError:
                continue

            if len(name_matches) + len(content_matches) >= args.max_results:
                break

            text = extract_text(full_path)
            if text and keyword_lower in text.lower():
                snippets = find_snippets(text, keyword)
                if snippets:
                    content_matches.append((rel_path, snippets))

        if len(name_matches) + len(content_matches) >= args.max_results:
            break

    if not name_matches and not content_matches:
        print(f"No matches found for \"{keyword}\" in {folder}")
        sys.exit(0)

    if name_matches:
        print(f"=== FILENAME MATCHES ({len(name_matches)}) ===")
        for rel_path, size in name_matches:
            print(f"  {rel_path} ({format_size(size)})")
        print()

    if content_matches:
        print(f"=== CONTENT MATCHES ({len(content_matches)}) ===")
        for rel_path, snippets in content_matches:
            print(f"  {rel_path}:")
            for snip in snippets:
                print(f"    {snip}")
            print()

    total = len(name_matches) + len(content_matches)
    print(f"Total: {total} match(es)")


if __name__ == "__main__":
    main()
