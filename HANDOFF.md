# Cue Lab handoff

## Current state and controlling sources

Version 0.2.0 is the working no-scroll/precision-placement release. The canonical game source is now `to-shreds/pool`, main, rather than the original conversation attachment. Root `index.html`, `src/physics.js`, `src/rules.js`, `src/placement.js`, `src/app.js` and `src/style.css` control the application. `python3 build.py` creates `Cue-Lab.html` from those same files. There is no separate template or ui.js to edit.

Read `to-shreds/ProjectStatus/README.md` and `projects/cue-lab/STATUS.md` for readiness and next steps. This handoff controls implementation continuity; source and tests take precedence over chat recollection.

## Completed benchmark

Published the previously attached game to the requested pool repo. Added viewport-fitted controls with Shot/Aim/Spin/Cue angle, separate Practice and Match pages, always-visible power/Shoot, quick spin/elevation presets, and paginated rules/help/history. Added a transactional full-screen placement editor: default 6x, 2x-10x zoom, relative drag away from the ball, minimap relocation, recenter, 1/5/10 mm nudges, hold/release, keyboard arrows, original-position reset, validity feedback, explicit confirmation and side-effect-free Cancel/Escape. It also supports practice object balls.

The original physics/rules engines are byte-for-byte unchanged. All nine modes, stroke mechanics, saves, undo, replay, drills, calls and push-out choices are preserved. Save schema remains cue-lab-save-v1. Local file saves do not transfer automatically to a new hosted origin; use Export/Import.

## 0.3 design roadmap

`ROADMAP-0.3.md` is the controlling design roadmap for the next major iteration. It preserves 2D as a first-class view and adds optional shooter/elevated/broadcast 3D cameras, paged settings, APA-style SL2-SL7 computer opponents, a self-selected human skill profile, cue-ball size/mass presets, table/felt appearance presets, and a realistic chalk system.

The human and computer players should share one stochastic execution model. Distinguish small ordinary stroke error from a true tip-slip miscue. The pre-shot mishit percentage must be computed from the same distribution used to execute the stroke, with deterministic seeds saved so Undo and Replay never reroll the outcome. Skill, intended tip contact, actual delivered tip contact, cue elevation, speed, chalk condition, cue-ball geometry and tip-friction limits are inputs. APA skill numbers are gameplay profiles, not official APA-derived shot-accuracy or miscue percentages.

Cue-ball diameter and mass must be separate internally. Standard, oversize bar-box and heavy/magnetic presets are planned. A larger/heavier cue ball should not be described as simply unable to take spin; model the actual effects on inertia, draw/follow response, ball-to-ball contact geometry, hop tendency and collision behavior.

0.3 also requires a top-level **Simulation / Arcade / Custom** realism preset. Arcade is the Candystand-style mode: exact human stroke delivery, no stochastic human mishit/miscue layer, no chalk-management penalty, and standard matched cue-ball physics by default, while preserving normal rules, deterministic table physics, spin controls, cameras, themes, replay, undo, and selected computer difficulty. Optional classic aim assists may be enabled separately. Custom allows mixing the realism subsystems.

The 0.3 roadmap also requires an optional **APA-style coaching timeout**. Default 8-ball counts are SL2-SL3: two per game; SL4-SL7: one per game. A Coach timeout should use the same shot-search engine as the AI to recommend a practical shot or safety, explain aim/power/spin/position and strategy, optionally show alternatives, and demonstrate the stroke on a ghost copy without altering the live table. A simpler Aim-assist timeout may show an extended line/ghost ball/power and target zone. Coaching should optimize for the configured player's actual execution distribution, so a fragile perfect shot is not automatically recommended to a weaker player.

The current APA rules review also makes a dedicated **APA Match** preset part of the 0.3 roadmap. Do not retrofit APA behavior into Club rules. APA 8-ball should support a playable lag, winner-breaks sequencing, non-breaker racking, APA legal-break handling, group assignment from the break, marked-pocket 8-ball play, 8-on-break win/loss handling, separate last-ball/8 requirement, and true head-string ball-in-hand logic. APA handicapped 9-ball should use ball-count scoring, current points-to-win charts, dead balls, 9-on-the-snap behavior and no push-out. Add innings/defensive-shot scorekeeping, APA event stats, table-size geometry, frozen-ball rules, stalemates, off-table spotting, optional referee replay, equipment/house restrictions and non-punitive pace guidance. See ROADMAP-0.3.md for details.

## Verification

114 unit tests, 112 original browser checks, 199 precision/layout checks and six modular-entry checks passed with no page-script errors. Eight viewport sizes include portrait/landscape phones, tablet and desktop, down to 320x568 and 740x360. Published runtime file hashes matched the tested local source. Details and limits are in verification/REPORT.md; reproducible unit/browser scripts are in the repo. The source ZIP also contains detailed raw results and screenshots.

Browser tests inject actual HTML because administrator policy blocks normal file/loopback navigation. The modular test fulfills actual local assets. Successful storage uses a disclosed in-memory shim. These are not native local-file, physical Android, live URL, accessibility-zoom or browser-restart persistence tests.

GitHub Actions run `35657497110` also passed all 114 unit tests from a fresh checkout and rebuilt the identical standalone artifact (artifact ID `10665027526`). That is build verification, not a Pages deployment.

## Hosting state

Source publication is complete, but GitHub Pages was disabled at inspection and no Pages-administration action exists in the available connector. The static site is ready for Settings > Pages > Deploy from a branch > main > /(root) > Save. `.github/workflows/verify.yml` tests and builds the offline artifact; it does not enable Pages. Do not claim a working public game URL until a deployment and served content are checked.

## Do not break

Keep physics, rules and UI separate. Preserve effectively touching rack geometry and simultaneous-contact solving; the earlier uniformly spaced rack caused a break artifact. No canned draw reversal or invented flat-sidespin curvature. Keep Club rules labeled and limitations documented. Aiming must never shoot. Replay must not rescore. Undo restores table, rules and controls together. Preview placement must not mutate any live ball/rule state before confirmation. Cancel/Escape must leave that state unchanged. Keep all controls reachable without scroll, not merely clipped by overflow:hidden. Preserve saved-state compatibility and explicit practice switching before arrangement. No backend, tracking, CDN runtime assets or unrelated project edits.

For 0.3, camera and table-theme settings must not silently alter physics. Stochastic execution must be reproducible from saved state. Displayed risk and actual shot execution must come from the same model. Do not present gameplay calibration as official APA data.

## Unresolved and next action

Enable and verify Pages, then test on Jon's actual phone/browser. For 0.3, implement settings/schema migration first, then the shared skill-based execution and mishit/miscue model, chalk integration, cue-ball size/mass physics, 3D renderer, and AI in that order. Preserve the working 0.2 baseline while adding each layer.

Provisional rail/pocket/shaft/tip/massé/jump behavior still needs measured calibration. Cue-shaft obstruction is absent. Kitchen escape is a proxy rather than a true head-string crossing event. Some special rerack, break, referee and compound-foul exceptions remain. No AI or online multiplayer is implemented yet.

Keep the original v0.1 source attachment and this v0.2 repo checkpoint recoverable. Update HANDOFF.md after meaningful changes, then ProjectStatus STATUS.md last.
