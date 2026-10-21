# Review and share a PDF without exposing avoidable information

Secure sharing begins before encryption or sending. Decide what the recipient actually needs, remove material through an appropriate review process, and choose a delivery method that fits the sensitivity of the remaining document. Local PDF editing can reduce conversion-server exposure, but the final email attachment, shared link, downloaded copy, and recipient permissions determine much of the practical risk. This workflow follows the document through those stages.

## Minimize the packet deliberately

Start with an untouched original and a working copy. Identify required pages and exclude unrelated appendices, draft instructions, and duplicate records. Record the physical source positions if someone will need to explain the selection later. A whole-page removal can be appropriate when the entire sheet is outside scope, but do not assume that excluding a thumbnail sanitizes every other part of the PDF. Review what remains as carefully as what is removed.

Check visible material beyond the main text: headers, footers, comments, stamps, form values, and screenshots can contain names or identifiers. A cropped-looking area in a viewer may still deserve inspection in an editor that exposes page boxes and hidden content. If the document will be disclosed in a formal process, follow that process's preservation and review requirements. The tool's convenient page controls are not a substitute for a documented disclosure decision.

## Distinguish exclusion, redaction, and sanitization

<table class="data-table"><caption>Different review tasks need different checks</caption><thead><tr><th>Task</th><th>What it changes</th><th>What it does not establish</th></tr></thead><tbody><tr><td>Delete complete pages</td><td>The retained page sequence</td><td>Forensic removal of all related information</td></tr><tr><td>Apply true redaction</td><td>Specified content through a redaction workflow</td><td>Correctness without reviewing the saved output</td></tr><tr><td>Sanitize a document</td><td>Selected hidden data and structures</td><td>That all visible disclosures are appropriate</td></tr><tr><td>Encrypt a copy</td><td>Access to encoded contents</td><td>Protection after an authorized viewer opens it</td></tr></tbody></table>

Drawing a black rectangle is not a reliable redaction method. Text or objects can remain behind it. Searching for a removed term is a useful negative test, but absence from one search is not comprehensive proof: text might have alternate encoding, appear as an image, or survive elsewhere. Use a dedicated redaction and sanitization workflow with an independent output review when disclosure consequences demand it.

## Inspect metadata and embedded features

Review document properties for author, title, subject, keywords, and creation information. Check attachments, comments, forms, and other embedded material with software capable of displaying them. Do not assume that a page-copying or save operation deliberately strips every hidden structure. An edited document may retain information unrelated to the visible pages, while a rasterized derivative may sacrifice useful accessibility and search features without providing a complete sanitization report.

Keep the source when it has evidentiary or archival value. A certificate signature relates to particular bytes and a defined validation process. After compression, merging, numbering, or page removal, the output may be a useful derivative but should not be presented as the unchanged signed original. Store the source and derivative with clear names and a short note describing the operation rather than relying on memory months later.

## Match encryption to the requirement

Know which security handler a tool actually uses. ZeroUpload's current Protect PDF implementation rebuilds pages as images and uses jsPDF's legacy RC4 encryption path; it is not an AES-256 solution. For sensitive material requiring modern PDF encryption, use a maintained tool with verifiable settings or an approved access-controlled delivery portal. A long password does not replace an appropriate algorithm and implementation.

If an encrypted attachment is the approved method, use a unique password and send it through a separate agreed channel. Do not include the password in the same message as the attachment and describe that as strong separation. Confirm that the recipient can open the file with their actual viewer before sending a time-sensitive packet. Remember that an authorized viewer can still photograph or reproduce the visible content.

## Check delivery permissions as a separate step

For email, verify the full addresses in To and CC rather than trusting autocomplete. For a shared link, inspect whether access is public, organization-wide, or limited to named recipients. Where supported, choose the least access and an appropriate expiry. Do not assume that a link is private merely because it is long or difficult to guess. The receiving service's settings, audit capabilities, and retention policy are part of the workflow.

Review local output handling too. Downloads can be synchronized automatically to a cloud folder or backed up by endpoint software. A shared workstation can retain copies after the browser closes. Organize reviewed outputs in an approved location and avoid keeping unnecessary intermediate files indefinitely. Local browser processing controls the conversion path, while these separate systems control later storage and access.

## Use measurable acceptance checks

For a synthetic disclosure test, create a five-page source with a harmless exclusion marker on page 3. After removing that page, the expected visible result is four pages in the order 1, 2, 4, 5. Inspect that sequence and separately review metadata and attachments. This is a defined functional test, not a claim that the page-removal tool certifies sanitization. Keep the fixture artificial so it can be shared safely when diagnosing a problem.

## Troubleshooting checklist

- Sensitive term still visible: stop distribution and repeat the review in a suitable redaction tool.
- Hidden attachment discovered: inspect the full document structure before treating the output as reviewed.
- Recipient cannot open encryption: check viewer compatibility and the approved delivery method.
- Wrong access scope: revoke or restrict the link through the hosting service and follow your incident process if needed.
- Signed-original confusion: preserve both files and clearly identify which one retains the original verification evidence.
- Unwanted local copies: review downloads, synchronization, backups, and shared-device access.

Use [Remove Pages](/tools/remove-pages) for whole-page exclusions, [Organize PDF](/tools/organize) for a reviewed sequence, and the [client-side security guide](/guides/client-side-pdf-security-guide) to assess processing separately from distribution.
