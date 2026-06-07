/* =============================================================
   Duck Hunt — Stage 0.4.1 rescue rebuild
   A clean target range. One target breaks cover at a time; tap it to
   send Sakura. Feedback is symbolic (a "Sakura Strike" paw + an outcome
   ring) — NO photo in gameplay (see docs/assets/sakura-runtime-visual-policy.md).

   Preserves: incident output, storage filing, the test seam, canon
   (squirrels never caught, vorg never confirmed).

   Depends (loaded first): SakuraData, SakuraRandom, SakuraVoice,
   SakuraIncident, SakuraUI, SakuraStorage.
   ============================================================= */
(function () {
  'use strict';

  var R = window.SakuraRandom;
  var Incident = window.SakuraIncident;
  var Voice = window.SakuraVoice;
  var UI = window.SakuraUI;

  var CONFIG = {
    budget: 14,        // targets per run
    lifeMin: 1300,     // ms a target stays before escaping
    lifeMax: 1700,
    gapMin: 420,       // ms between targets
    gapMax: 640
  };

  var KINDS = {
    bird:       { weight: 0.30, glyphs: ['🐦', '🐤'], creatures: ['captain-flit', 'the-robin', 'sparrow-squadron'], zones: ['great-patio', 'open-field', 'tree-line'] },
    squirrel:   { weight: 0.30, glyphs: ['🐿️'],       creatures: ['the-squirrel', 'acorn', 'corner-sentry'],       zones: ['fence-line', 'open-field', 'drop-zone'] },
    rabbit:     { weight: 0.18, glyphs: ['🐰', '🐇'], creatures: ['general-thistle', 'the-twitch', 'duchess-clover'], zones: ['garden-frontier'] },
    falseAlarm: { weight: 0.14, glyphs: ['🍃', '🌿', '🛍️'], creatures: [null], zones: ['great-patio', 'open-field', 'garden-frontier'] },
    vorg:       { weight: 0.08, glyphs: ['❓', '👁️'], creatures: ['the-vorg'], zones: ['unknown-regions', 'dusk-vigil-point'] }
  };
  var KIND_WEIGHTS = Object.keys(KINDS).map(function (k) { return { value: k, weight: KINDS[k].weight }; });

  var state = {
    phase: 'idle',
    runId: null,
    spawned: 0,
    budget: CONFIG.budget,
    incidents: [],
    score: 0,
    counts: { confirmedCatches: 0, featherEvents: 0, escapes: 0, squirrelFailures: 0, falseAlarms: 0, vorgEvidence: 0 },
    runZoneName: null,
    summary: null
  };

  var dom = {};
  var current = null;       // { id, el, kind, creatureId, zoneId, lifeTimer, resolved }
  var spawnTimer = null;
  var seq = 0;
  var incidentsRendered = false;

  function rint(a, b) { return R ? R.int(a, b) : Math.floor(Math.random() * (b - a + 1)) + a; }
  function rpick(a) { return R ? R.pick(a) : a[Math.floor(Math.random() * a.length)]; }
  function setStatus(s) { if (dom.status && s) dom.status.textContent = s; }

  function syncHud() {
    if (dom.score) dom.score.textContent = state.score;
    if (dom.targets) dom.targets.textContent = state.spawned + '/' + state.budget;
    if (dom.catches) dom.catches.textContent = state.counts.confirmedCatches + state.counts.featherEvents;
  }

  // ---- Incident registration ----
  function registerIncident(inc) {
    state.incidents.push(inc);
    state.score += inc.points || 0;
    switch (inc.outcomeType) {
      case 'confirmedCatch': state.counts.confirmedCatches++; break;
      case 'featherEvent': state.counts.featherEvents++; break;
      case 'squirrelEscape': state.counts.squirrelFailures++; break;
      case 'falseAlarm': state.counts.falseAlarms++; break;
      case 'vorgNonConfirmation': state.counts.vorgEvidence++; break;
      case 'escape': state.counts.escapes++; break;
    }
    syncHud();
    return inc;
  }
  function makeIncident(kind, didHit, creatureId, zoneId) {
    return Incident.createIncident({ kind: kind, didHit: didHit, creatureId: creatureId, zoneId: zoneId, runId: state.runId });
  }
  function shouldLog(kind, didHit) {
    if (kind === 'falseAlarm' || kind === 'vorg') return didHit;
    return true;
  }

  // ---- Run lifecycle ----
  function startRun() {
    clearField();
    state.phase = 'playing';
    state.runId = R ? R.id('run') : 'run' + Date.now();
    state.spawned = 0;
    state.incidents = [];
    state.score = 0;
    state.counts = { confirmedCatches: 0, featherEvents: 0, escapes: 0, squirrelFailures: 0, falseAlarms: 0, vorgEvidence: 0 };
    var z = window.SakuraData && window.SakuraData.zoneById(rpick(['open-field', 'great-patio', 'fence-line']));
    state.runZoneName = z ? z.name : 'the backyard';
    state.summary = null;
    incidentsRendered = false;

    if (dom.panelStart) dom.panelStart.hidden = true;
    if (dom.panelSummary) dom.panelSummary.hidden = true;
    syncHud();
    setStatus(Voice ? Voice.getLine('runStart') : 'Operation begins.');
    scheduleNext(420);
  }

  function scheduleNext(delay) {
    if (state.phase !== 'playing') return;
    if (spawnTimer) clearTimeout(spawnTimer);
    spawnTimer = setTimeout(function () {
      spawnTimer = null;
      if (state.phase !== 'playing') return;
      if (state.spawned < state.budget) spawnTarget();
      else maybeEnd();
    }, delay == null ? rint(CONFIG.gapMin, CONFIG.gapMax) : delay);
  }

  function spawnTarget(kindOverride) {
    // Enforce one target at a time: clear any lingering target first.
    if (current) {
      if (current.lifeTimer) clearTimeout(current.lifeTimer);
      if (current.el && current.el.parentNode) current.el.parentNode.removeChild(current.el);
      current = null;
    }
    var kind = kindOverride || (R ? R.weighted(KIND_WEIGHTS) : 'squirrel');
    var def = KINDS[kind];
    var id = 'tg' + (++seq);
    var el = document.createElement('button');
    el.className = 'target';
    el.type = 'button';
    el.setAttribute('data-kind', kind);
    el.setAttribute('data-target-id', id);
    el.setAttribute('aria-label', kind);
    el.textContent = rpick(def.glyphs);
    el.style.left = rint(20, 80) + '%';
    el.style.top = rint(18, 66) + '%';
    el.addEventListener('pointerdown', function (e) { e.preventDefault(); resolve(id, true); });
    if (dom.field) dom.field.appendChild(el);

    var lifeTimer = setTimeout(function () { resolve(id, false); }, rint(CONFIG.lifeMin, CONFIG.lifeMax));
    current = { id: id, el: el, kind: kind, creatureId: rpick(def.creatures), zoneId: rpick(def.zones), lifeTimer: lifeTimer, resolved: false };
    state.spawned++;
    syncHud();
    return id;
  }

  function resolve(id, didHit) {
    if (!current || current.id !== id || current.resolved) return null;
    var t = current;
    t.resolved = true;
    if (t.lifeTimer) clearTimeout(t.lifeTimer);

    var x = 0, y = 0;
    if (t.el) {
      x = t.el.offsetLeft;
      y = t.el.offsetTop;
      t.el.classList.add('leaving');
      (function (node) { setTimeout(function () { if (node && node.parentNode) node.parentNode.removeChild(node); }, 200); })(t.el);
    }
    current = null;

    var inc = null;
    if (shouldLog(t.kind, didHit)) {
      inc = makeIncident(t.kind, didHit, t.creatureId, t.zoneId);
      registerIncident(inc);
      setStatus(Voice ? Voice.formatIncidentLine(inc) : '');
      playFx(inc, didHit, x, y);
    } else {
      setStatus(t.kind === 'vorg'
        ? (Voice ? Voice.getLine('vorgAlert') : 'Something was there.')
        : (Voice ? Voice.getLine('falseAlarm') : 'It was nothing.'));
      if (didHit) { strike(x, y); ring(x, y, ''); }
    }

    if (state.spawned < state.budget) scheduleNext();
    else maybeEnd();
    return inc;
  }

  function maybeEnd() {
    if (state.phase !== 'playing') return;
    if (state.spawned >= state.budget && !current) endRun();
  }

  // ---- Feedback FX (symbolic, restrained) ----
  function fxNode(cls, glyph, x, y) {
    if (!dom.field) return null;
    var n = document.createElement('span');
    n.className = 'fx ' + cls;
    if (glyph != null) n.textContent = glyph;
    n.style.left = x + 'px';
    n.style.top = y + 'px';
    dom.field.appendChild(n);
    return n;
  }
  function removeLater(node, ms) { if (node) setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, ms); }
  function strike(x, y) { removeLater(fxNode('strike', '🐾', x, y), 450); }
  function ring(x, y, tone) { var n = fxNode('ring-fx', null, x, y); if (n && tone) n.setAttribute('data-tone', tone); removeLater(n, 520); }
  function streak(x, y) { removeLater(fxNode('streak', '💨', x, y), 520); }
  function feathers(x, y) {
    for (var i = 0; i < 5; i++) {
      var p = fxNode('particle', i % 2 ? '🪶' : '✨', x, y);
      if (!p) continue;
      p.style.setProperty('--dx', rint(-44, 44) + 'px');
      p.style.setProperty('--dy', rint(-54, -12) + 'px');
      p.style.animation = 'burst 0.6s ease-out forwards';
      removeLater(p, 650);
    }
  }
  function dust(x, y) {
    for (var i = 0; i < 3; i++) {
      var p = fxNode('particle', '·', x, y);
      if (!p) continue;
      p.style.setProperty('--dx', rint(-26, 26) + 'px');
      p.style.setProperty('--dy', rint(-22, -4) + 'px');
      p.style.animation = 'burst 0.5s ease-out forwards';
      removeLater(p, 550);
    }
  }
  function playFx(inc, didHit, x, y) {
    switch (inc.outcomeType) {
      case 'confirmedCatch': strike(x, y); ring(x, y, 'gold'); feathers(x, y); break;
      case 'featherEvent': strike(x, y); ring(x, y, ''); feathers(x, y); break;
      case 'squirrelEscape': if (didHit) strike(x, y); ring(x, y, 'warn'); streak(x, y); break;
      case 'escape': ring(x, y, ''); dust(x, y); break;
      case 'falseAlarm': if (didHit) strike(x, y); ring(x, y, 'blue'); break;
      case 'vorgNonConfirmation': ring(x, y, 'vorg'); break;
      default: dust(x, y);
    }
  }

  // ---- After-action report (summary-first, incidents collapsed) ----
  function endRun() {
    if (state.phase === 'summary') return;
    state.phase = 'summary';
    if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
    clearField();
    var summary = Incident.summarizeRun(state.incidents, { zoneName: state.runZoneName, runId: state.runId });
    state.summary = summary;
    renderSummary(summary);
    setStatus(Voice ? Voice.getLine('runEnd') : 'Operation complete.');
  }

  function renderSummary(summary) {
    if (dom.summaryRank) dom.summaryRank.textContent = 'Prestige ' + summary.prestige + ' · ' + summary.prestigeRank;
    if (dom.summaryTitle) dom.summaryTitle.textContent = summary.runTitle;
    if (dom.summaryOfficial) dom.summaryOfficial.textContent = summary.officialInterpretation;
    if (dom.summaryReality) dom.summaryReality.textContent = summary.likelyReality;

    if (dom.scoreboard) {
      var chips = [
        ['Confirmed', summary.confirmedCatches],
        ['Got away', summary.escapes],
        ['Squirrel fails', summary.squirrelFailures]
      ];
      dom.scoreboard.innerHTML = '';
      chips.forEach(function (c) {
        var d = document.createElement('div');
        d.className = 'chip';
        d.innerHTML = '<span class="n">' + c[1] + '</span><span class="k">' + c[0] + '</span>';
        dom.scoreboard.appendChild(d);
      });
    }

    // Incidents collapsed by default — no paperwork wall.
    incidentsRendered = false;
    if (dom.incidents) { dom.incidents.hidden = true; dom.incidents.innerHTML = ''; }
    if (dom.btnIncidents) dom.btnIncidents.textContent = 'View ' + summary.total + ' incident' + (summary.total === 1 ? '' : 's') + ' ▾';

    if (dom.btnFile) { dom.btnFile.disabled = false; dom.btnFile.textContent = 'File Official Report'; dom.btnFile.classList.remove('ske-btn--ghost'); }
    if (dom.fileConfirm) { dom.fileConfirm.hidden = true; dom.fileConfirm.textContent = ''; }
    if (dom.panelSummary) dom.panelSummary.hidden = false;
  }

  function toggleIncidents() {
    if (!dom.incidents) return;
    var show = dom.incidents.hidden;
    if (show && !incidentsRendered && state.summary && UI) {
      UI.renderRowsInto(dom.incidents, state.summary.incidents);
      incidentsRendered = true;
    }
    dom.incidents.hidden = !show;
    if (dom.btnIncidents && state.summary) {
      dom.btnIncidents.textContent = (show ? 'Hide incidents ▴' : 'View ' + state.summary.total + ' incident' + (state.summary.total === 1 ? '' : 's') + ' ▾');
    }
  }

  var FILE_LINES = ['Report entered into the permanent record.', 'The archive has accepted Sakura’s version of events.', 'Likely reality appended under protest.'];
  function fileReport() {
    if (!state.summary || !window.SakuraStorage) return;
    if (dom.btnFile && dom.btnFile.disabled) return;
    window.SakuraStorage.saveIncidents(state.summary.incidents, { sourceMode: 'duck-hunt', runTitle: state.summary.runTitle });
    if (dom.btnFile) { dom.btnFile.disabled = true; dom.btnFile.textContent = 'Report Filed ✓'; dom.btnFile.classList.add('ske-btn--ghost'); }
    if (dom.fileConfirm) { dom.fileConfirm.textContent = rpick(FILE_LINES); dom.fileConfirm.hidden = false; }
  }

  function clearField() {
    if (dom.field) {
      var nodes = dom.field.querySelectorAll('.target, .fx');
      for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
    }
    if (current && current.lifeTimer) clearTimeout(current.lifeTimer);
    current = null;
  }

  // ---- Boot ----
  function init() {
    dom.field = document.getElementById('field');
    dom.stage = document.getElementById('stage');
    dom.status = document.getElementById('status');
    dom.score = document.getElementById('hud-score');
    dom.targets = document.getElementById('hud-targets');
    dom.catches = document.getElementById('hud-catches');
    dom.panelStart = document.getElementById('panel-start');
    dom.panelSummary = document.getElementById('panel-summary');
    dom.summaryRank = document.getElementById('summary-rank');
    dom.summaryTitle = document.getElementById('summary-title');
    dom.summaryOfficial = document.getElementById('summary-official');
    dom.summaryReality = document.getElementById('summary-reality');
    dom.scoreboard = document.getElementById('summary-scoreboard');
    dom.incidents = document.getElementById('summary-incidents');
    dom.btnIncidents = document.getElementById('btn-incidents');
    dom.btnFile = document.getElementById('btn-file');
    dom.fileConfirm = document.getElementById('file-confirm');

    var startBtn = document.getElementById('btn-start');
    var againBtn = document.getElementById('btn-again');
    if (startBtn) startBtn.addEventListener('click', startRun);
    if (againBtn) againBtn.addEventListener('click', startRun);
    if (dom.btnFile) dom.btnFile.addEventListener('click', fileReport);
    if (dom.btnIncidents) dom.btnIncidents.addEventListener('click', toggleIncidents);

    syncHud();
    if (dom.targets) dom.targets.textContent = '0/' + state.budget;

    window.__duckHunt = {
      state: state,
      config: CONFIG,
      KINDS: KINDS,
      startRun: startRun,
      endRun: endRun,
      fileReport: fileReport,
      spawn: function (kind) { return spawnTarget(kind); },
      resolve: resolve,
      simulate: function (kind, didHit) {
        var def = KINDS[kind] || KINDS.squirrel;
        return registerIncident(makeIncident(kind, didHit, rpick(def.creatures), rpick(def.zones)));
      },
      getSummary: function () { return state.summary; }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
