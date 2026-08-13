# DEV Frontend Challenge — Comfort Food Edition

Three entries, one idea: **comfort food is defined by the hour you need it,
not by the recipe.**

| | Entry | Prompt |
|---|---|---|
| 🌙 | [Midnight Fridge Raid](css-art/) | CSS Art: Comfort Food |
| ☕ | [Cutting Chai](css-art-chai/) | CSS Art: Comfort Food |
| 🍽️ | [Open Late](landing/) | Perfect Landing: Comfort Food |

The challenge allows multiple entries per prompt, so both CSS-art pieces go in
as separate posts — 2am leftovers and 4pm chai are two answers to the same
question, and neither competes with the other.

Deadline: **16 August, 11:59pm PDT**. Tag all three posts `#frontendchallenge`.

---

## 1. Midnight Fridge Raid — CSS art

A dark kitchen at 2am, fridge door open, warm light spilling over last night's
leftovers. Every shape is a `div`, a gradient, a `clip-path` or a shadow — no
SVG, no images, no canvas.

```
css-art/
  index.html    markup only
  style.css     the whole picture
  script.js     ~30 lines: random dust + the door toggle
```

**Techniques on show:** radial light cones anchored at the source ·
`clip-path` + `mask-image` feathering · `mix-blend-mode: screen` ·
3D `perspective` with an offset `perspective-origin` · `cqw` container units
throughout (zero media queries) · `prefers-reduced-motion`.

### Publishing to CodePen

Create a new pen and paste each file into its matching panel:

| File | CodePen panel |
|---|---|
| everything inside `<body>` in `index.html` (not the `<script>` tag) | **HTML** |
| all of `style.css` | **CSS** |
| all of `script.js` | **JS** |

Then set the pen to a **wide preview** so the 5:4 scene has room, and embed it
in the post with:

```
{% codepen https://codepen.io/YOUR-USERNAME/pen/YOUR-PEN-ID %}
```

The art is finished CSS on its own — the JS pane can be emptied and the picture
still works, which is the point.

---

## 2. Cutting Chai — CSS art

A kulhad of masala chai steaming on a wooden table, whole spices scattered
around it, and a biscuit with one bite gone.

```
css-art-chai/
  index.html    markup only
  style.css     the whole picture
  script.js     ~40 lines: random steam + the dunk
```

**Techniques on show:** an 18-point `clip-path` for the hand-thrown silhouette ·
five stacked gradients for unglazed clay, including throwing rings ·
`mask-image` punching a real bite out of the biscuit · an 8-petal star anise
from one rule and a `--i` index · `mix-blend-mode: screen` steam with
per-wisp origins · `cqw` units throughout · `prefers-reduced-motion`.

Same CodePen panel mapping as above.

---

## 3. Open Late — landing page

An imaginary 24-hour diner whose menu follows the visitor's real clock. Four
kitchens, six dishes each, filtering by kitchen / diet / search, an hours table
that marks the service that's actually on, and a booking form.

The hero is a simplified version of the Cutting Chai kulhad — same silhouette,
same clay gradients, dropped into a different column with no numbers changed,
because both are sized in their own container units.

```
landing/
  index.html    all 24 dishes in static markup
  styles.css    tokens, both themes, every plate
  app.js        clock, filtering, form validation
```

Zero dependencies, zero build step, no image files.

**Accessibility:** skip link · landmarks with `aria-labelledby` · real radios
and checkboxes in `fieldset`s, styled as chips via `:has()` · native `<output>`
for result announcements · native `<details>` for ingredients · native
`<dialog>` for the booking confirmation · `aria-invalid` + `aria-describedby` +
`role="alert"` form validation · 44px targets · AA contrast in both themes ·
`forced-colors` fallback · `prefers-reduced-motion`.

**Progressive enhancement:** the filter panel ships `hidden` and JS reveals it.
With scripting off you get all twenty-four dishes, each badged with its kitchen,
full ingredient lists, and a natively-validated form.

### Deploying

It's three static files — any host works.

**Cloudflare Pages (direct upload).** One command, no Git involvement, and
it works with the repo private:

```bash
npx wrangler login                                    # browser OAuth, once
npx wrangler pages deploy ./landing --project-name=open-late
# -> https://open-late.pages.dev
```

Or connect the repo in the Cloudflare dashboard instead — its GitHub App reads
private repos too. Build command: none. Output directory: `landing`.

Other options:

```bash
# Netlify
npx netlify-cli deploy --dir=landing --prod

# GitHub Pages: make the repo public, then point Pages at main / root
#   -> https://<user>.github.io/<repo>/landing/

# Google Cloud Run (the challenge accepts a Cloud Run embed)
#   add the Dockerfile below, then:
gcloud run deploy open-late --source . --allow-unauthenticated --region us-central1
```

Note that hosting only solves the **demo** URL. The `Source →` link in the
landing post still needs the repo public — worth doing, since "read the code"
is doing real work for the code-quality criterion.

<details>
<summary>Dockerfile for Cloud Run</summary>

```dockerfile
FROM nginx:alpine
COPY landing/ /usr/share/nginx/html/
RUN sed -i 's/listen\s*80;/listen 8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080
```

</details>

Then embed with `{% embed YOUR_CLOUD_RUN_URL %}`, or just link the live demo.

---

## 4. Submitting

Drafts are in [`submissions/`](submissions/) with DEV front-matter:

- [`1-css-art-midnight-fridge-raid.md`](submissions/1-css-art-midnight-fridge-raid.md)
- [`2-perfect-landing-open-late.md`](submissions/2-perfect-landing-open-late.md)
- [`3-css-art-cutting-chai.md`](submissions/3-css-art-cutting-chai.md)

Before publishing:

1. Open the **official submission template** linked from the [challenge
   post](https://dev.to/devteam/join-our-latest-frontend-challenge-comfort-food-edition-28a0)
   and paste the draft into it — the template's exact headings are what the
   judges expect, and they occasionally change between rounds.
2. Replace every `YOUR-` placeholder: CodePen URLs, live demo URL, repo URL.
3. Confirm the `#frontendchallenge` tag is present on all three.
4. Fill in the cross-links — each draft has `(#)` placeholders pointing at its
   sibling posts, which you can only complete once the others are published.
   Publish, then go back and patch the links.
5. Flip `published: false` → `true`.

Both prompts accept multiple entries and every valid submission earns a
completion badge, so three posts is strictly better than one.

## Judging criteria, and where each is earned

| Criterion | Where |
|---|---|
| **CSS Art** — creativity | A moment, not a plate: the 2am fridge instead of a bowl of ramen |
| **CSS Art** — effective use of CSS | Radial light cones, mask feathering, blend modes, 3D perspective, container units |
| **CSS Art** — aesthetic outcome | Single hot light source in a dark room; high contrast, cinematic grade |
| **Landing** — accessibility | See the list above; every choice is a design decision, not a retrofit |
| **Landing** — usability / UX | The clock removes a decision: you never scroll past breakfast |
| **Landing** — creativity | A menu that follows the hour, in a genre that's usually static |
| **Landing** — code quality | Vanilla, tokenised CSS, documented JS, progressive enhancement |
