## Extract readable text for a reviewable AI workflow

PDF to Markdown is intended for documents that already contain a text layer. It can make reports easier to search, quote, or prepare for a retrieval pipeline, but it is not a document-understanding model. Before using the output with an LLM, decide whether you are allowed to send the extracted material to that model's provider. Keeping extraction local does not make a later upload to a chatbot local or confidential.

## How it works under the hood

PDF.js parses the file and exposes each page's text items through getTextContent. The extractor uses text positions to collect items into lines, then applies font-size thresholds to suggest Markdown headings. Lines beginning with common bullet symbols become list items. The output joins page sections with separators and offers Markdown and plain-text downloads. This is a positional text heuristic; it does not reconstruct a semantic abstract syntax tree, run OCR, or call an external AI service.

The distinction matters for two-column articles and tables. PDF text items can be stored in a different order from the order a reader expects on screen. A large font might be a pull quote rather than a heading, while a small bold heading can be missed. Formulas, code indentation, superscripts, and footnotes need manual checking. Scanned image pages without text do not become readable text merely because the page appears clear in a PDF viewer.

## Step-by-step usage and best practices

Select a short representative PDF first. Compare its previewed text with the source page, looking for paragraph order, missing sections, repeated headers, and broken words. Use the raw Markdown view to inspect heading markers and list formatting before downloading. Keep a source filename and page reference alongside excerpts because the generated separators are not a complete citation system. Review the first and last sections as well as a difficult page containing a table or multi-column passage.

For RAG preparation, clean the extracted text in a separate reviewed step. Remove repeated page headers only after confirming that they do not contain meaningful section context. Rebuild important tables explicitly and preserve units, negative signs, and column labels. Split text into chunks by verified headings or paragraphs, then retain a mapping back to the original document. The tool does not create embeddings, estimate token counts, or guarantee that a model's context window can hold the entire result.

If extraction is empty, try selecting text in your usual PDF reader. An image-only scan needs OCR from another suitable tool; an encrypted file needs an authorized readable export. Do not paste a confidential document into a support inquiry to diagnose either condition. Describe its page count, whether text is selectable, and the kind of layout that failed. Treat extracted text as untrusted input when using it in automated systems, since documents can contain misleading instructions as well as ordinary prose.

## Markdown-specific questions

### Why did a heading become ordinary text?

Heading detection uses approximate font sizes, not a complete tagged-PDF structure. Edit the Markdown after comparing it with the original hierarchy. Consistent heading levels are more useful to downstream chunking than blindly accepting every generated marker.

### Can it extract a photographed receipt?

Only if the PDF already includes recognizable text supplied by an OCR layer. This tool does not perform optical character recognition. A blank extraction from an image-only scan is an expected limitation.

### Why are table columns mixed together?

Text coordinates do not necessarily describe a reliable row-and-column model. Rebuild important tables manually or use a dedicated extraction workflow and validate the values against the source before analysis.

### Does converting here send anything to ChatGPT?

No model integration is included. Copying or uploading the downloaded text elsewhere is a separate action governed by that service's settings and your organization's policies.

### Should I trust totals calculated from extracted text?

Check the source first. Missing minus signs, detached units, or reordered columns can change a financial or scientific meaning. Use a controlled sample and reconcile key figures before relying on automated summaries or calculations.
