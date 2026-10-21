# Compress a PDF while preserving the qualities that matter

There is no single definition of quality for every PDF. A scanned photograph needs adequate image detail; a searchable report needs a text layer; a signed certificate may need its original bytes. Start with the receiving workflow, then choose an operation that preserves those requirements. A smaller attachment that cannot be searched, read, or verified is not an improvement just because the download completed successfully.

## Establish the acceptance criteria

Find the exact attachment limit and whether it applies per file or to the entire submission. Record the source size in bytes rather than relying only on a rounded desktop label. Write down what must survive: readable small text, color, selectable words, links, forms, or certificate verification. Keep the source file separately so you can compare each experiment and recover from a poor choice without repeatedly compressing an already degraded copy.

Choose representative pages for review. Include the smallest footnote, a page with fine chart lines, a photograph, and a filled form when those occur in the document. A large heading on the first page is a weak quality test. For monochrome scans, inspect punctuation and faint stamps; for charts, inspect legends and adjacent colors. Ask how the recipient will read or print the document, since a phone preview and a full-size paper copy reveal different problems.

## Distinguish structural saving from raster compression

ZeroUpload's lossless path loads the PDF with pdf-lib and saves it using object streams. It does not include a bespoke font deduplication or image recompression engine. The source may already use an efficient representation, so the output can be nearly the same size or larger. This mode is the sensible starting point when keeping text objects matters, but it still rewrites the file and should not be used to preserve certificate signature validity.

<table class="data-table"><caption>Actual compression settings in this implementation</caption><thead><tr><th>Mode</th><th>Method</th><th>Primary tradeoff</th></tr></thead><tbody><tr><td>Lossless</td><td>pdf-lib object-stream save</td><td>No guaranteed size reduction</td></tr><tr><td>Low</td><td>Scale 2.0, JPEG 0.85</td><td>Image pages at about 144 pixels per inch</td></tr><tr><td>Balanced</td><td>Scale 1.5, JPEG 0.65</td><td>Image pages at about 108 pixels per inch</td></tr><tr><td>Extreme</td><td>Scale 1.0, JPEG 0.45</td><td>Image pages at about 72 pixels per inch</td></tr></tbody></table>

## Understand what rasterization removes

The three raster modes use PDF.js to draw each page on a canvas, encode it as JPEG, and place that image on a new PDF page. The visible text becomes pixels. Working form fields, bookmarks, links, and accessibility tags are not rebuilt. A report made mainly of compact text commands can actually grow when converted to full-page images. The JPEG quality setting is an encoder input, not a percentage of information retained or a guaranteed reduction in bytes.

Under the standard PDF coordinate convention, doubling render scale doubles width and height, giving roughly four times as many pixels. That relationship explains both detail and memory cost. It does not predict the encoded output precisely because compression efficiency depends on the image. A flat white page and a noisy scanner background with equal dimensions can produce very different JPEG sizes.

## Run a controlled comparison

Start with Lossless, download the result, and compare it with the untouched source. Record the mode, input bytes, output bytes, and the features tested. Calculate reduction as 100 times one minus output divided by input. For example, reducing an illustrative 8,000,000-byte file to 6,000,000 bytes is a 25 percent reduction. That calculation is an example, not a measured claim about typical ZeroUpload documents.

If rasterization is acceptable, try Balanced on a fresh source copy. Open the output in a separate reader, search for a known phrase, and inspect the difficult sample pages. Move to Low if fine detail is damaged. Use Extreme only when the recipient accepts its appearance and the loss of text features. Never judge success only from a positive percentage: the output could be smaller while omitting a feature the reviewer depends on.

## Prefer a better source when possible

If compression cannot meet the limit without unacceptable damage, ask for a new export from the original authoring application. Oversized source photographs can often be resized before PDF generation more deliberately than after the document is flattened. A scanner can also be configured for an appropriate resolution and background treatment. Avoid repeatedly running lossy compression, which adds further degradation without restoring anything lost in the previous pass.

If the original is signed, ask the issuer for a smaller signed version or a permitted alternative delivery method. If the issue is browser memory, process a smaller authorized section on a desktop and verify how the sections will be delivered. Changing the filename to .zip or .pdf does not alter the underlying encoding or bypass a receiving service's validation reliably.

## Troubleshooting checklist

- Larger output: determine whether compact text was converted into images, then compare the lossless path.
- Blurry small print: increase raster scale or retain the source; check the recipient's actual viewing conditions.
- Unsearchable document: use lossless mode or a different source export that retains text.
- Rejected attachment: compare exact byte limits and leave room below the maximum.
- Broken form behavior: send a retained interactive original if the recipient needs to edit fields.
- Signature warning: preserve the original signed bytes and consult the issuer's delivery requirements.

The useful endpoint is a reviewed file that meets a defined receiving limit with documented tradeoffs. Use [Compress PDF](/tools/compress) for the comparison, the [image export tool](/tools/pdf-to-images) for visual assets, and the [document privacy guide](/guides/understanding-client-side-file-privacy) to understand the separate website network activity.
