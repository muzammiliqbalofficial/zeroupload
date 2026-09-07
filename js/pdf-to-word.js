/* ============================================================================
 * PDF to Word — High-Fidelity Conversion Engine
 *
 * Extracts real text with full formatting:
 *   1. Font Styles: Detects Bold, Italic, Font Sizes, and Font Families.
 *   2. Text Alignment: Detects Center, Right, and Left alignment per line.
 *   3. Smart Paragraph Consolidation: Groups contiguous lines into natural flowing
 *      paragraphs (eliminating double spacing and broken line breaks).
 *   4. Accurate Word Spacing: Prevents squished or double-spaced words.
 *   5. Image & Graphics Preservation: Preserves visual elements, logos, and scanned pages.
 * ========================================================================== */

var p2wState = { out: null };

var p2wInput = document.getElementById("fileInput");
renderP2W = setupDropzone("#fileInput", "#fileList");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById("dlBtn").addEventListener("click", function () {
  if (p2wState.out) saveBlob(p2wState.out, p2wState.outName);
});

document.getElementById("runBtn").addEventListener("click", convertPdfToWord);

function dataURLtoUint8(dataUrl) {
  var parts = dataUrl.split(",");
  var bin = atob(parts[1]);
  var arr = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

/* --- Extract item formatting & typography --- */
function extractItemStyles(it, styles) {
  var str = it.str || "";
  var transform = it.transform || [1, 0, 0, 1, 0, 0];
  var fontName = (it.fontName || "").toLowerCase();
  
  var styleObj = (styles && styles[it.fontName]) || {};
  var fontFamilyRaw = (styleObj.fontFamily || "").toLowerCase();
  var combinedFont = fontName + " " + fontFamilyRaw;

  var isBold = /bold|700|800|900|black|heavy|medium|semibold|demi/i.test(combinedFont);
  var isItalic = /italic|oblique|slanted/i.test(combinedFont);

  var font = "Calibri";
  if (/times|serif|georgia|garamond/i.test(combinedFont)) {
    font = "Times New Roman";
  } else if (/courier|mono|code|console|fixed/i.test(combinedFont)) {
    font = "Courier New";
  } else if (/arial|helvetica/i.test(combinedFont)) {
    font = "Arial";
  }

  var scaleX = Math.hypot(transform[0], transform[1]);
  var scaleY = Math.hypot(transform[2], transform[3]);
  var pt = Math.round(scaleY || scaleX || Math.abs(transform[3]) || it.height || 11);
  if (isNaN(pt) || pt < 7) pt = 10;
  if (pt > 48) pt = 48;

  return {
    str: str,
    x: transform[4],
    y: transform[5],
    w: it.width || (str.length * pt * 0.48),
    fs: pt,
    isBold: isBold,
    isItalic: isItalic,
    font: font
  };
}

/* --- Group items into horizontal lines --- */
function groupIntoLines(items, styles) {
  var enriched = [];
  items.forEach(function (it) {
    if (!it.str || !it.str.trim()) return;
    enriched.push(extractItemStyles(it, styles));
  });

  if (enriched.length === 0) return [];

  var lines = [];
  enriched.forEach(function (item) {
    var tol = Math.max(3, item.fs * 0.35);
    var line = null;
    for (var i = 0; i < lines.length; i++) {
      if (Math.abs(lines[i].y - item.y) < tol) {
        line = lines[i];
        break;
      }
    }
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  });

  // Sort lines top-to-bottom (PDF Y descending)
  lines.sort(function (a, b) { return b.y - a.y; });

  // Sort items left-to-right (X ascending)
  lines.forEach(function (L) {
    L.items.sort(function (a, b) { return a.x - b.x; });
  });

  return lines;
}

/* --- Process line: build styled text runs & detect alignment --- */
function processLine(line, pageW) {
  if (!line.items || line.items.length === 0) return null;

  var items = line.items;
  var minX = items[0].x;
  var lastItem = items[items.length - 1];
  var maxX = lastItem.x + lastItem.w;
  var lineW = maxX - minX;
  var centerX = (minX + maxX) / 2;
  var pageCenterX = pageW / 2;

  var alignment = docx.AlignmentType.LEFT;
  if (Math.abs(centerX - pageCenterX) < (pageW * 0.12) && lineW < (pageW * 0.75)) {
    alignment = docx.AlignmentType.CENTER;
  } else if (maxX > (pageW * 0.72) && minX > (pageW * 0.35) && lineW < (pageW * 0.6)) {
    alignment = docx.AlignmentType.RIGHT;
  }

  var runs = [];
  var prevItem = null;

  items.forEach(function (it) {
    var prefixSpace = "";
    if (prevItem) {
      var gap = it.x - (prevItem.x + prevItem.w);
      var spaceThreshold = it.fs * 0.18;
      if (gap > spaceThreshold && !it.str.startsWith(" ") && !prevItem.str.endsWith(" ")) {
        prefixSpace = " ";
      }
    }

    var textContent = prefixSpace + it.str;
    var lastRun = runs[runs.length - 1];
    
    if (
      lastRun &&
      lastRun.bold === it.isBold &&
      lastRun.italic === it.isItalic &&
      lastRun.font === it.font &&
      lastRun.size === (it.fs * 2)
    ) {
      lastRun.text += textContent;
    } else {
      runs.push({
        text: textContent,
        bold: it.isBold,
        italic: it.isItalic,
        font: it.font,
        size: it.fs * 2,
        fsPt: it.fs
      });
    }
    prevItem = it;
  });

  var maxFs = Math.max.apply(Math, items.map(function(i) { return i.fs; }));

  return {
    y: line.y,
    minX: minX,
    maxX: maxX,
    alignment: alignment,
    runs: runs,
    maxFs: maxFs
  };
}

/* --- Consolidate lines into flowing docx Paragraphs --- */
function linesToParagraphs(processedLines) {
  var paragraphs = [];
  var currentBlock = null;

  processedLines.forEach(function (pl) {
    if (!pl || pl.runs.length === 0) return;

    var textLength = pl.runs.reduce(function(acc, r){ return acc + r.text.length; }, 0);
    if (textLength === 0) return;

    if (!currentBlock) {
      currentBlock = {
        alignment: pl.alignment,
        maxFs: pl.maxFs,
        lastY: pl.y,
        lines: [pl]
      };
      return;
    }

    var yGap = Math.abs(currentBlock.lastY - pl.y);
    var fontHeight = Math.max(currentBlock.maxFs, pl.maxFs);
    var isSameAlignment = (currentBlock.alignment === pl.alignment);
    var isCloseVerticalGap = (yGap < (fontHeight * 1.75));

    if (isSameAlignment && isCloseVerticalGap && pl.alignment === docx.AlignmentType.LEFT) {
      currentBlock.lines.push(pl);
      currentBlock.lastY = pl.y;
      currentBlock.maxFs = Math.max(currentBlock.maxFs, pl.maxFs);
    } else {
      paragraphs.push(buildDocxParagraph(currentBlock));
      currentBlock = {
        alignment: pl.alignment,
        maxFs: pl.maxFs,
        lastY: pl.y,
        lines: [pl]
      };
    }
  });

  if (currentBlock) {
    paragraphs.push(buildDocxParagraph(currentBlock));
  }

  return paragraphs;
}

function buildDocxParagraph(block) {
  var docxRuns = [];

  block.lines.forEach(function (ln, lineIdx) {
    ln.runs.forEach(function (r, runIdx) {
      var needLineBreak = (lineIdx > 0 && runIdx === 0);

      docxRuns.push(new docx.TextRun({
        text: r.text,
        bold: r.bold,
        italics: r.italic,
        font: r.font,
        size: r.size,
        break: needLineBreak ? 1 : undefined
      }));
    });
  });

  var afterSpacing = Math.round(Math.max(100, block.maxFs * 8));

  return new docx.Paragraph({
    alignment: block.alignment,
    children: docxRuns,
    spacing: {
      after: afterSpacing,
      before: 0,
      line: 276,
      lineRule: "auto"
    }
  });
}

async function pageToPng(page, scale) {
  var vp = page.getViewport({ scale: scale });
  var canvas = document.createElement("canvas");
  canvas.width = Math.floor(vp.width);
  canvas.height = Math.floor(vp.height);
  await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
  return dataURLtoUint8(canvas.toDataURL("image/png"));
}

async function convertPdfToWord() {
  var files = Array.prototype.slice.call(p2wInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Loading PDF…";

  try {
    var pdf;
    try {
      pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    } catch (wErr) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";
      pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer(), disableWorker: true }).promise;
    }

    var total = pdf.numPages;
    var sections = [];
    var imagePagesCount = 0;

    for (var i = 1; i <= total; i++) {
      var page = await pdf.getPage(i);
      var vp1 = page.getViewport({ scale: 1 });
      var pageW = vp1.width, pageH = vp1.height;
      var textContent = await page.getTextContent();
      
      var rawLines = groupIntoLines(textContent.items, textContent.styles);

      var children = [];

      // Check if page has minimal or no text (scanned page or image heavy)
      var totalChars = textContent.items.reduce(function(acc, item){ return acc + (item.str || "").trim().length; }, 0);

      if (rawLines.length === 0 || totalChars < 15) {
        // High quality visual render fallback for scanned / graphical pages
        var png = await pageToPng(page, 2.0);
        var contentW = Math.max(300, pageW - 72);
        var iw = Math.min(contentW, 540);
        var ih = iw * (pageH / pageW);
        children.push(new docx.Paragraph({
          children: [new docx.ImageRun({
            data: png,
            transformation: { width: Math.round(iw), height: Math.round(ih) },
          })],
          spacing: { after: 120, before: 0, line: 276, lineRule: "auto" },
        }));
        imagePagesCount++;
      } else {
        var processedLines = [];
        rawLines.forEach(function (ln) {
          var proc = processLine(ln, pageW);
          if (proc) processedLines.push(proc);
        });

        var paragraphList = linesToParagraphs(processedLines);
        children = paragraphList;
      }

      sections.push({
        properties: {
          page: {
            size: { width: Math.round(pageW * 20), height: Math.round(pageH * 20) },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: children,
      });

      bar.style.width = (i / total) * 100 + "%";
      label.textContent = "Converting page " + i + "/" + total;
      await delay(10);
    }

    var doc = new docx.Document({ sections: sections });
    var blob = await docx.Packer.toBlob(doc);
    p2wState.out = blob;
    p2wState.outName = baseName(file.name) + ".docx";

    document.getElementById("resultName").textContent = p2wState.outName;
    document.getElementById("resultMeta").textContent =
      total + " page(s) · " + fmtBytes(blob.size) +
      (imagePagesCount > 0 ? " · " + imagePagesCount + " page(s) kept as crisp visuals" : "");
    result.classList.remove("hide");
    bar.style.width = "100%";
    label.textContent = "Done";
    toast("Editable Word document ready");

    showNextSteps(result, "pdf-to-word");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}