---
title: "The Dabba — the box somebody packed for you before you were awake"
published: false
tags: frontendchallenge, css, webdev, showdev
cover_image: 
---

_This is a submission for [Frontend Challenge - Comfort Food Edition, CSS Art](https://dev.to/challenges/frontend-2026-07-29)._

## Inspiration

The brief's quiet line is **"or the dish you grew up eating."** My other four
entries all answered it with a dish. This one answers it with the **box**.

A dabba isn't food. It's four steel tins in a wire frame, and the reason it
belongs in a comfort food challenge is that nobody ever packed one for
themselves at seven in the morning. Somebody else did. That's the whole
subject — the dal, the rice, the chapatis and the sabzi are just the evidence.

There was a technical reason too. Four pieces in, I'd drawn clay, glass, water,
fire and meat, but never **metal** — and metal is the one material where the
usual approach fails outright. It turned out to be the most interesting thing
in the set.

Everything here is a `div`, a gradient or a shadow. No SVG, no images, no
canvas.

## Demo

<!-- {% embed %}, not {% codepen %} — see the README. -->
{% embed https://codepen.io/editor/Maneesh-Thakur/pen/01a00a77-b19c-7344-8066-6b8832108a59 %}

Press **Pack it up**. The three loose boxes travel back into the frame in
order, the sabzi box shuts where it stands, the lid seats on top and the wire
clamp slides down the posts to hold it all together.

## Journey

### Steel is a mirror, not a grey gradient

This is the thing I'd keep from the whole build.

My first tins were a light-to-dark ramp and they looked like **painted
plastic**. The mistake is thinking of metal as a colour. A polished cylinder is
a mirror bent into a curve — what you are drawing isn't the object, it's *the
room reflected in it*, squeezed into vertical bands. Bright where it catches
the window, dark where it catches the shadow under the table, bright again at
the edge where the curve turns away.

So the band has fourteen stops and no even spacing anywhere:

```css
--steel-band: linear-gradient(90deg,
  #3d454b  0%,  #78838c  5%,  #c2cbd3 13%,  #eff4f9 19%,
  #a9b4bc 27%,  #6d777f 37%,  #586169 45%,  #919ba4 55%,
  #dce3e9 63%,  #f8fbfe 69%,  #b3bdc5 77%,  #778189 85%,
  #474f56 93%,  #6a737b 100%);
```

The unevenness is the point. A real reflection has no rhythm, and the moment
your stops fall at tidy intervals the eye reads *gradient* instead of *metal*.

The second half is **anisotropy**. Brushed steel scatters light along the
grain, so the highlight smears in one direction instead of pooling in a spot.
On a spun tin the grain runs *around* the cylinder — so the grain layer is
horizontal while the reflection bands are vertical, and those two crossing at
right angles are what separates steel from chrome.

```css
--steel-grain: repeating-linear-gradient(0deg,
  rgba(255,255,255,0.06) 0 0.07cqw,
  rgba(0,0,0,0.055)      0.07cqw 0.15cqw,
  transparent            0.15cqw 0.33cqw);
```

One more thing, which cost nothing and fixed a lot: three cylinders showing an
**identical** reflection reads as computer-generated, because real objects
stand in different places and mirror different parts of the room. Oversizing
the band to 118% and sliding each box to its own offset gives every tin its own
reflection out of one shared gradient.

```css
.box__body            { background-size: 118% 100%; }
.box--dal   .box__body { background-position:  6% 50%; }
.box--rice  .box__body { background-position: 76% 50%; }
```

### The mouth is the camera

The four foods are the only colour in the picture, and for a long stretch two
of them were unreadable.

The wells were **26 × 6.4cqw — a 4:1 ellipse.** Dal and rice were fine, because
a uniform texture survives being squashed flat. But the chapatis and a chunky
sabzi turned to mush, and no amount of redrawing them helped.

The wells were the bug. **Opening the mouth is the same as raising the
camera** — food has to be looked *down into*, and at 4:1 there was simply no
vertical room for anything with a shape in it. Going to 8cqw on an 11cqw box
means the mouth is nearly as tall as the tin, which sounds wrong and looks
right.

### A sector is an ambiguous shape

The chapatis went through two complete rewrites and the lesson is about
*legibility*, not technique.

Version one was four chapatis folded into quarters. A quarter-fold is a
**sector**, and a sector is genuinely elegant in CSS — one square with a single
corner rounded to 100%, no `clip-path` anywhere:

```css
width: 11.4cqw; height: 11.4cqw;
border-radius: 0 100% 0 0;
```

It also didn't work. At this viewing angle a sector is an ambiguous shape — it
could be bread, or a wedge of anything — and four of them in the same pale
wheat merged into one smear. I outlined them, fanned them, enlarged them. Still
a smear.

**A stack is unambiguous.** Round flatbread piled flat is the most recognisable
form bread takes. So it's four discs, each nudged up 0.6cqw from the one below
so the pile shows its thickness as layer edges along the near rim — and those
edges do all the work of saying *there are several of these*, which four
separate shapes had been failing to say.

The top one is folded in half and laid across, which is both the fold I wanted
and the thing that stops the stack reading as one big pancake. A half-fold seen
from above is a **dome** — flat edge towards you, curve away — which is a
single `border-radius` and reads as folded instantly.

Worth saying plainly: the elegant version lost to the obvious one.

### Transforms apply right to left, and it matters

While the sectors were still in, they had to be rotated *and* foreshortened.
This is correct:

```css
transform: scaleY(0.46) rotate(-20deg);
```

Transforms apply **right to left**, so that rotates the fold in true square
space and flattens it afterwards. Written the other way round the shape is
squashed first and the rotation then *shears* it — the folds looked bent rather
than laid down, and I spent a while adjusting numbers before reading the line
properly.

The same principle survives in the lid. When it lifts onto the stack it travels
46cqw upward, which is much closer to eye level, so the same circle must be far
more foreshortened up there:

```css
.scene.is-packed .lid {
  transform: translate(-36.5cqw, -47.6cqw) rotate(0deg) scaleY(0.62);
}
```

**That `scaleY` is the whole illusion.** Without it the lid is a disc sliding
across the picture, and pressing the button looks like nothing happening —
which is exactly how the first version felt.

### The arc is two elements

Everything moved on one transform at first, and the packing felt like a
machine rather than like hands.

Two changes fixed it. The first: **horizontal travel lives on `.box` and
vertical on an inner `.box__lift`**, running different curves — X on a plain
ease, Y with a slight overshoot so the box settles instead of arriving. Nothing
physical moves diagonally in a straight line at constant proportion.

The second is my favourite detail in the piece. The contact shadow is on
`.box`, so it inherits the horizontal travel but **not** the vertical — the
shadow stays down on the table while the box rises off it. One line, and it's
the cheapest possible way to make a lift read as a lift.

### Sequence, not a chord

You cannot put the lid on before the boxes are in, so now it doesn't: dal,
rice, chapatis, mouths go dark, lid, clamp. About 2.2 seconds.

The part that isn't obvious is that opening has to reverse the *order*, not
just the direction — clamp, lid, chapatis, rice, dal, food, steam. So the
delays are declared on **both** states rather than shared:

```css
.box           { transition: transform 0.8s var(--travel-x) 0.9s; }
.box--chapati  { transition-delay: 0.75s; }

.scene.is-packed .box--dal     { transition-delay: 0s; }
.scene.is-packed .box--chapati { transition-delay: 0.45s; }
```

**Reversing a sequence is not the same as playing it backwards, and CSS will
not work that out for you.**

### The tiled-texture trick has a scale limit

In an earlier piece I made blistered skin out of two tiled dot-grids at
deliberately mismatched sizes — because the tiles never align, the pattern they
beat out reads as random. It's cheap and it's convincing.

I reused it for rice and it failed loudly: at this size the dots are big enough
to see individually, so the eye locks onto the **lattice** and reads *mesh*.

The fix was to stop asking it to be the rice. There's a third grid now so no
two ever line up, the whole thing is turned down to 40% and rotated 9° off-axis
so there's no shared horizontal to latch onto — and fourteen grains are drawn
individually on top. The grids are texture *under* the rice; the grains are the
rice.

A trick that works at one scale is not a technique. It's a trick.

### Composition is occlusion

My first arrangement had the carrier and the boxes in a row with clear air
between them. That's an **exploded diagram**, not a photograph.

Real still lifes overlap, and occlusion is most of what builds depth. The boxes
now lap over the frame and each other, each one lower in frame than the last,
because lower reads as nearer. The carrier is dead centre so the packed stack
fills the frame rather than sitting off to one side with half the picture
empty — which is what it did until I looked at a screenshot properly.

### One container query, zero breakpoints

Every dimension is in `cqw` off a single `container-type: inline-size`, and the
frame is capped by viewport height so the page never grows a scrollbar. Same as
the other four.

### Accessibility

`role="img"` with a description, everything inside `aria-hidden`, a real
`<button>` with `aria-pressed`.

The part that isn't decoration: **the `aria-label` swaps with the state.** An
open dabba with four foods in it becomes a closed steel tin, and a screen
reader being told it's still looking at dal and rice would simply be wrong.

`prefers-reduced-motion` keeps both states reachable — they arrive instead of
travelling. Less movement, not less picture.

---

**What I'd tell anyone attempting one of these:** when something looks wrong,
ask whether you are polishing the wrong object. My flames weren't badly tuned,
they were being blurred by a parent. My chapatis weren't badly drawn, they were
the wrong *shape to choose*. My food wasn't badly coloured, the container it
sat in was too flat to hold it. Three times the fix was one level up from where
I was looking.

Code is MIT licensed and on
[GitHub](https://github.com/maneesh-kumar-thakur/devto-frontend-challenge-food-edition).
Its companion pieces: a
[midnight fridge raid](https://dev.to/maneesh_thakur_d16c2852fa/midnight-fridge-raid-comfort-food-isnt-a-dish-its-2am-1l04),
a [kulhad of cutting chai](https://dev.to/maneesh_thakur_d16c2852fa/cutting-chai-the-comfort-food-that-isnt-food-drawn-in-css-1c27),
[five eggs at a rolling boil](https://dev.to/maneesh_thakur_d16c2852fa/soft-boil-six-minutes-and-you-cannot-get-it-wrong-5dj6),
and [nine birds turning over a fire](https://dev.to/maneesh_thakur_d16c2852fa/slow-turn-nine-birds-one-fire-and-twenty-minutes-of-waiting-1k17).

There is a landing page in the set too — [Open Late](https://dev.to/maneesh_thakur_d16c2852fa/open-late-a-diner-menu-that-follows-the-clock-not-the-other-way-round-20ga),
a 24-hour diner whose menu follows your real clock.
