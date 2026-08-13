/* ============================================================
   MIDNIGHT FRIDGE RAID — the "sprinkle of JavaScript"

   Two jobs only. The picture is finished CSS without either of
   them: the door's steady state is open, and the dust motes have
   hand-authored nth-child fallbacks. Delete this file and you
   still get the art.

   1. Scatter the dust randomly, so the loop never repeats the
      same way twice.
   2. Let you shut the door again.

   Waits for the DOM and bails quietly if its elements aren't
   there. That isn't ceremony: environments that inject the
   script into <head> — CodePen among them, depending on the
   pen's settings — run it before the markup exists, and an
   unguarded getElementById would throw and take the toggle with
   it. The art is CSS, so a missing script should cost you the
   button and nothing else.
   ============================================================ */
(() => {
  'use strict';

  const rand = (min, max) => min + Math.random() * (max - min);

  function init() {
    const scene  = document.getElementById('scene');
    const toggle = document.getElementById('toggle');
    if (!scene || !toggle) return;

    const label = toggle.querySelector('.toggle__label');
    const motes = [...scene.querySelectorAll('.motes i')];

    /* Scatter the motes through the beam. The beam runs roughly from
       the fridge opening (x≈32) out to the right edge, so anything
       outside that box would just be invisible work. */
    function scatterDust() {
      for (const mote of motes) {
        mote.style.setProperty('--x', `${rand(32, 82).toFixed(1)}cqw`);
        mote.style.setProperty('--y', `${rand(18, 74).toFixed(1)}cqw`);
        mote.style.setProperty('--s', `${rand(0.28, 0.58).toFixed(2)}cqw`);
        mote.style.setProperty('--d', `${rand(9, 20).toFixed(1)}s`);
        mote.style.setProperty('--delay', `-${rand(0, 20).toFixed(1)}s`);
      }
    }

    /* A negative delay above means every mote is already mid-drift on
       the first frame, instead of the whole beam popping in at once. */
    scatterDust();

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-pressed') === 'true';

      scene.classList.toggle('is-closed', isOpen);
      scene.classList.toggle('is-open', !isOpen);

      toggle.setAttribute('aria-pressed', String(!isOpen));
      if (label) label.textContent = isOpen ? 'Open the fridge' : 'Close the fridge';

      // Fresh dust every time the door swings back open.
      if (!isOpen) scatterDust();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
