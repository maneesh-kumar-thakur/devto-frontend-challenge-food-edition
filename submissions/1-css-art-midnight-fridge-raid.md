---
title: "Midnight Fridge Raid — comfort food isn't a dish, it's 2am"
published: false
tags: frontendchallenge, css, webdev, showdev
cover_image: 
---

_This is a submission for [Frontend Challenge - Comfort Food Edition, CSS Art](https://dev.to/challenges/frontend-2026-07-29)._

## Inspiration

The brief lists a steaming bowl of ramen, a stack of pancakes, a perfectly cut
slice of pie — and then, quietly, **"or the dish you grew up eating."**

That last one is the real prompt. Comfort food isn't a recipe. It's a
*moment*, and the most honest one I could think of isn't a plate at all: it's
standing barefoot in a dark kitchen at 2am, deciding whether last night's
leftovers count as a meal. (They do.)

So I drew the moment instead of the meal.

There was a practical reason too. Ramen and pancakes are the most-drawn
subjects in every round of this challenge, and they're bright, warm-toned and
daylit — a feed full of them blurs together. A dark scene with a single hot
light source stands out on contrast alone, and it happens to be far more
interesting to build: the fridge is just a box, the **light** is the whole
picture.

Everything in the scene is a `div`, a gradient, a `clip-path` or a shadow.
No SVG, no images, no canvas.

## Demo

<!-- {% embed %}, not {% codepen %} — see the README. -->
{% embed https://codepen.io/Maneesh-Thakur/pen/019ffcc6-745c-72fe-88f0-e59b41cb8fac %}

Click **Close the fridge** to put the light out — the door swings shut and you
get the other half of the picture: sticky notes you can't read and a few
magnets, which is what the outside of a fridge door is actually for.

Best viewed with the preview pane wide. And if you want to test the claim that
the JavaScript is optional: empty the JS panel. The picture is unchanged.

## Journey

### The subject is the light, not the fridge

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

A clipped cone also shows its own edges. `clip-path` gives you a hard-edged
polygon and `blur()` softens it, but the straight rails still read. A
`mask-image` on the cross axis feathers them properly:

```css
clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 88%);
mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent);
```

### The door has two sides, and it should

My first version was one panel. Shut it and you were looking at the *racks* —
because a single plane can only ever show you one thing.

A fridge door has an outside, and what's on the outside is the whole point of
a fridge door. So it became two skins on one hinge:

```css
.door__outer, .door__face { backface-visibility: hidden; }
.door__outer { transform: translateZ(0.45cqw); }                  /* notes */
.door__face  { transform: rotateY(180deg) translateZ(0.45cqw); }  /* racks */
```

That's the flip-card pattern, but the parent never rotates a full 180° — it
swings from -3° to -64°. **The swap still happens by itself**, somewhere
mid-swing, at whatever angle the door's plane turns away from the camera. No
threshold to pick, no JavaScript. The browser works out which face you can see
and draws only that one.

Two details fell out of it. The inner face is mirrored by its own flip, so its
lighting gradient had to reverse from `90deg` to `270deg` to stay brightest at
the hinge. And the notes are drawn almost black — at 2am in an unlit kitchen a
sticky note is a *shape and a smudge of colour*, so the ruled lines tell you
it's handwriting while giving you no chance of reading a word.

### Sometimes you fix the camera, not the artwork

The inside of the door is the best part of a fridge — milk, water, beer, the
one bottle nobody remembers buying — and mine was three grey smears. The
problem wasn't the drawing. The door only projected about **11cqw wide** on
screen, so anything painted on it turned to mush.

```css
.fridge__lower {
  perspective: 90cqw;
  perspective-origin: 200% 50%;   /* was 151% */
}
```

Pushing the vanishing point further right and easing the swing back from -64°
to -58° widened the projection by roughly half — the difference between
"detail is impossible here" and "detail is worth doing".

Then the bins. What makes a door read as a *door* isn't the bottles, it's the
**occlusion**: you never see a whole bottle, only necks and shoulders standing
above a moulded lip. And one bright inset line is what turns a dark band into
something you could hook a finger over:

```css
.bin { height: 42%; box-shadow: inset 0 0.34cqw 0 rgba(255,214,166,.75); }
```

A later fix mattered just as much — a recess *behind* the bottles, taller than
the front face, so a band of dark tray interior shows above the lip. Without
it the bottles read as balanced on a ledge rather than standing in a tray.

### `clip-path` clips children too

My takeout carton is a `clip-path` trapezoid, and its wire handle simply
vanished — as did the milk carton's cap and the cake's frosting. All three
were children of clipped parents. Moving the clip onto a `::before` and
leaving the parent unclipped brought them all back.

### Blend modes aren't free wins

There's a vent cut into the back wall, and cold falls out of it — the same
trick as steam, run in reverse, because **cold sinks**.

My first attempt used `mix-blend-mode: screen`, copied straight from the light
cones outside. It was completely invisible, and the reason is obvious in
hindsight: `screen` *adds* light, and the inside of a lit fridge is already
near-white. There was nothing left to add. Cold air has to **sit on** the warm
light and cool it, so it's plain alpha, no blend mode at all.

Blend modes only work when the backdrop has room to move in that direction.

### Depth when you have no room for it

Comparing against reference photos, the thing my fridge was most obviously
missing was **density**. Real fridges are packed. Mine had three items a shelf.

But the cavity is only 31cqw wide and the open door hides a third of it, so
there was no horizontal room. The answer was to build backwards instead — a
second row sitting *higher* on each shelf, which reads as further back:

```css
.backrow {
  bottom: 3.4cqw;                          /* higher = further back */
  filter: brightness(0.72) blur(0.09cqw);  /* dimmer + softer = further away */
}
```

Three properties, no extra width, and the shelves look stocked.

The crisper drawer does the opposite thing with the same goal: the vegetables
are drawn at full strength and then **buried** behind a translucent panel with
`backdrop-filter`. It's the only place in the picture where *hiding* detail is
what adds it.

### One container query, zero breakpoints

Every dimension is in `cqw` — 1% of the scene's own width — off a single
`container-type: inline-size`. The whole thing scales to any viewport with no
media queries and no magic numbers anywhere.

### The sprinkle of JavaScript

This round allows a little JS, so I used about thirty lines for two things CSS
genuinely couldn't do: scatter the dust motes randomly so the loop never
repeats identically, and let you shut the door again.

Both are strictly enhancements. The door's steady state is *open* and the
motes have hand-authored `nth-child` fallbacks — delete the JS and you still
get the finished picture. The script also waits for `DOMContentLoaded` and
bails quietly if its elements are missing, because a script that can't find
its button should cost you the button and nothing else.

### Accessibility

CSS art is still an image, so it's marked as one — `role="img"` with an
`aria-label` describing the scene, everything inside `aria-hidden`. The toggle
is a real `<button>` with `aria-pressed`. And `prefers-reduced-motion` stills
the door, the flicker, the dust and the cold air without hiding any of it:
reduced motion means *less movement*, not *less picture*.

---

**What I'd tell anyone attempting one of these:** pick a scene with a light
source in it. Light is the most rewarding thing CSS draws, and it does more
for a picture than any amount of detail work on the objects.

Code is MIT licensed and on
[GitHub](https://github.com/maneesh-kumar-thakur/devto-frontend-challenge-food-edition).
Its companion pieces: a
[kulhad of cutting chai](https://dev.to/maneesh_thakur_d16c2852fa/cutting-chai-the-comfort-food-that-isnt-food-drawn-in-css-1c27),
[five eggs at a rolling boil](https://dev.to/maneesh_thakur_d16c2852fa/soft-boil-six-minutes-and-you-cannot-get-it-wrong-5dj6),
and [nine birds turning over a fire](https://dev.to/maneesh_thakur_d16c2852fa/slow-turn-nine-birds-one-fire-and-twenty-minutes-of-waiting-1k17).
