# Privacy Policy

Last updated: October 19, 2026. This policy distinguishes document processing from website hosting, advertising, and messages you choose to send us. ZeroUpload's local document processing does not mean the website has no network activity or advertising cookies.

## Document processing stays in your browser

The PDF tools read selected files into browser memory using local file APIs. JavaScript libraries, PDF.js workers, and browser canvases edit, render, or extract document content on your device. The tools do not send your selected PDFs, extracted text, signature images, or document passwords to our conversion servers: there is no document-upload endpoint. This implementation does not depend on a separate WebAssembly processing service.

Generated files are browser downloads. We do not maintain a server document vault or a recovery copy. Reloading or closing the page normally ends the editing session, but we cannot guarantee secure erasure of RAM, operating-system swap, crash reports, or device backups. Downloads remain on your device until you manage them. Browser extensions, endpoint software, and services to which you later send a result are outside this processing guarantee.

## Website hosting, preferences, and analytics

Cloudflare hosts the website and support endpoint. Delivering and securing requests can involve IP addresses, request times, browser headers, referring pages, security events, and operational logs. These are separate from selected document contents. We use operational information to deliver the service, investigate failures, and prevent abuse. We have not added a standalone behavioral analytics SDK to the application. Hosting and advertising providers can maintain their own operational measurements.

The theme preference is stored in localStorage. The tools do not intentionally save selected document bytes to localStorage or a server database. Library and browser caching can store application resources. Provider log retention depends on the hosting configuration and provider policies; we do not promise immediate erasure of all website metadata or a universal zero-day retention period.

## Google AdSense and advertising cookies

We include a Google AdSense publisher tag. Google and its advertising partners may use cookies, including advertising identifiers associated with DoubleClick domains and historically described as DoubleClick DART cookies, to serve ads based on visits to zeroupload.co and other sites. Ad requests can involve IP addresses, browser or device information, cookie identifiers, and interaction data. Advertising identifiers can be personal information; we do not describe this activity as zero tracking or anonymous by default.

The document tools do not intentionally provide document contents to advertising partners. Third-party code delivered on a page is nevertheless a separate software trust consideration. The presence of an ad tag can cause network or cookie activity even when no visible advertisement is displayed. See [Google's explanation of AdSense cookies](https://support.google.com/adsense/answer/7549925?hl=en) and [how Google uses information from partner sites](https://policies.google.com/technologies/partner-sites).

## Advertising choices

Manage personalized Google advertising through [Google Ads Settings](https://adssettings.google.com/). Participating advertising providers also offer choices through [aboutads.info](https://www.aboutads.info/choices/). These controls can be browser, device, or account specific and do not necessarily remove all advertising or every operational cookie. Browser settings can restrict cookies and clear stored site data.

The standard Google AdSense publisher script loads directly from the page head. Consent messages for EEA and UK visitors are managed through Google AdSense's built-in Privacy & Messaging CMP in the publisher dashboard, together with regional advertising settings. The site does not wait for a separate external CMP before loading the publisher script. Google requires a certified consent management platform for personalized ads in the EEA, UK, and Switzerland. This privacy notice is not itself a consent mechanism. Use the privacy and cookie settings below to reopen Google's consent choices when available. You can also submit an advertising opt-out or withdrawal request through [Contact](/contact), without attaching documents.

## Support submissions and retention

Submitting the contact form sends the name, email, category, selected tool, subject, and message you enter to our Cloudflare Worker and D1 support database. We use those fields to review the inquiry and respond when appropriate. Do not include confidential documents, passwords, medical records, or unnecessary personal information in a message. The form accepts text fields and does not offer document attachments.

Rate limiting uses a time-windowed hash derived from the connecting IP address; the application does not save the raw IP in the inquiry record. Rate-limit records expire after ten minutes and are removed by daily maintenance. Support records are scheduled for deletion after 90 days, with daily cleanup. Provider backups or operational logs can have different retention. We do not promise an automatic email notification or a fixed response deadline; a successful submission confirms database storage, not that a person has already read it.

## European data protection rights

Where GDPR or UK data protection law applies, you may have rights of access, correction, erasure, restriction, objection, and portability, subject to applicable conditions. You can withdraw consent without affecting earlier lawful processing and can complain to your competent supervisory authority. We rely on providing the requested support service and legitimate interests in security and operation where appropriate; advertising uses consent where required. Any international processing by hosting or advertising providers is subject to their applicable arrangements and safeguards.

Send rights requests through [Contact](/contact) using the Privacy or Security category. Give enough information to locate a support record without sending the document itself. We may request proportionate verification before disclosing or changing personal information. We cannot retrieve locally processed PDFs because the application does not store a server copy. This architecture does not by itself certify an organization's GDPR or HIPAA workflow.

## California privacy choices

Where CCPA/CPRA applies, California residents may request information about collection and disclosure, access, deletion, correction, and applicable limits on sensitive-information use, and may opt out of sale or sharing without discrimination. Advertising activity can constitute sharing for cross-context behavioral advertising even without a cash sale. We therefore do not make an unconditional no-sharing claim for website advertising. Review the [California Attorney General's rights overview](https://www.oag.ca.gov/privacy/ccpa).

Use Google and industry advertising controls above and [Contact](/contact) to submit a Do Not Sell or Share request. A browser Global Privacy Control signal should be honored by the publisher's configured regional advertising controls where required. We do not claim that a general Do Not Track header universally changes every provider's behavior. You or an authorized agent can submit an applicable rights request; verification and statutory exceptions may apply.

## Changes and contact

The date above identifies this revision. We describe engineering changes on [Updates](/updates). For privacy questions or requests, use the [support form](/contact) and retain its saved inquiry reference. For a regulated workflow, obtain your organization's approval and consider the full device, conversion, advertising, storage, and delivery path before selecting a tool.
