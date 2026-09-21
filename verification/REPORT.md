# Cue Lab 0.2.0 verification

## Scope and result

This is the no-scroll controls and precision-placement release. The physics and rules engines are byte-for-byte identical to the original verified v0.1.0 source. All nine existing modes remain playable. No additional real-table calibration or tournament-rule-completeness claim is made.

- 114 Node unit tests passed; zero failures or skipped cases. Original 99 tests plus 15 candidate/camera/placement tests.
- 112 browser regression checks passed; zero page-script errors. Real game-menu, shot, rule consumption, undo, view-only replay, all six drills, calls, push-out choice, arrangement, JSON import/export, validation and save behavior.
- 199 additional precision and layout checks passed; zero page-script errors. Actual mouse/touch input, exact millimeter nudges, relative drag, cancellation, explicit commit, overlap/kitchen constraints, minimap relocation, hold/release, object-ball arrangement and orientation preservation.
- Six modular-entry checks passed. The hosted index loaded all five local CSS/JS assets and exercised shot, finish, undo and precision placement.

The no-scroll audit tested all ten control pages, warning states, placement and paginated help at 320x568, 360x640, 412x915, 412x740, 915x412, 740x360, 768x1024 and 1440x900. It checked document/container dimensions and hit-tested visible control centers, rather than merely hiding overflow. Help was paged to its final limitations paragraph.

## Methods and boundaries

Unit command: `node --test tests/*.test.js`.

Browser scripts: `browser-v0.2.py`, `precision-ui-tests.py`, and `modular-site-test.py` in this directory. Run `python3 build.py` first. The harnesses use Python Playwright with `/usr/bin/chromium` and real DOM/pointer events. Administrator policy blocks ordinary file/loopback navigation here, so the standalone tests initialize the actual bundled HTML with `page.set_content`. The modular test intercepts requests for the actual local asset bytes. It is not a public deployment test.

Successful storage checks explicitly use an in-memory localStorage shim; unavailable native storage handling is separately checked. Normal downloaded-file launch, real Android hardware performance, browser accessibility zoom beyond the tested viewports, and native persistence across browser restarts remain unverified. Test checks are not experimental validation of physical realism.

## Published-source integrity

At repository commit `b9f2a181da9944df70e0bb4e70c05e9950d41ca5`, GitHub's returned blob hashes for index.html, all five src files, build.py and package.json matched locally computed Git blob hashes. Thus the published application code is byte-for-byte the code exercised by the local harnesses. The subsequent commits add tests, documentation and verification workflow without changing that application code.

The standalone bundle is 125,437 bytes. SHA-256: `d8f36edac2c5128a876165d436368399559c0575e046911f67ec20cc70b79ca9`.

Preserved engine SHA-256 values:

- src/physics.js: `9b258324702ef168aac122804711c9e1b411ca1f4bddd6ef8ef6bb99a04ef836`
- src/rules.js: `2f30f31c82b7d45ac08b86a6a3387f1dc486eb3fca90de55543d3988710ab215`

A direct fresh clone could not run in the container because github.com DNS was unavailable. Integrity was verified through the authorized GitHub connector's tree/blob metadata instead. This limitation does not affect the completed connector writes.

## GitHub-hosted verification

GitHub Actions run `35657497110`, commit `9b1d86341188a4007baa6c9ba028922df404b6e3`, completed successfully. Its fresh checkout passed all 114 unit tests and rebuilt the 125,437-byte offline HTML with the identical SHA-256 above. Artifact `10665027526` contains that build. The CI run did not execute the browser harnesses or publish Pages.

## Hosting

The repository contains the static site at main/(root) and `.nojekyll`. GitHub Pages was disabled when inspected. The available connector supports repository writes but exposes no Pages-administration action. The verification workflow does not enable or deploy Pages. Enable Settings > Pages > Deploy from a branch > main > /(root), then Save. A live site still needs verification after enablement.

## Remaining project work

Preserve this interface baseline and old save schema. Test on Jon's actual device, then calibrate cushion exits, pockets, tip/shaft behavior, massé and jumps against measured shots. Replace the kitchen-crossing proxy, add cue-shaft obstruction, and complete remaining break/referee/compound-foul rule exceptions. No AI or online multiplayer is implemented.

Raw JSON results, text logs and screenshots from the completed local checks are preserved in the v0.2.0 source ZIP attached to the release conversation. Reproducible test scripts are also in the repository.
