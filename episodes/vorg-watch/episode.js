/* =============================================================
   Episode 4 — Vorg Watch
   A tiny investigation comic. The middle "toy" is an evidence board:
   examine clues, classify them (badly), watch Sakura's concern rise,
   then file an official theory. The Vorg is never confirmed.
   Built on the shared episode shell. For Tanisha.
   ============================================================= */
(function () {
  'use strict';

  var E = window.SakuraEpisode;
  var rand = E.rand;
  var PHOTO = '../../src/assets/sakura/sakura-home.jpg';

  var BEATS = ['intro', 'anomaly', 'tanisha', 'case', 'clue1', 'clue2', 'complication', 'clue3', 'theory', 'evidence', 'reaction', 'report'];

  // ---- clues (examine 3 of 5) ----------------------------------------------
  var CLUES = [
    { id: 'grass',  name: 'Bent Grass',        glyph: '🌿', fact: 'A patch of grass lying down, with no explanation and no alibi.',           sakura: 'Something heavy. Or something light, pretending.' },
    { id: 'shadow', name: 'Fence Shadow',      glyph: '🌑', fact: 'A shadow on the fence that, by Sakura’s account, arrived early.',          sakura: 'It was there before anything else admitted to being.' },
    { id: 'rustle', name: 'Unexplained Rustle',glyph: '🍃', fact: 'A rustle logged at 7:12-ish. Nothing has claimed responsibility.',         sakura: 'The silence afterward was, frankly, smug.' },
    { id: 'leaf',   name: 'Suspicious Leaf',   glyph: '🍂', fact: 'A leaf positioned with what Sakura is calling “intent.”',                  sakura: 'No leaf lands like that by accident.' },
    { id: 'track',  name: 'Unknown Track',     glyph: '🐾', fact: 'A track. Possibly a paw. Possibly Sakura’s own, from earlier, while pacing.', sakura: 'Inconclusive. Therefore important.' }
  ];

  // Classification options + how much each raises Concern (comic, not scientific)
  var CLASSES = [
    { key: 'vorg',    label: 'Vorg Evidence',            bump: 2 },
    { key: 'squirrel',label: 'Squirrel Deception',       bump: 1 },
    { key: 'rabbit',  label: 'Rabbit Misdirection',      bump: 1 },
    { key: 'wind',    label: 'Wind / Leaf Activity',     bump: 1 },
    { key: 'trouble', label: 'Inconclusive But Troubling', bump: 2 }
  ];
  function classLabel(key) { for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].key === key) return CLASSES[i].label; return key; }

  var CONCERN = ['Calm', 'Concerned', 'Officially Concerned', 'Unhelpfully Alarmed', 'Vorg Watch Activated'];

  // ---- outcome families (final theory) -------------------------------------
  var OUTCOMES = {
    vorg: {
      stamp: 'Watch Activated',
      official: 'Sakura identified a pattern consistent with possible Vorg-adjacent behavior.',
      likely: 'The grass was bent and everyone became dramatic.',
      tanisha: ['Tanisha is not prepared to validate the word “Vorg.”', 'Tanisha reviewed the theory and declined to co-sign it.'],
      status: ['Unconfirmed, concern rising', 'Unconfirmed — but noted, repeatedly']
    },
    squirrel: {
      stamp: 'Cover-Up Suspected',
      official: 'Sakura uncovered signs of squirrel interference in the far-corner investigation.',
      likely: 'A squirrel was nearby, which is not technically evidence.',
      tanisha: ['Tanisha agrees the squirrel looked suspicious, but only generally.', 'Tanisha notes the squirrel was present, as squirrels are.'],
      status: ['Unconfirmed due to alleged obstruction', 'Unconfirmed; obstruction unproven but assumed']
    },
    wind: {
      stamp: 'Atmospheric Concern',
      official: 'Sakura determined the wind may be acting through intermediaries.',
      likely: 'A leaf moved.',
      tanisha: ['Tanisha would like weather removed from the suspect list.', 'Tanisha confirms there was, at most, a breeze.'],
      status: ['Unconfirmed, meteorologically complicated', 'Unconfirmed; weather uncooperative']
    },
    unknown: {
      stamp: 'Case Remains Open',
      official: 'Sakura classified the matter as unresolved and therefore urgent.',
      likely: 'No one knows what happened, including Sakura.',
      tanisha: ['Tanisha confirms uncertainty, not urgency.', 'Tanisha agrees it is unresolved. The urgency is Sakura’s.'],
      status: ['Unconfirmed, pending more staring', 'Not confirmed by available facts']
    }
  };
  var THEORY_ORDER = [
    { key: 'vorg',     label: 'Probable Vorg Activity',   sub: 'The pattern is, to Sakura, undeniable.' },
    { key: 'squirrel', label: 'Squirrel Cover-Up',        sub: 'Someone tampered with the far corner.' },
    { key: 'wind',     label: 'Wind Conspiracy',          sub: 'The weather has been acting strangely on purpose.' },
    { key: 'unknown',  label: 'Unknown, Therefore Serious', sub: 'No conclusion. Maximum concern.' }
  ];

  // ---- state ---------------------------------------------------------------
  var state = { beat: 'intro', reviewed: [], concern: 0, theory: null, report: null, _tanisha: null };
  function show(opts) { state.beat = opts.key; E.render(opts); }
  function concernLabel() { return CONCERN[Math.min(state.concern, CONCERN.length - 1)]; }

  // ---- shared scene bits ---------------------------------------------------
  function farCorner() {
    return E.scene('<div class="farcorner"><div class="vignette"></div><div class="corner-shadow"></div>' +
      '<div class="qmark">?</div><div class="rustle">🍃</div></div>');
  }
  function concernMeter() {
    var max = CONCERN.length - 1;
    var lvl = Math.min(state.concern, max);
    var segs = '';
    for (var i = 0; i < max; i++) {
      var on = i < lvl ? ' on' : '';
      var mx = (lvl === max && i === max - 1) ? ' max' : '';
      segs += '<span class="c-seg' + on + mx + '"></span>';
    }
    var box = E.frag('<div class="concern"><div class="c-top"><span class="c-lab">Concern Level</span>' +
      '<span class="c-val">' + concernLabel() + '</span></div><div class="c-bar">' + segs + '</div></div>');
    return box;
  }

  // ---- beats ---------------------------------------------------------------
  function bIntro() {
    show({
      key: 'intro',
      scene: E.portrait(PHOTO, 'Far-Corner Watch · Unknown Regions'),
      kicker: 'Vorg Watch',
      copy: 'Sakura had been watching the far corner.<br><span class="dry">The far corner had not earned trust.</span>',
      actions: [{ label: 'Continue', onClick: bAnomaly }]
    });
  }
  function bAnomaly() {
    show({
      key: 'anomaly', scene: farCorner(),
      kicker: 'The anomaly',
      copy: 'At 7:12-ish, something moved where <span class="em">nothing had admitted to being</span>.<br><span class="dry">Sakura recorded this immediately, in her head, where the files are kept.</span>',
      actions: [{ label: 'Continue', onClick: bTanisha }]
    });
  }
  function bTanisha() {
    show({
      key: 'tanisha', scene: E.witness('Witness · Tanisha'),
      kicker: 'A witness appears',
      copy: 'Tanisha saw Sakura staring into the corner and <span class="em">chose caution</span>.<br><span class="dry">She did not ask. She has learned not to ask.</span>',
      actions: [{ label: 'Continue', onClick: bCase }]
    });
  }
  function bCase() {
    var body = document.createElement('div');
    body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.gap = '0.6rem';
    body.appendChild(E.frag('<div class="case-file"><span class="cf-lab">Case Opened · Vorg Watch</span>' +
      '<div class="cf-line">Three pieces of evidence requested. Conclusion: already reached.</div></div>'));
    body.appendChild(concernMeter());
    show({
      key: 'case',
      copy: 'A case was opened.<br>Evidence was requested.<br><span class="dry">Sakura had already reached a conclusion.</span>',
      body: body,
      actions: [{ label: 'Begin investigation', onClick: bBoard }]
    });
  }

  function bBoard() {
    var done = state.reviewed.length;
    var body = document.createElement('div');
    body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.gap = '0.6rem';
    body.appendChild(concernMeter());

    var grid = document.createElement('div');
    grid.className = 'clue-grid';
    CLUES.forEach(function (clue) {
      var rec = findReviewed(clue.id);
      var btn = document.createElement('button');
      btn.className = 'clue-card' + (rec ? ' done' : '');
      btn.disabled = !!rec || done >= 3;
      btn.innerHTML = '<span class="cc-top"><span class="cc-glyph">' + clue.glyph + '</span><span class="cc-name">' + clue.name + '</span></span>' +
        (rec ? '<span class="cc-tag">Filed: ' + classLabel(rec.cls) + '</span>' : '<span class="cc-tag" style="color:var(--muted)">Uninvestigated</span>');
      if (!rec && done < 3) btn.addEventListener('click', function () { bClue(clue.id); });
      grid.appendChild(btn);
    });
    body.appendChild(grid);

    var actions = [];
    if (done >= 3) actions.push({ label: 'Form a theory →', onClick: bTheory });

    show({
      key: done === 0 ? 'case' : ('clue' + Math.min(done, 3)),
      kicker: 'Evidence Board · ' + done + '/3 filed',
      copy: done >= 3
        ? 'Three pieces of evidence, all classified. <span class="dry">Quality: debatable. Quantity: achieved.</span>'
        : 'Tap a clue to investigate it. <span class="dry">You have ' + (3 - done) + ' to file.</span>',
      body: body, actions: actions
    });
  }
  function findReviewed(id) { for (var i = 0; i < state.reviewed.length; i++) if (state.reviewed[i].id === id) return state.reviewed[i]; return null; }
  function clueById(id) { for (var i = 0; i < CLUES.length; i++) if (CLUES[i].id === id) return CLUES[i]; return null; }

  function bClue(id) {
    var clue = clueById(id);
    var body = document.createElement('div');
    body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.gap = '0.6rem';
    body.appendChild(E.frag('<div class="clue-detail"><div class="cd-head"><span class="cd-glyph">' + clue.glyph + '</span>' +
      '<span class="cd-name">' + clue.name + '</span></div>' +
      '<p class="cd-fact">' + clue.fact + '</p>' +
      '<p class="cd-sakura"><b>Sakura:</b> ' + clue.sakura + '</p></div>'));
    var classify = document.createElement('div');
    classify.className = 'classify';
    CLASSES.forEach(function (c) {
      var btn = E.frag('<button class="choice"><span class="ch-name">' + c.label + '</span></button>');
      btn.addEventListener('click', function () { classifyClue(id, c); });
      classify.appendChild(btn);
    });
    body.appendChild(classify);
    show({
      key: 'clue' + Math.min(state.reviewed.length + 1, 3),
      kicker: 'Examine · how do we classify this?',
      body: body, actions: []
    });
  }

  function classifyClue(id, c) {
    state.reviewed.push({ id: id, cls: c.key });
    state.concern = Math.min(state.concern + c.bump, CONCERN.length - 1);
    // Complication fires after the SECOND clue.
    if (state.reviewed.length === 2) bComplication();
    else bBoard();
  }

  function bComplication() {
    show({
      key: 'complication', scene: farCorner(),
      kicker: 'A complication',
      copy: '“Sakura,” said Tanisha, gently, “it is probably a bag.”<br><span class="em">Sakura considered this.</span> The far corner, meanwhile, went quiet — <span class="dry">in a way Sakura considered aggressive.</span>',
      actions: [{ label: 'Note Tanisha’s theory. Disregard it.', onClick: bBoard }]
    });
  }

  function bTheory() {
    var body = document.createElement('div');
    body.className = 'theory';
    THEORY_ORDER.forEach(function (t) {
      var btn = E.frag('<button class="choice"><span class="ch-name">' + t.label + '</span><span class="ch-sub">' + t.sub + '</span></button>');
      btn.addEventListener('click', function () { chooseTheory(t.key); });
      body.appendChild(btn);
    });
    show({
      key: 'theory', kicker: 'File the official theory',
      copy: 'What does the official record conclude?',
      body: body, actions: []
    });
  }
  function chooseTheory(key) { state.theory = key; bEvidence(); }

  function evidenceSummary() {
    if (!state.reviewed.length) return 'No evidence survived review.';
    return state.reviewed.map(function (r) { return clueById(r.id).name + ' (' + classLabel(r.cls) + ')'; }).join('; ') + '.';
  }

  function bEvidence() {
    var body = document.createElement('div');
    body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.gap = '0.6rem';
    body.appendChild(concernMeter());
    body.appendChild(E.frag('<div class="case-file"><span class="cf-lab">Evidence Reviewed</span>' +
      '<div class="cf-line">' + evidenceSummary() + '</div></div>'));
    show({
      key: 'evidence', kicker: 'The case so far',
      body: body,
      actions: [{ label: 'Submit for witness review', onClick: bReaction }]
    });
  }
  function bReaction() {
    var o = OUTCOMES[state.theory || 'unknown'];
    state._tanisha = rand(o.tanisha);
    show({
      key: 'reaction', scene: E.witness('Tanisha · Statement'),
      kicker: 'The witness speaks',
      copy: '“' + state._tanisha + '”',
      actions: [{ label: 'See the official record →', onClick: bReport }]
    });
  }

  function buildReport() {
    var key = state.theory || 'unknown';
    var o = OUTCOMES[key];
    return {
      title: 'Vorg Watch',
      theory: key,
      stamp: o.stamp,
      stampSub: 'Concern: ' + concernLabel(),
      official: o.official,
      likely: o.likely,
      witness: state._tanisha || rand(o.tanisha),
      evidence: evidenceSummary(),
      status: rand(o.status),       // ALWAYS an "Unconfirmed" variant
      statusLabel: 'Vorg Status',
      caseNo: E.caseNo('V')
    };
  }
  function bReport() {
    var r = buildReport();
    state.report = r;
    show({
      key: 'report',
      body: E.report(r),
      actions: [
        { render: E.btn('Play Again', restart) },
        { render: E.btn('← Back to Incident Files', function () { window.location.href = '../index.html'; }, true) }
      ]
    });
  }

  function restart() {
    state.beat = 'intro'; state.reviewed = []; state.concern = 0; state.theory = null;
    state.report = null; state._tanisha = null;
    bIntro();
  }

  // ---- boot ----------------------------------------------------------------
  function init() {
    E.mount({ panelId: 'panel', progressFillId: 'progress-fill', beats: BEATS });
    bIntro();

    // Test seam — drive deterministically. reachReport(theory) forces a theory.
    window.__tc = {
      state: state, start: bIntro, again: restart, restart: restart,
      reachReport: function (theory) {
        restart();
        // file three plausible clues + raise concern, then force the theory
        state.reviewed = [{ id: 'grass', cls: 'vorg' }, { id: 'rustle', cls: 'trouble' }, { id: 'leaf', cls: 'wind' }];
        state.concern = CONCERN.length - 1;
        state.theory = (OUTCOMES[theory] ? theory : 'unknown');
        state._tanisha = rand(OUTCOMES[state.theory].tanisha);
        bReport();
      },
      getReport: function () { return state.report; },
      concernLabel: concernLabel
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
