# Choose PDF password protection with the right security expectations

A password prompt is a visible behavior, not a complete description of security. Before protecting a PDF, determine which encryption algorithm is used, whether the recipient can open it, which document features survive, and how the password will be delivered. For important records, the approved handling process should decide the tool. A free browser utility can be convenient, but convenience does not establish suitability for every sensitive document.

## Separate opening passwords from permissions

A PDF can require a password before its contents are displayed. It can also declare permissions such as whether printing or copying should be allowed. These are different controls. A viewer may enforce permissions in its interface, but a person who can see the content can still reproduce it through screenshots, photography, or another workflow. Do not promise that an editable restriction makes visible information impossible to copy.

Check the requirement in concrete terms. Is the goal to avoid accidental viewing of an email attachment, to use a particular modern encryption standard, or to restrict access to named people with revocation? An encrypted file and a controlled access portal solve different problems. Once a recipient has an unencrypted copy, later changing a link's permissions cannot erase that copy from their device.

## Inspect the implementation before relying on labels

ZeroUpload's current Protect PDF tool renders pages with PDF.js and creates a new jsPDF document with an opening password. The bundled jsPDF path uses legacy RC4 PDF encryption, not AES-256. Its user and owner passwords are both set to the supplied value, and printing is allowed. This should not be represented as modern high-assurance document security. If your policy requires a specific algorithm or key strength, choose a verified tool that supports it.

<table class="data-table"><caption>Questions to ask before selecting protection</caption><thead><tr><th>Requirement</th><th>Check</th><th>Practical implication</th></tr></thead><tbody><tr><td>Modern encryption policy</td><td>Inspect the actual PDF security handler</td><td>A lock icon is insufficient evidence</td></tr><tr><td>Searchable output</td><td>Test text selection after protection</td><td>Raster workflows may be unsuitable</td></tr><tr><td>Recipient compatibility</td><td>Open a harmless sample in their viewer</td><td>Avoid a last-minute access failure</td></tr><tr><td>Access revocation</td><td>Assess the delivery platform</td><td>An attached file cannot be recalled reliably</td></tr></tbody></table>

## Account for the visual-copy tradeoff

This tool renders each source page at scale 2.0, encodes it as JPEG with quality 0.92, and places the image on a new page. Searchable text, interactive fields, live hyperlinks, bookmarks, and accessibility tags are not reconstructed. A form can look complete while no longer supporting field editing. A certificate signature may remain visible as an image without retaining its verification evidence. Keep the original separately whenever those features matter.

Raster output can also be larger than the source. A page containing a few compact text instructions may need substantially more bytes as a full-page picture. Inspect tiny print, fine diagrams, and signature details before deciding that the derivative meets the recipient's needs. Do not repeatedly rasterize earlier derivatives in an attempt to improve them; each additional lossy encoding can introduce more visible artifacts.

## Test the password behavior safely

Use a nonconfidential sample before processing a real document. Enter a unique password unrelated to any account credential, create the output, and reopen it in a separate viewer. Confirm that the viewer prompts before displaying the pages. Try an incorrect password and verify that access fails, then try the intended password. Inspect all sample pages after opening and test the features the recipient needs.

These checks establish observable behavior for that sample and viewer; they do not measure resistance to attack. To verify an encryption requirement, inspect the saved PDF with an appropriate PDF security inspector. Record the tool version and settings used. If a policy requires modern encryption and the output reports a legacy handler, stop and choose a different workflow instead of trying a longer password with the same algorithm.

## Deliver and retain passwords sensibly

Send the document and password through separate agreed channels when the handling process permits encrypted attachments. Verify the recipient identity before transmitting either. A password sent in the same email thread as the attachment provides limited separation if that account is compromised. Avoid public hints based on easily guessed dates, company names, or account identifiers. A password manager can help retain unique credentials without reusing an account password.

There is no password recovery database in this tool. Keep an authorized source under suitable access controls and document how the recipient can request a fresh copy. Do not send support your password or the confidential file. If an access issue occurs, describe the viewer, the type of prompt, and whether a harmless sample behaves the same way. That is enough to start diagnosing compatibility without exposing the protected material.

## Use a defined acceptance benchmark

For a three-page fixture, require three readable output pages, a prompt in a separate reader, rejection of a wrong password, and acceptance of the right one. Record input and output sizes and the features lost during rasterization. A protection run that completes quickly but fails any required behavior is not successful. Timing is secondary to matching the actual security and document requirements.

## Troubleshooting checklist

- No password prompt: reopen the downloaded file in a fresh viewer session and inspect its security properties.
- Wrong algorithm: choose a tool that meets the required standard; a longer password does not change the handler.
- Unsearchable output: use a workflow that encrypts retained text objects if searchability is mandatory.
- Recipient incompatibility: test a harmless fixture in their actual reader and compare requirements.
- Lost password: return to the authorized original and issue a new protected copy through the approved process.
- Existing signature warning: preserve the signed original and consult the issuer before making derivatives.

See [Protect PDF](/tools/protect), [Unlock PDF](/tools/unlock), and the [secure sharing guide](/guides/best-practices-for-secure-pdf-sharing) for the related operations and their limits.
