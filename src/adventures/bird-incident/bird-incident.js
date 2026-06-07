/* =============================================================
   The Bird Incident — Stage 0.6 flagship adventure
   An authored, choice-driven Sakura episode. The player guides Sakura
   through eight beats and produces the official record of her version
   of events — which is, reliably, not the likely reality.

   Reuses the platform (SakuraData, SakuraIncident schema, SakuraStorage,
   SakuraPresence, SakuraUI). Content is authored here; the flow is a
   tiny state machine that future adventures can copy.

   Test seam: window.__birdIncident.
   ============================================================= */
(function () {
  'use strict';

  var SP = window.SakuraPresence;
  var Store = window.SakuraStorage;
  var Data = window.SakuraData;
  var PHOTO = '../../assets/sakura/sakura-home.jpg';

  // ---- Authored content ----------------------------------------------------
  var OBSERVATIONS = {
    patio:  { id: 'patio',  label: 'Patio Watch',        witness: 'Tanisha', zone: 'great-patio',
              sub: 'The warm stones. Total airspace visibility.',
              brief: 'Sakura claims the warm stones of the Great Patio. From here, all airspace is visible — and all of it is suspect.' },
    window: { id: 'window', label: 'Window Surveillance', witness: 'Nick',    zone: 'threshold',
              sub: 'Denied the yard. The glass is no barrier to jurisdiction.',
              brief: 'Denied the yard on a technicality, Sakura assumes the interior window post. The glass is no barrier to her jurisdiction.' },
    fence:  { id: 'fence',  label: 'Fence Line Shadow',   witness: 'Cias',    zone: 'fence-line',
              sub: 'Low and patient. The squirrels are watching too.',
              brief: 'Sakura works the fence line, low and patient. Out here the squirrels are watching too — and they are taking notes.' }
  };

  var APPROACHES = {
    creep:  { id: 'creep',  label: 'Creep with dignity',      sub: 'One deliberate paw at a time.',
              setup: 'Sakura advances one deliberate paw at a time, as if the lawn itself might be called to testify later.',
              complication: 'The bird hops once. It does not flee. It appears entirely unaware of its historical importance.',
              adj: 'disciplined', window: { duration: 1500, forgiving: 1.0 } },
    charge: { id: 'charge', label: 'Charge immediately',      sub: 'Subtlety was never on the table.',
              setup: 'Sakura abandons subtlety. Subtlety was, frankly, never really on the table.',
              complication: 'The bird waits. It waits with the calm of a creature that has read the statistics on squirrels.',
              adj: 'overwhelming', window: { duration: 1050, forgiving: 0.8 } },
    wait:   { id: 'wait',   label: 'Wait for the perfect moment', sub: 'A coiled spring of total commitment.',
              setup: 'Sakura freezes — a coiled spring of total commitment — waiting for destiny to enter range.',
              complication: 'A leaf moves. Sakura briefly expands the investigation to include the leaf. The bird remains a person of interest.',
              adj: 'perfectly-timed', window: { duration: 1950, forgiving: 1.3 } },
    bark:   { id: 'bark',   label: 'Bark at the sky',         sub: 'Announce the operation to three backyards.',
              setup: 'Sakura announces the operation to the sky, the bird, and three neighboring backyards.',
              complication: 'The bird is now fully aware. So is the entire backyard. So, somewhere, is a squirrel — delighted.',
              adj: 'psychological', window: { duration: 1400, forgiving: 0.9 } }
  };

  var TIERS = {
    legendary: { rank: 'Confirmed Aerial Engagement', outcome: 'confirmedCatch', violence: 'confirmedKillMythic', points: 100,
      aftermath: 'Feathers. Actual feathers. The bird is gone in the most permanent sense the backyard recognizes. Sakura is changed. So is history.',
      verb: 'achieved a confirmed aerial intercept', evidence: 'One (1) bird. Recovered. Rolled in.', canon: 'canon — confirmed catch',
      reality: 'She actually caught the bird. Out of the air. It happened. {witness} is still talking about it.' },
    feather: { rank: 'Feather Evidence Event', outcome: 'featherEvent', violence: 'featherBurst', points: 60,
      aftermath: 'A burst of feathers, a vacated airspace, and one (1) extremely pleased dog. Evidence recovered. The bird’s current whereabouts are filed under “irrelevant.”',
      verb: 'broke enemy air control', evidence: 'Feathers (several). Bagged.', canon: 'canon — feather event',
      reality: 'A bird flew off and several feathers were later discovered. {witness} found them.' },
    nearmiss: { rank: 'Strategic Near Miss', outcome: 'escape', violence: 'startled', points: 15,
      aftermath: 'The bird departs at altitude — intact, but humbled. Sakura secures the ground it had been standing near. This counts. She has decided it counts.',
      verb: 'drove hostile aviation from the sector', evidence: 'None. The grass was, however, thoroughly inspected.', canon: 'canon (under review)',
      reality: 'The bird left when it felt like it. Sakura barked at the place it had been.' },
    confusion: { rank: 'Officially Successful Despite Facts', outcome: 'falseAlarm', violence: 'harmless', points: 20,
      aftermath: 'It is unclear what happened. It is clear that Sakura won. These two facts coexist in the official record without further comment.',
      verb: 'neutralized an aerial threat with decisive, unspecified force', evidence: 'Inconclusive. A leaf was detained and released.', canon: 'logged',
      reality: 'Nothing verifiable occurred. {witness} is no longer certain a bird was involved.' }
  };

  var BEAT_ORDER = ['briefing', 'observe', 'approach', 'complication', 'strike', 'aftermath', 'report'];

  // ---- State ---------------------------------------------------------------
  var state = {
    beat: 'briefing',
    observation: null,
    approach: null,
    strikeTier: null,
    report: null,
    incidents: [],
    filed: false
  };

  var dom = {};
  var strikeAnim = null;

  function elN(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function setStatus(s) { if (dom.status && s) dom.status.textContent = s; }
  function obs() { return OBSERVATIONS[state.observation]; }
  function app() { return APPROACHES[state.approach]; }
  function zoneName(id) { var z = Data && Data.zoneById(id); return z ? z.name : 'the backyard'; }

  function renderDots() {
    if (!dom.dots) return;
    dom.dots.innerHTML = '';
    var idx = BEAT_ORDER.indexOf(state.beat);
    BEAT_ORDER.forEach(function (b, i) {
      var d = elN('span', 'dot' + (i < idx ? ' done' : i === idx ? ' current' : ''));
      dom.dots.appendChild(d);
    });
  }

  function show(beat) { state.beat = beat; renderDots(); RENDER[beat](); }

  // ---- Beats ---------------------------------------------------------------
  var RENDER = {
    briefing: function () {
      dom.beat.innerHTML = '';
      dom.beat.appendChild(elN('p', 'beat-label', 'Incident Briefing'));
      dom.beat.appendChild(elN('h2', 'beat-title', 'A bird has entered the backyard.'));
      dom.beat.appendChild(elN('p', 'prose',
        'At approximately an important time, a bird crossed into restricted backyard airspace <span class="pop">without authorization</span>. Sakura noticed. This changed everything.<br><br>Witnesses will be unreliable. The bird is unaware of its role in history. You will help Sakura build the official record.'));
      var b = elN('button', 'ske-btn cta', 'Begin the Incident');
      b.addEventListener('click', goObserve);
      dom.beat.appendChild(b);
      setStatus('The backyard is not safe.');
    },

    observe: function () {
      dom.beat.innerHTML = '';
      dom.beat.appendChild(elN('p', 'beat-label', 'Beat 1 · Observation Post'));
      dom.beat.appendChild(elN('h2', 'beat-title', 'Where does Sakura watch from?'));
      dom.beat.appendChild(elN('p', 'prose muted', 'The post decides the witness — and the witness decides the paperwork.'));
      var wrap = elN('div', 'choices');
      ['patio', 'window', 'fence'].forEach(function (id) {
        var o = OBSERVATIONS[id];
        var c = elN('button', 'choice', '<span class="ch-name">' + o.label + '</span><span class="ch-sub">' + o.sub + ' · Witness: ' + o.witness + '</span>');
        c.addEventListener('click', function () { chooseObservation(id); });
        wrap.appendChild(c);
      });
      dom.beat.appendChild(wrap);
      setStatus('Choose a vantage.');
    },

    approach: function () {
      dom.beat.innerHTML = '';
      dom.beat.appendChild(elN('p', 'beat-label', 'Beat 2 · The Approach'));
      dom.beat.appendChild(elN('h2', 'beat-title', 'How does Sakura move in?'));
      dom.beat.appendChild(elN('p', 'prose', obs().brief));
      var wrap = elN('div', 'choices');
      ['creep', 'charge', 'wait', 'bark'].forEach(function (id) {
        var a = APPROACHES[id];
        var c = elN('button', 'choice', '<span class="ch-name">' + a.label + '</span><span class="ch-sub">' + a.sub + '</span>');
        c.addEventListener('click', function () { chooseApproach(id); });
        wrap.appendChild(c);
      });
      dom.beat.appendChild(wrap);
      setStatus('This is where her personality shows.');
    },

    complication: function () {
      dom.beat.innerHTML = '';
      dom.beat.appendChild(elN('p', 'beat-label', 'Beat 3 · Complication'));
      dom.beat.appendChild(elN('h2', 'beat-title', 'Something becomes absurd.'));
      dom.beat.appendChild(elN('p', 'prose', app().setup));
      dom.beat.appendChild(elN('p', 'prose pop', app().complication));
      var b = elN('button', 'ske-btn cta', 'Move in →');
      b.addEventListener('click', goStrike);
      dom.beat.appendChild(b);
      setStatus('Hold. Hold...');
    },

    strike: function () {
      dom.beat.innerHTML = '';
      dom.beat.appendChild(elN('p', 'beat-label', 'Beat 4 · The Strike'));
      dom.beat.appendChild(elN('h2', 'beat-title', 'Time the pounce.'));
      dom.beat.appendChild(elN('p', 'prose muted', 'Strike when the reticle closes on the bird. Wait too long and the moment — like the bird — is gone.'));
      var stage = elN('div', 'strike-stage');
      stage.id = 'strike-stage';
      stage.appendChild(elN('div', 'moon'));
      stage.appendChild(elN('div', 'ground'));
      var bird = elN('div', 'bird'); bird.id = 'strike-bird'; bird.textContent = '🐦'; stage.appendChild(bird);
      var ret = elN('div', 'reticle'); ret.id = 'reticle'; stage.appendChild(ret);
      dom.beat.appendChild(stage);
      var b = elN('button', 'ske-btn cta', 'Strike!');
      b.id = 'btn-strike';
      b.addEventListener('click', onStrikeTap);
      dom.beat.appendChild(b);
      setStatus('Sakura has entered kill mode.');
      startStrikeAnim();
    },

    aftermath: function () {
      dom.beat.innerHTML = '';
      var t = TIERS[state.strikeTier];
      dom.beat.appendChild(elN('p', 'beat-label', 'Beat 5 · Aftermath'));
      dom.beat.appendChild(elN('h2', 'beat-title', t.rank));
      dom.beat.appendChild(elN('p', 'prose', t.aftermath));
      dom.beat.appendChild(elN('p', 'prose muted', witnessReaction()));
      var b = elN('button', 'ske-btn cta', 'See the official record →');
      b.addEventListener('click', goReport);
      dom.beat.appendChild(b);
      setStatus(window.SakuraVoice ? window.SakuraVoice.getLine('runEnd') : 'The paperwork rises.');
    },

    report: function () {
      var r = state.report || buildReport();
      dom.beat.innerHTML = '';
      if (SP) { var ph = elN('div'); ph.style.cssText = 'display:flex;justify-content:center;margin-bottom:0.5rem;'; ph.appendChild(SP.portrait({ src: PHOTO, size: 52, alt: 'Sakura' })); dom.beat.appendChild(ph); }
      dom.beat.appendChild(elN('p', 'report-rank', r.rank));
      dom.beat.appendChild(elN('p', 'report-verdict', 'The Bird Incident'));

      var off = elN('div', 'rep-block rep-official');
      off.appendChild(elN('span', 'lab', 'Official Interpretation'));
      off.appendChild(elN('p', null, r.official));
      dom.beat.appendChild(off);

      var real = elN('div', 'rep-block rep-reality');
      real.appendChild(elN('span', 'lab', 'Likely Reality'));
      real.appendChild(elN('p', null, r.likely));
      dom.beat.appendChild(real);

      var meta = elN('div', 'rep-meta');
      meta.appendChild(metaField('Witness', r.witness + ' — ' + r.witnessNote));
      meta.appendChild(metaField('Evidence', r.evidence));
      meta.appendChild(metaField('Sector', zoneName(obs().zone)));
      meta.appendChild(metaField('Canon status', r.canonStatus));
      dom.beat.appendChild(meta);

      var fileBtn = elN('button', 'ske-btn', 'File into the Permanent Record');
      fileBtn.id = 'btn-file'; fileBtn.style.width = '100%'; fileBtn.style.marginTop = '0.8rem';
      fileBtn.addEventListener('click', fileReport);
      dom.beat.appendChild(fileBtn);
      dom.beat.appendChild((function () { var p = elN('p', 'file-confirm'); p.id = 'file-confirm'; p.hidden = true; return p; })());

      var actions = elN('div', 'report-actions');
      var again = elN('button', 'ske-btn ske-btn--ghost', 'Play Again');
      again.id = 'btn-again';
      again.addEventListener('click', restart);
      var arch = elN('a', 'ske-btn ske-btn--ghost', 'Permanent Record');
      arch.setAttribute('href', '../../modes/canon/index.html');
      actions.appendChild(again); actions.appendChild(arch);
      dom.beat.appendChild(actions);

      setStatus('Incident logged. Canon updated.');
    }
  };

  function metaField(k, v) {
    var f = elN('div', 'rep-field');
    f.appendChild(elN('span', 'k', k));
    f.appendChild(elN('span', 'v', v));
    return f;
  }

  function witnessReaction() {
    var w = obs().witness, tier = state.strikeTier;
    if (tier === 'legendary') return w + ' witnessed the whole thing and has not stopped talking about it.';
    if (tier === 'feather') return w + ' recovered the feather evidence and is reluctantly impressed.';
    if (tier === 'nearmiss') return w + ' notes that the bird was “fine” and “leaving anyway.”';
    return w + ' is no longer certain a bird was ever involved.';
  }

  // ---- Transitions (also the test seam) ----
  function goObserve() { show('observe'); }
  function chooseObservation(id) { state.observation = id; show('approach'); }
  function chooseApproach(id) { state.approach = id; show('complication'); }
  function goStrike() { show('strike'); }
  function goAftermath() { show('aftermath'); }
  function goReport() { state.report = buildReport(); show('report'); }
  function restart() {
    state.observation = state.approach = state.strikeTier = state.report = null;
    state.incidents = []; state.filed = false;
    show('briefing');
  }

  // ---- Strike timing -------------------------------------------------------
  function startStrikeAnim() {
    var a = app().window;
    var ret = document.getElementById('reticle');
    if (!ret || !window.requestAnimationFrame) { return; }
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    strikeAnim = { t0: t0, dur: a.duration, forgiving: a.forgiving, raf: null, active: true };
    function loop(now) {
      if (!strikeAnim || !strikeAnim.active) return;
      var p = (now - strikeAnim.t0) / strikeAnim.dur;
      if (p >= 1) { strikeAnim.active = false; resolveStrike('confusion'); return; }
      var scale = 2.0 - p * 1.6; // 2.0 -> 0.4
      ret.style.transform = 'scale(' + scale + ')';
      strikeAnim.raf = requestAnimationFrame(loop);
    }
    strikeAnim.raf = requestAnimationFrame(loop);
  }

  function onStrikeTap() {
    if (!strikeAnim || !strikeAnim.active) return;
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var p = (now - strikeAnim.t0) / strikeAnim.dur;
    var scale = 2.0 - p * 1.6;
    var err = Math.abs(scale - 0.6) / (strikeAnim.forgiving || 1);
    var tier = err < 0.13 ? 'legendary' : err < 0.34 ? 'feather' : 'nearmiss';
    resolveStrike(tier);
  }

  function resolveStrike(tier) {
    if (strikeAnim) { strikeAnim.active = false; if (strikeAnim.raf) cancelAnimationFrame(strikeAnim.raf); strikeAnim = null; }
    state.strikeTier = tier;
    var stage = document.getElementById('strike-stage');
    var bird = document.getElementById('strike-bird');
    if (SP && stage && bird) {
      var x = bird.offsetLeft, y = bird.offsetTop;
      SP.outcomeFx(stage, x, y, TIERS[tier].outcome, true);
    }
    setTimeout(goAftermath, 420);
  }

  // ---- Report + incidents --------------------------------------------------
  function fill(str) { return str.replace('{witness}', obs().witness); }

  function buildReport() {
    var o = obs(), a = app(), t = TIERS[state.strikeTier || 'confusion'];
    var zName = zoneName(o.zone);
    var official = 'Operating from ' + o.label + ', Sakura executed a ' + a.adj + ' engagement and ' +
      t.verb + ' over ' + zName + '. ' + o.witness + ' confirms the realm is, once again, secure.';
    var likely = fill(t.reality);

    var report = {
      title: 'The Bird Incident',
      rank: t.rank,
      tier: state.strikeTier,
      official: official,
      likely: likely,
      witness: o.witness,
      witnessNote: witnessNoteShort(),
      evidence: t.evidence,
      canonStatus: t.canon,
      incidents: []
    };

    // Primary incident — the engagement (authored, schema-complete).
    report.incidents.push({
      id: 'bird-' + (state.strikeTier || 'x') + '-' + o.id + '-' + a.id,
      kind: 'bird',
      title: t.rank,
      dateClassification: 'The Bird Incident · just now',
      zone: o.zone,
      zoneName: zName,
      creatures: ['the-robin'],
      creatureName: 'A Robin',
      factions: ['bird-council'],
      witnesses: [o.witness],
      trigger: 'A bird entered restricted backyard airspace.',
      playerAction: a.label,
      outcomeType: t.outcome,
      officialInterpretation: official,
      likelyReality: likely,
      canonStatus: t.canon,
      violenceLevel: t.violence,
      comedyType: 'mythic-understatement',
      points: t.points,
      sourceAdventure: 'bird-incident'
    });

    // Fence post adds a squirrel footnote — canon: never caught.
    if (o.id === 'fence') {
      report.incidents.push({
        id: 'bird-sentry-' + a.id, kind: 'squirrel', title: 'The Corner Sentry Observed',
        dateClassification: 'The Bird Incident · just now', zone: 'fence-line', zoneName: 'The Great Fence Line',
        creatures: ['corner-sentry'], creatureName: 'The Corner Sentry', factions: ['squirrel-directorate'],
        witnesses: [o.witness], trigger: 'A squirrel surveilled the operation from the fence.',
        playerAction: 'Noted for the record.', outcomeType: 'squirrelEscape',
        officialInterpretation: 'An enemy observer was identified and placed under official suspicion.',
        likelyReality: 'A squirrel watched, took notes, and left. No squirrel was apprehended. None ever is.',
        canonStatus: 'canon (institutional embarrassment)', violenceLevel: 'chased', comedyType: 'institutional-embarrassment',
        points: 0, sourceAdventure: 'bird-incident'
      });
    }

    state.incidents = report.incidents;
    return report;
  }

  function witnessNoteShort() {
    var tier = state.strikeTier;
    if (tier === 'legendary') return 'co-signs the official account';
    if (tier === 'feather') return 'reluctantly co-signs';
    if (tier === 'nearmiss') return 'disputes the wording';
    return 'declined to confirm a bird';
  }

  function fileReport() {
    if (state.filed || !Store || !state.report) return;
    Store.saveIncidents(state.report.incidents, { sourceMode: 'bird-incident', sourceAdventure: 'bird-incident', runTitle: state.report.rank });
    state.filed = true;
    var btn = document.getElementById('btn-file');
    if (btn) { btn.disabled = true; btn.textContent = 'Filed ✓'; btn.classList.add('ske-btn--ghost'); }
    var c = document.getElementById('file-confirm');
    if (c) { c.textContent = 'Entered into the permanent record. ' + obs().witness + ' has been notified.'; c.hidden = false; }
  }

  // ---- Boot ----------------------------------------------------------------
  function init() {
    dom.beat = document.getElementById('beat');
    dom.dots = document.getElementById('beat-dots');
    dom.status = document.getElementById('status');
    if (SP) {
      var slot = document.getElementById('title-portrait');
      if (slot) slot.appendChild(SP.portrait({ src: PHOTO, size: 48, alt: 'Sakura' }));
    }
    show('briefing');

    // Test seam — drive the episode deterministically.
    window.__birdIncident = {
      state: state,
      start: goObserve,
      chooseObservation: chooseObservation,
      chooseApproach: chooseApproach,
      toStrike: goStrike,
      strike: function (forcedTier) { if (state.beat !== 'strike') goStrike(); resolveStrike(forcedTier || 'feather'); },
      toReport: goReport,
      file: fileReport,
      restart: restart,
      getReport: function () { return state.report; }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
