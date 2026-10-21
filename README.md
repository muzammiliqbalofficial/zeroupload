# ZeroUpload

Fifteen local PDF tools, thirteen educational guides, and a Cloudflare Worker/D1
support form. Reviewed documentation lives in `content/`; the build script
renders it into static HTML around the existing tool interfaces.

## Development and verification

Requires Node.js 22+ and Python 3. Install the pinned dependencies:

```powershell
npm ci
npx playwright install chromium
npm run build
npx wrangler d1 migrations apply SUPPORT_DB --local
npm run dev
```

In another terminal:

```powershell
npm test
npm run test:browser
npm run build
npm run check
npm run deploy:check
```

The browser suite targets `http://127.0.0.1:8787` unless `SITE_URL` is set.
Run it locally: it creates synthetic support records and exercises rate limits.
It drives all fifteen tools, checks canonical routes and legacy aliases,
crawls empty tool pages as Googlebot and Mediapartners-Google, verifies private
asset exclusion, verifies ungated static publisher loading, and captures responsive screenshots.
Third-party ad responses are stubbed to avoid test impressions; application
scripts, actual tool processing, and D1 storage are not mocked in those checks.
Separate form failure/success UI checks deliberately stub API responses.

Measurements are saved in `docs/benchmarks.json`. Rebuild after measuring to
publish updated article tables and `/benchmarks`. These synthetic smoke tests
do not certify every PDF's fidelity, accessibility, or security. Tool libraries
are pinned locally in `js/vendor/`; their original URLs, hashes, and embedded
licenses are recorded in `docs/vendor-manifest.json`. The service worker clears
obsolete caches rather than promising a complete offline installation.

## Production database and deployment

The existing Worker target is `zeroupload`, with `zeroupload.co` and
`www.zeroupload.co` custom domains. The Worker permanently redirects www to the
canonical host and serves extensionless HTML without trailing slashes. Unknown
routes return a real 404. `_headers` supplies static security headers.

Provision or identify the production support database:

```powershell
npx wrangler d1 create zeroupload-support
```

Add the returned UUID as `database_id` in the existing `[[d1_databases]]` entry
of `wrangler.toml`. Verify the target account and existing resources first.
Do not use a local ID or bind an unrelated database. The omitted ID supports
local development and automatic provisioning, but an explicit production ID
ensures migrations and deployment use the same known database.

Apply the schema and deploy through the normal release process:

```powershell
npx wrangler d1 migrations apply SUPPORT_DB --remote
npm run deploy:check
npx wrangler deploy
```

This task does not provision remote resources or deploy. After deployment,
verify all sitemap URLs, canonical redirects, robots.txt, ads.txt, and a real
contact submission. Confirm that submission in production D1. Local checks
and dry runs cannot establish that remote bindings or account settings exist.

## Support inbox and retention

The form posts bounded text fields to `/api/contact`; it never accepts PDF
attachments. Server checks cover origin, method, content type, field lengths,
email format, and an atomic limit of five accepted requests per connecting IP
per ten-minute fixed window. No raw IP is stored in inquiry rows. A reference
is returned only after an insert succeeds. Support has no guaranteed SLA.

There are no email notifications or public inbox endpoints. The operator must
review `inquiries` in the authenticated Cloudflare D1 console or with Wrangler:

```powershell
npx wrangler d1 execute SUPPORT_DB --remote --command "SELECT id, datetime(created_at, 'unixepoch') AS received, name, email, category, tool, subject, message FROM inquiries ORDER BY created_at DESC LIMIT 50"
```

Daily maintenance removes inquiries older than 90 days and expired rate-limit
keys. Provider backups and logs have separate retention. Respond to inquiries
through an approved channel and avoid requesting confidential source files.

## Advertising consent setup

Empty ad containers and ad-unit pushes are removed. Every canonical page has
exactly one standard asynchronous AdSense script directly in its static head,
using publisher ca-pub-8645479142211810. The public root contains ads.txt, and
an explicit !ads.txt rule keeps it included in the published assets.

EEA/UK consent is managed through Google AdSense's built-in Privacy & Messaging
CMP in the publisher dashboard. Publish the appropriate messages and regional
settings there. No independent external CMP bootstrap or custom JavaScript gate
is required for the publisher script to load. common.js only wires the privacy
choices button to Google's revocation entrypoint when available; it does not
inject, remove, or block the static publisher script. The privacy page also
links to Google Ads Settings and industry opt-out controls.

References used for this revision:

- [Required AdSense privacy content](https://support.google.com/adsense/answer/1348695?hl=en)
- [AdSense cookies](https://support.google.com/adsense/answer/7549925?hl=en)
- [Certified CMP requirements](https://support.google.com/adsense/answer/16918505?hl=en)
- [TCF integration guidance](https://support.google.com/adsense/answer/9999955?hl=en)
- [Cloudflare static assets](https://developers.cloudflare.com/workers/static-assets/binding/)

Production database provisioning/migration, the publisher CMP, operator inbox
review, and post-deployment checks remain release requirements. Code and content
cannot guarantee AdSense approval, search indexing, or compliance for every
organization's workflow. Request recrawling and AdSense review after release.
