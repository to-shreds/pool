# Cue Lab

Browser pool with a three-dimensional spin model and nine playable Club-rule modes. Version 0.2.0 adds a viewport-fitted interface and precision ball placement without changing the existing physics or game-rule engines.

## Play

The site entry point is `index.html`. Serve this repository as a static site; there is no backend, installation, account, analytics, or third-party runtime asset. GitHub Pages must be enabled in this repository's Settings before a public game URL is available. See `HANDOFF.md` for the verified deployment state rather than assuming the site is live.

For a single offline file, run `python3 build.py` and open the generated `Cue-Lab.html` in a browser. The offline file and the hosted site use the same source.

## Controls

Drag on the table to aim. Use the Shot panel's Aim, Spin, and Cue angle tabs; power and Shoot remain at the bottom of every shot tab. Tap the large cue-ball diagram for an exact contact point, or use Follow, Draw, Left, Center, and Right presets. Raise the cue from 0 to 80 degrees. Nothing fires until Shoot is pressed.

Place cue opens a six-times close-up. Drag anywhere in that view to move the preview without covering the ball with your finger. The overview moves to another part of the table. Zoom ranges from 2 to 10 times; arrows nudge by 1, 5, or 10 mm. Green means a valid position. Place here confirms; Cancel or Escape leaves the live position unchanged. Ball overlap, table boundaries, and kitchen restrictions are checked before confirmation. Practice can use the same editor for object balls.

Practice separates drills, arrangement, saves, and cloth settings into tabs. Match separates players, rules, and shot history. Rules, help, and history use pages instead of scrolling. Undo restores the preceding shot's table, rules, and stroke; Replay is view-only. Existing v0.1 JSON saves remain compatible. Browser saves from a downloaded file do not automatically transfer to a hosted origin: export and then import them.

## Games and scope

8-ball, 9-ball, 14.1 straight pool, 3-ball, one-pocket, 10-ball, short-rack bank pool, house rotation, and free practice. Competitive modes are local two-player. No computer opponent or online multiplayer is included.

This remains a playable simulation prototype, not a fully calibrated digital twin or complete tournament referee. `docs/PHYSICS.md` and `docs/RULES.md` document the model and remaining exceptions. This interface release makes no new physics-realism claim.

## Source and verification

`index.html` and `src/` control the application; `build.py` creates the offline bundle without dependencies. Node 22 runs the unit tests with `node --test tests/*.test.js`. Browser checks require Python Playwright and Chromium, then `python3 build.py` followed by the scripts in `verification/`.

The v0.2 checkpoint passed 114 unit tests, the 112 original browser regression checks adapted to the new tabs, 199 additional precision/layout checks, and six modular-entry checks. Layout coverage includes eight desktop, tablet, portrait-phone, and landscape viewports, down to 320 by 568 and 740 by 360. Browser checks use real Chromium with injected page content because this environment blocks ordinary file and loopback navigation. They do not establish real Android hardware performance or public deployment. See `verification/REPORT.md` for evidence and limitations.

Read `HANDOFF.md` before continuing this project. Readiness is maintained in `to-shreds/ProjectStatus/projects/cue-lab/STATUS.md`.
