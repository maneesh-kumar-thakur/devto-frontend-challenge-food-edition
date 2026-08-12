/* ============================================================
   CUTTING CHAI — the "sprinkle of JavaScript"

   Two jobs, both optional. The picture is finished CSS without
   this file: the steam has hand-authored nth-child fallbacks and
   the biscuit sits where it should. Delete the JS pane and you
   still get the art — you just lose the dunk.

   1. Randomise the steam so no two wisps ever line up twice.
   2. Dunk the biscuit.
   ============================================================ */

const scene  = document.getElementById('scene');
const dunk   = document.getElementById('dunk');
const wisps  = [...scene.querySelectorAll('.steam i')];

const rand = (min, max) => min + Math.random() * (max - min);

/* Steam is the one thing in the picture that should never repeat.
   A negative delay starts every wisp already mid-rise, so the
   column is alive on the first frame instead of fading up. */
function stirTheSteam() {
  for (const wisp of wisps) {
    wisp.style.setProperty('--x', `${rand(-5.5, 5.5).toFixed(2)}cqw`);
    wisp.style.setProperty('--w', `${rand(1.9, 3.8).toFixed(2)}cqw`);
    wisp.style.setProperty('--d', `${rand(6, 9.5).toFixed(1)}s`);
    wisp.style.setProperty('--delay', `-${rand(0, 9).toFixed(1)}s`);
    wisp.style.setProperty('--drift', `${rand(-6, 7).toFixed(1)}cqw`);
    wisp.style.setProperty('--twist', `${rand(-13, 14).toFixed(0)}deg`);
  }
}

stirTheSteam();

/* The dunk. Guarded against re-entry so hammering the button
   can't stack animations on top of each other. */
dunk.addEventListener('click', () => {
  if (scene.classList.contains('is-dunking')) return;

  scene.classList.add('is-dunking');
  dunk.disabled = true;

  const biscuit = scene.querySelector('.biscuit');

  const finish = () => {
    scene.classList.remove('is-dunking');
    dunk.disabled = false;
    stirTheSteam();          // the steam settles differently after
  };

  /* animationend is the honest signal, but if the animation never
     runs — reduced motion, or a browser that skips it — the button
     must still come back. */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) setTimeout(finish, 200);
  else biscuit.addEventListener('animationend', finish, { once: true });
});
