---
title: "Slow Turn — nine birds, one fire, and twenty minutes of waiting"
published: false
tags: frontendchallenge, css, webdev, showdev
cover_image: 
---

_This is a submission for [Frontend Challenge - Comfort Food Edition, CSS Art](https://dev.to/challenges/frontend-2026-07-29)._

## Inspiration

The other three pieces in this set are quiet. A fridge at 2am, a cup of chai, a
pan of eggs. This one is the opposite: a whole tandoor of birds turning over a
fire, which is the most theatrical way anyone has ever cooked anything.

The comfort here isn't the eating. It's the **waiting** — standing in front of
the glass while nine chickens go round, knowing yours isn't ready, watching it
anyway. Every city has a window like this and everybody has stood at one.

Skinless and deep red, the way tandoori actually is, because the marinade
becomes the colour when you take the skin off — and because a cabinet full of
red against a cold grey kitchen means the fire is the only warm thing in the
frame. Same lesson the fridge piece ended on, used on purpose.

Everything here is a `div`, a gradient or a shadow. No SVG, no images, no
canvas.

## Demo

<!-- {% embed %}, not {% codepen %} — see the README. -->
{% embed https://codepen.io/editor/Maneesh-Thakur/pen/01a009fb-7131-7600-be1e-1187a1408104 %}

Press **Take one out**. A bird leaves the rod, the cabinet falls out of focus,
and a plated one rises into the foreground — onion rings, mint chutney in a
ramekin, mayo, lemon, coriander, still steaming. The gap it left on the rod
stays a gap.

## Journey

### The rotation is not a rotation

This is the whole piece, and it nearly sank it.

The rods spin about their own long axis, and that axis runs **left to right
across the screen**. So the birds are turning towards and away from you. In CSS
that is `rotateX` — and `rotateX` on a flat shape squashes it vertically and
flips it, like turning a sheet of paper edge-on. It looks like nothing on
earth, and it is the obvious first attempt.

The way out is that a chicken on a spit is an ellipsoid about *that same axis*,
so **its silhouette barely changes as it turns.** Watch a real rotisserie: you
read the rotation almost entirely off the surface. Char climbs over the crest
and vanishes; fresh char comes round from underneath.

So the silhouette is held completely still and the char scrolls **vertically**
inside it:

```css
.bird__char {
  position: absolute;
  top: -100%;
  height: 300%;          /* three tiles tall */
  background: repeating-linear-gradient(177deg, /* char bands */ );
  animation: turn 16s linear infinite;
  animation-delay: var(--phase);
}
@keyframes turn { to { transform: translateY(33.3333%); } }
```

Three hundred percent tall, moving exactly one third, inside a parent with
`overflow: hidden` — so the loop is seamless and never shows a join. Sixteen
seconds a turn.

There is **not one degree of rotation on any bird body.** The only actual
rotate is a ±1.1° wobble, because a spitted bird is never perfectly balanced.

One detail I'd defend: birds on the same rod share a `--phase` and turn in
lockstep, because it is one rod. The three rods are offset from each other.
Getting that wrong makes a cabinet look like a screensaver.

### A chicken is its drumsticks

My first bird was one ovoid with a small leg attached. It read as a **bread
roll**, and no amount of work on the ovoid fixed it.

Looking properly at reference photos, the thing your eye locks onto is not the
torso at all. It is two drumsticks, angled apart, bone knuckles out, pointing
back along the spit. The torso behind them can be close to a plain ellipse and
nobody looks twice.

So the bird became six overlapping parts sharing one gradient, drawn in
anatomical order: far drumstick, thigh mass, torso, wing, near drumstick, neck.

Two things do most of the work. The near leg is drawn **in front** of the body
and the far leg **behind** it, which is the entire three-dimensional read with
no 3D anywhere. And each drumstick chars hardest at the **ankle**, because it
is thinnest and closest to the flame — without that dark note a drumstick is
just a sausage.

### `filter` inherits, and it cost me two attempts

The flames stayed a warm smudge through two rounds of "fixing" them, and the
reason is worth the whole article.

A flame needs a soft halo *and* a hard bright core; the core is what makes it
read as fire rather than as glow. So I built exactly that — a blurred parent
with a barely-blurred core inside it:

```css
.flame        { filter: blur(0.3cqw);  }   /* halo   */
.flame::before{ filter: blur(0.13cqw); }   /* "core" */
```

That cannot work. **A filter on a parent rasterises the parent and every
descendant**, so the core was being blurred `0.3 + 0.13`. There was never a
hard edge anywhere in the flame to see. Adding a sharper core to a blurred
parent achieves nothing at all — a fact I confirmed twice before reading my own
code properly.

The fix is that the parent carries **no filter**:

```css
.flame         { /* no filter, no blend mode */ }
.flame::before { filter: blur(0.8cqw);  }   /* halo, paints first */
.flame::after  { filter: blur(0.08cqw); }   /* core, paints on top */
```

### Blend modes need somewhere to go

Same flames, second bug, and it is one I had already written up in the fridge
piece and then walked straight back into.

The flames used `mix-blend-mode: screen`. Screen **adds** light — and `.glow`
had already flooded the bottom of the cabinet with orange, so the flames were
adding brightness to a region with no headroom left. They washed out precisely
where they should have been sharpest.

They now use no blend mode at all, and the ambient glow came down from `0.62`
to `0.44`. **The fire has to be brighter than the light it casts**, which
sounds obvious written down and was not obvious at all in the file.

### Blistering out of three grids that do not line up

Tandoori skin is covered in small raised blisters, and a perfectly even
gradient is the single biggest tell that something was drawn rather than
cooked.

Fifty hand-placed gradients would do it. This is cheaper:

```css
background-image:
  radial-gradient(circle, rgba(255,201,138,0.30) 0 24%, transparent 27%),
  radial-gradient(circle, rgba(16,4,1,0.34)      0 20%, transparent 23%),
  radial-gradient(circle, rgba(255,168,96,0.22)  0 17%, transparent 20%);
background-size: 2.15cqw 1.62cqw, 1.63cqw 2.27cqw, 1.19cqw 1.07cqw;
```

Three tiled dot-grids at deliberately mismatched sizes. Because the tiles never
line up, the pattern they beat out reads as random — and at this scale it is
indistinguishable from actually being random.

### Sometimes you move the camera instead

The plate was always going to have to cover the fire, and the fire is the best
thing in the picture. That looked like a dead end for a while.

The answer was that the fire stops being the subject:

```css
.scene.is-taken .cabinet {
  filter: blur(0.45cqw) brightness(0.58) saturate(0.82);
  transform: scale(0.985);
}
```

A rack focus. Once the machine is background, covering it is not a loss — it is
the point. The bird also leaves the rod *downward and to the right*, towards
where the plate rises from, so the two read as one bird rather than two events.

The plated bird is lit **from above**, while every bird in the cabinet is lit
**from below** by the fire. That reversal is the strongest single signal that
it is out of the machine.

### The bone that looked like a fingernail

A small one, but it is the kind of mistake that is invisible until someone says
it out loud.

My drumstick bone was `1.7cqw` wide by `0.82cqw` tall with a left-to-right
gradient. That is precisely the recipe for a **fingernail**, because a nail
*is* a flat pale oval lying along the end of a finger.

A drumstick bone ends in a knob. So: nearly round instead of long, and a
**radial** gradient with the highlight up and to the left, which gives it a top
and a side instead of a flat face.

```css
/* before — a nail */
width: 1.7cqw; height: 0.82cqw;
background: linear-gradient(92deg, #8e7357, #c6b393, #e8dac2);

/* after — a knuckle */
width: 1.6cqw; height: 1.45cqw;
background: radial-gradient(62% 58% at 34% 28%, #fdf7ea, #e5d7ba 44%, #b39d79 78%, #806d51);
```

### One container query, zero breakpoints

Every dimension is in `cqw` — 1% of the scene's own width — off a single
`container-type: inline-size`, and the frame is capped by viewport height so
the page never grows a scrollbar. Same approach as the other three pieces.

### The sprinkle of JavaScript

About fifty lines, for two things CSS could not do: scatter the smoke so no two
wisps ever line up twice, and take a bird off the rod.

Both are optional. Every moving part has a hand-authored fallback in the
stylesheet, so emptying the JS pane costs you the button and nothing else.

The one part that is **not** decoration is the label. The scene genuinely
changes what it depicts, so `aria-label` swaps with it — otherwise a screen
reader would still be told it is looking at nine birds on a rod while a sighted
viewer is looking at a plated dinner.

### Accessibility

`role="img"` with a description, everything inside `aria-hidden`, a real
`<button>` with `aria-pressed` and a label that changes with state.

`prefers-reduced-motion` freezes nine turning birds and seven flames at a pose
that still reads as cooking rather than at an empty one, and the plate still
arrives — it just does not fly in. Reduced motion means less movement, not less
picture.

---

**What I'd tell anyone attempting one of these:** when something looks wrong and
tuning the numbers does not help, the bug is usually structural, not aesthetic.
My flames were not badly tuned. They were being blurred by a parent I had
forgotten applies to its children. I adjusted colours twice before I read the
cascade.

Code is MIT licensed and on
[GitHub](https://github.com/maneesh-kumar-thakur/devto-frontend-challenge-food-edition).
Its companion pieces: a
[midnight fridge raid](https://dev.to/maneesh_thakur_d16c2852fa/midnight-fridge-raid-comfort-food-isnt-a-dish-its-2am-1l04),
a [kulhad of cutting chai](https://dev.to/maneesh_thakur_d16c2852fa/cutting-chai-the-comfort-food-that-isnt-food-drawn-in-css-1c27),
[five eggs at a rolling boil](https://dev.to/maneesh_thakur_d16c2852fa/soft-boil-six-minutes-and-you-cannot-get-it-wrong-5dj6),
and [a four-tier tiffin carrier](https://dev.to/maneesh_thakur_d16c2852fa/the-dabba-the-box-somebody-packed-for-you-before-you-were-awake-19l7).
