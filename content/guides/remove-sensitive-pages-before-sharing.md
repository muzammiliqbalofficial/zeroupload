# Exclude sensitive pages before a reviewed disclosure

Sometimes the safest disclosure is a smaller, clearly scoped packet. A report may include an unrelated appendix, a scan may contain someone else's record, or a working bundle may include internal instructions. Whole-page exclusion can help, but it should be performed as a documented selection process. It is not a certified redaction or forensic sanitization service, and it does not decide what a legal or regulatory disclosure should include.

## Define the scope and preserve the source

Keep an untouched original in its approved storage location. Work on a copy and record why each proposed page is excluded. If preservation obligations, discovery instructions, or a formal records process apply, obtain the responsible review decision before editing. The utility cannot determine whether removing an inconvenient page is permissible. Technical ability to exclude content is separate from authority to do so.

Build a source inventory using physical page positions. Include covers, blank inserts, and appendices. Printed labels can restart between sections, so note both the physical position and any meaningful printed label. If two pages look similar, inspect their full-size contents before treating one as a duplicate. A faint stamp, handwritten note, or reverse side may be relevant even when its thumbnail looks blank.

## Choose page exclusion or content redaction deliberately

<table class="data-table"><caption>Match the operation to the disclosure task</caption><thead><tr><th>Situation</th><th>Appropriate starting point</th><th>Additional review</th></tr></thead><tbody><tr><td>Entire appendix outside scope</td><td>Exclude complete pages</td><td>Remaining references and hidden data</td></tr><tr><td>One identifier on an otherwise required page</td><td>Dedicated redaction workflow</td><td>Applied redaction and output validation</td></tr><tr><td>Unwanted comments or attachments</td><td>Document inspection and sanitization</td><td>Full saved structure</td></tr><tr><td>Original signed evidence</td><td>Preserve original artifact</td><td>Authorized derivative and provenance</td></tr></tbody></table>

Do not place a rectangle over text and call it redaction. Underlying content can remain accessible. Likewise, a screenshot or raster export can sacrifice searchability without proving that every hidden item has been removed from the resulting file. Use a workflow designed for the required level of sanitization and have an independent reviewer inspect the actual output when the consequences justify that control.

## Remove pages with an explicit exclusion list

Load the working copy in Remove Pages and compare its thumbnails with the inventory. Enter positions to remove, not positions to retain. For a range such as 3-5,8, verify the meaning against the source counter before running the operation. Keep at least one retained page. If the whole file is outside scope, manage it through the disclosure process rather than producing an empty document as a substitute for a decision.

The implementation uses pdf-lib to remove selected page indices in descending order, avoiding target shifts as earlier pages disappear. It then saves a new file. That operation changes the retained sequence but is not a promise that every unused object, attachment, field, or reference related to the excluded material has been sanitized. Treat the generated file as a candidate for review, not an automatically approved disclosure.

## Verify the visible sequence

Count the source pages and subtract the number of unique removed positions. Reopen the downloaded file independently and compare its count with that expectation. Inspect both sides of every exclusion boundary. If source pages 3 through 5 were removed, check that source page 2 is followed by source page 6. Count alone is not enough because an accidental duplicate can conceal an omission while leaving the total unchanged.

Read the remaining pages for repeated sensitive information. An account number removed from an appendix may still appear in the cover letter, a screenshot, or a footer. Check the table of contents and cross-references; they may reveal excluded subjects or point to pages that no longer exist. If a new packet index is needed, create it after the final selection and distinguish new packet labels from original printed page numbers.

## Inspect hidden and embedded material

Use a suitable PDF inspection tool to review metadata, comments, form values, attachments, layers, and other structures relevant to the document. Search for known sensitive terms as one check, while recognizing that an absent text search result is not comprehensive proof. Information may be represented as an image, alternate encoding, or embedded object. Review the saved output rather than relying on what the editor showed before export.

Keep certificate-signed originals separately. Removing pages changes the document and does not preserve certification of the new byte sequence. A visible signature image can remain even though the output is no longer the original signed artifact. Record the source identity, operation, review date, and reviewer in the working notes so future users can understand what the derivative represents.

## Use a harmless rehearsal fixture

Create a five-page sample with page letters A through E, placing an exclusion marker only on C. Remove page 3 and expect A, B, D, E in a four-page output. Then add a separate synthetic marker in metadata or an attachment using a suitable editor and verify that your broader inspection process finds it. This separates the page-removal test from the sanitization review and avoids exposing real confidential content while testing.

## Troubleshooting checklist

- Wrong sheet removed: return to the original and compare physical positions, covers, and printed labels.
- Sensitive term survives: stop distribution and review every remaining occurrence and embedded structure.
- Broken contents page: rebuild the index or provide a clear packet map after final assembly.
- Signature validation changes: preserve the original and label the derivative according to the approved process.
- Missing review evidence: record the exclusion list and checks before the packet is sent.
- Output appears empty: confirm that at least one intended page was retained and that the source parsed correctly.

Continue with [Remove Pages](/tools/remove-pages), [Organize PDF](/tools/organize), and the [secure sharing guide](/guides/best-practices-for-secure-pdf-sharing). A reviewed disclosure combines authorized scope, a correct visible sequence, inspection of hidden material, and controlled delivery.
