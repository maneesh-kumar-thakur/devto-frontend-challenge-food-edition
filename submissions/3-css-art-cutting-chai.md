---
title: "Cutting Chai — the comfort food that isn't food, drawn in CSS"
published: false
tags: frontendchallenge, css, webdev, showdev
---

*This is a submission for [Frontend Challenge: Comfort Food Edition](https://dev.to/challenges/frontend), CSS Art: Comfort Food*

## What I Built

A kulhad of masala chai, steaming, on a wooden table. Whole spices scattered
round it — star anise, a cinnamon stick, cardamom pods, cloves — and a biscuit
leaning against the cup with one bite already gone.

The brief says *"the dish you grew up eating"*, and for a very large number of
people the honest answer isn't a dish at all. It's four o'clock, every day,
for as long as anyone can remember. Chai isn't a meal, isn't a course, and
isn't optional.

The cup matters as much as what's in it. A **kulhad** is unfired terracotta,
thrown by hand, used once and thrown back into the earth — which means it's
never quite symmetrical, always a little rough, and it makes the tea taste of
wet clay. That roughness is the entire reason I picked this subject: matte
clay is *far* kinder to layered CSS gradients than glass or ceramic will ever
be.

Everything here is a `div`, a gradient, a `clip-path` or a shadow. No SVG, no
images, no canvas.

## Demo

<!-- {% embed %}, not {% codepen %} — see the README. Paste the chai pen's URL,
     copied from the address bar the same way the fridge one was. -->
{% embed https://codepen.io/Maneesh-Thakur/pen/CHAI-PEN-URL %}

Press **Dunk the biscuit**. You know you want to.

## Journey

### Getting the silhouette right matters more than the shading

My first attempt was technically fine and completely wrong — it read as a
plant pot. I'd made it tall, and tapered the base to about a quarter of the
rim width.

A real kulhad is **squat**, and its base is a bit over half the mouth. Once I
fixed the ratio, everything else in the picture suddenly worked. The
shading hadn't changed at all.

```css
.cup {
  clip-path: polygon(
    1% 0%, 99% 0%,
    97.5% 13%, 95.5% 26%, 93% 40%, 90% 54%,
    87% 67%, 84% 79%, 81% 90%, 78% 100%,   /* base ends at 78% / 22% */
    22% 100%, 19% 90%, 16% 79%, 13% 67%,
    10% 54%, 7% 40%, 4.5% 26%, 2.5% 13%
  );
}
```

Eighteen points instead of four, because a hand-thrown cup shouldn't have a
single straight edge anywhere.

The clay itself is five stacked gradient layers — throwing rings from the
potter's fingers, a rim light down the left, the shadow side, a specular
bloom, then the body colour:

```css
background:
  repeating-linear-gradient(0deg, rgba(94,46,26,.16) 0 .28cqw, transparent .28cqw 1.5cqw),
  linear-gradient(100deg, rgba(255,220,186,.5) 0 5%, transparent 30%),
  linear-gradient(260deg, rgba(48,20,8,.62) 0 7%, transparent 40%),
  radial-gradient(52% 38% at 32% 24%, rgba(255,228,198,.4), transparent 68%),
  linear-gradient(180deg, #d09468, #b9714a 44%, #8c4a2c 84%, #5e2e1a);
```

That first line — the throwing rings — is what stops it looking like a
rendered 3D cone.

### Steam is the whole trick, and it took three goes

**First go: invisible.** Low-alpha white, heavily blurred, over a dark brown
room. It vanished.

**Second go: a chimney.** I brightened it, but every wisp was positioned at
`left: 0` inside a zero-width container and centred with `translate(-50%)`, so
all five rose from the *same point*. Real steam doesn't do that.

**Third go: right.** Two changes. Each wisp got its own horizontal origin, and
the whole group got `mix-blend-mode: screen` so it *adds light* to the room
instead of laying grey film over it.

```css
.steam { mix-blend-mode: screen; }
.steam i { left: var(--x); }        /* not left: 0 */
```

There's a third subtlety I only found by staring at it: each wisp's gradient
fades in over its first quarter, so anchoring the group at the liquid surface
leaves a **visible gap** between cup and steam. The steam has to start *inside
the cup*, where the cup itself hides the transparent lead-in.

### The bite is a mask, not a drawing

The most satisfying five lines in the file:

```css
.biscuit {
  background: radial-gradient(circle, rgba(140,88,36,.42) 0 .28cqw, transparent .3cqw)
              1cqw 1cqw / 2.7cqw 2.7cqw,   /* docker holes, tiled */
              linear-gradient(170deg, #ecc78c, #d8ac6b 52%, #b98a4a);
  mask-image: radial-gradient(circle at 96% 16%, transparent 3.2cqw, #000 3.35cqw);
}
```

`mask-image` punches a real hole through the biscuit — crumb pattern, toasted
edge, box-shadow and all. Overlaying a background-coloured circle would have
faked it, and would have broken the moment anything passed behind.

### Eight petals, one custom property

The star anise is one rule and an index. Each petal is the same element
rotated by its own `--i`:

```css
.anise i {
  transform: rotate(calc(var(--i) * 45deg)) translateY(-2.6cqw);
}
```

```html
<i style="--i:0"></i><i style="--i:1"></i> … <i style="--i:7"></i>
```

Rotate-then-translate is the whole radial-layout pattern, and it's worth
keeping in your pocket.

### Sizing: one container query, zero breakpoints

Every dimension is in `cqw` — 1% of the scene's own width — off a single
`container-type: inline-size`. No media queries anywhere. The same technique
let me drop a simplified version of this cup straight into the hero of my
[landing page entry](#) without touching a single number.

### The sprinkle of JavaScript

About forty lines, for two things CSS genuinely can't do: randomise the steam
so no two wisps ever line up the same way twice, and dunk the biscuit.

Both are enhancements. The steam has hand-authored `nth-child` fallbacks and
the biscuit sits exactly where it should — empty the JS pane and you still get
the finished picture, you just lose the dunk.

One detail worth stealing: the dunk button re-enables itself on `animationend`,
but reduced-motion users never get an `animationend` — so there's an explicit
fallback rather than a button that stays disabled forever.

### Accessibility

CSS art is still an image, so it's marked as one: `role="img"` with an
`aria-label` describing the scene, everything inside `aria-hidden`. The dunk
is a real `<button>`, and `prefers-reduced-motion` stills the steam without
hiding it — reduced motion means *less movement*, not *less picture*.

---

This is my second CSS Art entry this round, alongside
[Midnight Fridge Raid](https://dev.to/maneesh_thakur_d16c2852fa/midnight-fridge-raid-comfort-food-isnt-a-dish-its-2am-1l04)
and
[Soft Boil](https://dev.to/maneesh_thakur_d16c2852fa/soft-boil-six-minutes-and-you-cannot-get-it-wrong-5dj6).
Three very different answers to the same question: comfort food isn't a
recipe, it's a time of day.
