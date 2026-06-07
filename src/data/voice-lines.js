/* =============================================================
   Sakura Kills Everything — Voice Lines
   Categorized, reusable narration. Sharper and more vicious than the
   Build-2 shell, while staying comic and loving. The narrator is a
   serious historian documenting extremely silly, slightly violent
   events (see docs/design/narrative-voice-guide.md).

   Cartoon-mythic violence is allowed: "neutralized", "feather event",
   "kill mode". Real gore, cruelty, and animal suffering are NOT.

   No bundler. Attaches to window.SakuraData.voiceLines (classic script).
   ============================================================= */
(function (global) {
  'use strict';

  var VOICE = {
    briefing: [
      'The backyard has made its final mistake.',
      'Sakura enters the grass with legal authority unclear.',
      'Threat board is live. Mercy is not on it.',
      'Tiny predator. Historic consequences.',
      'All units: the Warden is deployed.'
    ],
    detection: [
      'Contact. The backyard trembles.',
      'Target acquired. Mercy unlikely.',
      'Movement in the grid. Sakura is already aware.',
      'Something moved. It should not have.',
      'Hostile sighted. The paperwork begins.'
    ],
    pounce: [
      'Sakura has entered kill mode.',
      'Launch confirmed. Physics notified.',
      'The pounce is committed. There is no recall.',
      'Engaging. The grass will remember this.'
    ],
    hit: [
      'Impact confirmed.',
      'Direct hit. The record will be generous.',
      'Contact made. Airspace cleared by force.'
    ],
    miss: [
      'Strike fell wide. The grass was neutralized instead.',
      'Miss. The dust cloud counts as a warning.',
      'Negative contact. The target was simply elsewhere.',
      'A confident strike at empty air.'
    ],
    birdCatch: [
      'Bird neutralized. Feather evidence recovered.',
      'The bird was last seen becoming feathers.',
      'Aerial intercept confirmed. Her greatest achievement, again.',
      'Airspace cleared by force. Birds must die. One did.'
    ],
    featherBurst: [
      'Feather event confirmed.',
      'Feathers logged as evidence. Case closed.',
      'A burst of feathers. The official record considers the matter resolved.'
    ],
    rabbitEscape: [
      'The rabbit survived. For now.',
      'Rabbit withdrew at speed. The Garden Question remains open.',
      'Near miss. The rabbit will be presumed suspicious indefinitely.',
      'Escape confirmed. Out-stared again.'
    ],
    squirrelEscape: [
      'The squirrel escaped, as required by canon.',
      'No squirrel has ever been captured. This remains an institutional embarrassment.',
      'The squirrel reached the fence. The streak continues. The streak is perfect.',
      'Zero confirmed catches. The squirrel regrets nothing.'
    ],
    vorgAlert: [
      'Anomaly at the far corner. Do not advance.',
      'Vorg sign detected. Confirmation withheld, as always.',
      'Something is there. Something is always there.',
      'The frontier stirs. The record will say nothing certain.'
    ],
    falseAlarm: [
      'Threat reassessed: it was a leaf.',
      'The bag has been defeated. It was a bag.',
      'Shadow neutralized. The shadow was the fence.',
      'Hostile downgraded to “foliage.” Victory claimed anyway.'
    ],
    gloriousFailure: [
      'Likely reality remains disappointing.',
      'A total triumph, by the only metrics that count: hers.',
      'Nothing was caught. Everything was secured.',
      'The official record is more inspiring than the footage.'
    ],
    runStart: [
      'Operation begins. The backyard is not safe.',
      'Sakura has entered the hunting grounds.',
      'Stand by. The Warden does not.',
      'The grass holds its breath.'
    ],
    runEnd: [
      'Operation complete. The record will exaggerate.',
      'Stand down. The legend grows regardless of the footage.',
      'Operation concluded. History has been generously interpreted.',
      'The dust settles. The paperwork rises.'
    ],
    incidentReport: [
      'Incident logged. Canon updated.',
      'Entered into the official record.',
      'Filed. Witnessed. Possibly true.'
    ],
    officialInterpretation: [
      'Official interpretation:',
      'Per the official record:',
      'The realm has concluded:'
    ],
    likelyReality: [
      'Likely reality:',
      'What probably happened:',
      'The footage, however, suggests:'
    ]
  };

  function pick(arr) {
    if (!arr || !arr.length) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  global.SakuraData = global.SakuraData || {};
  global.SakuraData.voiceLines = VOICE;
  // Convenience: SakuraData.line('category') -> random line.
  global.SakuraData.line = function (category) { return pick(VOICE[category]); };
})(typeof window !== 'undefined' ? window : this);
