# Cue Lab 0.3.1 verification

This is an interaction and layout release over the verified 0.3.0 simulation. No physics, equipment, execution, AI-search or rules-engine formulas were changed.

## Results

- Unit: 213 passed, 0 failed, 0 skipped.
- Existing functional browser: 103 passed, 0 script errors.
- Layout/no-scroll: 360 passed across eight phone/tablet/desktop portrait and landscape viewports.
- WebGL: 29 passed, 0 script errors.
- Old saves/additional workflows: 30 passed.
- Modular entry/real worker: 9 passed.
- New call/UI test: 19 passed.

The new test uses real canvas pointer clicks to select a Club object ball and pocket, changes the call by tapping a different ball, verifies that APA 8-ball routine play has no declaration UI, and verifies that on the 8 only a pocket mark is required. On a 412x915 portrait viewport, the play area is more than 1.35 times the controls height and the table canvas itself occupies more than half the usable main height.

## Boundaries

The existing browser environment limitations remain: HTML is injected into Chromium or local assets are intercepted because normal file/loopback navigation is administratively blocked. WebGL runs under Xvfb/ANGLE SwiftShader, not a physical phone GPU. Physical Android performance, unrestricted downloaded-file opening, native restart persistence and the public hosted URL remain unverified.

The 256-shot 0.3.0 varied-table/equipment stress result remains the physics baseline because 0.3.1 makes no physics changes.


## Repository publication

Runtime/UI source checkpoint: 6f45a900fc57c4f3ea322b58c5fc90cc6fa657a7.

GitHub Actions Verify game run 35809808200 completed successfully from that checkpoint: 213 unit tests passed, 0 failed, and the standalone bundle rebuilt successfully. CI artifact 10728383994 contained a 342,121-byte Cue-Lab.html with SHA-256 0119d55e6eed88e2b13caa8c57c1136062672a02701686017e0e748fbe5196f9. The locally browser-tested source was normalized and rebuilt byte-for-byte to that CI artifact before final packaging.

GitHub Pages build/deployment run 35809807149 also completed successfully for the same checkpoint. The execution environment could not independently fetch the public github.io URL, so successful deployment is verified but served-page content is not separately claimed from an external fetch.
