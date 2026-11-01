# Jingwei Kang — personal homepage

A plain static site: one HTML page, one stylesheet, one small script, two SVGs. No build step,
no framework, no analytics. Edit the text in `index.html`, commit, push, done.

```
index.html                            the whole page (every section, every paper)
assets/css/style.css                  colours, fonts, layout, the background field (light and dark themes)
assets/js/main.js                     theme toggle, BibTeX show/hide, copy buttons
assets/img/favicon.svg                browser-tab icon (JK monogram on a miniature of the field, a light and a dark version)
assets/img/portrait.jpg               the portrait photo (4:5, 384 × 480)
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

1. Push the branch that GitHub Pages will serve. If the repository has no `main` branch yet, create
   it from the current branch and push it: `git switch -c main && git push -u origin main`.
2. On GitHub open **Settings → Pages**. Under **Build and deployment** choose
   **Deploy from a branch**, pick that branch (`main`) and `/ (root)`, and save.
3. After a minute the site is live at **https://jkang98.github.io/personal-website/**.

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
  Only the first five items show; the rest scroll inside the list (the `news-window` in
  `index.html`, sized by `main.js`). With five items or fewer nothing scrolls. Each item is one
  line of the form "A full / short / resource / doctoral symposium paper is published at …",
  linked to its entry in Publications.
- **Research**: an intro paragraph, then pairs of `<h3 class="side">` (theme name) and
  `<div class="body theme">` (one paragraph plus a `Papers` line that links to `#pub-KEY` ids).
- **Publications**: see *Add a paper*.
- **Education** (`<ul class="edu">`): one `<li>` per degree, newest first; the years sit at the
  end of each `edu-detail` line (BSc 2016–2020, MSc 2021–2023).
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

## Changing the photo

Save the new photo as `assets/img/portrait.jpg` (JPEG or `.webp`, 4:5 ratio, about 384 × 480
pixels or 640 × 800 for sharper HiDPI screens, under 150 KB) and keep the `width`/`height`
attributes on the `<img class="portrait">` in the Intro section in the same 4:5 ratio. It is
displayed at 192 × 240 on desktop and 88 × 110 on phones; a different ratio is cropped to 4:5,
not squashed.

## Add a CV

Save the PDF as `assets/cv.pdf` and replace the HTML comment near the end of the Contact section
with the link it contains:

```html
<p><a href="assets/cv.pdf">Curriculum vitae (PDF)</a></p>
```

## The background (the field)

The page sits on a fixed colour field in the manner of midem.com: a lilac ground with soft
orange, periwinkle and khaki blobs, a second layer of acid-yellow and periwinkle highlights blended
over it, fine film grain and a continuous, liquid flow of every blob. It is built from the `--field-*` tokens at the top of
`assets/css/style.css` and the section headed `The field` in the same file; the markup is the
`<div class="field" aria-hidden="true">` at the top of `<body>` in `index.html`, one empty
`<div>` per blob (each inside two `field__mover` wrappers that carry its flow; their order is the paint order). Nothing in the field carries content, and the
print stylesheet drops it.

- **Where the colours live.** `--field-base` is the ground; `--field-orange`, `--field-peri`
  (periwinkle) and `--field-khaki` are the main blobs; `--field-yellow` and `--field-peri-hi` are
  the two highlight blobs, which sit in `.field__overlay` and blend with `mix-blend-mode: overlay`
  (that blend is what turns the lilac pale and the khaki corner acid yellow, so their alpha, not
  their hue, sets how strong the highlights are). The dark theme repeats the same tokens with the
  near-black ground `#1B1B1B` and the blobs at low alpha, so they read as muted glows.
- **Where the blobs are.** Each blob is a `.field__blob--…` rule with a centre (`--x`, `--y`, in
  viewport units), a half-size (`--rx`, `--ry`) and an optional `--rot`. The soft edge is the
  `--field-blur` token (120px at 1440 × 900, smaller on phones): every blob is a radial gradient
  whose stops trace a Gaussian edge of that width, which looks like a hard shape under
  `filter: blur(120px)` but is painted once instead of being blurred every frame.
- **To tone it down.** Raise `--field-wash` (the white band behind the reading column, 12% in the
  light theme, a 40% near-black band in the dark theme), widen it with `--field-wash-span` and
  `--field-wash-feather`, lower the blobs' alpha (write them as `rgb(238 132 50 / 60%)`), or lower
  `--field-grain-opacity`. Readers who ask for reduced transparency get a stronger wash and no
  highlights or grain automatically.
- **To change the palette.** Change the six `--field-*` colours (light values on `:root`, dark
  values in the two dark blocks). The text tokens below were chosen for 4.5:1 against the darkest
  colour of the light field (its pure orange, relative luminance 0.35) and the brightest glow of
  the dark field; if you make the field darker or the glows brighter, re-check the contrast.
- **To slow or stop the flow.** Every blob tours the whole field on its own closed route (the
  `@keyframes tour-…` rules: translations from its resting place through the corners and the
  centre) and its own period (`--k` times the base `--field-flow`, 22 s, paced like midem's own loop).
  `--field-flow: 44s` halves the pace, `0s` stops it. It is already off for readers who prefer reduced motion, and on
  phones only the three blobs above the highlight layer move. To keep the page still in every
  browser, remove the `field__mover` animations (or the mover wrappers) from the markup.
- **The ground copy.** `body` carries a flat copy of the field (same tokens: the orange left
  edge, the periwinkle and yellow on the right, the corners, the wash, the grain). A browser never
  shows it, because the fixed field covers it; it is there for full-page screenshots and similar
  renderings, which draw a fixed layer only once at the top. Change it together with the field
  (its gradients are in the `body` rule), or remove it by setting `background-image: none` there.
- **To remove it.** Delete the `<div class="field">` block from `index.html` and the
  `background-image` of `body`; the page then shows the flat `--bg` colour, so pick a quieter
  `--bg` and `--muted` at the same time.

The header scrolls with the page instead of sticking to the top: a bar that stays put would need
a panel of its own over the field.

## Colours, fonts, themes

- All colours are tokens at the top of `assets/css/style.css`: the page tokens `--bg`, `--surface`,
  `--line`, `--fg`, `--muted`, `--accent` and the `--field-*` tokens of the background. The light
  values sit on `:root`; the dark values appear twice, under `@media (prefers-color-scheme: dark)`
  and under `:root[data-theme="dark"]`. Change a colour in all three places and keep text at 4.5:1
  contrast or better against the field behind it (`--surface` and `--line` are translucent, so
  they work on any part of the field). The two `<meta name="theme-color">` tags in `<head>` and
  both SVGs in `assets/img/` repeat token values as literal hex (favicon.svg: the field's lilac,
  orange, periwinkle and yellow with letters in `--fg`, or `--accent` in the dark scheme;
- The monogram letters in the favicon are the outlines of
  `JK` set in Newsreader 500, the display face, stored as SVG `<path>` data, so they look the same
  before the web font loads and on systems without it. To change the initials, set the new
  letters in Newsreader 500 in a vector editor, convert them to outlines and paste the path data
  into the favicon.
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
- If you changed a `--field-*` colour or the text tokens, check the text contrast again in both
  themes (the darkest spot of the light field and the brightest glow of the dark one sit behind
  the left edge of the column).

## Known gaps

- No CV link yet (see above).
