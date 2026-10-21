"""Render reviewed Markdown as static HTML; tool interfaces stay in their existing files."""
from pathlib import Path
from html import escape, unescape
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
DATE = '2026-10-19'
ORIGIN = 'https://zeroupload.co'
TOOLS = {p.stem: re.search(r'<h1[^>]*>(.*?)</h1>', p.read_text(encoding='utf-8'), re.S)[1] for p in sorted((ROOT / 'tools').glob('*.html'))}
GUIDES = {p.stem: p.read_text(encoding='utf-8').splitlines()[0][2:] for p in sorted((ROOT / 'content/guides').glob('*.md'))}
ASSOCIATIONS = {
    'merge': ['how-to-combine-pdf-files'], 'split': ['how-to-combine-pdf-files', 'troubleshoot-corrupt-pdf-xref-tables'],
    'compress': ['how-to-compress-pdf-without-losing-quality'], 'sign': ['how-to-sign-pdf-electronically'],
    'organize': ['how-to-organize-and-reorder-pdf-pages'], 'page-numbers': ['how-to-organize-and-reorder-pdf-pages'],
    'rotate': ['how-to-organize-and-reorder-pdf-pages'], 'remove-pages': ['remove-sensitive-pages-before-sharing'],
    'protect': ['how-to-protect-pdf-with-password'], 'unlock': ['how-to-protect-pdf-with-password'],
    'pdf-to-word': ['how-to-convert-pdf-to-word-without-formatting-loss'], 'word-to-pdf': ['how-to-convert-pdf-to-word-without-formatting-loss'],
    'pdf-to-markdown': ['convert-pdf-to-markdown-for-chatgpt-ai'], 'pdf-to-images': ['choose-pdf-image-resolution'],
    'images-to-pdf': ['choose-pdf-image-resolution']
}

def inline(text):
    text = escape(text, quote=False)
    return re.sub(r'\[([^]]+)\]\(([^)]+)\)', lambda m: f'<a href="{escape(m[2], quote=True)}">{m[1]}</a>', text)

def markdown(text):
    result = []
    for block in re.split(r'\n\s*\n', text.strip()):
        if block.startswith('<table'):
            result.append('<div class="table-wrap">' + block + '</div>')
        elif block.startswith('#'):
            heading, value = block.split(' ', 1)
            level = len(heading)
            anchor = re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')
            result.append(f'<h{level} id="{anchor}">{inline(value)}</h{level}>')
        elif block.startswith('- '):
            result.append('<ul>' + ''.join('<li>' + inline(line[2:]) + '</li>' for line in block.splitlines()) + '</ul>')
        else:
            result.append('<p>' + inline(block.replace('\n', ' ')) + '</p>')
    return '\n'.join(result)

def canonical_links(html):
    def link(m):
        url = m[1]
        if not url.startswith('/') or url.startswith('//'):
            return m[0]
        url = url.replace('/guides/index.html', '/guides').replace('/guides/', '/guides/', 1)
        url = re.sub(r'\.html(?=[#?]|$)', '', url)
        url = url.replace('/index#', '/#')
        if url == '/index': url = '/'
        if url == '/guides/': url = '/guides'
        return 'href="' + url + '"'
    return re.sub(r'href="([^"]+)"', link, html)

home = (ROOT / 'index.html').read_text(encoding='utf-8')
header = re.search(r'<header\b.*?</header>', home, re.S)[0]
header = re.sub(r'<nav\b.*?</nav>', '<nav class="nav-links" id="navLinks"><a href="/#tools">Tools</a><a href="/guides">Guides</a><a href="/about">About</a><a href="/updates">Updates</a><a href="/contact">Contact</a></nav>', header, flags=re.S)
footer = '<footer><div class="cols"><div><div class="f-title">ZeroUpload</div>'
footer += ''.join(f'<a href="{url}">{title}</a>' for url, title in [('/', 'Home'), ('/about', 'About'), ('/privacy', 'Privacy & advertising choices'), ('/terms', 'Terms'), ('/contact', 'Contact support'), ('/updates', 'Engineering updates')])
footer += '</div><div><div class="f-title">All PDF tools</div>' + ''.join(f'<a href="/tools/{slug}">{title}</a>' for slug, title in TOOLS.items())
footer += '</div><div><div class="f-title">Guides library</div><a href="/guides">All educational guides</a>' + ''.join(f'<a href="/guides/{slug}">{escape(title)}</a>' for slug, title in GUIDES.items())
footer += '</div></div><div class="legal">&copy; <span id="year">2026</span> ZeroUpload. Document processing runs locally. Website advertising and submitted support messages are described in our <a href="/privacy">privacy policy</a>.</div></footer>'

def page(route, title, body, description=None, kind='WebPage'):
    description = description or title + '. Practical workflows, implementation details, and limitations from ZeroUpload.'
    schema = {'@context': 'https://schema.org', '@type': kind, 'name': title, 'url': ORIGIN + route, 'dateModified': DATE}
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{escape(title)} | ZeroUpload</title><meta name="description" content="{escape(description, quote=True)}">
<link rel="canonical" href="{ORIGIN}{route}"><meta property="og:url" content="{ORIGIN}{route}"><meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:image" content="{ORIGIN}/og-image.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/css/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8645479142211810" crossorigin="anonymous"></script>
<script type="application/ld+json">{json.dumps(schema)}</script></head>
<body>{header}<main class="wrap"><article class="panel documentation">{body}</article></main>{footer}<div id="toast" role="status"></div><script src="/js/common.js" defer></script></body></html>'''

for slug in TOOLS:
    path = ROOT / f'tools/{slug}.html'
    html = path.read_text(encoding='utf-8')
    docs = markdown((ROOT / f'content/tools/{slug}.md').read_text(encoding='utf-8'))
    docs += '<h2>Related workflows</h2><ul>' + ''.join(f'<li><a href="/guides/{guide}">{escape(GUIDES[guide])}</a></li>' for guide in ASSOCIATIONS[slug]) + '</ul>'
    docs += '<p>Reviewed October 19, 2026 against the current tool implementation. See <a href="/privacy">document and website privacy</a> and <a href="/contact">report a reproducible issue</a>.</p>'
    html, changed = re.subn(r'<(?:div|article) class="(?:info|documentation tool-documentation)".*?(?=</main>)', '<article class="documentation tool-documentation">' + docs + '</article>\n', html, flags=re.S)
    assert changed == 1, slug
    if slug == 'protect' and 'id="protectionNotice"' not in html:
        html = html.replace('<h1>Protect PDF</h1>', '<h1>Protect PDF</h1><p class="callout" id="protectionNotice">This tool uses legacy RC4 encryption and rebuilds pages as images. Choose a verified modern encryption tool for sensitive records requiring AES. Text, links, and forms are flattened.</p>')
    path.write_text(html, encoding='utf-8')

bench_path = ROOT / 'docs/benchmarks.json'
bench = json.loads(bench_path.read_text(encoding='utf-8')) if bench_path.exists() else None
bench_tools = dict(zip(GUIDES, ['remove-pages'] * len(GUIDES)))
for tool, guides in ASSOCIATIONS.items():
    for guide in guides: bench_tools[guide] = tool
bench_tools.update({'client-side-pdf-security-guide': 'merge', 'understanding-client-side-file-privacy': 'rotate', 'best-practices-for-secure-pdf-sharing': 'remove-pages', 'troubleshoot-corrupt-pdf-xref-tables': 'split', 'choose-pdf-image-resolution': 'pdf-to-images', 'how-to-protect-pdf-with-password': 'protect', 'how-to-convert-pdf-to-word-without-formatting-loss': 'pdf-to-word', 'how-to-combine-pdf-files': 'merge'})
for slug, title in GUIDES.items():
    text = (ROOT / f'content/guides/{slug}.md').read_text(encoding='utf-8')
    body = markdown(text)
    body += '<h2>Reproducible fixture benchmark</h2>'
    if bench and bench_tools[slug] in bench['tools']:
        row = bench['tools'][bench_tools[slug]]
        body += f'<div class="table-wrap"><table class="data-table"><caption>Measured development fixture, October 19, 2026</caption><thead><tr><th>Operation</th><th>Input bytes</th><th>Output bytes</th><th>Elapsed milliseconds</th></tr></thead><tbody><tr><td>{escape(bench_tools[slug])}</td><td>{row["inputBytes"]}</td><td>{row["outputBytes"]}</td><td>{row["elapsedMs"]}</td></tr></tbody></table></div>'
    body += '<p>Reproduce this check with the repository browser verification script and its synthetic three-page Letter document. The fixture contains known text markers and no confidential records. Measure from file selection and the requested action to an available output, after the page dependencies load. Compare the resulting bytes, expected page sequence, and retained features before interpreting elapsed time. The complete fixture definitions, browser version, and observed results are in the <a href="/benchmarks">benchmark report</a>. These development measurements describe a small artificial input on one Windows machine; they are not a promise for long scans, encrypted sources, mobile devices, or different browsers. Repeat the experiment with a representative nonconfidential sample and your required acceptance checks before choosing settings for a real workflow.</p>'
    related = [g for g in GUIDES if g != slug][:2]
    body += '<h2>Continue the workflow</h2><ul>' + ''.join(f'<li><a href="/guides/{g}">{escape(GUIDES[g])}</a></li>' for g in related) + '</ul><p><a href="/guides">Browse all thirteen guides</a> · <a href="/updates">Engineering maintenance notes</a></p>'
    (ROOT / f'guides/{slug}.html').write_text(page('/guides/' + slug, title, body, kind='Article'), encoding='utf-8')

hub = '<h1>PDF workflow guides</h1><p>Thirteen practical guides reviewed October 19, 2026. Start with the task you need to complete, then use the linked tool documentation to check implementation limits. The articles include comparison tables, troubleshooting checklists, and reproducible fixture benchmarks.</p><div class="guide-grid">'
for slug, title in GUIDES.items():
    source = (ROOT / f'content/guides/{slug}.md').read_text(encoding='utf-8').split('\n\n')[1]
    hub += f'<section><h2><a href="/guides/{slug}">{escape(title)}</a></h2><p>{escape(source)}</p></section>'
hub += '</div><p><a href="/#tools">Browse all fifteen PDF tools</a> · <a href="/benchmarks">Fixture benchmark methodology</a></p>'
(ROOT / 'guides/index.html').write_text(page('/guides', 'PDF workflow guides', hub, kind='CollectionPage'), encoding='utf-8')
for slug in ['privacy', 'about', 'updates']:
    body = markdown((ROOT / f'content/{slug}.md').read_text(encoding='utf-8'))
    if slug == 'privacy':
        body += '<h2>Review advertising choices</h2><button type="button" class="btn" id="privacyChoices">Privacy and cookie settings</button><p id="privacyChoiceStatus" role="status" aria-live="polite"></p>'
        body = body.replace('<h2 id="european-data-protection-rights">', '<span id="gdpr"></span><h2 id="european-data-protection-rights">').replace('<h2 id="support-submissions-and-retention">', '<span id="retention"></span><h2 id="support-submissions-and-retention">').replace('<h2 id="california-privacy-choices">', '<span id="ccpa"></span><h2 id="california-privacy-choices">')
    (ROOT / f'{slug}.html').write_text(page('/' + slug, {'privacy': 'Privacy Policy', 'about': 'About ZeroUpload', 'updates': 'Engineering updates'}[slug], body), encoding='utf-8')

if bench:
    body = '<h1>Reproducible browser fixture benchmarks</h1><p>Measured October 19, 2026. These are single-run development checks, not typical-user speed claims or universal compression guarantees.</p>'
    body += '<h2>Environment and method</h2><p>' + escape(bench['environment']) + '. Chromium ' + escape(bench['browser']) + '.</p><p>' + escape(bench['fixture']) + '. The image input is generated in a canvas. The Word and Unlock inputs come from earlier fixture conversions. Application libraries are served locally. Third-party advertising is stubbed to avoid creating test impressions.</p>'
    body += '<p>Elapsed time begins at file selection, includes preview work and the scripted action, and ends when an output becomes available. It excludes initial page loading, download transfer, and human review. The script confirms nonempty outputs, expected PDF page counts, and Markdown marker content. These are modest smoke tests; they do not establish fidelity for every source layout, strength of encryption, legal validity, accessibility, or a complete sanitization guarantee.</p>'
    body += '<div class="table-wrap"><table class="data-table"><thead><tr><th>Operation</th><th>Input</th><th>Input bytes</th><th>Output bytes</th><th>Elapsed ms</th></tr></thead><tbody>'
    for tool,row in bench['tools'].items():
        body += f'<tr><td><a href="/tools/{tool}">{TOOLS[tool]}</a></td><td>{escape(row["fixture"])}</td><td>{row["inputBytes"]}</td><td>{row["outputBytes"]}</td><td>{row["elapsedMs"]}</td></tr>'
    body += '</tbody></table></div><h2>Repeat the check</h2><p>The repository script scripts/verify_browser.cjs creates the fixture, drives the tools through a real headless browser, and records JSON results. Use a fresh local support database or clear only synthetic contact fixtures before repeating its rate-limit assertions. Preserve originals, compare actual downloaded results, and test representative nonconfidential documents on the target device before choosing settings.</p><p><a href="/guides">Read the workflow guides</a> · <a href="/updates">Engineering changes</a></p>'
    (ROOT / 'benchmarks.html').write_text(page('/benchmarks', 'Browser fixture benchmarks', body), encoding='utf-8')

(ROOT / '404.html').write_text(page('/404', 'Page not found', '<h1>Page not found</h1><p>This address does not identify a current page. Browse the <a href="/#tools">PDF tools</a>, <a href="/guides">guides</a>, or <a href="/contact">contact support</a>.</p>').replace('<head>', '<head><meta name="robots" content="noindex">'), encoding='utf-8')

for path in [*ROOT.glob('*.html'), *ROOT.glob('tools/*.html'), *ROOT.glob('guides/*.html')]:
    html = path.read_text(encoding='utf-8')
    if '<header' not in html: continue
    html = re.sub(r'<header\b.*?</header>', lambda m: header, html, flags=re.S)
    html = re.sub(r'<footer\b.*?</footer>', lambda m: footer, html, flags=re.S)
    html = html.replace('using WebAssembly and client-side JavaScript', 'using client-side JavaScript and browser APIs').replace('using WebAssembly', 'using browser APIs').replace('WebAssembly (Wasm)', 'browser APIs').replace('WebAssembly routines', 'JavaScript libraries').replace('WebAssembly in-browser memory sandboxing vs legacy remote cloud upload portals', 'local processing, website network activity, and device-level handling').replace('strong AES password protection', 'password protection and its implementation limits').replace('zero cloud uploads and zero risk', 'local document processing with clear limitations')
    html = html.replace('WebAssembly and client-side JavaScript', 'client-side JavaScript and browser APIs').replace('via WebAssembly', 'via browser APIs')
    html = html.replace('in-browser processing with WebAssembly', 'in-browser processing with JavaScript').replace('Why client-side WebAssembly processing eliminates the privacy risks of cloud document conversion.', 'How local processing changes the data flow and which privacy responsibilities remain.')
    html = html.replace('Response Commitment: Under 24 business hours.', 'Support inquiries are reviewed as availability permits; no fixed response time is guaranteed.')
    html = re.sub(r'<link rel="(?:preconnect|dns-prefetch)" href="https://(?:cdnjs.cloudflare.com|cdn.jsdelivr.net)"[^>]*>\s*', '', html)
    html = re.sub(r'<script\b[^>]*src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle\.js\?client=[^"]+"[^>]*></script>', '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8645479142211810" crossorigin="anonymous"></script>', html)
    html = html.replace('Operations execute on your CPU with 0 bytes transmitted over the network.', 'Document operations execute locally. Website hosting and advertising are separate network activities described in our privacy policy.').replace('Closing the tab purges the memory buffer instantly with zero server traces.', 'Closing the tab ends the editing session. Downloaded files remain on your device; secure memory erasure is not guaranteed.').replace('Engineered to eliminate cloud data breach risks for confidential documents.', 'Local document processing reduces conversion-server exposure. Review browser, device, and delivery controls for confidential documents.')
    html = html.replace('it will continue to work flawlessly offline.', 'it may continue to work after required dependencies have loaded. A complete offline installation is not guaranteed.')
    html = canonical_links(html)
    path.write_text(html, encoding='utf-8')

routes = ['/'] + ['/tools/' + s for s in TOOLS] + ['/guides'] + ['/guides/' + s for s in GUIDES] + ['/about', '/privacy', '/terms', '/contact', '/updates', '/benchmarks']
xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
xml += ''.join(f'  <url><loc>{ORIGIN}{route}</loc><lastmod>{DATE}</lastmod></url>\n' for route in routes) + '</urlset>\n'
ET.fromstring(xml)
(ROOT / 'sitemap.xml').write_text(xml, encoding='utf-8')
(ROOT / 'robots.txt').write_text('User-agent: Googlebot\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: https://zeroupload.co/sitemap.xml\n', encoding='utf-8')
print(f'Rendered {len(TOOLS)} tool documents, {len(GUIDES)} guides, and {len(routes)} sitemap URLs.')
