(function () {
  var pdfBytes = null;
  var pdfDocProxy = null;
  var currentPdfDoc = null;
  var activeTab = 'draw';
  var sigColor = '#000000';
  var selectedPageNum = 1;
  var stampX = 0.25; // 0..1 ratio
  var stampY = 0.60;
  var stampW = 160;
  var stampH = 60;
  var isDrawing = false;
  var lastX = 0, lastY = 0;

  var fileInput = document.getElementById('fileInput');
  var signStudio = document.getElementById('signStudio');
  var sigCanvas = document.getElementById('sigCanvas');
  var sigCtx = sigCanvas ? sigCanvas.getContext('2d') : null;
  var stampCanvas = document.getElementById('stampCanvas');
  var stampCtx = stampCanvas ? stampCanvas.getContext('2d') : null;
  var docPreviewCanvas = document.getElementById('docPreviewCanvas');
  var previewCtx = docPreviewCanvas ? docPreviewCanvas.getContext('2d') : null;
  var stampPreviewArea = document.getElementById('stampPreviewArea');
  var draggableStamp = document.getElementById('draggableStamp');
  var pageSelect = document.getElementById('pageSelect');

  // Resize canvas for sharp retina display
  function initSigCanvas() {
    if (!sigCanvas) return;
    var rect = sigCanvas.getBoundingClientRect();
    sigCanvas.width = (rect.width || 400) * 2;
    sigCanvas.height = 180 * 2;
    sigCtx.scale(2, 2);
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.strokeStyle = sigColor;
  }

  // Draw Tab Events
  if (sigCanvas) {
    function startDraw(e) {
      isDrawing = true;
      var rect = sigCanvas.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      lastX = cx; lastY = cy;
      sigCtx.beginPath();
      sigCtx.moveTo(cx, cy);
    }
    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      var rect = sigCanvas.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      sigCtx.lineTo(cx, cy);
      sigCtx.stroke();
      lastX = cx; lastY = cy;
      updateStamp();
    }
    function stopDraw() {
      if (isDrawing) {
        isDrawing = false;
        updateStamp();
      }
    }
    sigCanvas.addEventListener('mousedown', startDraw);
    sigCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);
    sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
    sigCanvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);
  }

  // Clear signature
  var clearBtn = document.getElementById('clearSigBtn');
  if (clearBtn) {
    clearBtn.onclick = function () {
      if (sigCtx) {
        sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
        updateStamp();
      }
    };
  }

  // Color dots
  document.querySelectorAll('.sig-color-dot').forEach(function (dot) {
    dot.onclick = function () {
      document.querySelectorAll('.sig-color-dot').forEach(function (d) { d.classList.remove('active'); });
      dot.classList.add('active');
      sigColor = dot.getAttribute('data-color') || '#000';
      if (sigCtx) sigCtx.strokeStyle = sigColor;
      updateStamp();
    };
  });

  // Tab switching
  var tabDraw = document.getElementById('tabDraw');
  var tabType = document.getElementById('tabType');
  var tabUpload = document.getElementById('tabUpload');
  var panelDraw = document.getElementById('panelDraw');
  var panelType = document.getElementById('panelType');
  var panelUpload = document.getElementById('panelUpload');

  function setTab(name) {
    activeTab = name;
    [tabDraw, tabType, tabUpload].forEach(function (t) { if (t) t.classList.remove('active'); });
    [panelDraw, panelType, panelUpload].forEach(function (p) { if (p) p.classList.add('hide'); });
    if (name === 'draw') { tabDraw.classList.add('active'); panelDraw.classList.remove('hide'); initSigCanvas(); }
    if (name === 'type') { tabType.classList.add('active'); panelType.classList.remove('hide'); }
    if (name === 'upload') { tabUpload.classList.add('active'); panelUpload.classList.remove('hide'); }
    updateStamp();
  }
  if (tabDraw) tabDraw.onclick = function () { setTab('draw'); };
  if (tabType) tabType.onclick = function () { setTab('type'); };
  if (tabUpload) tabUpload.onclick = function () { setTab('upload'); };

  // Type signature input
  var typeSigInput = document.getElementById('typeSigInput');
  if (typeSigInput) {
    typeSigInput.oninput = function () { updateStamp(); };
  }

  // Upload image
  var sigImageInput = document.getElementById('sigImageInput');
  var uploadedImg = null;
  if (sigImageInput) {
    sigImageInput.onchange = function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          uploadedImg = img;
          updateStamp();
        };
        img.src = r.result;
      };
      r.readAsDataURL(f);
    };
  }

  // Update stampCanvas from active source
  function updateStamp() {
    if (!stampCanvas || !stampCtx) return;
    stampCanvas.width = 320;
    stampCanvas.height = 120;
    stampCtx.clearRect(0, 0, 320, 120);

    if (activeTab === 'draw' && sigCanvas) {
      stampCtx.drawImage(sigCanvas, 0, 0, 320, 120);
    } else if (activeTab === 'type' && typeSigInput) {
      var txt = typeSigInput.value.trim() || 'Your Name';
      stampCtx.font = '36px "Brush Script MT", "Caveat", "Segoe Script", cursive';
      stampCtx.fillStyle = sigColor;
      stampCtx.textAlign = 'center';
      stampCtx.textBaseline = 'middle';
      stampCtx.fillText(txt, 160, 60);
    } else if (activeTab === 'upload' && uploadedImg) {
      stampCtx.drawImage(uploadedImg, 0, 0, 320, 120);
    }
  }

  // Draggable stamp over preview area
  if (draggableStamp && stampPreviewArea) {
    var dragging = false;
    var startX = 0, startY = 0;
    var initLeft = 0, initTop = 0;

    function onDragStart(e) {
      dragging = true;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX; startY = clientY;
      initLeft = draggableStamp.offsetLeft;
      initTop = draggableStamp.offsetTop;
    }
    function onDragMove(e) {
      if (!dragging) return;
      e.preventDefault();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var dx = clientX - startX;
      var dy = clientY - startY;
      var maxLeft = stampPreviewArea.clientWidth - draggableStamp.clientWidth;
      var maxTop = stampPreviewArea.clientHeight - draggableStamp.clientHeight;
      var newLeft = Math.max(0, Math.min(maxLeft, initLeft + dx));
      var newTop = Math.max(0, Math.min(maxTop, initTop + dy));
      draggableStamp.style.left = newLeft + 'px';
      draggableStamp.style.top = newTop + 'px';
      stampX = newLeft / stampPreviewArea.clientWidth;
      stampY = newTop / stampPreviewArea.clientHeight;
    }
    function onDragEnd() { dragging = false; }

    draggableStamp.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    draggableStamp.addEventListener('touchstart', onDragStart, { passive: false });
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
  }

  // Load PDF into UI
  async function loadPdf(file) {
    var ab = await file.arrayBuffer();
    pdfBytes = new Uint8Array(ab);
    pdfDocProxy = await pdfjsLib.getDocument({ data: pdfBytes.slice(0) }).promise;

    pageSelect.innerHTML = '';
    for (var i = 1; i <= pdfDocProxy.numPages; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = 'Page ' + i + ' of ' + pdfDocProxy.numPages;
      pageSelect.appendChild(opt);
    }
    pageSelect.value = 1;
    selectedPageNum = 1;

    signStudio.classList.remove('hide');
    document.getElementById('dropzone').classList.add('hide');
    initSigCanvas();
    renderPagePreview(1);
    updateStamp();
  }

  pageSelect.onchange = function () {
    selectedPageNum = parseInt(pageSelect.value, 10) || 1;
    renderPagePreview(selectedPageNum);
  };

  async function renderPagePreview(num) {
    if (!pdfDocProxy || !docPreviewCanvas) return;
    var page = await pdfDocProxy.getPage(num);
    var viewport = page.getViewport({ scale: 1.0 });
    var containerW = stampPreviewArea.clientWidth || 460;
    var scale = containerW / viewport.width;
    var scaledViewport = page.getViewport({ scale: scale });

    docPreviewCanvas.width = scaledViewport.width;
    docPreviewCanvas.height = scaledViewport.height;

    await page.render({ canvasContext: previewCtx, viewport: scaledViewport }).promise;
  }

  var resetPosBtn = document.getElementById('resetPosBtn');
  if (resetPosBtn) {
    resetPosBtn.onclick = function () {
      var maxLeft = (stampPreviewArea.clientWidth - 160) / 2;
      var maxTop = (stampPreviewArea.clientHeight - 60) / 2;
      draggableStamp.style.left = maxLeft + 'px';
      draggableStamp.style.top = maxTop + 'px';
      stampX = maxLeft / stampPreviewArea.clientWidth;
      stampY = maxTop / stampPreviewArea.clientHeight;
    };
  }

  var resetAllBtn = document.getElementById('resetAllBtn');
  if (resetAllBtn) {
    resetAllBtn.onclick = function () {
      signStudio.classList.add('hide');
      document.getElementById('dropzone').classList.remove('hide');
      fileInput.value = '';
      document.getElementById('result').classList.add('hide');
    };
  }

  if (fileInput) {
    fileInput.onchange = function () {
      if (fileInput.files && fileInput.files[0]) {
        loadPdf(fileInput.files[0]);
      }
    };
  }

  // Sign and Download PDF
  var runBtn = document.getElementById('runBtn');
  if (runBtn) {
    runBtn.onclick = async function () {
      if (!pdfBytes) {
        toast('Please upload a PDF file first.', true);
        return;
      }
      var progWrap = document.getElementById('progressWrap');
      var progBar = document.getElementById('progressBar');
      var progLabel = document.getElementById('progressLabel');
      progWrap.style.display = 'block';
      progBar.style.width = '30%';
      progLabel.textContent = 'Preparing signed document...';

      try {
        var pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        var pages = pdfDoc.getPages();
        var targetPage = pages[selectedPageNum - 1] || pages[0];
        var pageSize = targetPage.getSize();

        // Convert stamp canvas to PNG
        var stampDataUrl = stampCanvas.toDataURL('image/png');
        var stampImgBytes = await (await fetch(stampDataUrl)).arrayBuffer();
        var embeddedImg = await pdfDoc.embedPng(stampImgBytes);

        // Calculate position in PDF points
        var pdfStampW = (draggableStamp.clientWidth / stampPreviewArea.clientWidth) * pageSize.width;
        var pdfStampH = (draggableStamp.clientHeight / stampPreviewArea.clientHeight) * pageSize.height;
        var pdfStampX = stampX * pageSize.width;
        var pdfStampY = pageSize.height - (stampY * pageSize.height) - pdfStampH;

        targetPage.drawImage(embeddedImg, {
          x: Math.max(0, pdfStampX),
          y: Math.max(0, pdfStampY),
          width: pdfStampW,
          height: pdfStampH,
        });

        progBar.style.width = '80%';
        progLabel.textContent = 'Saving PDF...';
        var outputBytes = await pdfDoc.save();

        progBar.style.width = '100%';
        progLabel.textContent = 'Done!';
        setTimeout(function () { progWrap.style.display = 'none'; }, 600);

        var blob = new Blob([outputBytes], { type: 'application/pdf' });
        var blobUrl = URL.createObjectURL(blob);
        var res = document.getElementById('result');
        res.classList.remove('hide');
        document.getElementById('resultName').textContent = 'signed_document.pdf';
        document.getElementById('resultMeta').textContent = fmtBytes(outputBytes.length) + ' · Ready to download';
        document.getElementById('dlBtn').onclick = function () {
          var a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'signed_document.pdf';
          a.click();
        };
        toast('Document signed successfully!');
      } catch (err) {
        progWrap.style.display = 'none';
        toast('Failed to sign document: ' + err.message, true);
      }
    };
  }
})();
