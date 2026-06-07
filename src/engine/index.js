/* =============================================================
   Sakura Kills Everything — shared game engine helpers
   Framework-free. Exposed on window.SakuraEngine so any mode
   (Duck Hunt, Patrol, ...) can reuse it via a classic <script>.
   ============================================================= */
(function (global) {
  'use strict';

  /**
   * Size a <canvas> to its parent element, accounting for devicePixelRatio
   * so drawing stays crisp on mobile. Returns the logical (CSS-pixel) size.
   * The 2D context is scaled so all drawing uses CSS-pixel coordinates.
   */
  function fitCanvas(canvas) {
    var parent = canvas.parentElement || canvas;
    var rect = parent.getBoundingClientRect();
    var cssW = Math.max(1, Math.round(rect.width));
    var cssH = Math.max(1, Math.round(rect.height));
    var dpr = global.devicePixelRatio || 1;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    var ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { width: cssW, height: cssH, dpr: dpr, ctx: ctx };
  }

  /**
   * requestAnimationFrame loop with start/stop and delta time (seconds).
   *   const game = loop(dt => update(dt), () => render());
   *   game.start();  game.stop();  game.running;
   * Falls back to a setTimeout shim if rAF is unavailable (headless safety).
   */
  function loop(update, render) {
    var raf = global.requestAnimationFrame ||
      function (cb) { return global.setTimeout(function () { cb(Date.now()); }, 16); };
    var caf = global.cancelAnimationFrame || global.clearTimeout;

    var handle = null;
    var last = 0;
    var running = false;

    function frame(now) {
      if (!running) return;
      var dt = last ? (now - last) / 1000 : 0;
      last = now;
      // Clamp dt so a backgrounded tab doesn't produce a huge jump.
      if (dt > 0.1) dt = 0.1;
      if (typeof update === 'function') update(dt);
      if (typeof render === 'function') render();
      handle = raf(frame);
    }

    var api = {
      start: function () {
        if (running) return api;
        running = true;
        last = 0;
        handle = raf(frame);
        return api;
      },
      stop: function () {
        running = false;
        if (handle != null) caf(handle);
        handle = null;
        return api;
      }
    };
    Object.defineProperty(api, 'running', { get: function () { return running; } });
    return api;
  }

  /**
   * Map a pointer/mouse/touch event to canvas CSS-pixel coordinates.
   * Works with PointerEvent, MouseEvent, and TouchEvent.
   */
  function pointerPos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var src = event;
    if (event && event.touches && event.touches.length) {
      src = event.touches[0];
    } else if (event && event.changedTouches && event.changedTouches.length) {
      src = event.changedTouches[0];
    }
    var clientX = src && src.clientX != null ? src.clientX : 0;
    var clientY = src && src.clientY != null ? src.clientY : 0;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  global.SakuraEngine = {
    fitCanvas: fitCanvas,
    loop: loop,
    pointerPos: pointerPos
  };
})(typeof window !== 'undefined' ? window : this);
