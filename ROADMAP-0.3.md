# Cue Lab 0.3 Roadmap

## Release theme

Cue Lab 0.3 is the gameplay and immersion release. Preserve the verified 0.2 overhead game, physics/rules separation, no-scroll controls, precision placement, save compatibility, undo and replay. Add optional 3D presentation, configurable human execution realism, APA-style computer opponents, table appearance presets, cue-ball equipment presets, and a chalk system.

The existing 2D overhead view remains a first-class supported mode and lightweight fallback. Rendering must never change physics outcomes.

## Settings architecture

Add a paged Settings area with no scrolling. Suggested pages:

- Camera
- Player
- Opponent
- Equipment
- Table
- Assists
- Audio
- Advanced

Persist settings locally and include them in exported saves with backward-compatible defaults for old saves.

## Gameplay realism preset

Expose one top-level preset so realism can be changed without hunting through individual settings:

- **Simulation**: skill-based human execution, actual mishit/miscue risk, chalk condition, selected cue-ball equipment physics, and normal simulation assists.
- **Arcade**: Candystand-style forgiving pool. The user's selected aim, tip contact, elevation, and power are delivered exactly; stochastic human execution error and random miscues are disabled; chalk does not deplete or constrain tip friction; standard matched cue-ball physics are used by default. Game rules and the underlying deterministic ball/cushion physics remain active. Camera, table/felt appearance, spin controls, undo, replay, and computer opponents still work.
- **Custom**: every realism subsystem can be enabled or disabled independently.

The UI may describe Arcade as the "cheat / classic" option in its tooltip, but the primary label should be **Arcade**. Changing this preset must show the individual settings it changed, and switching to Custom must preserve the current values rather than resetting them.

Arcade should optionally expose classic assists without requiring them: extended aim line, ghost-ball contact marker, projected first object-ball path, and projected cue-ball tangent/stun line. More advanced spin-aware path prediction may be added later, but it must be labeled as an assist rather than actual future certainty.

Computer difficulty remains meaningful in Arcade mode. The opponent still uses its selected SL2-SL7 decision/execution profile; Arcade removes human execution randomness unless the user explicitly chooses Custom. A future symmetric option can allow exact-execution computers for sandbox/demo use.

## Camera and 3D presentation

Camera modes:

- 2D Overhead
- Shooter 3D
- Elevated 3D
- Auto
- Broadcast/Replay when available

Settings should include camera distance, height, field of view, limited/free orbit, auto-follow after impact, automatic return to shooter view, replay camera, 3D quality, shadows, lighting quality and rendering resolution.

Use the same world state for every renderer. 2D and 3D must produce identical shot results. Keep precision cue-ball placement in the specialized overhead close-up even when the active match camera is 3D.

## Computer opponent

Add Human vs Computer and Computer vs Computer infrastructure. For 8-ball, expose APA-style opponent skill levels 2 through 7. These are gameplay profiles inspired by the familiar APA 8-ball scale, not a reproduction of APA's proprietary handicap calculation.

Separate:

1. Shot intelligence
2. Execution ability

Candidate-shot search should use the real Cue Lab simulation. Evaluation can consider pocket probability, cue-ball landing zone, scratch risk, next-shot quality, clusters, defensive value, opponent layout and game-specific strategy.

Broad intended behavior:

- SL2: misses many routine shots, weak cue-ball control, poor planning, limited bank/kick/safety ability.
- SL3: makes obvious shots inconsistently, simple position planning, modest spin use.
- SL4: average league-style baseline, reasonable routine potting, one-ball planning, noticeable position errors.
- SL5: good pattern play, intentional safeties, useful draw/follow/English, common banks and kicks.
- SL6: advanced pattern recognition, multi-ball planning, strong cue-ball control, solid safety and kick play.
- SL7: rarely misses routine shots, deep planning, precise speed/spin, strong safeties, banks and kick escapes, but remains fallible on genuinely difficult shots.

Difficulty must never alter table physics. It changes candidate selection and the stochastic accuracy with which the selected stroke is delivered.

## Human player skill

Add a self-selected Human skill setting, also APA-style 2 through 7, default 4.

This setting controls stochastic execution realism when enabled. It is not an APA handicap calculation and must be labeled accordingly.

Execution realism modes:

- Off: exact user-selected stroke
- Skill-based: user skill affects delivery variation
- Full: skill, chalk, cue-ball equipment, power, elevation and tip position all affect delivery and miscue risk

The same execution engine should eventually be usable for both the human and computer player.

## Execution error versus true miscue

Model two related but distinct outcomes.

### Ordinary execution error

Every shot can have small deviations from the requested stroke:

- aim angle
- cue-tip contact x/y
- cue speed/power
- cue elevation
- optionally timing/steering terms if later justified

Error distributions shrink as skill rises. Published cue-sport research supports greater accuracy and lower trial-to-trial variability among more skilled players, but there is no accepted mapping from APA skill level to exact error standard deviations. Tune the APA-style profiles as Cue Lab gameplay calibration, not as official APA statistics.

### True miscue

A true miscue is a physical tip-slip/contact failure. It should depend on the actual delivered contact point, cue elevation, cue speed, chalk condition, tip friction and cue-ball geometry. Near-center, well-chalked, level strokes should have very low physical miscue probability. Risk should increase near the friction/miscue envelope and with difficult elevated or highly off-axis strokes.

Do not hard-code a flat random miscue percentage by skill level.

## On-screen mishit warning

Before every stroke, optionally display a compact risk indicator near Shoot:

- MISHIT RISK 2%: green
- MISHIT RISK 14%: amber
- MISHIT RISK 38%: red

Detailed mode can expand this to:

- Meaningful delivery error
- True miscue
- Main risk drivers, for example "extreme right/top", "high power", "elevated cue", "low chalk"

The displayed probability must be produced from the same stochastic model used when executing the shot.

Preferred implementation: sample or analytically integrate the player's delivery distribution around the requested stroke. Estimate the fraction of deliveries that exceed the configured meaningful-error tolerance or physical no-slip/miscue condition. On Shoot, draw one actual delivery from that exact distribution and store the random seed/result in the shot record. Undo and replay must reproduce the same executed stroke rather than rerolling the event.

A normal SL4 center-ball shot with healthy chalk can be calibrated around a low single-digit meaningful-mishit risk if that produces realistic gameplay, but a true physical miscue should be much rarer. Exact percentages require calibration rather than being presented as measured APA statistics.

## Cue-ball size and weight

Add cue-ball presets under Equipment. Diameter and mass must be modeled separately internally, even where the UI presents them as familiar presets. Changing cue-ball geometry must update radius, inertia, ball-to-ball contact geometry, pocket/cushion interactions, tip-contact geometry and any relevant collision response.

Initial realistic presets:

- Standard pool: 2.25 in / 57.15 mm, regulation-style mass
- Oversize bar-box: 2.375 in / about 60.3 mm, correspondingly heavier preset
- Heavy/magnetic bar-box: standard diameter with heavier mass
- Advanced/custom: separate diameter and mass controls within sane bounds

Do not label a larger ball as simply "unable to take spin." A larger/heavier cue ball is generally harder to draw and tends to retain more forward motion through object-ball contact; size mismatch also changes the collision height and can promote hopping at speed. Maximum safe normalized tip offset is primarily a cue-tip/friction issue, so the tooltip should distinguish reduced spin response/control from the geometric miscue limit.

Quick tooltip examples:

Standard:
"Matched to the object balls. Balanced draw, follow, spin and collision response."

Oversize bar-box:
"Larger and usually heavier. Harder to draw, more forward 'smash-through,' different contact height against standard object balls, and more hop potential on hard shots."

Heavy/magnetic:
"Normal diameter but extra mass. Easier follow, tougher draw, more forward movement after contact, and slightly different squirt behavior."

Advanced size and mass should show an explicit warning when the combination is unrealistic.

## Chalk system

Add a persistent chalk condition meter. Chalking restores tip friction/consistency. Consumption should depend on what the player actually asks the tip to do, especially normalized tip offset, tangential impulse demand, power and cue elevation. Center-ball soft strokes should consume very little; heavy English, deep draw, elevated strokes, jump and masse attempts should consume more.

Low chalk should not create an arbitrary global penalty. It should reduce the reliable friction envelope and increase the modeled chance of tip slip on demanding strokes.

Settings:

- Chalk: Realistic / Visual only / Off
- Warning: On / Off
- Auto-chalk in Practice: On / Off
- Meter display: Simple condition words / Percentage

Normal UI can display Fresh / Good / Low / Chalk now. Advanced mode can display percentage and effective tip-friction estimate.

## Table appearance

Add visual table presets and independent felt selection. Table appearance should not silently change physics. Frame, rail/apron, pocket treatment, sights, room, felt texture/color and lighting can vary cosmetically.

Keep Advanced Table Physics separate for future calibrated pocket/cloth/cushion presets.


## Coaching timeout system

Add an optional APA-style coaching timeout system for 8-ball. Current APA Open Division rules allow two time-outs per game for SL1-3 and unrated players and one for SL4+. Cue Lab's SL2-SL7 scale should therefore default to two timeouts for SL2-SL3 and one timeout for SL4-SL7, while keeping counts configurable outside the APA-style preset.

A timeout should be a coaching feature, not simply a free made shot. Provide two selectable timeout-assist levels:

### Coach timeout

Use the same shot-search/evaluation engine planned for the computer opponent. Analyze the live position and identify the strongest practical options. The coach should explain:

- recommended object ball and pocket or safety objective;
- approximate aim/contact point;
- intended cue-ball route and landing zone;
- recommended power, tip position and cue elevation;
- why the shot is preferred, including position for the next ball, scratch risk, clusters, opponent layout and safety value;
- one or two reasonable alternatives when the decision is genuinely close;
- a confidence/probability band, labeled as the simulator's estimate rather than certainty.

The user can request a visual demonstration. The demo should run a ghost copy of the current state with the recommended stroke and camera angle, then return to the untouched live table. It must never consume the actual turn, reroll the game state, or alter the player's saved shot controls unless the user explicitly presses Apply suggestion.

Do not present one shot as objectively "the right shot" when several options are close. Say "Recommended" or "Best evaluated option" and expose alternatives when useful.

### Aim-assist timeout

A simpler classic option can provide an extended aim line, ghost-ball contact location, object-ball route, suggested power and optional cue-ball target zone. This should still leave execution to the player. It is appropriate for Arcade mode or for users who want a less computationally intensive timeout.

### Shot-search implementation

The computer-AI and timeout coach should share one candidate generator/evaluator. Candidate families can include direct pots, combinations, caroms where supported, banks, kicks, breakouts, defensive safeties and two-way shots. For each family, search a bounded grid/optimizer over aim, tip contact, power and elevation and run the actual Cue Lab physics in a Web Worker or equivalent off-main-thread worker. Score resulting positions by expected pocket success, cue-ball control, next-shot quality, scratch/foul risk, cluster value, defensive value and game-specific strategic state.

For strong coaching, evaluate execution robustness by perturbing the selected stroke using the configured player's skill distribution rather than judging only a perfect stroke. A shot that works only with exact execution should be downgraded for an SL2-SL4 player relative to a slightly less ambitious shot with a wider success window. In Arcade mode, exact-execution analysis can be used instead.

The analysis budget must be bounded so the browser remains responsive. Progressive results are acceptable: quickly show a competent preliminary recommendation, then refine if deeper search completes. Never freeze shot controls while the coach searches unless the user is actively viewing the timeout screen.

### Timeout settings

- Timeouts: APA-style / Custom / Off
- APA-style counts: SL2-SL3 = 2 per game; SL4-SL7 = 1 per game
- Timeout type: Coach / Aim assist / Ask each time
- Demonstration: Automatic / Tap to preview / Off
- Explanation depth: Brief / Detailed
- Show alternatives: On / Off
- Use player skill when evaluating robustness: On / Off
- Apply suggested stroke: On / Off

Timeout usage is per game within a match, not per entire match, when using APA-style rules.

## Additional 0.3 gameplay items

- Match setup: game, Human/Computer, opponent skill, player skill, race length, camera, table, felt, assists and break format.
- Player statistics: shot percentage, balls per inning, scratches, safeties, banks, run length and positional error.
- Practice shot analysis: cue speed, spin at impact, cut angle, actual versus requested stroke, rail contacts and final cue-ball error.
- Named saved drills and instant reset.
- 3D replay camera selection.
- Cosmetic cue customization.
- Haptics and improved collision/pocket/miscue/chalk sounds.
- Performance presets so 2D remains reliable on slower hardware.
- Future equipment physics only after the base model is calibrated.

## Research/calibration notes

- Standard pool balls are nominally 2.25 inches. Historical oversize coin-operated cue balls are commonly about 2.375 inches.
- A heavier cue ball is easier to follow and tougher to draw; a lighter cue ball behaves in the opposite direction. A size mismatch also changes the vertical contact geometry and can produce hopping.
- With a well-shaped, well-chalked tip, the commonly cited maximum safe offset is roughly half the cue-ball radius from center. Cue elevation and combined vertical/lateral offset matter.
- Cue-sport studies show skill-dependent differences in alignment, angle-test error and/or trial-to-trial variability. They do not provide a validated APA-SL-to-miscue-probability table.
- APA officially uses 8-ball skill levels 2 through 7, but its Equalizer handicap calculation includes multiple data factors and should not be represented as a simple shot-accuracy percentage.

## Implementation order

1. Settings schema/migration and Player/Equipment settings.
2. Shared stochastic execution model with deterministic seeds.
3. Mishit/miscue risk estimator and on-screen warning.
4. Chalk state and physical friction-envelope integration.
5. Cue-ball size/mass presets and physics regression suite.
6. 3D renderer and camera settings while preserving 2D.
7. AI candidate generator/evaluator shared by computer opponents and timeout coaching.
8. Coaching timeout analysis, visual demo and APA-style timeout counts.
9. SL2-SL7 opponent profiles using the shared execution model.
10. Table/felt appearance presets.
11. Match setup, stats, replays and polish.
12. Broad regression plus real-device testing and physics calibration.

## Acceptance rules

- No required scrolling on supported game/control screens.
- Existing 2D mode remains fully playable.
- Old v0.1/v0.2 saves load with sensible defaults.
- Camera/theme settings cannot change shot physics.
- Skill/chalk/cue-ball settings may alter executed physics only through documented models.
- Displayed risk and actual stochastic outcome use the same probability model.
- Undo/replay never reroll random execution.
- Physics/rules regressions must continue passing unless an intentional, documented calibration change updates them.
- Do not claim APA endorsement or official APA-derived accuracy percentages.
