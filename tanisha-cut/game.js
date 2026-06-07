/* =============================================================
   Sakura Kills Everything: The Bird Incident — Tanisha Cut v0.7R
   One standalone, authored, playable episode. No dependencies, no
   build, no old systems. Open index.html and play. For Tanisha.
   ============================================================= */
(function () {
  'use strict';

  var PHOTO = '../src/assets/sakura/sakura-home.jpg';
  var panel, progressFill;

  // ---- tiny helpers --------------------------------------------------------
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function caseNo() { return 'SKE-' + (Math.floor(Math.random() * 9000) + 1000) + '-B'; }

  function frag(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }

  var PROGRESS = ['portrait', 'yard', 'bird', 'notices', 'tanisha', 'escalation', 'choice', 'approach', 'action', 'complication', 'evidence', 'reaction', 'report'];
  function setProgress(key) {
    var i = PROGRESS.indexOf(key);
    if (i >= 0 && progressFill) progressFill.style.width = Math.round((i / (PROGRESS.length - 1)) * 100) + '%';
  }

  /** render({ key, scene, kicker, copy, actions }) — actions: [{label, onClick, ghost, render}] */
  function render(opts) {
    state.beat = opts.key;
    setProgress(opts.key);
    panel.innerHTML = '';
    if (opts.scene) panel.appendChild(opts.scene);
    if (opts.kicker) panel.appendChild(frag('<p class="kicker">' + opts.kicker + '</p>'));
    if (opts.copy) { var c = document.createElement('div'); c.className = 'copy'; c.innerHTML = opts.copy; panel.appendChild(c); }
    if (opts.body) panel.appendChild(opts.body);
    var actions = document.createElement('div');
    actions.className = 'actions';
    (opts.actions || []).forEach(function (a) {
      if (a.render) { actions.appendChild(a.render); return; }
      var b = document.createElement('button');
      b.className = 'btn' + (a.ghost ? ' btn--ghost' : '');
      b.textContent = a.label;
      b.addEventListener('click', a.onClick);
      actions.appendChild(b);
    });
    panel.appendChild(actions);
  }

  // ---- scene builders ------------------------------------------------------
  function yard(extra) {
    var s = document.createElement('div');
    s.className = 'scene scene-fixed';
    s.innerHTML = '<div class="yard"><div class="sun"></div><div class="clouds"></div><div class="fence"></div><div class="grass"></div><div class="patio"></div></div>';
    if (typeof extra === 'function') extra(s);
    return s;
  }
  function addBird(scene, cls) {
    var b = frag('<div class="bird ' + (cls || '') + '"><span class="glyph">🐦</span><span class="tag">Airspace Violation</span></div>');
    scene.appendChild(b); return b;
  }
  function addPaws(scene, points) {
    points.forEach(function (p, i) {
      var paw = frag('<span class="paw">🐾</span>');
      paw.style.left = p[0] + '%'; paw.style.top = p[1] + '%';
      paw.style.setProperty('--r', (p[2] || 0) + 'deg');
      paw.style.animationDelay = (0.12 * i) + 's';
      scene.appendChild(paw);
    });
  }
  function feathers(scene, x, y) {
    for (var i = 0; i < 6; i++) {
      var f = frag('<span class="feather">' + (i % 2 ? '🪶' : '✨') + '</span>');
      f.style.left = x + '%'; f.style.top = y + '%';
      f.style.setProperty('--dx', (Math.random() * 90 - 45) + 'px');
      f.style.setProperty('--dy', (-Math.random() * 70 - 10) + 'px');
      f.style.setProperty('--rot', (Math.random() * 320 - 160) + 'deg');
      f.style.animation = 'feather 0.9s ease-out forwards';
      f.style.animationDelay = (Math.random() * 0.2) + 's';
      scene.appendChild(f);
    }
  }
  function portraitScene(caption) {
    var s = document.createElement('div');
    s.className = 'scene scene-fixed';
    s.innerHTML = '<div class="yard" style="opacity:0.5"></div>' +
      '<div class="portrait-wrap"><figure class="portrait"><img alt="Sakura"></figure></div>' +
      (caption ? '<div class="scene-cap">' + caption + '</div>' : '');
    var img = s.querySelector('img');
    img.addEventListener('error', function () { var fig = s.querySelector('.portrait'); fig.classList.add('is-fallback'); fig.textContent = '🐾'; });
    img.src = PHOTO;
    return s;
  }

  // ---- branch content ------------------------------------------------------
  var BRANCH = {
    stalk: {
      label: 'Stalk with dignity',
      sub: 'One paw at a time. The lawn may be subpoenaed later.',
      approach: 'Sakura lowers herself into the grass and begins to advance one deliberate paw at a time, as if the entire backyard were under oath.',
      actionLabel: 'Hold… then strike',
      zone: { left: 36, width: 28 },
      scene: function (s) { addPaws(s, [[22, 78, -10], [33, 72, 8], [44, 66, -6], [54, 60, 10]]); addBird(s, 'idle'); },
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
      scene: function (s) { var st = frag('<div class="streak"></div>'); s.appendChild(st); addBird(s, 'idle'); },
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
      scene: function (s) { s.appendChild(frag('<div class="bark">BORK!</div>')); addBird(s, 'idle'); },
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
  var state = { beat: 'portrait', choice: null, clean: null, report: null };

  // ---- beats ---------------------------------------------------------------
  function bPortrait() {
    render({
      key: 'portrait',
      scene: portraitScene('Warden of the Perimeter · On Duty'),
      kicker: 'The Bird Incident',
      copy: 'Sakura was monitoring the yard.<br>This was not paranoia.<br>This was <span class="em">policy</span>.',
      actions: [{ label: 'Continue', onClick: bYard }]
    });
  }
  function bYard() {
    render({
      key: 'yard', scene: yard(),
      copy: 'The yard appeared quiet.<br><span class="dry">Sakura knew better.</span>',
      actions: [{ label: 'Continue', onClick: bBird }]
    });
  }
  function bBird() {
    render({
      key: 'bird', scene: yard(function (s) { addBird(s, 'enter idle'); }),
      kicker: 'Incoming',
      copy: 'A bird entered restricted airspace.<br><span class="dry">It did not file the appropriate paperwork.</span>',
      actions: [{ label: 'Log the violation', onClick: bNotices }]
    });
  }
  function bNotices() {
    render({
      key: 'notices', scene: yard(function (s) { addBird(s, 'idle'); s.appendChild(frag('<div class="pulse"></div>')); addPaws(s, [[20, 80, -10], [30, 74, 8]]); }),
      copy: 'Sakura saw the bird.<br>The bird, for the moment, still had <span class="em">options</span>.',
      actions: [{ label: 'Continue', onClick: bTanisha }]
    });
  }
  function bTanisha() {
    var s = document.createElement('div');
    s.className = 'scene scene-fixed';
    s.innerHTML = '<div class="witness"><div class="window"><div class="curtain l"></div><div class="curtain r"></div></div><div class="witness-tag">Witness · Tanisha</div></div>';
    render({
      key: 'tanisha', scene: s,
      kicker: 'A witness appears',
      copy: 'Tanisha looked outside at <span class="em">exactly</span> the wrong time.<br><span class="dry">She would remember this. Differently than Sakura.</span>',
      actions: [{ label: 'Continue', onClick: bEscalation }]
    });
  }
  function bEscalation() {
    var s = document.createElement('div');
    s.className = 'scene scene-fixed';
    s.innerHTML = '<div class="yard"></div><div class="thoughts">' +
      '<div class="thought t1">Option A: Observe.</div>' +
      '<div class="thought t2">Option B: Investigate.</div>' +
      '<div class="thought t3">Option C: Absolutely Not.</div></div>';
    render({
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
      var btn = frag('<button class="choice"><span class="ch-name">' + c.label + '</span><span class="ch-sub">' + c.sub + '</span></button>');
      btn.addEventListener('click', function () { choose(id); });
      body.appendChild(btn);
    });
    render({ key: 'choice', kicker: 'Your call', copy: 'How does Sakura respond to the violation?', body: body, actions: [] });
  }
  function choose(id) { state.choice = id; bApproach(); }

  function bApproach() {
    var c = BRANCH[state.choice];
    render({
      key: 'approach', scene: yard(c.scene),
      kicker: c.label,
      copy: c.approach,
      actions: [{ label: 'Move in →', onClick: bAction }]
    });
  }

  function bAction() {
    var c = BRANCH[state.choice];
    var s = yard(function (sc) {
      var track = frag('<div class="track"><div class="zone"></div><div class="runner">🐦</div></div>');
      sc.appendChild(track);
      var zone = track.querySelector('.zone');
      zone.style.left = c.zone.left + '%'; zone.style.width = c.zone.width + '%';
      var runner = track.querySelector('.runner');
      runner.style.animation = 'run 1.4s ease-in-out infinite alternate';
    });
    var btn = document.createElement('button');
    btn.className = 'btn'; btn.id = 'btn-strike'; btn.textContent = c.actionLabel;
    btn.addEventListener('click', function () {
      var runner = s.querySelector('.runner'); var zone = s.querySelector('.zone');
      var clean = false;
      if (runner && zone) {
        var rr = runner.getBoundingClientRect(), zr = zone.getBoundingClientRect();
        var rc = rr.left + rr.width / 2;
        clean = rc >= zr.left && rc <= zr.right;
        runner.style.animationPlayState = 'paused';
      }
      resolveAction(clean);
    });
    render({
      key: 'action', scene: s,
      kicker: 'The moment',
      copy: '<span class="dry">Tap when the bird drifts into the marked zone. Easy does it.</span>',
      actions: [{ render: btn }]
    });
  }
  function resolveAction(clean) {
    state.clean = !!clean;
    var s = panel.querySelector('.scene');
    if (s) { feathers(s, 50, 42); }
    bComplication();
  }

  function bComplication() {
    var c = BRANCH[state.choice];
    render({
      key: 'complication', scene: yard(function (sc) { feathers(sc, 50, 40); addPaws(sc, [[48, 64, 6]]); }),
      kicker: state.clean ? 'Clean contact' : 'A complication',
      copy: c.complication(state.clean),
      actions: [{ label: 'Continue', onClick: bEvidence }]
    });
  }

  function bEvidence() {
    var c = BRANCH[state.choice];
    state._evidence = rand(c.evidence);
    var s = yard(function (sc) { feathers(sc, 46, 50); addPaws(sc, [[40, 70, -8], [52, 66, 10]]); });
    render({
      key: 'evidence', scene: s,
      kicker: 'The scene',
      copy: 'Evidence recovered: <span class="em">' + state._evidence + '</span>',
      actions: [{ label: 'File the report', onClick: bReaction }]
    });
  }

  function bReaction() {
    var c = BRANCH[state.choice];
    state._tanisha = rand(c.tanisha);
    var s = document.createElement('div');
    s.className = 'scene scene-fixed';
    s.innerHTML = '<div class="witness"><div class="window"><div class="curtain l"></div><div class="curtain r"></div></div><div class="witness-tag">Tanisha · Statement</div></div>';
    render({
      key: 'reaction', scene: s,
      kicker: 'The witness speaks',
      copy: '“' + state._tanisha + '”',
      actions: [{ label: 'See the official record →', onClick: bReport }]
    });
  }

  function buildReport() {
    var c = BRANCH[state.choice];
    return {
      choice: state.choice,
      stamp: c.stamp,
      stampSub: rand(c.stampSub),
      official: c.official,
      likely: c.likely,
      witness: state._tanisha || rand(c.tanisha),
      evidence: state._evidence || rand(c.evidence),
      caseNo: caseNo()
    };
  }

  function bReport() {
    var r = buildReport();
    state.report = r;
    var rep = document.createElement('div');
    rep.className = 'report';
    rep.innerHTML =
      '<p class="r-file">Official Incident File · The Bird Incident</p>' +
      '<p class="r-title">The Bird Incident</p>' +
      '<div class="r-stamp-row"><span class="stamp slam">' + r.stamp + '</span></div>' +
      '<div class="r-block r-official"><span class="r-lab">Official Interpretation</span><p>' + r.official + '</p></div>' +
      '<div class="r-block r-reality"><span class="r-lab">Likely Reality</span><p>' + r.likely + '</p></div>' +
      '<div class="r-witness"><span class="r-lab">Tanisha · Witness Note</span><p>' + r.witness + '</p></div>' +
      '<p class="r-evidence"><strong>Evidence:</strong> ' + r.evidence + '</p>' +
      '<p class="r-case">' + r.caseNo + ' · ' + r.stampSub + '</p>';

    render({ key: 'report', body: rep, actions: [{ render: actionButton('Play Again', restart) }, { render: actionButton('Try Another Approach', function () { state.choice = null; bChoice(); }, true) }] });
  }
  function actionButton(label, onClick, ghost) {
    var b = document.createElement('button'); b.className = 'btn' + (ghost ? ' btn--ghost' : ''); b.textContent = label; b.addEventListener('click', onClick); return b;
  }

  function restart() {
    // Mutate in place so external references (test seam) stay valid.
    state.choice = null; state.clean = null; state.report = null;
    state._evidence = null; state._tanisha = null; state.beat = 'portrait';
    bPortrait();
  }

  // ---- boot ----------------------------------------------------------------
  function init() {
    panel = document.getElementById('panel');
    progressFill = document.getElementById('progress-fill');
    bPortrait();

    // Test seam — drive the episode deterministically.
    window.__tc = {
      state: state,
      start: bPortrait,
      choose: choose,
      act: function (clean) { if (state.beat !== 'action') { if (!state.choice) state.choice = 'stalk'; bAction(); } resolveAction(clean !== false); },
      // run a full branch quickly to the report
      reachReport: function (id) {
        state.choice = id || 'stalk';
        state.clean = true;
        state._evidence = rand(BRANCH[state.choice].evidence);
        state._tanisha = rand(BRANCH[state.choice].tanisha);
        bReport();
      },
      again: restart,
      getReport: function () { return state.report; }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
