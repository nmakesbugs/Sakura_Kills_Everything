/* =============================================================
   Sakura Kills Everything — Incident Card renderer
   Reusable pattern for rendering an incident object as an absurd
   official record. Used by Duck Hunt's run summary and the Canon
   Archive. Pure DOM, no framework.

   Depends on: src/ui/components.css for styling, and optionally
   window.SakuraData for zone/creature name lookups.
   No bundler. Attaches to window.SakuraUI (classic script).
   ============================================================= */
(function (global) {
  'use strict';

  var BADGE_LABEL = {
    confirmedCatch: 'Confirmed Kill (Mythic)',
    featherEvent: 'Feather Event',
    escape: 'Escaped',
    squirrelEscape: 'Squirrel Escaped',
    falseAlarm: 'False Alarm',
    vorgNonConfirmation: 'Unconfirmed',
    patrolSuccess: 'Success'
  };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function zoneLabel(inc) {
    if (inc.zoneName) return inc.zoneName;
    if (inc.zone && global.SakuraData) { var z = global.SakuraData.zoneById(inc.zone); if (z) return z.name; }
    return inc.zone || '—';
  }
  function creatureLabel(inc) {
    if (inc.creatureName) return inc.creatureName;
    if (inc.creatures && inc.creatures.length && global.SakuraData) {
      var c = global.SakuraData.creatureById(inc.creatures[0]);
      if (c) return c.name;
    }
    return (inc.creatures && inc.creatures[0]) || '—';
  }

  /** renderIncidentCard(incident) -> HTMLElement */
  function renderIncidentCard(inc) {
    var card = el('article', 'incident-card');
    card.setAttribute('data-outcome', inc.outcomeType || 'escape');

    var head = el('div', 'ic-head');
    var badge = el('span', 'ic-badge', BADGE_LABEL[inc.outcomeType] || 'Logged');
    badge.setAttribute('data-outcome', inc.outcomeType || 'escape');
    head.appendChild(badge);
    head.appendChild(el('h3', 'ic-title', inc.title || 'Incident'));
    card.appendChild(head);

    var meta = el('div', 'ic-meta');
    meta.textContent = [zoneLabel(inc), creatureLabel(inc), inc.dateClassification || '']
      .filter(Boolean).join('  ·  ');
    card.appendChild(meta);

    var official = el('div', 'ic-layer ic-official');
    official.appendChild(el('span', 'ic-label', 'Official interpretation'));
    official.appendChild(el('p', null, inc.officialInterpretation || ''));
    card.appendChild(official);

    var reality = el('div', 'ic-layer ic-reality');
    reality.appendChild(el('span', 'ic-label', 'Likely reality'));
    reality.appendChild(el('p', null, inc.likelyReality || ''));
    card.appendChild(reality);

    var footBits = [];
    if (inc.witnesses && inc.witnesses.length) footBits.push('Witness: ' + inc.witnesses.join(', '));
    if (inc.canonStatus) footBits.push('Canon: ' + inc.canonStatus);
    if (footBits.length) card.appendChild(el('div', 'ic-foot', footBits.join('  ·  ')));

    return card;
  }

  /** renderInto(container, incidents) — clears and renders a list. */
  function renderInto(container, incidents) {
    if (!container) return;
    container.innerHTML = '';
    (incidents || []).forEach(function (inc) {
      container.appendChild(renderIncidentCard(inc));
    });
  }

  // ---- Compact row (for browsable lists / the Permanent Record) ----------
  /**
   * renderIncidentRow(incident, onOpen?) -> HTMLElement
   * A condensed, tappable summary. Defaults to opening the detail modal.
   */
  function renderIncidentRow(inc, onOpen) {
    var row = document.createElement('button');
    row.className = 'incident-row';
    row.setAttribute('data-outcome', inc.outcomeType || 'escape');
    row.type = 'button';

    var badge = el('span', 'ic-badge', BADGE_LABEL[inc.outcomeType] || 'Logged');
    badge.setAttribute('data-outcome', inc.outcomeType || 'escape');

    var main = el('span', 'ir-main');
    main.appendChild(el('span', 'ir-title', inc.title || 'Incident'));
    var meta = [zoneLabel(inc), inc.sourceMode ? sourceLabel(inc.sourceMode) : null]
      .filter(Boolean).join('  ·  ');
    main.appendChild(el('span', 'ir-meta', meta));

    row.appendChild(badge);
    row.appendChild(main);
    row.appendChild(el('span', 'ir-open', 'Open ›'));

    row.addEventListener('click', function () {
      if (typeof onOpen === 'function') onOpen(inc); else openIncidentDetail(inc);
    });
    return row;
  }

  function sourceLabel(src) {
    if (src === 'duck-hunt') return 'Duck Hunt';
    if (src === 'patrol') return 'Patrol';
    return src.charAt(0).toUpperCase() + src.slice(1);
  }

  function renderRowsInto(container, incidents, onOpen) {
    if (!container) return;
    container.innerHTML = '';
    (incidents || []).forEach(function (inc) { container.appendChild(renderIncidentRow(inc, onOpen)); });
  }

  // ---- Detail modal (official paperwork) ---------------------------------
  function detailLine(label, value) {
    if (!value) return null;
    var wrap = el('div', 'idt-field');
    wrap.appendChild(el('span', 'idt-key', label));
    wrap.appendChild(el('span', 'idt-val', value));
    return wrap;
  }

  function formatSavedAt(iso) {
    if (!iso) return null;
    // Keep it simple + dependency-free: trim the ISO string to a readable stamp.
    return String(iso).replace('T', ' ').replace(/\..*$/, '') + ' (filed)';
  }

  function openIncidentDetail(inc) {
    closeIncidentDetail();
    var overlay = el('div', 'ic-modal');
    overlay.id = 'ic-modal';

    var sheet = el('div', 'ic-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-label', 'Field report');

    var head = el('div', 'idt-head');
    var badge = el('span', 'ic-badge', BADGE_LABEL[inc.outcomeType] || 'Logged');
    badge.setAttribute('data-outcome', inc.outcomeType || 'escape');
    head.appendChild(badge);
    head.appendChild(el('h3', 'idt-title', inc.title || 'Field Report'));
    sheet.appendChild(head);

    sheet.appendChild(el('p', 'idt-stamp', 'Open Field Report · Filed into the Permanent Record'));

    var facts = el('div', 'idt-facts');
    [
      detailLine('Source', inc.sourceMode ? sourceLabel(inc.sourceMode) : null),
      detailLine('Zone', zoneLabel(inc)),
      detailLine('Creature', creatureLabel(inc)),
      detailLine('Outcome', BADGE_LABEL[inc.outcomeType] || inc.outcomeType),
      detailLine('Canon status', inc.canonStatus),
      detailLine('Faction', (inc.factions && inc.factions.length) ? inc.factions.join(', ') : null),
      detailLine('Witness', (inc.witnesses && inc.witnesses.length) ? inc.witnesses.join(', ') : null),
      detailLine('Filed', formatSavedAt(inc.savedAt) || inc.dateClassification)
    ].filter(Boolean).forEach(function (f) { facts.appendChild(f); });
    sheet.appendChild(facts);

    var off = el('div', 'idt-layer idt-official');
    off.appendChild(el('span', 'idt-layer-label', 'Official Interpretation'));
    off.appendChild(el('p', null, inc.officialInterpretation || ''));
    sheet.appendChild(off);

    var real = el('div', 'idt-layer idt-reality');
    real.appendChild(el('span', 'idt-layer-label', 'Likely Reality'));
    real.appendChild(el('p', null, inc.likelyReality || ''));
    sheet.appendChild(real);

    var close = el('button', 'ske-btn ske-btn--ghost idt-close', 'Close Report');
    close.type = 'button';
    close.addEventListener('click', closeIncidentDetail);
    sheet.appendChild(close);

    overlay.appendChild(sheet);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeIncidentDetail(); });
    document.body.appendChild(overlay);
    // force reflow then show (for transition)
    void overlay.offsetWidth;
    overlay.classList.add('show');
    return overlay;
  }

  function closeIncidentDetail() {
    var existing = document.getElementById('ic-modal');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  global.SakuraUI = global.SakuraUI || {};
  global.SakuraUI.renderIncidentCard = renderIncidentCard;
  global.SakuraUI.renderInto = renderInto;
  global.SakuraUI.renderIncidentRow = renderIncidentRow;
  global.SakuraUI.renderRowsInto = renderRowsInto;
  global.SakuraUI.openIncidentDetail = openIncidentDetail;
  global.SakuraUI.closeIncidentDetail = closeIncidentDetail;
})(typeof window !== 'undefined' ? window : this);
