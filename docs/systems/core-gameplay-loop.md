# Core Gameplay Loop

> System canon. The shared loop that every Sakura mode runs on. Duck Hunt is the first
> implementation; Patrol, RPG Hunt, and Chaos all run this same skeleton at different
> tempos. Implemented in Stage 0.2.

---

## The Core Insight

**Sakura Kills Everything is not mainly about score. It is about generating incidents.**

Score is a souvenir. The *incident* — the dual-layer record of what officially happened
versus what likely happened — is the product. Every mode is an incident factory running at
a different speed:

| Mode | Produces | Tempo |
|---|---|---|
| **Duck Hunt** | Fast incidents | Seconds |
| **Patrol** | Exploration incidents | Minutes |
| **RPG Hunt** | Quest incidents | Sessions |
| **Chaos Mode** | Cascading incidents | All at once |
| **Sakura Canon** | Preserves incidents | Forever |

If a mechanic does not eventually produce an incident, it is not finished. See
`incident-system.md` for the incident schema and `core` engine files
(`src/engine/incident-engine.js`).

---

## The Loop (Ten Beats)

Every engagement, in every mode, passes through these beats. Modes may compress or expand
each, but the spine is constant.

1. **Briefing** — The realm states the stakes. ("The backyard has made its final mistake.")
   Voice category: `briefing` / `runStart`.
2. **Detection** — A target is perceived. ("Contact. The backyard trembles.")
   Voice: `detection`.
3. **Stalking / Positioning** — The window opens. In Duck Hunt this is the target's brief
   on-screen life; in Patrol it is approach; in RPG it is planning.
4. **Pounce / Engagement** — The player commits Sakura. ("Sakura has entered kill mode.")
   Voice: `pounce`.
5. **Outcome** — The mechanical result: hit or miss, caught or escaped. Canon is enforced
   here (squirrels never caught, vorg never confirmed). See `incident-engine.resolveOutcome`.
6. **Official Interpretation** — The inflated, heroic version for the record.
   ("Sakura broke enemy air control over the Fence Line.")
7. **Likely Reality** — The deflating truth, in italics. ("A robin flew away and several
   feathers were discovered.") The gap between 6 and 7 is the whole game.
8. **Incident Report** — Beats 5–7 are packaged into a canon-shaped incident object and
   filed. `incident-engine.createIncident`.
9. **Reputation / Memory** — The incident updates run stats (prestige, counts), and at the end
   of a run the player files the report via **"File Official Report"** → it persists to the
   permanent record (`window.SakuraStorage`, key `ske-incidents-v1`) and appears in the Canon
   Archive across sessions. (Implemented Stage 0.3.)
10. **Next Hunt** — Return to a ready state. Another target spawns, or the run ends into an
    after-action report.

---

## The Run Wrapper

Individual loops are bundled into a **run** — a short, self-contained session that ends in
an **after-action report**. The report is where the game stops being a mini-game and
becomes *Sakura*:

- A grand **Official Interpretation** of the whole run (inflated, glorious).
- A deflating **Likely Reality** ("She scared two birds, missed a rabbit, and barked at a
  leaf.").
- A scoreboard (prestige, confirmed catches, escapes, squirrel failures, vorg evidence).
- The **incident cards** filed during the run.
- A prompt to run again.

Implemented for Duck Hunt via `incident-engine.summarizeRun` and rendered with
`src/ui/incident-card.js`.

---

## Canon Constraints on the Loop

- **Failure is funny, not punishing.** A missed run still produces a glorious report. There
  is no "game over" that shames the player or Sakura.
- **Squirrels never resolve to a catch** at beat 5, ever. They may be pursued, cornered, and
  humiliated. The institutional embarrassment is the joke.
- **Birds may resolve to a catch**, represented through feather-burst abstraction and
  official report — never gore.
- **Vorg engagements resolve only to non-confirmation.** The mystery deepens; it never closes.
- **Every loop should make Sakura more recognizable to the family.** If a beat could belong
  to any generic pet game, sharpen it until it could only be Sakura.

---

## How Future Modes Reuse This

- **Patrol** (prototype, Stage 0.3) stretches beats 2–3 across a sector sweep: pick a zone,
  resolve 6 encounters via `SakuraIncident.resolvePatrol(kind, action)`, file the patrol report.
- **RPG Hunt** turns beats into turns; an engagement becomes a quest, and incidents become
  campaign history.
- **Chaos Mode** runs many loops concurrently and lets incidents cascade and interact.

All of them call the same `incident-engine` and `voice-engine`. Build the loop once; dress
it per mode.
