// ZeroUpload Home Page Script - Optimized for fast initial load and zero dead code
(function () {
  'use strict';

  // Mobile Navigation Menu
  var hamb = document.getElementById('hamburger');
  var nav = document.getElementById('navLinks');
  if (hamb && nav) {
    hamb.onclick = function () {
      var open = nav.classList.toggle('open');
      hamb.classList.toggle('active', open);
      hamb.setAttribute('aria-expanded', String(open));
    };
  }

  // Dark Mode Toggle
  var tBtn = document.getElementById('themeToggle');
  if (tBtn) {
    tBtn.onclick = function (e) {
      e.preventDefault();
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ZeroUpload-theme', next); } catch (err) {}
    };
  }

  // Search Filter with Keyboard Shortcuts
  var input = document.getElementById('toolSearch');
  if (input) {
    var cards = document.querySelectorAll('.tools-grid .tool-card');
    input.addEventListener('input', function () {
      var q = input.value.toLowerCase().trim();
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        var hay = (c.getAttribute('data-name') || '') + ' ' + c.innerText.toLowerCase();
        c.style.display = hay.indexOf(q) !== -1 ? '' : 'none';
      }
    });

    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === '/' && document.activeElement !== input && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === 'Escape' && document.activeElement === input) {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.blur();
      }
    });
  }
})();
