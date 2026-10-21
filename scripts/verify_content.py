from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse, unquote
import re
import json
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.links=[]; self.ids=set(); self.canonicals=[]; self.data=[]; self.ignore=0; self.docs=False; self.docdata=[]
        self.feed(html)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('script','style'): self.ignore += 1
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'a' and 'href' in a: self.links.append(a['href'])
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag == 'article': self.docs=True
    def handle_endtag(self,tag):
        if tag in ('script','style'): self.ignore -= 1
        if tag == 'article': self.docs=False
    def handle_data(self,data):
        if not self.ignore:
            self.data.append(data)
            if self.docs: self.docdata.append(data)

def resolve(route):
    path = root / unquote(route).lstrip('/')
    if path.is_file(): return path
    if path.is_dir() and (path/'index.html').is_file(): return path/'index.html'
    if path.with_suffix('.html').is_file(): return path.with_suffix('.html')
    raise AssertionError(f'Missing local route: {route}')

ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
entries=ET.parse(root/'sitemap.xml').findall('s:url',ns)
routes={urlparse(e.find('s:loc',ns).text).path for e in entries}
assert len(entries)==len(routes)==36
assert all(e.find('s:lastmod',ns).text=='2026-10-19' for e in entries)
assert all(e.find('s:loc',ns).text.startswith('https://zeroupload.co/') for e in entries)
report=[]
for route in sorted(routes):
    path=resolve(route)
    html=path.read_text(encoding='utf-8')
    doc=Document(html)
    head=re.search(r'<head\b[^>]*>(.*?)</head>',html,re.S)[1]
    ad_tag='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8645479142211810" crossorigin="anonymous"></script>'
    assert head.count(ad_tag)==1,(route,'missing or duplicate standard AdSense head tag')
    assert html.count('adsbygoogle.js?client=')==1,(route,'duplicate publisher script')
    assert 'data-adsense' not in html,(route,'inert or dynamically gated publisher tag')
    assert doc.canonicals==['https://zeroupload.co'+route], (route,doc.canonicals)
    assert len(re.findall(r'<h1\b',html))==1, route
    assert not re.search(r'>\s*Advertisement\s*<|class="ad-slot"|<ins\b|unlimited\. d documents',html),route
    for href in doc.links:
        assert href not in ('','#','javascript:void(0)'),(route,href)
        url=urlparse(urljoin('https://zeroupload.co'+route,href))
        if url.netloc != 'zeroupload.co': continue
        target=resolve(url.path)
        if url.fragment:
            assert unquote(url.fragment) in Document(target.read_text(encoding='utf-8')).ids,(route,href,'missing fragment')
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',html,re.S): json.loads(block)
    if route.startswith('/tools/') or (route.startswith('/guides/') and route != '/guides'):
        count=len(re.findall(r"\b[\w]+(?:[-’][\w]+)*\b",' '.join(doc.docdata)))
        low,high=(600,900) if route.startswith('/tools/') else (1000,1400)
        assert low <= count <= high,(route,count,low,high)
        if route.startswith('/tools/'): assert len(re.findall(r'<h3\b',html))>=4,route
        else:
            assert '<table' in html and 'Troubleshooting checklist' in html and 'Reproducible fixture benchmark' in html,route
        report.append({'route':route,'words':count})
(root/'docs/content-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
assert (root/'ads.txt').read_text(encoding='utf-8').strip()=='google.com, pub-8645479142211810, DIRECT, f08c47fec0942fa0'
assert '!ads.txt' in (root/'.assetsignore').read_text(encoding='utf-8').splitlines()
print(f'PASS: {len(routes)} canonical routes, all internal links/fragments, structured data, 15 tool word counts and 13 guide word counts.')
print(f'PASS: standard async AdSense head tag on all {len(routes)} pages and public-root ads.txt explicitly included.')
