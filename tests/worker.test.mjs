import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.mjs';

const fields = { name: 'Synthetic Reviewer', email: 'fixture@example.invalid', category: 'Bug Report', tool: 'Merge PDF', subject: 'Synthetic test case', message: 'A harmless local support test with enough detail.', website: '' };
function request(values = fields, headers = {}) {
  return new Request('https://zeroupload.co/api/contact', { method: 'POST', headers: { Origin: 'https://zeroupload.co', Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', ...headers }, body: new URLSearchParams(values) });
}
function database({ allowed = true, fail = false } = {}) {
  const saved = [];
  return { saved, prepare(sql) { return { bind(...values) { return { async first() { return allowed ? { count: 1 } : null; }, async run() { if (fail) throw new Error('Internal SQL connection secret'); saved.push({ sql, values }); } }; } }; } };
}

test('www redirects to canonical host, including path and query', async () => {
  const response = await worker.fetch(new Request('https://www.zeroupload.co/tools/merge?q=1'), {});
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://zeroupload.co/tools/merge?q=1');
});
test('unknown APIs are true 404s; static requests delegate to assets', async () => {
  assert.equal((await worker.fetch(new Request('https://zeroupload.co/api/unknown'), {})).status, 404);
  const response = await worker.fetch(new Request('https://zeroupload.co/tools/merge'), { ASSETS: { fetch: async () => new Response('static fixture') } });
  assert.equal(await response.text(), 'static fixture');
});
test('malformed and cross-origin requests never reach storage', async () => {
  for (const [req, status] of [
    [request(fields, { Origin: 'https://attacker.invalid' }), 403],
    [request(fields, { 'Content-Type': 'application/json' }), 415],
    [request({ ...fields, category: 'unknown' }), 400],
    [request({ ...fields, website: 'bot' }), 400],
    [request({ ...fields, subject: 'tiny' }), 400],
    [request({ ...fields, message: 'x'.repeat(5001) }), 400],
    [request({ ...fields, name: 'x'.repeat(17000) }), 413]
  ]) assert.equal((await worker.fetch(req, {})).status, status);
});
test('success follows a stored record, includes a reference, and uses bound values', async () => {
  const db = database();
  const response = await worker.fetch(request({ ...fields, message: "Quoted ' content is bound, never interpolated into SQL." }), { SUPPORT_DB: db });
  assert.equal(response.status, 201);
  const result = await response.json();
  assert.match(result.id, /^[a-f0-9-]{36}$/);
  assert.equal(db.saved.length, 1);
  assert.equal(db.saved[0].values[0], result.id);
  assert.equal(db.saved[0].values[7], "Quoted ' content is bound, never interpolated into SQL.");
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
test('rate limiting and storage failure never report success', async () => {
  const rate = await worker.fetch(request(), { SUPPORT_DB: database({ allowed: false }) });
  assert.equal(rate.status, 429);
  assert.ok(Number(rate.headers.get('Retry-After')) > 0);
  const failure = await worker.fetch(request(), { SUPPORT_DB: database({ fail: true }) });
  assert.equal(failure.status, 503);
  assert.doesNotMatch(await failure.text(), /SQL|secret/);
  assert.equal((await worker.fetch(request(), {})).status, 503);
});
test('non-JavaScript form redirects only after saving', async () => {
  const db = database();
  const response = await worker.fetch(request(fields, { Accept: 'text/html' }), { SUPPORT_DB: db });
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/contact?submitted=1');
  assert.equal(db.saved.length, 1);
});
test('scheduled maintenance removes old inquiries and expired limiter records', async () => {
  const queries = [];
  let batch;
  await worker.scheduled({}, { SUPPORT_DB: { prepare(sql) { return { bind(cutoff) { const query = { sql, cutoff }; queries.push(query); return query; } }; }, async batch(value) { batch = value; } } });
  assert.equal(batch.length, 2);
  const now = Math.floor(Date.now() / 1000);
  assert.match(queries[0].sql, /DELETE FROM inquiries/);
  assert.ok(Math.abs(queries[0].cutoff - (now - 90 * 86400)) <= 1);
  assert.match(queries[1].sql, /DELETE FROM contact_limits/);
  assert.ok(Math.abs(queries[1].cutoff - now) <= 1);
});
