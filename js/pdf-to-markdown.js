(function () {
  var extractedMd = '';
  var extractedTxt = '';
  var fileNameBase = 'document';

  var fileInput = document.getElementById('fileInput');
  var dropzone = document.getElementById('dropzone');
  var mdStudio = document.getElementById('mdStudio');
  var mdRawOutput = document.getElementById('mdRawOutput');
  var mdPreviewOutput = document.getElementById('mdPreviewOutput');
  var mdMetaLabel = document.getElementById('mdMetaLabel');

  async function convertPdfToMd(file) {
    fileNameBase = file.name.replace(/\.[^/.]+$/, '');
    var progWrap = document.getElementById('progressWrap');
    var progBar = document.getElementById('progressBar');
    var progLabel = document.getElementById('progressLabel');

    progWrap.style.display = 'block';
    progBar.style.width = '20%';
    progLabel.textContent = 'Loading document...';

    try {
      var ab = await file.arrayBuffer();
      var pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
      var numPages = pdf.numPages;

      var mdSections = [];
      var txtSections = [];

      for (var pageNum = 1; pageNum <= numPages; pageNum++) {
        progBar.style.width = (20 + Math.floor((pageNum / numPages) * 70)) + '%';
        progLabel.textContent = 'Extracting Page ' + pageNum + ' of ' + numPages + '...';

        var page = await pdf.getPage(pageNum);
        var textContent = await page.getTextContent();
        var items = textContent.items;

        if (items.length === 0) continue;

        // Group into lines by Y coordinate
        var lines = [];
        var currentLine = [];
        var lastY = null;

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var y = Math.round(item.transform[5]);
          var str = item.str.trim();
          var fontSize = Math.round(item.transform[0]);

          if (!str) continue;

          if (lastY === null || Math.abs(y - lastY) < 4) {
            currentLine.push({ text: str, size: fontSize });
          } else {
            if (currentLine.length > 0) lines.push(currentLine);
            currentLine = [{ text: str, size: fontSize }];
          }
          lastY = y;
        }
        if (currentLine.length > 0) lines.push(currentLine);

        // Process lines into Markdown
        var pageMdLines = [];
        for (var li = 0; li < lines.length; li++) {
          var lineItems = lines[li];
          var lineText = lineItems.map(function (it) { return it.text; }).join(' ');
          var avgSize = lineItems[0].size;

          if (avgSize >= 20) {
            pageMdLines.push('\n# ' + lineText + '\n');
          } else if (avgSize >= 15) {
            pageMdLines.push('\n## ' + lineText + '\n');
          } else if (avgSize >= 13) {
            pageMdLines.push('\n### ' + lineText + '\n');
          } else if (/^[-*•●▪‣]/.test(lineText)) {
            pageMdLines.push('- ' + lineText.replace(/^[-*•●▪‣]\s*/, ''));
          } else {
            pageMdLines.push(lineText);
          }
        }

        var pageMd = pageMdLines.join('\n');
        mdSections.push(pageMd);
        txtSections.push(pageMdLines.map(function(l){ return l.replace(/^#+\s*/, ''); }).join('\n'));
      }

      progBar.style.width = '100%';
      progLabel.textContent = 'Extraction complete!';
      setTimeout(function () { progWrap.style.display = 'none'; }, 500);

      extractedMd = mdSections.join('\n\n---\n\n');
      extractedTxt = txtSections.join('\n\n');

      dropzone.classList.add('hide');
      mdStudio.classList.remove('hide');

      mdMetaLabel.textContent = numPages + ' Pages � ' + extractedMd.split(/\s+/).length + ' words';
      mdRawOutput.textContent = extractedMd;

      // Simple formatted HTML preview
      var htmlPreview = extractedMd
        .replace(/^# (.*$)/gim, '<h1></h1>')
        .replace(/^## (.*$)/gim, '<h2></h2>')
        .replace(/^### (.*$)/gim, '<h3></h3>')
        .replace(/^\- (.*$)/gim, '<li></li>')
        .replace(/\n\n/gim, '<br><br>');
      mdPreviewOutput.innerHTML = htmlPreview;

      toast('PDF converted to Markdown successfully!');
    } catch (err) {
      progWrap.style.display = 'none';
      toast('Failed to extract text from PDF: ' + err.message, true);
    }
  }

  if (fileInput) {
    fileInput.onchange = function () {
      if (fileInput.files && fileInput.files[0]) {
        convertPdfToMd(fileInput.files[0]);
      }
    };
  }

  // Copy Markdown
  var copyMdBtn = document.getElementById('copyMdBtn');
  if (copyMdBtn) {
    copyMdBtn.onclick = function () {
      if (!extractedMd) return;
      navigator.clipboard.writeText(extractedMd).then(function () {
        toast('Markdown copied to clipboard!');
      }).catch(function () {
        toast('Failed to copy', true);
      });
    };
  }

  // Download .md
  var dlMdBtn = document.getElementById('dlMdBtn');
  if (dlMdBtn) {
    dlMdBtn.onclick = function () {
      if (!extractedMd) return;
      var blob = new Blob([extractedMd], { type: 'text/markdown;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = fileNameBase + '.md';
      a.click();
    };
  }

  // Download .txt
  var dlTxtBtn = document.getElementById('dlTxtBtn');
  if (dlTxtBtn) {
    dlTxtBtn.onclick = function () {
      if (!extractedTxt) return;
      var blob = new Blob([extractedTxt], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = fileNameBase + '.txt';
      a.click();
    };
  }

  // Change file
  var changeFileBtn = document.getElementById('changeFileBtn');
  if (changeFileBtn) {
    changeFileBtn.onclick = function () {
      mdStudio.classList.add('hide');
      dropzone.classList.remove('hide');
      fileInput.value = '';
    };
  }
})();
