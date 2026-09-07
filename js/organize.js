(function () {
  var pdfBytes = null;
  var pdfDocProxy = null;
  var pagesList = []; // { index: 0-based, rotation: 0, deleted: false }
  var draggedItemIndex = null;

  var fileInput = document.getElementById('fileInput');
  var dropzone = document.getElementById('dropzone');
  var organizeStudio = document.getElementById('organizeStudio');
  var pagesGrid = document.getElementById('pagesGrid');
  var pageCountLabel = document.getElementById('pageCountLabel');

  // Delete, rotate and reorder all happen on a single click with no
  // confirmation, and the only recovery before this was "Reset Order," which
  // throws away every change at once rather than just the last one. This is a
  // plain undo stack: a snapshot of pagesList is pushed before each mutation,
  // and Undo (or Ctrl+Z) pops the most recent one back.
  var history = [];
  var HISTORY_LIMIT = 30;
  var undoBtn = document.getElementById('undoBtn');

  function snapshot() {
    return pagesList.map(function (p) { return { index: p.index, rotation: p.rotation, deleted: p.deleted }; });
  }

  function pushHistory() {
    history.push(snapshot());
    if (history.length > HISTORY_LIMIT) history.shift();
    updateUndoButton();
  }

  function undo() {
    if (!history.length) return;
    pagesList = history.pop();
    updateUndoButton();
    renderGrid();
  }

  function updateUndoButton() {
    if (undoBtn) undoBtn.disabled = history.length === 0;
  }

  if (undoBtn) {
    undoBtn.addEventListener('click', undo);
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      if (!organizeStudio || organizeStudio.classList.contains('hide')) return;
      e.preventDefault();
      undo();
    }
  });

  async function loadPdf(file) {
    var ab = await file.arrayBuffer();
    pdfBytes = new Uint8Array(ab);
    pdfDocProxy = await pdfjsLib.getDocument({ data: pdfBytes.slice(0) }).promise;

    pagesList = [];
    for (var i = 0; i < pdfDocProxy.numPages; i++) {
      pagesList.push({ index: i, rotation: 0, deleted: false });
    }
    history = [];
    updateUndoButton();

    dropzone.classList.add('hide');
    organizeStudio.classList.remove('hide');
    pageCountLabel.textContent = pdfDocProxy.numPages + ' Pages in Document';

    await renderGrid();
  }

  async function renderGrid() {
    pagesGrid.innerHTML = '';
    var activeCount = 0;

    for (var i = 0; i < pagesList.length; i++) {
      (function (item, position) {
        if (item.deleted) return;
        activeCount++;

        var card = document.createElement('div');
        card.className = 'page-card';
        card.draggable = true;
        card.dataset.position = position;

        var cvs = document.createElement('canvas');
        card.appendChild(cvs);

        var numBadge = document.createElement('div');
        numBadge.className = 'page-num';
        numBadge.textContent = 'Page ' + (item.index + 1);
        card.appendChild(numBadge);

        var actions = document.createElement('div');
        actions.className = 'page-actions';

        var rotBtn = document.createElement('button');
        rotBtn.className = 'page-btn';
        rotBtn.type = 'button';
        rotBtn.title = 'Rotate 90°';
        rotBtn.innerHTML = '<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
        rotBtn.onclick = function (e) {
          e.stopPropagation();
          pushHistory();
          item.rotation = (item.rotation + 90) % 360;
          cvs.style.transform = 'rotate(' + item.rotation + 'deg)';
        };

        var delBtn = document.createElement('button');
        delBtn.className = 'page-btn danger';
        delBtn.type = 'button';
        delBtn.title = 'Delete Page';
        delBtn.innerHTML = '<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
        delBtn.onclick = function (e) {
          e.stopPropagation();
          pushHistory();
          item.deleted = true;
          renderGrid();
        };

        actions.appendChild(rotBtn);
        actions.appendChild(delBtn);
        card.appendChild(actions);

        // Drag events
        card.addEventListener('dragstart', function () {
          draggedItemIndex = position;
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', function () {
          card.classList.remove('dragging');
          draggedItemIndex = null;
        });
        card.addEventListener('dragover', function (e) {
          e.preventDefault();
        });
        card.addEventListener('drop', function (e) {
          e.preventDefault();
          if (draggedItemIndex === null || draggedItemIndex === position) return;
          pushHistory();
          var movedItem = pagesList.splice(draggedItemIndex, 1)[0];
          pagesList.splice(position, 0, movedItem);
          renderGrid();
        });

        pagesGrid.appendChild(card);

        // Render page thumbnail async
        pdfDocProxy.getPage(item.index + 1).then(function (page) {
          var viewport = page.getViewport({ scale: 0.3 });
          cvs.width = viewport.width;
          cvs.height = viewport.height;
          var ctx = cvs.getContext('2d');
          page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
            if (item.rotation) {
              cvs.style.transform = 'rotate(' + item.rotation + 'deg)';
            }
          });
        });
      })(pagesList[i], i);
    }
    pageCountLabel.textContent = activeCount + ' Pages Active';
  }

  // Rotate all
  var rotateAllBtn = document.getElementById('rotateAllBtn');
  if (rotateAllBtn) {
    rotateAllBtn.onclick = function () {
      pushHistory();
      pagesList.forEach(function (p) {
        if (!p.deleted) p.rotation = (p.rotation + 90) % 360;
      });
      renderGrid();
    };
  }

  // Reset order
  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.onclick = function () {
      if (!pdfDocProxy) return;
      pushHistory();
      pagesList = [];
      for (var i = 0; i < pdfDocProxy.numPages; i++) {
        pagesList.push({ index: i, rotation: 0, deleted: false });
      }
      renderGrid();
    };
  }

  // Change file
  var changeFileBtn = document.getElementById('changeFileBtn');
  if (changeFileBtn) {
    changeFileBtn.onclick = function () {
      organizeStudio.classList.add('hide');
      dropzone.classList.remove('hide');
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

  // Save & Download
  var runBtn = document.getElementById('runBtn');
  if (runBtn) {
    runBtn.onclick = async function () {
      var activePages = pagesList.filter(function (p) { return !p.deleted; });
      if (activePages.length === 0) {
        toast('Please keep at least one page in your document.', true);
        return;
      }

      var progWrap = document.getElementById('progressWrap');
      var progBar = document.getElementById('progressBar');
      var progLabel = document.getElementById('progressLabel');
      progWrap.style.display = 'block';
      progBar.style.width = '30%';
      progLabel.textContent = 'Organizing PDF pages...';

      try {
        var srcDoc = await PDFLib.PDFDocument.load(pdfBytes);
        var newDoc = await PDFLib.PDFDocument.create();

        var pageIndicesToCopy = activePages.map(function (p) { return p.index; });
        var copiedPages = await newDoc.copyPages(srcDoc, pageIndicesToCopy);

        for (var i = 0; i < copiedPages.length; i++) {
          var p = copiedPages[i];
          var rot = (p.getRotation().angle + activePages[i].rotation) % 360;
          p.setRotation(PDFLib.degrees(rot));
          newDoc.addPage(p);
        }

        progBar.style.width = '80%';
        progLabel.textContent = 'Saving PDF...';
        var outputBytes = await newDoc.save();

        progBar.style.width = '100%';
        progLabel.textContent = 'Done!';
        setTimeout(function () { progWrap.style.display = 'none'; }, 600);

        var blob = new Blob([outputBytes], { type: 'application/pdf' });
        var blobUrl = URL.createObjectURL(blob);
        var res = document.getElementById('result');
        res.classList.remove('hide');
        document.getElementById('resultName').textContent = 'organized_document.pdf';
        document.getElementById('resultMeta').textContent = fmtBytes(outputBytes.length) + ' · ' + activePages.length + ' pages';
        document.getElementById('dlBtn').onclick = function () {
          var a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'organized_document.pdf';
          a.click();
        };
        toast('PDF organized successfully!');
      } catch (err) {
        progWrap.style.display = 'none';
        toast('Failed to organize PDF: ' + err.message, true);
      }
    };
  }
})();
