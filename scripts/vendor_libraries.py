"""Pin existing browser libraries locally so tool initialization needs no CDN requests."""
from pathlib import Path
import re
import urllib.request
import json
import hashlib

root = Path(__file__).resolve().parent.parent
files = list((root / 'tools').glob('*.html')) + list((root / 'js').glob('*.js'))
urls = set()
for path in files:
    urls.update(re.findall(r'https://(?:cdnjs.cloudflare.com|cdn.jsdelivr.net)/[^\s\'"<>]+\.js', path.read_text(encoding='utf-8')))
# Use one PDF.js version across tools and workers.
mapping = {}
manifest_path = root / 'docs/vendor-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else []
target = root / 'js/vendor'
target.mkdir(exist_ok=True)
for url in sorted(urls):
    source = url.replace('/pdf.js/2.16.105/', '/pdf.js/3.11.174/')
    name = source.split('/')[-1]
    if source in mapping.values(): continue
    destination = target / name
    if not destination.exists():
        print('Fetching ' + source, flush=True)
        with urllib.request.urlopen(source, timeout=45) as response:
            destination.write_bytes(response.read())
    mapping[url] = '/js/vendor/' + name
    entry = {'url': source, 'file': 'js/vendor/' + name, 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest()}
    manifest = [item for item in manifest if item['file'] != entry['file']]
    manifest.append(entry)
for path in files:
    text = path.read_text(encoding='utf-8')
    for url, local in mapping.items(): text = text.replace(url, local)
    path.write_text(text, encoding='utf-8')
(root / 'docs').mkdir(exist_ok=True)
manifest = list({item['file']: item for item in manifest}.values())
manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(f'Vendored {len(manifest)} pinned library resources. Their embedded licenses are retained.')
