/* Jingwei Kang — homepage scripts: theme toggle, BibTeX disclosures, copy buttons.
   The page reads fine without this file: BibTeX entries are then shown expanded
   and the controls that need scripting stay hidden (see .no-js in style.css). */
(function () {
  'use strict';

  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  /* ---------------------------------------------------------------------
     Smooth scrolling (style.css, html.fonts-ready) is switched on only once
     the page and its web fonts have loaded. The jump to a #fragment on first
     load must stay instant: a smooth scroll aims at a position measured in
     the fallback fonts and lands off target when Newsreader swaps in.
     --------------------------------------------------------------------- */

  var loaded = new Promise(function (resolve) {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.all([loaded, fontsReady]).then(function () {
    window.setTimeout(function () {
      root.classList.add('fonts-ready');
    }, 0);
  });

  /* ---------------------------------------------------------------------
     Theme toggle. A data-theme attribute wins over the system preference.
     Choosing the theme the system already uses removes the override, so the
     page quietly follows the system again instead of staying pinned.
     --------------------------------------------------------------------- */

  function systemTheme() {
    return media && media.matches ? 'dark' : 'light';
  }

  function currentTheme() {
    var chosen = root.getAttribute('data-theme');
    if (chosen === 'dark' || chosen === 'light') {
      return chosen;
    }
    return systemTheme();
  }

  function storeTheme(theme) {
    try {
      if (theme) {
        localStorage.setItem('theme', theme);
      } else {
        localStorage.removeItem('theme');
      }
    } catch (error) {
      // Storage unavailable (private mode, blocked cookies): the choice still applies to this page view.
    }
  }

  var toggle = document.querySelector('.theme-toggle');
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  var metaDefaults = Array.prototype.map.call(metas, function (meta) {
    return meta.getAttribute('content');
  });

  function reflectTheme() {
    if (toggle) {
      toggle.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
    }
    // Keep the browser chrome in step with a forced theme; restore the
    // per-scheme defaults when the page follows the system again.
    var forced = root.getAttribute('data-theme');
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    Array.prototype.forEach.call(metas, function (meta, index) {
      meta.setAttribute('content', forced && bg ? bg : metaDefaults[index]);
    });
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      if (next === systemTheme()) {
        root.removeAttribute('data-theme');
        storeTheme(null);
      } else {
        root.setAttribute('data-theme', next);
        storeTheme(next);
      }
      reflectTheme();
    });
    if (media && typeof media.addEventListener === 'function') {
      media.addEventListener('change', reflectTheme);
    }
    reflectTheme();
  }

  /* ---------------------------------------------------------------------
     Publication entries. Each <li class="pub"> wires itself up: the links,
     the BibTeX button and the Copy button in the BibTeX block are described
     by the paper title, and the BibTeX button controls the entry's own .bib
     block. No ids need to be typed by hand.
     --------------------------------------------------------------------- */

  var pubs = document.querySelectorAll('.pub');
  Array.prototype.forEach.call(pubs, function (pub, index) {
    var key = pub.id ? pub.id.replace(/^pub-/, '') : String(index + 1);
    var title = pub.querySelector('.pub-title');
    var bib = pub.querySelector('.bib');
    var button = pub.querySelector('.pub-links button[aria-expanded]');

    if (title) {
      if (!title.id) {
        title.id = 'title-' + key;
      }
      Array.prototype.forEach.call(pub.querySelectorAll('.pub-links a, .pub-links button, .bib .btn-copy'), function (control) {
        if (!control.hasAttribute('aria-describedby')) {
          control.setAttribute('aria-describedby', title.id);
        }
      });
    }

    if (bib && button) {
      if (!bib.id) {
        bib.id = 'bib-' + key;
      }
      button.setAttribute('aria-controls', bib.id);
      button.addEventListener('click', function () {
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        bib.hidden = expanded;
      });
    }
  });

  /* ---------------------------------------------------------------------
     Copy buttons. data-copy holds the text to copy (the email address); a
     button without it copies the text of the <pre> in the BibTeX block it
     sits in. The button label confirms the copy (its width is reserved in
     style.css, so nothing moves) and the adjacent live region announces it;
     the region stays visible only when it says more than the label does.
     If the clipboard is unavailable, the text is selected so Ctrl/Cmd+C
     works.
     --------------------------------------------------------------------- */

  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.setAttribute('aria-hidden', 'true');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      document.body.appendChild(area);
      area.select();
      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      }
      document.body.removeChild(area);
      if (copied) {
        resolve();
      } else {
        reject(new Error('Clipboard unavailable'));
      }
    });
  }

  function selectContents(element) {
    if (!element || !window.getSelection) {
      return;
    }
    try {
      var range = document.createRange();
      range.selectNodeContents(element);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      // Selection is a convenience only.
    }
  }

  var copyButtons = document.querySelectorAll('button.btn-copy');
  Array.prototype.forEach.call(copyButtons, function (button) {
    var original = button.textContent;
    var status = button.parentNode.querySelector('[role="status"]');
    var timer = null;

    function report(label, message, showMessage) {
      button.textContent = label;
      if (status) {
        status.classList.toggle('visually-hidden', !showMessage);
        status.textContent = '';
        window.setTimeout(function () {
          status.textContent = message;
        }, 50);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        button.textContent = original;
        if (status) {
          status.textContent = '';
          status.classList.remove('visually-hidden');
        }
      }, 2500);
    }

    button.addEventListener('click', function () {
      var text = button.getAttribute('data-copy');
      var source = null;
      if (text) {
        source = button.parentNode.querySelector('.email');
      } else {
        var box = button.closest('.bib');
        source = box ? box.querySelector('pre') : null;
        text = source ? source.textContent : '';
      }
      if (!text) {
        return;
      }
      writeClipboard(text).then(
        function () {
          report('Copied', 'Copied to the clipboard.', false);
        },
        function () {
          selectContents(source);
          report('Select and copy', 'Copying is blocked here; the text is selected, press Ctrl+C or Cmd+C.', true);
        }
      );
    });
  });
})();

