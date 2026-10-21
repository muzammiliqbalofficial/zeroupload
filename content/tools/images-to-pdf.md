## Assemble photographs and scans into a readable document

Images to PDF places each JPG or PNG on its own PDF page. It is useful for receipt packets, photographed worksheets, and scans supplied as separate image files. Prepare the images before selecting them: crop unrelated surroundings, rotate sideways photographs, and remove accidental duplicates. A PDF container does not improve an out-of-focus photo or make a shadowed receipt readable. Check that every source image is suitable for the recipient before assembling the packet.

## How it works under the hood

The browser reads each image's bytes and embeds it with pdf-lib using embedJpg or embedPng. The script creates one page per image and draws the embedded object onto that page. In A4 or Letter mode, it scales proportionally to fit and centers the image without intentionally cropping it. In Auto mode, the page follows the image aspect ratio, with page dimensions constrained to the implementation's maximum 600 by 1000 PDF points.

This is image embedding, not OCR. A photograph of a printed letter remains a photograph inside the PDF. The tool does not add a searchable text layer, infer reading order, or recreate form fields. It also does not deliberately downsample the original image pixels before embedding, so a high-resolution phone photograph can produce a large file even when displayed on a modestly sized PDF page. Its displayed size and its encoded image size are separate concerns.

## Step-by-step usage and best practices

Select the JPG and PNG files you intend to combine. Review their displayed order carefully; use explicit numbered filenames before selection if a reliable sequence is important. Choose A4 or Letter for a recipient expecting a standard paper format. Choose Auto when preserving the image's proportions as the page shape is more useful than standardized print dimensions. Run the conversion and download images.pdf under a descriptive name that identifies its contents.

Open the result in a separate viewer and count pages against selected images. Check whether portrait and landscape pictures have the intended orientation, whether receipts are large enough to read, and whether blank margins are acceptable. A narrow receipt centered on A4 can leave substantial whitespace. That is expected from proportional fitting rather than evidence that part of the picture was lost. If print size matters, make a sample print at the intended scaling.

For sensitive photos, inspect everything in the frame, including names on a desk or other screens in the background. Do not assume embedding into a PDF sanitizes camera metadata or removes identifying content. Use a suitable image editor and metadata review before assembly if those details matter. HEIC, TIFF, SVG, and WebP are outside this tool's JPG/PNG input workflow; convert them in an appropriate image application first, keeping an original copy.

## Image-assembly questions

### Why is my PDF still large?

The source images are embedded rather than automatically reduced to a target pixel count. A page displaying a small photograph can still contain its full image data. Resize an appropriate working copy before assembly or evaluate compression afterward.

### Can I search text in a photographed page?

No text recognition is performed. The resulting PDF contains pictures, not newly recognized words. Use an OCR workflow if search, copying text, or assistive reading is required.

### Why are there margins around a receipt?

A4 and Letter modes fit the whole image onto a standard page without changing its aspect ratio. Images with different proportions leave whitespace. Auto mode may fit the visual use case better, though its paper size is less predictable for printing.

### Are transparent PNG areas preserved?

PNG embedding can retain image transparency, but appearance depends on the viewer's page background and printing behavior. Test a sample if the background matters; do not use a transparent area to conceal sensitive pixels.

### Does a filename ending in .jpg guarantee it works?

No. The file must actually contain supported image data. Renaming a HEIC photograph does not convert its encoding. Export a real JPG or PNG from an image application and retry with that copy.
