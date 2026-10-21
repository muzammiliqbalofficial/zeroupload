# Prepare PDF text for a reviewable LLM or RAG pipeline

Converting a PDF into Markdown can make its text easier to review, split into sections, and cite in a retrieval workflow. It does not make the document semantically correct automatically. The most important step is comparing extracted structure and facts with the source before sending text to a model or indexing it. This guide treats extraction, cleanup, chunking, and model submission as separate decisions with separate checks.

## Classify the document before extraction

Try selecting text in the original PDF. A scanned image without an OCR layer needs optical character recognition elsewhere before ordinary text extraction can work. A document with selectable text can still have a difficult reading order, especially if it contains multiple columns, marginal notes, tables, or positioned labels. Choose a sample that includes these features rather than testing only the cover page and assuming the rest will behave the same way.

Record a source identifier and physical page count. If a report has several revisions, keep its date or version with that identifier. The eventual retrieval system needs to distinguish a current policy from an obsolete one even when both have similar headings. Store the untouched PDF reference alongside the extracted output so a later answer can be checked against the artifact that actually supplied its text.

## Know what the extractor infers

ZeroUpload's extractor uses PDF.js getTextContent, groups items using vertical coordinates, and applies font-size thresholds to suggest Markdown headings. Common bullet prefixes become list markers. Page sections are separated in the output. This is not semantic AST recovery, document OCR, automatic table understanding, or an LLM call. Font size and position provide useful clues, but a pull quote can be mistaken for a heading and a small section title can be missed.

<table class="data-table"><caption>Review requirements before indexing</caption><thead><tr><th>PDF feature</th><th>Likely extraction issue</th><th>Required check</th></tr></thead><tbody><tr><td>Two columns</td><td>Interleaved reading order</td><td>Follow complete paragraphs</td></tr><tr><td>Financial table</td><td>Detached values and labels</td><td>Reconcile rows, units, and signs</td></tr><tr><td>Repeated footer</td><td>Noise in every chunk</td><td>Remove only after source comparison</td></tr><tr><td>Scanned page</td><td>No recognized text</td><td>Use and validate OCR separately</td></tr></tbody></table>

## Review the raw Markdown first

Select a short representative PDF and inspect both raw output and its preview. Compare heading hierarchy with the source contents. Follow several paragraphs through line and page breaks. Check whether a hyphen at a line ending is part of a word or a layout artifact before joining text. Inspect accented names, mathematical symbols, dates, negative values, and numbered references. A superficially tidy preview can hide a dropped line or a reordered column.

Treat tables as a separate review task. Reconstruct important rows explicitly with column labels and units. A value of 12 under a heading describing thousands is different from 12 currency units. Missing minus signs can reverse financial meaning. If a table is central to later questions, retain a reviewed structured representation rather than relying on the model to infer relationships from a flattened text block.

## Add provenance before chunking

Keep source filename, revision, physical page range, and a verified section label with every exported unit. The extractor's separators are not a complete citation system. When you remove repeated headers, preserve any header that carries meaningful section context. When you merge paragraphs across a page break, record the page span rather than arbitrarily assigning all of the text to the first page.

Choose chunk boundaries based on reviewed sections and paragraph meaning. A fixed character limit can split an exception from the rule it qualifies, while an entire chapter may exceed a model's useful context. Check your embedding model and retrieval system requirements in their own current documentation. This tool does not count model tokens, create embeddings, or decide which chunk length is appropriate for a particular deployment.

## Separate local extraction from model submission

The PDF-to-Markdown step does not send content to ChatGPT or another model. Uploading the result later is a new transfer governed by that service and your account's settings. Before doing so, confirm the permitted audience, processing arrangement, and retention policy for the material. Removing an obvious name may not anonymize a detailed report if its events, dates, or identifiers can still reveal a person.

Treat document text as untrusted input in automation. It can contain instructions aimed at a downstream model as well as ordinary source material. Keep the retrieval system's instructions separate from retrieved passages and preserve source citations for review. Do not allow a document sentence to authorize sending files, changing permissions, or executing commands. The conversion format changes presentation, not the trustworthiness of the content.

## Define a retrieval acceptance test

Create a synthetic three-page report with a known policy statement, an exception, and a small table. Write five questions whose answers and page references you know before indexing. After extraction and chunking, verify that the passages contain the necessary qualifier and that the correct table units survive. Then test retrieval and answer citations separately. A successful model answer by chance does not establish that the underlying chunks are complete or correctly attributed.

## Troubleshooting checklist

- Empty output: check for an image-only source and use a reviewed OCR workflow if needed.
- Repeated boilerplate: identify consistent headers and footers before removing them from a copy.
- Incorrect heading levels: compare font-size guesses with the source hierarchy and edit deliberately.
- Wrong numerical answer: inspect the extracted row, column label, unit, and sign before blaming retrieval.
- Missing citation: add source and page metadata before chunks enter the index.
- Model follows document instructions: treat retrieved text as data and review the system's trust boundaries.

Use [PDF to Markdown](/tools/pdf-to-markdown), [PDF to Word](/tools/pdf-to-word), and the [client-side processing assessment](/guides/client-side-pdf-security-guide) for related workflows. Keep the source available through every stage so users can verify answers rather than relying on a plausible summary alone.
