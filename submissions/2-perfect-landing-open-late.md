---
title: "Open Late — a diner menu that follows the clock, not the other way round"
published: false
tags: frontendchallenge, css, a11y, webdev
cover_image: 
---

_This is a submission for [Frontend Challenge - Comfort Food Edition, Perfect Landing](https://dev.to/challenges/frontend-2026-07-29)_

## What I Built

**Open Late** is the landing page for an imaginary 24-hour comfort diner with
four kitchens and one rule: *the menu follows the clock.*

Open it at 3am and it opens on the Small Hours menu — khichdi, drunken
noodles, grilled cheese. Open it at 8am and the same page is serving congee and
soft eggs. The page reads your actual clock, picks the kitchen that's cooking,
highlights the right row in the hours table, and tells you what it did. You can
override it and look ahead at any other service.

It's the companion piece to my five CSS art entries —
[Midnight Fridge Raid](https://dev.to/maneesh_thakur_d16c2852fa/midnight-fridge-raid-comfort-food-isnt-a-dish-its-2am-1l04),
[Cutting Chai](https://dev.to/maneesh_thakur_d16c2852fa/cutting-chai-the-comfort-food-that-isnt-food-drawn-in-css-1c27),
[Soft Boil](https://dev.to/maneesh_thakur_d16c2852fa/soft-boil-six-minutes-and-you-cannot-get-it-wrong-5dj6),
[Slow Turn](https://dev.to/maneesh_thakur_d16c2852fa/slow-turn-nine-birds-one-fire-and-twenty-minutes-of-waiting-1k17)
and [The Dabba](https://dev.to/maneesh_thakur_d16c2852fa/the-dabba-the-box-somebody-packed-for-you-before-you-were-awake-19l7)
— same idea, that comfort food is defined by the hour you need it, not by the
cuisine.

No framework. No build step. No image files — every plate on the page is
two radial gradients and a shadow.

## Demo

<!-- The challenge accepts "an image of your project with a direct link to
     the live demo", and this is the only entry with no embed of any kind
     — so the image is all a judge sees without clicking. One is enough.

     Upload with the image button in the DEV editor and paste the
     media2.dev.to URL it returns in place of SCREENSHOT-URL. -->
![Open Late — the hero and the menu for whichever kitchen is currently cooking](SCREENSHOT-URL)

<!-- Both links go live only once the repo is public AND Pages is on
     (Settings → Pages → main / root). Check them before publishing. -->
**[Live demo →](https://maneesh-kumar-thakur.github.io/devto-frontend-challenge-food-edition/landing/)**
·
**[Source →](https://github.com/maneesh-kumar-thakur/devto-frontend-challenge-food-edition)**

Try it, then try it again at a different time of day. It's a different page.

## Journey

### The idea: make the clock the interface

Restaurant landing pages are a solved genre, which makes them a bad place to
compete on layout. So I looked for a *behaviour* instead of a look. "The menu
changes with the hour" turned out to be the right hook, because it isn't
decoration — it removes a decision. You never scroll past breakfast to find
what's actually available.

That one idea then paid for the whole page: it gives the hero something true
to say, it gives the hours table a live state, and it gives the booking
confirmation something useful to tell you (*"that lands on the Evening menu"*).

```js
const SERVICES = [
  { id: 'small',     name: 'the Small Hours menu', from: 0,  to: 5  },
  { id: 'sunrise',   name: 'the Sunrise menu',     from: 5,  to: 11 },
  { id: 'afternoon', name: 'the Afternoon menu',   from: 11, to: 17 },
  { id: 'evening',   name: 'the Evening menu',     from: 17, to: 24 },
];
```

The clock re-checks every 30 seconds and rolls the menu over — but only for
someone who hasn't taken manual control of the picker. Yanking the page out
from under a person who deliberately chose "Evening" would be rude.

### Twenty-four dishes: a vessel and a glyph

My first version was honestly poor: one bowl recipe rendered in two dozen
colours. It looked tidy and told you nothing. Colour alone can't say *soup*.

The fix came in two layers. First, a **vessel**, drawn in CSS — how the thing
arrives at your table:

```html
<li class="dish" data-form="mug" …>
```

```css
.dish[data-form="plate"] .dish__art::before { … }  /* mound on a flat oval  */
.dish[data-form="tray"]  .dish__art::before { … }  /* browned, forked top   */
.dish[data-form="mug"]   .dish__art::before { … }  /* + ::after is a handle */
```

Then a **glyph** on top of it — what the thing actually is. Fourteen of them,
hand-drawn as one inline `<symbol>` sprite:

```html
<svg class="dish__icon"><use href="#i-noodles"/></svg>
```

I deliberately didn't reach for an icon library. A CDN link would break the
page's zero-dependency claim and die in any offline or sandboxed context, and
none of the good free sets (Lucide, Tabler, Phosphor) has a khichdi, an idli
or a paratha in it. Fourteen hand-drawn glyphs is a couple of hours and it's
*mine*, with no licence to honour and no request to make.

Two things I got wrong first time, both worth stealing:

**The glyphs originally drew their own bowls.** A bowl glyph sitting inside a
CSS bowl reads as doubled and slightly broken. Every glyph is now the *food
only* — a nest of noodles, a mound of rice, a fried egg — and the vessel
underneath supplies the container.

**One of my "vessels" wasn't a vessel.** I had `stack` alongside bowl, plate,
tray and mug — but a stack is a shape food *takes*, not a thing you serve it
in. Once the glyph did the stacking, a stack vessel under a stack glyph was
the same doubling again. Those dishes are plates now.

The lesson generalises past food: when you're differentiating a list of things
visually, **spend your effort on silhouette before colour.** Shape survives
being small, greyscale, and glanced at.

### The `hidden` bug that broke my own progressive enhancement

Worth its own section, because I'd written a whole paragraph in this post
claiming the filter panel is invisible without JavaScript — and it wasn't.

`hidden` is just `display: none` in the UA stylesheet, which means **any**
author rule that sets `display` silently beats it. I had two:

```css
.btn     { display: inline-flex; }   /* un-hid "Clear filters"     */
.filters { display: grid; }          /* un-hid the whole panel!    */
```

So with scripting off, the panel appeared anyway, full of dead controls — the
exact failure I'd designed it to avoid. One line fixes it, and it's the only
place on the page I'd defend an `!important`:

```css
[hidden] { display: none !important; }
```

I only caught it because I rendered the page with the `<script>` tag deleted
and looked. Claiming progressive enhancement is easy; **testing** it means
actually removing the script.

### Accessibility, and why each choice was made

I tried to make every a11y decision a *design* decision rather than a
retrofit:

**The filters don't exist until they work.** They ship with `hidden` and JS
removes it. With scripting off you get all twenty-four dishes, each badged with the
kitchen that cooks it — a perfectly good menu — instead of dead controls that
lie about what they do.

**Native controls, styled as chips.** The kitchen picker is `<fieldset>` +
`<legend>` + real radios; the dietary filters are real checkboxes, because
picking zero or more things is exactly what a checkbox group is. Arrow-key
navigation, group semantics and checked state all come free. The inputs are
visually invisible but still focusable, and the chip is styled through
`:has(input:checked)`. No `div` can be talked into any of that.

It also means the checkbox *is* the state — nothing is mirrored into a JS
variable that can drift out of sync with what a screen reader announces.

**A live region that says something useful.** Filtering is pointless if you
can't tell what's left, so the count sits in an `<output>` — the native
"result of a calculation" element, which carries an implicit status role and
needs no ARIA at all. It announces *"Showing 4 dishes on Small Hours menu."*
after every change, debounced by 250ms so typing doesn't machine-gun it.

**And one live region I deliberately removed.** The header clock started life
as `role="status"`. It updates every 30 seconds — so it would have read the
time aloud twice a minute, forever. A kitchen changeover is worth announcing
once, under the menu, where it changes what you can order. The clock is not.

**`<details>` instead of a JS modal** for the ingredient lists. Native, keyboard
operable, works with scripting off, and screen readers already know how to
announce it. I saved `<dialog>` for the one genuine modal moment — the booking
confirmation — where `showModal()` gives me the focus trap, Esc-to-close and
focus restoration for free.

**`novalidate`, deliberately.** Native validation bubbles vanish on blur, can't
be styled, and aren't announced consistently. So the form owns its messaging:
`aria-invalid` on the field, the message wired up through `aria-describedby`,
and a `role="alert"` summary that takes focus on a failed submit. Fields only
*re*-validate once they've already been marked wrong — nobody wants an error
the first time they tab out of an empty box.

Plus the usual, done properly: a skip link, landmarks with `aria-labelledby`,
correct heading order, one focus style everywhere that clears 3:1 in both
themes, 44px touch targets, `<time datetime>`, a `forced-colors` fallback so
selection survives High Contrast mode, and a full `prefers-reduced-motion`
block.

### Night by default

It's a nocturnal diner, so it's dark by default and light is the "day shift".
A stored choice wins; otherwise it follows the OS. Every colour resolves
through one `data-theme` attribute on `<html>`, so nothing needs a second
definition per component.

`localStorage` access is wrapped — it throws outright in some privacy modes,
and a theme toggle is not worth a broken page.

### One bug worth mentioning

The neon sign's glow is deliberately larger than the sign itself
(`inset: -18%`), which quietly added 60px of horizontal scroll on narrow
screens. Absolutely-positioned children still contribute to document width.
`overflow: hidden` on the hero section fixed it — but I only found it by
measuring `scrollWidth` against `clientWidth` at four widths, not by looking.
Worth adding to your own checklist.

---

Thanks for reading. The whole thing is three files and no dependencies, so
it's easy to pull apart if any of it is useful to you.

Code is MIT licensed and on [GitHub](https://github.com/maneesh-kumar-thakur/devto-frontend-challenge-food-edition).
