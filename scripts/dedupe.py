#!/usr/bin/env python3
"""
Conservative duplicate-function detector.
Scans .py, .ts, .js files for function def signatures and hashes the body to detect probable duplicates.

This script prints candidate duplicates and does not delete anything.
Manual review required.
"""
import hashlib
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(__file__))

PATTERNS = {
    "python": re.compile(r"^def\s+([a-zA-Z0-9_]+)\s*\(.*\):"),
    "ts_fn": re.compile(r"^export\s+function\s+([a-zA-Z0-9_]+)\s*\("),
    "ts_const_fn": re.compile(r"^const\s+([a-zA-Z0-9_]+)\s*=\s*\("),
    "js_fn": re.compile(r"^function\s+([a-zA-Z0-9_]+)\s*\("),
}

def file_lines(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.readlines()

def hash_block(lines):
    h = hashlib.sha256()
    for l in lines:
        h.update(l.encode("utf-8"))
    return h.hexdigest()

def scan_file(path):
    ext = os.path.splitext(path)[1].lower()
    lines = file_lines(path)
    results = []
    i = 0
    while i < len(lines):
        line = lines[i]
        m = None
        if ext == ".py":
            m = PATTERNS["python"].match(line.strip())
        elif ext in (".ts", ".js", ".tsx", ".jsx"):
            m = PATTERNS["ts_fn"].match(line.strip()) or PATTERNS["ts_const_fn"].match(line.strip()) or PATTERNS["js_fn"].match(line.strip())
        if m:
            name = m.group(1)
            # gather block: naive - until next blank line or next def/function
            block = [line]
            j = i + 1
            while j < len(lines):
                nxt = lines[j]
                if ext == ".py":
                    if re.match(r"^def\s+|^class\s+", nxt.strip()):
                        break
                else:
                    if re.match(r"^(export\s+)?function\s+|^const\s+.*=\s*\(|^class\s+", nxt.strip()):
                        break
                block.append(nxt)
                j += 1
            results.append((name, hash_block(block), i+1, j, path))
            i = j
        else:
            i += 1
    return results

def main():
    candidates = defaultdict(list)
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # skip .git and node_modules and venv
        if any(skip in dirpath for skip in [os.sep + ".git", os.sep + "node_modules", os.sep + "venv", os.sep + "__pycache__"]):
            continue
        for fn in filenames:
            if fn.endswith((".py", ".ts", ".js", ".tsx", ".jsx")):
                p = os.path.join(dirpath, fn)
                for name, h, start, end, path in scan_file(p):
                    key = (name, h)
                    candidates[key].append((path, start, end))
    # print duplicates
    dup_count = 0
    for (name, h), occurrences in candidates.items():
        if len(occurrences) > 1:
            dup_count += 1
            print(f"Duplicate candidate: {name} (hash {h}) found in:")
            for path, start, end in occurrences:
                print(f"  - {path}:{start}-{end}")
            print()
    if dup_count == 0:
        print("No obvious duplicates found by conservative scan.")
    else:
        print(f"Found {dup_count} candidate duplicated functions. Review manually before merging.")

if __name__ == "__main__":
    main()
