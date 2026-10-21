## Export pages at the resolution your workflow needs

PDF to Images turns each PDF page into a JPG or PNG file and bundles the results in a ZIP. Use it for page thumbnails, slide illustrations, visual review packets, or systems that accept images rather than PDFs. Decide whether the destination needs legible fine print or only a small preview before choosing a scale. Keeping the original PDF gives you a better source for later higher-resolution exports than repeatedly enlarging a small image.

## How it works under the hood

PDF.js loads the source and renders each page to a browser canvas at the selected scale. The canvas encoder creates either PNG bytes or JPEG bytes; the JPEG path uses quality setting 0.9. JSZip adds one named image per page and builds the final archive. Only a limited number of preview images are displayed on the page, but the archive is intended to contain every rendered page. No server performs the rendering or receives your selected PDF.

Resolution is determined by the PDF page dimensions and render scale. Under the usual 72-points-per-inch PDF coordinate convention, scale 1 produces about 72 pixels per inch, scale 2 about 144, and scale 3 about 216. Doubling both dimensions creates roughly four times as many pixels. Actual encoded size depends on the page content: a photograph and a line drawing with the same dimensions can compress very differently.

## Step-by-step usage and best practices

Select one PDF and choose JPG for photographic material when file size matters. Choose PNG for crisp diagrams, text screenshots, or lossless storage of the rendered pixels. PNG does not recover information absent from the source; it simply avoids another lossy JPEG step. Pick a moderate scale and export a representative sample. Inspect tiny numerals, labels, and line art at the destination's intended display size before committing to a long batch.

Download and extract the ZIP. Count the image files and compare the count with the PDF's physical page count. The filenames include page positions, so remember that alphabetical sorting can put page 10 before page 2 in another application. Check a portrait page and a landscape page for expected orientation. A page image preserves appearance, not working links, selectable text, interactive fields, or a certificate signature's verification data.

For sensitive material, remember that an image can reveal everything visible on the PDF page, including faint annotations and signatures. Review it before sharing and keep exports out of public photo-sync folders if that conflicts with your handling policy. Password-encrypted inputs require an authorized unencrypted source because this tool does not provide a password prompt. On a memory-constrained device, reduce scale or split the PDF first; the archive, encoded images, and current canvas all consume memory during export.

## Image-export questions

### Why do I see fewer previews than files in the ZIP?

The interface limits visible previews to keep the page manageable. Inspect the extracted archive and compare its file count with the source document. The preview area is not an authoritative inventory of exported pages.

### Does PNG mean the result matches original PDF vectors?

No. PDF vectors have been rasterized at the chosen scale. PNG preserves those rendered pixels without JPEG loss, but zooming far beyond their resolution still reveals pixels.

### Which format is best for scanned photographs?

JPG often stores photographic pages more efficiently. PNG can be useful when avoiding another lossy encoding is essential, but its file can be larger. Compare one difficult page instead of assuming a fixed size ratio.

### Can I export transparent backgrounds?

Do not rely on a transparency workflow here. The result follows the renderer and canvas encoding used by the tool. Open a sample in your target application and check the background before using it as a design asset.

### Will converting the images back restore the original PDF?

No. Rebuilding a PDF from page images creates image pages. It does not restore the original text layer, links, forms, tags, or signatures. Retain the original PDF whenever those features may matter later.
