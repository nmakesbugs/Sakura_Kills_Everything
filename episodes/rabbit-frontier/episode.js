/* =============================================================
   Episode 3 — Rabbit at the Garden Frontier
   A tiny chase-map comic. Same authored-episode structure, but the
   middle "toy" is a small 5-node backyard chase board instead of a
   timed action. Built on the shared episode shell. For Tanisha.
   ============================================================= */
(function () {
  'use strict';

  var E = window.SakuraEpisode;
  var rand = E.rand;
  var PHOTO = '../../src/assets/sakura/sakura-home.jpg';

  var BEATS = ['intro', 'rabbit', 'tanisha', 'map', 'round1', 'round2', 'complication', 'round3', 'lunge', 'evidence', 'reaction', 'report'];

  // ---- the chase board -----------------------------------------------------
  var NODES = {
    patio:  { label: 'Patio',      x: 50, y: 84 },
    garden: { label: 'Garden',     x: 19, y: 54 },
    grass:  { label: 'Grass',      x: 50, y: 53 },
    bushes: { label: 'Bushes',     x: 81, y: 54 },
    fence:  { label: 'Fence Line', x: 50, y: 20 }
  };
  var EDGES = [['patio', 'grass'], ['patio', 'garden'], ['garden', 'grass'], ['garden', 'bushes'], ['grass', 'fence'], ['bushes', 'fence']];
  var ADJ = {
    patio: ['grass', 'garden'],
    garden: ['patio', 'grass', 'bushes'],
    grass: ['patio', 'garden', 'fence'],
    bushes: ['garden', 'fence'],
    fence: ['grass', 'bushes']
  };
  // Concrete, visual route copy per destination node.
  var ROUTE_COPY = {
    grass: 'Cut through the grass',
    garden: 'Guard the garden',
    bushes: 'Charge the bushes',
    fence: 'Block the fence line',
    patio: 'Fall back to the patio'
  };

  function dist(a, b) { // BFS shortest path on the small graph
    if (a === b) return 0;
    var seen = {}, q = [[a, 0]]; seen[a] = true;
    while (q.length) {
      var cur = q.shift();
      var ns = ADJ[cur[0]];
      for (var i = 0; i < ns.length; i++) {
        if (ns[i] === b) return cur[1] + 1;
        if (!seen[ns[i]]) { seen[ns[i]] = true; q.push([ns[i], cur[1] + 1]); }
      }
    }
    return 99;
  }
  function adjacent(a, b) { return dist(a, b) === 1; }

  // ---- outcome families ----------------------------------------------------
  var OUTCOMES = {
    intercept: {
      stamp: 'Garden Secured',
      official: 'Sakura executed a successful containment maneuver at the Garden Frontier.',
      likely: 'The rabbit changed direction and Sakura took credit for it.',
      tanisha: ['Tanisha confirms Sakura looked very busy.', 'Tanisha agrees the garden was, eventually, secured.'],
      evidence: ['Disturbed mulch. One (1) cornered rabbit, briefly. Border: restored.', 'Paw prints forming a confident, slightly smug perimeter.'],
      status: ['Retreated from the Garden Frontier', 'Morally defeated']
    },
    overcommit: {
      stamp: 'Force Applied',
      official: 'Sakura applied overwhelming pressure across contested territory.',
      likely: 'She ran very fast in mostly the correct direction.',
      tanisha: ['Tanisha heard the acceleration before she saw the dog.', 'Tanisha would like the lawn’s permission noted for the record.'],
      evidence: ['Two divots, one airborne leaf, and a great deal of conviction.', 'Skid marks. The rabbit’s exact route remains a matter of debate.'],
      status: ['Temporarily beyond jurisdiction', 'Physically unavailable']
    },
    escape: {
      stamp: 'Suspect Fled',
      official: 'Sakura forced the suspect to flee the jurisdiction.',
      likely: 'The rabbit left.',
      tanisha: ['Tanisha is unwilling to call this a capture.', 'Tanisha watched the rabbit clear the fence at its leisure.'],
      evidence: ['One gap in the fence line. No rabbit. A faint sense of insult.', 'Tracks leading directly, and rudely, out of bounds.'],
      status: ['Escaped, under protest', 'Beyond the fence line, legally questionable']
    },
    leaf: {
      stamp: 'Investigation Expanded',
      official: 'Sakura expanded the investigation to include environmental accomplices.',
      likely: 'A leaf moved.',
      tanisha: ['Tanisha would like the leaf removed from the report.', 'Tanisha confirms the leaf was, at no point, the rabbit.'],
      evidence: ['One leaf, interrogated thoroughly. Rabbit status: unobserved.', 'A leaf. That is the evidence. The rabbit used the distraction wisely.'],
      status: ['Unobserved (see: leaf)', 'Forgotten, briefly']
    }
  };

  var RABBIT_LINES = [
    'The rabbit reconsidered nothing.',
    'The rabbit made a small, insulting hop.',
    'The rabbit used the bushes without permission.',
    'The rabbit appeared calm. This was provocative.',
    'The rabbit moved toward the fence, legally questionable.',
    'The rabbit paused, purely to make a point.'
  ];

  // ---- state ---------------------------------------------------------------
  var state = {
    beat: 'intro', sakura: 'patio', rabbit: 'garden', path: ['patio'],
    directCharges: 0, caught: false, rabbitEscaped: false, leafBait: false,
    lunge: null, report: null, _evidence: null, _tanisha: null, _consequence: ''
  };
  function show(opts) { state.beat = opts.key; E.render(opts); }

  // ---- map rendering -------------------------------------------------------
  function mapScene(opts) {
    opts = opts || {};
    var open = opts.openFrom ? ADJ[opts.openFrom] : [];
    var s = E.scene('<div class="yard"></div>');
    var map = document.createElement('div');
    map.className = 'chase-map';

    // edges (SVG, stretched to the scene via preserveAspectRatio="none")
    var lines = EDGES.map(function (e) {
      var a = NODES[e[0]], b = NODES[e[1]];
      var hot = (open.indexOf(e[0]) >= 0 && e[1] === opts.openFrom) || (open.indexOf(e[1]) >= 0 && e[0] === opts.openFrom);
      return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"' + (hot ? ' class="hot"' : '') + '/>';
    }).join('');
    map.innerHTML = '<svg class="map-edges" viewBox="0 0 100 100" preserveAspectRatio="none">' + lines + '</svg>';

    // nodes
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id];
      var isOpen = open.indexOf(id) >= 0;
      var node = E.frag('<div class="node' + (isOpen ? ' is-open' : '') + '"><span class="dot"></span><span class="nlabel">' + n.label + '</span></div>');
      node.style.left = n.x + '%'; node.style.top = n.y + '%';
      map.appendChild(node);
    });

    // tokens
    var sk = NODES[state.sakura], rb = NODES[state.rabbit];
    var sakuraTok = E.frag('<div class="tok sakura">🐾<span class="ttag">Sakura</span></div>');
    sakuraTok.style.left = sk.x + '%'; sakuraTok.style.top = sk.y + '%';
    var rabbitTok = E.frag('<div class="tok rabbit' + (opts.rabbitFlee ? ' flee' : '') + '">🐇<span class="ttag">Rabbit</span></div>');
    rabbitTok.style.left = rb.x + '%'; rabbitTok.style.top = rb.y + '%';
    map.appendChild(sakuraTok); map.appendChild(rabbitTok);

    // hud chips
    var d = dist(state.sakura, state.rabbit);
    var near = d <= 1;
    var hud = E.frag('<div class="chase-hud">' +
      '<span class="chase-chip">Round ' + (opts.round || '–') + '/3</span>' +
      '<span class="chase-chip ' + (near ? 'near' : 'far') + '">' + (d === 0 ? 'Contact!' : near ? 'Closing in' : 'Distance: ' + d) + '</span>' +
      '</div>');
    map.appendChild(hud);

    s.appendChild(map);
    return s;
  }

  // ---- beats ---------------------------------------------------------------
  function bIntro() {
    show({
      key: 'intro',
      scene: E.portrait(PHOTO, 'Garden Frontier · Border Patrol'),
      kicker: 'Rabbit at the Garden Frontier',
      copy: 'Sakura was conducting a routine inspection of the Garden Frontier.<br><span class="dry">Routine inspections rarely begin with rabbits.</span>',
      actions: [{ label: 'Continue', onClick: bRabbit }]
    });
  }
  function bRabbit() {
    show({
      key: 'rabbit',
      scene: E.yard(function (s) { E.token(s, '🐇', 'squirrel', 'Border Violation', 'enter idle'); }),
      kicker: 'Contact',
      copy: 'A rabbit appeared near the garden and <span class="em">pretended this was allowed</span>.<br><span class="dry">It did not recognize Sakura’s jurisdiction. Few do.</span>',
      actions: [{ label: 'Continue', onClick: bTanisha }]
    });
  }
  function bTanisha() {
    show({
      key: 'tanisha', scene: E.witness('Witness · Tanisha'),
      kicker: 'A witness appears',
      copy: 'Tanisha saw Sakura <span class="em">stop moving</span>.<br><span class="dry">That was the warning sign.</span>',
      actions: [{ label: 'Continue', onClick: bMap }]
    });
  }
  function bMap() {
    show({
      key: 'map', scene: mapScene({ round: 1 }),
      kicker: 'The Garden Frontier',
      copy: 'Sakura at the patio. The rabbit near the garden.<br><span class="dry">The rabbit made its first mistake: choosing a route.</span>',
      actions: [{ label: 'Begin chase', onClick: function () { bRound(1); } }]
    });
  }

  function routeButtons(round) {
    var open = ADJ[state.sakura];
    var grid = document.createElement('div');
    grid.className = 'route-grid';
    open.forEach(function (target) {
      var b = E.btn(ROUTE_COPY[target] || ('Move to ' + NODES[target].label), function () { chooseRoute(target, round); });
      grid.appendChild(b);
    });
    return grid;
  }

  function bRound(round) {
    show({
      key: 'round' + round, scene: mapScene({ round: round, openFrom: state.sakura }),
      kicker: 'Round ' + round + ' of 3',
      copy: 'Where does Sakura move? <span class="dry">(Glowing nodes are reachable.)</span>',
      body: routeButtons(round), actions: []
    });
  }

  function chooseRoute(target, round) {
    var before = dist(state.sakura, state.rabbit);
    state.sakura = target;
    state.path.push(target);
    var after = dist(state.sakura, state.rabbit);
    if (after < before) state.directCharges++;

    if (state.sakura === state.rabbit) {
      state.caught = true;
      state._consequence = 'Sakura lands exactly where the rabbit was standing. The rabbit, crucially, is no longer standing there.';
    } else {
      rabbitMove();
    }
    bRoundResult(round);
  }

  function rabbitMove() {
    var opts = ADJ[state.rabbit].slice();
    // rabbit avoids Sakura's new node and maximizes distance from her; biased to fence/bushes
    opts = opts.filter(function (n) { return n !== state.sakura; });
    if (!opts.length) { state._consequence = 'Cornered, the rabbit holds still and radiates innocence.'; return; }
    opts.sort(function (a, b) {
      var da = dist(state.sakura, a), db = dist(state.sakura, b);
      if (db !== da) return db - da;                 // farther from Sakura first
      var wa = (a === 'fence' ? 2 : a === 'bushes' ? 1 : 0);
      var wb = (b === 'fence' ? 2 : b === 'bushes' ? 1 : 0);
      return wb - wa;                                // then toward the border
    });
    // small wobble: usually best move, occasionally the runner-up
    var pick = (opts.length > 1 && Math.random() < 0.25) ? opts[1] : opts[0];
    state.rabbit = pick;
    if (pick === 'fence') state.rabbitEscaped = true;
    state._consequence = rand(RABBIT_LINES) + (pick === 'fence' ? ' The fence line is now in play.' : '');
  }

  function bRoundResult(round) {
    var next = round === 1 ? function () { bRound(2); }
            : round === 2 ? bComplication
            : bLunge;
    show({
      key: 'round' + round,
      scene: mapScene({ round: round, rabbitFlee: !state.caught }),
      kicker: state.caught ? 'Contact!' : 'The rabbit responds',
      copy: state._consequence,
      actions: [{ label: state.caught ? 'Press the advantage →' : (round === 3 ? 'Set up the lunge →' : 'Continue the chase →'), onClick: next }]
    });
  }

  function bComplication() {
    // Mid-chase: Tanisha reaction + a leaf diversion that depends on the player.
    show({
      key: 'complication',
      scene: mapScene({ round: 2 }),
      kicker: 'A complication',
      copy: '“Sakura…” said Tanisha, from the window.<br>At that exact moment, near Sakura’s paw, <span class="em">a leaf moved</span>.',
      actions: [
        { label: 'Investigate the leaf (briefly)', onClick: function () { state.leafBait = true; bRound(3); } },
        { label: 'Ignore it. Stay on mission.', onClick: function () { bRound(3); }, ghost: true }
      ]
    });
  }

  function bLunge() {
    show({
      key: 'lunge',
      scene: mapScene({ round: 3, rabbitFlee: true }),
      kicker: 'The final lunge',
      copy: 'One move left. <span class="dry">How does Sakura finish this?</span>',
      actions: [
        { label: 'Commit to the lunge', onClick: function () { resolveLunge('commit'); } },
        { label: 'Hesitate, then decide', onClick: function () { resolveLunge('hesitate'); }, ghost: true },
        { label: 'Overcommit spectacularly', onClick: function () { resolveLunge('overcommit'); }, ghost: true }
      ]
    });
  }
  function resolveLunge(kind) {
    state.lunge = kind;
    if (kind === 'commit' && adjacent(state.sakura, state.rabbit)) state.caught = true;
    if (kind === 'hesitate') state.rabbitEscaped = true;       // the pause lets it slip
    bEvidence();
  }

  function pickOutcome() {
    if (state.leafBait && !state.caught) return 'leaf';
    if (state.caught) return 'intercept';
    if (state.rabbitEscaped) return 'escape';
    if (state.lunge === 'overcommit' || state.directCharges >= 2) return 'overcommit';
    return adjacent(state.sakura, state.rabbit) ? 'intercept' : 'escape';
  }

  function routeSummary() {
    return state.path.map(function (id) { return NODES[id].label; }).join(' → ');
  }

  function bEvidence() {
    var o = OUTCOMES[pickOutcome()];
    state._evidence = rand(o.evidence);
    show({
      key: 'evidence',
      scene: mapScene({ round: 3 }),
      kicker: 'The scene',
      copy: 'Evidence recovered: <span class="em">' + state._evidence + '</span>',
      actions: [{ label: 'File the report', onClick: bReaction }]
    });
  }
  function bReaction() {
    var o = OUTCOMES[pickOutcome()];
    state._tanisha = rand(o.tanisha);
    show({
      key: 'reaction', scene: E.witness('Tanisha · Statement'),
      kicker: 'The witness speaks',
      copy: '“' + state._tanisha + '”',
      actions: [{ label: 'See the official record →', onClick: bReport }]
    });
  }

  function buildReport() {
    var key = pickOutcome();
    var o = OUTCOMES[key];
    return {
      title: 'Rabbit at the Garden Frontier',
      outcome: key,
      stamp: o.stamp,
      stampSub: 'Route: ' + routeSummary(),
      official: o.official,
      likely: o.likely,
      witness: state._tanisha || rand(o.tanisha),
      evidence: state._evidence || rand(o.evidence),
      status: rand(o.status),
      statusLabel: 'Rabbit Status',
      caseNo: E.caseNo('R')
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
    state.beat = 'intro'; state.sakura = 'patio'; state.rabbit = 'garden'; state.path = ['patio'];
    state.directCharges = 0; state.caught = false; state.rabbitEscaped = false; state.leafBait = false;
    state.lunge = null; state.report = null; state._evidence = null; state._tanisha = null; state._consequence = '';
    bIntro();
  }

  // ---- boot ----------------------------------------------------------------
  function init() {
    E.mount({ panelId: 'panel', progressFillId: 'progress-fill', beats: BEATS });
    bIntro();

    // Test seam — drive deterministically. reachReport(family) forces an outcome.
    window.__tc = {
      state: state, start: bIntro, restart: restart, again: restart,
      // Build a report for a specific outcome family directly.
      reachReport: function (family) {
        restart();
        if (family === 'intercept') { state.caught = true; state.rabbit = 'grass'; state.sakura = 'grass'; }
        else if (family === 'escape') { state.rabbitEscaped = true; state.rabbit = 'fence'; }
        else if (family === 'overcommit') { state.lunge = 'overcommit'; state.directCharges = 2; }
        else if (family === 'leaf') { state.leafBait = true; }
        state._evidence = rand(OUTCOMES[pickOutcome()].evidence);
        state._tanisha = rand(OUTCOMES[pickOutcome()].tanisha);
        bReport();
      },
      getReport: function () { return state.report; },
      outcomeOf: function () { return pickOutcome(); }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
