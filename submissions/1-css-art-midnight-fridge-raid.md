---
title: "Midnight Fridge Raid — comfort food isn't a dish, it's 2am"
published: false
tags: frontendchallenge, css, webdev, showdev
---

*This is a submission for [Frontend Challenge: Comfort Food Edition](https://dev.to/challenges/frontend), CSS Art: Comfort Food*

## What I Built

A dark kitchen at 2am. The fridge door is open, and it is the only light
in the room.

The brief lists a bowl of ramen, a stack of pancakes, a slice of pie — and
then, quietly, *"the dish you grew up eating"*. That last one is the real
prompt. Comfort food isn't a recipe. It's a **moment**, and the most honest
one I could think of isn't a plate at all: it's standing barefoot in front of
an open fridge at 2am, deciding whether last night's leftovers count as a
meal. (They do.)

So I drew the moment instead of the meal. Three shelves and a crisper drawer,
a blower vent breathing cold over the top of it, and a door covered in sticky
notes you can't read. Everything in the scene is a `div`, a gradient, a
`clip-path` or a shadow. No SVG, no images, no canvas.

## Demo

{% codepen https://codepen.io/YOUR-USERNAME/pen/YOUR-PEN-ID %}

Click **Close the fridge** to put the light out.

## Journey

### The subject is the light, not the fridge

Ramen and pancakes are the two most-submitted subjects in every round of this
challenge, and they're bright, daylit, warm-toned — so a feed full of them all
blurs together. A dark scene with one hot light source stands out on contrast
alone, and it happens to be the more interesting thing to build: the fridge is
just a box, the *light* is the whole picture.

Three stacked cones do the work — a hot core at the opening, a wash across the
back wall, a pool thrown along the floor. My first attempt used linear
gradients and looked like grey fog lying on the wall. One change fixed it:

```css
/* before — fog */
background: linear-gradient(90deg, rgba(255,197,122,.5), transparent 76%);

/* after — light */
background: radial-gradient(128% 66% at 0% 50%,
  rgba(255,244,216,1)   0%,
  rgba(255,214,148,.62) 18%,
  rgba(255,172,84,.22)  44%,
  transparent           76%);
```

Anchoring the gradient **at the opening** (`at 0% 50%`) rather than running it
across the element means the falloff radiates from the source, the way light
actually behaves. Same element, same blur — completely different picture.

### Three things I had to fix

**Clipped cones show their own edges.** A `clip-path` cone is a hard-edged
polygon; `blur()` softens it but the straight rails still read. Adding a
`mask-image` on the cross axis feathers them properly:

```css
clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 88%);
mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent);
```

**An open door covers the thing it's revealing.** Rotate a full-width door
around its hinge and, from the front, it sits square on top of the shelves.
Physically correct, compositionally useless. The fix isn't the rotation — it's
the *camera*:

```css
.fridge__lower {
  perspective: 90cqw;
  perspective-origin: 151% 50%;   /* stand to the right of the fridge */
}
```

Dragging the vanishing point off to the right swings the door's projection
clear of the cavity, exactly like stepping sideways for a better view.

**`clip-path` clips children too.** My takeout carton is a `clip-path`
trapezoid, and its wire handle simply vanished — as did the milk carton's cap
and the cake's frosting. All three were children of clipped parents. Moving the
clip onto a `::before` and leaving the parent unclipped brought them all back.

### The door has two sides, and it should

My first version was one panel. Shut it, and you were looking at the *racks* —
because a single plane can only ever show you one thing.

A fridge door has an outside, and what's on the outside is the whole point of a
fridge door: the notes, the shopping list, the alphabet magnets that outlived
the child they were bought for. So it became two skins on one hinge:

```css
.door__outer, .door__face { backface-visibility: hidden; }
.door__outer { transform: translateZ(0.45cqw); }                      /* notes */
.door__face  { transform: rotateY(180deg) translateZ(0.45cqw); }      /* racks */
```

That's the flip-card pattern, but the parent never rotates a full 180° — it
swings from -3° to -64°. The swap still happens by itself, somewhere mid-swing,
at whatever angle the door's plane turns away from the camera. I didn't have to
pick a threshold or write a line of JS; the browser works out which face you can
see and draws only that one.

Two details fell out of it. The inner face is mirrored by its own 180° flip, so
its lighting gradient had to be reversed from `90deg` to `270deg` to stay
brightest at the hinge. And the notes are drawn almost black — at 2am in an
unlit kitchen a sticky note is a *shape and a smudge of colour*, so the ruled
lines are there to tell you it's handwriting while giving you no chance of
reading a word:

```css
.note::after {
  background: repeating-linear-gradient(0deg,
    rgba(0,0,0,.4) 0 0.15cqw, transparent 0.15cqw 0.78cqw);
}
```

### The blower, and why the cold needed no blend mode

There's a vent grille cut into the back wall, and cold falls out of it. It's
the same trick as the steam in my [chai piece](#) — drifting translucent
shapes — run in reverse, because **cold sinks**. Steam rises and spreads; this
drops and fans forward over the shelves.

The grille is one `repeating-linear-gradient` with a lit lower lip on each
slat, which is what sells it as cut *into* the wall rather than stuck on:

```css
background: repeating-linear-gradient(180deg,
  rgba(58,26,6,.72)     0      0.34cqw,   /* the slot */
  rgba(255,226,180,.32) 0.34cqw 0.5cqw,   /* light catching its lower edge */
  transparent           0.5cqw  0.78cqw);
```

My first attempt at the cold air used `mix-blend-mode: screen`, copied
straight from the light cones outside. It was completely invisible, and the
reason is obvious in hindsight: `screen` *adds* light, and the inside of a lit
fridge is already near-white. There was nothing left to add. Cold air has to
**sit on** the warm light and cool it, not brighten it — so it's plain alpha,
no blend mode at all. Blend modes aren't free wins; they only work when the
backdrop has room to move in that direction.

### The door bins, and fighting my own perspective

The inside of the door is the best part of a fridge — milk, water, beer, the
one bottle of something nobody remembers buying — and mine was three grey
smears. The problem wasn't the drawing, it was that the door only projected
about **11cqw wide** on screen. Anything painted on it turned to mush.

The fix was to the *camera*, not the artwork. Pushing the vanishing point
further right (`perspective-origin: 151% → 200%`) and easing the swing back
from -64° to -58° widened the door's projection by roughly half, which is the
difference between "detail is impossible here" and "detail is worth doing".

Then the bins. The thing that makes a door read as a *door* isn't the bottles,
it's the **occlusion** — you never see a whole bottle, only necks and
shoulders standing above a moulded plastic lip:

```css
.bin {
  height: 42%;                                        /* hides the lower half */
  box-shadow: inset 0 0.34cqw 0 rgba(255,214,166,.75); /* light on the rim */
}
```

That one bright inset line along the top is what turns a dark band into
something you could hook a finger over. But it still wasn't enough on its own —
the bottles read as *balanced on a ledge* rather than standing in a tray. What
fixed it was a second element behind them, taller than the front face, so a
band of dark tray interior shows above the lip:

```css
.well { height: 60%; }   /* the recess */
.bin  { height: 42%; }   /* the front face over it */
```

Eighteen percent of visible darkness between the two, and suddenly the bottles
are *in* something.

And one framing mistake worth naming: the door's free edge was running off the
left of the canvas. A cropped door has no boundary of its own, so it read as an
ambiguous dark region with bins floating on it, no matter how well the bins were
drawn. Moving the whole fridge 6cqw right — and every light cone with it —
fixed more than another hour of shading would have.

Each bottle is one element and two pseudo-elements — body, neck, cap — so the
silhouettes stay distinguishable at a glance: milk is squat with a coloured
cap, water is tall and ribbed, beer has a long neck and a pale label band, the
juice carton has a folded gable top and no cap at all.

One more thing had to change: the door was rendering almost black, because I'd
lit the *panel* but not the things standing on it. The cavity is throwing light
at that face, so a warm gradient screened over the whole face as a last child
puts that light back onto the bottles too.

### Depth when you have no room for it

Comparing against reference photos, the thing my fridge was most obviously
missing was **density**. Real fridges are packed. Mine had three items a shelf.

But the cavity is only 31cqw wide and the open door hides a third of it, so
there was no horizontal room for more. The answer was to build backwards
instead: a second row that sits *higher* on each shelf, which reads as further
back, and then sells it with two cheap cues:

```css
.backrow {
  bottom: 3.4cqw;                          /* higher = further back */
  filter: brightness(0.72) blur(0.09cqw);  /* dimmer and softer = further away */
}
```

Three properties, no extra width, and the shelves suddenly look stocked.

The crisper drawer does the opposite thing with the same goal. The vegetables
are drawn at full strength and then **buried** behind a translucent panel with
`backdrop-filter`, so they read as "vegetables you can half see" rather than as
vegetables. It's the only place in the picture where *hiding* detail is what
adds it.

### Sizing: one container query, zero breakpoints

Every dimension in the scene is in `cqw` — 1% of the scene's own width — off a
single `container-type: inline-size`. The whole thing scales to any viewport
with no media queries and no magic numbers anywhere.

### The sprinkle of JavaScript

This round allows a little JS, so I used about thirty lines for two things
the CSS genuinely couldn't do: scatter the dust motes randomly so the loop
never repeats identically, and let you shut the door again.

Both are strictly enhancements. The door's steady state is *open* and the motes
have hand-authored `nth-child` fallbacks — delete the JS pane entirely and you
still get the finished picture.

### Accessibility

CSS art is still an image, so it's marked as one — `role="img"` with an
`aria-label` describing the scene, everything inside `aria-hidden`. The toggle
is a real `<button>` with `aria-pressed`, and `prefers-reduced-motion` stops
the door swinging, the bulb flickering and the dust drifting.

---

Thanks for reading. If you build one of these, my one piece of advice: pick a
scene with a light source in it. Light is the most rewarding thing CSS draws.
