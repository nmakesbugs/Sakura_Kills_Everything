# Event Engine

> Status: Placeholder — Build 1. Architecture concept only.

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

## Architecture (To Be Implemented)

```
EventEngine.roll(zone, season, timeOfDay)
  → returns: Event | null
  
Event {
  type: 'standard' | 'anomaly' | 'vorg' | 'seasonal'
  creature: CreatureType
  zone: Zone
  message: string  // canonical copy
  duration: number // milliseconds until escape
}
```

Event tables will live in `src/data/events.js` once implemented.

---

## Design Constraint

Every event should have a narrative message in correct game voice. The event engine is not just a creature spawner — it is a storytelling system.
