## Split a PDF into individual page files

Use splitting when a portal accepts one attachment per record, when a reviewer needs only selected pages, or when a long scan needs to be handled in smaller pieces. Keep a complete original and record the physical page numbers you intend to export. Printed labels such as iii, A-1, or 202 do not necessarily match the page positions used by this tool. The first page in the PDF is page 1 regardless of the number printed on it.

## How it works under the hood

The browser reads the selected PDF with pdf-lib. For each requested page, the script creates a new PDFDocument and copies that page's drawing objects into it. When several pages are requested, JSZip packages the separate PDFs into a ZIP download. A single selected page downloads directly as a PDF. The custom range mode still produces individual page files; it does not create one multi-page extract. Use Organize PDF when the desired result is one document containing a chosen sequence.

This object-copying approach avoids rasterizing the page, so its text and vector artwork usually remain usable. However, an outline, cross-page hyperlink destination, form definition, or attachment can depend on information outside the copied page. These features need separate checking. Saving new files also changes the signed byte sequence: extracted pages are not independently certified by a signature embedded in the source document.

## Step-by-step usage and best practices

Select one PDF and choose either every page or a custom range. Enter ordinary one-based page positions, for example 2-4,7. The current range parser accepts ascending ranges and comma-separated numbers; it filters positions outside the document and removes duplicates. Keep your range list simple so it is easy to compare with the required pages. Review your input carefully rather than treating silently ignored positions as confirmation that the intended pages exist.

Run Split and save the download. If you receive a ZIP, extract it before uploading the contents to a portal. Open the individual PDFs and compare their visible content to the original, especially around the beginning of the requested range. Page labels printed on the paper can be misleading after cover sheets are added. Keep an inventory when page files represent separate invoices, exhibits, or student submissions so that filenames retain useful context after extraction.

Do not use splitting as an assurance of secure redaction. Creating page-only files reduces the visible material being sent, but it does not constitute a forensic sanitization pass. Inspect metadata, annotations, and other embedded information with a suitable review tool if disclosure has legal consequences. Password-protected inputs need an authorized readable export; this splitter does not provide a password prompt. For huge scans, the archive and intermediate output can increase memory use even though individual pages are smaller.

## Split-specific questions

### Why did I receive a ZIP instead of one PDF?

Multiple selections are saved as individual PDFs and bundled for one download. Extract the ZIP to access them. The range option chooses which page files to create, rather than combining the range into one document.

### Can I enter 7-3 to reverse the pages?

Use ascending ranges such as 3-7. A descending range does not describe a valid sequence for this parser. If you need reverse or custom ordering in one file, select the relevant pages in Organize PDF instead.

### Why does page 5 contain printed page 3?

The tool counts physical PDF pages, including covers and blank inserts. Check the position in the viewer's page counter rather than the printed footer before entering ranges.

### Are cross-references updated after extraction?

No. A sentence saying see page 12 and a link to another source page may no longer be useful in a one-page export. Supply the necessary context or distribute a complete working copy when cross-references matter.

### Can splitting make a corrupted PDF readable?

Only if the source can first be parsed successfully. This is not an XRef repair utility. Ask the document owner for a fresh export if loading fails, and keep the damaged original for comparison before attempting recovery elsewhere.
