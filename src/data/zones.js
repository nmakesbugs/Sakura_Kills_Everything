/* =============================================================
   Sakura Kills Everything — Zone Data (gameplay-facing subset)
   Curated from docs/canon/backyard-map.md. NOT the full canon —
   the most useful zones for modes, incidents, and backgrounds.

   No bundler. Attaches to window.SakuraData.zones (classic script).
   Each zone: id, name, subtitle, region, dangerLevel,
   commonCreatures (creature ids), officialDescription,
   likelyReality, modeUses, backgroundStyleHint.
   ============================================================= */
(function (global) {
  'use strict';

  var ZONES = [
    {
      id: 'great-patio',
      name: 'The Great Patio',
      subtitle: 'Seat of power · staging ground',
      region: 'Heartlands',
      dangerLevel: 'low',
      commonCreatures: ['captain-flit', 'the-buzz', 'sakura'],
      officialDescription: 'The throne room of the realm. Every campaign in recorded history has begun here. It has never fallen.',
      likelyReality: 'A patio. Sakura likes to stand on the warm stones and look at things.',
      modeUses: ['duck-hunt', 'patrol', 'canon'],
      backgroundStyleHint: 'warm-stone'
    },
    {
      id: 'threshold',
      name: 'The Threshold',
      subtitle: 'The door · beginning of all campaigns',
      region: 'Heartlands',
      dangerLevel: 'low',
      commonCreatures: ['sakura'],
      officialDescription: 'The most strategically vital point in the realm. Whoever controls the Threshold controls the war.',
      likelyReality: 'It is the back door. Opening it is the best part of Sakura’s day.',
      modeUses: ['patrol', 'canon'],
      backgroundStyleHint: 'doorway'
    },
    {
      id: 'open-field',
      name: 'The Open Field',
      subtitle: 'The high-speed plain',
      region: 'The Plain',
      dangerLevel: 'moderate',
      commonCreatures: ['acorn', 'the-squirrel', 'captain-flit'],
      officialDescription: 'Primary pursuit grounds. The site of nearly every “almost.” Speed country, where cover cannot save the enemy.',
      likelyReality: 'The middle of the yard. Squirrels cross it quickly because they are squirrels.',
      modeUses: ['duck-hunt', 'patrol'],
      backgroundStyleHint: 'open-grass'
    },
    {
      id: 'fence-line',
      name: 'The Great Fence Line',
      subtitle: 'The Eastern Territories · the highway',
      region: 'The Borders',
      dangerLevel: 'high',
      commonCreatures: ['the-squirrel', 'acorn', 'corner-sentry'],
      officialDescription: 'The most contested feature of the kingdom. The squirrel highway. Patrolled without ceasing, to no measurable effect.',
      likelyReality: 'A fence. Squirrels run along the top of it. They always have.',
      modeUses: ['duck-hunt', 'patrol'],
      backgroundStyleHint: 'fence-dusk'
    },
    {
      id: 'garden-frontier',
      name: 'The Garden Frontier',
      subtitle: 'Rabbit country · contested ground',
      region: 'The Borders',
      dangerLevel: 'high',
      commonCreatures: ['general-thistle', 'the-twitch', 'duchess-clover'],
      officialDescription: 'The front line of the Rabbit Question. The rabbits are not there. They were recently there. This is, somehow, worse.',
      likelyReality: 'A garden. It smells incredible, which ends most pursuits instantly.',
      modeUses: ['duck-hunt', 'patrol', 'rpg'],
      backgroundStyleHint: 'garden-beds'
    },
    {
      id: 'warlords-hollow',
      name: 'Warlord’s Hollow',
      subtitle: 'The rabbit seat of power',
      region: 'The Borders',
      dangerLevel: 'high',
      commonCreatures: ['general-thistle'],
      officialDescription: 'The presumed capital of the Rabbit Coalition. Sakura has stared into it. It has stared back.',
      likelyReality: 'A shadowy gap under the biggest garden bed. Probably empty. Probably.',
      modeUses: ['rpg', 'canon'],
      backgroundStyleHint: 'garden-shadow'
    },
    {
      id: 'tree-line',
      name: 'The Tree Line',
      subtitle: 'The canopy frontier',
      region: 'The Heights',
      dangerLevel: 'moderate',
      commonCreatures: ['the-squirrel', 'captain-flit', 'crow-envoy'],
      officialDescription: 'The realm’s great vertical limit. A squirrel that reaches the Tree Line has, by ancient convention, won.',
      likelyReality: 'Trees. Things go up them where Sakura cannot follow. This is most things.',
      modeUses: ['duck-hunt', 'patrol'],
      backgroundStyleHint: 'tree-canopy'
    },
    {
      id: 'old-tree',
      name: 'The Old Tree (The Sentinel)',
      subtitle: 'The unconquerable fortress',
      region: 'The Heights',
      dangerLevel: 'high',
      commonCreatures: ['field-marshal-bramble', 'the-squirrel'],
      officialDescription: 'The squirrels’ true capital. Beyond reach, beyond patrol. Sakura has circled its base more than any spot on earth.',
      likelyReality: 'A big tree. Field Marshal Bramble has never once looked down. He may not exist.',
      modeUses: ['rpg', 'canon'],
      backgroundStyleHint: 'tree-canopy'
    },
    {
      id: 'drop-zone',
      name: 'The Drop Zone',
      subtitle: 'Under the canopy · incoming acorns',
      region: 'The Heights',
      dangerLevel: 'moderate',
      commonCreatures: ['the-squirrel', 'acorn'],
      officialDescription: 'The only theater where the enemy holds the high ground and the artillery. Bombardment, taunting, or carelessness — the debate continues.',
      likelyReality: 'Acorns fall here. From above. Because of gravity.',
      modeUses: ['duck-hunt', 'chaos'],
      backgroundStyleHint: 'tree-canopy'
    },
    {
      id: 'diplomatic-fence',
      name: 'The Diplomatic Fence',
      subtitle: 'The Cat’s border · cold peace',
      region: 'The Borders',
      dangerLevel: 'moderate',
      commonCreatures: ['neighbors-cat'],
      officialDescription: 'The realm’s only foreign land border. Neither side has crossed. Neither has stood down. A cold peace held by dignified mutual denial.',
      likelyReality: 'The neighbor’s cat sits on the fence. Sakura and the cat refuse to acknowledge each other.',
      modeUses: ['patrol', 'rpg', 'canon'],
      backgroundStyleHint: 'fence-dusk'
    },
    {
      id: 'unknown-regions',
      name: 'The Unknown Regions',
      subtitle: 'The dark frontier · here be vorgs',
      region: 'The Frontier',
      dangerLevel: 'unknown',
      commonCreatures: ['the-vorg'],
      officialDescription: 'The far corner. Monitored, never mapped. Sakura holds the line here at dusk and does not commit. This is the strongest evidence for the vorg.',
      likelyReality: 'The overgrown back corner. Something about it gives even Sakura pause. No one knows what.',
      modeUses: ['patrol', 'canon'],
      backgroundStyleHint: 'corner-dark'
    },
    {
      id: 'dusk-vigil-point',
      name: 'The Dusk Vigil Point',
      subtitle: 'The edge of the known world',
      region: 'The Frontier',
      dangerLevel: 'unknown',
      commonCreatures: ['sakura', 'the-vorg'],
      officialDescription: 'Where the Warden faces the Unknown Regions each evening, holds, and returns. The most disciplined act of her career.',
      likelyReality: 'A spot near the back fence. She stares at the corner at dusk. Every night. We let her.',
      modeUses: ['patrol', 'canon'],
      backgroundStyleHint: 'corner-dark'
    }
  ];

  // Index for quick lookup by id.
  var byId = {};
  for (var i = 0; i < ZONES.length; i++) byId[ZONES[i].id] = ZONES[i];

  global.SakuraData = global.SakuraData || {};
  global.SakuraData.zones = ZONES;
  global.SakuraData.zoneById = function (id) { return byId[id] || null; };
})(typeof window !== 'undefined' ? window : this);
