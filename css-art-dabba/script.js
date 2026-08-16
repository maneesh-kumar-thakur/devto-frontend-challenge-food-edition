/* ============================================================
   THE DABBA — the "sprinkle of JavaScript"

   Two jobs, both optional. The picture is finished CSS without
   this file: the steam has hand-authored nth-child fallbacks and
   the dabba sits open with its lid against the base. Delete the
   JS pane and you still get the art — you just lose the button.

   1. Drift the steam, so no two wisps ever line up twice.
   2. Pack it up, and open it again.

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
    const pack  = document.getElementById('pack');
    const label = document.getElementById('pack-label');
    if (!scene || !pack || !label) return;

    const wisps = [...scene.querySelectorAll('.steam i')];

    /* Steam is the one thing here that should never repeat. Every
       negative delay starts its wisp already mid-rise, so the
       column is alive on the first frame rather than filling up
       to it. */
    function driftTheSteam() {
      for (const w of wisps) {
        w.style.setProperty('--x',     `${rand(-11, 11).toFixed(1)}cqw`);
        w.style.setProperty('--w',     `${rand(2.5, 4.4).toFixed(2)}cqw`);
        w.style.setProperty('--d',     `${rand(6, 9).toFixed(1)}s`);
        w.style.setProperty('--delay', `-${rand(0, 9).toFixed(1)}s`);
        w.style.setProperty('--drift', `${rand(-6, 6).toFixed(1)}cqw`);
      }
    }

    driftTheSteam();

    /* Packing up genuinely changes what the picture shows — an
       open dabba with food in it becomes a closed steel tin — so
       the description has to change with it. This is the only
       part of this file that is not decoration. */
    const LABEL_OPEN = scene.getAttribute('aria-label');
    const LABEL_SHUT =
      'The same tiffin carrier, now packed. All three loose boxes have gone ' +
      'back into the frame and are stacked four high above the sabzi box, ' +
      'the lid is seated on top, and the wire clamp has slid down the posts ' +
      'to hold it all together, ready to be carried. No steam, and none of ' +
      'the food is visible any more.';

    pack.addEventListener('click', () => {
      const packed = scene.classList.toggle('is-packed');

      pack.setAttribute('aria-pressed', String(packed));
      label.textContent = packed ? 'Open it' : 'Pack it up';
      scene.setAttribute('aria-label', packed ? LABEL_SHUT : LABEL_OPEN);

      /* Opening it again should not replay the same steam. */
      if (!packed) driftTheSteam();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
