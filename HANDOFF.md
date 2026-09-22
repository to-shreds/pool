# Cue Lab handoff

## Current build and source of truth

Cue Lab 0.3.0 is the current implemented source checkpoint. Canonical repository: `to-shreds/pool`. The previous 0.2 baseline is preserved at `baseline-v0.2.0`, based on commit `42ee495bea2d3ef63f08796c8d3d68dac8262b89`. The approved `ROADMAP-0.3.md` remains the broader intended scope; `RELEASE-0.3.md` distinguishes implemented systems from calibration and unfinished extensions.

Read `to-shreds/ProjectStatus/README.md` and `projects/cue-lab/STATUS.md` for current readiness and the final published commit. The runtime source is root `index.html`, `src/style.css`, `features.css`, `physics.js`, `rules.js`, `apa.js`, `settings.js`, `execution.js`, `session.js`, `placement.js`, `renderer3d.js`, `coach.js`, `worker.js`, and `app.js`. `build.py` generates `src/worker-bundle.js` and standalone `Cue-Lab.html`; edit original modules, not the generated bundle.

## Completed systems

Searchable paged Settings: 68 controls, 12 categories, no scrolling, tooltips, draft/apply/cancel and persisted changes. Arcade/Simulation/Custom; deterministic player delivery and same-model risk; actual cue-ball geometry/mass; world-specific table sizes; chalk/friction; real optional WebGL cameras and themes with 2D fallback. AI/coach share actual off-thread physics search. Ghost demos cannot change the live state; Apply does not shoot. CPU pause, cancellation, sequential lag, matches, statistics, named drills and separate APA8/9 rules are working. All original game modes and old JSON save compatibility remain.

Detailed implementation and scope: `docs/SETTINGS.md`, `EXECUTION.md`, `AI-COACH.md`, `APA.md`, `PHYSICS.md`, `RULES.md` and `RELEASE-0.3.md`.

## Verification

See `verification/REPORT-v0.3.md` and the raw result files. The final unit suite has 213 passing cases. The seeded varied-table/equipment stress suite contains 256 accepted, settled shots with finite state, no event caps and no energy rise beyond the documented tolerance. Browser results are separately reported for functional flows, precision/layout, actual old-save migration/multi-rack/drills, modular assets and real WebGL.

Browser tests used the actual HTML via `page.set_content` because administrator policy blocks normal file and loopback navigation in the build environment. Successful persistence tests used an explicit localStorage shim; native unavailable storage was tested separately. Real WebGL used headed Chromium with Xvfb and ANGLE SwiftShader, not a physical Android GPU. Native device performance and browser-restart persistence remain unverified.

A stress-discovered multi-ball jaw jam was corrected with passive low-speed contact projection and a preserved regression, not by disabling the event-cap diagnostic. Graphics inspection caught and fixed felt/wood z-fighting. CPU re-entrancy, stale worker cancellation, copied demo state, deterministic undo, phase changes and old saves were tested explicitly.

## Hosting

GitHub Pages was still disabled at the last repository metadata read (`has_pages=false`). The source is a static site and `.nojekyll` is present. Do not claim a working public game URL until Pages is enabled and actual served content is checked. Source publication and test/build CI are separate from hosting. See ProjectStatus for the final publication result.

## Do not break

2D stays supported and no-scroll controls must be reachable, not just clipped. Preserve physics/rules/render separation, actual geometry, tight racks, simultaneous contacts and numerical diagnostics. Aiming never fires. Cosmetic/camera changes never alter physics. Preview placement and coach/demo/replay never mutate the live match or consume execution randomness. Undo restores the full table/rules/session/declaration/settings/seed/chalk state. Old saves migrate. Named drills enter Practice explicitly. Stale/cancelled AI cannot shoot. No backend, tracking, external runtime assets or unrequested unrelated project edits.

## Unfinished and next action

Verify publication/Pages and test on Jon's actual phone/tablets. Preserve this checkpoint while calibrating the provisional execution/chalk/skill distributions, rail/pocket/tip/shaft and elevated-shot physics, and AI playing strength. Bounded search has only a next-shot heuristic, not the planned deep pattern tree. Complete higher-level bank/kick/safety behavior, cue-shaft obstruction/double hits, hanging/rattle-back pockets and remaining official referee/compound-foul exceptions. Brand themes are cosmetic approximations, not exact licensed table models. No online multiplayer, team league administration or official APA handicap calculation.

Update this handoff when continuation state changes, then the ProjectStatus STATUS.md as the final persistence step. Never describe the entire broader roadmap as complete merely because the major systems are now playable.
