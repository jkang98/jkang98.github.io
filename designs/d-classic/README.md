# Jingwei Kang — personal homepage

A plain static site: one HTML page, one stylesheet, one small script, two SVGs. No build step,
no framework, no analytics. Edit the text in `index.html`, commit, push, done.

```
index.html                            the whole page (every section, every paper)
assets/css/style.css                  colours, fonts, layout (light and dark themes)
assets/js/main.js                     theme toggle, BibTeX show/hide, copy buttons
assets/img/favicon.svg                browser-tab icon (JK monogram, a light and a dark version)
assets/img/portrait-placeholder.svg   the JK monogram as a file (the page inlines the same drawing)
.nojekyll                             tells GitHub Pages to serve the files exactly as they are
.htmlvalidate.json                    settings for the HTML check (see "Check before publishing")
```

All URLs inside the page are relative (`assets/css/style.css`, never `/assets/...`), so the site
works at `https://jkang98.github.io/personal-website/`, at a custom domain, or opened from disk.

## Preview locally

Run from inside this folder (the one that holds `index.html`):

```
python3 -m http.server 8000        # then open http://localhost:8000/
```

Double-clicking `index.html` also works. The two Google Fonts (Newsreader, Source Sans 3) need an
internet connection; without it the page falls back to system serif and sans fonts.

## Publish with GitHub Pages

1. If these files still sit in `designs/d-classic/`, the repository root holds the other candidate
   design: its own `index.html`, `assets/`, `README.md`, `.nojekyll` and `.htmlvalidate.json`, all
   tracked in git. Replace them with the copies in this folder. From the repository root:

   ```
   git rm -r index.html assets README.md .nojekyll .htmlvalidate.json
   mv designs/d-classic/index.html designs/d-classic/README.md designs/d-classic/.nojekyll designs/d-classic/.htmlvalidate.json .
   mv designs/d-classic/assets assets
   rm -r designs
   git add -A
   git commit -m "Publish the classic design at the repository root"
   ```

   `git rm` also removes the root `assets/` folder once it is empty; if it is still there (it held
   untracked files), delete it before the second `mv`. Keep `.gitignore`: it ignores local scratch
   files such as `_screens/` and `node_modules/`.
2. Push the branch that GitHub Pages will serve. If the repository has no `main` branch yet, create
   it from the current branch and push it: `git switch -c main && git push -u origin main`.
3. On GitHub open **Settings → Pages**. Under **Build and deployment** choose
   **Deploy from a branch**, pick that branch (`main`) and `/ (root)`, and save.
4. After a minute the site is live at **https://jkang98.github.io/personal-website/**.

Keep the empty `.nojekyll` file: it stops GitHub from running Jekyll over the files.

### Custom domain (optional)

1. Add a file named `CNAME` at the repository root containing just the domain, for example
   `www.example.org` (one line, no `https://`).
2. At your DNS provider: for a subdomain such as `www`, add a **CNAME** record pointing to
   `jkang98.github.io`. For a bare domain (`example.org`), add **A** records to GitHub's Pages
   addresses `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
3. Enter the same domain under **Settings → Pages → Custom domain**, wait for the DNS check, then
   tick **Enforce HTTPS**.

Nothing in the page changes: all links are relative.

## Edit the text

Everything visible is in `index.html`, in page order. Each part starts with a comment that looks
like `<!-- ===== News … ===== -->`, so search for `=====` to jump between them.

- **Intro** (`<section class="hero" id="about">`): the `<h1>`, the `<p class="role">` line and the
  two paragraphs inside `<div class="bio">`: the first says what the research is about, the second
  names the supervisor, collaborator and labs. Keep the bio to two to four short sentences.
- **News** (`<ol class="news">`): one `<li>` per item, newest at the top. Each item is
  `<time datetime="YYYY-MM">Mon YYYY</time>` followed by a `<p>`. Keep five to seven items and
  drop the oldest when you add one. Link a paper with `href="#pub-KEY"` (see below).
- **Research**: an intro paragraph, then pairs of `<h3 class="side">` (theme name) and
  `<div class="body theme">` (one paragraph plus a `Papers` line that links to `#pub-KEY` ids).
- **Publications**: see *Add a paper*.
- **Education** (`<ul class="edu">`): the MSc and BSc entries carry no years because none were
  known when the site was built. Add them to the `edu-detail` line when you want them shown,
  e.g. `Radboud University, Nijmegen, the Netherlands, 2021–2023`.
- **Contact**: the email address, the Copy button, the profile links, a commented-out CV link.
  The address appears **seven times** in `index.html`: the hero quick link and the Contact link
  each carry it in `href="mailto:…"` and in the link text, the Copy button has it in its
  `data-copy` attribute, the JSON-LD block in `<head>` has it as `email`, and the comment above
  the Contact section names it. Use find-and-replace on `j.kang@uva.nl` across the file; it
  catches all seven.
- **Head**: `<meta name="description">` and the Open Graph description (keep them in step with
  the bio), and the JSON-LD `Person` block. When you add or remove a profile in Contact, update
  the `sameAs` list there too.
- **Footer**: the year in `© 2026 Jingwei Kang` is typed by hand; update it once a year.

The page is written in the first person in short, plain sentences. Inside the HTML write `&amp;`
for `&` and `&lt;` for `<` (also inside the BibTeX). Hyphenated compounds (`eye-tracking`,
`off-policy`) break at the hyphen, as in print; only two kinds of phrase are wrapped in
`<span class="nb">…</span>` so that they never split: the names in the bio, and compounds whose
first part is a single letter (`F-shaped`, `L-shaped`), which would otherwise leave a lone letter
at a line end. Write the middle-dot separator (venue lines, `Papers` lines, the role line, the
footer) as `&nbsp;· `, a no-break space before the dot: a line can then break after the dot but
never end with it.

## Add a paper

Papers are grouped by year, newest first. Each year is an `<h3 class="side year" id="year-YYYY">`
followed by an `<ol class="body pubs" role="list" aria-labelledby="year-YYYY">` (keep
`role="list"`, see *Check before publishing*). If the year does not exist yet, add both above
the previous year. Then put a new `<li class="pub">` at the top of that
year's list. This is the live markup of one entry; replace the parts in capitals:

```html
          <li class="pub pub--first" id="pub-KEY">
            <h4 class="pub-title">TITLE</h4>
            <p class="pub-meta pub-authors"><span class="me">Jingwei Kang<span class="visually-hidden"> (first author)</span></span>, CO-AUTHOR, CO-AUTHOR</p>
            <p class="pub-meta pub-venue"><span class="venue">VENUE ’YY</span>&nbsp;· FULL CONFERENCE NAME, CITY, COUNTRY, MONTH YEAR, pp. FIRST–LAST</p>
            <p class="pub-summary">ONE SENTENCE ON WHAT THE PAPER DOES.</p>
            <p class="pub-links">
              <a href="https://arxiv.org/abs/ARXIV-ID">arXiv</a>
              <a href="https://doi.org/DOI">DOI</a>
              <button class="textbutton" type="button" aria-expanded="false">BibTeX</button>
            </p>
            <div class="bib" hidden>
<pre><code><span class="f">@inproceedings{<wbr>KEY,</span>
<span class="f">  author    = {Kang, Jingwei and SURNAME, FIRSTNAME and SURNAME, FIRSTNAME},</span>
<span class="f">  title     = {TITLE},</span>
<span class="f">  booktitle = {Proceedings of the ... (VENUE 'YY)},</span>
<span class="f">  publisher = {ACM},</span>
<span class="f">  year      = {YEAR},</span>
<span class="f">  pages     = {FIRST--LAST},</span>
<span class="f">  doi       = {DOI}</span>
<span class="f">}</span></code></pre>
              <p class="bib-foot"><button class="btn btn-copy" type="button">Copy</button><span class="copy-status" role="status" aria-live="polite"></span></p>
            </div>
          </li>
```

Notes:

- `KEY` is the BibTeX key, e.g. `kang2027carousel`. The only id you type is `id="pub-KEY"`, which
  News and Research links point at; it must be unique on the page. The BibTeX and Copy buttons
  find their own blocks, so nothing else needs an id.
- Keep `pub--first` on the `<li>` (it draws the dash beside the title) and the hidden
  `(first author)` note, which screen readers announce in place of the dash, only when Jingwei
  is the first author (write `(sole author)` for a single-author paper); remove both otherwise.
  Always wrap Jingwei's name in `<span class="me">`.
- Accepted but not yet published: leave out `pp.` and `pages`, end the venue line with
  `&nbsp;· to appear` and add `note = {To appear}` to the BibTeX. A doctoral-symposium or workshop
  paper: say so in the venue line and in a `note` (the RecSys ’26 entry carries
  `note = {Doctoral Symposium}`), so a copied citation shows what kind of paper it is. Preprints
  without a DOI: drop the DOI link and use `@misc` with `eprint = {ARXIV-ID}` and
  `archivePrefix = {arXiv}` (the climate report shows the pattern).
- The `<pre>` sits at the left margin of the file on purpose: its text, including the two-space
  indentation, is what the Copy button copies. Write one field per line, however long, and keep
  each line inside its own `<span class="f">…</span>`: the span only lays the line out, wrapping
  whatever does not fit under the value with a hanging indent, and leaves the copied text as
  typed. The `<wbr>` after the opening brace of the first line lets a long citation key move
  whole to the next line on a narrow phone instead of breaking in the middle.
- Add a dated line to News (`href="#pub-KEY"`) and, if it fits a theme, to that theme's `Papers`
  line in Research.

## Replace the monogram with a photo

1. Save the photo as `assets/img/portrait.jpg` (JPEG, or `.webp`). Use a portrait crop with a
   4:5 ratio, 640 × 800 pixels, under about 150 KB. It is displayed at 192 × 240 on desktop and
   88 × 110 on phones; a different ratio is cropped to 4:5, not squashed.
2. In the Intro section of `index.html` replace the whole inline `<svg class="portrait" …>…</svg>`
   element (four lines, between `hero-head` and `hero-body`) with

   ```html
   <img class="portrait" src="assets/img/portrait.jpg" width="640" height="800" alt="Portrait of Jingwei Kang">
   ```

3. Delete `assets/img/portrait-placeholder.svg`; the `.portrait path` rule in `style.css` can go too.

## Add a CV

Save the PDF as `assets/cv.pdf` and replace the HTML comment near the end of the Contact section
with the link it contains:

```html
<p><a href="assets/cv.pdf">Curriculum vitae (PDF)</a></p>
```

## Colours, fonts, themes

- All colours are six tokens at the top of `assets/css/style.css`: `--bg`, `--surface`, `--line`,
  `--fg`, `--muted`, `--accent`. The light values sit on `:root`; the dark values appear twice,
  under `@media (prefers-color-scheme: dark)` and under `:root[data-theme="dark"]`. Change a
  colour in all three places and keep text at 4.5:1 contrast or better. The two
  `<meta name="theme-color">` tags in `<head>` and both SVGs in `assets/img/` repeat token values
  as literal hex (favicon.svg: an `--accent` plate with `--bg` letters, for each theme;
  portrait-placeholder.svg: `--surface` and `--accent` for each theme); update them if those
  tokens change. The inline monogram in `index.html` uses the tokens themselves and needs no change.
- The monogram letters (in `index.html`, the favicon and the placeholder) are the outlines of
  `JK` set in Newsreader 500, the display face, stored as SVG `<path>` data, so they look the same
  before the web font loads and on systems without it. To change the initials, set the new
  letters in Newsreader 500 in a vector editor, convert them to outlines and paste the path data
  into the three places.
- Fonts come from Google Fonts via the `<link>` in `<head>`: Newsreader for headings and prose,
  Source Sans 3 for navigation, metadata and buttons. The link does not block the page: it is
  requested as a print stylesheet and switched to all media once it has arrived (a `<noscript>`
  copy serves browsers without JavaScript), so the text shows in the fallback fonts first and
  swaps when the web fonts arrive. To swap a font, change the URL in both tags and the
  `--font-display`, `--font-body` or `--font-ui` token.
- The sizes form one scale (`--text-xs` … `--text-xl`). The small `--h2-shift` / `--side-shift`
  values put the margin-column headings on the first prose baseline; re-measure them if you change
  a font or a size.
- The theme toggle follows the system preference until pressed; the choice is kept in
  `localStorage` under the key `theme` and cleared again when it matches the system.

## Check before publishing

- `npx -y html-validate index.html` must report no errors. `.htmlvalidate.json` extends the
  recommended rule set and switches off one rule, `no-redundant-role`: the lists carry an explicit
  `role="list"` on purpose, because Safari drops the list semantics of a list styled with
  `list-style: none`, and the role gives VoiceOver users the item counts back.
- Open the page at a phone width (about 390 px) in both themes: nothing should scroll sideways.
- Click every new link, open one BibTeX entry and press Copy.

## Known gaps

- The portrait is a placeholder monogram.
- Education entries have no years.
- No CV link yet (see above).
