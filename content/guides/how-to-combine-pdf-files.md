# Combine financial statements into a checkable PDF packet

A packet of bank statements is useful only if a reviewer can establish which periods it covers and whether every page is present. Merging twelve downloads quickly is easy; proving that February is not missing and June has not been included twice takes a little preparation. This workflow uses a manifest, a deliberate order, and a boundary review so the combined document can be checked without guessing from its filename.

## Define the packet before selecting files

Create a working folder containing copies of the statements. Keep original downloads separately, with access appropriate to their account details. Record each filename, statement period, account identifier using only the necessary final digits, and physical page count. Do not use the transaction dates on page one as a substitute for the statement period. A statement issued in January may describe activity ending in December, and a revised statement may supersede an earlier download with nearly the same name.

Choose a naming convention that sorts predictably, such as 2026-01-account-1234.pdf. Use two-digit months. If there are several accounts, decide whether the recipient wants chronological order across accounts or a complete year grouped under each account. That is a reporting choice, not something a merge utility can infer. Ask the recipient's instructions to settle it before producing a large packet.

## Choose assembly rather than conversion

The merge tool copies page objects with pdf-lib into a new document. It is suitable for assembling ordinary text-based statements without deliberately rasterizing their text. It does not recreate a source application's entire document catalog. Bookmarks, attachments, form fields, and destinations can depend on structures outside individual pages. A packet that looks right still needs a navigation check if the reviewer will use its electronic index.

<table class="data-table"><caption>Choose the operation by the required result</caption><thead><tr><th>Need</th><th>Operation</th><th>Review afterward</th></tr></thead><tbody><tr><td>Combine complete statements</td><td>Merge page objects</td><td>Source boundaries and total pages</td></tr><tr><td>Reorder selected pages</td><td>Organize a working copy</td><td>Index and printed page labels</td></tr><tr><td>Meet an attachment limit</td><td>Evaluate compression separately</td><td>Readability and searchable text</td></tr></tbody></table>

## Assemble a small test packet first

Select two representative statements in Merge PDF. Include one with a landscape transaction page or a continuation sheet if the real packet contains those. Review the file list and place the earlier period first. Generate the file, save it under a new name, and reopen that download. Confirm that page dimensions are acceptable and that account numbers, dates, balances, and footnotes remain legible. Test a link if its behavior matters to the recipient.

Once that sample passes, assemble the complete packet. Compare the total page count with the manifest sum. Inspect the last page of every source statement and the first page of the next. This boundary method is efficient because omitted, duplicated, or misordered files tend to reveal themselves at those transitions. It supplements rather than replaces a complete review when the disclosure has high consequences.

## Reconcile figures without changing the evidence

For an illustrative three-statement packet with 4, 6, and 5 physical pages, the expected output is 15 pages. That is an arithmetic acceptance target, not a performance claim. If the result has 14 pages, stop and identify the discrepancy. Do not silently insert a blank page to make the count match. A matching count is necessary but insufficient, since replacing one page with a duplicate can preserve the total while losing information.

Maintain any reconciliation notes outside the original statement pages. If you add an explanatory cover, record that it contributes one additional page and distinguish it from issuer content. Do not modify balances or obscure inconvenient transactions as part of assembly. For certificate-signed statements, retain the original files because the combined derivative is not certified by those original signatures. If the reviewer requires signature validation, provide the signed originals through the approved delivery channel.

## Manage attachment limits after completeness is established

Measure the actual merged file before choosing compression. Begin with the lossless option when text selection matters. Raster modes create image pages and can remove search, working links, and form behavior. A financial reviewer may need to copy an identifier or search for a transaction; sacrificing those capabilities to meet an arbitrary size target can create more work than splitting the delivery into clearly labeled parts.

If smaller batches are required, give each a meaningful range such as accounts A-B or January-June. Add a manifest showing the complete intended set and avoid ambiguous names like final2.pdf. Make sure a receiving portal permits multiple attachments and preserves their filenames. A desktop can also handle larger working sets than a phone, but there is no universal number of statements that every browser can safely merge.

## Troubleshooting checklist

- Missing period: compare statement periods with the manifest, including revised downloads and year boundaries.
- Unexpected order: inspect the visible input list; do not rely on the operating system's alphabetical sorting.
- Password error: obtain an authorized unencrypted export before merging. Ignoring encryption flags is not decryption.
- Incorrect page total: compare each source count and inspect every transition before sending the packet.
- Invalid signature warning: return to the signed originals and follow the recipient's evidence requirements.
- Browser memory failure: reduce the batch size on a working copy and preserve a record of how the groups were assembled.

## Deliver a packet someone else can audit

Open the final download independently and verify that its name, cover, periods, and page count agree. Check the recipient address and access settings at the delivery stage. Local assembly does not control what happens to a file placed in an email attachment or shared drive. Retain the reviewed packet with its manifest so a later question about a missing month can be answered from records rather than memory. Use [Merge PDF](/tools/merge), [Organize PDF](/tools/organize), and the [secure sharing guide](/guides/best-practices-for-secure-pdf-sharing) for the related steps.
