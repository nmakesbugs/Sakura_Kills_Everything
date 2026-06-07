/* =============================================================
   Sakura Kills Everything — Voice Engine
   Thin layer over src/data/voice-lines.js. Pulls categorized lines
   and formats incident narration. Keeps the narrator's voice in one
   place so every mode sounds like the same serious historian.

   Depends on: window.SakuraData.voiceLines, window.SakuraRandom (optional).
   No bundler. Attaches to window.SakuraVoice (classic script).
   ============================================================= */
(function (global) {
  'use strict';

  function pick(arr) {
    if (!arr || !arr.length) return '';
    var rnd = global.SakuraRandom ? global.SakuraRandom.next() : Math.random();
    return arr[Math.floor(rnd * arr.length)];
  }

  var SakuraVoice = {
    /**
     * getLine(category, context?) -> string
     * context is reserved for future conditioning (zone, creature, streak).
     */
    getLine: function (category, context) {
      var data = global.SakuraData && global.SakuraData.voiceLines;
      if (!data || !data[category]) return '';
      return pick(data[category]);
    },

    /** A short, screen-ready line for a resolved incident. */
    formatIncidentLine: function (incident) {
      if (!incident) return '';
      switch (incident.outcomeType) {
        case 'confirmedCatch':
        case 'featherEvent':
          return this.getLine('birdCatch');
        case 'squirrelEscape':
          return this.getLine('squirrelEscape');
        case 'escape':
          return this.getLine('rabbitEscape');
        case 'falseAlarm':
        case 'environmentalMisidentification':
          return this.getLine('falseAlarm');
        case 'vorgNonConfirmation':
          return this.getLine('vorgAlert');
        case 'gloriousFailure':
          return this.getLine('gloriousFailure');
        case 'patrolSuccess':
          return this.getLine('hit');
        default:
          return this.getLine('miss');
      }
    },

    /** Prefix label for the dual-layer report ("Official interpretation:"). */
    officialLabel: function () { return this.getLine('officialInterpretation') || 'Official interpretation:'; },
    realityLabel: function () { return this.getLine('likelyReality') || 'Likely reality:'; }
  };

  global.SakuraVoice = SakuraVoice;
})(typeof window !== 'undefined' ? window : this);
