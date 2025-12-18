"""
#!/usr/bin/env python3
"""
import os
import json
import subprocess
from pathlib import Path

# auto_consolidate.py
# Non-destructive helper script to assist manual consolidation.
# It reads dedupe.py output (or runs dedupe.py) and generates a JSON report
# plus creates stub canonical files under packages/auto_consolidation_stubs/ for reviewer editing.

ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / 'build' / 'consolidation_report'
STUBS_DIR = ROOT / 'packages' / 'auto_consolidation_stubs'

def run_dedupe():
    print('Running dedupe.py to collect candidate duplicates...')
    try:
        out = subprocess.check_output(['python3', str(ROOT / 'scripts' / 'dedupe.py')], stderr=subprocess.STDOUT, text=True)
        print(out)
        return out
    except subprocess.CalledProcessError as e:
        print('dedupe.py returned non-zero exit code, capturing output')
        print(e.output)
        return e.output

def parse_dedupe_output(text):
    # Conservative parser: looks for lines starting with 'Duplicate candidate:' and following file lines
    candidates = []
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        l = lines[i].strip()
        if l.startswith('Duplicate candidate:'):
            parts = l.split(':', 1)
            fn = parts[1].split('(')[0].strip() if len(parts) > 1 else 'unknown'
            i += 1
            files = []
            while i < len(lines) and lines[i].strip().startswith('-'):
                files.append(lines[i].strip().lstrip('- ').strip())
                i += 1
            candidates.append({'function': fn, 'occurrences': files})
        else:
            i += 1
    return candidates

def write_report(candidates):
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    fp = REPORT_DIR / 'dedupe_candidates.json'
    with fp.open('w', encoding='utf-8') as f:
        json.dump(candidates, f, indent=2)
    print(f'Wrote dedupe candidates to {fp}')

def create_stubs(candidates):
    STUBS_DIR.mkdir(parents=True, exist_ok=True)
    for c in candidates:
        name = c['function']
        safe_name = ''.join(ch if ch.isalnum() or ch=='_' else '_' for ch in name) or 'fn'
        stub_py = STUBS_DIR / f'{safe_name}.py'
        if not stub_py.exists():
            with stub_py.open('w', encoding='utf-8') as f:
                f.write('# Auto-generated consolidation stub for function: {}\n'.format(name))
                f.write('# Review occurrences:')
                for occ in c['occurrences']:
                    f.write(f'#   {occ}\n')
                f.write('\n')
                f.write('def {}(*args, **kwargs):\n'.format(safe_name))
                f.write('    """IMPLEMENTATION: merge canonical behavior from occurrences listed above."""\n')
                f.write('    raise NotImplementedError("Consolidate and implement this function based on occurrences")\n')
            print(f'Created stub {stub_py}')

def main():
    text = run_dedupe()
    candidates = parse_dedupe_output(text)
    write_report(candidates)
    create_stubs(candidates)
    print('Auto-consolidation scaffolding generated. Review build/consolidation_report and packages/auto_consolidation_stubs')

if __name__ == '__main__':
    main()