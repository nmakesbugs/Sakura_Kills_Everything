/* =============================================================
   Episode 2 — Squirrel Surveillance
   Sakura Kills Everything. An authored, playable comic episode.

   Canon law, non-negotiable: Sakura has never caught a squirrel.
   She never will. This will not stop her. The squirrel knows.
   ============================================================= */
(function () {
  'use strict';

  var E = window.SakuraEpisode;
  var rand = E.rand;
  var PHOTO = '../../src/assets/sakura/sakura-home.jpg';

  var BEATS = ['intro', 'squirrel', 'tanisha', 'briefing', 'choice', 'approach', 'action', 'complication', 'evidence', 'reaction', 'report'];

  // The squirrel always escapes. Status is funny, never "caught."
  var SQUIRREL_STATUS = [
    'Uncaught',
    'Uncaught, pending appeal',
    'Uncaught. Smug about it.',
    'Uncaught (record remains perfect)',
    'At large. Possibly promoted.'
  ];

  // ---- branch content ------------------------------------------------------
  var BRANCH = {
    surveillance: {
      label: 'Conduct surveillance',
      sub: 'Gather evidence. Establish dominance through eye contact.',
      approach: 'Sakura assumes the position: low, still, eyes locked on the fence line. This is no longer a backyard. It is a stakeout.',
      actionLabel: 'Hold the stare',
      actionHint: 'Tap when the suspect drifts into your line of sight. Do not blink first.',
      glyph: '🐿️',
      zone: { left: 34, width: 30 },
      scene: function (s) { E.token(s, '🐿️', 'squirrel', 'Person of Interest', 'idle'); s.appendChild(E.frag('<div class="surveil"></div>')); E.paws(s, [[24, 80, -8]]); },
      complication: function (clean) {
        return clean
          ? 'Sakura achieves total visual lock. The squirrel, maintaining eye contact, slowly eats something. Sakura logs this as a confession.'
          : 'Sakura holds the stare for a heroic eleven seconds. The squirrel holds it for twelve. A line, somewhere, was crossed.';
      },
      evidence: ['One (1) acorn, consumed defiantly. Surveillance log: extensive.', 'Several minutes of uninterrupted, deeply personal eye contact.'],
      tanisha: ['Tanisha confirms the staring was, in fact, intense.', 'Tanisha is not sure who was surveilling whom.', 'Tanisha notes the squirrel left first, and slowly, as a statement.'],
      official: 'Sakura established visual dominance over a known fence-line offender.',
      likely: 'She stared at a squirrel until it got bored and left.',
      stamp: 'Surveillance Successful',
      stampSub: ['Intel: gathered', 'Blinking: minimal'],
      status: SQUIRREL_STATUS
    },
    charge: {
      label: 'Charge the fence',
      sub: 'Diplomacy has failed. So has patience.',
      approach: 'Sakura abandons the stakeout in a single explosive instant. Forty pounds of conviction, aimed directly at a fence she cannot climb.',
      actionLabel: 'AUTHORIZE PURSUIT',
      actionHint: 'Tap to launch the moment the suspect is in range. Timing is everything. It will not matter.',
      glyph: '🐿️',
      zone: { left: 28, width: 44 },
      scene: function (s) { s.appendChild(E.frag('<div class="streak"></div>')); E.token(s, '🐿️', 'squirrel', 'Fleeing Suspect', 'idle'); },
      complication: function (clean) {
        return clean
          ? 'Contact: the fence. The squirrel departs upward exactly one inch ahead, as the Syndicate trains them to. Sakura arrives where it used to be.'
          : 'Sakura commits fully and arrives a heartbeat late, greeting the spot the squirrel occupied moments ago with tremendous enthusiasm.';
      },
      evidence: ['One fence, struck. One squirrel, absent. A small, professional cloud of dust.', 'Paw marks ending abruptly at a fence the squirrel cleared without effort.'],
      tanisha: ['Tanisha heard the fence and chose not to ask.', 'Tanisha would like the record to show she warned everyone.', 'Tanisha watched the squirrel clear the fence without hurrying.'],
      official: 'Sakura forced the suspect into immediate retreat across the jurisdictional boundary.',
      likely: 'The squirrel moved slightly faster than her entire plan.',
      stamp: 'Suspect Fled Jurisdiction',
      stampSub: ['Pursuit: authorized', 'Fence: undefeated'],
      status: SQUIRREL_STATUS
    },
    pretend: {
      label: 'Pretend not to care',
      sub: 'A covert operation. Lull the suspect into a false sense of security.',
      approach: 'Sakura looks away with elaborate, unconvincing casualness. She is, she would like it known, thinking about something else entirely.',
      actionLabel: 'Maintain the act',
      actionHint: 'Tap the moment you can no longer take it. You will not last. Nobody does.',
      glyph: '🐿️',
      zone: { left: 38, width: 24 },
      scene: function (s) { E.token(s, '🐿️', 'squirrel', 'Closing In', 'idle'); s.appendChild(E.frag('<span class="eye" style="left:46%;top:54%">👁️</span>')); E.paws(s, [[70, 78, 12]]); },
      complication: function (clean) {
        return clean
          ? 'The squirrel, emboldened, creeps closer. Sakura holds the act for a truly remarkable amount of time. And then does not.'
          : 'Sakura lasts roughly two seconds before whipping around with a bark of pure betrayal. The cover is, at this point, fully blown.';
      },
      evidence: ['Zero (0) seconds of believable indifference. One spectacular reveal.', 'The act, undone by a single uncontainable look. Squirrel: unbothered.'],
      tanisha: ['Tanisha does not believe Sakura was ever undercover.', 'Tanisha says the disguise fooled no one, least of all the squirrel.', 'Tanisha reports the squirrel looked, if anything, flattered.'],
      official: 'Sakura initiated a covert counter-squirrel maneuver to compromise the suspect.',
      likely: 'She looked away for two seconds and then physically could not stand it.',
      stamp: 'Undercover Operation Compromised',
      stampSub: ['Cover: blown', 'Commitment: total'],
      status: SQUIRREL_STATUS
    }
  };

  // ---- state ---------------------------------------------------------------
  var state = { beat: 'intro', choice: null, clean: null, report: null, _evidence: null, _tanisha: null };
  function show(opts) { state.beat = opts.key; E.render(opts); }

  // ---- beats ---------------------------------------------------------------
  function bIntro() {
    show({
      key: 'intro',
      scene: E.portrait(PHOTO, 'Counter-Squirrel Division · On Watch'),
      kicker: 'Squirrel Surveillance',
      copy: 'Sakura had been monitoring the fence line for some time.<br><span class="dry">The squirrel knew. The squirrel always knows.</span>',
      actions: [{ label: 'Begin the watch', onClick: bSquirrel }]
    });
  }
  function bSquirrel() {
    show({
      key: 'squirrel',
      scene: E.yard(function (s) { E.token(s, '🐿️', 'squirrel', 'Person of Interest', 'enter idle'); s.appendChild(E.frag('<span class="eye" style="left:54%;top:56%">👁️</span>')); }),
      kicker: 'Contact',
      copy: 'A squirrel appeared on the fence and made <span class="em">unnecessary</span> eye contact.<br><span class="dry">Sakura did not recognize it. The fence, however, has a reputation.</span>',
      actions: [{ label: 'Open a case file', onClick: bTanisha }]
    });
  }
  function bTanisha() {
    show({
      key: 'tanisha', scene: E.witness('Witness · Tanisha'),
      kicker: 'A witness appears',
      copy: 'Tanisha looked outside and immediately understood this was going to become <span class="em">a whole thing</span>.<br><span class="dry">She had seen Sakura’s squirrel record. There were no entries in the win column.</span>',
      actions: [{ label: 'Continue', onClick: bBriefing }]
    });
  }
  function bBriefing() {
    var s = E.scene('<div class="yard"></div><div class="evidence-cards">' +
      '<div class="ev-card"><span class="ev-lab">Exhibit A</span>Fence disturbance, ongoing.</div>' +
      '<div class="ev-card"><span class="ev-lab">Exhibit B</span>Suspicious tail movement.</div>' +
      '<div class="ev-card"><span class="ev-lab">Exhibit C</span>Unauthorized, sustained eye contact.</div>' +
      '</div>');
    show({
      key: 'briefing', scene: s,
      kicker: 'Intelligence briefing',
      copy: 'The evidence was thin.<br>Sakura considered it <span class="em">overwhelming</span>.',
      actions: [{ label: 'Choose a response', onClick: bChoice }]
    });
  }
  function bChoice() {
    var body = document.createElement('div');
    body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.gap = '0.5rem';
    ['surveillance', 'charge', 'pretend'].forEach(function (id) {
      var c = BRANCH[id];
      var btn = E.frag('<button class="choice"><span class="ch-name">' + c.label + '</span><span class="ch-sub">' + c.sub + '</span></button>');
      btn.addEventListener('click', function () { choose(id); });
      body.appendChild(btn);
    });
    show({ key: 'choice', kicker: 'Your call', copy: 'How does Sakura handle the suspect?', body: body, actions: [] });
  }
  function choose(id) { state.choice = id; bApproach(); }

  function bApproach() {
    var c = BRANCH[state.choice];
    show({
      key: 'approach', scene: E.yard(c.scene),
      kicker: c.label, copy: c.approach,
      actions: [{ label: 'Proceed →', onClick: bAction }]
    });
  }
  function bAction() {
    var c = BRANCH[state.choice];
    var hit;
    var s = E.yard(function (sc) { hit = E.track(sc, { glyph: c.glyph, zone: c.zone }); });
    var b = document.createElement('button');
    b.className = 'btn'; b.id = 'btn-act'; b.textContent = c.actionLabel;
    b.addEventListener('click', function () { resolveAction(hit ? hit.evaluate() : false); });
    show({
      key: 'action', scene: s,
      kicker: 'The moment',
      copy: '<span class="dry">' + c.actionHint + '</span>',
      actions: [{ render: b }]
    });
  }
  function resolveAction(clean) {
    state.clean = !!clean;
    var s = document.querySelector('.scene');
    if (s) E.burst(s, 40, 56, ['💨', '🍂']);
    bComplication();
  }
  function bComplication() {
    var c = BRANCH[state.choice];
    show({
      key: 'complication', scene: E.yard(function (sc) { E.burst(sc, 40, 56, ['💨', '🍂']); sc.appendChild(E.frag('<span class="dust" style="left:36%;top:56%">💨</span>')); E.paws(sc, [[30, 78, -6], [42, 72, 8]]); }),
      kicker: state.clean ? 'Textbook execution' : 'A complication',
      copy: c.complication(state.clean),
      actions: [{ label: 'Continue', onClick: bEvidence }]
    });
  }
  function bEvidence() {
    var c = BRANCH[state.choice];
    state._evidence = rand(c.evidence);
    show({
      key: 'evidence', scene: E.yard(function (sc) { sc.appendChild(E.frag('<span class="dust" style="left:48%;top:54%">🍂</span>')); E.paws(sc, [[40, 74, -8], [52, 70, 10]]); }),
      kicker: 'The scene',
      copy: 'Evidence recovered: <span class="em">' + state._evidence + '</span>',
      actions: [{ label: 'File the report', onClick: bReaction }]
    });
  }
  function bReaction() {
    var c = BRANCH[state.choice];
    state._tanisha = rand(c.tanisha);
    show({
      key: 'reaction', scene: E.witness('Tanisha · Statement'),
      kicker: 'The witness speaks',
      copy: '“' + state._tanisha + '”',
      actions: [{ label: 'See the official record →', onClick: bReport }]
    });
  }

  function buildReport() {
    var c = BRANCH[state.choice];
    return {
      title: 'Squirrel Surveillance',
      choice: state.choice,
      stamp: c.stamp,
      stampSub: rand(c.stampSub),
      official: c.official,
      likely: c.likely,
      witness: state._tanisha || rand(c.tanisha),
      evidence: state._evidence || rand(c.evidence),
      status: rand(c.status),     // ALWAYS a variant of "Uncaught"
      statusLabel: 'Squirrel Status',
      caseNo: E.caseNo('S')
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
        { render: E.btn('Try Another Approach', function () { state.choice = null; bChoice(); }, true) },
        { render: E.btn('← Back to Incident Files', function () { window.location.href = '../index.html'; }, true) }
      ]
    });
  }

  function restart() {
    state.choice = null; state.clean = null; state.report = null;
    state._evidence = null; state._tanisha = null; state.beat = 'intro';
    bIntro();
  }

  // ---- boot ----------------------------------------------------------------
  function init() {
    E.mount({ panelId: 'panel', progressFillId: 'progress-fill', beats: BEATS });
    bIntro();

    // Test seam — drive the episode deterministically.
    window.__tc = {
      state: state, start: bIntro, choose: choose,
      act: function (clean) { if (state.beat !== 'action') { if (!state.choice) state.choice = 'surveillance'; bAction(); } resolveAction(clean !== false); },
      reachReport: function (id) {
        state.choice = id || 'surveillance'; state.clean = true;
        state._evidence = rand(BRANCH[state.choice].evidence);
        state._tanisha = rand(BRANCH[state.choice].tanisha);
        bReport();
      },
      again: restart, getReport: function () { return state.report; }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
