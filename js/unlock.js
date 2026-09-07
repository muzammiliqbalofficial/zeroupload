/* Unlock PDF — pdf-lib has no real decryption support (its `ignoreEncryption`
 * option bypasses the load guard but never actually decrypts content, and it
 * has no `password` handling at all), so the file is opened via pdf.js
 * (which can genuinely decrypt with the right password) and every page is
 * rebuilt as a fresh, unencrypted PDF. */
var unlState = { out: null };
var unlInput = document.getElementById("fileInput");
setupDropzone("#fileInput", "#fileList");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById("dlBtn").addEventListener("click", function () {
  if (unlState.out) saveBlob(unlState.out, unlState.outName);
});
document.getElementById("runBtn").addEventListener("click", unlockNow);

function dataURLtoUint8(dataUrl) {
  var parts = dataUrl.split(",");
  var bin = atob(parts[1]);
  var arr = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function unlockNow() {
  var files = Array.prototype.slice.call(unlInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];
  var openPwd = document.getElementById("pwdInput").value;

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Opening PDF…";

  try {
    var data = await file.arrayBuffer();
    var pdf;
    try {
      pdf = await pdfjsLib.getDocument({ data: data.slice(0), password: openPwd || undefined }).promise;
    } catch (e1) {
      if (e1.name === "PasswordException") {
        throw new Error("This file requires a password to open. Enter it above.");
      }
      throw e1;
    }

    var total = pdf.numPages;
    var out = await PDFLib.PDFDocument.create();

    for (var i = 1; i <= total; i++) {
      var page = await pdf.getPage(i);
      var vp = page.getViewport({ scale: 2.0 });
      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      var jpg = canvas.toDataURL("image/jpeg", 0.92);
      var jpgBytes = dataURLtoUint8(jpg);

      var vp1 = page.getViewport({ scale: 1 });
      var img = await out.embedJpg(jpgBytes);
      var np = out.addPage([vp1.width, vp1.height]);
      np.drawImage(img, { x: 0, y: 0, width: vp1.width, height: vp1.height });

      bar.style.width = (i / total) * 100 + "%";
      label.textContent = "Unlocking page " + i + "/" + total;
      await delay(10);
    }

    var outBytes = await out.save();
    unlState.out = new Blob([outBytes], { type: "application/pdf" });
    unlState.outName = baseName(file.name) + "_unlocked.pdf";

    document.getElementById("resultName").textContent = unlState.outName;
    document.getElementById("resultMeta").textContent =
      total + " pages · restrictions removed · " + fmtBytes(outBytes.byteLength);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("PDF unlocked successfully");

    showNextSteps(result, "unlock");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}
