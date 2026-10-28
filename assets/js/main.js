/* Jingwei Kang — homepage
   Three small enhancements: the theme toggle, the BibTeX disclosures and the copy buttons.
   Without scripts the page shows every BibTeX entry and hides these controls
   (see the .no-js rules in assets/css/style.css). */
(function () {
  'use strict';

  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  /* ---------- theme ----------
     No data-theme attribute: the page follows the system preference.
     The toggle sets data-theme and stores it; when the choice matches the system
     again the override is dropped, so the page keeps following the system later. */
  function readStored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function writeStored(value) {
    try {
      if (value) { localStorage.setItem('theme', value); } else { localStorage.removeItem('theme'); }
    } catch (e) { /* private mode or blocked storage: the choice just will not persist */ }
  }
  function systemTheme() { return media && media.matches ? 'dark' : 'light'; }
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    return (t === 'dark' || t === 'light') ? t : systemTheme();
  }

  var toggle = document.querySelector('.theme-toggle');
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  var metaDefaults = Array.prototype.map.call(metas, function (m) { return m.getAttribute('content'); });

  function reflectTheme() {
    var theme = currentTheme();
    var forced = root.hasAttribute('data-theme');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggle.setAttribute('title', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }
    // Browser chrome follows the page: while a theme is forced, both theme-color
    // metas carry its background; otherwise they go back to their media-matched values.
    var bg = forced ? getComputedStyle(root).getPropertyValue('--bg').trim() : '';
    Array.prototype.forEach.call(metas, function (m, i) {
      m.setAttribute('content', bg || metaDefaults[i]);
    });
  }

  if (toggle) {
    // The head script may already have applied a stored theme; make sure it matches storage.
    var stored = readStored();
    if (stored === 'light' || stored === 'dark') { root.setAttribute('data-theme', stored); }
    reflectTheme();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      if (next === systemTheme()) {
        root.removeAttribute('data-theme');
        writeStored(null);
      } else {
        root.setAttribute('data-theme', next);
        writeStored(next);
      }
      reflectTheme();
    });
    if (media) {
      if (typeof media.addEventListener === 'function') { media.addEventListener('change', reflectTheme); }
      else if (typeof media.addListener === 'function') { media.addListener(reflectTheme); }
    }
  }

  /* ---------- BibTeX disclosures ----------
     <button class="bib-toggle" aria-expanded aria-controls="bib-KEY"> shows or hides #bib-KEY. */
  Array.prototype.forEach.call(document.querySelectorAll('.bib-toggle'), function (button) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) { return; }
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.hidden = open;
    });
  });

  /* ---------- copy buttons ----------
     <button data-copy="text">             copies the literal text
     <button data-copy-target="elementId"> copies that element's text content
     data-select="elementId" names the text to select when copying is blocked. */
  var status = document.getElementById('copy-status');

  function announce(message) {
    if (!status) { return; }
    status.textContent = '';
    window.setTimeout(function () { status.textContent = message; }, 50);
  }

  function selectContents(el) {
    if (!el || !window.getSelection) { return; }
    var range = document.createRange();
    range.selectNodeContents(el);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.setAttribute('aria-hidden', 'true');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacyCopy(text); }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  var buttons = document.querySelectorAll('button[data-copy], button[data-copy-target]');
  Array.prototype.forEach.call(buttons, function (button) {
    var original = button.textContent;
    var timer = null;
    button.addEventListener('click', function () {
      var source = document.getElementById(button.getAttribute('data-copy-target') || '');
      var text = source ? source.textContent : button.getAttribute('data-copy');
      text = (text || '').trim();
      if (!text) { return; }
      copyText(text).then(function (ok) {
        if (ok) {
          button.textContent = 'Copied';
          announce('Copied to the clipboard.');
        } else {
          // Clipboard blocked (for example on a file:// page): select the text instead.
          selectContents(source || document.getElementById(button.getAttribute('data-select') || ''));
          button.textContent = 'Selected';
          announce('Copying is blocked here. The text is selected: press Ctrl+C or Cmd+C to copy it.');
        }
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { button.textContent = original; }, 2000);
      });
    });
  });
})();
