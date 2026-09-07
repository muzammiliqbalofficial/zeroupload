/* Merge PDF — merges multiple PDFs (order = file list order) */
var mergeState = { files: [] };

var mergeInput = document.getElementById("fileInput");
var mergeList = document.getElementById("fileList");

renderMerge = setupDropzone("#fileInput", "#fileList", updateMergeInfo);

function updateMergeInfo() {
  mergeState.files = Array.prototype.slice.call(mergeInput.files);
  var total = mergeState.files.reduce(function(s, f){ return s + f.size; }, 0);
  var sum = document.getElementById("fileSummary");
  if (sum) {
    sum.style.display = mergeState.files.length ? "" : "none";
    sum.textContent = mergeState.files.length + " file(s) · " + fmtBytes(total) + (mergeState.files.length ? " — drag to reorder" : "");
  }
}

document.getElementById("clearBtn").addEventListener("click", function () {
  mergeInput.value = "";
  renderMerge();
});

document.getElementById("runBtn").addEventListener("click", mergeNow);
document.getElementById("dlBtn").addEventListener("click", function () {
  if (mergeState.out) saveBlob(mergeState.out, mergeState.outName);
});

async function mergeNow() {
  var files = Array.prototype.slice.call(mergeInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length < 2) { toast("Please add at least 2 PDF files", true); return; }

  /* Friendly validation */
  var strict = files.every(function (f) { return f.name && /\.pdf$/i.test(f.name); });
  if (!strict) {
    var bad = files.filter(function (f) { return !/\.pdf$/i.test(f.name || ""); });
    toast("Unsupported file type: \"" + bad[0].name + "\". Only PDF files are supported.", true);
    return;
  }
  warnIfLarge(files);

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Reading files…";

  var pdfBytesArray = [];
  try {
    for (var i = 0; i < files.length; i++) {
      pdfBytesArray.push(new Uint8Array(await files[i].arrayBuffer()));
      bar.style.width = ((i + 1) / files.length) * 100 + "%";
      label.textContent = "Merging " + (i + 1) + " of " + files.length;
      await delay(10);
    }

    var merged = await PDFLib.PDFDocument.create();
    for (var j = 0; j < pdfBytesArray.length; j++) {
      var src;
      try {
        src = await PDFLib.PDFDocument.load(pdfBytesArray[j], { ignoreEncryption: true });
      } catch (loadErr) {
        console.error(loadErr);
        throw loadErr; // handled below with a friendly message
      }
      if (src.getPageCount() === 0) throw new Error("no pages");
      var pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(function (p) { merged.addPage(p); });
      label.textContent = "Merging " + (j + 1) + " of " + files.length;
    }

    bar.style.width = "100%";
    label.textContent = "Finalizing…";
    var outBytes = await merged.save();
    mergeState.out = new Blob([outBytes], { type: "application/pdf" });
    mergeState.outName = "merged.pdf";

    document.getElementById("resultName").textContent = "merged.pdf";
    document.getElementById("resultMeta").textContent =
      files.length + " files · " + merged.getPageCount() + " pages · " + fmtBytes(outBytes.byteLength);
    result.classList.remove("hide");
    toast("Done — merged " + files.length + " PDFs");

    showNextSteps(result, "merge");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}