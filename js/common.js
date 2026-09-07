/* ============================================================================
 * Dark Mode Theme Initializer & Toggle Handler
 * ========================================================================== */
function initTheme() {
  try {
    var saved = localStorage.getItem("ZeroUpload-theme");
    if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      saved = "dark";
    }
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (e) {}

  function attachToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.onclick = function (e) {
      e.preventDefault();
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("ZeroUpload-theme", next); } catch (err) {}
    };

    var hamb = document.getElementById("hamburger");
    var nav = document.getElementById("navLinks");
    if (hamb && nav) {
      hamb.onclick = function() {
        var open = nav.classList.toggle("open");
        hamb.classList.toggle("active", open);
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachToggle);
  } else {
    attachToggle();
  }
}

/* ----------------------------------------------------------------------------
 * Shared Dropzone Bootstrapping
 * ------------------------------------------------------------------------ */
function setupDropzone(inputSel, listSel, jsFn) {
  var activeRender = null;

  function init() {
    var input = $(inputSel);
    var list = $(listSel);
    if (!input) return function() {};
    var drop = input.closest(".dropzone");

    function render() {
      if (!list) return;
      var files = Array.prototype.slice.call(input.files || []);
      var reorderable = list.classList.contains("reorderable");
      list.innerHTML = "";
      files.forEach(function (f, i) {
        var it = document.createElement("div");
        it.className = "file-item";
        it._file = f;
        it.draggable = reorderable;
        it.innerHTML =
          (reorderable ? '<span class="drag-handle" title="Drag to reorder">⋮⋮</span>' : "") +
          '<div class="f-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>' +
          '<div class="f-info"><div class="f-name"></div><div class="f-meta"></div></div>' +
          '<span class="f-size-badge"></span>' +
          '<button class="remove" type="button" title="Remove"><svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        it.querySelector(".f-name").textContent = f.name;
        it.querySelector(".f-meta").textContent = f.type || "PDF Document";
        it.querySelector(".f-size-badge").textContent = fmtBytes(f.size);
        it.querySelector(".remove").onclick = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var dt = new DataTransfer();
          Array.prototype.slice.call(input.files).forEach(function (x, j) { if (j !== i) dt.items.add(x); });
          input.files = dt.files;
          if (typeof jsFn === "function") jsFn();
          render();
        };
        list.appendChild(it);
      });
      if (typeof jsFn === "function") jsFn();
    }

    input.addEventListener("change", function () { warnIfLarge(input.files); render(); });

    if (drop && window.File && window.FileList) {
      ["dragenter","dragover"].forEach(function(ev){
        drop.addEventListener(ev, function(e){ e.preventDefault(); drop.classList.add("hover"); });
      });
      ["dragleave","drop"].forEach(function(ev){
        drop.addEventListener(ev, function(e){ e.preventDefault(); drop.classList.remove("hover"); });
      });
      drop.addEventListener("drop", function(e){
        e.preventDefault();
        drop.classList.remove("hover");
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          input.files = e.dataTransfer.files;
          warnIfLarge(input.files);
          render();
        }
      });
    }
    return render;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      activeRender = init();
    });
  } else {
    activeRender = init();
  }

  return function() {
    if (activeRender) activeRender();
  };
}

/* Central list of every tool for related-tools, search, and dynamic routing */
var ZeroUpload_TOOLS = [
  { id: "sign",           name: "Sign PDF",           desc: "Draw, type, or upload digital signature.", color: "icon-indigo", svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>' },
  { id: "organize",       name: "Organize PDF",       desc: "Rearrange, rotate, and delete pages.",     color: "icon-blue",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: "page-numbers",   name: "Page Numbers",       desc: "Add page numbers & watermark.",            color: "icon-emerald",svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>' },
  { id: "pdf-to-markdown",name: "PDF to Markdown",    desc: "Extract text & markdown for AI/LLMs.",     color: "icon-cyan",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>' },
  { id: "merge",          name: "Merge PDF",          desc: "Combine multiple PDFs into one.",          color: "icon-indigo", svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
  { id: "split",          name: "Split PDF",          desc: "Split or extract a page range.",           color: "icon-rose",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>' },
  { id: "compress",       name: "Compress PDF",       desc: "Shrink PDF file size for sharing.",        color: "icon-amber",  svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>' },
  { id: "pdf-to-word",    name: "PDF to Word",        desc: "Convert PDF pages into DOCX.",             color: "icon-blue",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
  { id: "word-to-pdf",    name: "Word to PDF",        desc: "Turn DOCX files into clean PDF.",          color: "icon-cyan",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>' },
  { id: "pdf-to-images",  name: "PDF to Images",      desc: "Export pages as JPG or PNG.",              color: "icon-purple", svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
  { id: "images-to-pdf",  name: "Images to PDF",      desc: "Put JPG/PNG images into one PDF.",         color: "icon-indigo", svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { id: "rotate",         name: "Rotate PDF",         desc: "Rotate pages 90 / 180 degrees.",          color: "icon-emerald",svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>' },
  { id: "remove-pages",   name: "Remove Pages",       desc: "Delete unwanted pages.",                  color: "icon-rose",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' },
  { id: "protect",        name: "Protect PDF",        desc: "Lock document with a password.",           color: "icon-amber",  svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  { id: "unlock",         name: "Unlock PDF",         desc: "Remove password restrictions.",           color: "icon-blue",   svg: '<svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>' }
];

var ZeroUpload_RELATED = {
  "sign":           ["protect", "merge", "organize"],
  "organize":       ["merge", "split", "rotate"],
  "page-numbers":   ["merge", "compress", "sign"],
  "pdf-to-markdown":["pdf-to-word", "compress", "merge"],
  "merge":          ["split", "compress", "organize"],
  "split":          ["merge", "compress", "remove-pages"],
  "compress":       ["merge", "sign", "protect"],
  "pdf-to-word":    ["word-to-pdf", "pdf-to-markdown", "compress"],
  "word-to-pdf":    ["pdf-to-word", "merge", "compress"],
  "pdf-to-images":  ["images-to-pdf", "compress", "merge"],
  "images-to-pdf":  ["pdf-to-images", "merge", "compress"],
  "rotate":         ["organize", "remove-pages", "compress"],
  "remove-pages":   ["organize", "rotate", "merge"],
  "protect":        ["unlock", "sign", "compress"],
  "unlock":         ["protect", "compress", "merge"]
};

function toolById(id) {
  var i = 0;
  while (i < ZeroUpload_TOOLS.length) { if (ZeroUpload_TOOLS[i].id === id) return ZeroUpload_TOOLS[i]; i++; }
  return null;
}
function toolUrl(id) { return "/tools/" + id + ".html"; }

function initRelated() {
  var host = $("#relatedtools");
  if (!host) return;
  var current = seoPageId();
  var ids = ZeroUpload_RELATED[current] || ["merge", "compress", "sign"];

  var head = document.createElement("div");
  head.className = "related-head";
  head.innerHTML = "<h3>You may also need</h3>";
  host.appendChild(head);

  var grid = document.createElement("div");
  grid.className = "related-grid";

  ids.forEach(function (tid) {
    var t = toolById(tid);
    if (!t) return;
    var a = document.createElement("a");
    a.className = "related-card";
    a.href = toolUrl(t.id);
    a.innerHTML =
      '<div class="tool-icon-box ' + (t.color || "icon-blue") + '">' + t.svg + '</div>' +
      '<div class="related-name">' + t.name + '</div>' +
      '<div class="related-desc">' + t.desc + '</div>';
    grid.appendChild(a);
  });

  host.appendChild(grid);
  host.classList.remove("hide");
}

function seoPageId() {
  var path = window.location.pathname;
  var m = /\/tools\/([^/]+?)(\.html)?$/.exec(path);
  return m ? m[1] : "";
}

/* ============================================================================
 * Search Filter Handler with Keyboard Navigation
 * ========================================================================== */
function initSearch() {
  var input = document.getElementById("toolSearch");
  if (!input) return;
  var cards = document.querySelectorAll(".tools-grid .tool-card");

  input.addEventListener("input", function () {
    var q = input.value.toLowerCase().trim();
    cards.forEach(function (c) {
      var hay = (c.getAttribute("data-name") || "") + " " + c.innerText.toLowerCase();
      c.style.display = hay.indexOf(q) !== -1 ? "" : "none";
    });
  });

  // Global Ctrl+K / Cmd+K listener
  window.addEventListener("keydown", function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

/* ============================================================================
 * Google AdSense Deferred Initializer (Mobile Speed Optimized)
 * ========================================================================== */
function initAds() {
  function loadAdSense() {
    try {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8645479142211810";
        s.crossOrigin = "anonymous";
        document.head.appendChild(s);
      }
      var slots = document.querySelectorAll(".adsbygoogle");
      if (slots.length > 0 && typeof window.adsbygoogle !== "undefined") {
        slots.forEach(function () {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        });
      }
    } catch (e) {}
  }
  if (window.requestIdleCallback) {
    window.requestIdleCallback(loadAdSense, { timeout: 1500 });
  } else {
    setTimeout(loadAdSense, 800);
  }
}

/* ---------------------------------------------------------------------------
 * Generic helpers
 * ------------------------------------------------------------------------ */
function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

var toastTimer = null;
function toast(msg, isErr) {
  var t = $("#toast");
  if (!t) return;
  var icon = isErr
    ? '<svg class="icon icon-sm" style="color:var(--danger)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg class="icon icon-sm" style="color:var(--success)" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  t.innerHTML = icon + '<span>' + msg + '</span>';
  t.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3500);
}

/* Everything runs in the browser's own memory, with no server to hand the
   work off to, so a very large file (or a big batch) can slow down or crash
   the tab -- especially on a phone. This is a heads-up, not a hard limit:
   every tool still lets the file through. */
var LARGE_FILE_WARN_BYTES = 100 * 1024 * 1024; // 100 MB
var largeFileWarned = false;

function warnIfLarge(fileList) {
  var files = Array.prototype.slice.call(fileList || []);
  if (!files.length) { largeFileWarned = false; return; }
  var total = files.reduce(function (sum, f) { return sum + (f.size || 0); }, 0);
  if (total < LARGE_FILE_WARN_BYTES) { largeFileWarned = false; return; }
  if (largeFileWarned) return;
  largeFileWarned = true;
  var isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || "");
  toast(
    fmtBytes(total) + " total is a lot for a browser to process at once" +
    (isMobile ? " on a phone -- it may be slow or the tab may run out of memory." : " -- it may take a while."),
    true
  );
}

function fmtBytes(bytes) {
  if (bytes === 0 || !bytes) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/* Strips the extension off a filename, e.g. "report.pdf" -> "report" */
function baseName(name) {
  return String(name || "file").replace(/\.[^/.]+$/, "");
}

/* Promise-based pause, used to yield to the browser between heavy steps
   (page renders, page saves) so the progress bar and tab stay responsive. */
function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

/* Triggers a browser download of an in-memory Blob under the given filename. */
function saveBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* Runs an async worker over a list of items one at a time (so a large batch
   doesn't spike memory/CPU all at once), reporting progress as it goes, and
   collects the return values in order. */
async function inChunks(items, workerFn, onProgress) {
  var results = [];
  for (var i = 0; i < items.length; i++) {
    results.push(await workerFn(items[i], i));
    if (typeof onProgress === "function") onProgress(i + 1, items.length);
    await delay(0);
  }
  return results;
}

/* Turns a thrown error into a short, non-technical message for the toast. */
function friendlyPdfError(err) {
  var msg = (err && err.message) || String(err || "");
  if (/password|encrypted/i.test(msg)) return "This PDF needs a password — enter it above and try again.";
  if (/no pages/i.test(msg)) return "That file has no pages to work with.";
  if (/invalid pdf|structure|corrupt/i.test(msg)) return "That file doesn't look like a valid PDF. Try a different file.";
  if (msg && msg.length < 120) return msg;
  return "Something went wrong processing that file. Try a different file or reload the page.";
}

/* Shows a small "what to do next" suggestion under a finished result, linking
   to the tools people commonly reach for right after this one. */
function showNextSteps(resultEl, toolId) {
  if (!resultEl) return;
  var old = resultEl.querySelector(".next-steps");
  if (old) old.remove();
  var ids = (typeof ZeroUpload_RELATED !== "undefined" && ZeroUpload_RELATED[toolId]) || [];
  if (!ids.length) return;
  var links = ids.map(function (id) {
    var t = toolById(id);
    return t ? '<a href="' + toolUrl(id) + '">' + t.name + "</a>" : "";
  }).filter(Boolean).join(" · ");
  if (!links) return;
  var box = document.createElement("div");
  box.className = "next-steps";
  box.style.cssText = "width:100%;margin-top:4px;font-size:0.85rem;color:var(--muted);";
  box.innerHTML = "Next: " + links;
  resultEl.appendChild(box);
}

initTheme();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    initRelated();
    initSearch();
    initAds();
  });
} else {
  initRelated();
  initSearch();
  initAds();
}
