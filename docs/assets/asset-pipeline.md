# Asset Pipeline

> Status: Placeholder — Build 1. Pipeline design only, no assets processed yet.

---

## Philosophy

Sakura is a real dog. Her image in this game should come from real photos.

Invented or stock-photo dogs are not acceptable. When actual Sakura photography is unavailable, use a CSS/canvas placeholder that is clearly labeled as temporary. Do not substitute a generic dog.

---

## Photo → Sprite Workflow (Planned)

```
1. Photograph Sakura in required pose (see photo-requirements.md)
2. Remove background — manual cutout or AI-assisted
3. Export as PNG with transparency, 2x resolution
4. Optimize: pngcrush or equivalent
5. Store in src/assets/sprites/sakura/
6. Reference in CSS or canvas via asset manifest
```

---

## Asset Categories

| Category | Directory | Status |
|---|---|---|
| Sakura sprites | `src/assets/sprites/sakura/` | Not yet photographed |
| Creature sprites | `src/assets/sprites/creatures/` | Not yet designed |
| Background zones | `src/assets/backgrounds/` | Not yet designed |
| UI icons | `src/assets/ui/` | Not yet designed |
| Audio | `src/assets/audio/` | Not yet planned |

---

## Temporary Placeholder Strategy

Until real assets arrive, use CSS-drawn shapes with canonical labels:

- Sakura: green circle with "SAKURA" label
- Squirrel: brown circle with "SQUIRREL" label
- Zone backgrounds: flat color fills with zone name

This is intentional and acceptable. The game should be playable before it is beautiful.

---

## Performance Targets

See `performance-budget.md` for full targets. Asset-specific:

- Total sprite sheet: under 200kb
- No asset should cause jank on a mid-range phone from 2022
- Lazy-load backgrounds; sprites must be available immediately
