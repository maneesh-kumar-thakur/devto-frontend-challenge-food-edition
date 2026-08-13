/* ============================================================
   OPEN LATE — behaviour
   Vanilla, no dependencies, no build step.

   Everything here is an ENHANCEMENT. With scripting off you get
   all sixteen dishes, each badged with the kitchen that cooks it,
   full ingredient lists via <details>, and a booking form that
   the browser validates natively. Nothing below is load-bearing.
   ============================================================ */
(() => {
  'use strict';

  /* ── the four kitchens ──────────────────────────────────── */
  const SERVICES = [
    { id: 'small',     name: 'the Small Hours menu', from: 0,  to: 5  },
    { id: 'sunrise',   name: 'the Sunrise menu',     from: 5,  to: 11 },
    { id: 'afternoon', name: 'the Afternoon menu',   from: 11, to: 17 },
    { id: 'evening',   name: 'the Evening menu',     from: 17, to: 24 },
  ];

  const serviceForHour = (h) =>
    SERVICES.find((s) => h >= s.from && h < s.to) ?? SERVICES[0];

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ═══ 1. theme ═══════════════════════════════════════════
     Night by default — the diner is nocturnal. A stored choice
     always wins; otherwise we follow the operating system. */
  const themeBtn   = $('#theme-toggle');
  const themeLabel = $('#theme-toggle-label');
  const STORE_KEY  = 'open-late:theme';

  /* localStorage throws outright in some privacy modes, so every
     access is guarded rather than assumed. */
  const readStore = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const writeStore = (k, v) => { try { localStorage.setItem(k, v); } catch { /* fine */ } };

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeLabel.textContent =
      theme === 'night' ? 'Switch to day shift' : 'Switch to night shift';
  }

  const stored = readStore(STORE_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(stored ?? (prefersLight ? 'day' : 'night'));

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    applyTheme(next);
    writeStore(STORE_KEY, next);
  });

  /* ═══ 2. the clock ═══════════════════════════════════════ */
  const pillText   = $('#open-pill-text');
  const heroService = $('#hero-service');
  const hourRows   = $$('.hours-table tbody tr');

  let currentService = null;

  function tick() {
    const now     = new Date();
    const service = serviceForHour(now.getHours());
    const time    = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    pillText.textContent = `Open now · ${time}`;
    heroService.textContent = service.name;

    for (const row of hourRows) {
      if (row.dataset.service === service.id) row.setAttribute('aria-current', 'true');
      else row.removeAttribute('aria-current');
    }

    // Only re-filter when the kitchen actually changes over, and only
    // while the user is still on "whatever's cooking now".
    const changed = currentService !== service.id;
    currentService = service.id;
    return changed;
  }

  tick();

  // Roll the menu over with the kitchen — but only for someone who
  // hasn't taken manual control of the service picker.
  setInterval(() => {
    if (tick() && followingClock) selectService(currentService);
  }, 30_000);

  /* ═══ 3. filtering ═══════════════════════════════════════ */
  const filters   = $('#filters');
  const results   = $('#results');
  const clearBtn  = $('#clear-filters');
  const noResults = $('#no-results');
  const search    = $('#dish-search');

  let followingClock = true;

  // The controls only exist for people who can actually use them.
  filters.hidden = false;

  /* Index the dishes once. Searching re-runs on every keystroke, and
     re-splitting strings and re-reading textContent 16 times per press
     is work we can do a single time at startup instead. */
  const dishes = $$('.dish').map((el) => ({
    el,
    service: el.dataset.service,
    diets: new Set(el.dataset.diet.split(' ').filter(Boolean)),
    text: `${el.dataset.search} ${$('.dish__name', el).textContent}`.toLowerCase(),
  }));

  function selectService(id) {
    const radio = $(`input[name="service"][value="${id}"]`);
    if (radio) radio.checked = true;
    apply();
  }

  const dietBoxes = $$('.filters input[type="checkbox"][data-diet]');

  function activeDiets() {
    return dietBoxes.filter((box) => box.checked).map((box) => box.dataset.diet);
  }

  function apply() {
    const service = $('input[name="service"]:checked')?.value ?? 'all';
    const diets   = activeDiets();
    const q       = search.value.trim().toLowerCase();

    let shown = 0;

    for (const dish of dishes) {
      const match =
        (service === 'all' || dish.service === service) &&
        diets.every((d) => dish.diets.has(d)) &&
        (!q || dish.text.includes(q));

      dish.el.hidden = !match;
      if (match) shown++;
    }

    noResults.hidden = shown > 0;

    /* "Clear filters" only exists when there is something to clear.
       A permanently-present button that usually does nothing teaches
       people to ignore it. */
    const narrowed = diets.length > 0 || q.length > 0 || !followingClock;
    clearBtn.hidden = !narrowed;

    // Spoken by the <output> region — the whole point of filtering is
    // knowing how much you have left.
    const label = SERVICES.find((s) => s.id === service);
    const scope = label ? ` on ${label.name.replace('the ', '')}` : '';
    const noun  = shown === 1 ? 'dish' : 'dishes';

    results.textContent = shown === 0
      ? 'No dishes match those filters.'
      : `Showing ${shown} ${noun}${scope}.`;
  }

  // Service radios. Choosing one by hand stops the clock driving it.
  for (const radio of $$('input[name="service"]')) {
    radio.addEventListener('change', () => {
      followingClock = false;
      apply();
    });
  }

  // Dietary checkboxes. The checkbox IS the state — nothing is mirrored
  // into a variable that could drift from what a screen reader announces.
  for (const box of dietBoxes) box.addEventListener('change', apply);

  // Debounced so the status region isn't re-announced per keystroke.
  let searchTimer;
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(apply, 250);
  });

  function clearAll() {
    for (const box of dietBoxes) box.checked = false;
    search.value = '';
    followingClock = true;
    selectService(currentService);
  }

  clearBtn.addEventListener('click', () => {
    clearAll();
    // focus would be left on a button that just removed itself
    $('input[name="service"]:checked')?.focus();
  });
  $('#reset-from-empty').addEventListener('click', () => {
    clearAll();
    search.focus();
  });

  // Open on whatever the kitchen is actually cooking.
  selectService(currentService);

  /* ═══ 4. booking form ════════════════════════════════════
     novalidate is set in the markup so the messaging is ours:
     native bubbles disappear on blur and can't be styled or
     reliably announced. */
  const form    = $('#book-form');
  const summary = $('#form-summary');
  const confirm = $('#confirm');

  const RULES = {
    name:  (v) => (v.trim() ? '' : 'Please tell us a name for the booking.'),
    /* Deliberately not a regex. Every "correct" email pattern is either
       wrong or catastrophically backtrackable, and the only real check
       is whether the confirmation arrives. This rejects the obvious
       typos in linear time and lets the rest through. */
    email: (v) => {
      const value = v.trim();
      if (!value) return 'We need an email to confirm the booth.';
      const at  = value.indexOf('@');
      const dot = value.lastIndexOf('.');
      const ok  = at > 0 && dot > at + 1 && dot < value.length - 1
                  && !/\s/.test(value) && !value.includes('@', at + 1);
      return ok ? '' : 'That address is missing something — check for a typo.';
    },
    when:  (v) => (v ? '' : 'Pick a time. Any time — we are open all of them.'),
  };

  function setFieldError(field, message) {
    const msg = $(`#${field.id}-error`);
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      msg.textContent = message;
      msg.hidden = false;
    } else {
      field.removeAttribute('aria-invalid');
      msg.textContent = '';
      msg.hidden = true;
    }
  }

  // Only re-validate a field once it has already been marked wrong —
  // nobody wants an error the first time they tab out of an empty box.
  for (const id of Object.keys(RULES)) {
    const field = $(`#${id}`);
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        setFieldError(field, RULES[id](field.value));
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const bad = [];
    for (const [id, rule] of Object.entries(RULES)) {
      const field = $(`#${id}`);
      const message = rule(field.value);
      setFieldError(field, message);
      if (message) bad.push(field);
    }

    if (bad.length) {
      summary.textContent = bad.length === 1
        ? 'One thing needs fixing before we can hold the booth.'
        : `${bad.length} things need fixing before we can hold the booth.`;
      summary.hidden = false;
      summary.focus();          // role="alert" + focus: heard and reachable
      return;
    }

    summary.hidden = true;

    const name  = $('#name').value.trim();
    const when  = $('#when').value;
    const party = $('#party').selectedOptions[0].textContent.toLowerCase();
    const [h]   = when.split(':').map(Number);

    $('#confirm-body').textContent =
      `${name}, we'll have a booth for ${party} at ${when}. ` +
      `That lands on ${serviceForHour(h).name.replace('the ', '')}, so expect ` +
      `something suited to the hour.`;

    // Native <dialog> gives the focus trap, Esc-to-close, and
    // focus restoration for free. No library required.
    if (typeof confirm.showModal === 'function') confirm.showModal();
    form.reset();
  });
})();
