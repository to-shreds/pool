#!/usr/bin/env python3
"""Bundle the same static site as one offline HTML file, with no dependencies."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parent

def build():
    html=(ROOT/'index.html').read_text(encoding='utf-8')
    css=(ROOT/'src/style.css').read_text(encoding='utf-8')
    html,n=re.subn(r'<link rel="stylesheet" href="src/style\.css(?:\?[^\"]*)?">',lambda _: '<style>'+css+'</style>',html)
    if n!=1: raise ValueError('Expected exactly one local stylesheet in index.html')
    for name in ('physics.js','rules.js','placement.js','app.js'):
        code=(ROOT/'src'/name).read_text(encoding='utf-8').replace('</script','<\\/script')
        pattern=r'<script src="src/'+re.escape(name)+r'(?:\?[^\"]*)?"></script>'
        html,n=re.subn(pattern,lambda _: '<script>'+code+'</script>',html)
        if n!=1: raise ValueError(f'Expected exactly one script reference for {name}')
    if re.search(r'\b(?:src|href)="(?:https?:|src/)',html): raise ValueError('Unexpected external asset remains in offline bundle')
    target=ROOT/'Cue-Lab.html'
    target.write_text(html,encoding='utf-8')
    print(f'Built {target.name}: {target.stat().st_size:,} bytes')
    return target

if __name__=='__main__': build()
