/* =============================================================
   Sakura Kills Everything — Episode Shell (shared, tiny)
   A small helper library, NOT an engine. It owns the chrome
   (panel rendering, progress bar, scene primitives, the report
   card). Each episode owns its own story, state, and choices.

   Exposes: window.SakuraEpisode
   ============================================================= */
(function () {
  'use strict';

  // ---- tiny helpers --------------------------------------------------------
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function caseNo(suffix) {
    return 'SKE-' + (Math.floor(Math.random() * 9000) + 1000) + '-' + (suffix || 'X');
  }
  function frag(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  // ---- mount + progress ----------------------------------------------------
  var ctx = { panel: null, fill: null, beats: [] };
  function mount(opts) {
    opts = opts || {};
    ctx.panel = document.getElementById(opts.panelId || 'panel');
    ctx.fill = document.getElementById(opts.progressFillId || 'progress-fill');
    ctx.beats = opts.beats || [];
  }
  function setProgress(key) {
    var i = ctx.beats.indexOf(key);
    if (i >= 0 && ctx.fill) ctx.fill.style.width = Math.round((i / (ctx.beats.length - 1)) * 100) + '%';
  }

  /** render({ key, scene, kicker, copy, body, actions })
   *  actions: [{label, onClick, ghost} | {render: <el>}] */
  function render(opts) {
    setProgress(opts.key);
    var panel = ctx.panel;
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

  function btn(label, onClick, ghost) {
    var b = document.createElement('button');
    b.className = 'btn' + (ghost ? ' btn--ghost' : '');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  // ---- scene primitives ----------------------------------------------------
  function scene(html) {
    var s = document.createElement('div');
    s.className = 'scene scene-fixed';
    if (html) s.innerHTML = html;
    return s;
  }
  function yard(extra) {
    var s = scene('<div class="yard"><div class="sun"></div><div class="clouds"></div><div class="fence"></div><div class="grass"></div><div class="patio"></div></div>');
    if (typeof extra === 'function') extra(s);
    return s;
  }
  /** A creature token. type drives styling (e.g. 'bird', 'squirrel'). */
  function token(parent, glyph, type, tag, mods) {
    var cls = 'token ' + (type || '') + (mods ? ' ' + mods : '');
    var t = frag('<div class="' + cls + '"><span class="glyph">' + glyph + '</span>' +
      (tag ? '<span class="tag">' + tag + '</span>' : '') + '</div>');
    parent.appendChild(t);
    return t;
  }
  function paws(scene, points) {
    points.forEach(function (p, i) {
      var paw = frag('<span class="paw">🐾</span>');
      paw.style.left = p[0] + '%'; paw.style.top = p[1] + '%';
      paw.style.setProperty('--r', (p[2] || 0) + 'deg');
      paw.style.animationDelay = (0.12 * i) + 's';
      scene.appendChild(paw);
    });
  }
  function burst(scene, x, y, glyphs) {
    glyphs = glyphs || ['🪶', '✨'];
    for (var i = 0; i < 6; i++) {
      var f = frag('<span class="feather">' + glyphs[i % glyphs.length] + '</span>');
      f.style.left = x + '%'; f.style.top = y + '%';
      f.style.setProperty('--dx', (Math.random() * 90 - 45) + 'px');
      f.style.setProperty('--dy', (-Math.random() * 70 - 10) + 'px');
      f.style.setProperty('--rot', (Math.random() * 320 - 160) + 'deg');
      f.style.animation = 'feather 0.9s ease-out forwards';
      f.style.animationDelay = (Math.random() * 0.2) + 's';
      scene.appendChild(f);
    }
  }
  function portrait(photo, caption) {
    var s = scene('<div class="yard" style="opacity:0.5"></div>' +
      '<div class="portrait-wrap"><figure class="portrait"><img alt="Sakura"></figure></div>' +
      (caption ? '<div class="scene-cap">' + caption + '</div>' : ''));
    var img = s.querySelector('img');
    img.addEventListener('error', function () {
      var fig = s.querySelector('.portrait'); fig.classList.add('is-fallback'); fig.textContent = '🐾';
    });
    img.src = photo;
    return s;
  }
  function witness(tag) {
    return scene('<div class="witness"><div class="window"><div class="curtain l"></div><div class="curtain r"></div></div>' +
      '<div class="witness-tag">' + (tag || 'Witness · Tanisha') + '</div></div>');
  }

  // ---- action track (the simple, comic participatory moment) ----------------
  /** track(scene, {glyph, zone:{left,width}}) → returns {evaluate()} for hit test */
  function track(scene, opts) {
    var t = frag('<div class="track"><div class="zone"></div><div class="runner">' + (opts.glyph || '🐦') + '</div></div>');
    scene.appendChild(t);
    var zone = t.querySelector('.zone');
    zone.style.left = opts.zone.left + '%'; zone.style.width = opts.zone.width + '%';
    var runner = t.querySelector('.runner');
    runner.style.animation = 'run 1.4s ease-in-out infinite alternate';
    return {
      evaluate: function () {
        var rr = runner.getBoundingClientRect(), zr = zone.getBoundingClientRect();
        var rc = rr.left + rr.width / 2;
        runner.style.animationPlayState = 'paused';
        return rc >= zr.left && rc <= zr.right;
      }
    };
  }

  // ---- the official report card --------------------------------------------
  /** report(r) where r = {
   *    title, fileLabel?, stamp, stampSub,
   *    officialLabel?, official, realityLabel?, likely,
   *    witnessLabel?, witness, evidence,
   *    statusLabel?, status?, caseNo
   *  } */
  function report(r) {
    var rep = document.createElement('div');
    rep.className = 'report';
    var statusHtml = r.status
      ? '<div class="r-status"><span class="r-stat-lab">' + (r.statusLabel || 'Status') + '</span>' +
        '<span class="r-stat-val">' + r.status + '</span></div>'
      : '';
    rep.innerHTML =
      '<p class="r-file">' + (r.fileLabel || ('Official Incident File · ' + r.title)) + '</p>' +
      '<p class="r-title">' + r.title + '</p>' +
      '<div class="r-stamp-row"><span class="stamp slam">' + r.stamp + '</span></div>' +
      '<div class="r-block r-official"><span class="r-lab">' + (r.officialLabel || 'Official Interpretation') + '</span><p>' + r.official + '</p></div>' +
      '<div class="r-block r-reality"><span class="r-lab">' + (r.realityLabel || 'Likely Reality') + '</span><p>' + r.likely + '</p></div>' +
      '<div class="r-witness"><span class="r-lab">' + (r.witnessLabel || 'Tanisha · Witness Note') + '</span><p>' + r.witness + '</p></div>' +
      '<p class="r-evidence"><strong>Evidence:</strong> ' + r.evidence + '</p>' +
      statusHtml +
      '<p class="r-case">' + r.caseNo + ' · ' + r.stampSub + '</p>';
    return rep;
  }

  window.SakuraEpisode = {
    rand: rand, caseNo: caseNo, frag: frag,
    mount: mount, render: render, btn: btn,
    scene: scene, yard: yard, token: token, paws: paws, burst: burst,
    portrait: portrait, witness: witness, track: track, report: report
  };
})();
