## Create an authorized readable copy

Unlock PDF is for files you own or have explicit permission to modify. It is not a password guessing service. If a document requires an opening password, you need the correct password to render its contents. Confirm that removing restrictions is permitted by the document owner and your handling policy before exporting an unprotected copy. Keep the original encrypted file when its provenance or access controls need to be preserved.

## How it works under the hood

PDF.js loads the source bytes using the supplied opening password when one is needed. After the reader successfully opens the document, the script renders each page to a browser canvas at scale 2.0, converts it to JPEG at quality 0.92, and embeds that image on a new pdf-lib page. Saving the new PDF produces an unencrypted visual derivative. The implementation does not decrypt and rewrite every original object in place or recover a forgotten key.

This approach explains the main tradeoff: the appearance can be carried into a new file, but the original structure is not preserved. Selectable text, editable form fields, bookmarks, hyperlinks, accessibility tags, and certificate-signature verification do not carry over as their original features. A password-protected text report can become a larger image-based PDF. The tool should therefore be used only when a readable visual copy meets the recipient's requirements.

## Step-by-step usage and best practices

Select the encrypted PDF and enter the correct opening password if it has one. Some documents open without a password but declare editing or printing permissions; authorization still matters even if the reader can display them. Run Unlock and download the newly created file under a clear derivative filename. Do not replace the original automatically. Open the download in a separate viewer and confirm that it displays without a password and includes the expected number of pages.

Inspect fine print, stamps, and filled values at normal zoom and at a larger viewing scale. Because each page is a JPEG representation, tiny details may differ from the original. Test whether the recipient needs search, text copying, accessible reading, or interactive fields. If those features matter, ask the document issuer for an authorized unprotected source or use a workflow that preserves document objects rather than rebuilding their appearance.

Treat the unlocked output as a more exposed copy. Store it only where the intended audience can access it, and do not leave it in shared downloads or synchronized folders accidentally. Closing the browser tab does not remove a file already downloaded to disk. The application does not transmit source documents or passwords to a recovery service, but browser extensions, endpoint software, and device backups remain outside this tool's control. For large scans, memory requirements can be substantial because rendering expands compressed pages into pixel buffers.

## Unlock-specific questions

### Can the tool open a PDF if I forgot its password?

No. A valid opening password is required when the document enforces one. Ask the owner for access or a fresh export. The tool does not run dictionary attacks or promise recovery of an unknown password.

### Why is my unlocked PDF no longer searchable?

The export consists of page images rendered from the opened source. It does not preserve or reconstruct a text layer. Keep an authorized source with selectable text if search or accessibility is important.

### Why is the result larger than the encrypted original?

Raster page images can require more storage than compact original text and vectors. Encryption removal does not imply compression. Compare output sizes and readability before choosing this derivative for distribution.

### Does a visible original signature stay verifiable?

It may remain visible as pixels, but the original cryptographic signature is not recreated. Preserve the original signed artifact and its verification workflow when signature evidence matters.

### What if I entered the right password and it still fails?

Confirm the file opens in another maintained PDF viewer and check for unsupported or damaged structures. Request a fresh authorized export from the owner. Send support a description of the failure rather than the password or confidential source file.
