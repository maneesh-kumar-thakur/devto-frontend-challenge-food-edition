# DEV Frontend Challenge — Comfort Food Edition

Six entries, one idea: **comfort food is defined by the hour you need it,
not by the recipe.**

| | Entry | Prompt |
|---|---|---|
| 🌙 | [Midnight Fridge Raid](css-art/) | CSS Art: Comfort Food |
| ☕ | [Cutting Chai](css-art-chai/) | CSS Art: Comfort Food |
| 🥚 | [Soft Boil](css-art-eggs/) | CSS Art: Comfort Food |
| 🔥 | [Slow Turn](css-art-tandoor/) | CSS Art: Comfort Food |
| 🍱 | [The Dabba](css-art-dabba/) | CSS Art: Comfort Food |
| 🍽️ | [Open Late](landing/) | Perfect Landing: Comfort Food |

The challenge allows multiple entries per prompt, so all five CSS-art pieces go
in as separate posts — 2am leftovers, 4pm chai, the six-minute egg, the twenty
minutes at the tandoor window and the box somebody packed for you are five
answers to the same question, and none competes with the others.

Deadline: **16 August, 11:59pm PDT** — which is **17 August, 12:29pm IST**.
Tag all six posts `#frontendchallenge`.

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
throughout (no width breakpoints) · `prefers-reduced-motion`.

### Publishing the art posts — CodePen via `{% embed %}`

All five art posts embed a CodePen. **Use `{% embed %}`, not `{% codepen %}`** —
this is the one combination that works, confirmed in a published post:

```
{% embed https://codepen.io/Maneesh-Thakur/pen/<uuid> %}     ← renders
{% codepen https://codepen.io/Maneesh-Thakur/pen/<uuid> %}   ← "Invalid CodePen URL"
{% https://codepen.io/Maneesh-Thakur/pen/<uuid> %}           ← prints as plain text
```

Why: the dedicated `{% codepen %}` tag validates the URL against the **classic**
pen shape (`codepen.io/user/pen/abcXYZ`) and rejects anything else. This account
is on CodePen's newer file-based editor, which only ever produces UUID URLs, and
`codepen.io/pen` redirects back to it — so there is no classic pen to create and
nothing to convert. The generic `{% embed %}` tag skips that validation and
resolves the UUID URL fine. Chasing a classic pen is a dead end; don't retry it.

Creating a pen, in that newer editor:

1. New Pen → paste **the whole of** `index.html`, `style.css` and `script.js`,
   one per file tab. Unlike a classic pen, this editor has a real filesystem, so
   the document's `<link rel="stylesheet" href="style.css">` resolves and the
   full HTML document is correct as-is.
2. **Select-all in `style.css` before pasting.** It ships with an
   `html::before { content: 'CodePen ♥ The Web' }` starter block — pasting below
   it leaves a faint fixed caption floating over the scene.
3. Set the pen **title** (it shows in the embed) and confirm **Public**.
4. Save, then copy the URL from the address bar into the post.

Do not paste a fragment of the markup. A classic pen wanted the `<body>`
contents only; this editor wants the whole `index.html`, `<head>` and all.

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

## 3. Soft Boil — CSS art

Five eggs at a rolling boil in a clear glass bowl on an induction hob, with the
element ring glowing underneath.

```
css-art-eggs/
  index.html    markup only
  style.css     the whole picture
  script.js     ~50 lines: scatter the boil + the heat switch
```

**Techniques on show:** `@property`-registered `<number>` custom properties, so
`--heat` and `--amp` can be *transitioned* — one declaration drives a
nine-second, four-stage warm-up across every element · painted glass, no
`backdrop-filter` anywhere · per-bubble `clamp()` thresholds so the boil arrives
a few bubbles at a time · amplitude multiplied inside `@keyframes`, so the eggs
go still without the animation ever stopping · bubbles that scale up as they
rise · `cqw` units throughout · `prefers-reduced-motion`.

The one to steal: **an animation that touches a property silently beats any
plain declaration of that property.** Gating opacity through a `--vis`
multiplier *inside* the keyframes is the fix, and it's why `.hob__ring`,
`.spill`, `.bubbles i` and `.churn i` all set `--vis` rather than `opacity`.

Same CodePen panel mapping as above.

---

## 4. Slow Turn — CSS art

Nine skinless tandoori chickens on three rods above a low fire, behind the
glass of a vertical tandoor. Take one out and it is plated in the foreground.

```
css-art-tandoor/
  index.html    markup only
  style.css     the whole picture
  script.js     ~55 lines: scatter the smoke + take one out
```

**Techniques on show:** rotation sold entirely by scrolling the surface, with
the silhouette held still and zero degrees of rotate on any bird · a rack focus
that blurs the machine so the plate can own the foreground · blistered skin
from three tiled dot-grids at mismatched sizes · citrus segments from a
`repeating-conic-gradient` anchored at the wedge's base · `cqw` throughout ·
`prefers-reduced-motion` · `aria-label` that swaps with the state.

The two to steal: **`filter` on a parent rasterises every descendant**, so a
blurred parent with a "sharp" child is not sharp — halo and core must be
`::before` and `::after`, each owning its own filter. And **`mix-blend-mode:
screen` needs headroom**; over an already-bright backdrop it does nothing.

Same CodePen panel mapping as above.

---

## 5. The Dabba — CSS art

A four-tier steel tiffin carrier, opened: dal, rice, a stack of chapatis and a
vegetable sabzi, three boxes out on the table and one still in the frame.

```
css-art-dabba/
  index.html    markup only
  style.css     the whole picture
  script.js     ~55 lines: scatter the steam + pack it up
```

**Techniques on show:** a fourteen-stop unevenly-spaced reflection band, because
a polished cylinder is a mirror and not a colour · horizontal grain crossing
vertical bands for anisotropy · one band slid to a different offset per box so
no two tins mirror the same room · an arc built from two elements running
different curves · a contact shadow that stays down while its box rises ·
`cqw` throughout · `prefers-reduced-motion` · `aria-label` that swaps with state.

The one to steal: **reversing a sequence is not playing it backwards.** Closing
runs dal → rice → chapatis → lid → clamp; opening has to run the other way, so
the delays are declared on both states rather than shared.

Same CodePen panel mapping as above.

---

## 6. Open Late — landing page

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

Zero dependencies, zero build step, no image files — the dish icons are
inline SVG, which is the one place in the repo any SVG appears.

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

Static files, no build step — any host works. **Only the landing post needs a
host** — all five art posts ship as CodePen embeds, so hosting is optional for
them.

**GitHub Pages — no CLI, no new account.** The repo is already on GitHub, and
the landing post's `Source →` link needs it public anyway.

Everything the site needs is already committed, so going live is two switches
and no code:

1. **Settings → General → Change visibility → Public.** Pages will not serve a
   private repo on a free account, and every `Source →` link in the five
   published art posts is 404ing until this happens.
2. **Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.**
   First build takes a minute or two.
3. Open the demo link in [`2-perfect-landing-open-late.md`](submissions/2-perfect-landing-open-late.md)
   and confirm it loads before publishing that post.
4. Optionally set the repo's **About → Website** to the Pages URL.

Two files exist purely so step 2 behaves:

- **`.nojekyll`** — Pages runs Jekyll by default, and all seven drafts in
  `submissions/` open with `---`, so Jekyll would treat them as pages with
  front matter and try to render them. This turns Jekyll off entirely and
  serves the tree as-is.
- **`index.html` at the repo root** — without it the bare Pages URL has no
  page, and Jekyll would have rendered `README.md` as the homepage. It is a
  plain signpost to the six entries, one file, no dependencies, so it cannot be
  the thing that breaks on the day.

Serves all six entries:

| Entry | Path |
|---|---|
| Midnight Fridge Raid | `/css-art/` |
| Cutting Chai | `/css-art-chai/` |
| Soft Boil | `/css-art-eggs/` |
| Slow Turn | `/css-art-tandoor/` |
| The Dabba | `/css-art-dabba/` |
| Open Late (landing) | `/landing/` |

under `https://maneesh-kumar-thakur.github.io/devto-frontend-challenge-food-edition/`.

Other options, all serving the repo root:

```bash
# Cloudflare Pages
npx wrangler login                              # browser OAuth, once
npx wrangler pages deploy . --project-name=open-late

# Netlify
npx netlify-cli deploy --dir=. --prod

# Google Cloud Run (the challenge accepts a Cloud Run embed)
#   add the Dockerfile below, then:
gcloud run deploy open-late --source . --allow-unauthenticated --region us-central1
```

Cloudflare and Netlify both connect the repo from their dashboard instead, and
both read private repos. Build command: none. Output directory: `/` (the root).

<details>
<summary>Dockerfile for Cloud Run</summary>

```dockerfile
FROM nginx:alpine
# the repo root, so /css-art/, /css-art-chai/, /css-art-eggs/,
# /css-art-tandoor/, /css-art-dabba/ and /landing/ are all served
COPY . /usr/share/nginx/html/
RUN sed -i 's/listen\s*80;/listen 8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080
```

</details>

Then embed with `{% embed YOUR_CLOUD_RUN_URL %}`, or just link the live demo.

---

## 7. Submitting

Drafts are in [`submissions/`](submissions/) with DEV front-matter.

| Draft | Prompt | Status |
|---|---|---|
| [`1-css-art-midnight-fridge-raid.md`](submissions/1-css-art-midnight-fridge-raid.md) | CSS Art | **published** |
| [`3-css-art-cutting-chai.md`](submissions/3-css-art-cutting-chai.md) | CSS Art | **published** |
| [`4-css-art-soft-boil.md`](submissions/4-css-art-soft-boil.md) | CSS Art | **published** |
| [`5-css-art-slow-turn.md`](submissions/5-css-art-slow-turn.md) | CSS Art | **published** |
| [`6-css-art-the-dabba.md`](submissions/6-css-art-the-dabba.md) | CSS Art | ready to post |
| [`2-perfect-landing-open-late.md`](submissions/2-perfect-landing-open-late.md) | Perfect Landing | needs a demo URL |
| [`discussion-css-art-comfort-food.md`](submissions/discussion-css-art-comfort-food.md) | — | ready, not an entry |

Before publishing:

1. Open the **official submission template** linked from the [challenge
   post](https://dev.to/devteam/join-our-latest-frontend-challenge-comfort-food-edition-28a0)
   and paste the draft into it — the template's exact headings are what the
   judges expect, and they occasionally change between rounds.
2. Embed the pen with `{% embed %}`, never `{% codepen %}` — see the section
   above for why.
3. Confirm the `#frontendchallenge` tag is present.
4. Flip `published: false` → `true`.

**Still outstanding:** one link, in
[`3-css-art-cutting-chai.md`](submissions/3-css-art-cutting-chai.md) — it
points at the landing post, which does not exist yet. Everything else is
filled in; the landing draft's demo and source URLs are written and simply go
live when the two switches above are flipped.

Editing a draft here does **not** change an already-published post. The five
art drafts have since gained links to each other; those links only exist on DEV
if they are pasted into each post's editor by hand.

Both prompts accept multiple entries and every valid submission earns a
completion badge, so six posts is strictly better than one.

## Licence

[MIT](LICENSE) — use it, change it, ship it, sell it. The only condition is
that the copyright notice travels with the source.

That covers the code *and* the artwork here, which are the same thing: every
shape in all five CSS-art pieces is a div and a gradient, so there's nothing to
licence separately.

## Judging criteria, and where each is earned

| Criterion | Where |
|---|---|
| **CSS Art** — creativity | Five answers to one question, none of them a plate of food: a moment (2am fridge), a ritual (4pm chai), a fallback (six-minute egg), a wait (the tandoor window), and a container (the dabba) |
| **CSS Art** — effective use of CSS | `@property`-registered numbers that can be *transitioned* · rotation sold by scrolling a surface rather than rotating anything · painted glass with no `backdrop-filter` · a fourteen-stop reflection band for steel · `repeating-conic-gradient` citrus · radial light cones, mask feathering, 3D perspective · `cqw` throughout, so none of the five contains a width breakpoint |
| **CSS Art** — aesthetic outcome | Every piece has one light source and one warm accent against a cold room; the set reads as a series rather than five unrelated drawings |
| **Landing** — accessibility | See the list above; every choice is a design decision, not a retrofit |
| **Landing** — usability / UX | The clock removes a decision: you never scroll past breakfast |
| **Landing** — creativity | A menu that follows the hour, in a genre that's usually static |
| **Landing** — code quality | Vanilla, tokenised CSS, documented JS, progressive enhancement |

Each art post also carries its own write-up of what went **wrong** — a filter
inheriting onto a child that was meant to stay sharp, a blend mode with no
headroom left, an animation silently outranking a declaration, an elegant shape
losing to an obvious one. Those are the parts worth reading.
