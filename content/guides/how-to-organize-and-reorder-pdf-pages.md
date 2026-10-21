# Reorder a scanned PDF while keeping a dependable page inventory

A scan assembled from several sessions often contains duplicated covers, sideways pages, or an appendix inserted in the middle of a report. Fixing that sequence is easiest when the desired order is written down before editing. This guide uses a page inventory and a reviewed export so you can distinguish a correctly assembled packet from a thumbnail arrangement that only appears plausible at first glance.

## Build a source-page inventory

Keep an untouched original and make a working copy. Record the physical positions of covers, section dividers, statements, appendices, and any blank sheets that have a purpose. Physical positions start at page 1 and include every inserted page. Printed labels such as iv or A-3 belong to a different numbering system. Write both when they differ, especially if another person will verify the final sequence.

Describe the target order by meaningful groups before moving individual pages. For example, use cover, executive summary, January statement, February statement, and receipts. If the scan includes intentional blank backs or separator sheets, decide whether the recipient requires them. Do not delete every blank-looking thumbnail automatically: a faint stamp or a page intentionally preserved for a formal record can be missed at a small scale.

## Understand previews and exported pages

The organizer uses PDF.js to render small preview canvases. Its local state records the source position, additional rotation, and removed status of each page. During export, pdf-lib copies the retained original pages into the chosen order and applies rotation metadata. The final file is not built from the low-resolution thumbnails. This distinction explains why a preview can look soft while the downloaded page retains crisp original text.

<table class="data-table"><caption>Review each kind of edit separately</caption><thead><tr><th>Edit</th><th>Intended result</th><th>Check in the download</th></tr></thead><tbody><tr><td>Reorder</td><td>New physical page sequence</td><td>Source-to-output inventory</td></tr><tr><td>Rotate</td><td>Readable orientation</td><td>Portrait, landscape, and annotations</td></tr><tr><td>Delete</td><td>Exclude selected pages</td><td>Count and deletion boundaries</td></tr><tr><td>Add numbers later</td><td>Consistent packet references</td><td>Margins and conflicting printed labels</td></tr></tbody></table>

## Edit in small, checkable groups

Load the PDF and wait for the previews to settle. Move one section at a time, comparing the result with the inventory. Rotate a page only when its current orientation is wrong for reading; a wide spreadsheet may already be correct in landscape. Remove confirmed duplicates and use undo immediately after an accidental operation. The current session's undo history is not a durable document version history and should not be relied on after a reload.

For a long packet, stop after each meaningful group and inspect the surrounding thumbnails. A sequence of many unrecorded drags is difficult to audit. If the target order is complex, maintain a simple mapping such as output pages 4-8 come from source pages 12-16. That mapping can also help explain later citations when the printed source page numbers no longer agree with the viewer's physical counter.

## Review navigation and document-level features

Page copying usually retains page artwork, but bookmarks, form definitions, accessibility structures, attachments, and internal destinations can depend on the document catalog. The organizer does not promise to rebuild all of them around the new sequence. Test an electronic table of contents and important links. A link that used to point to an appendix may need recreation even though the appendix's visible page content transferred successfully.

Printed page numbers and cross-references do not update automatically. A sentence saying see page 17 is ordinary content, so moving its destination does not rewrite it. Decide whether to retain source references, create a new packet index, or add a separate visible sequence. Do the numbering after final assembly. Make the distinction explicit for reviewers rather than covering the original numbers and hoping no confusion remains.

## Preserve evidence and confidentiality

Keep certificate-signed originals separately from reorganized derivatives. A new file assembled from original pages does not inherit the original signature's certification. If a recipient must validate the original signature, supply the approved original artifact. Similarly, whole-page deletion is not a complete redaction or sanitization process. Review the remaining content and hidden structures with suitable tools when the disclosure has legal or regulatory consequences.

For password-encrypted sources, obtain an authorized unencrypted export before editing. Do not assume that a library option named ignoreEncryption can decrypt protected content. If a large scan exhausts memory, try a smaller authorized working section or a device with more available resources. Disk size alone is misleading because page previews, parsed structures, and the saved output can coexist in memory during an editing session.

## Define an acceptance example

Use a harmless six-page fixture labeled A through F. Define a target of A, C, B, E, F, with D removed and E rotated once. The expected output is five pages. Verify the letters in order and inspect E's orientation in a fresh viewer. This small functional benchmark reveals sequence, deletion, and rotation mistakes independently instead of hiding them behind a single successful-download message.

## Troubleshooting checklist

- Wrong retained page: compare the source inventory with physical page positions rather than printed labels.
- Unexpected landscape rotation: reopen the source and determine its intended reading direction.
- Soft preview: inspect the download before assuming the original artwork was resampled.
- Broken outline or link: recreate navigation in an editor that supports document-level destinations.
- Conflicting numbers: finalize assembly, then add a clearly identified packet sequence and index.
- Lost session: restart from the retained original; no server copy or durable undo history is provided.

Use [Organize PDF](/tools/organize), [Rotate PDF](/tools/rotate), [Page Numbers](/tools/page-numbers), and the [page-removal review guide](/guides/remove-sensitive-pages-before-sharing) to carry out the related tasks.
