# Sprite Rigging Plan

> Status: Placeholder — Build 1. Plan only, no sprites exist yet.

---

## Approach

This game uses CSS animation for simple state transitions and canvas for active gameplay rendering.

No skeletal rigging. No physics engine. The complexity budget does not support it in Build 1 or likely Build 2.

---

## Sakura Animation States

| State | Implementation | Trigger |
|---|---|---|
| Idle | CSS: subtle float or breathe cycle | Default |
| Alert | CSS: rapid scale pulse, 2 frames | Creature detected |
| Running | CSS: horizontal position tween + sprite swap | During chase |
| Pounce | Sprite swap + CSS translate | Engagement |
| Victory | CSS: bounce, then settle | Outcome: success |
| Confused | CSS: slow rotation, head-tilt sprite | Vorg event |

---

## CSS Animation Philosophy

- No animation should require JavaScript to trigger — CSS classes handle state
- JS adds/removes class names; CSS handles the motion
- Keep animation durations under 300ms for responsiveness
- Respect `prefers-reduced-motion` media query

---

## Canvas Usage

Canvas is used only in active gameplay modes (Duck Hunt, Patrol, Chaos Mode). The home screen, Sakura Canon, and transition screens are pure HTML/CSS.

---

## Sprite Sheet Format (Planned)

Once photography is complete:
- Single PNG sprite sheet per character
- Each pose on a separate row, multiple frames per row if animated
- Sprite dimensions: 200×200px base, 400×400px @2x
- Transparent background

---

## Build Timeline

| Build | Asset Milestone |
|---|---|
| 1 | CSS placeholders only |
| 2 | First real Sakura photo used (Idle Standing) |
| 3 | Alert and Pounce sprites |
| 4 | Full Sakura sprite set |
| 5 | Creature sprites begin |
