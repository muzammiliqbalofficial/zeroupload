## Correct page orientation without rescanning

Rotate PDF is intended for documents whose page content is readable but displayed sideways or upside down. It changes the way selected pages are oriented in the saved document. Work from a copy, identify the affected physical page positions, and distinguish a rotated scan from a landscape page that is already correct. A wide spreadsheet may be meant to remain landscape even when the neighboring pages are portrait letters.

## How it works under the hood

PDF.js creates small browser-canvas previews so you can identify pages. The export path uses pdf-lib to load the original PDF and set each selected page's rotation. It reads the existing rotation and adds the requested angle modulo 360 degrees. This writes the page's rotation metadata rather than decoding and recompressing all its pictures. Text drawing instructions and image data are generally retained, avoiding the quality loss of a screenshot-and-rebuild workflow.

Preview rendering and final export are different stages. A soft thumbnail does not mean the final PDF has been downsampled. However, modifying a document still requires serialization and can affect certificate signature verification. Unusual page crop boxes, annotation coordinates, and existing form widgets can also complicate how a viewer presents the result. The tool does not automatically repair every nonstandard PDF geometry issue or normalize the original drawing coordinates.

## Step-by-step usage and best practices

Select one PDF and wait for its page previews. Choose whether to rotate all pages or only specified positions using the available interface. Enter a simple ascending range or comma-separated list when needed. Use the PDF's physical positions, starting at 1, rather than any printed page labels. Choose the desired angle and check its direction on a short example before applying it to a large document with mixed orientations.

Run the tool and save the rotated copy. Open the actual download and inspect both an affected page and a page that should remain unchanged. Check page count, readable orientation, and the position of any comments or fields. A viewer may have its own temporary rotate-view command; make sure you are examining the downloaded document from a fresh view, rather than relying on a rotation that exists only inside a previous viewer session.

Keep the source if it contains a certificate signature or is part of a controlled record. Page rotation can be convenient for reading, but it does not make the output the original signed artifact. Password-protected documents need an authorized unencrypted export first; this tool does not ask for source passwords. If a preview does not load, confirm that libraries can load in the browser and that another viewer can open the source. Rotation cannot repair an unreadable file simply by changing its extension.

## Rotation-specific questions

### Will rotation make my scanned text blurry?

The export changes rotation metadata instead of resampling the scan. It should not deliberately lower the image resolution. Check the final download if the source has unusual page geometry or annotations.

### Why does a second 90-degree rotation look different?

The requested angle is added to the existing rotation. Applying 90 degrees twice results in a cumulative 180-degree change. Return to the original copy if you want an unambiguous starting point.

### Can I rotate only page 4 and pages 8 through 10?

Use the specific-page option and a range such as 4,8-10. Check the source count first and avoid descending or out-of-range entries. Verify those boundaries in the saved result.

### Why are the comments in an unexpected place?

Annotations and widgets can use coordinate conventions that interact with page rotation and crop settings. Test a representative annotated page. If placement is wrong, use an editor that can adjust annotation geometry explicitly.

### Is rotating in my browser viewer enough?

Some viewer commands change only the current display. This tool produces a newly saved document with a stored page rotation. Reopen the download in a second viewer to confirm that orientation survives outside the editing session.
