const categories = new Set(['Bug Report', 'Feature Request', 'Tool Performance', 'Privacy or Security', 'DMCA or Legal', 'General Question']);
const reply = (status, body, extra = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra } });

async function contact(request, env) {
  if (request.method !== 'POST') return reply(405, { error: 'Use the contact form to submit an inquiry.' }, { Allow: 'POST' });
  const origin = new URL(request.url).origin;
  if (request.headers.get('Origin') !== origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') return reply(403, { error: 'Submit this form from ZeroUpload.' });
  if (!request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded')) return reply(415, { error: 'Unsupported form format.' });
  if (Number(request.headers.get('Content-Length')) > 16384) return reply(413, { error: 'Your message is too long.' });
  // Bound streamed bodies too; Content-Length is optional and cannot be trusted.
  const reader = request.body?.getReader();
  if (!reader) return reply(400, { error: 'Please complete the contact form.' });
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16384) { await reader.cancel(); return reply(413, { error: 'Your message is too long.' }); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const form = new URLSearchParams(new TextDecoder().decode(bytes));
  const values = Object.fromEntries(['name', 'email', 'category', 'tool', 'subject', 'message', 'website'].map(key => [key, (form.get(key) || '').trim()]));
  if (values.website) return reply(400, { error: 'Unable to submit this inquiry.' });
  if (values.name.length < 2 || values.name.length > 100 || values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !categories.has(values.category) || values.tool.length > 80 || values.subject.length < 5 || values.subject.length > 160 || values.message.length < 20 || values.message.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(Object.values(values).join(''))) return reply(400, { error: 'Check your name, email, category, subject (5–160 characters), and message (20–5,000 characters).' });
  if (!env.SUPPORT_DB) return reply(503, { error: 'Support is temporarily unavailable. Please try again later.' });
  try {
    const now = Math.floor(Date.now() / 1000);
    const window = Math.floor(now / 600);
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${window}:${ip}`));
    const key = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
    // The conditional upsert is atomic, including concurrent requests from one IP.
    const allowed = await env.SUPPORT_DB.prepare('INSERT INTO contact_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 5 RETURNING count').bind(key, (window + 1) * 600).first();
    if (!allowed) return reply(429, { error: 'Too many inquiries. Please wait ten minutes before trying again.' }, { 'Retry-After': String((window + 1) * 600 - now) });
    const id = crypto.randomUUID();
    await env.SUPPORT_DB.prepare('INSERT INTO inquiries (id, created_at, name, email, category, tool, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, now, values.name, values.email, values.category, values.tool, values.subject, values.message).run();
    if (!request.headers.get('Accept')?.includes('application/json')) return new Response(null, { status: 303, headers: { Location: '/contact?submitted=1', 'Cache-Control': 'no-store' } });
    return reply(201, { id, message: 'Inquiry saved. Keep this reference for follow-up.' });
  } catch {
    console.error(JSON.stringify({ event: 'contact_storage_failed' }));
    return reply(503, { error: 'We could not save your inquiry. Please try again later.' });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.zeroupload.co') { url.hostname = 'zeroupload.co'; return Response.redirect(url.href, 308); }
    if (url.pathname === '/api/contact') {
      try { return await contact(request, env); }
      catch { return reply(503, { error: 'Unable to process your inquiry. Please try again later.' }); }
    }
    if (url.pathname.startsWith('/api/')) return reply(404, { error: 'Endpoint not found.' });
    const response = await env.ASSETS.fetch(request);
    // Asset canonicalization defaults to temporary redirects; publish permanent aliases.
    if (response.status === 307) return new Response(null, { status: 308, headers: response.headers });
    return response;
  },
  async scheduled(controller, env) {
    const now = Math.floor(Date.now() / 1000);
    await env.SUPPORT_DB.batch([
      env.SUPPORT_DB.prepare('DELETE FROM inquiries WHERE created_at < ?').bind(now - 90 * 86400),
      env.SUPPORT_DB.prepare('DELETE FROM contact_limits WHERE expires_at < ?').bind(now)
    ]);
  }
};
