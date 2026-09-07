/* Images to PDF — embeds each image into a PDF via pdf-lib */
var i2pState = { out: null };

var i2p = document.getElementById("fileInput");
renderI2P = setupDropzone("#fileInput", "#fileList", function () {
  var files = Array.prototype.slice.call(i2p.files);
  var images = files.filter(function (f) { return /\.(jpe?g|png)$/i.test(f.name); });
  if (files.length !== images.length)
    toast("Only JPG / PNG images are supported", true);
});

document.getElementById("dlBtn").addEventListener("click", function () {
  if (i2pState.out) saveBlob(i2pState.out, i2pState.outName);
});

document.getElementById("runBtn").addEventListener("click", imagesToPdf);

const PDF_SIZES = {
  a4:    { w: 595.28, h: 841.89 },
  letter:{ w: 612.0,  h: 792.0 },
  auto:  null,
};

async function imagesToPdf() {
  var files = Array.prototype.slice.call(i2p.files).filter(function (f) {
    return /\.(jpe?g|png)$/i.test(f.name);
  });
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (!files.length) { toast("Please add at least one JPG or PNG image", true); return; }

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "0%"; label.textContent = "Reading images…";

  try {
    var pdf = await PDFLib.PDFDocument.create();
    var sizeChoice = document.getElementById("pageSize").value;
    var sz = PDF_SIZES[sizeChoice];

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var bytes = new Uint8Array(await f.arrayBuffer());
      var isPng = (bytes[0] === 0x89 && bytes[1] === 0x50) || /\.png$/i.test(f.name);
      var img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);

      var page;
      if (sizeChoice === "auto") {
        var maxW = 600, maxH = 1000;
        var ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        page = pdf.addPage([img.width * ratio, img.height * ratio]);
        page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      } else {
        page = pdf.addPage([sz.w, sz.h]);
        var m = Math.min(sz.w / img.width, sz.h / img.height);
        var dw = img.width * m, dh = img.height * m;
        page.drawImage(img, { x: (sz.w - dw) / 2, y: (sz.h - dh) / 2, width: dw, height: dh });
      }

      bar.style.width = ((i + 1) / files.length) * 100 + "%";
      label.textContent = "Adding image " + (i + 1) + "/" + files.length;
      await delay(10);
    }

    var outBytes = await pdf.save();
    i2pState.out = new Blob([outBytes], { type: "application/pdf" });
    i2pState.outName = "images.pdf";

    document.getElementById("resultName").textContent = "images.pdf";
    document.getElementById("resultMeta").textContent =
      files.length + " image(s) · " + fmtBytes(outBytes.byteLength);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("PDF created — " + files.length + " page(s)");

    showNextSteps(result, "images-to-pdf");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
  }
}