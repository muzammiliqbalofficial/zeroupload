/* Remove Pages — delete specified pages from a PDF */
var rmState = { out: null };
var rmInput = document.getElementById("fileInput");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

renderRm = setupDropzone("#fileInput", "#fileList", onFileSelected);

async function onFileSelected() {
  var files = Array.prototype.slice.call(rmInput.files);
  var grid = document.getElementById("thumbGrid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.classList.add("hide");

  if (files.length !== 1) return;
  var file = files[0];

  try {
    var pdf;
    try {
      pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    } catch (wErr) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";
      pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer(), disableWorker: true }).promise;
    }
    var total = pdf.numPages;
    grid.classList.remove("hide");

    for (var i = 1; i <= total; i++) {
      var page = await pdf.getPage(i);
      var vp = page.getViewport({ scale: 0.25 });
      var item = document.createElement("div");
      item.className = "thumb-item";
      item.style.cssText = "display:flex; flex-direction:column; align-items:center; background:var(--card); border:2px solid var(--border); border-radius:8px; padding:6px; cursor:pointer; position:relative; transition:all 0.15s;";
      item.dataset.page = i;

      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      canvas.style.borderRadius = "4px";
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;

      item.appendChild(canvas);
      var lbl = document.createElement("span");
      lbl.style.cssText = "font-size:0.75rem; margin-top:4px; font-weight:600; color:var(--text);";
      lbl.textContent = "Page " + i;
      item.appendChild(lbl);

      item.onclick = (function(pNum, el) {
        return function() {
          var input = document.getElementById("removeList");
          var curVal = input.value ? input.value.split(",").map(function(s){return s.trim();}).filter(Boolean) : [];
          var strNum = String(pNum);
          var idx = curVal.indexOf(strNum);
          if (idx !== -1) {
            curVal.splice(idx, 1);
            el.style.borderColor = "var(--border)";
            el.style.opacity = "1";
          } else {
            curVal.push(strNum);
            el.style.borderColor = "var(--danger)";
            el.style.opacity = "0.5";
          }
          input.value = curVal.join(", ");
        };
      })(i, item);

      grid.appendChild(item);
    }
  } catch (e) {
    console.error("Thumbnail render error:", e);
  }
}

document.getElementById("dlBtn").addEventListener("click", function () {
  if (rmState.out) saveBlob(rmState.out, rmState.outName);
});
document.getElementById("runBtn").addEventListener("click", removePages);

function parseRemove(str, total) {
  var set = [];
  String(str).split(",").forEach(function (p) {
    p = p.trim(); if (!p) return;
    var m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) { for (var i = +m[1]; i <= +m[2]; i++) set.push(i); }
    else if (/^\d+$/.test(p)) set.push(+p);
  });
  return set.filter(function (p) { return p >= 1 && p <= total; });
}

async function removePages() {
  var files = Array.prototype.slice.call(rmInput.files);
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
  bar.style.width = "0%"; label.textContent = "Reading PDF…";

  try {
    var bytes = new Uint8Array(await file.arrayBuffer());
    var pdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    var total = pdf.getPageCount();
    var toRemove = parseRemove(document.getElementById("removeList").value, total);
    if (!toRemove.length) { toast("Enter or click at least one page to remove", true); return; }
    if (toRemove.length >= total) { toast("You can't remove every page", true); return; }

    // Remove in reverse order so indices stay valid
    var indices = toRemove.map(function (p) { return p - 1; }).sort(function (a, b){ return b - a; });
    indices.forEach(function (idx) { pdf.removePage(idx); });

    bar.style.width = "70%";
    var outBytes = await pdf.save();
    rmState.out = new Blob([outBytes], { type: "application/pdf" });
    rmState.outName = baseName(file.name) + "_edited.pdf";

    document.getElementById("resultName").textContent = rmState.outName;
    document.getElementById("resultMeta").textContent =
      (total - toRemove.length) + " pages (removed " + toRemove.length + ") · " + fmtBytes(outBytes.byteLength);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("Removed " + toRemove.length + " page(s)");

    showNextSteps(result, "remove-pages");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}