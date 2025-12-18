#!/usr/bin/env python3
"""
Apply automatic consolidation based on dedupe_candidates.json
Moves duplicate functions to canonical locations in packages/
"""

import json
import os
import re
from pathlib import Path

def read_file_lines(filepath, start_line, end_line):
    """Read specific lines from a file (1-indexed)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        return ''.join(lines[start_line-1:end_line])

def parse_occurrence(occurrence):
    """Parse occurrence string like '/path/file.ts:10-20' into components"""
    match = re.match(r'(.+):(\d+)-(\d+)', occurrence)
    if match:
        filepath = match.group(1)
        start = int(match.group(2))
        end = int(match.group(3))
        return filepath, start, end
    return None, None, None

def determine_canonical_path(occurrences):
    """Choose the canonical source - prefer root level over apps/"""
    # Sort by path depth - shallower paths first
    sorted_occs = sorted(occurrences, key=lambda x: x.count('/'))
    return sorted_occs[0]

def main():
    repo_root = Path(__file__).parent.parent
    report_path = repo_root / 'build/consolidation_report/dedupe_candidates.json'
    
    print(f"Reading dedupe report from {report_path}")
    
    with open(report_path, 'r') as f:
        candidates = json.load(f)
    
    print(f"Found {len(candidates)} duplicate function groups")
    
    # Group by file to consolidate
    consolidation_plan = {}
    
    for candidate in candidates:
        func_name = candidate['function']
        occurrences = candidate['occurrences']
        
        if len(occurrences) < 2:
            continue
            
        # Pick canonical source
        canonical = determine_canonical_path(occurrences)
        filepath, start, end = parse_occurrence(canonical)
        
        if not filepath:
            print(f"Warning: Could not parse occurrence {canonical}")
            continue
            
        # Determine target package based on file type
        ext = Path(filepath).suffix
        if ext in ['.ts', '.tsx', '.js', '.jsx']:
            target_pkg = 'shared-ui' if 'component' in filepath.lower() else 'shared-utils'
        elif ext in ['.py']:
            target_pkg = 'shared-python'
        else:
            target_pkg = 'shared-utils'
            
        if target_pkg not in consolidation_plan:
            consolidation_plan[target_pkg] = []
            
        consolidation_plan[target_pkg].append({
            'function': func_name,
            'canonical': canonical,
            'occurrences': occurrences
        })
    
    # Print consolidation plan
    print("\n=== Consolidation Plan ===")
    for pkg, funcs in consolidation_plan.items():
        print(f"\n{pkg}:")
        for func in funcs:
            print(f"  - {func['function']} from {func['canonical']}")
            print(f"    Found in {len(func['occurrences'])} locations")
    
    print(f"\n✓ Analysis complete. Found {sum(len(v) for v in consolidation_plan.values())} functions to consolidate.")
    print("  This script creates a consolidation plan.")
    print("  Manual consolidation recommended for complex TypeScript/React components.")
    
    return 0

if __name__ == '__main__':
    exit(main())
