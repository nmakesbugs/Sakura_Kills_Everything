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

  global.SakuraUI = global.SakuraUI || {};
  global.SakuraUI.renderIncidentCard = renderIncidentCard;
  global.SakuraUI.renderInto = renderInto;
})(typeof window !== 'undefined' ? window : this);
