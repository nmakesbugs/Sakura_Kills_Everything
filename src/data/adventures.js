/* =============================================================
   Sakura Kills Everything — Adventure Registry
   The product is now adventure-first: short, authored Sakura stories.
   This is the catalogue the home screen and (future) adventure system
   read from. Content for an episode lives in its own folder.

   No bundler. Attaches to window.SakuraData.adventures (classic script).
   ============================================================= */
(function (global) {
  'use strict';

  var ADVENTURES = [
    {
      id: 'bird-incident',
      title: 'The Bird Incident',
      status: 'playable',
      route: 'src/adventures/bird-incident/index.html',
      icon: '🐦',
      premise: 'A bird entered restricted airspace. Sakura noticed. History awaits paperwork.'
    },
    {
      id: 'squirrel-surveillance',
      title: 'Squirrel Surveillance',
      status: 'coming-soon',
      route: null,
      icon: '🐿️',
      premise: 'The Directorate is moving along the fence line. Establish a watch. Confirm nothing.'
    },
    {
      id: 'garden-frontier',
      title: 'Rabbit at the Garden Frontier',
      status: 'coming-soon',
      route: null,
      icon: '🐇',
      premise: 'General Thistle holds the garden. A staring contest of national importance.'
    },
    {
      id: 'vorg-watch',
      title: 'Vorg Watch',
      status: 'coming-soon',
      route: null,
      icon: '👁️',
      premise: 'Dusk at the far corner. Hold the line. Do not advance. Do not confirm.'
    }
  ];

  var byId = {};
  for (var i = 0; i < ADVENTURES.length; i++) byId[ADVENTURES[i].id] = ADVENTURES[i];

  global.SakuraData = global.SakuraData || {};
  global.SakuraData.adventures = ADVENTURES;
  global.SakuraData.adventureById = function (id) { return byId[id] || null; };
})(typeof window !== 'undefined' ? window : this);
