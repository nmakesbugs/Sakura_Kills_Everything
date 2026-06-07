# Stage 0.6 — Adventure Refactor (Playtest Notes)

> The project keeps relearning one truth: **green tests do not prove fun.** These notes record
> the human-facing assessment of the pivot to authored adventures.

## 1. Why this refactor happened

By 0.5, every system worked and the game was still boring. Mode-first arcade (tap target →
incident → repeat) had no story, no stakes, and no room for Sakura's personality. The verdict:
rethink the approach, don't build more modes.

## 2. What was boring before

- No setup or payoff — just a loop.
- The player executed timing, never made meaningful choices.
- The best asset (official record vs. likely reality) arrived with no story behind it.
- Duck Hunt as flagship made the game feel like a reflex test, not a Sakura story.

## 3. What The Bird Incident changes

- It's a short **authored episode**: briefing → observation choice → approach choice →
  complication → strike (timed climax) → aftermath → official report → file.
- **Choices shape the report.** Observation sets the witness (Tanisha/Nick/Cias) and sector;
  approach sets the tone, the complication, and the strike difficulty; the strike sets the
  outcome tier (Confirmed Aerial Engagement / Feather Evidence Event / Strategic Near Miss /
  Officially Successful Despite Facts).
- The **report is the payoff** — heroic official line, deflating likely-reality punchline,
  witness note, evidence, canon status — and it files into the Permanent Record.
- The home screen now reads "Choose Sakura's Next Adventure," with three more episodes teased.

## 4. What was manually reviewed

Played the episode end-to-end at 390×760 across choice paths and outcome tiers. Reviewed:
home (adventure-first), briefing, observation beat, approach beat, complication, strike stage,
aftermath, the official report, filing, and the Adventures filter in the Permanent Record.
Sample report (Patio Watch + Charge + legendary): *"She actually caught the bird. Out of the
air. It happened. Tanisha is still talking about it."* — funny and file-worthy.

## 5. What still might not work

- The strike timing (shrinking reticle) is tuned by eye in a desktop browser at a phone
  viewport, **not** on a real touch device. The window sizes per approach may need adjustment.
- Replay variation is real but bounded (3 observations × 4 approaches × 4 tiers of report text);
  a player who replays many times will see repetition.
- Target/strike visuals still lean on an emoji bird (full-color on device, flat in headless).
- Only one episode exists; the "adventure" promise is proven by one data point.

## 6. What Nick / Tanisha should test

- Does opening The Bird Incident feel like starting a *story*, not picking a mode?
- Is the strike satisfying to time with a thumb? Do the four approaches feel different?
- Is the final report funny enough to screenshot and send?
- Replay with different choices — is the variation noticeable and worth a second run?
- Does demoting Duck Hunt to "Practice Yard" feel right, or is it missed up front?

## 7. Is the adventure genuinely more fun than Duck Hunt?

**Yes — meaningfully.** Duck Hunt is a clean reflex loop; The Bird Incident is a tiny story with
choices, a climax, and a payoff you want to share. It answers "why does this game exist?" in a
way no amount of Duck Hunt polish did. It is the first build that feels like *Sakura Kills
Everything the family game* rather than a test harness with jokes.

## 8. Honest recommendation

Worth pushing/PRing as the new direction, **pending a phone playtest of the strike beat**. If
tap-timing feels good on a real device, commit to adventures: build episode 2 (Squirrel
Surveillance) on the same pattern and start retiring mode-first framing entirely. If the strike
feels fiddly on touch, swap it for a simpler 3-option "choose the strike moment" before scaling.
Either way, the pivot is the right call.
