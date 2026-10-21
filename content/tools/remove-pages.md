## Remove complete pages with a documented review

Remove Pages is for accidental blank sheets, duplicate scans, and entire pages that should be excluded from a working copy. Decide which physical page positions should be deleted before you start. Keep an original and write a short exclusion list when the result will be reviewed by someone else. For sensitive disclosure, deleting a whole page is only one part of reviewing the remaining document and should not be described as certified redaction.

## How it works under the hood

PDF.js generates page thumbnails for selection. The saving path loads the original PDF with pdf-lib, converts chosen page numbers into zero-based indices, and removes them in descending order. Removing higher indices first avoids shifting a later target when an earlier page disappears. The document is then saved as a new Blob download in the browser. This is page-tree editing, not a process that paints white rectangles over text.

The remaining page artwork is not deliberately rasterized, so normal text and vector content usually stay usable. Nevertheless, deleting page-tree entries is not a full forensic sanitization procedure. Metadata, annotations, attachments, unused objects, form data, or broken destinations may require separate inspection. The tool does not certify that every reference to the excluded information has disappeared from every part of the file. Retaining an unchanged original is also important when the source has evidentiary value.

## Step-by-step usage and best practices

Select a PDF and compare its thumbnails with your exclusion list. Use physical positions in the file, counting covers and blank inserts. When using a range, enter an ordinary ascending sequence such as 3-5,9. Confirm that the range describes pages to remove rather than pages to keep. That distinction is easy to miss when moving between extraction and deletion tools. Keep at least one page; a useful PDF output requires a remaining page sequence.

Run the operation and download a clearly named copy. Reopen it and compare its page count with the original count minus the number of unique removed positions. Inspect both sides of each deletion boundary. For example, after removing pages 3 through 5, confirm that the original page 2 is followed by the original page 6. Search the remaining visible content for sensitive names or identifiers that may appear on more than one page.

Do not infer that printed page numbers or a table of contents will update automatically. Those are often ordinary page artwork and may now point to missing material. Rebuild an index or add a new packet-number sequence when necessary. Password-encrypted files require an authorized readable export; the page editor does not decrypt them. Certificate signatures may no longer validate after saving changes, so use an edited working copy separately from any original signed record.

## Page-removal questions

### Is deleting pages the same as redacting sensitive text?

No. It excludes whole pages from the sequence but does not inspect everything else in the file. Use a dedicated redaction and sanitization workflow when the disclosure requires verified removal of confidential information.

### Why did the document keep its old page numbers?

Printed labels remain part of the page artwork. Removing a sheet does not rewrite the text on other sheets. Add a new sequence only after finalizing the packet, and retain source labels when citations depend on them.

### How do I avoid deleting the wrong page?

Use the viewer's physical counter and compare thumbnails with the full-size source. Covers, roman numerals, and inserted exhibits often make printed labels differ from physical positions. Inspect deletion boundaries in the download.

### Can I remove every page and save an empty PDF?

Keep at least one useful page. If your aim is to discard the entire document, do that in your own file management workflow rather than expecting a meaningful zero-page output from the editor.

### Why are some bookmarks or links now broken?

They can point to pages that no longer exist. This tool does not rebuild every outline and destination. Review important navigation before sharing, especially when recipients rely on an electronic table of contents.
