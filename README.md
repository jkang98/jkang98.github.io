# Jingwei Kang — personal homepage

A one-page academic homepage in plain HTML, CSS and a little JavaScript. No build step, no
framework, no analytics. The only external resources are two Google Fonts (Newsreader and
Source Sans 3).

```
index.html                        the page: all content lives here
assets/css/style.css              design tokens (colours, fonts, scale) and all styles
assets/js/main.js                 theme toggle, BibTeX disclosures, copy buttons (optional)
assets/img/favicon.svg            browser-tab icon
assets/img/portrait-placeholder.svg   monogram shown on the portrait plate until a photo exists
.nojekyll                         tells GitHub Pages to serve the files as they are
.htmlvalidate.json                settings for the HTML check (see "Checking the HTML")
```

All URLs are relative (`assets/css/style.css`, never `/assets/...`), so the site works at
`https://jkang98.github.io/personal-website/`, at a repository root and on a custom domain
without changes. Without JavaScript the page still works: every BibTeX entry is shown open and
the toggle and copy buttons are hidden.

## Preview locally

```
python3 -m http.server 8000        # then open http://localhost:8000/
npx -y html-validate index.html    # should report no errors (see "Checking the HTML")
```

Check a change at a narrow width (the browser's device toolbar at 390 px: nothing may scroll
sideways) and in both themes (the toggle in the masthead).

## Editing the text

Everything visible is in `index.html`, in page order. Each section starts with a comment such as
`<!-- ================= News ================= -->`.

- **About** (`<section id="about">`): the `<h1>`, the role line, the two bio paragraphs and the
  short row of links. The `<meta name="description">`, the `og:description` and the JSON-LD block
  in the `<head>` paraphrase the bio: update them when it changes.
- **News** (`<ul class="news">`): one `<li>` per item, newest first. Each item is a
  `<time datetime="YYYY-MM">Mon YYYY</time>` followed by a `<p>`; link the paper's `#pub-…` id
  where there is one. Keep five to seven items and drop the oldest when you add one.
- **Research** (`<article class="theme">` blocks): a heading, one paragraph that synthesises,
  and a `Papers` line (`<p class="refs">`: the label in one span, the links in
  `<span class="refs-list">`) that links to publication entries by id. Leave the specifics to
  the entries.
  The drawing in the margin is an inline SVG inside `<div class="plate">`; delete that block if
  you do not want it.
- **Education** (`<ul class="edu">`): no years are shown because none were verified; add them to
  the second line of an entry when you want them (`Radboud University, Nijmegen, YYYY–YYYY`).
- **Contact** (`<section id="contact">`): the email address appears in three places (six
  occurrences) in the file: the `About` link (`href` and visible text), the `Contact` row
  (`href`, visible text and the `data-copy` attribute of the Copy button) and the JSON-LD
  block. Replace all of them, for example with a global find-and-replace.

The page is written in the first person. Keep sentences short and plain.

## Adding a paper

Publications are grouped by year, newest first. Each year is one `<div class="year-group">`
holding an `<h3 class="year">` and a `<ul class="pub-group">`. For a new year, copy a whole
`year-group` block, place it above the previous year and change the year in the heading text,
its `id="year-YYYY"` and the list's `aria-labelledby`.

Then add an entry at the top of that year's list. Pick a short `KEY` (for example `n2dcg`);
it is used in four ids that must agree: `pub-KEY` (the entry, linked from News and Research),
`t-KEY` (the title, which the links and buttons name through `aria-describedby`), `bib-KEY`
(the panel the BibTeX button opens) and `bibcode-KEY` (the text the Copy button copies).
Template, with the parts to edit in capitals:

```html
<li class="pub first-author" id="pub-KEY">
  <h4 class="pub-title" id="t-KEY"><span class="mark" aria-hidden="true"></span>TITLE</h4>
  <p class="pub-authors"><span class="me">Jingwei Kang<span class="visually-hidden"> (first author)</span></span>, CO-AUTHOR ONE, CO-AUTHOR TWO <span class="first-label" aria-hidden="true">First author</span></p>
  <p class="pub-venue"><span class="venue">VENUE ’YY</span>&nbsp;· FULL CONFERENCE NAME&nbsp;· CITY, MONTH&nbsp;YEAR&nbsp;· <span class="nb">pp.&nbsp;FIRST–LAST</span></p>
  <p class="pub-summary">ONE SENTENCE ON WHAT THE PAPER SHOWS.</p>
  <p class="pub-links">
    <a href="https://arxiv.org/abs/XXXX.XXXXX" aria-describedby="t-KEY">arXiv:XXXX.XXXXX</a>
    <a href="https://doi.org/10.1145/XXXXXXX.XXXXXXX" aria-describedby="t-KEY">doi:10.1145/XXXXXXX.XXXXXXX</a>
    <button type="button" class="bib-toggle" aria-expanded="false" aria-controls="bib-KEY" aria-describedby="t-KEY">BibTeX</button>
  </p>
  <div class="bib" id="bib-KEY" hidden>
<pre><code id="bibcode-KEY">@inproceedings{kangYYYYword,
  author    = {Kang, Jingwei and SURNAME, FIRST NAME and
               SURNAME, FIRST NAME},
  title     = {TITLE, WITH {ACRONYMS} IN BRACES},
  booktitle = {Proceedings of the FULL CONFERENCE NAME (VENUE 'YY)},
  year      = {YYYY},
  pages     = {FIRST--LAST},
  publisher = {ACM},
  doi       = {10.1145/XXXXXXX.XXXXXXX}
}</code></pre>
    <button type="button" class="btn copy" data-copy-target="bibcode-KEY" aria-describedby="t-KEY">Copy BibTeX</button>
  </div>
</li>
```

Rules of thumb:

- Not first author: drop the `first-author` class, the `<span class="mark">`, the hidden
  `(first author)` span inside your name and the `<span class="first-label">` (the square
  beside the title marks a first-author paper on wide screens; the label shows only in the
  one-column layout). Keep `<span class="me">` around your own name in every entry: it is set
  in bold and never breaks.
- The dots in the venue line are written `&nbsp;·` (no-break space before the dot), so a line
  that wraps ends with the dot instead of starting with it. `<span class="nb">` keeps a page
  range or a date range such as `7–11` on one line, and a month and its year are joined the
  same way (`July&nbsp;2026`).
- Accepted but not yet published: end the venue line with `&nbsp;· to appear`, leave `pages`
  out and add `note = {To appear}`.
- Preprint without a DOI: leave the DOI link out and use `@misc` with `eprint = {XXXX.XXXXX}` and
  `archivePrefix = {arXiv}`, as in the climate-impact entry.
- The BibTeX can be pasted from the ACM Digital Library export. Keep every line at 72
  characters or fewer, breaking long fields onto indented continuation lines as the existing
  entries do: the block then fits the text column without wrapping (on a phone it keeps that
  layout and scrolls sideways, and the Copy button copies the text as written). Escape `&` as
  `&amp;` and `<` as `&lt;`, and keep the `<pre>` tag at the start of its line: everything
  inside it is copied verbatim.
- Add a dated line to News when the paper is worth announcing, and a link in the matching
  Research theme's `Papers` line.
- Run `npx -y html-validate index.html` afterwards: it reports a duplicated id and a button or
  list whose `aria-controls`, `aria-describedby` or `aria-labelledby` names an id that does not
  exist. It does not check `href="#…"` links or `data-copy-target`: click the new News and
  Research links and the Copy button once, or list the fragment links that have no target with

  ```
  for r in $(grep -o 'href="#[^"]*"' index.html | cut -d'#' -f2 | tr -d '"' | sort -u); do grep -q "id=\"$r\"" index.html || echo "missing id: $r"; done
  ```

## Checking the HTML

`npx -y html-validate index.html` reads `.htmlvalidate.json`, which starts from the
`html-validate:recommended` preset and turns one rule off:

- `no-redundant-role` is off, because every `<ul>` on the page carries `role="list"` on
  purpose. Safari and VoiceOver stop announcing a list, and the position of each item in it,
  once its bullets are removed with `list-style: none`; the explicit role brings that back.
  The rule would flag the attribute as redundant, which it is only in other browsers. Keep
  `role="list"` when you copy a list.

Everything else is the preset. The check that matters most when adding a paper is its
`no-missing-references` rule: an `aria-controls`, `aria-describedby` or `aria-labelledby`
that names an id that does not exist is an error, so a mistyped `bib-KEY` or `t-KEY` cannot
ship. Plain `href="#…"` links are not covered (see "Adding a paper").

## Replacing the monogram with a photograph

1. Save a square photo as `assets/img/portrait.jpg` (JPEG or WebP, about 640 × 640 pixels;
   it is displayed at 136 px, so 640 px covers high-density screens with room to spare).
2. In the `About` section of `index.html`, replace the line

   ```html
   <div class="portrait"><img class="placeholder" src="assets/img/portrait-placeholder.svg" width="136" height="136" alt=""></div>
   ```

   with

   ```html
   <img class="portrait" src="assets/img/portrait.jpg" width="640" height="640" alt="Portrait of Jingwei Kang">
   ```

   A real photograph describes itself in `alt`; the placeholder has an empty `alt` because it
   carries no information. The photo is cropped to the square plate (`object-fit: cover`).
3. `assets/img/portrait-placeholder.svg`, the `.placeholder` rule and the two `--portrait-*`
   tokens in `style.css` can then be deleted.

## Adding a CV

No CV is linked yet. Save it as `assets/cv.pdf` and uncomment the `CV (PDF)` list item at the
end of the profile list in the `Contact` section.

## Colours, fonts and the theme toggle

Every colour is a token at the top of `assets/css/style.css`. The light palette is on `:root`;
the dark palette appears twice, once under `@media (prefers-color-scheme: dark)` (people whose
system is dark) and once under `:root[data-theme="dark"]` (the toggle). Change a colour in all
three places, and keep text colours at 4.5:1 or better against `--bg` and `--bg-alt`; the
ratios are noted beside each token. The two `<meta name="theme-color">` values in `index.html`
should match `--bg` of each theme.

The fonts are loaded in the `<head>` of `index.html`; the fallback stacks are in the same token
block of the stylesheet.

The toggle stores the choice in `localStorage` under the key `theme`. When the chosen theme
matches the system preference again, the override is removed and the page follows the system,
so the button only ever overrides the system, never replaces it.

## Publishing on GitHub Pages

1. Push the files to the `main` branch of the `personal-website` repository with `index.html`
   at the root. If the site is on another branch (it was built on a `claude/…` branch), merge
   it into `main` first: open a pull request on GitHub, or run
   `git checkout main && git merge <branch> && git push`. Alternatively, pick that branch
   instead of `main` in step 2. Keep `.nojekyll`: it stops GitHub from running the files
   through Jekyll.
2. On GitHub open **Settings → Pages**. Under **Build and deployment** choose
   **Deploy from a branch**, select `main` and `/ (root)`, and save.
3. After a minute the site is live at `https://jkang98.github.io/personal-website/`.
   Every later push to `main` redeploys it.

### Custom domain

1. Add a file named `CNAME` at the repository root containing only the domain
   (for example `www.example.org`), or enter the domain under
   **Settings → Pages → Custom domain**, which creates that file for you.
2. At your DNS provider, point the domain at GitHub Pages: for a subdomain such as `www`, a
   `CNAME` record to `jkang98.github.io`; for an apex domain, `A` records to
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`
   (check GitHub's Pages documentation for the current addresses).
3. Once the DNS check in the Pages settings passes, tick **Enforce HTTPS**.

Nothing in the site needs to change for a custom domain: all links are relative.
