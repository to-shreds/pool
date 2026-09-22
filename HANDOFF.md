# Cue Lab handoff

## Current build and source of truth

Cue Lab 0.3.0 is the current implemented source. Canonical repository: to-shreds/pool. The previous 0.2 baseline is preserved on baseline-v0.2.0 at 42ee495bea2d3ef63f08796c8d3d68dac8262b89. ROADMAP-0.3.md remains the broader intended scope; RELEASE-0.3.md distinguishes working systems from calibration and unfinished extensions. Read to-shreds/ProjectStatus/README.md and projects/cue-lab/STATUS.md for readiness and the final published commit.

Authoritative runtime: index.html and src/style.css, features.css, physics.js, rules.js, apa.js, settings.js, execution.js, session.js, placement.js, renderer3d.js, coach.js, worker.js and app.js. build.py generates src/worker-bundle.js and standalone Cue-Lab.html. Edit original modules, not generated bundles.

## Completed systems

Searchable paged Settings: 68 operational controls in 12 categories, no scrolling, tooltips, draft/apply/cancel and persistence. Arcade/Simulation/Custom; deterministic player delivery and same-model risk; actual cue-ball radius/mass/inertia; world-specific table sizes; chalk/friction; optional real WebGL cameras/themes with 2D fallback. AI and coach share actual off-thread physics search. Ghost demos cannot change the live state; Apply does not shoot. CPU pause/cancellation, sequential lag, match/rack flow, statistics, named drills and separate APA8/9 rules work. All original modes and old JSON save compatibility remain.

Implementation details and scope are in docs/SETTINGS.md, EXECUTION.md, AI-COACH.md, APA.md, PHYSICS.md, RULES.md and RELEASE-0.3.md. Runtime settings.js controls exact fields/defaults/tooltips.

## Verification and publication

213 local unit tests, 531 browser checks and 256 accepted varied-table/equipment stress shots passed. Zero page-script errors, all stress states finite/settled, no collision caps or energy increase beyond the documented tolerance. All original 114 unit cases remain. Browser checks include real WebGL and actual v0.1/v0.2 exported saves.

GitHub Actions 35676162826 independently verified 48 transported source hashes, built identical HTML/worker, passed all 213 unit tests and all 256 stress shots, and committed normal source at 68ebe3eb38d8dd249643b7690ce0353ec100aee4. Artifact 10672699527 was downloaded, integrity-checked, freshly extracted and rebuilt byte-for-byte. The release cleanup removes its one-time transport and assembly workflow; runtime/tests remain identical. See verification/PUBLICATION-v0.3.md, REPORT-v0.3.md and CI-v0.3.json.

Standalone HTML is 332,419 bytes, SHA-256 7434e6c17376fadd860c52a84380308e868f498ba3e4f579fc13cc9160fae18d. The 0.2 baseline remains independently recoverable.

Browser tests used actual HTML via page.set_content because admin policy blocks normal file/loopback navigation. Successful storage tests used an explicit shim; native unavailable-storage handling was tested. WebGL used headed Chromium/Xvfb/ANGLE SwiftShader, not a physical Android GPU. These tests do not establish native phone performance, unrestricted local-file opening or browser-restart persistence.

A stress-discovered jaw/multiple-ball jam is handled by passive low-speed constraint projection with separate contactSettles diagnostics and an exact regression. Numerical event-cap detection remains enabled. Graphics z-fighting, CPU re-entry, stale workers, copied demo state, deterministic undo and old saves were explicitly tested.

## Hosting

GitHub Pages remained disabled at the last metadata read. This is a static site with .nojekyll. A successful source push/CI run is not a deployment. Pages must be enabled for main at /(root) and actual served content checked before claiming a live game URL. See ProjectStatus for final source-promotion and attachment results.

## Do not break

2D stays supported. No-scroll controls must be reachable, not merely clipped. Preserve physics/rules/render separation, actual geometry, tight racks, simultaneous contacts and numerical diagnostics. Aiming never fires. Cosmetic/camera changes never alter physics. Precision previews, coach demos and replays never mutate the live table or consume execution randomness. Undo restores table, rules, session, declarations, settings, seed, chalk and timeout counts. Old saves migrate. Drills explicitly enter Practice. Stale/cancelled AI cannot shoot. No runtime backend, tracking, external assets or unrelated project edits.

## Unfinished and next action

Verify Pages and test on Jon's actual phone/tablets. Preserve this checkpoint while calibrating execution/chalk/skill distributions, rail/pocket/tip/shaft/elevated-shot behavior and AI strength. Current search has a next-shot heuristic, not a deep multi-ball pattern tree. Improve advanced bank/kick/safety play and complete cue obstruction/double hits, hanging/rattle-back pockets and referee/compound-foul exceptions. Brand themes are original cosmetic approximations, not exact licensed models. No online multiplayer, team administration or official APA skill calculation.

Update this handoff after meaningful changes, then ProjectStatus STATUS.md last. Do not describe the entire broader roadmap as complete merely because the major systems are playable.
