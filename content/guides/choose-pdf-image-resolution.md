# Choose PDF image resolution for readable exports and smaller packets

Resolution decisions are easiest when you know how the output will be used. A small website thumbnail, an image for a slide, and a printed receipt packet need different pixel dimensions. Exporting every page at the largest scale can waste memory and storage without improving the final use. Exporting too small can make fine print unreadable. This guide connects page dimensions, render scale, file format, and a practical visual review.

## Start with the destination

Ask whether the image will be displayed on screen, inserted into another document, or printed. Record the intended display or print dimensions and identify the smallest detail that must remain legible. A slide illustration may need only its chart labels; a receipt packet may need a faint tax identifier. Keep the original PDF or original photos so you can generate another derivative without enlarging an already low-resolution export.

Choose a representative difficult page for the first experiment. Include small text, thin rules, a photograph, and colored labels if those appear in the actual document. Inspect the source itself before blaming conversion: low-resolution scans cannot acquire missing detail merely by being rendered into more pixels. A larger canvas can make the existing blur larger while consuming substantially more memory.

## Relate PDF points to pixels

Under the usual PDF coordinate convention, 72 points represent one inch. Rendering a 612 by 792 point Letter page at scale 1 produces approximately 612 by 792 pixels. Scale 2 gives approximately 1224 by 1584, or four times the pixel count. Scale 3 gives approximately 1836 by 2376, or nine times the original count. These are geometric calculations for a standard page, not measured output-size guarantees.

<table class="data-table"><caption>Calculated Letter-page render sizes</caption><thead><tr><th>Scale</th><th>Approximate pixels</th><th>Uncompressed RGBA buffer</th></tr></thead><tbody><tr><td>1</td><td>612 × 792</td><td>1.94 million bytes</td></tr><tr><td>2</td><td>1224 × 1584</td><td>7.76 million bytes</td></tr><tr><td>3</td><td>1836 × 2376</td><td>17.45 million bytes</td></tr></tbody></table>

The buffer estimates multiply width by height by four bytes. Real peak memory can be higher because the parser, encoded images, archive, and temporary buffers coexist. A compressed PDF's disk size therefore cannot predict browser memory use reliably. A mobile browser may stop a large operation even when the source seems small enough to email.

## Choose JPG or PNG based on content

JPG is often efficient for photographs and scanned continuous-tone pages. It uses lossy encoding, so fine edges and small text can show artifacts. PNG stores the rendered pixels without that JPEG loss and can be useful for diagrams, line art, and text screenshots. It is not automatically smaller: noisy scans can produce large PNG files. Compare the actual output from one difficult page before choosing a format for a long export.

ZeroUpload's PDF-to-Images tool renders with PDF.js and uses the canvas encoder. The JPG path uses a quality setting of 0.9. That value is not a percentage of detail retained and does not guarantee a particular compression ratio. PNG also does not preserve the original vector nature of PDF artwork; both formats represent a rasterized page at the selected dimensions.

## Run a visual acceptance test

Export the sample at a moderate scale and open the image in the application that will consume it. View it at the intended display size, not only at a zoom level chosen to hide artifacts. Check tiny numerals, punctuation, signatures, labels, and line intersections. If it will be printed, make a sample print using the actual paper and scaling settings. Increase scale only when the additional detail improves that use.

Record format, scale, resulting dimensions, encoded bytes, and the review result. If two settings look equivalent at the target size, the smaller output may be sufficient. If the source is blurry at every setting, obtain a better scan rather than repeatedly exporting at higher scales. Keep the acceptance sample with the working notes so another person can understand why a particular setting was chosen.

## Assemble images back into PDF carefully

Images to PDF embeds each JPG or PNG on its own page. A4 and Letter modes fit proportionally onto standard paper; Auto follows the image aspect ratio within implementation limits. The operation does not perform OCR or create a searchable text layer. It also does not deliberately reduce all source image pixels before embedding, so putting a large photograph onto a small displayed page does not necessarily make the file small.

Review image order and orientation before assembly. Cropping and rotation are best handled on approved working copies before selection. Check for unrelated background material in photos and do not assume that embedding a picture sanitizes its metadata. After downloading, count pages against input images and inspect the first, last, and any unusual landscape page. A standard page size can introduce whitespace around narrow receipts without cropping them.

## Troubleshooting checklist

- Tiny text is blurry: increase scale on a fresh source, then check whether the original actually contains more detail.
- PNG is unexpectedly large: compare JPG on photographic material and review artifacts at the target size.
- Browser stops exporting: reduce scale, split the source, or use a device with more available memory.
- Rebuilt PDF is unsearchable: image embedding does not include OCR or restore the original PDF text layer.
- Image sequence looks wrong: inspect page-number filenames and the receiving application's sort behavior.
- Print has large margins: compare image proportions with A4 or Letter and choose an appropriate page mode.

Use [PDF to Images](/tools/pdf-to-images), [Images to PDF](/tools/images-to-pdf), and the [compression guide](/guides/how-to-compress-pdf-without-losing-quality) to compare the related operations. Choose the smallest reviewed representation that preserves the detail the recipient actually needs.
