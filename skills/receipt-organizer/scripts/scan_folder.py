#!/usr/bin/env python3
"""Scan a folder for receipt files (images and PDFs).

Usage:
    python scan_folder.py <folder_path>
    python scan_folder.py --pick          # open folder picker first, then scan

Copies receipt files to a temp working directory to avoid path issues
(CJK characters, cloud file systems, long paths).

Output format:
    FOLDER:<original_folder_path>
    WORKDIR:<temp_working_directory>
    <temp_file_path>|<original_filename>
    <temp_file_path>|<original_filename>
    ...

Exits with code 1 if no files found or cancelled.
"""

import argparse
import os
import shutil
import sys
import tempfile


RECEIPT_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp", ".pdf",
}


def pick_folder(title="请选择票据所在文件夹"):
    """Open a native folder selection dialog. Returns path or None."""
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)
        folder = filedialog.askdirectory(title=title)
        root.destroy()
        return folder if folder else None
    except Exception:
        return None


def scan(folder):
    """Return sorted list of receipt files in folder."""
    if not os.path.isdir(folder):
        print(f"Error: directory not found: {folder}", file=sys.stderr)
        sys.exit(1)

    files = []
    for name in os.listdir(folder):
        full_path = os.path.join(folder, name)
        if os.path.isfile(full_path):
            ext = os.path.splitext(name)[1].lower()
            if ext in RECEIPT_EXTENSIONS:
                files.append(full_path)

    files.sort()
    return files


def _ascii_safe_temp_dir():
    """Create a temp directory whose path contains only ASCII characters.

    On Windows, %TEMP% is under the user profile (e.g. C:\\Users\\...),
    which may contain CJK characters that some tools cannot handle.
    In that case, fall back to <SystemDrive>\\receipts_temp\\.
    """
    work_dir = tempfile.mkdtemp(prefix="receipts_")
    try:
        work_dir.encode("ascii")
        return work_dir  # path is ASCII-safe
    except UnicodeEncodeError:
        shutil.rmtree(work_dir, ignore_errors=True)
        if sys.platform == "win32":
            drive = os.path.splitdrive(work_dir)[0]  # e.g. "C:"
            base = os.path.join(drive + os.sep, "receipts_temp")
            os.makedirs(base, exist_ok=True)
            return tempfile.mkdtemp(prefix="receipts_", dir=base)
        return tempfile.mkdtemp(prefix="receipts_")


def copy_to_work_dir(files):
    """Copy receipt files to a temp directory with simple sequential names.

    Returns (work_dir, list of (temp_path, original_basename)).
    """
    work_dir = _ascii_safe_temp_dir()
    result = []
    for i, src in enumerate(files, start=1):
        ext = os.path.splitext(src)[1].lower()
        new_name = f"receipt_{i:03d}{ext}"
        dest = os.path.join(work_dir, new_name)
        shutil.copy2(src, dest)
        result.append((dest, os.path.basename(src)))
    return work_dir, result


def main():
    parser = argparse.ArgumentParser(description="Scan folder for receipt files.")
    parser.add_argument("folder", nargs="?", default=None, help="Folder path to scan")
    parser.add_argument("--pick", action="store_true", help="Open folder picker dialog first")
    args = parser.parse_args()

    folder = args.folder
    if folder:
        folder = os.path.normpath(folder)

    if args.pick or not folder:
        picked = pick_folder()
        if not picked:
            print("CANCELLED", file=sys.stderr)
            sys.exit(1)
        folder = picked

    # Normalize path: fix forward slashes from tkinter and remove double separators
    folder = os.path.normpath(folder)

    files = scan(folder)

    if not files:
        print(f"No receipt files found in: {folder}", file=sys.stderr)
        sys.exit(1)

    # Copy files to temp working directory to avoid path access issues
    work_dir, copied = copy_to_work_dir(files)

    print(f"FOLDER:{folder}")
    print(f"WORKDIR:{work_dir}")
    for temp_path, orig_name in copied:
        print(f"{temp_path}|{orig_name}")


if __name__ == "__main__":
    main()
