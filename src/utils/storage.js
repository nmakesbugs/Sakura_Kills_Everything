/* =============================================================
   Sakura Kills Everything — Persistent Incident Memory
   The permanent record. Saves incidents produced by any mode into
   localStorage so the archive survives across sessions.

   Browser-native, no backend, no accounts, no IndexedDB. Degrades to
   an in-memory fallback if localStorage is unavailable so the app
   never crashes.

   No bundler. Attaches to window.SakuraStorage (classic script).

   Stored shape (newest first), key `ske-incidents-v1`:
     [{ ...incident, sourceMode, savedAt }]
   ============================================================= */
(function (global) {
  'use strict';

  var KEY = 'ske-incidents-v1';
  var MAX = 200; // cap to avoid runaway storage

  var memFallback = null; // used only if localStorage throws

  function read() {
    try {
      var raw = global.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return memFallback || [];
    }
  }

  function write(list) {
    var capped = list.slice(0, MAX);
    try {
      global.localStorage.setItem(KEY, JSON.stringify(capped));
    } catch (e) {
      memFallback = capped; // graceful degradation
    }
    return capped;
  }

  function nowStamp() {
    // Date is fine in browser app code (only workflow scripts ban it).
    try { return new Date().toISOString(); } catch (e) { return ''; }
  }

  /**
   * saveIncidents(incidents, context) — prepend a run's incidents to the
   * permanent record. context = { sourceMode, runTitle }.
   * Returns the new total count.
   */
  function saveIncidents(incidents, context) {
    context = context || {};
    var stamp = nowStamp();
    var enriched = (incidents || []).map(function (inc) {
      var copy = {};
      for (var k in inc) { if (Object.prototype.hasOwnProperty.call(inc, k)) copy[k] = inc[k]; }
      copy.sourceMode = context.sourceMode || copy.sourceMode || 'unknown';
      copy.runTitle = context.runTitle || copy.runTitle || null;
      copy.savedAt = stamp;
      return copy;
    });
    // Newest first: new run on top of existing record.
    var combined = enriched.concat(read());
    var capped = write(combined);
    return capped.length;
  }

  /** loadIncidents() — the full saved record, newest first. */
  function loadIncidents() { return read(); }

  /** clearIncidents() — purge the permanent record. */
  function clearIncidents() {
    try { global.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    memFallback = null;
    return true;
  }

  /** getStats() — computed, absurd-but-official archive statistics. */
  function getStats() {
    var list = read();
    var s = {
      total: list.length,
      birdsNeutralized: 0,      // featherEvent + confirmedCatch
      confirmedMythicKills: 0,  // confirmedCatch
      squirrelEscapes: 0,
      rabbitEscapes: 0,
      birdEscapes: 0,
      falseAlarms: 0,
      environmentalMisidentifications: 0,
      vorgNonConfirmations: 0,
      patrolSuccesses: 0,
      bySource: {},
      mostCommonZone: null,
      squirrelCaptureRate: '0%' // canonically compliant, always
    };
    var zoneTally = {};
    for (var i = 0; i < list.length; i++) {
      var inc = list[i];
      switch (inc.outcomeType) {
        case 'confirmedCatch': s.confirmedMythicKills++; s.birdsNeutralized++; break;
        case 'featherEvent': s.birdsNeutralized++; break;
        case 'squirrelEscape': s.squirrelEscapes++; break;
        case 'escape': if (inc.kind === 'bird') s.birdEscapes++; else s.rabbitEscapes++; break;
        case 'falseAlarm': s.falseAlarms++; break;
        case 'environmentalMisidentification': s.environmentalMisidentifications++; break;
        case 'vorgNonConfirmation': s.vorgNonConfirmations++; break;
        case 'patrolSuccess': s.patrolSuccesses++; break;
      }
      var src = inc.sourceMode || 'unknown';
      s.bySource[src] = (s.bySource[src] || 0) + 1;
      var z = inc.zoneName || inc.zone;
      if (z) zoneTally[z] = (zoneTally[z] || 0) + 1;
    }
    var best = null, bestN = 0;
    for (var zk in zoneTally) { if (zoneTally[zk] > bestN) { bestN = zoneTally[zk]; best = zk; } }
    s.mostCommonZone = best;
    return s;
  }

  global.SakuraStorage = {
    KEY: KEY,
    MAX: MAX,
    saveIncidents: saveIncidents,
    loadIncidents: loadIncidents,
    clearIncidents: clearIncidents,
    getStats: getStats
  };
})(typeof window !== 'undefined' ? window : this);
