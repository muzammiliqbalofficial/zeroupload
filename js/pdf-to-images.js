/* PDF to Images — renders each page, downloads all as ZIP */
var p2iState = { out: null };
var p2i = document.getElementById("fileInput");
renderP2I = setupDropzone("#fileInput", "#fileList");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById("dlBtn").addEventListener("click", function () {
  if (p2iState.out) saveBlob(p2iState.out, p2iState.outName);
});

document.getElementById("runBtn").addEventListener("click", exportImages);

async function exportImages() {
  var files = Array.prototype.slice.call(p2i.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");
  var preview = document.getElementById("preview");
  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];
  var fmt = document.querySelector('input[name="fmt"]:checked').value;
  var scale = parseFloat(document.getElementById("scaleSelect").value);

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  preview.innerHTML = "";
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
    var zip = new JSZip();
    var imgs = [];

    for (var i = 1; i <= total; i++) {
      var page = await pdf.getPage(i);
      var vp = page.getViewport({ scale: scale });
      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;

      var mime = fmt === "png" ? "image/png" : "image/jpeg";
      var dataUrl = canvas.toDataURL(mime, 0.9);
      var data = dataURLtoUint8(dataUrl);
      var name = baseName(file.name) + "-page-" + i + "." + (fmt === "png" ? "png" : "jpg");
      zip.file(name, data);
      imgs.push({ url: dataUrl });

      // recycle canvas reference to help memory
      bar.style.width = (i / total) * 100 + "%";
      label.textContent = "Exporting page " + i + "/" + total;
      await delay(10);
    }

    var zipBytes = await zip.generateAsync({ type: "uint8array" });
    p2iState.out = new Blob([zipBytes], { type: "application/zip" });
    p2iState.outName = baseName(file.name) + "_images.zip";

    // show a few previews
    imgs.slice(0, 8).forEach(function (m) {
      var img = document.createElement("img");
      img.src = m.url;
      preview.appendChild(img);
    });

    document.getElementById("resultName").textContent = p2iState.outName;
    document.getElementById("resultMeta").textContent =
      total + " image(s) · " + fmtBytes(p2iState.out.size);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("Exported " + total + " images");

    showNextSteps(result, "pdf-to-images");
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
  var bin = atob(parts[1]);
  var arr = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}