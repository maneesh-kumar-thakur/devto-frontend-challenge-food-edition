/* ============================================================
   SLOW TURN — the "sprinkle of JavaScript"

   Two jobs, both optional. The picture is finished CSS without
   this file: the smoke has hand-authored nth-child fallbacks and
   every bird, flame and drip is already turning. Delete the JS
   pane and you still get the art — you just lose the button.

   1. Drift the smoke, so no two wisps ever line up twice.
   2. Take one out, and put it back.

   Waits for the DOM and bails quietly if its elements aren't
   there. That isn't ceremony: environments that inject the
   script into <head> — CodePen among them, depending on the
   pen's settings — run it before the markup exists, and an
   unguarded getElementById would throw and take the button with
   it. The art is CSS, so a missing script should cost you the
   button and nothing else.
   ============================================================ */
(() => {
  'use strict';

  const rand = (min, max) => min + Math.random() * (max - min);

  function init() {
    const scene = document.getElementById('scene');
    const take  = document.getElementById('take');
    const label = document.getElementById('take-label');
    if (!scene || !take || !label) return;

    const wisps = [...scene.querySelectorAll('.smoke i')];

    /* Smoke is the one thing in the picture that should never
       repeat. A negative delay starts every wisp already mid-rise,
       so the cabinet is full of it on the first frame rather than
       filling up to it. */
    function driftTheSmoke() {
      for (const w of wisps) {
        w.style.setProperty('--x',     `${rand(-21, 21).toFixed(1)}cqw`);
        w.style.setProperty('--w',     `${rand(3.8, 6.6).toFixed(2)}cqw`);
        w.style.setProperty('--d',     `${rand(8, 12).toFixed(1)}s`);
        w.style.setProperty('--delay', `-${rand(0, 12).toFixed(1)}s`);
        w.style.setProperty('--drift', `${rand(-7, 7).toFixed(1)}cqw`);
      }
    }

    driftTheSmoke();

    /* The scene genuinely changes what it depicts, so the label has
       to change with it. Everything else in this file is optional
       decoration; this bit is not. A sighted viewer gets a plate
       rising into the foreground, and without this a screen reader
       would still be told it is looking at nine birds on a rod. */
    const LABEL_COOKING = scene.getAttribute('aria-label');
    const LABEL_PLATED =
      'The same tandoor, now out of focus behind a white plate in the ' +
      'foreground. On it, one whole tandoori chicken rests on a bed of raw ' +
      'onion rings with a swipe of green mint chutney, a lemon wedge, ' +
      'coriander leaves and a scattering of chaat masala. It is still ' +
      'steaming. One rod in the cabinet behind now has a gap where this ' +
      'bird was.';

    /* Deliberately NOT a heat control. The fridge closes a door and
       the eggs turn a hob off; a third on/off switch in the same
       set would read as a tic. */
    take.addEventListener('click', () => {
      const taken = scene.classList.toggle('is-taken');

      take.setAttribute('aria-pressed', String(taken));
      label.textContent = taken ? 'Put it back' : 'Take one out';
      scene.setAttribute('aria-label', taken ? LABEL_PLATED : LABEL_COOKING);

      /* The smoke resettles around the gap either way — a bird
         coming off the rod changes what the fire is doing. */
      driftTheSmoke();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
