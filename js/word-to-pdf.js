/* Word to PDF — mammoth converts docx to HTML, then rendered to PDF via jsPDF */
var w2pState = { out: null };

var w2pInput = document.getElementById("fileInput");
renderW2P = setupDropzone("#fileInput", "#fileList");

document.getElementById("dlBtn").addEventListener("click", function () {
  if (w2pState.out) saveBlob(w2pState.out, w2pState.outName);
});

document.getElementById("runBtn").addEventListener("click", convertWordToPdf);

async function convertWordToPdf() {
  var files = Array.prototype.slice.call(w2pInput.files);
  var runBtn = document.getElementById("runBtn");
  var prog = document.getElementById("progressWrap");
  var bar = document.getElementById("progressBar");
  var label = document.getElementById("progressLabel");
  var result = document.getElementById("result");

  if (files.length !== 1) { toast("Please add exactly one .docx file", true); return; }
  var file = files[0];

  runBtn.disabled = true;
  prog.style.display = "block";
  result.classList.add("hide");
  bar.style.width = "20%"; label.textContent = "Reading Word file…";

  try {
    var html = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    bar.style.width = "50%"; label.textContent = "Rendering pages…";

    // Build an offscreen render container with document typography
    var holder = document.getElementById("w2p-holder") || document.createElement("div");
    holder.id = "w2p-holder";
    holder.style.cssText = "position:absolute;left:-10000px;top:0;width:794px;background:#fff;padding:48px;";
    // Keep conversion content inert and block document-triggered remote image requests.
    var parsed = new DOMParser().parseFromString(html.value, 'text/html');
    parsed.querySelectorAll('script,style,link,iframe,object,embed,svg,math,base,meta,form').forEach(function (el) { el.remove(); });
    parsed.querySelectorAll('*').forEach(function (el) {
      Array.from(el.attributes).forEach(function (attr) {
        if (attr.name !== 'src' && attr.name !== 'colspan' && attr.name !== 'rowspan' && attr.name !== 'alt') el.removeAttribute(attr.name);
      });
      if (el.hasAttribute('src') && (el.tagName !== 'IMG' || !/^data:image\/(png|jpeg|gif|webp);base64,/i.test(el.getAttribute('src')))) el.removeAttribute('src');
    });
    holder.innerHTML = '';
    holder.style.fontFamily = 'Arial, sans-serif';
    holder.style.color = '#111';
    holder.style.lineHeight = '1.55';
    holder.appendChild(document.importNode(parsed.body, true));
    document.body.appendChild(holder);

    // jsPDF is a singleton in the UMD build
    var doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4", compress: true });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();

    var canvas = await html2canvas(holder, { scale: 2.0, backgroundColor: "#ffffff", useCORS: true });
    bar.style.width = "80%"; label.textContent = "Building PDF…";
    await delay(20);

    // Slice the full-render canvas into A4-sized page bands.
    // One page = pageH * (canvas.width / pageW) pixels tall on the canvas.
    var pxPerPt = canvas.width / pageW;
    var pageHeightPx = pageH * pxPerPt;
    var y = 0;
    var max = canvas.height;
    while (y < max) {
      var slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = Math.min(canvas.height - y, Math.ceil(pageHeightPx));
      slice.getContext("2d").drawImage(canvas, 0, y, slice.width, slice.height, 0, 0, slice.width, slice.height);
      var pageImg = slice.toDataURL("image/jpeg", 0.88);
      if (y > 0) doc.addPage();
      doc.addImage(pageImg, "JPEG", 0, 0, pageW, slice.height / pxPerPt);
      y += slice.height;
      bar.style.width = Math.min(100, 80 + (y / max) * 20) + "%";
      await delay(0);
    }

    var blob = doc.output("blob");
    w2pState.out = blob;
    w2pState.outName = baseName(file.name) + ".pdf";

    document.getElementById("resultName").textContent = w2pState.outName;
    document.getElementById("resultMeta").textContent = "Converted from " + file.name + " · " + fmtBytes(blob.size);
    result.classList.remove("hide");
    bar.style.width = "100%"; label.textContent = "Done";
    toast("PDF created successfully");

    showNextSteps(result, "word-to-pdf");
  } catch (err) {
    console.error(err);
    toast(friendlyPdfError(err), true);
  } finally {
    runBtn.disabled = false;
    prog.style.display = "none";
    var h = document.getElementById("w2p-holder");
    if (h && h.parentNode) h.parentNode.removeChild(h);
  }
}