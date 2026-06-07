# Event Engine

> Status: **Realized in Stage 0.2** as the incident engine + voice engine. The proposed event
> taxonomy below remains the design target; the working API is `window.SakuraIncident` and
> `window.SakuraVoice`. A data-driven `src/data/events.js` table is planned for 0.3. See
> `incident-system.md`.

---

## Purpose

The event engine generates random backyard incidents that inject narrative variety into every game session. It is the mechanism by which the backyard feels alive rather than mechanical.

---

## Event Types (Proposed)

### Standard Events
- Squirrel sighting, fence line sector A
- Rabbit in garden sector, stationary
- Bird approach, trajectory: northwest
- Two squirrels, possible coordination

### Anomaly Events (Low probability)
- Squirrel did not flee immediately — anomalous
- Rabbit made eye contact (threat assessment pending)
- Something moved in The Unknown Regions
- Crow sighting, large, neighboring territory

### Vorg Events (Very low probability, conditional)
- Vorg alert status: elevated
- Unidentified movement, Unknown Regions, 0300 hours
- Sakura has been staring at the corner for eleven minutes

### Seasonal Events
- First bird of spring migration — Sakura is ready
- Winter squirrel: moving slowly, still escaped
- Summer: maximum bug density, Sakura has opinions

---

## Architecture (Realized in Stage 0.2)

The working engine is incident-centric. A mode spawns a target, then resolves it into an
incident:

```
SakuraIncident.resolveOutcome(kind, didHit, creature)  → outcome descriptor (canon-enforced)
SakuraIncident.resolvePatrol(kind, action)             → outcome descriptor (Patrol, 0.3)
SakuraIncident.createIncident({ kind, didHit, zoneId, creatureId, runId })  → incident
SakuraIncident.summarizeRun(incidents, stats)  → after-action report (official vs likely)
SakuraVoice.getLine(category) / formatIncidentLine(incident)  → narration
SakuraStorage.saveIncidents(incidents, ctx) / loadIncidents() / getStats()  → persistence (0.3)
```

A data-driven `src/data/events.js` table (triggers, weights, seasonal gating) is planned for a
later stage so designers can add events without touching engine code; it will feed the same
`createIncident` pipeline and inherit canon enforcement for free.

**Persistence (Stage 0.3):** filed incidents are written to `localStorage` (`ske-incidents-v1`)
via `SakuraStorage` and read back by the Canon Archive's Permanent Record. See
`docs/technical/architecture.md` and `incident-system.md`.

**Browsing & territory stats (Stage 0.4):** `SakuraStorage.getStats()` now returns `byZone`,
`byZoneId`, `byCreature`, `mostCommonZone`, and `mostCommonCreature`; `countByZoneId()` feeds
the Patrol zone map's filed-report counts. The Canon Archive uses these plus
`SakuraUI.renderIncidentRow` / `openIncidentDetail` for filters, grouping, and a detail modal.

---

## Design Constraint

Every event should have a narrative message in correct game voice. The event engine is not just a creature spawner — it is a storytelling system.
