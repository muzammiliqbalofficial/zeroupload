# Verify local PDF processing with browser developer tools

You can examine a local-processing claim without using confidential documents. A small synthetic PDF and a preserved browser network log provide a practical starting point. The purpose is to observe what happens during one defined operation, distinguish document bytes from ordinary website requests, and record enough context that someone else can repeat the check. This is a repeatable inspection workflow, not a promise that one test proves every possible security property.

## Prepare a harmless marker document

Create a short PDF with a unique sentence such as Local review marker 2026 example. Include a second page with a different marker if page selection is part of the test. Save it in a temporary working folder, note its exact byte size and page count, and keep a copy unchanged. Do not insert customer names, real signatures, credentials, or private identifiers. A recognizable synthetic marker is sufficient to investigate the document path.

Use a fresh browser profile when possible, and record which extensions are enabled. Extensions can add requests unrelated to the site and complicate interpretation. Open the intended tool over HTTPS or a local development origin rather than directly opening an HTML file from disk. Record the full route, date, browser version, and tool settings. Those details help distinguish a change in application behavior from a change in browser caching or configuration.

## Capture the page load separately

Open developer tools and select the Network panel before reloading. Enable preservation of the log if navigation would otherwise clear it. Observe the initial HTML, stylesheet, font, library, worker, and advertising requests. Some may come from third-party hosts. The presence of these requests does not by itself show that a PDF has been uploaded; no PDF has been selected yet. It does show that local document processing is different from a website making no network connections.

<table class="data-table"><caption>Classify requests by what they carry</caption><thead><tr><th>Request kind</th><th>Typical content</th><th>Inspection question</th></tr></thead><tbody><tr><td>Page or library load</td><td>HTML, JavaScript, CSS, fonts</td><td>Is the expected resource being retrieved?</td></tr><tr><td>Advertising request</td><td>Ad resources and browser metadata</td><td>Does the privacy notice explain this activity?</td></tr><tr><td>Document transfer</td><td>Selected file bytes or extracted content</td><td>Does a processing step send the fixture?</td></tr><tr><td>Support submission</td><td>Entered contact fields</td><td>Was the submission intentional and acknowledged?</td></tr></tbody></table>

## Observe selection and processing

Clear the display or make a note of the time when the page has settled. Select the marker PDF and run the tool. Watch for new requests during preview creation, processing, and download. Inspect payloads of suspicious requests rather than assuming that all POST requests are document uploads or all GET requests are harmless. Search for the marker where the developer tools allow inspection, and compare large request bodies with the fixture's structure.

A browser Blob download can produce a local blob URL rather than an HTTP upload to a server. That is consistent with generating an output in browser memory. Still inspect the full sequence because a local download and a separate network transmission could coexist in another application. If you find a request you cannot interpret, preserve a sanitized description of its destination and timing, then investigate with a nonconfidential fixture instead of exposing real document data in a support report.

## Run an offline experiment carefully

Wait for required scripts and workers to finish loading, switch the network panel to offline, and repeat the operation on the fixture. If it completes, record that this particular path worked after its dependencies were available. If it fails because a worker or library was first requested after disconnection, load that resource online and repeat. Do not describe a failed first load as proof that the document was sent to a server.

ZeroUpload does not promise that a complete fresh session will work with no network connection. Its service worker currently removes old caches rather than maintaining a durable offline package. Browser HTTP caching can help a previously loaded session, but it is not a controlled installation mechanism. Test each required tool in the conditions you intend to use, especially on devices with storage cleanup or restrictive browser settings.

## Inspect local persistence separately

Review the Application or Storage panel for localStorage, cookies, IndexedDB, cache entries, and service-worker state. A saved theme preference differs from a stored document. Advertising cookies also differ from PDF byte storage. Record what each entry appears to represent and avoid deleting evidence before completing the inspection. For a clean repeat, use a new profile or clear site data after preserving only nonsensitive notes.

Closing a tab ends access to its normal editing state but does not guarantee secure erasure from memory, swap, crash records, or device backups. A file you downloaded remains in the downloads folder until managed through the operating system. A privacy assessment should therefore include output handling and endpoint controls. Local conversion reduces one transmission path; it does not control every place an organization can create or retain a copy.

## Troubleshooting checklist

- Missing network entries: open developer tools before loading the page and enable log preservation.
- Ambiguous third-party request: identify the initiator and inspect its payload using the synthetic marker.
- Offline-only failure: look for a dependency that loads lazily on first use.
- Unexpected saved data: compare before and after storage snapshots and identify the owning script.
- Conflicting privacy wording: compare document operations with hosting, advertising, and contact-form disclosures separately.
- Unrepeatable result: record browser version, extensions, cache state, and exact settings before another run.

Share only sanitized findings through [Contact](/contact). The [security assessment guide](/guides/client-side-pdf-security-guide) explains the larger trust model, while the [privacy policy](/privacy) describes the intended data paths. A careful observation is most useful when its scope and limitations are recorded alongside its outcome.
