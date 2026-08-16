/* ============================================================
   SOFT BOIL — the "sprinkle of JavaScript"

   Two jobs, both optional. The picture is finished CSS without
   this file: every bubble, egg and wisp has a hand-authored
   fallback in the stylesheet. Delete the JS pane and you still
   get the art — you just lose the switch, and the boil repeats
   on a fixed cycle instead of never quite repeating.

   1. Scatter the boil, so no two bubbles ever line up twice.
   2. Turn the heat off, and back on.

   Waits for the DOM and bails quietly if its elements aren't
   there. That isn't ceremony: environments that inject the
   script into <head> — CodePen among them, depending on the
   pen's settings — run it before the markup exists, and an
   unguarded getElementById would throw and take the button with
   it. The art is CSS, so a missing script should cost you the
   switch and nothing else.
   ============================================================ */
(() => {
  'use strict';

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (el, prop, value) => el.style.setProperty(prop, value);

  function init() {
    const scene = document.getElementById('scene');
    const heat  = document.getElementById('heat');
    const label = document.getElementById('heat-label');
    if (!scene || !heat || !label) return;

    const eggs    = [...scene.querySelectorAll('.egg')];
    const bubbles = [...scene.querySelectorAll('.bubbles i')];
    const wisps   = [...scene.querySelectorAll('.steam i')];

    /* A real boil has no rhythm. Every negative delay starts its
       element already mid-cycle, so the pan is at a full rolling
       boil on the first frame rather than filling up to one. */
    function stirTheBoil() {
      for (const b of bubbles) {
        pick(b, '--x',     `${rand(6, 88).toFixed(1)}%`);
        pick(b, '--w',     `${rand(0.55, 1.7).toFixed(2)}cqw`);
        pick(b, '--h',     `${rand(26, 30).toFixed(1)}cqw`);
        pick(b, '--d',     `${rand(1.5, 3.1).toFixed(2)}s`);
        pick(b, '--delay', `-${rand(0, 3.1).toFixed(2)}s`);
      }

      for (const w of wisps) {
        pick(w, '--x',     `${rand(-11, 11).toFixed(1)}cqw`);
        pick(w, '--w',     `${rand(2.1, 4).toFixed(2)}cqw`);
        pick(w, '--d',     `${rand(6, 9).toFixed(1)}s`);
        pick(w, '--delay', `-${rand(0, 9).toFixed(1)}s`);
        pick(w, '--drift', `${rand(-6, 6).toFixed(1)}cqw`);
      }
    }

    /* Eggs are jostled by the boil, so they get re-seeded with it —
       but never re-placed. `left`/`top` stay in the stylesheet and
       only the motion around that point is randomised, so the
       composition survives every reshuffle. Five eggs that drift
       into one corner would be a worse picture, reliably. */
    function jostleTheEggs() {
      for (const egg of eggs) {
        pick(egg, '--d',     `${rand(4, 6.4).toFixed(2)}s`);
        pick(egg, '--delay', `-${rand(0, 6).toFixed(2)}s`);
        pick(egg, '--dx',    `${rand(0.7, 1.5).toFixed(2)}cqw`);
        pick(egg, '--dy',    `${rand(0.6, 1.4).toFixed(2)}cqw`);
        pick(egg, '--r0',    `${rand(-10, -2).toFixed(1)}deg`);
        pick(egg, '--r1',    `${rand(2, 10).toFixed(1)}deg`);
      }
    }

    stirTheBoil();
    jostleTheEggs();

    /* The switch — and note how little it does. Coming to the boil
       takes about nine seconds and runs in four overlapping stages,
       none of which are timed here: the ring takes, the water
       warms, the bubbles arrive a few at a time, and the eggs
       finally start to move. All of that is two custom properties
       transitioning in the stylesheet.

       Doing it with setTimeout instead was the obvious first
       instinct and it is a trap — every stage becomes a timer that
       can be fired twice by an impatient click, and the states
       drift apart. There is nothing to double-fire here. Toggling
       the class mid-ramp just reverses the transitions from
       wherever they had got to. */
    heat.addEventListener('click', () => {
      const off = scene.classList.toggle('is-off');

      heat.setAttribute('aria-pressed', String(off));
      label.textContent = off ? 'Put the heat back on' : 'Turn off the heat';

      /* Re-seeded at the moment the heat goes on, while the bubbles
         are still invisible — so the second boil is not a replay of
         the first, and nothing visibly jumps as it is reshuffled. */
      if (!off) {
        stirTheBoil();
        jostleTheEggs();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
