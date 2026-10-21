## Number the final packet, then verify the margins

Page numbering helps reviewers refer to the same location in a combined document. Apply it after merging, deleting, and reordering pages so the sequence reflects the finished packet. Keep source page labels when they matter to citations, and decide how the new numbers should be described. A footer added by this tool is visible artwork; it is not the same as setting the document's logical page labels in a PDF viewer.

## How it works under the hood

The script loads your PDF with pdf-lib and embeds its standard Helvetica and Helvetica Bold fonts. It calculates a text position from the chosen location and page dimensions, then draws the number onto the selected pages. An optional watermark uses another text drawing operation with the configured size, angle, and opacity. The source pages are not converted into full-page images merely to add a footer. Existing text and vectors generally remain available underneath the new layer.

This mechanism changes page content streams and serializes a new PDF. It does not create a certificate signature, an exhibit management system, or an accessibility tag tree. Watermarks are visible deterrents, not access restrictions: a reader can still open the file unless it is separately encrypted. Because the standard fonts have a limited character repertoire, unusual watermark symbols or scripts may require a different editor with embedded Unicode font support.

## Step-by-step usage and best practices

Select a PDF and choose the numbering format, starting value, and position offered by the interface. Inspect whether the original pages already have footers, signatures, stamps, or cropped edges. Pick a location that does not overlap those details. If the tool offers a range, use physical page positions rather than the printed labels in the source. A cover sheet can make the viewer's page 2 correspond to printed page 1.

Run the tool and download a new copy. Check the first numbered page, the last page, and the transition around any excluded range. Count expected numbers manually on a short sample before applying a scheme to a long report. Review both portrait and landscape pages; their width and height affect where the footer lands. Print a sample at the receiving printer's normal scaling if the numbers sit near the edge, since printable margins can hide text visible on screen.

Keep the original certificate-signed document when one exists. Adding even a small footer changes the file and can affect verification. For exhibits, record the chosen starting number and which pages were excluded; do not describe the result as a formal Bates workflow unless the relevant procedural requirements have actually been met. Password-protected inputs need an authorized unencrypted export because this tool is not a decryption service.

## Numbering-specific questions

### Why do the new numbers differ from the viewer's counter?

The tool draws text on a page. It does not change the PDF's page-label dictionary or alter how a viewer counts physical pages. Tell readers which numbering system to use when both are present.

### Can a watermark prevent copying or screenshots?

No. It adds visible text and may help communicate handling expectations. It does not stop extraction, photography, screenshots, or editing by someone who can open the file.

### Why does my watermark fail with a special character?

The built-in Helvetica fonts do not support every Unicode character. Try plain supported text or use a PDF editor that can embed a font containing the required script. Avoid substituting symbols that change the intended meaning.

### Will numbering cover existing content?

It can if the selected location overlaps the page artwork. There is no automatic semantic detection of signatures or footnotes. Check a representative sample, including pages with unusually tight margins.

### Should I number pages before merging?

Usually finish the assembly first. Numbering separate sources independently can create duplicates or gaps after merging. If original numbers must be retained, add a clearly differentiated packet sequence and maintain a short index explaining the relationship.
