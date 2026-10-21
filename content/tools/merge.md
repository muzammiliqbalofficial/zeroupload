## Merge PDFs without losing track of the source pages

Combining statements, invoices, or application attachments is mainly an ordering problem. Decide which document belongs first before selecting files. Keep the original downloads in a separate folder, especially when filenames differ only by month. A merged file is a new document; it should not replace the source records until someone has checked its completeness. For financial packets, a short manifest containing the filename, statement period, and page count is often more useful than a complicated naming scheme.

## How it works under the hood

The merge script reads each selected File into a byte array and uses pdf-lib to load the PDF. It creates an empty PDFDocument, calls copyPages for each source page, and appends those pages in the displayed file order. Saving serializes the new object graph and writes the references needed by a PDF reader. This is JavaScript processing of PDF objects, not a screenshot conversion or a custom WebAssembly compressor. Page dimensions can differ within the resulting document.

Copying pages usually retains their drawing instructions, embedded fonts, and images, so ordinary selectable text remains text. Document-level features are different: bookmarks, attachments, forms, internal destinations, and accessibility structure are not guaranteed to transfer correctly. An existing certificate signature does not certify the newly assembled file. Keep signed originals and use a copy for convenience when a recipient requires evidence of the original signature.

## Step-by-step usage and best practices

Select at least two PDFs, review the visible file list, and use its reorder controls if the order needs changing. Check a statement's actual date rather than relying on alphabetical sorting: statement-10 can sort before statement-2. Remove accidental duplicates before running Merge. The output follows the file list and then the original page order within each file. Download the result with a descriptive name that includes the intended recipient or reporting period.

Open the downloaded PDF in a separate viewer. Add the source page counts and compare that sum with the result. Inspect the last page of one source and the first page of the next; these boundaries catch omissions quickly. Test any important hyperlinks and complete form fields before distribution. A document that looks correct in its first-page thumbnail can still have broken internal navigation or an unexpected blank separator halfway through.

For encrypted inputs, obtain an authorized unencrypted export first. Ignoring an encryption flag is not decryption, and this tool does not ask for source passwords. Very large batches need space for source bytes, parsed objects, and output at the same time. If a phone runs out of memory, merge smaller groups on a desktop, then combine the groups. There is no reliable universal maximum page count because a scanned page can require much more memory than a text page.

## Merge-specific questions

### Why did my bookmarks disappear?

Bookmarks live in the document catalog rather than simply inside each page. Copying the pages does not rebuild an outline across multiple source documents. Maintain a separate index or recreate navigation in an editor that supports document outlines.

### Can I combine A4 and Letter pages?

Yes, page copying retains individual page sizes. The result can contain both. Check print scaling before sending it to a printer; selecting one paper size does not mean every source page has been resized to match.

### Does merging compress my scans?

No deliberate image downsampling occurs in this tool. File size can change when objects are serialized, but a smaller result is not guaranteed. Use the compression tool separately after checking whether searchable text must survive.

### Will fillable forms still behave normally?

Do not assume that they will. Forms can share field names and catalog-level resources. Test actual field behavior in the saved result, or flatten a working copy in a suitable form editor before assembling the packet.

### How do I verify that nothing was uploaded?

Use browser developer tools to inspect network requests while merging a nonconfidential sample. Selected files are read locally and the result is a browser Blob download. Loading libraries or advertising is a separate network activity described in the privacy policy.
