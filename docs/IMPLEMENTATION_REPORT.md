# ZeroUpload maintenance verification — October 19, 2026

Implementation and local verification are complete. No remote deployment, production database migration, Search Console submission, or AdSense account change was performed.

## Delivered

- Fifteen tool documents: 687–739 words each, five tool-specific questions each, and implementation-accurate architecture and usage instructions.
- Thirteen guides: 1070–1130 words each, comparison tables, troubleshooting checklists, workflow links, and measured synthetic-fixture benchmarks.
- Thirty-six canonical sitemap URLs with lastmod 2026-10-19, explicit Googlebot and Mediapartners-Google rules, permanent canonical aliases, linked trust pages, and a genuine missing-page response.
- Revised document/website privacy distinctions, DART/DoubleClick advertising disclosure, opt-out links, and GDPR and CCPA rights. The standard asynchronous AdSense script loads directly from every static page head; Google AdSense's built-in Privacy & Messaging CMP handles consent through the publisher dashboard. No custom external-CMP gate remains.
- Worker/D1 contact submissions with bounded input, server validation, origin checks, parameterized SQL, atomic rate limits, saved references, and scheduled retention cleanup.
- Removed empty ad units. Fixed unsafe text/HTML rendering, blocked DOCX-triggered external image requests, corrected cumulative/all-page rotation, deduplicated page ranges, and enabled real merge file reordering.
- Engineering notes dated from verified repository history and this maintenance revision. No invented historical releases or universal performance claims.

## Verification results

- Static content/build: 36 canonical routes; every internal link and fragment; parseable structured data; all requested word-count ranges.
- Browser HTTP crawl: all 36 canonical URLs return 200. Legacy .html and guides/index aliases redirect permanently. Unknown routes and private source/dependency files return 404.
- Crawler smoke checks: Googlebot and Mediapartners-Google load all fifteen tools without a selected file and without application console errors, failed application requests, or visible error toasts.
- Actual browser fixture processing: all fifteen tools generate nonempty downloads. Expected PDF page counts, cumulative rotation, duplicate page removal, and Markdown marker content are checked.
- Contact integration: valid inserts return references; local D1 records were independently counted. Invalid origin, malformed fields, oversized requests, concurrent fixed-window rate limiting, and honest form error/success behavior pass.
- Seven Worker unit tests pass, covering routing, bound storage, errors, non-JavaScript redirect behavior, and retention boundaries.
- Advertising tests: every canonical page requests its static publisher script once without an external CMP. Custom JavaScript does not block or duplicate it under absent, denied, or allowed external-CMP signals or GPC. Public-root ads.txt returns 200 with the exact publisher record. The third-party ad response is stubbed; this does not validate a live publisher account or consent messages.
- Security fixtures: extracted markup stays text; converted DOCX HTML cannot execute scripts or request remote images.
- Responsive QA: desktop and mobile screenshots inspected; no mobile page overflow. Benchmarks describe a single local Chromium run and synthetic inputs, not production performance or universal fidelity.
- Wrangler deployment dry run and git diff whitespace check pass. No production credentials or remote data were used.

## Production release requirements

1. Create or identify the intended production D1 database, set its verified database_id in wrangler.toml, and apply migrations/0001_support.sql remotely before routing production contact traffic to the Worker.
2. Configure and publish EEA/UK consent messages through Google AdSense's built-in Privacy & Messaging CMP in the publisher dashboard. The standard static publisher script loads without an external CMP or a custom loading gate. Dashboard configuration and live Google consent behavior are not validated by local tests.
3. Establish operator review of the authenticated D1 support inbox. Storage is implemented; email notifications and response-time promises are intentionally absent.
4. Deploy, verify the public endpoints and a real saved inquiry, then request recrawling/AdSense review. Index inclusion and AdSense approval remain Google's decisions.

README.md contains exact setup and release commands. The existing Protect PDF implementation uses legacy RC4 encryption and raster output; this limitation is disclosed visibly and in the documentation. A full dependency-security upgrade and legal certification were outside this revision.

## Complete changed and added file inventory

The workspace already contained changes to .gitignore and an untracked wrangler.toml when work began. Those files were preserved and extended for this implementation. The list below includes them. Generated local artifacts and node_modules are ignored and excluded from public assets.

- [.assetsignore](<C:/Users/Hp/Documents/Default Project/.assetsignore>)
- [.gitignore](<C:/Users/Hp/Documents/Default Project/.gitignore>)
- [404.html](<C:/Users/Hp/Documents/Default Project/404.html>)
- [README.md](<C:/Users/Hp/Documents/Default Project/README.md>)
- [about.html](<C:/Users/Hp/Documents/Default Project/about.html>)
- [benchmarks.html](<C:/Users/Hp/Documents/Default Project/benchmarks.html>)
- [contact.html](<C:/Users/Hp/Documents/Default Project/contact.html>)
- [content/about.md](<C:/Users/Hp/Documents/Default Project/content/about.md>)
- [content/guides/best-practices-for-secure-pdf-sharing.md](<C:/Users/Hp/Documents/Default Project/content/guides/best-practices-for-secure-pdf-sharing.md>)
- [content/guides/choose-pdf-image-resolution.md](<C:/Users/Hp/Documents/Default Project/content/guides/choose-pdf-image-resolution.md>)
- [content/guides/client-side-pdf-security-guide.md](<C:/Users/Hp/Documents/Default Project/content/guides/client-side-pdf-security-guide.md>)
- [content/guides/convert-pdf-to-markdown-for-chatgpt-ai.md](<C:/Users/Hp/Documents/Default Project/content/guides/convert-pdf-to-markdown-for-chatgpt-ai.md>)
- [content/guides/how-to-combine-pdf-files.md](<C:/Users/Hp/Documents/Default Project/content/guides/how-to-combine-pdf-files.md>)
- [content/guides/how-to-compress-pdf-without-losing-quality.md](<C:/Users/Hp/Documents/Default Project/content/guides/how-to-compress-pdf-without-losing-quality.md>)
- [content/guides/how-to-convert-pdf-to-word-without-formatting-loss.md](<C:/Users/Hp/Documents/Default Project/content/guides/how-to-convert-pdf-to-word-without-formatting-loss.md>)
- [content/guides/how-to-organize-and-reorder-pdf-pages.md](<C:/Users/Hp/Documents/Default Project/content/guides/how-to-organize-and-reorder-pdf-pages.md>)
- [content/guides/how-to-protect-pdf-with-password.md](<C:/Users/Hp/Documents/Default Project/content/guides/how-to-protect-pdf-with-password.md>)
- [content/guides/how-to-sign-pdf-electronically.md](<C:/Users/Hp/Documents/Default Project/content/guides/how-to-sign-pdf-electronically.md>)
- [content/guides/remove-sensitive-pages-before-sharing.md](<C:/Users/Hp/Documents/Default Project/content/guides/remove-sensitive-pages-before-sharing.md>)
- [content/guides/troubleshoot-corrupt-pdf-xref-tables.md](<C:/Users/Hp/Documents/Default Project/content/guides/troubleshoot-corrupt-pdf-xref-tables.md>)
- [content/guides/understanding-client-side-file-privacy.md](<C:/Users/Hp/Documents/Default Project/content/guides/understanding-client-side-file-privacy.md>)
- [content/privacy.md](<C:/Users/Hp/Documents/Default Project/content/privacy.md>)
- [content/tools/compress.md](<C:/Users/Hp/Documents/Default Project/content/tools/compress.md>)
- [content/tools/images-to-pdf.md](<C:/Users/Hp/Documents/Default Project/content/tools/images-to-pdf.md>)
- [content/tools/merge.md](<C:/Users/Hp/Documents/Default Project/content/tools/merge.md>)
- [content/tools/organize.md](<C:/Users/Hp/Documents/Default Project/content/tools/organize.md>)
- [content/tools/page-numbers.md](<C:/Users/Hp/Documents/Default Project/content/tools/page-numbers.md>)
- [content/tools/pdf-to-images.md](<C:/Users/Hp/Documents/Default Project/content/tools/pdf-to-images.md>)
- [content/tools/pdf-to-markdown.md](<C:/Users/Hp/Documents/Default Project/content/tools/pdf-to-markdown.md>)
- [content/tools/pdf-to-word.md](<C:/Users/Hp/Documents/Default Project/content/tools/pdf-to-word.md>)
- [content/tools/protect.md](<C:/Users/Hp/Documents/Default Project/content/tools/protect.md>)
- [content/tools/remove-pages.md](<C:/Users/Hp/Documents/Default Project/content/tools/remove-pages.md>)
- [content/tools/rotate.md](<C:/Users/Hp/Documents/Default Project/content/tools/rotate.md>)
- [content/tools/sign.md](<C:/Users/Hp/Documents/Default Project/content/tools/sign.md>)
- [content/tools/split.md](<C:/Users/Hp/Documents/Default Project/content/tools/split.md>)
- [content/tools/unlock.md](<C:/Users/Hp/Documents/Default Project/content/tools/unlock.md>)
- [content/tools/word-to-pdf.md](<C:/Users/Hp/Documents/Default Project/content/tools/word-to-pdf.md>)
- [content/updates.md](<C:/Users/Hp/Documents/Default Project/content/updates.md>)
- [css/style.css](<C:/Users/Hp/Documents/Default Project/css/style.css>)
- [docs/IMPLEMENTATION_REPORT.md](<C:/Users/Hp/Documents/Default Project/docs/IMPLEMENTATION_REPORT.md>)
- [docs/benchmarks.json](<C:/Users/Hp/Documents/Default Project/docs/benchmarks.json>)
- [docs/content-audit.json](<C:/Users/Hp/Documents/Default Project/docs/content-audit.json>)
- [docs/vendor-manifest.json](<C:/Users/Hp/Documents/Default Project/docs/vendor-manifest.json>)
- [guides/best-practices-for-secure-pdf-sharing.html](<C:/Users/Hp/Documents/Default Project/guides/best-practices-for-secure-pdf-sharing.html>)
- [guides/choose-pdf-image-resolution.html](<C:/Users/Hp/Documents/Default Project/guides/choose-pdf-image-resolution.html>)
- [guides/client-side-pdf-security-guide.html](<C:/Users/Hp/Documents/Default Project/guides/client-side-pdf-security-guide.html>)
- [guides/convert-pdf-to-markdown-for-chatgpt-ai.html](<C:/Users/Hp/Documents/Default Project/guides/convert-pdf-to-markdown-for-chatgpt-ai.html>)
- [guides/how-to-combine-pdf-files.html](<C:/Users/Hp/Documents/Default Project/guides/how-to-combine-pdf-files.html>)
- [guides/how-to-compress-pdf-without-losing-quality.html](<C:/Users/Hp/Documents/Default Project/guides/how-to-compress-pdf-without-losing-quality.html>)
- [guides/how-to-convert-pdf-to-word-without-formatting-loss.html](<C:/Users/Hp/Documents/Default Project/guides/how-to-convert-pdf-to-word-without-formatting-loss.html>)
- [guides/how-to-organize-and-reorder-pdf-pages.html](<C:/Users/Hp/Documents/Default Project/guides/how-to-organize-and-reorder-pdf-pages.html>)
- [guides/how-to-protect-pdf-with-password.html](<C:/Users/Hp/Documents/Default Project/guides/how-to-protect-pdf-with-password.html>)
- [guides/how-to-sign-pdf-electronically.html](<C:/Users/Hp/Documents/Default Project/guides/how-to-sign-pdf-electronically.html>)
- [guides/index.html](<C:/Users/Hp/Documents/Default Project/guides/index.html>)
- [guides/remove-sensitive-pages-before-sharing.html](<C:/Users/Hp/Documents/Default Project/guides/remove-sensitive-pages-before-sharing.html>)
- [guides/troubleshoot-corrupt-pdf-xref-tables.html](<C:/Users/Hp/Documents/Default Project/guides/troubleshoot-corrupt-pdf-xref-tables.html>)
- [guides/understanding-client-side-file-privacy.html](<C:/Users/Hp/Documents/Default Project/guides/understanding-client-side-file-privacy.html>)
- [index.html](<C:/Users/Hp/Documents/Default Project/index.html>)
- [js/common.js](<C:/Users/Hp/Documents/Default Project/js/common.js>)
- [js/compress.js](<C:/Users/Hp/Documents/Default Project/js/compress.js>)
- [js/contact.js](<C:/Users/Hp/Documents/Default Project/js/contact.js>)
- [js/merge.js](<C:/Users/Hp/Documents/Default Project/js/merge.js>)
- [js/organize.js](<C:/Users/Hp/Documents/Default Project/js/organize.js>)
- [js/page-numbers.js](<C:/Users/Hp/Documents/Default Project/js/page-numbers.js>)
- [js/pdf-to-images.js](<C:/Users/Hp/Documents/Default Project/js/pdf-to-images.js>)
- [js/pdf-to-markdown.js](<C:/Users/Hp/Documents/Default Project/js/pdf-to-markdown.js>)
- [js/pdf-to-word.js](<C:/Users/Hp/Documents/Default Project/js/pdf-to-word.js>)
- [js/protect.js](<C:/Users/Hp/Documents/Default Project/js/protect.js>)
- [js/remove-pages.js](<C:/Users/Hp/Documents/Default Project/js/remove-pages.js>)
- [js/rotate.js](<C:/Users/Hp/Documents/Default Project/js/rotate.js>)
- [js/sign.js](<C:/Users/Hp/Documents/Default Project/js/sign.js>)
- [js/split.js](<C:/Users/Hp/Documents/Default Project/js/split.js>)
- [js/unlock.js](<C:/Users/Hp/Documents/Default Project/js/unlock.js>)
- [js/vendor/html2canvas.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/html2canvas.min.js>)
- [js/vendor/index.umd.js](<C:/Users/Hp/Documents/Default Project/js/vendor/index.umd.js>)
- [js/vendor/jspdf.umd.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/jspdf.umd.min.js>)
- [js/vendor/jszip.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/jszip.min.js>)
- [js/vendor/mammoth.browser.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/mammoth.browser.min.js>)
- [js/vendor/pdf-lib.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/pdf-lib.min.js>)
- [js/vendor/pdf.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/pdf.min.js>)
- [js/vendor/pdf.worker.min.js](<C:/Users/Hp/Documents/Default Project/js/vendor/pdf.worker.min.js>)
- [js/word-to-pdf.js](<C:/Users/Hp/Documents/Default Project/js/word-to-pdf.js>)
- [migrations/0001_support.sql](<C:/Users/Hp/Documents/Default Project/migrations/0001_support.sql>)
- [package-lock.json](<C:/Users/Hp/Documents/Default Project/package-lock.json>)
- [package.json](<C:/Users/Hp/Documents/Default Project/package.json>)
- [privacy.html](<C:/Users/Hp/Documents/Default Project/privacy.html>)
- [robots.txt](<C:/Users/Hp/Documents/Default Project/robots.txt>)
- [scripts/build_content.py](<C:/Users/Hp/Documents/Default Project/scripts/build_content.py>)
- [scripts/vendor_libraries.py](<C:/Users/Hp/Documents/Default Project/scripts/vendor_libraries.py>)
- [scripts/verify_browser.cjs](<C:/Users/Hp/Documents/Default Project/scripts/verify_browser.cjs>)
- [scripts/verify_content.py](<C:/Users/Hp/Documents/Default Project/scripts/verify_content.py>)
- [sitemap.xml](<C:/Users/Hp/Documents/Default Project/sitemap.xml>)
- [terms.html](<C:/Users/Hp/Documents/Default Project/terms.html>)
- [tests/worker.test.mjs](<C:/Users/Hp/Documents/Default Project/tests/worker.test.mjs>)
- [tools/compress.html](<C:/Users/Hp/Documents/Default Project/tools/compress.html>)
- [tools/images-to-pdf.html](<C:/Users/Hp/Documents/Default Project/tools/images-to-pdf.html>)
- [tools/merge.html](<C:/Users/Hp/Documents/Default Project/tools/merge.html>)
- [tools/organize.html](<C:/Users/Hp/Documents/Default Project/tools/organize.html>)
- [tools/page-numbers.html](<C:/Users/Hp/Documents/Default Project/tools/page-numbers.html>)
- [tools/pdf-to-images.html](<C:/Users/Hp/Documents/Default Project/tools/pdf-to-images.html>)
- [tools/pdf-to-markdown.html](<C:/Users/Hp/Documents/Default Project/tools/pdf-to-markdown.html>)
- [tools/pdf-to-word.html](<C:/Users/Hp/Documents/Default Project/tools/pdf-to-word.html>)
- [tools/protect.html](<C:/Users/Hp/Documents/Default Project/tools/protect.html>)
- [tools/remove-pages.html](<C:/Users/Hp/Documents/Default Project/tools/remove-pages.html>)
- [tools/rotate.html](<C:/Users/Hp/Documents/Default Project/tools/rotate.html>)
- [tools/sign.html](<C:/Users/Hp/Documents/Default Project/tools/sign.html>)
- [tools/split.html](<C:/Users/Hp/Documents/Default Project/tools/split.html>)
- [tools/unlock.html](<C:/Users/Hp/Documents/Default Project/tools/unlock.html>)
- [tools/word-to-pdf.html](<C:/Users/Hp/Documents/Default Project/tools/word-to-pdf.html>)
- [updates.html](<C:/Users/Hp/Documents/Default Project/updates.html>)
- [worker.mjs](<C:/Users/Hp/Documents/Default Project/worker.mjs>)
- [wrangler.toml](<C:/Users/Hp/Documents/Default Project/wrangler.toml>)
