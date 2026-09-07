/* Rotate PDF — rotate whole doc or specific pages via pdf-lib */
var rotState = { out: null, pageRotations: {} };
var rotInput = document.getElementById("fileInput");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

renderRot = setupDropzone("#fileInput", "#fileList", onFileSelected);

async function onFileSelected() {
  var files = Array.prototype.slice.call(rotInput.files);
  var grid = document.getElementById("thumbGrid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.classList.add("hide");
  rotState.pageRotations = {};

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
      item.style.cssText = "display:flex; flex-direction:column; align-items:center; background:var(--card); border:1px solid var(--border); border-radius:8px; padding:6px; cursor:pointer;";
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

      item.onclick = (function(pNum) {
        return function() {
          var input = document.getElementById("pageRange");
          var pageAll = document.getElementById("pageAll");
          pageAll.checked = false;
          document.getElementById("rangeField").classList.remove("hide");
          var curVal = input.value ? input.value.split(",").map(function(s){return s.trim();}).filter(Boolean) : [];
          var strNum = String(pNum);
          var idx = curVal.indexOf(strNum);
          if (idx !== -1) { curVal.splice(idx, 1); } else { curVal.push(strNum); }
          input.value = curVal.join(", ");
        };
      })(i);

      grid.appendChild(item);
    }
  } catch (e) {
    console.error("Thumbnail render error:", e);
  }
}

document.getElementById("dlBtn").addEventListener("click", function () {
  if (rotState.out) saveBlob(rotState.out, rotState.outName);
});

document.getElementById("pageAll").addEventListener("change", function (e) {
  document.getElementById("rangeField").classList.toggle("hide", e.target.checked);
});

document.getElementById("runBtn").addEventListener("click", rotateNow);

function parseRange(str, total) {
  var set = [];
  String(str).split(",").forEach(function (p) {
    p = p.trim(); if (!p) return;
    var m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) { for (var i = +m[1]; i <= +m[2]; i++) set.push(i); }
    else if (/^\d+$/.test(p)) set.push(+p);
  });
  return set.filter(function (p) { return p >= 1 && p <= total; });
}

async function rotateNow() {
  var files = Array.prototype.slice.call(rotInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];
  var deg = parseInt(document.querySelector('input[name="deg"]:checked').value, 10);
  var useAll = document.getElementById("pageAll").checked;

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Rotating…";

  try {
    var bytes = new Uint8Array(await file.arrayBuffer());
    var pdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    var total = pdf.getPageCount();
    var targets;

    if (useAll) {
      targets = PDFLib.range(0, total - 1);
    } else {
      targets = parseRange(document.getElementById("pageRange").value, total).map(function (p) { return p - 1; });
      if (!targets.length) { toast("No valid pages (1–" + total + ")", true); return; }
    }

    targets.forEach(function (idx) {
      var page = pdf.getPage(idx);
      var cur = (page.getRotation().degrees || 0);
      page.setRotation(PDFLib.degrees((cur + deg) % 360));
    });

    bar.style.width = "70%";
    var outBytes = await pdf.save();
    rotState.out = new Blob([outBytes], { type: "application/pdf" });
    rotState.outName = baseName(file.name) + "_rotated.pdf";

    document.getElementById("resultName").textContent = rotState.outName;
    document.getElementById("resultMeta").textContent =
      targets.length + " page(s) rotated " + deg + "° · " + fmtBytes(outBytes.byteLength);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("Rotation applied to " + targets.length + " pages");

    showNextSteps(result, "rotate");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}