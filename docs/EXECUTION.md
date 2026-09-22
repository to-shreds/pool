# Stroke execution and risk model, 0.3

## What the percentage means

The risk indicator is the exact union probability within Cue Lab's finite execution model of (1) a defined meaningful delivery deviation, (2) physical tip slip under the model, or (3) delivered tip contact below the modeled cloth-clearance limit. Those categories can overlap; the union is counted, not added. It is not the probability that a ball will miss its pocket and it is not a measured APA miscue rate.

The model uses 512 deterministic, pre-generated six-dimensional normal samples. Before shooting it evaluates all 512 candidate strokes and reports the relevant fractions. Shooting maps the next saved unsigned 32-bit generator state to one of those same samples, executes that actual contact through physics, and saves the delivered stroke. No unrelated bad-shot coin is applied. The percentage has finite resolution of 1/512; displayed rounding does not change the model.

## Skill and stroke variation

The provisional base standard deviations are:

| APA-style profile | Aim, degrees | Power percentage points | Normalized tip coordinate | Elevation, degrees |
|---|---:|---:|---:|---:|
| 2 | 0.85 | 6 | 0.065 | 1.5 |
| 3 | 0.45 | 4 | 0.040 | 1.0 |
| 4 | 0.23 | 2.4 | 0.025 | 0.65 |
| 5 | 0.14 | 1.8 | 0.018 | 0.40 |
| 6 | 0.08 | 1.1 | 0.012 | 0.25 |
| 7 | 0.035 | 0.65 | 0.007 | 0.15 |

These are Cue Lab tuning values, not official or experimentally established APA statistics. Tip offset, elevated cue angle and strong off-center strokes widen the spread. Elevation variation scales with intended elevation. Delivered power and elevation stay in the supported ranges; the contact disk is limited to 0.97 radius.

The meaningful-delivery threshold is any of: aim deviation above 0.55 degrees, power deviation above seven percentage points, combined normalized tip displacement above 0.09, or elevation deviation above three degrees. These fixed thresholds are deliberately documented game definitions. They do not imply every smaller deviation is harmless to a difficult shot.

At the initial healthy SL4 center-ball setup, the model has low-single-digit meaningful-error risk and essentially no physical tip-slip risk. Do not describe that result as a real-world measurement. A difficult geometrically impossible tip contact is not made safe merely by selecting SL7.

## Chalk and true tip slip

In friction mode, effective tip friction is based on `0.32 + 0.38 * chalkCondition`, with additional modest sample variation as condition deteriorates. When chalk does not affect physics the base is 0.70. The delivered contact point and the effective coefficient feed `strikeInfo`; exceeding its no-slip envelope invokes the existing slipping-tip impulse approximation. This changes the actual velocity and spin, rather than merely showing a warning.

Chalk wear per accepted stroke is `0.008 + 0.09*rho^2 + 0.025*powerFraction^2 + 0.02*sin(elevation)^2*(0.25+rho)`, clamped to 0.008-0.2. This is a provisional shot-demand model. It is not a validated law of chalk depletion, not a measured chalk product, and does not claim all elevated shots inherently consume more chalk by a known amount. Chalking resets the condition; auto-chalk choices for practice and computer players have actual runtime effects.

A delivered contact below six millimeters is a cloth-obstructed failed stroke: the shot records a strike without moving the cue ball and normal rules adjudicate the outcome. It does not silently clamp a failed delivery into a legal made shot. Intended impossible cloth-contact setups are prevented before Shoot.

## Modes and state preservation

Arcade disables human delivery variation, tip-slip miscues and chalk penalties, and defaults to matched equipment. It does not disable ball/cushion physics, game rules, spin or computer difficulty. Custom can mix these systems. The computer uses the same delivery module, with variation enabled according to its strength profile even when the human selects Arcade.

Camera, theme, looking around, replay, coach search and ghost previews cannot consume the match execution seed. Undo restores it together with settings, chalk, calls, table, rules and score. Repeating an unchanged shot after undo reproduces its selected delivery. Changing the intent with the same seed samples the same underlying noise vector around a different intended stroke.

The risk module and actual strike both use the current cue-ball radius, mass, friction settings and condition. Larger equipment changes physical response; it is not represented by an arbitrary percentage accuracy penalty.

## Remaining work

Calibrate profile distributions, error thresholds, chalk/friction and tip-slip behavior against repeatable measurements. Add a complete cue-shaft/bridge/contact-duration model before claiming full physical execution realism. Keep estimates explicitly model-based in all UI and documentation.
