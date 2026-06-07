/* =============================================================
   Patrol — Stage 0.3 prototype
   Surveillance, not reaction. Proves the incident platform works
   outside Duck Hunt. Pick a sector; Sakura sweeps it encounter by
   encounter; each encounter resolves through the SHARED incident
   engine (no separate data model). End the patrol → after-action
   report → file to the permanent record.

   Depends (loaded before this file):
     SakuraData, SakuraRandom, SakuraVoice, SakuraIncident, SakuraUI,
     SakuraStorage.
   Exposes window.__patrol test seam.
   ============================================================= */
(function () {
  'use strict';

  var R = window.SakuraRandom;
  var Incident = window.SakuraIncident;
  var Voice = window.SakuraVoice;
  var UI = window.SakuraUI;

  var ENCOUNTERS_PER_PATROL = 6;

  // Selectable sectors (zone ids). Ordered to read roughly spatially on the
  // 2x2 map: far frontier + fence up top, garden + patio (near the house) below.
  var PATROL_ZONES = ['unknown-regions', 'fence-line', 'garden-frontier', 'great-patio'];

  // Creature type -> glyph, for the at-a-glance "known activity" row on tiles.
  var TYPE_GLYPH = { dog: '🐕', squirrel: '🐿️', rabbit: '🐇', bird: '🐦', chipmunk: '🐿', insect: '🐛', cat: '🐈', unconfirmed: '👁️' };

  // Per-zone encounter pools (encounter kinds). Collectively these cover
  // every required outcome: squirrel escape, rabbit chase, bird, false alarm,
  // environmental misidentification, vorg non-confirmation, legit victory.
  var ZONE_POOLS = {
    'fence-line':      ['squirrel', 'squirrel', 'bird', 'environmental', 'falseAlarm', 'victory'],
    'garden-frontier': ['rabbit', 'rabbit', 'squirrel', 'environmental', 'victory', 'falseAlarm'],
    'unknown-regions': ['vorg', 'environmental', 'falseAlarm', 'squirrel', 'vorg', 'victory'],
    'great-patio':     ['bird', 'falseAlarm', 'squirrel', 'environmental', 'victory', 'rabbit']
  };

  // Flavor per encounter kind.
  var FLAVOR = {
    squirrel: {
      glyph: '🐿️', creatures: ['the-squirrel', 'acorn', 'corner-sentry'],
      descs: [
        'A squirrel freezes on the line, then pretends it has urgent business elsewhere.',
        'Tail-flick detected. The Directorate is testing your perimeter.',
        'A known infiltrator is mid-crossing. It has not yet seen you. It has seen you.'
      ]
    },
    rabbit: {
      glyph: '🐇', creatures: ['general-thistle', 'the-twitch', 'duchess-clover'],
      descs: [
        'A rabbit holds impossibly still in the bed. It believes it is invisible.',
        'Fresh sign in the cover. Something grazed here, recently and without permission.'
      ]
    },
    bird: {
      glyph: '🐦', creatures: ['captain-flit', 'the-robin', 'sparrow-squadron'],
      descs: [
        'A robin lands just out of reach and regards you with open contempt.',
        'Wings overhead. An airspace violation is in progress.'
      ]
    },
    falseAlarm: {
      glyph: '🍃', creatures: [null],
      descs: [
        'Something rustles in the hedge. It is, statistically, probably nothing.',
        'An object on the ground refuses to identify itself.'
      ]
    },
    environmental: {
      glyph: '🌫️', creatures: [null],
      descs: [
        'A shape near the fence holds position. Hostile, or scenery? Investigate to be sure.',
        'A silhouette has not blinked. It cannot blink. This is noted as suspicious.'
      ]
    },
    vorg: {
      glyph: '👁️', creatures: ['the-vorg'],
      descs: [
        'The far corner is colder than the readings allow. Do not advance.',
        'A presence sits at the edge of the known yard. Sakura’s ears lock forward.'
      ]
    },
    victory: {
      glyph: '🦴', creatures: ['sakura'],
      descs: [
        'The sector is quiet and correct. A clean perimeter — a small, real win.',
        'A long-lost toy surfaces in the grass. Somehow, the most important moment of the patrol.'
      ]
    }
  };

  // ---- State ----
  var state = {
    phase: 'idle',          // idle | patrolling | summary
    runId: null,
    zoneId: null,
    zoneName: null,
    plan: [],               // array of encounter kinds
    index: 0,
    incidents: [],
    score: 0,
    current: null,          // current encounter { kind, creatureId, desc }
    summary: null
  };

  var dom = {};

  function rpick(a) { return R ? R.pick(a) : a[Math.floor(Math.random() * a.length)]; }

  function setMessage(m) { if (dom.message && m) dom.message.textContent = m; }

  function syncHud() {
    if (dom.hudZone) dom.hudZone.textContent = state.zoneName || '—';
    if (dom.hudProgress) dom.hudProgress.textContent = Math.min(state.index, state.plan.length) + '/' + state.plan.length;
    if (dom.hudPrestige) dom.hudPrestige.textContent = state.score;
  }

  // ---- Zone map / sector select ----
  function creatureGlyphs(zone) {
    if (!zone || !zone.commonCreatures) return '';
    var seen = {}, out = [];
    zone.commonCreatures.forEach(function (cid) {
      var c = window.SakuraData && window.SakuraData.creatureById(cid);
      var t = c ? c.type : null;
      var g = t && TYPE_GLYPH[t];
      if (g && !seen[g]) { seen[g] = 1; out.push(g); }
    });
    return out.join(' ');
  }

  function renderZones() {
    if (!dom.zoneGrid) return;
    var filed = (window.SakuraStorage && window.SakuraStorage.countByZoneId) ? window.SakuraStorage.countByZoneId() : {};
    dom.zoneGrid.innerHTML = '';
    PATROL_ZONES.forEach(function (zid) {
      var z = window.SakuraData && window.SakuraData.zoneById(zid);
      if (!z) return;
      var n = filed[zid] || 0;
      var tile = document.createElement('button');
      tile.className = 'sector-tile';
      tile.setAttribute('data-zone', zid);
      tile.setAttribute('data-d', z.dangerLevel);
      tile.innerHTML =
        '<span class="st-name">' + z.name + '</span>' +
        '<span class="st-sub">' + (z.subtitle || '') + '</span>' +
        '<span class="st-creatures">' + (creatureGlyphs(z) || '—') + '</span>' +
        '<span class="st-foot">' +
          '<span class="st-danger" data-d="' + z.dangerLevel + '">' + z.dangerLevel + '</span>' +
          '<span class="st-filed' + (n ? ' has' : '') + '">Filed: ' + n + '</span>' +
        '</span>';
      tile.addEventListener('click', function () { startPatrol(zid); });
      dom.zoneGrid.appendChild(tile);
    });
  }

  // ---- Patrol lifecycle ----
  function buildPlan(zid) {
    var pool = ZONE_POOLS[zid] || ZONE_POOLS['fence-line'];
    var plan = [];
    for (var i = 0; i < ENCOUNTERS_PER_PATROL; i++) plan.push(rpick(pool));
    return plan;
  }

  function startPatrol(zid) {
    var z = window.SakuraData && window.SakuraData.zoneById(zid);
    state.phase = 'patrolling';
    state.runId = (R ? R.id('patrol') : 'patrol' + Date.now());
    state.zoneId = zid;
    state.zoneName = z ? z.name : 'the backyard';
    state.plan = buildPlan(zid);
    state.index = 0;
    state.incidents = [];
    state.score = 0;
    state.summary = null;

    if (dom.panelStart) dom.panelStart.hidden = true;
    if (dom.panelSummary) dom.panelSummary.hidden = true;
    if (dom.panelPatrol) dom.panelPatrol.hidden = false;

    buildTrail();
    syncHud();
    setMessage(Voice ? Voice.getLine('runStart') : 'Patrol begins.');
    nextEncounter();
  }

  function buildTrail() {
    if (!dom.trail) return;
    // remove old nodes
    var old = dom.trail.querySelectorAll('.node');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
    var n = state.plan.length;
    for (var j = 0; j < n; j++) {
      var node = document.createElement('div');
      node.className = 'node';
      node.style.left = (8 + (84 * (n === 1 ? 0 : j / (n - 1)))) + '%';
      node.setAttribute('data-node', j);
      dom.trail.appendChild(node);
    }
    moveSakura(0);
  }

  function moveSakura(i) {
    if (!dom.trailSakura) return;
    var n = state.plan.length;
    var pct = 8 + (84 * (n <= 1 ? 0 : i / (n - 1)));
    dom.trailSakura.style.left = pct + '%';
    // node states
    var nodes = dom.trail ? dom.trail.querySelectorAll('.node') : [];
    for (var k = 0; k < nodes.length; k++) {
      nodes[k].classList.toggle('done', k < i);
      nodes[k].classList.toggle('current', k === i);
    }
  }

  function nextEncounter() {
    if (state.index >= state.plan.length) { endPatrol(); return; }
    var kind = state.plan[state.index];
    var f = FLAVOR[kind] || FLAVOR.falseAlarm;
    state.current = {
      kind: kind,
      creatureId: rpick(f.creatures),
      desc: rpick(f.descs),
      glyph: f.glyph
    };
    moveSakura(state.index);
    if (dom.trailSakura) { dom.trailSakura.classList.add('trot'); }

    // show encounter, hide resolution
    if (dom.encounter) dom.encounter.hidden = false;
    if (dom.resolution) dom.resolution.hidden = true;
    if (dom.encGlyph) dom.encGlyph.textContent = state.current.glyph;
    if (dom.encZone) dom.encZone.textContent = state.zoneName + ' · Encounter ' + (state.index + 1) + ' of ' + state.plan.length;
    if (dom.encDesc) dom.encDesc.textContent = state.current.desc;
    setMessage(Voice ? Voice.getLine('detection') : 'Contact.');
    syncHud();
  }

  function resolveEncounter(action) {
    if (state.phase !== 'patrolling' || !state.current) return null;
    var enc = state.current;
    if (dom.trailSakura) {
      dom.trailSakura.classList.remove('trot');
      if (action === 'pounce') { dom.trailSakura.classList.add('pounce'); setTimeout(function () { dom.trailSakura.classList.remove('pounce'); }, 320); }
    }

    var outcome = Incident.resolvePatrol(enc.kind, action);
    var inc = Incident.createIncident({
      kind: enc.kind,
      outcome: outcome,
      didHit: action === 'pounce',
      creatureId: enc.creatureId,
      zoneId: state.zoneId,
      runId: state.runId,
      trigger: enc.desc,
      playerAction: action.charAt(0).toUpperCase() + action.slice(1)
    });
    state.incidents.push(inc);
    state.score += inc.points || 0;
    state.current = null;
    state.index++;

    // show resolution card
    if (dom.encounter) dom.encounter.hidden = true;
    if (dom.resolution) dom.resolution.hidden = false;
    if (dom.resolutionCard && UI) {
      dom.resolutionCard.innerHTML = '';
      dom.resolutionCard.appendChild(UI.renderIncidentCard(inc));
    }
    setMessage(Voice ? Voice.formatIncidentLine(inc) : '');
    syncHud();

    // Last encounter? change the continue button label.
    if (dom.btnContinue) {
      dom.btnContinue.textContent = (state.index >= state.plan.length) ? 'End Patrol' : 'Continue Patrol';
    }
    return inc;
  }

  function endPatrol() {
    if (state.phase === 'summary') return;
    state.phase = 'summary';
    var summary = Incident.summarizeRun(state.incidents, { zoneName: state.zoneName, runId: state.runId });
    state.summary = summary;
    if (dom.panelPatrol) dom.panelPatrol.hidden = true;
    renderSummary(summary);
    setMessage(Voice ? Voice.getLine('runEnd') : 'Patrol complete.');
  }

  function renderSummary(summary) {
    if (dom.summaryTitle) dom.summaryTitle.textContent = summary.runTitle;
    if (dom.summaryRank) dom.summaryRank.textContent = 'Prestige ' + summary.prestige + ' · ' + summary.prestigeRank;
    if (dom.summaryOfficial) dom.summaryOfficial.textContent = summary.officialInterpretation;
    if (dom.summaryReality) dom.summaryReality.textContent = summary.likelyReality;
    if (dom.summaryIncidents && UI) UI.renderRowsInto(dom.summaryIncidents, summary.incidents);
    if (dom.btnFile) { dom.btnFile.disabled = false; dom.btnFile.textContent = 'File Official Report'; dom.btnFile.classList.remove('ske-btn--ghost'); }
    if (dom.fileConfirm) { dom.fileConfirm.hidden = true; dom.fileConfirm.textContent = ''; }
    if (dom.panelSummary) dom.panelSummary.hidden = false;
  }

  var FILE_LINES = [
    'Report entered into the permanent record.',
    'The archive has accepted Sakura’s version of events.',
    'Likely reality appended under protest.'
  ];
  function fileReport() {
    if (!state.summary || !window.SakuraStorage) return;
    if (dom.btnFile && dom.btnFile.disabled) return;
    window.SakuraStorage.saveIncidents(state.summary.incidents, { sourceMode: 'patrol', runTitle: state.summary.runTitle });
    if (dom.btnFile) { dom.btnFile.disabled = true; dom.btnFile.textContent = 'Report Filed ✓'; dom.btnFile.classList.add('ske-btn--ghost'); }
    if (dom.fileConfirm) { dom.fileConfirm.textContent = rpick(FILE_LINES); dom.fileConfirm.hidden = false; }
  }

  function resetToZoneSelect() {
    state.phase = 'idle';
    if (dom.panelSummary) dom.panelSummary.hidden = true;
    if (dom.panelPatrol) dom.panelPatrol.hidden = true;
    if (dom.panelStart) dom.panelStart.hidden = false;
    renderZones(); // refresh filed-report counts after a patrol
    setMessage('Select a sector to begin your sweep.');
    syncHud();
  }

  // ---- Boot ----
  function init() {
    dom.zoneGrid = document.getElementById('zone-grid');
    dom.panelStart = document.getElementById('panel-start');
    dom.panelPatrol = document.getElementById('panel-patrol');
    dom.panelSummary = document.getElementById('panel-summary');
    dom.trail = document.getElementById('trail');
    dom.trailSakura = document.getElementById('trail-sakura');
    dom.encounter = document.getElementById('encounter');
    dom.resolution = document.getElementById('resolution');
    dom.resolutionCard = document.getElementById('resolution-card');
    dom.encGlyph = document.getElementById('enc-glyph');
    dom.encZone = document.getElementById('enc-zone');
    dom.encDesc = document.getElementById('enc-desc');
    dom.btnContinue = document.getElementById('btn-continue');
    dom.summaryTitle = document.getElementById('summary-title');
    dom.summaryRank = document.getElementById('summary-rank');
    dom.summaryOfficial = document.getElementById('summary-official');
    dom.summaryReality = document.getElementById('summary-reality');
    dom.summaryIncidents = document.getElementById('summary-incidents');
    dom.btnFile = document.getElementById('btn-file');
    dom.fileConfirm = document.getElementById('file-confirm');
    dom.message = document.getElementById('message');
    dom.hudZone = document.getElementById('hud-zone');
    dom.hudProgress = document.getElementById('hud-progress');
    dom.hudPrestige = document.getElementById('hud-prestige');

    renderZones();

    // action buttons
    var actionBtns = document.querySelectorAll('#encounter .actions [data-action]');
    for (var i = 0; i < actionBtns.length; i++) {
      (function (b) { b.addEventListener('click', function () { resolveEncounter(b.getAttribute('data-action')); }); })(actionBtns[i]);
    }
    if (dom.btnContinue) dom.btnContinue.addEventListener('click', function () {
      if (state.index >= state.plan.length) endPatrol(); else nextEncounter();
    });
    if (dom.btnFile) dom.btnFile.addEventListener('click', fileReport);
    var again = document.getElementById('btn-again');
    if (again) again.addEventListener('click', resetToZoneSelect);

    syncHud();

    // Test seam.
    window.__patrol = {
      state: state,
      zones: PATROL_ZONES,
      startPatrol: startPatrol,
      resolveEncounter: resolveEncounter,
      next: nextEncounter,
      endPatrol: endPatrol,
      fileReport: fileReport,
      getSummary: function () { return state.summary; }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
