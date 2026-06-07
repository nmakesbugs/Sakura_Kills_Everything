/* =============================================================
   Duck Hunt — first playable (Stage 0.2; files reports since 0.3)
   A short, replayable, incident-generating run. Tap targets to launch
   Sakura. Outcomes resolve through the incident engine, producing the
   sacred dual layer (official interpretation vs. likely reality), and
   the run ends with an after-action report.

   Canon enforced: squirrels never confirmed caught, vorg never
   confirmed, birds neutralized via feather-event abstraction.

   Depends (loaded before this file):
     SakuraData (zones/creatures/voiceLines), SakuraRandom,
     SakuraVoice, SakuraIncident, SakuraUI.
   No bundler. Exposes window.__duckHunt test seam.
   ============================================================= */
(function () {
  'use strict';

  var R = window.SakuraRandom;
  var Incident = window.SakuraIncident;
  var Voice = window.SakuraVoice;
  var UI = window.SakuraUI;

  var CONFIG = {
    budget: 16,         // targets per run
    spawnGapMin: 480,   // ms between spawns
    spawnGapMax: 820,
    targetLifeMin: 1700,
    targetLifeMax: 2600,
    maxConcurrent: 3,
    summaryCards: 6     // notable incident cards shown on the report
  };

  // Spawn kinds + their flavor pools.
  var KINDS = {
    bird:       { weight: 0.28, glyphs: ['🐦', '🐤'], creatures: ['captain-flit', 'the-robin', 'sparrow-squadron'], zones: ['great-patio', 'open-field', 'tree-line'] },
    squirrel:   { weight: 0.30, glyphs: ['🐿️'],       creatures: ['the-squirrel', 'acorn', 'corner-sentry'],       zones: ['fence-line', 'open-field', 'drop-zone'] },
    rabbit:     { weight: 0.18, glyphs: ['🐇', '🐰'], creatures: ['general-thistle', 'the-twitch', 'duchess-clover'], zones: ['garden-frontier'] },
    falseAlarm: { weight: 0.16, glyphs: ['🍃', '🛍️', '🌑', '🧦', '🌿'], creatures: [null], zones: ['great-patio', 'open-field', 'garden-frontier'] },
    vorg:       { weight: 0.08, glyphs: ['👁️', '🌑', '❓'], creatures: ['the-vorg'], zones: ['unknown-regions', 'dusk-vigil-point'] }
  };
  var KIND_WEIGHTS = Object.keys(KINDS).map(function (k) { return { value: k, weight: KINDS[k].weight }; });

  // ---- State ----
  var state = {
    phase: 'idle',
    runId: null,
    spawned: 0,
    budget: CONFIG.budget,
    activeCount: 0,
    incidents: [],
    score: 0,
    counts: { confirmedCatches: 0, featherEvents: 0, escapes: 0, squirrelFailures: 0, falseAlarms: 0, vorgEvidence: 0 },
    runZoneName: null,
    summary: null
  };

  var dom = {};
  var spawnTimer = null;
  var targetSeq = 0;
  var liveTargets = {}; // id -> { el, kind, creatureId, zoneId, lifeTimer, resolved }

  // ---- Helpers ----
  function rint(a, b) { return R ? R.int(a, b) : Math.floor(Math.random() * (b - a + 1)) + a; }
  function rpick(arr) { return R ? R.pick(arr) : arr[Math.floor(Math.random() * arr.length)]; }

  function setMessage(msg) { if (dom.message && msg) dom.message.textContent = msg; }

  function syncHud() {
    if (dom.score) dom.score.textContent = state.score;
    if (dom.targets) dom.targets.textContent = state.spawned + '/' + state.budget;
    if (dom.catches) dom.catches.textContent = state.counts.confirmedCatches + state.counts.featherEvents;
  }

  // ---- Incident registration (shared by tap, escape, and test sim) ----
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
    return Incident.createIncident({
      kind: kind, didHit: didHit, creatureId: creatureId, zoneId: zoneId, runId: state.runId
    });
  }

  // Does a resolution of this kind/hit produce a logged incident?
  function shouldLog(kind, didHit) {
    if (kind === 'falseAlarm') return didHit;   // a leaf you ignored is not an incident
    if (kind === 'vorg') return didHit;          // a sign that faded leaves no record
    return true;                                 // birds/rabbits/squirrels always logged
  }

  // ---- Run lifecycle ----
  function startRun() {
    clearField();
    state.phase = 'playing';
    state.runId = (R ? R.id('run') : 'run' + Date.now());
    state.spawned = 0;
    state.activeCount = 0;
    state.incidents = [];
    state.score = 0;
    state.counts = { confirmedCatches: 0, featherEvents: 0, escapes: 0, squirrelFailures: 0, falseAlarms: 0, vorgEvidence: 0 };
    var z = window.SakuraData && window.SakuraData.zoneById(rpick(['open-field', 'great-patio', 'fence-line']));
    state.runZoneName = z ? z.name : 'the backyard';
    state.summary = null;

    if (dom.panelStart) dom.panelStart.hidden = true;
    if (dom.panelSummary) dom.panelSummary.hidden = true;
    syncHud();
    setMessage(Voice ? Voice.getLine('runStart') : 'Operation begins.');
    queueSpawn(420);
  }

  function queueSpawn(delay) {
    if (state.phase !== 'playing') return;
    if (spawnTimer) clearTimeout(spawnTimer);
    spawnTimer = setTimeout(function () {
      spawnTimer = null;
      if (state.phase !== 'playing') return;
      if (state.spawned < state.budget && state.activeCount < CONFIG.maxConcurrent) {
        spawnTarget();
      }
      if (state.spawned < state.budget) {
        queueSpawn(rint(CONFIG.spawnGapMin, CONFIG.spawnGapMax));
      } else {
        maybeEnd();
      }
    }, delay == null ? rint(CONFIG.spawnGapMin, CONFIG.spawnGapMax) : delay);
  }

  function spawnTarget(kindOverride) {
    var kind = kindOverride || (R ? R.weighted(KIND_WEIGHTS) : 'squirrel');
    var def = KINDS[kind];
    var creatureId = rpick(def.creatures);
    var zoneId = rpick(def.zones);
    var id = 'tg' + (++targetSeq);

    var el = document.createElement('button');
    el.className = 'target';
    el.setAttribute('data-kind', kind);
    el.setAttribute('data-target-id', id);
    el.setAttribute('aria-label', kind);
    el.textContent = rpick(def.glyphs);
    // Position within the play area (avoid the very bottom where Sakura stands).
    el.style.left = rint(14, 86) + '%';
    el.style.top = rint(12, 68) + '%';
    el.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      resolve(id, true);
    });

    if (dom.field) dom.field.appendChild(el);

    var lifeTimer = setTimeout(function () { resolve(id, false); }, rint(CONFIG.targetLifeMin, CONFIG.targetLifeMax));
    liveTargets[id] = { el: el, kind: kind, creatureId: creatureId, zoneId: zoneId, lifeTimer: lifeTimer, resolved: false };
    state.spawned++;
    state.activeCount++;
    syncHud();
    return id;
  }

  function resolve(id, didHit) {
    var t = liveTargets[id];
    if (!t || t.resolved) return null;
    t.resolved = true;
    if (t.lifeTimer) clearTimeout(t.lifeTimer);

    // Effects + Sakura reaction (only for taps / on-screen play)
    if (t.el && t.el.parentNode) {
      var rect = t.el.getBoundingClientRect();
      var fieldRect = dom.field ? dom.field.getBoundingClientRect() : { left: 0, top: 0 };
      var x = rect.left - fieldRect.left + rect.width / 2;
      var y = rect.top - fieldRect.top + rect.height / 2;
      if (didHit) {
        pounce();
        if (t.kind === 'bird') featherBurst(x, y); else dustPuff(x, y);
      }
      t.el.parentNode.removeChild(t.el);
    }

    delete liveTargets[id];
    state.activeCount = Math.max(0, state.activeCount - 1);

    var inc = null;
    if (shouldLog(t.kind, didHit)) {
      inc = makeIncident(t.kind, didHit, t.creatureId, t.zoneId);
      registerIncident(inc);
      setMessage(Voice ? Voice.formatIncidentLine(inc) : '');
      reactTo(inc, x, y);
    } else {
      // Non-logged: the leaf blew away, or the sign faded.
      setMessage(t.kind === 'vorg'
        ? (Voice ? Voice.getLine('vorgAlert') : 'Something was there.')
        : (Voice ? Voice.getLine('falseAlarm') : 'It was nothing.'));
    }

    maybeEnd();
    return inc;
  }

  function reactTo(inc) {
    if (!inc) return;
    if (inc.outcomeType === 'confirmedCatch') { goldFlash(); shake(); toast('Confirmed kill (mythic). ' + inc.title, 'gold'); }
    else if (inc.outcomeType === 'vorgNonConfirmation') { toast('Vorg sign logged — unconfirmed.', 'vorg'); }
    else if (inc.outcomeType === 'featherEvent') { toast('Feather event confirmed.', ''); }
    else if (inc.nearMiss) { toast('Near miss. The rabbit survived. For now.', ''); }
  }

  function maybeEnd() {
    if (state.phase !== 'playing') return;
    if (state.spawned >= state.budget && state.activeCount === 0) endRun();
  }

  function endRun() {
    if (state.phase === 'summary') return;
    state.phase = 'summary';
    if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
    // Clear any stragglers.
    Object.keys(liveTargets).forEach(function (id) {
      var t = liveTargets[id];
      if (t.lifeTimer) clearTimeout(t.lifeTimer);
      if (t.el && t.el.parentNode) t.el.parentNode.removeChild(t.el);
      delete liveTargets[id];
    });
    state.activeCount = 0;

    var summary = Incident.summarizeRun(state.incidents, { zoneName: state.runZoneName, runId: state.runId });
    state.summary = summary;
    renderSummary(summary);
    setMessage(Voice ? Voice.getLine('runEnd') : 'Operation complete.');
  }

  function renderSummary(summary) {
    if (dom.summaryTitle) dom.summaryTitle.textContent = summary.runTitle;
    if (dom.summaryRank) dom.summaryRank.textContent = 'Prestige ' + summary.prestige + ' · ' + summary.prestigeRank;
    if (dom.summaryOfficial) dom.summaryOfficial.textContent = summary.officialInterpretation;
    if (dom.summaryReality) dom.summaryReality.textContent = summary.likelyReality;

    if (dom.scoreboard) {
      var c = summary.counts;
      var chips = [
        ['Confirmed', summary.confirmedCatches],
        ['Escapes', summary.escapes],
        ['Squirrel fails', summary.squirrelFailures],
        ['False alarms', c.falseAlarms],
        ['Vorg evidence', c.vorgEvidence],
        ['Incidents', summary.total]
      ];
      dom.scoreboard.innerHTML = '';
      chips.forEach(function (pair) {
        var chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = '<span class="n">' + pair[1] + '</span><span class="k">' + pair[0] + '</span>';
        dom.scoreboard.appendChild(chip);
      });
    }

    // Notable incident cards: prioritize catches, vorg, near-misses, then fill.
    if (dom.summaryIncidents && UI) {
      var notable = pickNotable(summary.incidents, CONFIG.summaryCards);
      UI.renderInto(dom.summaryIncidents, notable);
      if (summary.incidents.length > notable.length) {
        var more = document.createElement('p');
        more.className = 'archive-head';
        more.style.marginTop = '0.4rem';
        more.textContent = '+ ' + (summary.incidents.length - notable.length) + ' more incidents filed';
        dom.summaryIncidents.appendChild(more);
      }
    }

    // Reset the file-report control for the new report.
    if (dom.btnFile) {
      dom.btnFile.disabled = false;
      dom.btnFile.textContent = 'File Official Report';
      dom.btnFile.classList.remove('ske-btn--ghost');
    }
    if (dom.fileConfirm) { dom.fileConfirm.hidden = true; dom.fileConfirm.textContent = ''; }

    if (dom.panelSummary) dom.panelSummary.hidden = false;
  }

  var FILE_CONFIRM_LINES = [
    'Report entered into the permanent record.',
    'The archive has accepted Sakura’s version of events.',
    'Likely reality appended under protest.'
  ];

  function fileReport() {
    if (!state.summary || !window.SakuraStorage) return;
    if (dom.btnFile && dom.btnFile.disabled) return;
    window.SakuraStorage.saveIncidents(state.summary.incidents, {
      sourceMode: 'duck-hunt',
      runTitle: state.summary.runTitle
    });
    if (dom.btnFile) {
      dom.btnFile.disabled = true;
      dom.btnFile.textContent = 'Report Filed ✓';
      dom.btnFile.classList.add('ske-btn--ghost');
    }
    if (dom.fileConfirm) {
      dom.fileConfirm.textContent = (R ? R.pick(FILE_CONFIRM_LINES) : FILE_CONFIRM_LINES[0]);
      dom.fileConfirm.hidden = false;
    }
  }

  function pickNotable(incidents, n) {
    var rank = {
      confirmedCatch: 0, vorgNonConfirmation: 1, featherEvent: 2,
      escape: 3, squirrelEscape: 4, falseAlarm: 5
    };
    return incidents.slice().sort(function (a, b) {
      var ra = rank[a.outcomeType] == null ? 9 : rank[a.outcomeType];
      var rb = rank[b.outcomeType] == null ? 9 : rank[b.outcomeType];
      if (ra !== rb) return ra - rb;
      return (b.points || 0) - (a.points || 0);
    }).slice(0, n);
  }

  // ---- Effects ----
  function pounce() {
    if (!dom.hunter) return;
    dom.hunter.classList.add('pounce');
    setTimeout(function () { dom.hunter.classList.remove('pounce'); }, 200);
  }
  function goldFlash() {
    if (!dom.goldflash) return;
    dom.goldflash.classList.remove('show'); void dom.goldflash.offsetWidth; dom.goldflash.classList.add('show');
  }
  function shake() {
    if (!dom.stage) return;
    dom.stage.classList.remove('shake'); void dom.stage.offsetWidth; dom.stage.classList.add('shake');
    setTimeout(function () { dom.stage.classList.remove('shake'); }, 200);
  }
  function burst(x, y, glyphs, count) {
    if (!dom.field) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'fx fx-particle';
      p.textContent = glyphs[i % glyphs.length];
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      var dx = rint(-50, 50), dy = rint(-60, -10), rot = rint(-180, 180);
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--rot', rot + 'deg');
      p.style.animation = 'burst 0.6s ease-out forwards';
      dom.field.appendChild(p);
      (function (node) { setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 650); })(p);
    }
  }
  function featherBurst(x, y) { burst(x, y, ['🪶', '🪶', '✨'], 6); }
  function dustPuff(x, y) { burst(x, y, ['💨', '·'], 4); }

  var toastTimer = null;
  function toast(text, tone) {
    if (!dom.toast) {
      dom.toast = document.createElement('div');
      dom.toast.className = 'ske-toast';
      document.body.appendChild(dom.toast);
    }
    dom.toast.textContent = text;
    dom.toast.setAttribute('data-tone', tone || '');
    dom.toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { dom.toast.classList.remove('show'); }, 1600);
  }

  function clearField() {
    if (dom.field) {
      // Remove targets/particles but keep nothing stale.
      var nodes = dom.field.querySelectorAll('.target, .fx');
      for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
    }
    Object.keys(liveTargets).forEach(function (id) {
      if (liveTargets[id].lifeTimer) clearTimeout(liveTargets[id].lifeTimer);
      delete liveTargets[id];
    });
    state.activeCount = 0;
  }

  // ---- Boot ----
  function init() {
    dom.field = document.getElementById('field');
    dom.stage = document.getElementById('stage');
    dom.hunter = document.getElementById('hunter');
    dom.goldflash = document.getElementById('goldflash');
    dom.message = document.getElementById('message');
    dom.score = document.getElementById('hud-score');
    dom.targets = document.getElementById('hud-targets');
    dom.catches = document.getElementById('hud-catches');
    dom.panelStart = document.getElementById('panel-start');
    dom.panelSummary = document.getElementById('panel-summary');
    dom.summaryTitle = document.getElementById('summary-title');
    dom.summaryRank = document.getElementById('summary-rank');
    dom.summaryOfficial = document.getElementById('summary-official');
    dom.summaryReality = document.getElementById('summary-reality');
    dom.scoreboard = document.getElementById('summary-scoreboard');
    dom.summaryIncidents = document.getElementById('summary-incidents');
    dom.btnFile = document.getElementById('btn-file');
    dom.fileConfirm = document.getElementById('file-confirm');

    var startBtn = document.getElementById('btn-start');
    var againBtn = document.getElementById('btn-again');
    if (startBtn) startBtn.addEventListener('click', startRun);
    if (againBtn) againBtn.addEventListener('click', startRun);
    if (dom.btnFile) dom.btnFile.addEventListener('click', fileReport);

    syncHud();
    if (dom.targets) dom.targets.textContent = '0/' + state.budget;

    // Test seam + introspection.
    window.__duckHunt = {
      state: state,
      config: CONFIG,
      KINDS: KINDS,
      startRun: startRun,
      endRun: endRun,
      spawn: function (kind) { return spawnTarget(kind); },
      resolve: resolve,
      fileReport: fileReport,
      /** Deterministic: create + register an incident without DOM. Returns it. */
      simulate: function (kind, didHit) {
        var def = KINDS[kind] || KINDS.squirrel;
        var inc = makeIncident(kind, didHit, rpick(def.creatures), rpick(def.zones));
        return registerIncident(inc);
      },
      getSummary: function () { return state.summary; }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
