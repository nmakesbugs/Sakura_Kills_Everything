/* =============================================================
   Sakura Presence v0.1 — shared runtime visual system (JS)
   window.SakuraPresence: portrait(), token(), action effects, and
   outcomeFx() — the per-incident effect combo used by every mode.

   Dependency-free. Pairs with src/ui/sakura-presence.css.
   See docs/assets/sakura-runtime-visual-policy.md and
   docs/assets/sakura-sprite-pipeline-v0.1.md.
   ============================================================= */
(function (global) {
  'use strict';

  var R = global.SakuraRandom;
  function rint(a, b) { return R ? R.int(a, b) : Math.floor(Math.random() * (b - a + 1)) + a; }

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

  /**
   * portrait({ src, size=40, shape='circle', objectPosition='50% 26%', alt })
   * A SAFE static photo frame. Never animate this as a body. If the photo is
   * missing, a CSS silhouette fallback is shown.
   */
  function portrait(opts) {
    opts = opts || {};
    var size = opts.size || 40;
    var fig = el('figure', 'sp-portrait sp-portrait--' + (opts.shape || 'circle'));
    fig.style.width = size + 'px';
    fig.style.height = size + 'px';
    var img = document.createElement('img');
    img.alt = opts.alt || 'Sakura';
    img.style.objectPosition = opts.objectPosition || '50% 26%';
    img.addEventListener('error', function () {
      fig.classList.add('is-fallback');
      var g = el('span', 'sp-fallback-glyph'); g.textContent = '🐾'; fig.appendChild(g);
    });
    if (opts.src) img.src = opts.src;
    fig.appendChild(img);
    return fig;
  }

  /** token({ size=30, glyph='🐾' }) — symbolic gameplay presence. */
  function token(opts) {
    opts = opts || {};
    var size = opts.size || 30;
    var t = el('span', 'sp-token');
    t.style.width = size + 'px';
    t.style.height = size + 'px';
    t.style.fontSize = Math.round(size * 0.52) + 'px';
    t.textContent = opts.glyph || '🐾';
    if (opts.label) t.setAttribute('aria-label', opts.label);
    return t;
  }

  // ---- Effects (container must be position:relative; x,y in px) ----
  function place(container, node, x, y) {
    if (!container) return null;
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    container.appendChild(node);
    return node;
  }
  function removeLater(node, ms) { if (node) setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, ms); }

  function strike(container, x, y) {
    var n = el('span', 'sp-fx sp-strike'); n.textContent = '🐾';
    removeLater(place(container, n, x, y), 450);
  }
  function ring(container, x, y, tone) {
    var n = el('span', 'sp-fx sp-ring'); if (tone) n.setAttribute('data-tone', tone);
    removeLater(place(container, n, x, y), 520);
  }
  function burst(container, x, y, glyphs, count, spread) {
    for (var i = 0; i < count; i++) {
      var n = el('span', 'sp-fx sp-particle');
      n.textContent = glyphs[i % glyphs.length];
      n.style.fontSize = (spread.font || 18) + 'px';
      n.style.transform = 'translate(-50%,-50%)';
      n.style.setProperty('--dx', rint(-spread.x, spread.x) + 'px');
      n.style.setProperty('--dy', rint(spread.yMin, spread.yMax) + 'px');
      n.style.setProperty('--rot', rint(-160, 160) + 'deg');
      n.style.animation = 'sp-burst 0.6s ease-out forwards';
      removeLater(place(container, n, x, y), 650);
    }
  }
  function featherBurst(container, x, y) { burst(container, x, y, ['🪶', '🪶', '✨'], 5, { x: 46, yMin: -56, yMax: -12, font: 18 }); }
  function dust(container, x, y) { burst(container, x, y, ['·', '•'], 3, { x: 26, yMin: -22, yMax: -4, font: 16 }); }
  function escapeStreak(container, x, y) { var n = el('span', 'sp-fx sp-streak'); n.textContent = '💨'; removeLater(place(container, n, x, y), 520); }
  function alertPulse(container, x, y) { var n = el('span', 'sp-fx sp-pulse'); removeLater(place(container, n, x, y), 720); }

  /**
   * outcomeFx(container, x, y, outcomeType, didHit)
   * The canonical per-incident effect combo. Restrained on purpose.
   */
  function outcomeFx(container, x, y, outcomeType, didHit) {
    switch (outcomeType) {
      case 'confirmedCatch': strike(container, x, y); ring(container, x, y, 'gold'); featherBurst(container, x, y); break;
      case 'featherEvent':   strike(container, x, y); ring(container, x, y, '');     featherBurst(container, x, y); break;
      case 'squirrelEscape': if (didHit) strike(container, x, y); ring(container, x, y, 'warn'); escapeStreak(container, x, y); break;
      case 'escape':         ring(container, x, y, ''); dust(container, x, y); break;
      case 'falseAlarm':
      case 'environmentalMisidentification': if (didHit) strike(container, x, y); ring(container, x, y, 'blue'); break;
      case 'vorgNonConfirmation': ring(container, x, y, 'vorg'); alertPulse(container, x, y); break;
      case 'patrolSuccess':  strike(container, x, y); ring(container, x, y, ''); break;
      default: dust(container, x, y);
    }
  }

  global.SakuraPresence = {
    portrait: portrait,
    token: token,
    strike: strike,
    ring: ring,
    featherBurst: featherBurst,
    dust: dust,
    escapeStreak: escapeStreak,
    alertPulse: alertPulse,
    outcomeFx: outcomeFx
  };
})(typeof window !== 'undefined' ? window : this);
