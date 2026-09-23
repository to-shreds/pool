# Cue Lab handoff

## Current build and source of truth

Cue Lab 0.3.1 is the current interaction/UI release. Canonical repository: to-shreds/pool. Runtime/UI checkpoint: 6f45a900fc57c4f3ea322b58c5fc90cc6fa657a7. Cue Lab 0.3.0 is preserved on baseline-v0.3.0 at ddf7da475e36101c180a12e4eb9df2418d7f299a, and the older 0.2 baseline remains on baseline-v0.2.0.

Authoritative runtime remains index.html plus the original src modules. build.py generates the worker bundle and standalone HTML. Edit original modules, not generated bundles.

## 0.3.1 interaction change

Call-shot interaction is now table-first. Visible ball/pocket dropdowns are removed from normal play. In Club call-shot disciplines, declaration happens before aiming: tap the object ball, then tap the pocket. Tap another ball or pocket to change the call. The called ball is highlighted and a compact HUD shows the state. Safety and bank count are contextual actions.

APA 8-ball ordinary shots never request a ball/pocket call. When the shooter is legally on the 8, only the pocket must be marked by tapping that pocket. The mark can be changed by tapping another pocket. A missed 8 retains its marker until changed, consistent with the existing rules model; a new rack begins unmarked.

The playing surface now receives substantially more screen space. Desktop controls are narrower. In the tested 412x915 portrait Aim screen, the play area is more than 1.35 times the controls height and the table itself exceeds half of the usable main height. Detail-heavy settings/practice/match pages keep enough control space to remain no-scroll.

## Preserved systems

The 0.3 physics, equipment, execution, chalk, AI/coach, APA/Club rules, 3D rendering, settings, precision placement, save schema, deterministic undo/replay and match state are unchanged by 0.3.1 except for declaration interaction and UI layout. All nine original disciplines plus APA8/APA9 remain.

## Verification and publication

0.3.1 local verification: 213 unit tests; 103 functional browser assertions; 360 no-scroll/layout assertions across eight viewports; 29 actual-WebGL checks; 30 old-save/additional checks; 9 modular-entry/worker checks; and 19 new table-first declaration/layout checks. All passed with zero page-script errors. The verified 0.3.0 256-shot physics stress baseline remains applicable because 0.3.1 changes no physics.

GitHub Actions Verify game run 35809808200 passed all 213 unit tests and rebuilt the standalone bundle from published source. CI artifact 10728383994 is 342,121 bytes with SHA-256 0119d55e6eed88e2b13caa8c57c1136062672a02701686017e0e748fbe5196f9. The locally tested source was normalized until its build matched that artifact byte-for-byte.

GitHub Pages build/deployment run 35809807149 completed successfully for the same runtime checkpoint. The available web/container environments could not independently fetch the github.io page, so do not claim a separately observed served payload. Repository deployment itself succeeded.

See RELEASE-0.3.1.md and verification/REPORT-v0.3.1.md. The broader 0.3 limitations and calibration caveats remain in RELEASE-0.3.md and verification/REPORT-v0.3.md.

## Do not break

APA 8 routine play must never require an ordinary call. Call-shot games must remain direct table interactions, not dropdown workflows. Aiming begins only after the required declaration. 2D stays supported. No-scroll controls must be reachable, not merely clipped. Presentation changes never alter physics. Precision placement, coach demos and replay never mutate live state. Undo restores complete deterministic state. Preserve old saves, tight racks, simultaneous contacts and stale-AI cancellation.

## Remaining work

Test 0.3.1 on Jon's actual phone/tablets and tune table/control proportions from real-device feedback. The broader 0.3 calibration work remains: execution/chalk/skill distributions, rail/pocket/tip/shaft/elevated-shot behavior, AI strength and deeper pattern planning, plus remaining cue-obstruction/double-hit/pocket/referee edge cases. No online multiplayer, team administration or official APA skill calculation.

Update this handoff after meaningful changes, then ProjectStatus STATUS.md last.
