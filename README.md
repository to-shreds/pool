# Cue Lab 0.3.0

Browser pool with optional real 3D, eleven game modes, configurable stroke realism, computer opponents and a shot coach. The original 2D view and precision-placement editor remain available. The site has no runtime backend, telemetry, external assets or CDN dependency.

## Start playing

Open the site entry `index.html` on a static host, or run `python3 build.py` and open the resulting standalone `Cue-Lab.html`. GitHub Pages must be enabled before a public site URL exists; see `HANDOFF.md` for verified hosting status.

The default remains **Arcade, 2D overhead, local two-player**. Drag on the table to aim. Choose Spin or Cue angle when needed, adjust power, then Shoot. Aiming never fires. Power and Shoot remain in the shot dock. Undo restores the complete preceding shot; Replay is view-only. Place cue opens the existing zoomed editor with millimeter nudges and explicit confirmation.

Use **Settings** to choose a computer opponent and skill, a 3D shooter/elevated/broadcast camera, Simulation or Custom execution, cue-ball equipment, table dimensions, felt and frame appearance, and coaching preferences. Settings are searchable and paginated across 12 categories. Each of the 68 fields has a short explanation. Cancel discards the draft. Physical/match changes request a restart; appearance and camera changes preserve the live position.

The on-table camera control cycles views. In 3D, **Look** changes the camera without changing shot aim. Ball placement always uses an overhead close-up. When WebGL is unavailable the game retains 2D rather than failing to launch.

## Computer and coach

Settings > Players selects Local second player, Computer, or Computer vs computer. Skills 2-7 are provisional APA-style execution/search profiles, not verified real-player equivalents. The computer uses the same physics and can be paused. It does not receive special pockets or ball behavior.

**Coach** evaluates the live position in a local Web Worker. It compares direct pots, supported banks/combinations/kicks and defensive candidates. It explains the chosen stroke, offers alternatives when found, and can demonstrate it on a copy of the table. Apply suggestion sets controls and any explicitly accepted cue-ball position; it does not shoot. The next actual stroke still uses your selected execution and chalk model. Practice coaching is unlimited when coaching is enabled. Match allowances are configurable, with APA-style defaults.

This is bounded, simulator-based coaching. The search and skill profiles need further playing-strength calibration. A small perturbation-sample result is labeled as such, not advertised as a measured real-world probability or a guaranteed best shot.

## Rules and matches

Original modes: Club 8-ball, 9-ball, 14.1, 3-ball, one-pocket, 10-ball, short-rack bank pool, house rotation and free practice. Added modes: APA-derived 8-ball and handicapped APA-derived 9-ball. Match state supports races, point carryover, next racks, a sequential playable lag, timeout counts, statistics, defensive intent, stalemates and contact review. APA 8-ball race targets and APA 9-ball point targets are separately versioned data. APA 9-ball handicap inputs are 1-9, independently of the 2-7 execution profile.

The original Club presets are not overwritten by APA rules. Read `docs/APA.md` and `docs/RULES.md` for supported rules and remaining referee/edge-case limitations. No APA endorsement, official handicap calculation, online multiplayer or team/roster administration is implied.

## Saves and drills

Exports retain `cue-lab-save-v1` and add a versioned session containing settings, equipment, deterministic execution state, chalk, timeouts and match data. Actual saves exported from versions 0.1 and 0.2 were loaded and exercised in browser tests. Saves from a downloaded-file origin do not transfer automatically to a hosted origin; use Export/Import. A blocked localStorage implementation produces a visible warning rather than pretending to save.

Named drills store up to 20 positions locally. Loading one explicitly uses Practice. Portable JSON exports provide a backup. Undo followed by an identical shot uses the same execution seed; replay and coaching never reroll it.

## Build and test

Node 18+ and Python 3 are sufficient for the deterministic build and unit tests:

```sh
python3 build.py
node --test tests/*.test.js
node verification/stress-v0.3.js
```

`build.py` generates `src/worker-bundle.js` from the physics/rules/execution/coach modules, then the self-contained HTML. Never hand-edit the generated worker bundle. The hosted entry references the same source files and bundled worker.

Browser harnesses require Python Playwright and Chromium. Set `CHROMIUM` where supported, or adjust the executable path. Run `verification/browser-v0.3.py`, `extra-v0.3.py`, `layout-v0.3.py`, and `modular-v0.3.py`. Real WebGL checks use `xvfb-run -a python3 verification/graphics-v0.3.py` and headed Chromium with ANGLE SwiftShader. They are not physical Android GPU tests.

See `verification/REPORT-v0.3.md` for exact results and test-environment boundaries. `docs/SETTINGS.md`, `EXECUTION.md`, `AI-COACH.md`, `PHYSICS.md`, and `APA.md` describe the actual models. The full approved `ROADMAP-0.3.md` remains the longer-term scope; `RELEASE-0.3.md` distinguishes implemented features from calibration and unfinished extensions.
