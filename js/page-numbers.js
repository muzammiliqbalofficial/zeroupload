(function () {
  var pdfBytes = null;
  var activeMode = 'numbers';
  var selectedPos = 'bc';

  var fileInput = document.getElementById('fileInput');
  var dropzone = document.getElementById('dropzone');
  var numberStudio = document.getElementById('numberStudio');

  // Tabs
  var tabNum = document.getElementById('tabNum');
  var tabWatermark = document.getElementById('tabWatermark');
  var panelNum = document.getElementById('panelNum');
  var panelWatermark = document.getElementById('panelWatermark');

  if (tabNum && tabWatermark) {
    tabNum.onclick = function () {
      activeMode = 'numbers';
      tabNum.classList.add('active');
      tabWatermark.classList.remove('active');
      panelNum.classList.remove('hide');
      panelWatermark.classList.add('hide');
    };
    tabWatermark.onclick = function () {
      activeMode = 'watermark';
      tabWatermark.classList.add('active');
      tabNum.classList.remove('active');
      panelWatermark.classList.remove('hide');
      panelNum.classList.add('hide');
    };
  }

  // Sliders feedback
  var fontSizeInput = document.getElementById('fontSize');
  if (fontSizeInput) {
    fontSizeInput.oninput = function () {
      document.getElementById('fontSizeVal').textContent = fontSizeInput.value;
    };
  }
  var wmOpacityInput = document.getElementById('wmOpacity');
  if (wmOpacityInput) {
    wmOpacityInput.oninput = function () {
      document.getElementById('wmOpacityVal').textContent = wmOpacityInput.value;
    };
  }
  var wmSizeInput = document.getElementById('wmSize');
  if (wmSizeInput) {
    wmSizeInput.oninput = function () {
      document.getElementById('wmSizeVal').textContent = wmSizeInput.value;
    };
  }

  // Position Picker
  document.querySelectorAll('.pos-btn').forEach(function (btn) {
    btn.onclick = function () {
      document.querySelectorAll('.pos-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedPos = btn.getAttribute('data-pos') || 'bc';
    };
  });

  async function loadPdf(file) {
    var ab = await file.arrayBuffer();
    pdfBytes = new Uint8Array(ab);
    dropzone.classList.add('hide');
    numberStudio.classList.remove('hide');
  }

  if (fileInput) {
    fileInput.onchange = function () {
      if (fileInput.files && fileInput.files[0]) {
        loadPdf(fileInput.files[0]);
      }
    };
  }

  var changeFileBtn = document.getElementById('changeFileBtn');
  if (changeFileBtn) {
    changeFileBtn.onclick = function () {
      numberStudio.classList.add('hide');
      dropzone.classList.remove('hide');
      fileInput.value = '';
      document.getElementById('result').classList.add('hide');
    };
  }

  // Run & Download
  var runBtn = document.getElementById('runBtn');
  if (runBtn) {
    runBtn.onclick = async function () {
      if (!pdfBytes) {
        toast('Please upload a PDF first.', true);
        return;
      }

      var progWrap = document.getElementById('progressWrap');
      var progBar = document.getElementById('progressBar');
      var progLabel = document.getElementById('progressLabel');
      progWrap.style.display = 'block';
      progBar.style.width = '30%';
      progLabel.textContent = 'Processing PDF...';

      try {
        var pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        var helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        var helveticaBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        var pages = pdfDoc.getPages();
        var totalPages = pages.length;

        if (activeMode === 'numbers') {
          var formatStr = document.getElementById('numFormat').value;
          var startPageNum = parseInt(document.getElementById('startPage').value, 10) || 1;
          var size = parseInt(document.getElementById('fontSize').value, 10) || 10;
          var margin = 28;

          for (var i = startPageNum - 1; i < totalPages; i++) {
            var page = pages[i];
            var pageNum = i + 1;
            var text = formatStr
              .replace('{n}', pageNum)
              .replace('{total}', totalPages);

            var textWidth = helveticaFont.widthOfTextAtSize(text, size);
            var textHeight = helveticaFont.heightAtSize(size);
            var pSize = page.getSize();

            var x = margin;
            var y = margin;

            if (selectedPos === 'tl') { x = margin; y = pSize.height - margin - textHeight; }
            if (selectedPos === 'tc') { x = (pSize.width - textWidth) / 2; y = pSize.height - margin - textHeight; }
            if (selectedPos === 'tr') { x = pSize.width - margin - textWidth; y = pSize.height - margin - textHeight; }
            if (selectedPos === 'bl') { x = margin; y = margin; }
            if (selectedPos === 'bc') { x = (pSize.width - textWidth) / 2; y = margin; }
            if (selectedPos === 'br') { x = pSize.width - margin - textWidth; y = margin; }

            page.drawText(text, {
              x: x,
              y: y,
              size: size,
              font: helveticaFont,
              color: PDFLib.rgb(0.2, 0.2, 0.2),
            });
          }
        } else {
          // Watermark mode
          var wmText = document.getElementById('wmText').value.trim() || 'CONFIDENTIAL';
          var opacity = (parseInt(document.getElementById('wmOpacity').value, 10) || 25) / 100;
          var angle = parseInt(document.getElementById('wmRotation').value, 10) || 45;
          var wmSize = parseInt(document.getElementById('wmSize').value, 10) || 48;

          for (var j = 0; j < totalPages; j++) {
            var p = pages[j];
            var pDim = p.getSize();
            var tWidth = helveticaBold.widthOfTextAtSize(wmText, wmSize);
            var tHeight = helveticaBold.heightAtSize(wmSize);

            p.drawText(wmText, {
              x: (pDim.width - tWidth) / 2,
              y: (pDim.height - tHeight) / 2,
              size: wmSize,
              font: helveticaBold,
              color: PDFLib.rgb(0.6, 0.6, 0.6),
              opacity: opacity,
              rotate: PDFLib.degrees(angle),
            });
          }
        }

        progBar.style.width = '80%';
        progLabel.textContent = 'Saving document...';
        var outputBytes = await pdfDoc.save();

        progBar.style.width = '100%';
        progLabel.textContent = 'Done!';
        setTimeout(function () { progWrap.style.display = 'none'; }, 600);

        var blob = new Blob([outputBytes], { type: 'application/pdf' });
        var blobUrl = URL.createObjectURL(blob);
        var res = document.getElementById('result');
        res.classList.remove('hide');
        document.getElementById('resultName').textContent = 'numbered_document.pdf';
        document.getElementById('resultMeta').textContent = fmtBytes(outputBytes.length) + ' · ' + totalPages + ' pages';
        document.getElementById('dlBtn').onclick = function () {
          var a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'numbered_document.pdf';
          a.click();
        };
        toast('PDF processed successfully!');
      } catch (err) {
        progWrap.style.display = 'none';
        toast('Failed to process PDF: ' + err.message, true);
      }
    };
  }
})();
