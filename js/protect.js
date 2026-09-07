/* Protect PDF — pdf-lib has no encryption support (it can only read encrypted
 * PDFs, not write them), so pages are rendered to images and reassembled via
 * jsPDF, which has real built-in password encryption. */
var protState = { out: null };
var protInput = document.getElementById("fileInput");
setupDropzone("#fileInput", "#fileList");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById("dlBtn").addEventListener("click", function () {
  if (protState.out) saveBlob(protState.out, protState.outName);
});
document.getElementById("runBtn").addEventListener("click", protectNow);

async function protectNow() {
  var files = Array.prototype.slice.call(protInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one PDF", true); return; }
  var file = files[0];
  var pwd = document.getElementById("pwdInput").value;
  if (!pwd) { toast("Enter a password first", true); return; }

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
    var doc = null;

    for (var i = 1; i <= total; i++) {
      var page = await pdf.getPage(i);
      var vp = page.getViewport({ scale: 2.0 });
      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      var jpg = canvas.toDataURL("image/jpeg", 0.92);

      var vp1 = page.getViewport({ scale: 1 });
      var pw = vp1.width, ph = vp1.height;

      if (!doc) {
        doc = new window.jspdf.jsPDF({
          unit: "pt",
          format: [pw, ph],
          compress: true,
          encryption: { userPassword: pwd, ownerPassword: pwd, userPermissions: ["print"] },
        });
      } else {
        doc.addPage([pw, ph]);
      }
      doc.addImage(jpg, "JPEG", 0, 0, pw, ph);

      bar.style.width = (i / total) * 100 + "%";
      label.textContent = "Protecting page " + i + "/" + total;
      await delay(10);
    }

    var blob = doc.output("blob");
    protState.out = blob;
    protState.outName = baseName(file.name) + "_protected.pdf";

    document.getElementById("resultName").textContent = protState.outName;
    document.getElementById("resultMeta").textContent =
      total + " page(s) · password protected · " + fmtBytes(blob.size);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("PDF is now password protected");

    showNextSteps(result, "protect");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}
