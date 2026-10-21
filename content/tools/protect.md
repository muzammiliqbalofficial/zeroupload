## Understand the protection before choosing it

Protect PDF adds an opening password to a newly generated visual copy of a PDF. It is important to match that protection to the sensitivity of the document. This implementation uses jsPDF's legacy PDF encryption support, not AES-256. Do not treat it as modern high-assurance protection for regulated records or valuable secrets. Choose a maintained encryption workflow with independently verified modern settings when that is required by your organization or recipient.

## How it works under the hood

PDF.js renders each source page to a canvas at scale 2.0. The script encodes the result as JPEG at quality 0.92 and adds the image to a jsPDF document with the original page dimensions. The jsPDF constructor receives the selected password as both userPassword and ownerPassword, with printing allowed. The bundled jsPDF encryption implementation uses the legacy RC4 PDF security handler. A longer password does not change the encryption algorithm or turn that handler into AES.

This path rebuilds the document as pictures before encrypting it. Searchable text, live links, form widgets, accessibility tags, bookmarks, and certificate-signature evidence are not recreated. The result may look similar on screen while having a very different internal structure and a larger size. Permissions such as printing are instructions interpreted by PDF readers; they do not prevent someone who can view the document from photographing or otherwise reproducing the visible information.

## Step-by-step usage and best practices

Start with an unencrypted PDF that you are authorized to modify. Read the protection notice and decide whether this visual-copy workflow is appropriate. Enter a unique password that is not used for an account or another sensitive system. Generate the copy, download it, and open it in a separate PDF viewer. Confirm that it asks for a password before displaying the pages, rejects a wrong password, and shows every page correctly after the right password is entered.

Review small print and any filled form values in the output because they have been rasterized. Keep the source separately if selectable text or accessibility is important. Share the password through a different channel from the document, following the recipient's handling rules. A password placed in the same email as the attachment offers much less separation. Remember that the downloaded protected file and any unprotected source copies remain under your device's file and backup policies.

There is no password recovery service here. The tool does not send a copy of the password to support or keep a recoverable document vault. At the same time, absence of server storage does not make a weak encryption algorithm strong. For sensitive external sharing, consider a controlled access portal or a properly configured modern PDF security tool. Verify the chosen output with a PDF inspector rather than relying solely on an application's lock icon.

## Protection-specific questions

### Does this tool use AES encryption?

No. The bundled jsPDF path uses legacy RC4 PDF encryption. Its documentation and interface should be read with that limitation in mind. Use a different verified tool if AES or a particular key strength is mandatory.

### Why did selectable text disappear?

Pages are rendered into JPEG images before encryption. This workflow protects a visual derivative, not an otherwise identical version of the original text-based PDF. Keep the source if searchability is needed later.

### Are copy and print restrictions absolute?

No. Reader permissions are not a complete defense against an authorized viewer reproducing content. The script allows printing, and no password scheme can prevent someone from photographing an opened page.

### Can support recover a forgotten password?

No recovery database is maintained by this tool. Retain your original and manage passwords securely. Avoid interpreting that lack of recovery as evidence that the legacy encryption is suitable for every use case.

### Can I protect an already encrypted PDF here?

This interface does not provide a source-password entry step. Obtain an authorized unencrypted export first, then decide whether this tool's legacy encryption and image-based output are acceptable for the intended recipient.
