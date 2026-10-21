# Assess client-side PDF processing for sensitive workflows

The first useful security question is where a document's bytes go during an operation. A server converter receives those bytes; a local browser converter can operate without sending them to a conversion server. That difference changes the data flow, but it does not answer every question about confidentiality, compliance, device security, or software trust. Assess the actual workflow and its dependencies before choosing a tool for sensitive material.

## Draw the data flow

Start with a synthetic document containing no real personal information. List where it is stored before selection, which application reads it, what code processes it, and where the output is saved. For ZeroUpload's PDF tools, browser File objects supply byte arrays to JavaScript libraries. PDF.js renders or extracts content, pdf-lib edits PDF objects, and other libraries handle specific formats. The result becomes a browser Blob download. This implementation does not justify claiming that every operation is a custom WebAssembly engine.

Separate that document path from the website path. Loading a page requests HTML, scripts, fonts, and possibly advertising resources. Hosting providers and CDNs can receive network metadata such as IP addresses and request headers even when no document is uploaded for processing. A contact submission intentionally sends the text entered into the support form. Those are distinct activities and should appear separately in any internal assessment or privacy notice.

## Compare deployment models by responsibility

<table class="data-table"><caption>Questions for a workflow assessment</caption><thead><tr><th>Model</th><th>Document processing</th><th>Questions to resolve</th></tr></thead><tbody><tr><td>Local browser tools</td><td>On the user's device</td><td>Code sources, extensions, output handling</td></tr><tr><td>Server conversion service</td><td>On a provider's infrastructure</td><td>Access controls, retention, contracts, locations</td></tr><tr><td>Managed desktop software</td><td>Usually on a managed endpoint</td><td>Updates, telemetry, local storage, licensing</td></tr></tbody></table>

Do not assume that a named cloud provider keeps every file indefinitely or that a local tool is automatically compliant. Products and organizational settings differ. Review the current contract and documented configuration for any service being considered, including services marketed under familiar brands. A fair comparison describes observed behavior and the questions still open rather than making unsupported claims about competitors.

## Test the browser path with an identifiable fixture

Create a harmless PDF containing a unique sentence that you can recognize. Open developer tools before selecting it and preserve the network log. Run a representative operation and examine requests made during file selection, processing, and download. Check request bodies where appropriate, not just destination names. An ordinary script download can be expected while a request containing the fixture's text or file bytes would require investigation.

Repeat with the page and its required libraries already loaded, then switch the browser network setting offline. A successful operation supports the observation that this tested path can run locally after dependencies are available. It does not prove that every tool or future release behaves identically. Offline readiness also varies because PDF.js workers and other resources may load lazily. Record the exact tool, version or deployment, input, and browser conditions with your result.

## Include code delivery and endpoint trust

JavaScript running on a page can access files the user deliberately selects for that page. Local processing therefore still depends on trusting the delivered code and third-party scripts. Review library sources, update practices, and whether remote resources are pinned or self-hosted. A browser sandbox limits some capabilities, but it does not prevent the page's own script from reading a selected file. Third-party advertising is a separate trust consideration even though the application does not intentionally provide document contents to it.

The endpoint also matters. Browser extensions, endpoint agents, malware, shared accounts, synchronized downloads, and screen capture can expose content outside the conversion application's data flow. A managed workstation with a reviewed browser profile offers different controls from an unknown shared computer. Closing a tab is not a secure-erasure guarantee; memory reclamation and operating-system paging are controlled by the platform, and downloaded files remain on disk.

## Treat compliance as a workflow decision

Local processing can support data minimization by reducing document transfers. It does not establish all requirements for a healthcare, employment, financial, or legal workflow. The organization still needs a basis for processing, approved access, suitable retention, and controls over the final delivery. The [EDPB's privacy-by-design overview](https://www.edpb.europa.eu/topics/ai-and-technology/privacy-by-design-and-by-default_en) describes embedding protection into systems and defaults; it is not a certification of this website.

For a HIPAA-regulated workflow, route the assessment through the responsible compliance and security teams. [HHS guidance on cloud computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html) discusses obligations relevant to cloud arrangements. The absence of a conversion upload does not by itself settle the status of every other service, device, or disclosure in the workflow. Do not put patient data into a test file merely to evaluate these mechanics.

## Troubleshooting checklist

- Unexpected request: identify whether it is a library, ad, hosting request, contact submission, or document-content transfer.
- Offline failure: identify any worker or dependency that had not finished loading before disconnection.
- Large memory spike: distinguish decoded images and output buffers from the compressed input size.
- Privacy-policy mismatch: compare the observed path with the policy's separate document, advertising, and support sections.
- Unsupported compliance claim: request the evidence and organizational approval needed for the actual use case.
- Shared-device exposure: review downloads, browser extensions, backup settings, and local access controls.

Use the [privacy policy](/privacy), the [network-inspection guide](/guides/understanding-client-side-file-privacy), and [secure sharing guidance](/guides/best-practices-for-secure-pdf-sharing) to document the full path from source to recipient. A useful assessment states what was observed, what remains untested, and who owns the remaining controls.
