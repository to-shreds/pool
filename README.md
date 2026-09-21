# Cue Lab

Browser pool with a three-dimensional spin model and nine playable Club-rule modes. Version 0.2.0 adds viewport-fitted controls and precision ball placement. The original physics and rules engines are unchanged.

## Play and hosting

`index.html` is the static site entry point. It loads only files in `src/`. There is no backend, account, analytics, installation, or third-party runtime asset.

GitHub Pages is not yet enabled for this repository. In Settings > Pages, select **Deploy from a branch**, **main**, **/(root)**, then Save. The checked-in `.nojekyll` supports direct static publication. Do not confuse the repository being published with a verified live game URL; `HANDOFF.md` records the latest verified state.

For a single offline file, run `python3 build.py` and open the generated `Cue-Lab.html` in a browser. The hosted site and offline file use exactly the same source.

## Controls

Drag on the table to aim. Shot has **Aim**, **Spin**, and **Cue angle** tabs. Power and Shoot stay at the bottom of each. Touch the large cue-ball diagram for arbitrary tip contact, or use Follow, Draw, Left, Center and Right presets. Cue elevation ranges from 0 to 80 degrees. Aiming never fires a shot.

**Place cue** opens a six-times close-up. Drag anywhere to move the preview without covering the ball with your finger. Tap the overview to move elsewhere. Zoom ranges from 2 to 10 times; arrows nudge by 1, 5 or 10 mm, with hold-to-repeat. Green is valid. Place here confirms; Cancel or Escape leaves the live position unchanged. Overlap, cloth boundaries and kitchen restrictions are enforced. Practice can also precisely place object balls.

Practice has Drills, Arrange, Saves and Table tabs. Match has Players, Rules and Last shots. Long help, rules and history use pages instead of scrolling. Undo restores the preceding shot's table, rules and stroke. Replay is view-only. Existing v0.1 JSON saves remain compatible. Saves in a downloaded-file browser origin do not automatically move to a hosted origin: export, then import.

## Modes and scope

8-ball, 9-ball, 14.1 straight pool, 3-ball, one-pocket, 10-ball, short-rack banks, house rotation, and free practice. Competitive play is local two-player. No AI or online multiplayer yet.

This remains a simulation prototype, not a fully calibrated digital twin or complete tournament referee. `docs/PHYSICS.md` and `docs/RULES.md` preserve the model, sources and remaining exceptions. This interface release makes no new realism claim.

## Develop and verify

`index.html` and `src/` are authoritative. `build.py` creates the offline bundle without dependencies. Run `node --test tests/*.test.js`; GitHub Actions also runs those tests and builds an offline artifact. That workflow is verification, not Pages enablement.

Browser harnesses are `verification/browser-v0.2.py`, `verification/precision-ui-tests.py`, and `verification/modular-site-test.py`. Build first. They require Python Playwright and Chromium at `/usr/bin/chromium`; adjust the executable path for another environment. They intentionally use injected DOM because the build environment blocks normal file and loopback navigation. They are not live-hosting or physical-device tests.

The checkpoint passed 114 unit tests, 112 original browser regressions, 199 precision/layout checks and six modular-entry checks. Eight viewports cover desktop, tablet, portrait and landscape, down to 320 by 568 and 740 by 360. See `verification/REPORT.md` for scope and limitations. Detailed raw results are also included in the release conversation's source ZIP.

Read `HANDOFF.md` before continuing. Readiness is controlled by `to-shreds/ProjectStatus/projects/cue-lab/STATUS.md`.
