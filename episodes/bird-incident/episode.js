/* =============================================================
   Episode 1 — The Bird Incident
   Sakura Kills Everything. An authored, playable comic episode.
   Migrated from the Tanisha Cut (v0.7R); story preserved verbatim,
   now built on the shared episode shell. For Tanisha.
   ============================================================= */
(function () {
  'use strict';

  var E = window.SakuraEpisode;
  var rand = E.rand;
  var PHOTO = '../../src/assets/sakura/sakura-home.jpg';

  var BEATS = ['portrait', 'yard', 'bird', 'notices', 'tanisha', 'escalation', 'choice', 'approach', 'action', 'complication', 'evidence', 'reaction', 'report'];

  // ---- branch content (the heart of the episode) ---------------------------
  var BRANCH = {
    stalk: {
      label: 'Stalk with dignity',
      sub: 'One paw at a time. The lawn may be subpoenaed later.',
      approach: 'Sakura lowers herself into the grass and begins to advance one deliberate paw at a time, as if the entire backyard were under oath.',
      actionLabel: 'Hold… then strike',
      zone: { left: 36, width: 28 },
      scene: function (s) { E.paws(s, [[22, 78, -10], [33, 72, 8], [44, 66, -6], [54, 60, 10]]); E.token(s, '🐦', 'bird', 'Airspace Violation', 'idle'); },
      complication: function (clean) {
        return clean
          ? 'The bird, sensing nothing, preens. Sakura covers the final three feet as a single, silent act of God.'
          : 'A leaf moves. Sakura briefly opens a second investigation into the leaf. The bird is downgraded to “still a person of interest.”';
      },
      evidence: ['Three feathers, recovered. Grass: disturbed with intent.', 'Two feathers and one (1) deeply committed dog.'],
      tanisha: ['Tanisha respected the commitment, if not the method.', 'Tanisha admits the stalking was, technically, impressive.'],
      official: 'Sakura executed a disciplined airspace-denial operation with textbook patience.',
      likely: 'She crept three feet, paused for dramatic effect, and then simply exploded.',
      stamp: 'Disciplined Victory',
      stampSub: ['Patience: weaponized', 'Method: unimpeachable']
    },
    launch: {
      label: 'Launch immediately',
      sub: 'Subtlety was never on the table.',
      approach: 'Sakura abandons subtlety entirely. There is no plan. There is only velocity and conviction.',
      actionLabel: 'AUTHORIZE LAUNCH',
      zone: { left: 26, width: 48 },
      scene: function (s) { s.appendChild(E.frag('<div class="streak"></div>')); E.token(s, '🐦', 'bird', 'Airspace Violation', 'idle'); },
      complication: function (clean) {
        return clean
          ? 'Impact. A thump. A small weather system of feathers. The yard is, briefly, snowing.'
          : 'Sakura arrives a heartbeat early, overshoots the bird, and pivots so hard she invents a new sound.';
      },
      evidence: ['Feathers (several). Velocity: unreviewed.', 'One thump, on record. Witnesses: rattled.'],
      tanisha: ['Tanisha would like advance notice before future launches.', 'Tanisha has requested a warning system be installed.'],
      official: 'Sakura responded to the violation with appropriate and immediate force.',
      likely: 'Tanisha saw a blur, heard a thump, and then the yard had feathers in it.',
      stamp: 'Immediate Force Authorized',
      stampSub: ['Notice given: none', 'Regret: also none']
    },
    bark: {
      label: 'Bark first, investigate later',
      sub: 'Announce the operation to three backyards.',
      approach: 'Sakura issues a formal vocal warning to the bird, the sky, and the neighbors, in that order, at full volume.',
      actionLabel: 'Issue the warning',
      zone: { left: 40, width: 22 },
      scene: function (s) { s.appendChild(E.frag('<div class="bark">BORK!</div>')); E.token(s, '🐦', 'bird', 'Airspace Violation', 'idle'); },
      complication: function (clean) {
        return clean
          ? 'The bird, now fully briefed on the situation, departs. Sakura logs this as voluntary compliance.'
          : 'The warning is so thorough the bird leaves before Sakura finishes. Sakura finishes anyway. For the record.';
      },
      evidence: ['No feathers. The volume, however, is well-documented.', 'Evidence: airborne. Warning: extremely clear.'],
      tanisha: ['Tanisha confirms the barking was real.', 'Tanisha heard the warning. So did the entire street.'],
      official: 'Sakura issued a lawful and unmistakable warning prior to engagement.',
      likely: 'The bird had already left, but the warning was, by all accounts, magnificent.',
      stamp: 'Victory By Announcement',
      stampSub: ['Volume: maximum', 'Compliance: assumed']
    }
  };

  // ---- state ---------------------------------------------------------------
  var state = { beat: 'portrait', choice: null, clean: null, report: null, _evidence: null, _tanisha: null };
  function show(opts) { state.beat = opts.key; E.render(opts); }

  // ---- beats ---------------------------------------------------------------
  function bPortrait() {
    show({
      key: 'portrait',
      scene: E.portrait(PHOTO, 'Warden of the Perimeter · On Duty'),
      kicker: 'The Bird Incident',
      copy: 'Sakura was monitoring the yard.<br>This was not paranoia.<br>This was <span class="em">policy</span>.',
      actions: [{ label: 'Continue', onClick: bYard }]
    });
  }
  function bYard() {
    show({
      key: 'yard', scene: E.yard(),
      copy: 'The yard appeared quiet.<br><span class="dry">Sakura knew better.</span>',
      actions: [{ label: 'Continue', onClick: bBird }]
    });
  }
  function bBird() {
    show({
      key: 'bird', scene: E.yard(function (s) { E.token(s, '🐦', 'bird', 'Airspace Violation', 'enter idle'); }),
      kicker: 'Incoming',
      copy: 'A bird entered restricted airspace.<br><span class="dry">It did not file the appropriate paperwork.</span>',
      actions: [{ label: 'Log the violation', onClick: bNotices }]
    });
  }
  function bNotices() {
    show({
      key: 'notices', scene: E.yard(function (s) { E.token(s, '🐦', 'bird', 'Airspace Violation', 'idle'); s.appendChild(E.frag('<div class="pulse"></div>')); E.paws(s, [[20, 80, -10], [30, 74, 8]]); }),
      copy: 'Sakura saw the bird.<br>The bird, for the moment, still had <span class="em">options</span>.',
      actions: [{ label: 'Continue', onClick: bTanisha }]
    });
  }
  function bTanisha() {
    show({
      key: 'tanisha', scene: E.witness('Witness · Tanisha'),
      kicker: 'A witness appears',
      copy: 'Tanisha looked outside at <span class="em">exactly</span> the wrong time.<br><span class="dry">She would remember this. Differently than Sakura.</span>',
      actions: [{ label: 'Continue', onClick: bEscalation }]
    });
  }
  function bEscalation() {
    var s = E.scene('<div class="yard"></div><div class="thoughts">' +
      '<div class="thought t1">Option A: Observe.</div>' +
      '<div class="thought t2">Option B: Investigate.</div>' +
      '<div class="thought t3">Option C: Absolutely Not.</div></div>');
    show({
      key: 'escalation', scene: s,
      copy: 'Sakura reviewed the available options.<br><span class="dry">None of them involved forgiveness.</span>',
      actions: [{ label: 'Decide', onClick: bChoice }]
    });
  }
  function bChoice() {
    var body = document.createElement('div');
    body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.gap = '0.5rem';
    ['stalk', 'launch', 'bark'].forEach(function (id) {
      var c = BRANCH[id];
      var btn = E.frag('<button class="choice"><span class="ch-name">' + c.label + '</span><span class="ch-sub">' + c.sub + '</span></button>');
      btn.addEventListener('click', function () { choose(id); });
      body.appendChild(btn);
    });
    show({ key: 'choice', kicker: 'Your call', copy: 'How does Sakura respond to the violation?', body: body, actions: [] });
  }
  function choose(id) { state.choice = id; bApproach(); }

  function bApproach() {
    var c = BRANCH[state.choice];
    show({
      key: 'approach', scene: E.yard(c.scene),
      kicker: c.label, copy: c.approach,
      actions: [{ label: 'Move in →', onClick: bAction }]
    });
  }

  function bAction() {
    var c = BRANCH[state.choice];
    var hit;
    var s = E.yard(function (sc) { hit = E.track(sc, { glyph: '🐦', zone: c.zone }); });
    var b = document.createElement('button');
    b.className = 'btn'; b.id = 'btn-strike'; b.textContent = c.actionLabel;
    b.addEventListener('click', function () { resolveAction(hit ? hit.evaluate() : false); });
    show({
      key: 'action', scene: s,
      kicker: 'The moment',
      copy: '<span class="dry">Tap when the bird drifts into the marked zone. Easy does it.</span>',
      actions: [{ render: b }]
    });
  }
  function resolveAction(clean) {
    state.clean = !!clean;
    var s = document.querySelector('.scene');
    if (s) E.burst(s, 50, 42);
    bComplication();
  }

  function bComplication() {
    var c = BRANCH[state.choice];
    show({
      key: 'complication', scene: E.yard(function (sc) { E.burst(sc, 50, 40); E.paws(sc, [[48, 64, 6]]); }),
      kicker: state.clean ? 'Clean contact' : 'A complication',
      copy: c.complication(state.clean),
      actions: [{ label: 'Continue', onClick: bEvidence }]
    });
  }
  function bEvidence() {
    var c = BRANCH[state.choice];
    state._evidence = rand(c.evidence);
    show({
      key: 'evidence', scene: E.yard(function (sc) { E.burst(sc, 46, 50); E.paws(sc, [[40, 70, -8], [52, 66, 10]]); }),
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
      title: 'The Bird Incident',
      choice: state.choice,
      stamp: c.stamp,
      stampSub: rand(c.stampSub),
      official: c.official,
      likely: c.likely,
      witness: state._tanisha || rand(c.tanisha),
      evidence: state._evidence || rand(c.evidence),
      status: 'Resolved (Airspace Cleared)',
      statusLabel: 'Bird Status',
      caseNo: E.caseNo('B')
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
    state._evidence = null; state._tanisha = null; state.beat = 'portrait';
    bPortrait();
  }

  // ---- boot ----------------------------------------------------------------
  function init() {
    E.mount({ panelId: 'panel', progressFillId: 'progress-fill', beats: BEATS });
    bPortrait();

    // Test seam — drive the episode deterministically.
    window.__tc = {
      state: state, start: bPortrait, choose: choose,
      act: function (clean) { if (state.beat !== 'action') { if (!state.choice) state.choice = 'stalk'; bAction(); } resolveAction(clean !== false); },
      reachReport: function (id) {
        state.choice = id || 'stalk'; state.clean = true;
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
