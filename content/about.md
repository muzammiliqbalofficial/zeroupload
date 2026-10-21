# About ZeroUpload

ZeroUpload provides fifteen browser tools for editing, assembling, and converting PDF documents. The application reads selected documents locally and generates downloads on your device. You can use it without creating an account. Our purpose is to make ordinary PDF tasks understandable, including the limitations that matter before you share the result.

## What runs on your device

pdf-lib copies and edits page objects. PDF.js renders previews and extracts text. JSZip packages multi-file downloads. The conversion tools use format-specific libraries including docx, Mammoth, html2canvas, and jsPDF. These are JavaScript and browser-canvas workflows; we do not claim that every tool runs a custom WebAssembly engine. Tool pages explain the actual path used by each operation.

The application does not have a PDF-upload endpoint or maintain a server document vault. Generated files are local downloads. The website still makes normal hosting and advertising requests, and a message submitted through Contact is intentionally transmitted to support. Read the [privacy policy](/privacy) for those separate data paths and their retention limits.

## Capabilities and tradeoffs

Merging, rotation, and page editing generally work with original page objects. Raster compression, protection, unlocking, and Word-to-PDF conversion can instead create image-based pages. Image pages do not automatically retain selectable text, interactive fields, links, or accessibility tags. Protect PDF currently uses legacy jsPDF encryption, so it should not be chosen for a requirement that mandates modern AES encryption. Visible signature placement is an image overlay, not a certificate-signing service.

We encourage keeping originals, testing representative samples, and reviewing the actual downloaded result. A successful operation does not establish compliance, legal validity, or suitability for every document. Browser memory and source structure affect what can be processed. We do not promise a universal file-size limit, guaranteed compression percentage, or durable offline installation.

## Documentation and maintenance

The [guides library](/guides) covers concrete workflows, troubleshooting checklists, comparison tables, and reproducible test conditions. It distinguishes measured fixture behavior from illustrative arithmetic. The [engineering log](/updates) records changes supported by repository history and this maintenance revision. Dates describe documented work, not a fabricated schedule of past releases.

## Contact the project

Use [Contact](/contact) for bug descriptions, feature suggestions, or privacy requests. Submit a browser version, approximate document size, and reproducible steps without confidential files or passwords. The form saves a support record and returns a reference; response time depends on review availability. See [Terms](/terms) for acceptable use and service limitations.
