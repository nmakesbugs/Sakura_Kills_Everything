/* =============================================================
   Sakura Kills Everything — Incident Engine
   The heart of the platform. Incidents are the atomic unit of the
   whole game (see docs/systems/incident-system.md). Every mode feeds
   play events in here and gets back canon-shaped incidents with the
   sacred dual layer: official interpretation vs. likely reality.

   Depends on: window.SakuraData (zones/creatures), window.SakuraRandom.
   No bundler. Attaches to window.SakuraIncident (classic script).

   Public API:
     resolveOutcome(kind, didHit, creature) -> outcome descriptor
     createIncident({ kind, didHit, zoneId, creatureId, runId }) -> incident
     summarizeRun(incidents, stats) -> run summary (official vs likely)
     getOfficialInterpretation(incident) / getLikelyReality(incident)
   ============================================================= */
(function (global) {
  'use strict';

  function R() { return global.SakuraRandom || { pick: function (a) { return a[0]; }, chance: function () { return false; }, int: function (a) { return a; }, id: function (p) { return (p || '') + Math.random().toString(36).slice(2, 8); } }; }
  function zoneName(id) { var z = global.SakuraData && global.SakuraData.zoneById(id); return z ? z.name : 'the backyard'; }
  function creatureName(id) { var c = global.SakuraData && global.SakuraData.creatureById(id); return c ? c.name : 'the target'; }

  // ---- Outcome resolution -------------------------------------------------
  // kind: 'bird' | 'rabbit' | 'squirrel' | 'falseAlarm' | 'vorg'
  // Canon is enforced HERE: squirrels never caught, vorg never confirmed.
  function resolveOutcome(kind, didHit, creature) {
    var rnd = R();
    switch (kind) {
      case 'bird':
        if (didHit) {
          var mythic = rnd.chance(0.35); // rare full confirmed catch
          return {
            outcomeType: mythic ? 'confirmedCatch' : 'featherEvent',
            violenceLevel: mythic ? 'confirmedKillMythic' : 'featherBurst',
            comedyType: 'mythic-understatement',
            success: true, points: mythic ? 100 : 60, vorgEvidence: false
          };
        }
        return { outcomeType: 'escape', violenceLevel: 'startled', comedyType: 'found-victory', success: false, points: 5, vorgEvidence: false };

      case 'squirrel':
        // CANON LAW: no squirrel is ever confirmed caught. Hit or miss.
        return { outcomeType: 'squirrelEscape', violenceLevel: 'chased', comedyType: 'institutional-embarrassment', success: false, points: 0, vorgEvidence: false };

      case 'rabbit':
        // Escape-biased. A hit becomes a "near miss," never a catch.
        return { outcomeType: 'escape', violenceLevel: 'startled', comedyType: 'found-victory', success: false, nearMiss: !!didHit, points: didHit ? 10 : 4, vorgEvidence: false };

      case 'falseAlarm':
        // Sakura wins anyway. Official record inflated; reality mundane.
        return { outcomeType: 'falseAlarm', violenceLevel: 'harmless', comedyType: 'found-victory', success: true, points: 15, vorgEvidence: false };

      case 'vorg':
        // CANON LAW: never confirmed, never caught. Evidence only.
        return { outcomeType: 'vorgNonConfirmation', violenceLevel: 'unknown', comedyType: 'ominous-footnote', success: false, points: 0, vorgEvidence: true };

      default:
        return { outcomeType: 'falseAlarm', violenceLevel: 'harmless', comedyType: 'found-victory', success: false, points: 0, vorgEvidence: false };
    }
  }

  // ---- Per-incident narration templates -----------------------------------
  var FALSE_ALARM_NOUNS = ['a leaf', 'a plastic bag', 'a suspicious shadow', 'a stray sock', 'a windblown wrapper', 'the garden hose'];

  var TEMPLATES = {
    confirmedCatch: {
      official: ['Sakura achieved a confirmed aerial intercept over {zone}. Air supremacy was, for one historic moment, total.'],
      likely: ['She actually got one. Feathers everywhere. This will be discussed for years.']
    },
    featherEvent: {
      official: ['Sakura broke enemy air control over {zone}. The official record considers the matter closed.'],
      likely: ['{creature} flew away and several feathers were discovered.']
    },
    squirrelEscape: {
      official: ['Sakura secured {zone} and put the Squirrel Directorate on notice.'],
      likely: ['The squirrel reached the fence, unbothered. No squirrel has ever been caught. This remains an institutional embarrassment.']
    },
    escape: {
      official: ['Hostile forces were driven from {zone} under sustained pressure.'],
      likely: ['{creature} left at a comfortable pace. Sakura claimed the empty ground as a victory.']
    },
    falseAlarm: {
      official: ['Sakura neutralized an intruder in {zone} with decisive force.'],
      likely: ['It was {falseAlarmNoun}. The threat was, on review, foliage. Victory claimed anyway.']
    },
    environmentalMisidentification: {
      official: ['Sakura identified and engaged a hostile presence in {zone}. The sector was held.'],
      likely: ['On closer inspection it was {falseAlarmNoun}. Sakura maintains it was acting suspiciously.']
    },
    vorgNonConfirmation: {
      official: ['Sakura contained an unconfirmed anomaly at {zone}. The frontier holds.'],
      likely: ['Something may have been at the corner. Confirmation withheld, as always. The mystery grew.']
    },
    gloriousFailure: {
      official: ['A masterclass in area denial across {zone}.'],
      likely: ['Nothing was caught. Everything was, by her own metrics, secured.']
    },
    patrolSuccess: {
      official: ['Patrol of {zone} concluded successfully. The realm endures.'],
      likely: ['She had a genuinely nice time out there.']
    }
  };

  function fill(str, ctx) {
    return str
      .replace('{zone}', ctx.zone || 'the backyard')
      .replace('{creature}', ctx.creature || 'The target')
      .replace('{falseAlarmNoun}', ctx.falseAlarmNoun || 'a leaf');
  }

  // ---- Incident creation --------------------------------------------------
  var counter = 0;
  function createIncident(opts) {
    opts = opts || {};
    var kind = opts.kind || 'falseAlarm';
    var creature = opts.creatureId ? (global.SakuraData && global.SakuraData.creatureById(opts.creatureId)) : null;
    var outcome = opts.outcome || resolveOutcome(kind, opts.didHit, creature);
    var tpl = TEMPLATES[outcome.outcomeType] || TEMPLATES.falseAlarm;

    var ctx = {
      zone: zoneName(opts.zoneId),
      creature: opts.creatureId ? creatureName(opts.creatureId) : 'The target',
      falseAlarmNoun: R().pick(FALSE_ALARM_NOUNS)
    };

    counter++;
    var canonStatus = outcome.vorgEvidence ? 'unconfirmed'
      : (outcome.outcomeType === 'squirrelEscape' ? 'canon (institutional embarrassment)' : 'logged');

    return {
      id: (opts.runId ? opts.runId + '-' : '') + 'i' + counter,
      kind: kind,
      title: titleFor(kind, outcome, ctx),
      dateClassification: 'This run · just now',
      zone: opts.zoneId || null,
      zoneName: ctx.zone,
      creatures: opts.creatureId ? [opts.creatureId] : [],
      creatureName: ctx.creature,
      factions: creature && creature.faction ? [creature.faction] : [],
      witnesses: [],
      trigger: opts.trigger || (ctx.creature + ' detected in ' + ctx.zone + '.'),
      playerAction: opts.didHit ? 'Sakura pounced.' : 'Sakura committed, narrowly.',
      outcomeType: outcome.outcomeType,
      officialInterpretation: fill(R().pick(tpl.official), ctx),
      likelyReality: fill(R().pick(tpl.likely), ctx),
      canonStatus: canonStatus,
      violenceLevel: outcome.violenceLevel,
      comedyType: outcome.comedyType,
      points: outcome.points || 0,
      nearMiss: !!outcome.nearMiss,
      vorgEvidence: !!outcome.vorgEvidence,
      relatedAchievements: [],
      relatedHooks: []
    };
  }

  function titleFor(kind, outcome, ctx) {
    switch (outcome.outcomeType) {
      case 'confirmedCatch': return 'Confirmed Aerial Intercept';
      case 'featherEvent': return 'Feather Event at ' + ctx.zone;
      case 'squirrelEscape': return 'The Squirrel Escaped Again';
      case 'escape': return 'Hostile Withdrawal from ' + ctx.zone;
      case 'falseAlarm': return 'Threat Reassessed: ' + (ctx.falseAlarmNoun.charAt(0).toUpperCase() + ctx.falseAlarmNoun.slice(1));
      case 'environmentalMisidentification': return 'Misidentification in ' + ctx.zone;
      case 'vorgNonConfirmation': return 'Anomaly at the Far Corner';
      case 'patrolSuccess': return 'Sector Secured: ' + ctx.zone;
      default: return 'Incident at ' + ctx.zone;
    }
  }

  // ---- Run summary --------------------------------------------------------
  var PRESTIGE_RANKS = [
    { min: 0, title: 'Backyard Skirmisher' },
    { min: 40, title: 'Perimeter Warden' },
    { min: 90, title: 'Apex of the Lawn' },
    { min: 160, title: 'Terror of the Tree Line' },
    { min: 250, title: 'Mythic Backyard Warlord' }
  ];
  function prestigeRank(score) {
    var r = PRESTIGE_RANKS[0];
    for (var i = 0; i < PRESTIGE_RANKS.length; i++) if (score >= PRESTIGE_RANKS[i].min) r = PRESTIGE_RANKS[i];
    return r.title;
  }

  var RUN_TITLES = [
    'The Patio Exclusion Campaign',
    'Operation Suspicious Lawn',
    'The Fence Line Reprisals',
    'A Brief and Total War',
    'The Afternoon Offensive'
  ];

  function summarizeRun(incidents, stats) {
    incidents = incidents || [];
    var s = {
      total: incidents.length,
      confirmedCatches: 0, featherEvents: 0, birdEscapes: 0,
      rabbitEscapes: 0, squirrelFailures: 0, falseAlarms: 0, vorgEvidence: 0,
      prestige: 0
    };
    for (var i = 0; i < incidents.length; i++) {
      var inc = incidents[i];
      s.prestige += inc.points || 0;
      switch (inc.outcomeType) {
        case 'confirmedCatch': s.confirmedCatches++; break;
        case 'featherEvent': s.featherEvents++; break;
        case 'squirrelEscape': s.squirrelFailures++; break;
        case 'falseAlarm': s.falseAlarms++; break;
        case 'vorgNonConfirmation': s.vorgEvidence++; break;
        case 'escape':
          if (inc.kind === 'bird') s.birdEscapes++; else s.rabbitEscapes++;
          break;
      }
    }
    var totalCatches = s.confirmedCatches + s.featherEvents;

    var primaryZone = stats && stats.zoneName ? stats.zoneName : 'the backyard';
    var vorgStatus = s.vorgEvidence > 0
      ? 'Evidence logged (' + s.vorgEvidence + ') · still unconfirmed'
      : 'No anomalies detected · the corner was quiet';

    // The grand finale joke: inflated official vs. deflating reality.
    var official = 'Sakura conducted a devastating ' +
      (totalCatches > 2 ? 'airspace denial campaign' : (s.squirrelFailures > totalCatches ? 'fence-line containment operation' : 'pacification sweep')) +
      ' across ' + primaryZone + '. The realm is, once again, secure.';

    var realFrags = [];
    if (totalCatches > 0) realFrags.push('neutralized ' + totalCatches + ' bird' + (totalCatches === 1 ? '' : 's'));
    else if (s.birdEscapes > 0) realFrags.push('spooked ' + s.birdEscapes + ' bird' + (s.birdEscapes === 1 ? '' : 's'));
    if (s.rabbitEscapes > 0) realFrags.push('missed ' + s.rabbitEscapes + ' rabbit' + (s.rabbitEscapes === 1 ? '' : 's'));
    if (s.squirrelFailures > 0) realFrags.push('failed to catch ' + s.squirrelFailures + ' squirrel' + (s.squirrelFailures === 1 ? '' : 's') + ' (as required by canon)');
    if (s.falseAlarms > 0) realFrags.push('barked at ' + s.falseAlarms + ' inanimate object' + (s.falseAlarms === 1 ? '' : 's'));
    if (s.vorgEvidence > 0) realFrags.push('logged ' + s.vorgEvidence + ' unconfirmed anomal' + (s.vorgEvidence === 1 ? 'y' : 'ies') + ' at the far corner');
    if (!realFrags.length) realFrags.push('stood in the grass with great purpose');

    var likely = 'She ' + joinList(realFrags) + '.';

    return {
      runId: stats && stats.runId,
      runTitle: R().pick(RUN_TITLES),
      prestige: s.prestige,
      prestigeRank: prestigeRank(s.prestige),
      counts: s,
      total: s.total,
      confirmedCatches: totalCatches,
      escapes: s.rabbitEscapes + s.birdEscapes,
      squirrelFailures: s.squirrelFailures,
      vorgStatus: vorgStatus,
      officialInterpretation: official,
      likelyReality: likely,
      incidents: incidents
    };
  }

  function joinList(arr) {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
  }

  // ---- Patrol outcome resolution ------------------------------------------
  // Patrol is surveillance, not reaction. Encounter kind + chosen action
  // ('investigate' | 'stalk' | 'pounce' | 'report') produce an outcome.
  // Canon is still enforced: squirrels never caught, vorg never confirmed.
  // Encounter kinds: squirrel | rabbit | bird | falseAlarm | environmental
  //                  | vorg | victory
  function resolvePatrol(kind, action) {
    var rnd = R();
    switch (kind) {
      case 'squirrel':
        return { outcomeType: 'squirrelEscape', violenceLevel: 'chased', comedyType: 'institutional-embarrassment', success: false, points: 0 };

      case 'rabbit':
        var engaged = (action === 'pounce' || action === 'stalk');
        return { outcomeType: 'escape', violenceLevel: 'startled', comedyType: 'found-victory', success: false, nearMiss: action === 'pounce', points: engaged ? 8 : 4 };

      case 'bird':
        if (action === 'pounce' || action === 'stalk') {
          var mythic = action === 'pounce' && rnd.chance(0.25);
          return { outcomeType: mythic ? 'confirmedCatch' : 'featherEvent', violenceLevel: mythic ? 'confirmedKillMythic' : 'featherBurst', comedyType: 'mythic-understatement', success: true, points: mythic ? 100 : 55 };
        }
        return { outcomeType: 'escape', violenceLevel: 'startled', comedyType: 'found-victory', success: false, points: 5 };

      case 'falseAlarm':
        return { outcomeType: 'falseAlarm', violenceLevel: 'harmless', comedyType: 'found-victory', success: true, points: 12 };

      case 'environmental':
        return { outcomeType: 'environmentalMisidentification', violenceLevel: 'harmless', comedyType: 'found-victory', success: true, points: 10 };

      case 'vorg':
        return { outcomeType: 'vorgNonConfirmation', violenceLevel: 'unknown', comedyType: 'ominous-footnote', success: false, points: 0, vorgEvidence: true };

      case 'victory':
        return { outcomeType: 'patrolSuccess', violenceLevel: 'harmless', comedyType: 'wholesome', success: true, points: 25 };

      default:
        return { outcomeType: 'falseAlarm', violenceLevel: 'harmless', comedyType: 'found-victory', success: false, points: 0 };
    }
  }

  global.SakuraIncident = {
    resolveOutcome: resolveOutcome,
    resolvePatrol: resolvePatrol,
    createIncident: createIncident,
    summarizeRun: summarizeRun,
    getOfficialInterpretation: function (inc) { return inc ? inc.officialInterpretation : ''; },
    getLikelyReality: function (inc) { return inc ? inc.likelyReality : ''; },
    prestigeRank: prestigeRank
  };
})(typeof window !== 'undefined' ? window : this);
