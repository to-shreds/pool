# Physics model and validation

## Status

Original JavaScript rigid-body implementation. Not a port of Pooltool and not a claim of experimental validation. The objective is a calibrated pool simulation with realistic cue-ball control. Version 0.1 supplies a working model and regression harness, but its rail, pocket, tip, and elevated-shot parameters remain provisional.

## Coordinates and parameters

World x runs from head to foot along the table, y across its width toward the top rail, and z upward. Lengths are meters, time seconds, angular velocity radians/second. The model uses identical 0.17 kg solid spheres of radius 0.028575 m and inertia 2 m R^2 / 5, on a 2.54 m by 1.27 m playing surface. These are model choices, not a representation of a particular measured table.

Default constants, all explicit in `src/physics.js`:

| Parameter | Value |
|---|---:|
| Gravitational acceleration | 9.81 m/s^2 |
| Outer step | 1/480 s |
| Sliding friction coefficient | 0.20 |
| Effective rolling deceleration coefficient | 0.011 |
| Axial-spin deceleration | 8 rad/s^2 |
| Ball restitution | 0.95 |
| Ball contact friction | 0.045 |
| Baseline rail restitution | 0.78 |
| Rail friction | 0.18 |
| Rail-nose height | 1.28 radii |
| Slate restitution | 0.32, with low-speed landing cutoff |
| Cue mass | 0.54 kg |
| Cue restitution | 0.75 |
| Tip friction coefficient | 0.70 |
| Empirical shaft-deflection coefficient | 1.6 degrees times side offset |

Fast/slow cloth presets change sliding, rolling, and axial-spin coefficients together. These presets are illustrative, not measured cloth brands.

## Cue strike

Tip coordinates lie in a plane perpendicular to the cue direction. The strike calculation resolves a point on the rear hemisphere and applies a cue-axis impulse there. Its effective inverse mass is `1/m + 1/m_cue + |r cross d|^2/I`; contact torque is `r cross J`. Cue elevation makes the impulse point downward. Any jump subsequently comes from interaction with the slate, not from directly assigning an upward velocity to an elevated cue shot.

The input disk extends to 0.97 ball radii. If the required tangential/normal tip impulse ratio exceeds the configured friction coefficient, the direction is projected to an approximate friction cone and impulse reduced. This deterministic slipping-tip approximation should not be mistaken for a detailed chalk, tip compliance, or cue-shaft vibration model. Contact points under 6 mm above the cloth are rejected as cloth-obstructed. Physical cue-shaft obstruction by a rail or another ball remains unimplemented.

Initial shaft deflection uses a small empirical angular adjustment. It is isolated from the rigid-body contact calculation for later replacement or calibration. It is not an experimentally fitted model of a particular cue, tip, shaft, or speed range.

## Cloth, rolling, and spin

Bottom-point slip is `(vx - R wy, vy + R wx, 0)`. During sliding, Coulomb friction opposes that slip. Applying both translational and rotational effects reduces slip magnitude at `7 mu_s g / 2` for a homogeneous sphere. The code splits at the slide-to-roll transition rather than numerically oscillating around zero slip. For a center hit with zero initial horizontal spin and no intervening collision, the natural rolling speed is 5/7 of initial speed. That relation is regression-tested.

During rolling, translation slows by the configured effective rolling deceleration and angular velocity remains consistent with no slip. Axial spin decays separately. Pure level sidespin does not receive an invented lateral force on the cloth. Elevated strokes can produce horizontal-axis spin components that change bottom-point slip and therefore curve the path. No cloth force is applied while airborne.

The rolling coefficient is an effective deceleration parameter, not a complete deformable-cloth contact model. Cloth nap, ball wear/dirt, humidity, table leveling, and position-dependent cloth behavior are absent.

## Collisions

Swept sphere-sphere time-of-impact prevents simply stepping past a nearby object ball. Rail geometry consists of six main cushion segments and twelve pocket facings with rounded endpoints. Ball-ball detection uses 3D separation, so a sufficiently elevated cue ball can pass over an object ball.

Normal contact impulses use restitution; bounded tangential impulses transfer spin and model throw. Co-timed touching-ball contacts are solved together with projected impulses. The original uniformly separated rack showed a narrow momentum-transfer artifact, so the rack now uses effectively touching balls and simultaneous normal contacts. Tests cover symmetry and energy behavior. The simultaneous-contact model is still an approximation to finite-time elastic compression of an actual rack.

Rail collision response uses a fixed nose height, speed-adjusted restitution, and contact friction. It is not a viscoelastic cushion-compression model. The projected rail contact radius changes with ball height. Sweeping that radius during vertical motion is approximated within fixed substeps, rather than solved as a complete deforming-contact trajectory. Gravity is split around the collision step. Slate rebounds use a simple contact restitution and a low-impact-speed cutoff to settle the ball.

An iteration cap of 64 collision events per tick is instrumented. Reaching it triggers an in-app warning; tested cases did not reach it. This is not a proof that all possible pathological configurations avoid tunneling or solver failure. Shots exceeding the 90-second simulation limit restore the preceding position rather than leave a half-resolved game state.

## Pockets and jaws

Pocket facings are real collision geometry. A ball moving into a facing can rebound or rattle rather than disappearing on entering an oversized pocket circle. Behind the jaws, six simplified sink regions capture a sufficiently low ball irreversibly. Shelf depth, pocket liners, back walls, hanging balls, and a high-speed ball bouncing back out after crossing the sink region are not fully modeled. Capture is checked at fixed-step intervals; general continuous sphere-sink intersection is not implemented.

## Display

Canvas is predominantly top-down. Height offsets and shadows show airborne motion. Quaternions advance ball orientation; cue-ball dots reveal spin. Number patches remain readable and the stripe rendering is stylized, not full textured-sphere 3D rendering. The dashed aiming guide is purely geometric. The actual path trail and replay use simulated states, not predicted animation.

## Validation and sources

Tests check physical invariants and recognizable shot behavior, not resemblance ratings from users. `verification/REPORT.md` states exactly what was run and what remains unverified. Experimental next steps should compare a controlled center-ball roll, stun/draw/follow after fixed-distance impacts, rail exits with English, and measured elevated-shot paths at several speeds. Calibration should use one parameter set across multiple shots rather than fitting each shot independently.

Primary references consulted:

- Evan Kiefl, *The physics of pool/billiards*: https://ekiefl.github.io/2020/04/24/pooltool-theory/ . Background for slide/roll regimes, contact-point friction, and the difficulty of cushion modeling.
- Pooltool official documentation: https://pooltool.readthedocs.io/en/latest/ . Architecture and modular physics reference.
- Pooltool custom physics documentation: https://pooltool.readthedocs.io/en/latest/resources/custom_physics.html . Reference for keeping physics-model choices explicit and separable.

The equations implemented here were written independently. Constants are provisional model selections and do not imply those sources validate this game's output.
