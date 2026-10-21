# Engineering updates

This log records work visible in the repository and the October 19, 2026 maintenance revision. Entries describe source changes; they do not imply that an unpublished change is already deployed or that Google has approved the site.

## October 19, 2026 — Content, routing, and support maintenance

Replaced short tool descriptions with implementation-specific documentation for all fifteen tools. Corrected compression explanations to distinguish object-stream saving from page rasterization. Documented jsPDF's legacy protection handler and the difference between visible signature overlays and certificate signatures. Removed unsupported blanket WebAssembly and automatic-compliance claims from the revised pages.

Expanded the guides library with workflows for financial statement assembly, local-processing inspection, RAG preparation, sensitive-page exclusion, PDF loading failures, and image-resolution selection. Added comparison tables, troubleshooting checklists, and a reproducible fixture benchmark report. Fixture measurements describe a development test environment, not a performance guarantee for every visitor's device.

Standardized canonical internal links, added the updates route and custom missing-page response, and regenerated the sitemap with the October 19 review date. Removed empty advertising units and duplicate ad initialization. Kept the standard asynchronous publisher script directly in each static page head and ads.txt in the public root. Consent is managed through Google AdSense's built-in Privacy & Messaging CMP in the publisher dashboard; the custom external-CMP loading gate has been removed. Updated the privacy notice to distinguish documents from website advertising, hosting, and support submissions.

Added a Cloudflare Worker contact endpoint with bounded input, server validation, origin checks, atomic rate limiting, and D1 storage. The form reports success only after storage succeeds. Added daily retention cleanup and documented how the operator reviews support inquiries. Production database provisioning, migration, and consent settings must be completed as part of deployment.

## September 24, 2026 — Earlier content and legal-page revision

Repository commit 86a7f8e added legal and support page content, an expanded guides hub, and advertising configuration work. The October revision corrects claims and gaps identified in that earlier implementation, including the email-client contact flow and empty advertising units.

## September 14, 2026 — Presentation cleanup

Repository commit 62d48ba removed decorative emojis and cleaned text formatting. This was a presentation change recorded in source history, not evidence of a separate product release on that date.

## September 8, 2026 — Initial toolkit and project documentation

Repository history records the initial fifteen-tool implementation in 4b545c0, the MIT license in fb94a7f, and local-development documentation in 8158662. The current service worker clears obsolete caches; earlier offline descriptions should not be interpreted as a guarantee of a complete offline installation.

Report a reproducible problem through [Contact](/contact). Browse [all tools](/#tools), the [guides](/guides), or the [privacy policy](/privacy) for current behavior and limitations.
