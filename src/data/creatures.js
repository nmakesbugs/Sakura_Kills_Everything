/* =============================================================
   Sakura Kills Everything — Creature Data (gameplay-facing subset)
   Curated from docs/canon/creature-catalog.md + creature-taxonomy.md.

   No bundler. Attaches to window.SakuraData.creatures (classic script).

   CANON LAWS encoded here (do not violate):
   - squirrels:  catchable = false   (zero confirmed catches, ever)
   - the vorg:   catchable = false   (existence never confirmed)
   - birds:      catchable = true    (The Bird Incident is canon)
   - rabbits:    catchable = false   (escape-biased; near-miss only)

   Each creature: id, name, type, faction, catchable, threatLevel,
   movementStyle, preferredZones, behaviorTags, officialDescription,
   likelyReality, canonLaw, preferredModeUse.
   ============================================================= */
(function (global) {
  'use strict';

  var CREATURES = [
    /* ---- The Hunter ---- */
    {
      id: 'sakura',
      name: 'Sakura',
      type: 'dog',
      faction: 'order-of-the-dusk-vigil',
      catchable: false,
      threatLevel: 'apex',
      movementStyle: 'pounce',
      preferredZones: ['great-patio', 'open-field', 'fence-line', 'dusk-vigil-point'],
      behaviorTags: ['sincere', 'relentless', 'joyful', 'lovable', 'vicious-in-spirit'],
      officialDescription: 'Warden of the Perimeter. Apex backyard predator. Tiny predator, historic consequences.',
      likelyReality: 'A very good dog who believes she is a warlord and is loved without exception.',
      canonLaw: 'Sakura is always lovable, always sincere, allowed to be cartoon-vicious.',
      preferredModeUse: 'all'
    },

    /* ---- The Squirrels (NEVER caught) ---- */
    {
      id: 'the-squirrel',
      name: 'The Squirrel',
      type: 'squirrel',
      faction: 'squirrel-directorate',
      catchable: false,
      threatLevel: 'extreme',
      movementStyle: 'erratic-dash',
      preferredZones: ['fence-line', 'open-field', 'tree-line', 'old-tree'],
      behaviorTags: ['smug', 'fast', 'eternal', 'uncatchable'],
      officialDescription: 'The singular, immortal nemesis. Every chase, in Sakura’s mind, is against this one creature.',
      likelyReality: 'Many squirrels. None have ever been caught. This remains an institutional embarrassment.',
      canonLaw: 'No squirrel has ever been confirmed caught. This will never change.',
      preferredModeUse: 'duck-hunt'
    },
    {
      id: 'acorn',
      name: 'Acorn',
      type: 'squirrel',
      faction: 'squirrel-directorate',
      catchable: false,
      threatLevel: 'high',
      movementStyle: 'reckless-sprint',
      preferredZones: ['open-field', 'fence-line', 'drop-zone'],
      behaviorTags: ['brash', 'reckless', 'rookie', 'crowd-favorite'],
      officialDescription: 'The brash field-crosser. Has come closer to capture than any squirrel in history — twice — and treats both as victories.',
      likelyReality: 'A young squirrel who runs across the open lawn when the fence would be smarter.',
      canonLaw: 'May be cornered and humiliated. Never confirmed caught.',
      preferredModeUse: 'duck-hunt'
    },
    {
      id: 'field-marshal-bramble',
      name: 'Field Marshal Bramble',
      type: 'squirrel',
      faction: 'squirrel-directorate',
      catchable: false,
      threatLevel: 'extreme',
      movementStyle: 'never-descends',
      preferredZones: ['old-tree', 'tree-line'],
      behaviorTags: ['unseen', 'mastermind', 'possibly-mythical'],
      officialDescription: 'The presumed squirrel high command, directing operations from the upper branches of the Old Tree.',
      likelyReality: 'May not exist. Has never been seen at ground level. Has never once looked down.',
      canonLaw: 'The unseen mastermind is never captured and never confirmed real.',
      preferredModeUse: 'rpg'
    },
    {
      id: 'old-greycoat',
      name: 'Old Greycoat',
      type: 'squirrel',
      faction: 'squirrel-directorate',
      catchable: false,
      threatLevel: 'low',
      movementStyle: 'still-watcher',
      preferredZones: ['tree-line', 'old-tree'],
      behaviorTags: ['ancient', 'veteran', 'truce', 'poignant'],
      officialDescription: 'The ancient squirrel. A battlefield understanding exists between him and Sakura. She does not pursue him.',
      likelyReality: 'An old squirrel who stopped running. Sakura, who chases motion, simply lets him be.',
      canonLaw: 'The Truce of Old Greycoat holds. He is never pursued, never caught.',
      preferredModeUse: 'rpg'
    },
    {
      id: 'corner-sentry',
      name: 'The Corner Sentry',
      type: 'squirrel',
      faction: 'squirrel-directorate',
      catchable: false,
      threatLevel: 'high',
      movementStyle: 'lookout',
      preferredZones: ['fence-line'],
      behaviorTags: ['watcher', 'spoiler', 'counter-intelligence'],
      officialDescription: 'The lookout posted at the Corner Post. Issues the alarm chitter that empties the field the instant Sakura commits.',
      likelyReality: 'A squirrel that warns the others. It is not personal. Sakura has decided it is very personal.',
      canonLaw: 'Never caught. Defeating the Sentry only grants a clean run, never a catch.',
      preferredModeUse: 'duck-hunt'
    },

    /* ---- The Rabbits (escape-biased) ---- */
    {
      id: 'general-thistle',
      name: 'General Thistle',
      type: 'rabbit',
      faction: 'rabbit-coalition',
      catchable: false,
      threatLevel: 'high',
      movementStyle: 'freeze-then-explode',
      preferredZones: ['garden-frontier', 'warlords-hollow'],
      behaviorTags: ['warlord', 'patient', 'still-master', 'dignified'],
      officialDescription: 'The rabbit warlord of the Garden Frontier. Master of stillness, followed by explosive, contemptuous escape.',
      likelyReality: 'A rabbit that holds very still and then leaves very fast. Wins every staring contest.',
      canonLaw: 'Rabbits escape. Thistle has never been caught and is never harmed.',
      preferredModeUse: 'rpg'
    },
    {
      id: 'the-twitch',
      name: 'The Twitch',
      type: 'rabbit',
      faction: 'rabbit-coalition',
      catchable: false,
      threatLevel: 'moderate',
      movementStyle: 'nervous-bolt',
      preferredZones: ['garden-frontier'],
      behaviorTags: ['nervous', 'comic', 'bad-at-ambush'],
      officialDescription: 'Thistle’s nervous lieutenant. Gives away ambushes by twitching at the wrong moment.',
      likelyReality: 'A jumpy rabbit who survives mostly by standing near calmer rabbits.',
      canonLaw: 'Escape-biased. The Twitch blowing his own cover is the joke, not his capture.',
      preferredModeUse: 'duck-hunt'
    },
    {
      id: 'duchess-clover',
      name: 'Duchess Clover',
      type: 'rabbit',
      faction: 'rabbit-coalition',
      catchable: false,
      threatLevel: 'moderate',
      movementStyle: 'unbothered-graze',
      preferredZones: ['open-field', 'garden-frontier'],
      behaviorTags: ['aristocratic', 'unbothered', 'diplomat'],
      officialDescription: 'The elegant rabbit of the dawn lawn. Grazes in full view as if daring anyone to comment.',
      likelyReality: 'A confident rabbit who eats grass in the open. Outranks Thistle socially, no one militarily.',
      canonLaw: 'Escape-biased. A diplomat, never prey.',
      preferredModeUse: 'rpg'
    },

    /* ---- The Birds (catchable, comically) ---- */
    {
      id: 'captain-flit',
      name: 'Captain Flit',
      type: 'bird',
      faction: 'bird-council',
      catchable: true,
      threatLevel: 'high',
      movementStyle: 'land-just-out-of-reach',
      preferredZones: ['great-patio', 'open-field', 'tree-line'],
      behaviorTags: ['cocky', 'robin', 'provocateur', 'signature-rival'],
      officialDescription: 'The cocky robin of the Great Patio. Lands just out of reach, again and again, with the timing of a creature who has run the numbers.',
      likelyReality: 'A robin who found a safe food-adjacent spot. It only looks exactly like taunting.',
      canonLaw: 'Birds may be neutralized through feather-burst and official report. Captain Flit is the one you want most.',
      preferredModeUse: 'duck-hunt'
    },
    {
      id: 'the-robin',
      name: 'A Robin',
      type: 'bird',
      faction: 'bird-council',
      catchable: true,
      threatLevel: 'moderate',
      movementStyle: 'hop-and-flit',
      preferredZones: ['open-field', 'great-patio', 'garden-frontier'],
      behaviorTags: ['common', 'ground-feeder', 'catchable'],
      officialDescription: 'A rank-and-file member of the Aerial Assembly. Standard airspace violator.',
      likelyReality: 'A robin. There are many. Some of them land where Sakura can reach.',
      canonLaw: 'Catchable via feather-event. Birds are the only confirmed catch in canon.',
      preferredModeUse: 'duck-hunt'
    },
    {
      id: 'sparrow-squadron',
      name: 'The Sparrow Squadron',
      type: 'bird',
      faction: 'bird-council',
      catchable: true,
      threatLevel: 'moderate',
      movementStyle: 'scatter-swarm',
      preferredZones: ['great-patio', 'open-field'],
      behaviorTags: ['flock', 'fast', 'numbers'],
      officialDescription: 'A fast-moving flock that arrives as one and scatters as many. Numbers are their doctrine.',
      likelyReality: 'Small fast birds being small and fast near the feeder.',
      canonLaw: 'Catchable individually but rarely; the swarm mostly escapes.',
      preferredModeUse: 'duck-hunt'
    },
    {
      id: 'crow-envoy',
      name: 'The Crow Council Envoy',
      type: 'bird',
      faction: 'crow-council',
      catchable: false,
      threatLevel: 'unknown',
      movementStyle: 'watch-and-depart',
      preferredZones: ['tree-line', 'old-tree'],
      behaviorTags: ['foreign', 'intelligent', 'observer', 'unsettling'],
      officialDescription: 'A large crow from beyond the fence. Watches. Does not flee. Reports to powers unknown.',
      likelyReality: 'A crow that looks at the yard. Crows do that. But it really does seem like it knows something.',
      canonLaw: 'A foreign power, not prey. Sakura watches it without barking — a rare caution.',
      preferredModeUse: 'rpg'
    },

    /* ---- The Underground & Small Theater ---- */
    {
      id: 'pockets',
      name: 'Pockets',
      type: 'chipmunk',
      faction: 'tunnel-authority',
      catchable: false,
      threatLevel: 'moderate',
      movementStyle: 'pop-and-vanish',
      preferredZones: ['garden-frontier', 'great-patio'],
      behaviorTags: ['smuggler', 'underground', 'cheeks-full'],
      officialDescription: 'The chipmunk who vanishes into impossible gaps. Operates the realm’s informal smuggling routes below the surface.',
      likelyReality: 'A chipmunk that disappears into a hole faster than anyone can react.',
      canonLaw: 'Uses the third dimension (down). Escape-biased; cannot be confirmed caught.',
      preferredModeUse: 'chaos'
    },
    {
      id: 'the-buzz',
      name: 'The Buzz',
      type: 'insect',
      faction: 'none',
      catchable: false,
      threatLevel: 'low',
      movementStyle: 'maddening-loop',
      preferredZones: ['great-patio', 'garden-frontier'],
      behaviorTags: ['fly', 'humbling', 'comic'],
      officialDescription: 'The single fly that turns a dignified Warden into an undignified blur. The great humbler.',
      likelyReality: 'A fly. It has never been caught and never been respected and somehow always wins.',
      canonLaw: 'Beneath her life’s work. Acceptable when slow-moving. Never actually caught.',
      preferredModeUse: 'chaos'
    },

    /* ---- The Foreign Power ---- */
    {
      id: 'neighbors-cat',
      name: 'The Neighbor’s Cat',
      type: 'cat',
      faction: 'the-cats-court',
      catchable: false,
      threatLevel: 'unknown',
      movementStyle: 'supreme-composure',
      preferredZones: ['diplomatic-fence'],
      behaviorTags: ['foreign', 'composed', 'possible-equal', 'cold-war'],
      officialDescription: 'The realm’s only foreign head of state. Sits upon the Diplomatic Fence with insufferable composure.',
      likelyReality: 'The neighbor’s cat. Possibly the only creature Sakura considers an equal. She would never admit it.',
      canonLaw: 'A sovereign, not prey. The border has never been crossed by either side.',
      preferredModeUse: 'rpg'
    },

    /* ---- The Mystery (NEVER confirmed) ---- */
    {
      id: 'the-vorg',
      name: 'The Vorg',
      type: 'unconfirmed',
      faction: 'unknown',
      catchable: false,
      threatLevel: 'unknown',
      movementStyle: 'inferred-only',
      preferredZones: ['unknown-regions', 'dusk-vigil-point'],
      behaviorTags: ['mystery', 'unconfirmed', 'frontier', 'never-resolve'],
      officialDescription: 'Existence unconfirmed. Inferred only from Sakura’s anomalous restraint at the far corner. Something is back there.',
      likelyReality: 'Unknown. Possibly shade. Possibly a habit. Possibly something. The mystery only grows.',
      canonLaw: 'The vorg is NEVER confirmed and NEVER caught. Encounters produce non-confirmation only.',
      preferredModeUse: 'patrol'
    }
  ];

  var byId = {};
  for (var i = 0; i < CREATURES.length; i++) byId[CREATURES[i].id] = CREATURES[i];

  global.SakuraData = global.SakuraData || {};
  global.SakuraData.creatures = CREATURES;
  global.SakuraData.creatureById = function (id) { return byId[id] || null; };
  global.SakuraData.creaturesByType = function (type) {
    return CREATURES.filter(function (c) { return c.type === type; });
  };
})(typeof window !== 'undefined' ? window : this);
