# Settings reference, Cue Lab 0.3

There are 68 operational fields across 12 categories. Search scans all categories; previous/next controls replace scrolling. Each field has an in-game explanation. The canonical labels, defaults, validation limits, dependency behavior and tooltip text are in `src/settings.js`, not duplicated configuration here.

Settings use a draft. Cancel leaves live settings and position intact; Apply persists accepted values. Physical or match-changing settings request a restart. Presentation changes preserve the current position. A gameplay preset lists the dependent fields it changes; Custom preserves individual values.

## Gameplay: 4 fields

`style`: Arcade / Simulation / Custom; default Arcade. Arcade uses exact selected human delivery with chalk and physical miscues off, while keeping ordinary deterministic pool physics.

`execution`: human stroke variation, off by default. `miscues`: physical tip-slip model, off by default. `riskDisplay`: Off / Compact / Detailed, Compact by default. Risk is computed from the same finite model used by Shoot, not measured APA odds. Disabling variation does not correct bad aim or guarantee a pocket.

## Players: 7 fields

`opponent`: Local second player / Computer / Computer vs computer. `skill1` and `skill2`: execution/search profiles 2-7, default 4. `skill9a` and `skill9b`: separate APA 9-ball handicap inputs 1-9, default 4. Those handicap fields choose a point target, not a different execution distribution.

`aiPace`: Quick / Natural / Slow presentation pause. `aiSearch`: Quick / Balanced / Deep analysis budget. Search is bounded and the playing-strength profiles are provisional, not empirically established APA equivalents. Player/opponent/handicap changes require a restart.

## Match: 7 fields

`rules`: Club / APA 8-9; other disciplines retain their Club rules. `handicap`: use the official chart lookup. `race`: custom rack race 1-15. `points9`: custom APA9 target 5-150. `firstBreak`: Player 1 / Random / Play a lag. The local lag is sequential. `breakOrder`: winner or alternate, with APA always using winner breaks. `autoNext`: automatically advance after the result pause.

Except auto-next, these settings require a new match. Consult `docs/APA.md` for the implemented APA scope and remaining exceptions.

## Camera: 8 fields

`camera`: 2D overhead / 3D shooter / elevated / broadcast / automatic. `cameraHeight`: 0.10-1.10 m above cloth. `cameraDistance`: 0.40-2.00 m behind the ball. `fov`: 35-85 degrees. `autoFollow`: broadcast during motion and return afterward. `replayCamera`: Same / 2D / Broadcast. `minimap`: overhead inset. `orbit`: -180 to 180 degree viewing offset.

The on-table Look control changes view without changing cue aim. Camera settings never alter the world or shot physics. Precision placement remains overhead. Unavailable WebGL falls back to 2D.

## Equipment: 4 fields

`cueBall`: Standard 57.15 mm / Oversize 60.325 mm / Heavy at standard diameter / Custom. `diameter`: custom 50-64 mm. `mass`: custom 120-230 g. These are real geometry and mass inputs, not visual scaling or an arbitrary spin penalty. Changing them requires a restart.

A heavier cue ball tends to retain forward motion through contact and be harder to draw; changed diameter also changes contact height and clearance. A larger ball is not incapable of spin. Custom density combinations are experimental rather than replicas of known equipment.

`cueLook`: Maple / Carbon / Burgundy wrap. This is cosmetic only and does not alter cue mass or accuracy.

## Chalk: 5 fields

`chalk`: Friction model / Visual meter only / Off. `chalkWarning`: low-condition highlight. `autoPracticeChalk`: refresh before practice strokes. `autoComputerChalk`: let the computer refresh when needed. `chalkDisplay`: Fresh/Good/Low words or percentage.

The condition/depletion curve is an explicit provisional model. Friction mode changes the tip-slip envelope; it is not an arbitrary accuracy bonus. Visual-only mode does not impose that physical penalty.

## Table: 4 fields

`tableSize`: 7 ft class (78 by 39 in surface), 8 ft class (88 by 44), 9 ft class (100 by 50), or Custom. `tableLength`: custom 1.80-3.00 m with 2:1 surface. `clothPreset`: Club / Fast / Slow. `railBounce`: normal rebound coefficient 0.60-0.88.

These are explicit physical presets, not universal specifications for every table brand. They require a restart. Actual ball sizes are retained when table dimensions change. Cloth and cushion values are not measured brand calibrations.

## Appearance: 4 fields

`theme`: Classic walnut / Diamond-inspired dark rails / Brunswick-inspired walnut-gold / Rasson-inspired graphite. `felt`: Green / Blue / Teal / Burgundy / Gray / Near black / Custom. `feltColor`: custom color picker. `lighting`: Neutral / Warm room / Bright tournament.

Themes are original stylized, cosmetic treatments without manufacturer logos or endorsement. They do not alter the cushion, pockets, ball dimensions, cloth speed or shot outcomes.

## Assists: 7 fields

`guide`: geometric aiming line. `ghost`: first geometric contact marker. `objectLine`: object-ball contact-normal direction. `tangent`: stun tangent reference. `trails`: actual cue-ball path. `frozenHints`: balls touching a rail within model tolerance. `pocketLabels`: A-F labels.

Geometric guides are not guaranteed predictions of throw, swerve, draw or unequal-ball collision outcomes. Actual trails and recorded replay are distinguished from these references.

## Coaching: 9 fields

`timeouts`: APA-style / Custom / Unlimited / Off. `timeoutCount`: custom allowance 0-9 per rack. `coachType`: Coach with reasons / Aim-assist card. `coachDepth`: Quick / Balanced / Deep bounded search. `explanation`: Brief / Detailed. `alternatives`: display alternatives when found. `applySuggestion`: allow explicitly setting suggested controls. `demoAuto`: preview automatically. `coachSkill`: consider the player's delivery model.

Practice is unlimited when coaching is enabled. Pre-break advice does not consume a timeout. APA-style allowances are per player and rack, not a match-wide total. The coach simulates candidates; it does not know the globally best shot. Preview runs on a copied world. Apply never shoots and requires explicit acceptance of suggested cue-ball placement. Coaching cannot mutate the live table, score, chalk or execution seed.

## Rules & pace: 4 fields

`allowJump` and `allowMasse`: house restrictions on the modeled elevated stroke classes. These classify available stroke setups; they do not implement a complete cue-shaft obstruction referee.

`pace`: Off / 20-45 second guidance. `timeoutClock`: one-minute advice clock. Guidance is non-punitive, not automatic ball-in-hand. Coach computation is outside the advice-reading clock.

## Quality & audio: 5 fields

`quality`: Low / Medium / High WebGL detail. `shadows`: ball-contact shadows. `sound`: procedural game sounds. `volume`: 0-1. `haptics`: short vibrations where the device/browser supports them.

These do not change physics. Software-WebGL checks are not a physical-device performance benchmark. 2D remains the low-overhead fallback.

## Preservation and verification

The in-game field count and category grouping are covered by settings and browser audits. This reference lists each field once. Old saves receive validated backward-compatible defaults; settings export with the versioned match session. Full test results and limitations are in `verification/REPORT-v0.3.md` and `verification/PUBLICATION-v0.3.md`.
