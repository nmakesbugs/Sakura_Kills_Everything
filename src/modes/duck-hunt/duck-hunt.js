/* =============================================================
   Duck Hunt — Build 2 playable shell
   A target spawns, moves across the yard, and the player taps to
   engage. Squirrels ALWAYS escape (canon: zero confirmed catches).
   Birds CAN be intercepted (canon: one confirmed aerial catch).

   This is a shell, not full gameplay: no scoring depth, no
   progression, no persistence. Real rigged sprites are future work
   (see docs/assets/sprite-rigging-plan.md).
   ============================================================= */
(function () {
  'use strict';

  var Engine = window.SakuraEngine;

  // ---- Target catalogue ----------------------------------------------------
  // squirrel: fast, erratic, uncatchable (the running joke).
  // bird:     slower aerial arc, interceptable (her greatest achievement).
  var TARGETS = {
    squirrel: {
      label: 'Squirrel', glyph: '🐿️',
      speed: 165, radius: 30, catchable: false, lifeMs: 2800,
      wobble: 46   // vertical erraticness
    },
    bird: {
      label: 'Bird', glyph: '🐦',
      speed: 120, radius: 28, catchable: true, lifeMs: 3400,
      wobble: 0
    }
  };

  // Comedic, tone-correct feedback copy.
  var SAY = {
    squirrelEscape: [
      'The squirrel regrets nothing.',
      'Gone. Up the fence. As always.',
      'Zero confirmed catches. The streak continues.',
      'The squirrel was never in any danger.'
    ],
    birdCatch: [
      'Aerial intercept confirmed. Her greatest achievement.',
      'Caught it out of the air. Birds must die.',
      'Confirmed catch. Sakura is extremely pleased.'
    ],
    birdEscape: [
      'The bird lives to fly another day.',
      'A near miss. The sky is vast.',
      'It got away. Sakura remains optimistic.'
    ],
    miss: [
      'Missed. The yard is large.',
      'Nothing there. Recalibrating.',
      'A confident strike at empty grass.'
    ],
    squirrelTapped: [
      'You had it! ...You did not have it.',
      'So close. The squirrel disagrees that it was close.',
      'Contact! The squirrel filed no report.'
    ]
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ---- State ---------------------------------------------------------------
  var state = {
    target: null,        // { type, x, y, vx, vy, t, life, def }
    attempts: 0,
    escapes: 0,
    catches: 0,
    message: '',
    dims: { width: 320, height: 420 }
  };

  var canvas, stage, game, spawnTimer = null;
  var hud = {};

  // ---- Spawning ------------------------------------------------------------
  function makeTarget(type) {
    var def = TARGETS[type] || TARGETS.squirrel;
    var d = state.dims;
    var fromLeft = Math.random() < 0.5;
    var dir = fromLeft ? 1 : -1;

    var t = {
      type: type, def: def,
      x: fromLeft ? -def.radius : d.width + def.radius,
      // Bird arcs across the upper sky; squirrel dashes near the ground.
      y: def.catchable
        ? d.height * (0.18 + Math.random() * 0.22)
        : d.height * (0.62 + Math.random() * 0.2),
      vx: dir * def.speed,
      vy: 0,
      baseY: 0, t: 0, life: def.lifeMs / 1000
    };
    t.baseY = t.y;
    return t;
  }

  // Public spawn — also the test seam. Replaces any current target
  // synchronously for deterministic assertions.
  function spawn(type) {
    if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
    var t = makeTarget(type || 'squirrel');
    state.target = t;
    return t;
  }

  function scheduleSpawn(delayMs) {
    if (spawnTimer) clearTimeout(spawnTimer);
    spawnTimer = setTimeout(function () {
      spawnTimer = null;
      // Squirrel-heavy by design; bird is the rarer variant.
      var type = Math.random() < 0.72 ? 'squirrel' : 'bird';
      state.target = makeTarget(type);
    }, delayMs);
  }

  function setMessage(msg) {
    state.message = msg;
    if (hud.message) hud.message.textContent = msg;
  }

  function syncHud() {
    if (hud.attempts) hud.attempts.textContent = state.attempts;
    if (hud.escapes) hud.escapes.textContent = state.escapes;
    if (hud.catches) hud.catches.textContent = state.catches;
  }

  // ---- Update / Render -----------------------------------------------------
  function update(dt) {
    var t = state.target;
    if (!t) return;
    t.t += dt;
    t.life -= dt;
    t.x += t.vx * dt;

    if (t.def.wobble) {
      // Erratic vertical bob for the squirrel.
      t.y = t.baseY + Math.sin(t.t * 9) * t.def.wobble * 0.5;
    } else {
      // Gentle arc for the bird.
      t.y = t.baseY + Math.sin(t.t * 2) * 14;
    }

    var d = state.dims;
    var offscreen = t.x < -60 || t.x > d.width + 60;
    if (t.life <= 0 || offscreen) {
      // Target got away on its own.
      state.escapes++;
      setMessage(t.def.catchable ? pick(SAY.birdEscape) : pick(SAY.squirrelEscape));
      state.target = null;
      syncHud();
      scheduleSpawn(700 + Math.random() * 600);
    }
  }

  function render() {
    var ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;
    var d = state.dims;

    // Sky
    var sky = ctx.createLinearGradient(0, 0, 0, d.height);
    sky.addColorStop(0, '#1b2330');
    sky.addColorStop(0.55, '#222a22');
    sky.addColorStop(1, '#161c14');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, d.width, d.height);

    // Grass band
    ctx.fillStyle = '#22301d';
    ctx.fillRect(0, d.height * 0.72, d.width, d.height * 0.28);

    // Fence line
    ctx.strokeStyle = 'rgba(74,124,78,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, d.height * 0.72);
    ctx.lineTo(d.width, d.height * 0.72);
    ctx.stroke();

    // Target
    var t = state.target;
    if (t) {
      ctx.font = (t.def.radius * 2) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Flip the glyph to face travel direction.
      ctx.save();
      ctx.translate(t.x, t.y);
      if (t.vx < 0) ctx.scale(-1, 1);
      ctx.fillText(t.def.glyph, 0, 0);
      ctx.restore();
    }
  }

  // ---- Input ---------------------------------------------------------------
  function fire(event) {
    if (event && event.preventDefault) event.preventDefault();
    var pos = Engine.pointerPos(canvas, event);
    state.attempts++;

    var t = state.target;
    if (t) {
      var dx = pos.x - t.x;
      var dy = pos.y - t.y;
      var hit = (dx * dx + dy * dy) <= (t.def.radius * t.def.radius);
      if (hit) {
        if (t.def.catchable) {
          state.catches++;
          setMessage(pick(SAY.birdCatch));
          state.target = null;
          scheduleSpawn(900 + Math.random() * 700);
        } else {
          // Squirrels cannot be caught. Canon is canon.
          state.escapes++;
          setMessage(pick(SAY.squirrelTapped));
          state.target = null;
          scheduleSpawn(700 + Math.random() * 500);
        }
        syncHud();
        return;
      }
    }
    setMessage(pick(SAY.miss));
    syncHud();
  }

  // ---- Boot ----------------------------------------------------------------
  function resize() {
    if (!Engine || !canvas) return;
    var info = Engine.fitCanvas(canvas);
    state.dims.width = info.width;
    state.dims.height = info.height;
  }

  function init() {
    canvas = document.getElementById('yard');
    stage = document.getElementById('stage');
    hud.attempts = document.getElementById('hud-attempts');
    hud.escapes = document.getElementById('hud-escapes');
    hud.catches = document.getElementById('hud-catches');
    hud.message = document.getElementById('message');

    if (!canvas || !Engine) {
      // Nothing to run — fail quietly, no console noise.
      return;
    }

    resize();
    window.addEventListener('resize', resize);

    // Pointer + touch input (covers mouse, pen, and finger).
    stage.addEventListener('pointerdown', fire);
    stage.addEventListener('touchstart', fire, { passive: false });

    syncHud();
    setMessage('The squirrels know you are here.');

    // First quarry: a squirrel, per spec.
    state.target = makeTarget('squirrel');

    game = Engine.loop(update, render);
    game.start();

    // Test seam — deterministic control for Playwright, plus introspection.
    window.__duckHunt = {
      state: state,
      TARGETS: TARGETS,
      spawn: spawn,
      fireAt: function (x, y) { fire({ clientX: x, clientY: y, preventDefault: function () {} }); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
