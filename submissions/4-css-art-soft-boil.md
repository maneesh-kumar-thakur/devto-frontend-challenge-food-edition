---
title: "Soft Boil — six minutes, and you cannot get it wrong"
published: false
tags: frontendchallenge, css, webdev, showdev
cover_image: 
---

_This is a submission for [Frontend Challenge - Comfort Food Edition, CSS Art](https://dev.to/challenges/frontend-2026-07-29)._

## Inspiration

My other two entries were about a moment and a ritual. This one is about the
opposite: the dish you fall back on when you have no skill, no energy and no
plan. Boiled eggs are what you make when you cannot cook. Six minutes, one pan,
and the comfort is precisely that **it is not possible to get it wrong**.

Two choices made it worth drawing rather than just worth eating.

**A glass bowl, so you can see the boil.** In a steel pan the interesting half
of this is hidden. Glass also turned out to be the exact opposite problem to
the terracotta in my chai piece — unglazed clay is matte and forgives a sloppy
gradient, glass shows you every single one.

**An induction hob, for the light.** I finished the fridge piece saying the one
piece of advice I'd give is *pick a scene with a light source in it*. So I did
it again on purpose. The element ring is the only warm thing in an otherwise
cold grey kitchen, and it lights the water from underneath.

Everything here is a `div`, a gradient or a shadow. No SVG, no images, no
canvas.

## Demo

<!-- {% embed %}, not {% codepen %} — see the README. -->
{% embed https://codepen.io/editor/Maneesh-Thakur/pen/01a00952-4692-7510-92f4-e94d150044e0 %}

Press **Turn off the heat** and give it a few seconds. The ring dies back, the
bubbles thin out, and the eggs slowly stop moving — then put it back on and
watch the pan come to the boil in stages. That build-up is the part I'd most
like you to see, and it's the whole subject of this post.

## Journey

### Nothing in this picture is transparent

The obvious way to draw a glass bowl is `backdrop-filter`. I'd advise against
building a picture on it — support is uneven enough that the piece falls apart
somewhere, and it's expensive.

So the transparency is painted. The water is drawn first as its own element,
and then a front wall of highlights sits over the top of it: two vertical
speculars down the sides for the curve of the glass, a soft wash across the
middle for the thickness of the pane, and a rolled lip at the top, which is the
one place glass is genuinely opaque enough to draw as a solid.

```css
.glass {
  background: linear-gradient(101deg,
    rgba(255,255,255,0.20) 0%,   rgba(255,255,255,0.00) 13%,
    rgba(255,255,255,0.07) 47%,  rgba(255,255,255,0.00) 84%,
    rgba(255,255,255,0.17) 100%);
}
```

Read `.glass` as the pane you are looking **through**. Everything that lives in
the water is a sibling behind it, clipped by the water's own `border-radius`,
so no egg can drift out through a wall however hard it gets shoved.

An egg is an ellipse with two `border-radius` axes — fatter at the bottom than
the top. Worth doing that rather than reaching for `clip-path`, because a
`border-radius` shape stays correct under `rotate` and an equivalent polygon
does not.

```css
border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%;
```

### Two numbers run the entire picture

This is the part I'd keep from the whole build.

The scene has a switch, and my first version was symmetric: turn it off and
everything faded out, turn it on and everything snapped back to a full rolling
boil. Which is nonsense. **A pan does not do that.** Heat has to arrive before
the water can boil, and the water has to boil before it can move an egg.

Getting that lag right meant the picture needed to be a *quantity*, not a
state. So it runs on two numbers:

```css
@property --heat { syntax: '<number>'; inherits: true; initial-value: 1; }
@property --amp  { syntax: '<number>'; inherits: true; initial-value: 1; }
```

`--heat` is how hot the element is. `--amp` is how hard the water is throwing
the eggs about. Both 0 to 1.

**`@property` is the whole trick.** An unregistered custom property is just a
string, and a string cannot be transitioned. Registered as a `<number>` it
interpolates like any other animatable value — so a single transition drives
the ring, the bubbles, the churn, the steam and the eggs together:

```css
.scene {
  --heat: 1; --amp: 1;
  transition: --heat 4s ease-in,
              --amp  7s cubic-bezier(0.4, 0, 0.5, 1) 2.6s;
}
```

`--amp` doesn't start for 2.6 seconds, so there's a real stretch where the ring
is glowing and the eggs still haven't moved.

Every element then just reads the number. The ring grows and warms in colour at
the same time, because a cold element doesn't light up dim-orange — it lights
up a small sullen red and spreads outward as it takes:

```css
transform: translateX(-50%) scale(calc(0.22 + 0.78 * var(--heat)));
filter: blur(0.5cqw)
        brightness(calc(0.34 + 0.66 * var(--heat)))
        saturate(calc(1.9 - 0.9 * var(--heat)));
```

The bubbles each carry their own threshold, spaced by index, so they arrive a
few at a time instead of all at once:

```css
--vis: clamp(0, calc((var(--heat) - var(--i) * 0.062) * 7), 1);
```

Since the positions are scattered independently, the first few appear in random
places — it reads as a pan starting to catch, not as a row filling up left to
right. The surface churn holds off entirely until `--heat` clears 0.55, because
a surface only breaks at a genuine rolling boil.

**Cooling is not warming played backwards**, so the timings differ by
direction. Going off, the boil drops away first and the element stays warm
after it, the way a hob actually behaves. It's also slower overall — pans lose
heat more reluctantly than they gain it.

```css
.scene.is-off {
  --heat: 0; --amp: 0;
  transition: --amp  5s   ease-out,
              --heat 6.5s ease-out 1s;
}
```

### An animation beats a declaration, silently

I hit this twice in one build, the second time after I thought I understood it,
so it earns its own heading.

If an element has a running animation that touches `opacity`, then any
`opacity` declaration in your rule is **ignored**. Not overridden at some
specific moment — ignored for the entire duration. Animations sit above normal
declarations in the cascade.

Which meant this did precisely nothing:

```css
.hob__ring {
  opacity: calc(0.92 * var(--heat));            /* dead code */
  animation: ringPulse 3.4s ease-in-out infinite;  /* ...because of this */
}
```

The ring pulsed away at full brightness with the hob switched off, and no
amount of staring at `--heat` in DevTools explained it, because `--heat` was
correctly zero the whole time. The fix is to stop fighting the animation and
multiply inside it:

```css
.hob__ring { --vis: var(--heat); }
.spill     { --vis: calc(var(--heat) * var(--heat)); }

@keyframes ringPulse {
  0%, 100% { opacity: calc(0.82 * var(--vis)); }
  50%      { opacity: calc(1    * var(--vis)); }
}
```

Custom properties substitute live, so the keyframes pick up the new value every
frame. Keep the plain declaration too — reduced motion drops the animation, and
then it becomes the only thing setting opacity at all.

The same rule is why the bubbles gate their opacity through `--vis` rather than
setting it directly. Once you've been bitten, you start recognising it: *the
value is obviously right and the pixels obviously disagree.*

### Going still without ever stopping

Same lesson, applied to movement.

The eggs need to come to rest when the boil dies. The obvious approach is to
drop the animation and let a transition carry them home:

```css
.scene.is-off .egg { animation: none; }   /* snaps */
```

It jumps. The moment the animation goes, the computed transform reverts, and
the transition often has nothing to interpolate from.

So the eggs never stop. Every offset in the keyframes is multiplied by
`--amp`:

```css
25% { transform: translate(calc(var(--dx) *  1 * var(--amp)),
                           calc(var(--dy) * -1 * var(--amp)))
                 rotate(calc(var(--r1) * var(--amp))); }
```

At `--amp: 0` every keyframe collapses to `translate(0,0) rotate(0deg)` and the
egg rests exactly where `left`/`top` put it. As `--amp` ramps back up, the same
loop simply opens out again. Nothing pauses, nothing restarts, and there's no
discontinuity at either end.

### Two details that are the difference between water and not-water

**Bubbles get bigger as they rise**, because pressure drops on the way up.
Leaving that out was the single thing that made my first attempt look like
falling snow played backwards.

```css
0%   { transform: translateY(0) scale(0.35); }
100% { transform: translateY(calc(var(--h) * -1)) scale(1.35); }
```

**Buoyancy is slow.** My first easing on the eggs was springy and they read as
ping-pong balls. Water doesn't throw things around, it lifts and turns them —
so it's a long `ease-in-out` with rotation that lags the translation.

### Percentages don't mean what you want them to mean

Late on I cropped the frame, because there was a band of empty room across the
top doing no work, and because the page had grown a vertical scrollbar.

The crop immediately broke the scene, and the reason is worth knowing: I had
positioned the room and counter with percentages. **Percentages in `inset`
resolve against the element's height**, while every other measurement in the
piece is `cqw` — 1% of the scene's *width*. Change the aspect ratio and the two
systems silently slide out of register. Both are `cqw` now.

The scrollbar itself is worth a line, since it's a general problem with
fixed-ratio art. Capping the width alone isn't enough; it has to be capped by
the height available too:

```css
.scene {
  aspect-ratio: 50 / 37;
  width: min(100%, calc((100dvh - 15rem) * 1.35));
}
```

At this ratio width is 1.35× height, so subtracting the caption, the button and
the page padding gives the widest the scene can be and still fit on screen.
Whichever limit bites first wins.

### One container query, zero breakpoints

Every dimension is in `cqw` off a single `container-type: inline-size`. The
whole picture scales to any viewport with no width breakpoints and no magic
numbers
— the same approach as the other two pieces.

### The sprinkle of JavaScript

This is the piece where the JS got *smaller*, and that's the point.

Coming to the boil takes about nine seconds across four overlapping stages, and
none of them are timed in JavaScript. The script toggles one class. Everything
else is two custom properties transitioning in the stylesheet.

Doing it with `setTimeout` was my first instinct and it's a trap: every stage
becomes a timer that an impatient click can fire twice, and the stages drift
apart. There's nothing to double-fire here — toggling the class mid-ramp just
reverses the transitions from wherever they'd reached.

The rest of the JS scatters the bubbles and steam so the boil never repeats
identically. All of it is optional: every moving part has a hand-authored
fallback in the stylesheet, so emptying the JS pane costs you the switch and
nothing else.

### Accessibility

CSS art is still an image, so it's marked as one — `role="img"` with an
`aria-label` describing the scene, everything inside it `aria-hidden`. The
switch is a real `<button>` with `aria-pressed` and a label that changes with
the state.

`prefers-reduced-motion` freezes the boil at a pose that still reads as
boiling, rather than at an empty one, and the switch still works — it just
arrives instead of ramping. Someone who asked for less motion has not asked for
less picture.

---

**What I'd tell anyone attempting one of these:** if your scene has a state,
make it a *number* rather than a boolean. Registering one custom property with
`@property` bought me a nine-second, four-stage, physically-plausible boil out
of two lines of transition — and left the JavaScript with nothing to do but
toggle a class.

Code is MIT licensed and on
[GitHub](https://github.com/maneesh-kumar-thakur/devto-frontend-challenge-food-edition).
Its companion pieces: a
[midnight fridge raid](https://dev.to/maneesh_thakur_d16c2852fa/midnight-fridge-raid-comfort-food-isnt-a-dish-its-2am-1l04),
a [kulhad of cutting chai](https://dev.to/maneesh_thakur_d16c2852fa/cutting-chai-the-comfort-food-that-isnt-food-drawn-in-css-1c27),
[nine birds turning over a fire](https://dev.to/maneesh_thakur_d16c2852fa/slow-turn-nine-birds-one-fire-and-twenty-minutes-of-waiting-1k17),
and [a four-tier tiffin carrier](https://dev.to/maneesh_thakur_d16c2852fa/the-dabba-the-box-somebody-packed-for-you-before-you-were-awake-19l7).
