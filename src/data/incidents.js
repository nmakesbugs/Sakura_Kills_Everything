/* =============================================================
   Sakura Kills Everything — Curated Incident Data
   Hand-picked from docs/canon/incident-archive.md, expressed in the
   canonical incident schema (see docs/systems/incident-system.md).

   These are the SEED incidents shown in the Canon Archive and used as
   reference shapes. Runs generate fresh incidents at play time via the
   incident engine; these are the museum pieces.

   No bundler. Attaches to window.SakuraData.incidents (classic script).
   ============================================================= */
(function (global) {
  'use strict';

  var INCIDENTS = [
    {
      id: 'INC-001',
      title: 'The Bird Incident',
      dateClassification: 'Foundational · undated legend',
      zone: 'open-field',
      creatures: ['sakura', 'the-robin'],
      factions: ['bird-council'],
      witnesses: ['Tanisha'],
      trigger: 'A bird descended into reachable airspace.',
      playerAction: 'Aerial pounce.',
      outcomeType: 'confirmedCatch',
      officialInterpretation: 'Sakura achieved the realm’s only confirmed aerial intercept. Air supremacy was, for one historic moment, total.',
      likelyReality: 'She actually caught a bird out of the air, thrashed it, and rolled in it. Tanisha found the feathers. It really happened.',
      canonStatus: 'canon',
      violenceLevel: 'confirmedKillMythic',
      comedyType: 'mythic-understatement',
      relatedAchievements: ['the-day-history-changed', 'birds-must-die'],
      relatedHooks: ['captain-flit-nests']
    },
    {
      id: 'INC-004',
      title: 'The Securing of the Open Field',
      dateClassification: 'Recurring · thousands of instances',
      zone: 'open-field',
      creatures: ['sakura', 'acorn'],
      factions: ['squirrel-directorate'],
      witnesses: ['the family'],
      trigger: 'A squirrel crossed the open field.',
      playerAction: 'Full-sprint pursuit.',
      outcomeType: 'squirrelEscape',
      officialInterpretation: 'A decisive territorial victory. The open field was, once again, secured by force.',
      likelyReality: 'The squirrel reached the fence easily and was never in danger. Sakura declared victory anyway.',
      canonStatus: 'canon',
      violenceLevel: 'chased',
      comedyType: 'found-victory',
      relatedAchievements: ['the-field-was-secured'],
      relatedHooks: ['fastest-chase-ever']
    },
    {
      id: 'INC-006',
      title: 'The Acorn Near-Catch',
      dateClassification: 'A bright afternoon',
      zone: 'open-field',
      creatures: ['sakura', 'acorn'],
      factions: ['squirrel-directorate'],
      witnesses: ['Nolyn'],
      trigger: 'Acorn misjudged his crossing route.',
      playerAction: 'Closing sprint to within one body-length.',
      outcomeType: 'squirrelEscape',
      officialInterpretation: 'Proof the system works. The Squirrel can be caught. It is only a matter of time.',
      likelyReality: 'Closest a squirrel has ever come to capture. Still escaped. The institutional embarrassment endures.',
      canonStatus: 'canon',
      violenceLevel: 'chased',
      comedyType: 'glorious-failure',
      relatedAchievements: ['zero-and-counting'],
      relatedHooks: ['fastest-chase-ever']
    },
    {
      id: 'INC-011',
      title: 'The Inspection That Found Nothing',
      dateClassification: 'Recurring',
      zone: 'garden-frontier',
      creatures: ['sakura', 'general-thistle'],
      factions: ['rabbit-coalition'],
      witnesses: ['the family'],
      trigger: 'Fresh rabbit sign in the Garden Frontier.',
      playerAction: 'Garden sweep.',
      outcomeType: 'escape',
      officialInterpretation: 'Near-miss interdiction. The enemy fled moments before contact. Pressure is working.',
      likelyReality: 'The rabbits left before she arrived, easily, as always. The hollow was still warm.',
      canonStatus: 'canon',
      violenceLevel: 'startled',
      comedyType: 'found-victory',
      relatedAchievements: ['out-stared-by-a-rabbit'],
      relatedHooks: ['warlords-hollow-empty']
    },
    {
      id: 'INC-013',
      title: 'The Garden Distraction',
      dateClassification: 'Recurring · worst in summer',
      zone: 'garden-frontier',
      creatures: ['sakura', 'the-twitch'],
      factions: ['rabbit-coalition'],
      witnesses: ['Nick'],
      trigger: 'An active rabbit pursuit met an overwhelming smell.',
      playerAction: 'Pursuit abandoned mid-stride to investigate.',
      outcomeType: 'gloriousFailure',
      officialInterpretation: 'Tactical reconnaissance. The scent contained vital intelligence.',
      likelyReality: 'The garden smells incredible and her nose took command. The rabbit strolled away.',
      canonStatus: 'canon',
      violenceLevel: 'harmless',
      comedyType: 'glorious-failure',
      relatedAchievements: ['defeated-by-a-smell'],
      relatedHooks: []
    },
    {
      id: 'INC-016',
      title: 'Captain Flit’s Patio Violations',
      dateClassification: 'Daily',
      zone: 'great-patio',
      creatures: ['sakura', 'captain-flit'],
      factions: ['bird-council'],
      witnesses: ['the family'],
      trigger: 'A robin landed just out of reach on the throne-room patio.',
      playerAction: 'Repeated lunges.',
      outcomeType: 'escape',
      officialInterpretation: 'Deliberate airspace provocation by a known repeat offender. Surveillance ongoing.',
      likelyReality: 'A robin uses a safe spot near food. It is not taunting her. It might be a little taunting.',
      canonStatus: 'canon',
      violenceLevel: 'startled',
      comedyType: 'absurd-bureaucracy',
      relatedAchievements: ['the-one-that-got-away'],
      relatedHooks: ['captain-flit-nests']
    },
    {
      id: 'INC-020',
      title: 'The Lawnmower Standoff',
      dateClassification: 'Each mowing',
      zone: 'open-field',
      creatures: ['sakura'],
      factions: [],
      witnesses: ['Nick'],
      trigger: 'The lawnmower activated.',
      playerAction: 'Direct confrontation.',
      outcomeType: 'gloriousFailure',
      officialInterpretation: 'An honorable draw against a larger, louder adversary. Walked away from like a champion.',
      likelyReality: 'She barked at a machine and was brought inside. The draw is generous.',
      canonStatus: 'canon',
      violenceLevel: 'harmless',
      comedyType: 'found-victory',
      relatedAchievements: [],
      relatedHooks: []
    },
    {
      id: 'INC-024',
      title: 'The Forgotten Toy, Recovered',
      dateClassification: 'A joyful afternoon',
      zone: 'open-field',
      creatures: ['sakura'],
      factions: [],
      witnesses: ['Nolyn'],
      trigger: 'A toy long presumed lost surfaced in the grass.',
      playerAction: 'Excavation.',
      outcomeType: 'patrolSuccess',
      officialInterpretation: 'Recovery of a lost artifact of immense historical value.',
      likelyReality: 'She found an old toy and was perfectly, completely happy. No enemy. Just joy.',
      canonStatus: 'canon',
      violenceLevel: 'harmless',
      comedyType: 'wholesome',
      relatedAchievements: ['the-forgotten-toy'],
      relatedHooks: ['another-forgotten-toy']
    },
    {
      id: 'INC-025',
      title: 'The Dusk Vigil',
      dateClassification: 'Every evening',
      zone: 'dusk-vigil-point',
      creatures: ['sakura', 'the-vorg'],
      factions: ['unknown'],
      witnesses: ['Cias'],
      trigger: 'Dusk fell over the Unknown Regions.',
      playerAction: 'Held the line. Did not advance.',
      outcomeType: 'vorgNonConfirmation',
      officialInterpretation: 'Disciplined containment of an unconfirmed frontier threat. The Warden guards the edge of the known world.',
      likelyReality: 'She will not commit to the far corner at dusk. No one knows why. This is the best evidence for the vorg.',
      canonStatus: 'unconfirmed',
      violenceLevel: 'unknown',
      comedyType: 'ominous-footnote',
      relatedAchievements: ['the-believer', 'sketch-c'],
      relatedHooks: ['new-tracks-far-corner', 'dusk-vigil-runs-long']
    },
    {
      id: 'INC-027',
      title: 'The Tracks at the Far Corner',
      dateClassification: 'One morning after rain',
      zone: 'unknown-regions',
      creatures: ['the-vorg'],
      factions: ['unknown'],
      witnesses: ['Nolyn', 'Nick'],
      trigger: 'Unfamiliar tracks appeared at the Far Fence Corner.',
      playerAction: 'Evidence gathering. (The photo was blurry.)',
      outcomeType: 'vorgNonConfirmation',
      officialInterpretation: 'The first physical evidence of an unclassified frontier creature.',
      likelyReality: 'Tracks that matched nothing, gone before re-examination. Could be anything. The mystery grew.',
      canonStatus: 'unconfirmed',
      violenceLevel: 'unknown',
      comedyType: 'ominous-footnote',
      relatedAchievements: ['the-blurry-photo'],
      relatedHooks: ['new-tracks-far-corner', 'cold-spot-moves']
    }
  ];

  var byId = {};
  for (var i = 0; i < INCIDENTS.length; i++) byId[INCIDENTS[i].id] = INCIDENTS[i];

  global.SakuraData = global.SakuraData || {};
  global.SakuraData.incidents = INCIDENTS;
  global.SakuraData.incidentById = function (id) { return byId[id] || null; };
})(typeof window !== 'undefined' ? window : this);
