# Cue Lab 0.3.1: table-first calls and larger play surface

## Changed

- Removed the visible ball/pocket dropdown workflow. Hidden declaration fields remain only as backward-compatible internal state.
- Club call-shot modes now require a direct table declaration before aiming: tap the object ball, then tap the pocket. Tap a different ball or pocket to change the call.
- APA 8-ball ordinary shots never ask for a call. When the shooter is on the 8, only the pocket must be marked by tapping that pocket. The mark can be changed by tapping another pocket.
- Added a compact on-table declaration HUD and called-ball highlight. Bank count and Safety remain contextual actions rather than occupying permanent dropdown space.
- Increased table prominence. Desktop controls are narrower; portrait Aim devotes the majority of usable play height to the play area on the tested 412x915 viewport. Detail-heavy pages retain a more balanced split to avoid clipping or scrolling.
- Updated help text and the small regression-test surface to describe/expose the direct-call state.

## Preserved

Physics, equipment models, APA and Club rules engines, AI/coach search, 3D rendering, settings, precision placement, save schema, deterministic execution, undo/replay, chalk and match state are unchanged except for interaction-level declaration handling. APA pocket marks intentionally remain valid across a missed 8-ball attempt until changed or the rack ends. A new rack starts with no inherited marker.

## Verification

- 213 / 213 unit tests passed.
- 103 existing functional browser assertions passed with zero page-script errors.
- 360 no-scroll/layout assertions passed across 320x568, 360x640, 412x740, 412x915, 740x360, 915x412, 768x1024 and 1440x900.
- 29 actual-WebGL checks passed under the existing Xvfb/ANGLE software-rendering environment.
- 30 old-save/drill/house-restriction checks passed.
- 9 modular-entry/worker checks passed.
- 19 new table-first-call assertions passed, including Club ball→pocket taps, call changes, APA routine no-call behavior, APA 8 pocket-only marking, and the larger portrait table region.

The 0.3.0 physics stress baseline remains applicable because this release does not change physics. Physical-device Android testing and GitHub Pages hosting remain separate verification steps.
