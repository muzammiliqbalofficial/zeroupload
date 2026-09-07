/* Compress PDF — renders pages to JPEG images (client-side) and rebuilds PDF */
var compressState = { out: null };

var compressInput = document.getElementById("fileInput");

renderCompress = setupDropzone("#fileInput", "#fileList");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

var LEVELS = {
  low:    { scale: 2.0, quality: 0.85 },
  medium: { scale: 1.5, quality: 0.65 },
  high:   { scale: 1.0, quality: 0.45 },
};

document.getElementById("dlBtn").addEventListener("click", function () {
  if (compressState.out) saveBlob(compressState.out, compressState.outName);
});

document.getElementById("runBtn").addEventListener("click", compressNow);

async function compressNow() {
  var files = Array.prototype.slice.call(compressInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];
  var levelInput = document.querySelector('input[name="level"]:checked');
  var level = levelInput ? levelInput.value : "medium";
  var origSize = file.size;

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Loading PDF…";

  try {
    var outBytes;
    var totalPages = 1;

    if (level === "lossless") {
      bar.style.width = "50%"; label.textContent = "Optimizing PDF structure…";
      var bytes = new Uint8Array(await file.arrayBuffer());
      var srcPdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      totalPages = srcPdf.getPageCount();
      outBytes = await srcPdf.save({ useObjectStreams: true, addDefaultPage: false });
    } else {
      var cfg = LEVELS[level] || LEVELS.medium;
      var pdf;
      try {
        pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      } catch (wErr) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";
        pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer(), disableWorker: true }).promise;
      }
      var out = await PDFLib.PDFDocument.create();
      var total = pdf.numPages;
      totalPages = total;

      for (var i = 1; i <= total; i++) {
        var page = await pdf.getPage(i);
        var vp1 = page.getViewport({ scale: 1 });
        var vp = page.getViewport({ scale: cfg.scale });
        var canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        var ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        var jpg = canvas.toDataURL("image/jpeg", cfg.quality);
        var jpgBytes = dataURLtoUint8(jpg);

        var pw = vp1.width, ph = vp1.height;
        var img = await out.embedJpg(jpgBytes);
        var np = out.addPage([pw, ph]);
        np.drawImage(img, { x: 0, y: 0, width: pw, height: ph });

        bar.style.width = (i / total) * 100 + "%";
        label.textContent = "Compressing page " + i + "/" + total;
        await delay(10);
      }
      outBytes = await out.save({ useObjectStreams: true });
    }

    compressState.out = new Blob([outBytes], { type: "application/pdf" });
    compressState.outName = baseName(file.name) + "_compressed.pdf";

    document.getElementById("resultName").textContent = compressState.outName;
    document.getElementById("sizeBefore").textContent = fmtBytes(origSize);
    document.getElementById("sizeAfter").textContent = fmtBytes(outBytes.byteLength);
    document.getElementById("resultMeta").textContent =
      totalPages + " pages · reduced by " + Math.max(0, Math.round((1 - outBytes.byteLength / origSize) * 100)) + "%";
    result.classList.remove("hide");
    bar.style.width = "100%";
    label.textContent = "Done";
    toast("Compression complete");

    showNextSteps(result, "compress");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}

function dataURLtoUint8(dataUrl) {
  var parts = dataUrl.split(",");
  var b64 = parts[1];
  var bin = atob(b64);
  var arr = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}