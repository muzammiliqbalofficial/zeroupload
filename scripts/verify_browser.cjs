const { chromium } = require('@playwright/test');
const { PDFDocument, StandardFonts, rgb, degrees } = require('pdf-lib');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.env.SITE_URL || 'http://127.0.0.1:8787';

async function fixture() {
  const pdf = await PDFDocument.create();
  pdf.setCreationDate(new Date('2026-10-19T00:00:00Z'));
  pdf.setModificationDate(new Date('2026-10-19T00:00:00Z'));
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let n = 1; n <= 3; n++) {
    const page = pdf.addPage([612, 792]);
    page.drawText(`Fixture page ${n} - Local review marker`, { x: 50, y: 730, size: 22, font });
    for (let line = 0; line < 20; line++) page.drawText(`Row ${line + 1}: Synthetic public example, amount 123.45, unit USD.`, { x: 50, y: 690 - line * 22, size: 11, font, color: rgb(0, 0, 0) });
  }
  return Buffer.from(await pdf.save());
}

(async () => {
  await fs.mkdir('artifacts', { recursive: true });
  await fs.mkdir('docs', { recursive: true });
  const buffer = await fixture();
  const pdfFile = { name: 'fixture.pdf', mimeType: 'application/pdf', buffer };
  const routes = [...(await fs.readFile('sitemap.xml', 'utf8')).matchAll(/<loc>https:\/\/zeroupload.co([^<]*)<\/loc>/g)].map(m => m[1]);
  const tools = (await fs.readdir('tools')).filter(s => s.endsWith('.html')).map(s => s.replace('.html', ''));
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    // The third-party ad service is outside the local app; don't create ad impressions during verification.
    let publisherRequests = 0;
    await context.route('https://pagead2.googlesyndication.com/**', route => { publisherRequests++; return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
    page.on('requestfailed', request => failures.push(request.url() + ': ' + request.failure().errorText));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failures.push(response.status() + ' ' + response.url()); });
    for (const route of routes) {
      // Benchmark HTML is generated after collecting the initial measurements.
      if (route === '/benchmarks' && !(await fs.stat('benchmarks.html').catch(() => null))) continue;
      const previousRequests = publisherRequests;
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.waitForLoadState('load');
      assert.equal(publisherRequests - previousRequests, 1, route + ': publisher script must load once without an external CMP');
      assert.equal(await page.locator('h1').count(), 1, route);
      if (route.startsWith('/tools/')) assert.equal(await page.locator('#toast').innerText(), '', route);
    }
    assert.deepEqual(failures, [], 'Application errors during empty-page crawl');
    for (const ua of ['Googlebot', 'Mediapartners-Google']) {
      const crawler = await browser.newContext({ userAgent: ua });
      await crawler.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
      const tab = await crawler.newPage();
      const errors = [];
      tab.on('pageerror', error => errors.push(error.message));
      tab.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      tab.on('requestfailed', request => errors.push(request.url()));
      for (const tool of tools) {
        assert.equal((await tab.goto(base + '/tools/' + tool)).status(), 200);
        assert.equal(await tab.locator('#toast').innerText(), '');
      }
      assert.deepEqual(errors, [], ua);
      await crawler.close();
    }
    console.log('PASS: canonical route crawl and both crawler agents on all 15 empty tool pages.');
    const benchmark = { date: '2026-10-19', browser: browser.version(), environment: 'Windows, headless Chromium, local Wrangler Worker; single run after dependencies loaded', fixture: 'Three Letter pages; each has a heading and 20 synthetic text lines; timestamps fixed', tools: {} };
    let docxBuffer, protectedBuffer;
    const order = tools.filter(s => !['word-to-pdf', 'unlock'].includes(s)).concat(['word-to-pdf', 'unlock']);
    for (const tool of order) {
      await page.goto(base + '/tools/' + tool);
      let input = pdfFile;
      if (tool === 'rotate') {
        const rotated = await PDFDocument.load(buffer);
        rotated.getPage(0).setRotation(degrees(90));
        input = { ...pdfFile, buffer: Buffer.from(await rotated.save()) };
      }
      if (tool === 'word-to-pdf') input = { name: 'fixture.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: docxBuffer };
      if (tool === 'unlock') input = { name: 'fixture-protected.pdf', mimeType: 'application/pdf', buffer: protectedBuffer };
      if (tool === 'images-to-pdf') {
        const data = await page.evaluate(() => {
          const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 400;
          const ctx = canvas.getContext('2d'); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 600, 400); ctx.fillStyle = 'black'; ctx.font = '24px Arial'; ctx.fillText('Synthetic image fixture', 40, 100);
          return canvas.toDataURL('image/png').split(',')[1];
        });
        input = { name: 'fixture.png', mimeType: 'image/png', buffer: Buffer.from(data, 'base64') };
      }
      const start = performance.now();
      await page.locator('#fileInput').setInputFiles(tool === 'merge' ? [pdfFile, { ...pdfFile, name: 'fixture-second.pdf' }] : input);
      if (tool === 'protect' || tool === 'unlock') await page.locator('#pwdInput').fill('Synthetic-test-password-2026');
      if (tool === 'remove-pages') await page.locator('#removeList').fill('2,2,2');
      if (tool === 'rotate') {
        await page.waitForSelector('#thumbGrid .thumb-item');
      }
      if (tool === 'sign') {
        await page.waitForFunction(() => !document.getElementById('signStudio').classList.contains('hide'));
        await page.evaluate(() => { const canvas = document.getElementById('stampCanvas'); const ctx = canvas.getContext('2d'); ctx.fillStyle = 'black'; ctx.font = '24px Arial'; ctx.fillText('Synthetic mark', 10, 50); });
      }
      if (tool === 'organize') await page.waitForFunction(() => document.querySelectorAll('.page-card').length > 0 || !document.getElementById('organizeStudio').classList.contains('hide'));
      if (tool === 'page-numbers') await page.waitForFunction(() => !document.getElementById('numberStudio').classList.contains('hide'));
      if (tool !== 'pdf-to-markdown') await page.locator('#runBtn').click();
      await page.waitForFunction((markdown) => {
        const output = document.getElementById(markdown ? 'mdStudio' : 'result');
        return output && !output.classList.contains('hide');
      }, tool === 'pdf-to-markdown', { timeout: 30000 }).catch(async error => { throw new Error(tool + ': ' + await page.locator('#toast').innerText() + ' / ' + error.message); });
      const elapsedMs = Math.round(performance.now() - start);
      const downloadPromise = page.waitForEvent('download');
      await page.locator(tool === 'pdf-to-markdown' ? '#dlMdBtn' : '#dlBtn').click();
      const download = await downloadPromise;
      const destination = path.join('artifacts', tool + path.extname(download.suggestedFilename()));
      await download.saveAs(destination);
      const out = await fs.readFile(destination);
      assert.ok(out.length > 0, tool);
      if (tool === 'protect') protectedBuffer = out;
      if (tool === 'pdf-to-word') docxBuffer = out;
      if (destination.endsWith('.pdf') && tool !== 'protect') {
        const result = await PDFDocument.load(out);
        const expected = tool === 'merge' ? 6 : tool === 'remove-pages' ? 2 : tool === 'images-to-pdf' ? 1 : tool === 'word-to-pdf' ? null : 3;
        if (expected) assert.equal(result.getPageCount(), expected, tool);
        assert.ok(result.getPageCount() > 0);
        if (tool === 'rotate') assert.deepEqual(result.getPages().map(p => p.getRotation().angle), [180, 90, 90]);
      }
      if (tool === 'pdf-to-markdown') {
        assert.match(out.toString(), /Local review marker/);
        assert.match(await page.locator('#mdPreviewOutput').innerText(), /Local review marker/);
      }
      benchmark.tools[tool] = { inputBytes: tool === 'merge' ? buffer.length * 2 : input.buffer.length, outputBytes: out.length, elapsedMs, fixture: tool === 'images-to-pdf' ? 'One generated 600 × 400 PNG' : tool === 'word-to-pdf' ? 'DOCX generated by PDF-to-Word fixture run' : tool === 'unlock' ? 'PDF generated by Protect fixture run, known password' : 'Synthetic three-page PDF' };
      console.log('PASS:', tool, out.length, 'bytes,', elapsedMs, 'ms');
    }
    assert.deepEqual(failures, [], 'Application errors during file processing');
    await fs.writeFile('docs/benchmarks.json', JSON.stringify(benchmark, null, 2));
    // All expected error responses below use APIRequestContext so the browser console remains meaningful.
    const api = context.request;
    const ads = await api.get(base + '/ads.txt');
    assert.equal(ads.status(), 200);
    assert.match(ads.headers()['content-type'], /^text\/plain\b/);
    assert.equal((await ads.text()).trim(), 'google.com, pub-8645479142211810, DIRECT, f08c47fec0942fa0');
    for (const privatePath of ['/worker.mjs', '/wrangler.toml', '/package.json', '/package-lock.json', '/.git/config', '/.dev.vars', '/content/privacy.md', '/scripts/build_content.py', '/docs/benchmarks.json', '/node_modules/wrangler/package.json']) assert.equal((await api.get(base + privatePath)).status(), 404, privatePath);
    for (const route of routes) {
      if (route === '/') continue;
      const alias = route === '/guides' ? '/guides/index.html' : route + '.html';
      const response = await api.get(base + alias, { maxRedirects: 0 });
      assert.ok([301, 308].includes(response.status()), alias + ': ' + response.status());
      assert.equal(new URL(response.headers().location, base).pathname, route);
    }
    assert.equal((await api.get(base + '/not-a-real-page')).status(), 404);
    assert.equal((await api.get(base + '/api/contact')).status(), 405);
    const fields = { name: 'Fixture Reviewer', email: 'fixture@example.invalid', category: 'Bug Report', tool: 'Merge PDF', subject: 'Synthetic contact fixture', message: 'This is a synthetic local verification inquiry. No email delivery is requested.', website: '' };
    assert.equal((await api.post(base + '/api/contact', { form: fields, headers: { Origin: 'https://unrelated.invalid', Accept: 'application/json' } })).status(), 403);
    assert.equal((await api.post(base + '/api/contact', { form: { ...fields, message: 'short' }, headers: { Origin: base, Accept: 'application/json' } })).status(), 400);
    assert.equal((await api.post(base + '/api/contact', { data: 'x'.repeat(17000), headers: { Origin: base, 'Content-Type': 'application/x-www-form-urlencoded' } })).status(), 413);
    const testIp = '198.18.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
    const replies = await Promise.all(Array.from({ length: 8 }, () => api.post(base + '/api/contact', { form: fields, headers: { Origin: base, Accept: 'application/json', 'CF-Connecting-IP': testIp } })));
    assert.equal(replies.filter(r => r.status() === 201).length, 5);
    assert.equal(replies.filter(r => r.status() === 429).length, 3);
    for (const response of replies.filter(r => r.status() === 201)) assert.match((await response.json()).id, /^[0-9a-f-]{36}$/);
    await page.goto(base + '/contact');
    await page.locator('#userName').fill(fields.name);
    await page.locator('#userEmail').fill(fields.email);
    await page.locator('#subjectText').fill(fields.subject);
    await page.locator('#messageBody').fill(fields.message);
    await page.route('**/api/contact', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"storage unavailable"}' }));
    await page.locator('#submitBtn').click();
    await page.waitForFunction(() => document.getElementById('formStatus').textContent.includes('not saved'));
    assert.equal(await page.locator('#messageBody').inputValue(), fields.message);
    assert.equal(await page.locator('#submitBtn').isDisabled(), false);
    await page.unroute('**/api/contact');
    await page.route('**/api/contact', route => route.fulfill({ status: 201, contentType: 'application/json', body: '{"id":"synthetic-ui-reference"}' }));
    await page.locator('#submitBtn').click();
    await page.waitForFunction(() => document.getElementById('formStatus').textContent.includes('synthetic-ui-reference'));
    console.log('PASS: API origin, method, validation, size limit, concurrent rate limit, saved references, and form failure/success UI.');
    // Google manages consent; common.js must not gate or duplicate the static publisher script.
    for (const decision of ['absent', 'denied', 'allowed', 'gpc']) {
      const consent = await browser.newContext();
      let adRequests = 0;
      await consent.route('https://pagead2.googlesyndication.com/**', route => { adRequests++; return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); });
      await consent.addInitScript(mode => {
        if (mode === 'gpc') Object.defineProperty(navigator, 'globalPrivacyControl', { value: true });
        if (mode !== 'absent') window.__tcfapi = function (command, version, callback) { callback({ eventStatus: 'tcloaded', purpose: { consents: { 1: mode !== 'denied', 3: true, 4: true } }, vendor: { consents: { 755: true } } }, true); };
      }, decision);
      const tab = await consent.newPage();
      await tab.goto(base + '/privacy');
      await tab.waitForLoadState('load');
      assert.equal(adRequests, 1, decision);
      await consent.close();
    }
    await page.goto(base + '/tools/merge');
    await page.locator('#fileInput').setInputFiles([pdfFile, { ...pdfFile, name: 'second.pdf' }]);
    await page.getByRole('button', { name: 'Move second.pdf earlier' }).click();
    assert.deepEqual(await page.locator('.f-name').allTextContents(), ['second.pdf', 'fixture.pdf']);
    assert.deepEqual(await page.evaluate(() => Array.from(document.getElementById('fileInput').files, f => f.name)), ['second.pdf', 'fixture.pdf']);
    console.log('PASS: legacy URL redirects, private asset exclusion, public ads.txt, ungated publisher loading with/without an external CMP, and actual input reordering.');
    await page.goto(base + '/tools/pdf-to-markdown');
    const malicious = await PDFDocument.create();
    malicious.addPage([612, 792]).drawText('<img src=x onerror=window.documentMarker=1>');
    await page.locator('#fileInput').setInputFiles({ name: 'untrusted.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await malicious.save()) });
    await page.waitForFunction(() => !document.getElementById('mdStudio').classList.contains('hide'));
    assert.match(await page.locator('#mdPreviewOutput').innerText(), /<img src=x/);
    assert.equal(await page.locator('#mdPreviewOutput img').count(), 0);
    assert.equal(await page.evaluate(() => window.documentMarker), undefined);
    await page.goto(base + '/tools/word-to-pdf');
    let documentRequests = 0;
    await page.route('https://document-resource.invalid/**', route => { documentRequests++; return route.fulfill({ status: 200, body: '' }); });
    await page.evaluate(() => { mammoth.convertToHtml = async () => ({ value: '<p>Synthetic safe paragraph</p><img src="https://document-resource.invalid/leak" onerror="window.documentMarker=1"><script>window.documentMarker=2</script>' }); });
    await page.locator('#fileInput').setInputFiles({ name: 'untrusted.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: docxBuffer });
    await page.locator('#runBtn').click();
    await page.waitForFunction(() => !document.getElementById('result').classList.contains('hide'));
    assert.equal(documentRequests, 0);
    assert.equal(await page.evaluate(() => window.documentMarker), undefined);
    console.log('PASS: extracted markup remains inert and converted DOCX HTML cannot request remote images or execute scripts.');
    await page.goto(base + '/tools/compress');
    await page.screenshot({ path: 'artifacts/compress-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/guides/choose-pdf-image-resolution');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'mobile overflow');
    await page.screenshot({ path: 'artifacts/guide-mobile.png', fullPage: true });
    await page.screenshot({ path: 'artifacts/guide-mobile-viewport.png' });
    console.log('PASS: mobile overflow check and desktop/mobile screenshots saved.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
