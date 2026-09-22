# Physics model, version 0.3

The original engine architecture remains: SI-unit 3D position, velocity, angular velocity and quaternion orientation; contact-point cue impulse; Coulomb cloth sliding with exact slide-to-roll transition; rolling/spin decay; swept ball/rail collisions; simultaneous rack contacts; gravity/slate rebound; actual jaws with simplified sink regions. `PHYSICS-v0.2.md` preserves the detailed baseline derivation and provisional parameters.

## New actual geometry and mass

Worlds now own their table geometry. 7/8/9-foot-class settings select explicit 78x39, 88x44 or 100x50-inch playing surfaces. Custom length is 1.8-3.0 meters, with width half the length. These are selected model dimensions, not claims about every manufacturer's product. AI copies, ghost demos and renderers use the same table object; creating a different world cannot mutate a live table's rails or pockets.

Each ball carries its radius and mass. Inertia is `2*m*r*r/5`. Standard object balls remain 57.15 mm and 170 g. The oversized cue preset is 60.325 mm with equal-density scaled mass. The heavy preset is standard diameter and 200 g. Custom accepts 50-64 mm and 120-230 g independently, with experimental-density warnings.

Actual cue torque/effective mass, sphere contact separation, contact height, impulse denominators, tangential friction, slate/cloth contact, pocket clearance, placement and spotting consume these values. Unequal-height sphere collisions can transfer vertical momentum. There is no generic "large balls get less spin" multiplier. The heavier/larger preset changes inertia and post-impact behavior through the model itself.

## Low-speed multi-contact stabilization

The varied-equipment stress suite exposed a slow jam of object balls at pocket jaws. Pairwise elastic rebounds could repeatedly trigger zero-time contacts, reaching the iteration cap. A passive constraint projection now resolves already-touching, slow ball/rail/slate contacts when repeated co-timed contacts indicate an inelastic-collapse configuration. It removes approaching normal velocity rather than adding a scripted escape impulse. The slow-contact threshold is 0.12 m/s; fast contacts remain swept restitution contacts.

The intervention has a separate `contactSettles` diagnostic, so it is not hidden as an ordinary bounce. The `eventLimit` warning remains. A regression preserves the exact failing fixture; 256 seeded varied-equipment shots subsequently settled with finite state and no collision cap. These tests check numerical behavior, not experimental realism. The discrete solver is still an approximation to deformable multi-body contact.

## Execution and rendering

`execution.js` supplies the delivered cue axis/contact/power and effective tip friction. `physics.js` remains responsible for the resulting actual impulse, spin and movement. Risk estimates are described in `EXECUTION.md`; their profile probabilities and chalk wear are provisional model values.

`renderer3d.js` draws real sphere/table/cue geometry with perspective cameras and quaternion orientation. Both 2D and 3D read the same world; camera/theme choices do not alter physics. The overhead aiming line is geometric rather than a guaranteed spin-aware future path. The coach ideal route is a separately simulated, explicitly ideal stroke.

## Known limitations and calibration

Rail response is a nose-height/restitution/friction approximation, not a calibrated viscoelastic rubber model. Pocket capture behind actual jaw segments remains a simplified sink, not a complete shelf/liner/hanging-ball/rattle-back model. Shaft deflection, tip slip, slate rebound, massé and jumps need measured-shot calibration. Full cue-shaft obstruction, double hits, cloth nap, humidity and dirty-ball effects are absent. Arbitrary custom mass/density combinations are experimental.

Primary background references preserved from the original model:

- https://ekiefl.github.io/2020/04/24/pooltool-theory/
- https://pooltool.readthedocs.io/en/latest/
- https://pooltool.readthedocs.io/en/latest/resources/custom_physics.html

This is an independent implementation, not a Pooltool port or a claim that those sources validate Cue Lab's calibration. Next calibration should compare fixed-distance draw/follow/stun, side-spin rail exits, unequal cue-ball impacts, jump trajectories and pocket acceptance with repeatable measured shots.
