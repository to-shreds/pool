# Cue Lab 0.3 publication verification

## Verified source and reconstruction

Canonical repository: to-shreds/pool. The former main checkpoint 42ee495bea2d3ef63f08796c8d3d68dac8262b89 is preserved on baseline-v0.2.0. Runtime source was assembled and tested on build-v0.3.0 before promotion. Source commit: 68ebe3eb38d8dd249643b7690ce0353ec100aee4. The following release-finalization commit removes the one-time transport/workflow and updates documentation only, not runtime or tests.

The authorized connector cannot upload mounted files, and the container cannot resolve github.com. The source was therefore transported as ten checksum-verified Git blobs, expanded on an isolated build branch into ordinary unminified source files, and independently built/tested. The final tree contains normal source, not a compressed runtime dependency. The original ROADMAP-0.3.md was preserved from the repository.

GitHub Actions run 35676162826, job 106583027405, concluded success. It verified all 48 transported file hashes and their required baselines, generated the worker and standalone HTML, passed all 213 unit tests, and passed all 256 seeded varied-equipment/table stress shots. The CI run did not execute the browser harnesses.

The artifact 10672699527 was downloaded, ZIP-tested and freshly extracted in the build container. All 48 source SHA-256 values matched the manifest. Rebuilding the downloaded complete source produced HTML byte-for-byte identical to the locally browser-tested file. No source test or build result is inferred solely from a push succeeding.

## Artifact integrity

Standalone Cue-Lab.html: 332,419 bytes.
SHA-256: 7434e6c17376fadd860c52a84380308e868f498ba3e4f579fc13cc9160fae18d.

Generated src/worker-bundle.js SHA-256: e92a4324949d9ba26ddae0423d8e4841814ccd5c2f838332dfa97dab536d8d54.

GitHub artifact archive SHA-256: 1b0bce57436cb1b41d23dc55f4176eedbda4dcc33a68a6a60921961986b1c921.

Detailed source hashes: verification/CI-v0.3.json. The later docs/SETTINGS.md correction removes duplicated reference entries; HANDOFF.md and this publication record are release documentation updates. Those files do not change generated game bytes.

## Local browser and model coverage

213 local unit tests and 531 browser assertions passed with no page-script errors. Browser breakdown: 103 functional, 360 no-scroll/layout, 29 actual WebGL, 30 legacy-save/additional integration and 9 modular-entry checks. Eight viewport sizes include 320x568 and 740x360. Stress coverage: 256 accepted shots, all settled and finite, no collision-iteration caps, no mechanical-energy increase above the 0.001 J tolerance.

The browser harnesses initialize actual HTML with page.set_content or intercept actual local assets because normal file and loopback navigation are administratively blocked. Successful persistence checks use a disclosed in-memory localStorage shim. Real WebGL runs under headed Chromium/Xvfb/ANGLE SwiftShader. These are not physical Android GPU, ordinary local-file launch, native restart persistence or a public-hosting test.

## Implemented scope and limits

The build includes 68 operational settings in 12 categories, optional true 3D with retained 2D, Arcade/Simulation/Custom, actual cue-ball size/mass and table geometry, model-based skill/risk/chalk, computer opponents, shared worker coach with non-mutating demo, separate APA-derived 8/9 modes, matches, lag, stats and named drills. All original disciplines and old-save compatibility remain.

This is not completion of the full ambitious roadmap. Execution/chalk/skill rates need real-world calibration. Computer levels are provisional, not validated APA equivalents. The coach has bounded search and next-shot heuristics, not globally optimal deep pattern planning. Cue-shaft/double-hit/pocket/referee exceptions and physical-device validation remain. Exact licensed manufacturer models, online multiplayer and team administration are not included.

## Hosting

GitHub Pages was disabled at the latest inspected repository state. Source publication and successful CI do not establish a live URL. The static entry and .nojekyll are ready; Pages must be enabled for main at /(root), then actual served content verified. Current final source commit and release attachment checksums are recorded in ProjectStatus after promotion and artifact packaging.
