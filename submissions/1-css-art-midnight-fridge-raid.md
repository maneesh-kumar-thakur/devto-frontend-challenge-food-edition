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

So I drew the moment instead of the meal. Everything in the scene is a `div`,
a gradient, a `clip-path` or a shadow. No SVG, no images, no canvas.

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
