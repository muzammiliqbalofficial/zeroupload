/* Split PDF — every page = separate PDF (zipped) OR custom range extract */
var splitState = { pages: [], out: null };

var splitInput = document.getElementById("fileInput");
var rangeField = document.getElementById("rangeField");
var runBtn = document.getElementById("runBtn");

renderSplit = setupDropzone("#fileInput", "#fileList", function () {
  splitState.pages = [];
});

document.querySelectorAll('input[name="mode"]').forEach(function (r) {
  r.addEventListener("change", function () {
    rangeField.classList.toggle("hide", r.value !== "range");
  });
});

document.getElementById("dlBtn").addEventListener("click", function () {
  if (splitState.out) saveBlob(splitState.out, splitState.outName);
});

runBtn.addEventListener("click", splitNow);

function parseRanges(str, pageCount) {
  var set = [];
  String(str).split(",").forEach(function (part) {
    part = part.trim();
    if (!part) return;
    var m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
      for (var i = a; i <= b; i++) set.push(i);
    } else if (/^\d+$/.test(part)) {
      set.push(parseInt(part, 10));
    }
  });
  return set.filter(function (p) { return p >= 1 && p <= pageCount; });
}

async function splitNow() {
  var files = Array.prototype.slice.call(splitInput.files);
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Reading PDF…";

  try {
    var bytes = new Uint8Array(await file.arrayBuffer());
    var pdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    var total = pdf.getPageCount();
    var mode = document.querySelector('input[name="mode"]:checked').value;
    var pageList = [];

    if (mode === "every") {
      for (var i = 1; i <= total; i++) pageList.push([i]);
    } else {
      var raw = document.getElementById("rangeInput").value;
      var pages = parseRanges(raw, total);
      if (!pages.length) { toast("No valid pages in range (1–" + total + ")", true); return; }
      pages.forEach(function (p) { pageList.push([p]); });
    }

    label.textContent = "Splitting 0/" + pageList.length;
    var parts = await inChunks(pageList, async function (grp, idx) {
      var out = await PDFLib.PDFDocument.create();
      var src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      var inds = grp.map(function (p) { return p - 1; });
      var pages = await out.copyPages(src, inds);
      pages.forEach(function (p) { out.addPage(p); });
      return { name: baseName(file.name) + "_page-" + grp.join("-") + ".pdf", bytes: await out.save() };
    }, function (n, t) {
      bar.style.width = (n / t) * 100 + "%";
      label.textContent = "Splitting " + n + "/" + t;
    });

    if (parts.length === 1) {
      splitState.out = new Blob([parts[0].bytes], { type: "application/pdf" });
      splitState.outName = parts[0].name;
    } else {
      var zip = new JSZip();
      parts.forEach(function (p) { zip.file(p.name, p.bytes); });
      var zipBytes = await zip.generateAsync({ type: "uint8array" });
      splitState.out = new Blob([zipBytes], { type: "application/zip" });
      splitState.outName = baseName(file.name) + "_split.zip";
    }

    document.getElementById("resultName").textContent = splitState.outName;
    document.getElementById("resultMeta").textContent =
      parts.length + " file(s) · " + fmtBytes(splitState.out.size);
    result.classList.remove("hide");
    bar.style.width = "100%";
    label.textContent = "Done";
    toast("Created " + parts.length + " PDF file(s)");

    showNextSteps(result, "split");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}