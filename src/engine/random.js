/* =============================================================
   Sakura Kills Everything — Random helpers
   Small, dependency-free. Defaults to Math.random, but supports a
   seedable stream so future modes (and tests) can be deterministic.

   No bundler. Attaches to window.SakuraRandom (classic script).
   ============================================================= */
(function (global) {
  'use strict';

  // Mulberry32 — tiny, fast, good-enough seeded PRNG.
  function makeSeeded(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var rng = Math.random; // default source

  var SakuraRandom = {
    /** Replace the global random source with a seeded stream. */
    seed: function (n) { rng = makeSeeded(n); return SakuraRandom; },
    /** Restore the default Math.random source. */
    unseed: function () { rng = Math.random; return SakuraRandom; },
    /** Raw float in [0,1). */
    next: function () { return rng(); },
    /** Random integer in [min, max] inclusive. */
    int: function (min, max) { return Math.floor(rng() * (max - min + 1)) + min; },
    /** Random float in [min, max). */
    float: function (min, max) { return rng() * (max - min) + min; },
    /** True with probability p (0..1). */
    chance: function (p) { return rng() < p; },
    /** Pick a random element. */
    pick: function (arr) { return (arr && arr.length) ? arr[Math.floor(rng() * arr.length)] : undefined; },
    /** Weighted pick: items = [{value, weight}, ...]. */
    weighted: function (items) {
      var total = 0, i;
      for (i = 0; i < items.length; i++) total += items[i].weight;
      var r = rng() * total;
      for (i = 0; i < items.length; i++) {
        r -= items[i].weight;
        if (r < 0) return items[i].value;
      }
      return items.length ? items[items.length - 1].value : undefined;
    },
    /** Short id like "a1b2c3" — fine for run/incident ids in-session. */
    id: function (prefix) {
      var s = Math.floor(rng() * 0x7fffffff).toString(36);
      return (prefix || '') + s;
    }
  };

  global.SakuraRandom = SakuraRandom;
})(typeof window !== 'undefined' ? window : this);
