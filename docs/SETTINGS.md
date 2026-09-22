# Settings reference, Cue Lab 0.3

68 operational fields. Search scans all categories. Use the previous/next buttons rather than scrolling. A category can contain multiple pages. Every field has an in-game tap/click tooltip.

Physical or match-changing fields request a restart. Presentation choices preserve the current position. Preset changes explicitly list the affected settings in the draft notice. Custom preserves the current independent values.

## Gameplay

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Players

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Match

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Camera

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Equipment

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Chalk

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Table

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Appearance

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Assists

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Coaching

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Rules & pace

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.

## Quality & audio

### Gameplay style

Key: `style`. Default: `"arcade"`. Match restart: no, except dependent preset changes.

Arcade delivers exactly your selected stroke with chalk and miscues off. Simulation adds modeled human delivery variation and tip friction. Custom preserves your individual choices.

Choices: `arcade` (Arcade / classic), `simulation` (Simulation), `custom` (Custom).

### Human execution variation

Key: `execution`. Default: `false`. Match restart: no, except dependent preset changes.

Vary actual aim, power, contact point and elevation around your selected stroke. Player skill controls the spread. This is a game model, not measured APA performance.

### Physical tip-slip miscues

Key: `miscues`. Default: `false`. Match restart: no, except dependent preset changes.

Enable the modeled chalk/tip friction limit. An off-center impact may slip. Turning this off does not guarantee that a ball will go into a pocket.

### Pre-shot risk display

Key: `riskDisplay`. Default: `"simple"`. Match restart: no, except dependent preset changes.

Displays the chance of meaningful stroke error or tip slip in the same discrete probability model used by Shoot. Tap for the categories and assumptions; it is not a measured real-world probability.

Choices: `off` (Off), `simple` (Compact), `detailed` (Detailed).

### Play against

Key: `opponent`. Default: `"human"`. Match restart: yes.

Player 2 is the computer in Computer mode. Watch lets both sides play. Practice always stays under your control.

Choices: `human` (Local second player), `computer` (Computer), `watch` (Computer vs computer).

### Player 1 skill (8-ball scale)

Key: `skill1`. Default: `4`. Match restart: yes.

APA-style 2 through 7 is a playing-strength profile, not an official APA handicap calculation.

Range: 2 to 7; step 1.

### Player 2 / computer skill

Key: `skill2`. Default: `4`. Match restart: yes.

Lower levels have wider stroke errors and simpler shot selection. Higher levels evaluate more options. Profiles are provisional, not proven APA equivalents.

Range: 2 to 7; step 1.

### Player 1 APA 9-ball handicap

Key: `skill9a`. Default: `4`. Match restart: yes.

APA 9-ball uses levels 1 through 9 and a point target, separately from the 8-ball playing-strength profile.

Range: 1 to 9; step 1.

### Player 2 APA 9-ball handicap

Key: `skill9b`. Default: `4`. Match restart: yes.

Sets the second player's official point-target lookup. Execution strength is separately selected above.

Range: 1 to 9; step 1.

### Computer pause before shooting

Key: `aiPace`. Default: `"natural"`. Match restart: no, except dependent preset changes.

Adds a presentation pause after analysis. It does not change the physics, search accuracy or difficulty.

Choices: `quick` (Quick), `natural` (Natural), `slow` (Slow).

### Computer analysis budget

Key: `aiSearch`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Sets a bounded off-thread search budget. More time can improve choices. Deep search is not a guarantee of the globally best shot.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Rules preset

Key: `rules`. Default: `"club"`. Match restart: yes.

APA applies only to 8-ball and 9-ball. Other games retain Club rules. APA support is documented in the rules notes, including remaining exceptions.

Choices: `club` (Club rules), `apa` (APA 8 / 9-ball).

### APA handicap race

Key: `handicap`. Default: `true`. Match restart: yes.

Use the official 8-ball Games Must Win chart or 9-ball Points Required chart. Turning this off uses the custom rack race or point target.

### Custom rack race

Key: `race`. Default: `1`. Match restart: yes.

Racks needed to win when not using the APA handicap chart. Straight pool and three-ball retain their own point / round targets.

Range: 1 to 15; step 1.

### Custom APA 9-ball target

Key: `points9`. Default: `31`. Match restart: yes.

Used only when the APA 9-ball handicap chart is turned off.

Range: 5 to 150; step 1.

### First break

Key: `firstBreak`. Default: `"player1"`. Match restart: yes.

Play lag uses the real cloth and rail model: send your ball to the far rail and back near the head rail. The lag is played sequentially in this local game.

Choices: `player1` (Player 1), `random` (Random draw), `lag` (Play a lag).

### Break order after first rack

Key: `breakOrder`. Default: `"winner"`. Match restart: yes.

APA presets always use winner breaks. This choice applies to Club rack races.

Choices: `winner` (Winner breaks), `alternate` (Alternate).

### Automatically start next rack

Key: `autoNext`. Default: `false`. Match restart: no, except dependent preset changes.

After a result pause, start the next rack when the match is not over. Turn off to study results first.

### Default view

Key: `camera`. Default: `"2d"`. Match restart: no, except dependent preset changes.

2D remains the low-overhead fallback. All cameras display the same physics state. Precision placement always opens its overhead close-up.

Choices: `2d` (2D overhead), `shooter` (3D shooter), `elevated` (3D elevated), `broadcast` (3D broadcast), `auto` (3D automatic).

### Shooter camera height (m)

Key: `cameraHeight`. Default: `0.28`. Match restart: no, except dependent preset changes.

Height above the cloth, independent of cue elevation. A higher viewpoint makes intervening balls easier to see.

Range: 0.1 to 1.1; step 0.02.

### Shooter camera distance (m)

Key: `cameraDistance`. Default: `0.8`. Match restart: no, except dependent preset changes.

Distance behind the cue ball. This is a camera adjustment only.

Range: 0.4 to 2; step 0.05.

### 3D field of view

Key: `fov`. Default: `52`. Match restart: no, except dependent preset changes.

A narrow field resembles a longer camera lens; a wider field shows more table with stronger perspective.

Range: 35 to 85; step 1.

### Switch to broadcast during shot

Key: `autoFollow`. Default: `true`. Match restart: no, except dependent preset changes.

In 3D, show an elevated table-wide view while balls move, then return to the selected camera.

### Replay camera

Key: `replayCamera`. Default: `"same"`. Match restart: no, except dependent preset changes.

Replay uses recorded ball states without rescoring or rerolling the executed stroke.

Choices: `same` (Same as live view), `2d` (2D overhead), `broadcast` (3D broadcast).

### 3D overhead inset

Key: `minimap`. Default: `true`. Match restart: no, except dependent preset changes.

Show a small overhead table while using a perspective camera.

### 3D viewing offset (degrees)

Key: `orbit`. Default: `0`. Match restart: no, except dependent preset changes.

Orbit the viewing angle without changing the cue aim. The on-table Look button also allows dragging the camera.

Range: -180 to 180; step 5.

### Cue-ball preset

Key: `cueBall`. Default: `"standard"`. Match restart: yes.

Standard matches the object balls. Oversize is larger and heavier: harder draw, more forward momentum after contact, and a different contact height. Heavy keeps the standard diameter but adds mass, also making draw harder and follow easier. Custom separates both properties. Larger does not mean incapable of spin; arbitrary custom density combinations are experimental.

Choices: `standard` (Standard 57.15 mm), `oversize` (Oversize 60.325 mm), `heavy` (Heavy, standard diameter), `custom` (Custom diameter and mass).

### Custom cue diameter (mm)

Key: `diameter`. Default: `57.15`. Match restart: yes.

Changes contact geometry, rotational inertia, pocket clearance and cloth height. Used only with Custom cue-ball preset.

Range: 50 to 64; step 0.025.

### Custom cue mass (g)

Key: `mass`. Default: `170`. Match restart: yes.

Changes inertia and collision momentum. A heavier cue ball tends to continue forward through contact and is harder to draw back. Used with Custom preset.

Range: 120 to 230; step 1.

### Cue appearance

Key: `cueLook`. Default: `"maple"`. Match restart: no, except dependent preset changes.

Cosmetic cue finish. It never changes cue mass, deflection or accuracy.

Choices: `maple` (Maple), `carbon` (Carbon), `burgundy` (Burgundy wrap).

### Chalk management

Key: `chalk`. Default: `"off"`. Match restart: no, except dependent preset changes.

The friction model lowers the tip-slip threshold as chalk condition declines. Shot-dependent depletion is an explicit provisional model, not a measured chalk brand.

Choices: `realistic` (Friction model), `visual` (Visual meter only), `off` (Off).

### Warn when chalk is low

Key: `chalkWarning`. Default: `true`. Match restart: no, except dependent preset changes.

Highlight the Chalk button at low condition. Reminding you to chalk does not spend a coaching timeout.

### Auto-chalk in practice

Key: `autoPracticeChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh chalk before every practice stroke, leaving matches unaffected.

### Computer remembers to chalk

Key: `autoComputerChalk`. Default: `true`. Match restart: no, except dependent preset changes.

Refresh the computer's tip when low or when its chosen contact point calls for fresh chalk.

### Meter style

Key: `chalkDisplay`. Default: `"words"`. Match restart: no, except dependent preset changes.

Changes only the meter label, not the condition model.

Choices: `words` (Fresh / Good / Low), `percent` (Percentage).

### Playing surface

Key: `tableSize`. Default: `"9"`. Match restart: yes.

These are explicit playing-surface presets, not exterior table dimensions or claims that every table brand has identical geometry.

Choices: `7` (7 ft class: 78 × 39 in), `8` (8 ft class: 88 × 44 in), `9` (9 ft class: 100 × 50 in), `custom` (Custom 2:1 surface).

### Custom surface length (m)

Key: `tableLength`. Default: `2.54`. Match restart: yes.

Custom playing surface. Width is half the length. Ball sizes stay unchanged.

Range: 1.8 to 3; step 0.01.

### Cloth response

Key: `clothPreset`. Default: `"normal"`. Match restart: yes.

Changes sliding friction, rolling resistance and spin decay. These are illustrative parameter sets, not measured cloth products.

Choices: `normal` (Club), `fast` (Fast), `slow` (Slow).

### Cushion rebound coefficient

Key: `railBounce`. Default: `0.78`. Match restart: yes.

Advanced physical setting: controls normal rebound before speed and friction effects. The default is the existing model. Not a brand calibration.

Range: 0.6 to 0.88; step 0.01.

### Table design

Key: `theme`. Default: `"classic"`. Match restart: no, except dependent preset changes.

Original stylized themes inspired by broad table appearances. No logos, endorsement or exact licensed models. Themes are cosmetic only.

Choices: `classic` (Classic walnut), `diamond` (Diamond-inspired dark rails), `brunswick` (Brunswick-inspired walnut / gold), `rasson` (Rasson-inspired graphite).

### Felt color

Key: `felt`. Default: `"green"`. Match restart: no, except dependent preset changes.

Color only. Cloth speed is a separate Table setting.

Choices: `green` (Club green), `blue` (Tournament blue), `teal` (Deep teal), `burgundy` (Burgundy), `gray` (Slate gray), `black` (Near black), `custom` (Custom).

### Custom felt color

Key: `feltColor`. Default: `"#267b6c"`. Match restart: no, except dependent preset changes.

Used when Felt color is Custom. Does not change friction.

### 3D lighting

Key: `lighting`. Default: `"neutral"`. Match restart: no, except dependent preset changes.

Changes lighting intensity and tint without changing physics.

Choices: `neutral` (Neutral), `warm` (Warm room), `bright` (Bright tournament).

### Aiming line

Key: `guide`. Default: `true`. Match restart: no, except dependent preset changes.

Geometric line of initial aim. It does not predict deflection, swerve or the complete future shot.

### Ghost-ball contact marker

Key: `ghost`. Default: `true`. Match restart: no, except dependent preset changes.

Show the cue-ball position at the first unobstructed geometric object-ball contact.

### Object-ball direction line

Key: `objectLine`. Default: `true`. Match restart: no, except dependent preset changes.

Shows the geometric contact normal, not a guarantee of pocketing under throw or spin.

### Stun tangent reference

Key: `tangent`. Default: `false`. Match restart: no, except dependent preset changes.

Shows the perpendicular reference direction at contact. Follow, draw, spin and unequal ball sizes can change the actual exit.

### Actual cue-ball trail

Key: `trails`. Default: `true`. Match restart: no, except dependent preset changes.

Draw the path actually traveled, not a predicted result.

### Frozen-ball indicator

Key: `frozenHints`. Default: `true`. Match restart: no, except dependent preset changes.

Mark balls touching a cushion within the simulation tolerance. Does not alter adjudication.

### Pocket letters

Key: `pocketLabels`. Default: `true`. Match restart: no, except dependent preset changes.

Keep A through F labels on the table for calls and coaching.

### Timeout allowance

Key: `timeouts`. Default: `"apa"`. Match restart: no, except dependent preset changes.

APA-style: two for skill 2-3, one for skill 4-7. Practice is unlimited. Before the break, advice is free and does not consume a timeout.

Choices: `apa` (APA-style per player), `custom` (Custom per rack), `unlimited` (Unlimited), `off` (Off).

### Custom timeouts per rack

Key: `timeoutCount`. Default: `2`. Match restart: no, except dependent preset changes.

Used only for Custom allowance. Counts restore with Undo and reset with a new rack.

Range: 0 to 9; step 1.

### Timeout help

Key: `coachType`. Default: `"coach"`. Match restart: no, except dependent preset changes.

Both use actual candidate simulations. The coach adds strategic reasons, alternatives and modeled robustness; aim assist emphasizes the stroke setup.

Choices: `coach` (Coach with reasons), `aim` (Aim-assist card).

### Analysis budget

Key: `coachDepth`. Default: `"balanced"`. Match restart: no, except dependent preset changes.

Bounded worker search over direct shots, banks, kicks and safeties. Deep is still a limited search, not proof of the best possible move.

Choices: `quick` (Quick), `balanced` (Balanced), `deep` (Deep).

### Explanation length

Key: `explanation`. Default: `"detailed"`. Match restart: no, except dependent preset changes.

Detailed adds cue-ball route, next-ball assessment, scratch risk and limitations. Text is paginated, never scroll-required.

Choices: `brief` (Brief), `detailed` (Detailed).

### Show alternatives

Key: `alternatives`. Default: `true`. Match restart: no, except dependent preset changes.

Provide up to three evaluated choices rather than presenting one as the only correct shot.

### Allow Apply suggestion

Key: `applySuggestion`. Default: `true`. Match restart: no, except dependent preset changes.

Explicitly copy the recommended controls and optional ball-in-hand placement. It does not shoot or disable your execution model.

### Demonstrate automatically

Key: `demoAuto`. Default: `false`. Match restart: no, except dependent preset changes.

Play the recommended ideal stroke on a separate ghost world after analysis. Your live position remains unchanged.

### Account for player skill

Key: `coachSkill`. Default: `true`. Match restart: no, except dependent preset changes.

Test finalists under the configured stroke-error model. A less ambitious but robust shot may be preferred.

### Allow jump-style elevated strokes

Key: `allowJump`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block shots whose modeled initial slate rebound produces significant airborne lift. All cues currently represent a normal playing cue.

### Allow massé-style strokes

Key: `allowMasse`. Default: `true`. Match restart: no, except dependent preset changes.

When off, block high-elevation, off-center strokes. This is a host-house restriction, separate from the game rules.

### Shot pace display

Key: `pace`. Default: `"off"`. Match restart: no, except dependent preset changes.

A non-punitive pacing display. Crossing a guideline does not create a foul or move the cue ball.

Choices: `off` (Off), `guide` (20 / 45 second guidance).

### One-minute coaching clock

Key: `timeoutClock`. Default: `true`. Match restart: no, except dependent preset changes.

Starts when analysis is ready, not while the computer is searching. At one minute the clock advises you to resume; it does not secretly take the shot.

### 3D rendering detail

Key: `quality`. Default: `"medium"`. Match restart: no, except dependent preset changes.

Changes ball tessellation and rendering resolution. Physics remains at its fixed timestep.

Choices: `low` (Low), `medium` (Medium), `high` (High).

### 3D ball contact shadows

Key: `shadows`. Default: `true`. Match restart: no, except dependent preset changes.

Simple soft contact-shadow meshes under balls. This is not ray-traced room lighting.

### Game sounds

Key: `sound`. Default: `false`. Match restart: no, except dependent preset changes.

Procedural ball, cushion, pocket, cue and chalk sounds. No audio download.

### Sound volume

Key: `volume`. Default: `0.7`. Match restart: no, except dependent preset changes.

Master volume for procedural audio.

Range: 0 to 1; step 0.05.

### Short phone vibrations

Key: `haptics`. Default: `false`. Match restart: no, except dependent preset changes.

Use supported browser vibration feedback for chalking and a completed strike. Unsupported browsers simply omit it.
