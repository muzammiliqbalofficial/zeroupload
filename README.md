# ZeroUpload — Fast, Free, Private PDF Tools

A fully **client-side** PDF toolkit — merge, split, compress, rotate, remove
pages, protect, unlock and convert PDFs. Because **everything runs in the
browser**, it's faster and cheaper than cloud tools (iLovePDF etc.), needs no
server, and users' files never get uploaded.

## Brand & domain
- Brand: **ZeroUpload**
- Domain: `https://zeroupload.co`
- Support: `support@zeroupload.co`

## Tools included
| Tool | What it does |
|------|--------------|
| Merge PDF | Combine multiple PDFs into one |
| Split PDF | One-page-per-file ZIP or custom page range |
| Compress PDF | Shrink file size (lossless + 3 quality levels) |
| Organize PDF | Reorder, rotate, and delete pages visually, with undo |
| Page Numbers | Add page numbers or a watermark |
| Sign PDF | Draw, type, or upload a signature and place it on the page |
| PDF → Word | Export pages as an editable .docx |
| Word → PDF | Convert .docx to PDF |
| PDF → Images | Export pages as JPG/PNG (ZIP) |
| Images → PDF | Combine JPG/PNG into one PDF |
| PDF → Markdown | Extract text and structure as Markdown |
| Rotate PDF | Rotate all or specific pages |
| Remove Pages | Delete pages by number/range |
| Protect PDF | Add a password (rebuilt as images, then encrypted with jsPDF) |
| Unlock PDF | Remove a password (decrypted via pdf.js, rebuilt as a plain PDF) |

## Project structure
```
.
├─ index.html            → landing page (tool grid, hero, SEO meta)
├─ about.html            → About page
├─ privacy.html          → Privacy Policy
├─ terms.html            → Terms of Service
├─ contact.html          → Contact page
├─ css/style.css         → all shared styles (incl. dark mode)
├─ js/common.js          → helpers, dropzone, toast, dark mode, SW, SEO, ads
├─ js/<tool>.js          → one logic file per tool
├─ tools/<tool>.html     → one page per tool
├─ favicon.svg, apple-touch-icon.svg, og-image.svg → brand assets
├─ sw.js                 → service worker (offline)
├─ robots.txt, sitemap.xml → SEO files
├─ _headers              → security headers
└─ README.md
```

Libraries are loaded from CDNs (pdf-lib, pdf.js, JSZip, docx, mammoth,
html2canvas, jsPDF). No build step required. Everything is 100% client-side.

## How it all works
- **Dark mode** — sun/moon toggle in the topbar, saved to `localStorage`,
  respects the OS preference on first visit.
- **Offline support** — Auto-registered service worker (`/sw.js`).
- **Mobile** — hamburger menu below 640px, touch-friendly.
- **SEO** — each page has canonical/og/twitter meta; `robots.txt` +
  `sitemap.xml` reference the real domain.

## Deploying updates
Upload the whole folder (including `js/`, `css/`, `tools/`, `sw.js`,
`robots.txt`, `sitemap.xml`, and every `*.svg`) to your static hosting
(Cloudflare Workers / Pages). Everything works without a backend.

## Notes
- Bump `CACHE_NAME` in `sw.js` whenever you deploy a version so returning users
  get the new assets instead of the old cached ones.
- Only unlock PDFs you own or have permission to modify.
- Replace the placeholder `support@zeroupload.co` if you change your support
  address.