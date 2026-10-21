## Choose compression according to what the recipient needs

An attachment limit is a concrete requirement: measure the original in bytes and find out whether the receiving service uses decimal megabytes or binary mebibytes. A 10 MB limit may reject a file that an operating system rounds to 10 MB. Leave some margin and keep the source. A smaller file is only a successful result if small text, stamps, and required information remain readable in the downloaded copy.

## How it works under the hood

Lossless mode loads the document with pdf-lib and saves it using object streams. It rewrites the existing document structure without deliberately turning pages into images. The implementation does not include a dedicated duplicate-font removal pass, font subsetting engine, or universal metadata sanitizer. An already optimized PDF can stay the same size or grow. Lossless describes the intended preservation of page content, not a guarantee that every byte or certificate signature remains unchanged.

The other three modes use PDF.js to render each page onto a browser canvas, encode that canvas as JPEG, and place the image onto a new pdf-lib page. Low Compression uses scale 2.0 and JPEG quality 0.85; Balanced uses 1.5 and 0.65; Extreme uses 1.0 and 0.45. These quality values are encoder settings, not percentages of retained visual information. This is local JavaScript and canvas processing, not a separate WebAssembly optimization service.

Raster modes flatten the page appearance. Selectable text, working form fields, bookmarks, and live links are not rebuilt into the output. A scan may shrink substantially, while a text-only source can grow because clean vector text is replaced by pixels. With the standard PDF coordinate scale, 1.0 corresponds to about 72 pixels per inch, 1.5 to 108, and 2.0 to 144. Small footnotes and fine line art are particularly sensitive to that resolution change.

## Step-by-step usage and best practices

Select one PDF and begin with Lossless if searchability, accessibility, or copying text matters. Download the result and compare the actual file sizes. If it exceeds the receiving limit and a flattened copy is acceptable, try Balanced next. Check small numerals, punctuation, and signature details at a normal viewing size and at enlarged zoom. Switch to Low Compression when Balanced damages detail; use Extreme only after checking representative difficult pages.

Retain the original alongside any compressed derivative. Do not run a signed original through compression when its certificate validity must be maintained. Password-encrypted files need an authorized decrypted copy first; this tool does not provide a source-password field. For scans with hundreds of pages, close other busy tabs or process smaller batches. A decoded canvas needs several bytes per pixel before JPEG encoding, so disk size alone is a poor predictor of whether a mobile device can finish the operation.

## Compression-specific questions

### Why did my file get larger?

Object streams may add overhead to a tiny document, and rasterizing simple text can be far less efficient than storing its original font and text commands. Compare the result with the source and keep whichever meets your needs.

### Why can I no longer select text?

The Low, Balanced, and Extreme modes produce image pages. Use Lossless when text selection or screen-reader access matters. OCR would be a separate operation and is not performed by this compressor.

### Is a 40 to 75 percent reduction guaranteed?

No. Savings depend on source images, existing encoding, and the selected mode. The before-and-after byte counts are the useful measurement for your document; there is no defensible universal reduction percentage.

### What should I check before submitting a compressed form?

Confirm that filled values remain visible, every page is present, and the receiving organization accepts a flattened copy. Interactive fields will not remain interactive after raster compression.

### Can I reduce size without invalidating a certificate signature?

Any rewrite can invalidate a signature covering the original bytes. Preserve and submit the signed original when that verification is required. Ask the issuer for a smaller signed export rather than modifying the certified file yourself.
