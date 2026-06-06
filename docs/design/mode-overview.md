# Mode Overview

---

## Build Status Key

| Status | Meaning |
|---|---|
| 🟢 Complete | Playable |
| 🟡 In Progress | Under active development |
| ⚪ Planned | Designed, not built |
| 📋 Placeholder | Shell exists, no gameplay |

---

## Duck Hunt
**Status:** 📋 Placeholder (Build 1)  
**Planned for:** Build 2  
**Location:** `src/modes/duck-hunt/`

Tap-to-engage aerial targets. Birds, possibly large bugs, and anything else that has made the mistake of entering Sakura's airspace. Classic arcade timing: target appears, player taps Sakura toward it, outcome determined by timing and accuracy.

**Core feel:** Fast, satisfying, slightly chaotic. Sakura launches herself at things.  
**Difficulty source:** Targets move in ways informed by actual bird behavior.  
**Win condition:** Engagement initiated. Sakura always tries. Results vary.

---

## Patrol
**Status:** 📋 Placeholder (Build 1)  
**Planned for:** Build 3  
**Location:** `src/modes/side-scroller/`

Side-scrolling perimeter sweep. Sakura moves along the fence line, identifying and responding to threats. Players tap to direct attention and trigger engagement. The squirrels have been up to something. The evidence is all over the fence line.

**Core feel:** Methodical urgency. A security sweep that keeps finding more problems than expected.  
**Difficulty source:** Multiple simultaneous threats. Limited attention (Sakura's, not the player's).  
**Win condition:** Perimeter secured. Threat log updated.

---

## RPG Hunt
**Status:** 📋 Placeholder (Build 1)  
**Planned for:** Build 4  
**Location:** `src/modes/rpg/`

Turn-based strategic campaign. Sakura builds reputation, unlocks new zones, interrogates squirrels (results noncommittal), and pursues the long-form mystery of The Unknown Regions. The most ambitious mode. Canon will drive this one heavily.

**Core feel:** Deliberate. The backyard has depth. There is a larger story.  
**Difficulty source:** Strategic resource management (energy, attention, treat economy).  
**Win condition:** Unknown. The campaign is ongoing. As it should be.

---

## Chaos Mode
**Status:** 📋 Placeholder (Build 1)  
**Planned for:** Build 5  
**Location:** `src/modes/chaos/`

Unpredictable, unstructured, and loud. Several squirrels were involved. Chaos Mode uses the event engine to generate maximum-density backyard incidents simultaneously. Not for the faint of heart.

**Core feel:** Everything is happening. Sakura is handling it.  
**Difficulty source:** Information overload. Multiple overlapping incidents. At least one vorg alert.  
**Win condition:** Survival. The yard is still standing.

---

## Sakura Canon
**Status:** 📋 Placeholder (Build 1)  
**Planned for:** Build 2 (read-only archive)  
**Location:** `src/modes/canon/`

Not a game mode in the traditional sense. A browsable archive of confirmed Sakura incidents, organized by date, zone, and creature type. This is where the family's real stories live. Some incidents unlock content in other modes.

**Core feel:** Wikipedia written by someone who was there.  
**Content source:** `docs/canon/sakura-canon-bible.md` and family stories.  
**Access:** Always available. Canon does not require unlocking.
