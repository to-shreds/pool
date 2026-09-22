# Computer opponents and timeout coach

## Shared implementation

`coach.js` generates candidate strokes, runs copies of the actual physics world, and applies the selected game rules to score outcomes. Both the computer opponent and Coach use it. `worker.js` accepts shot search, lag and stalemate requests. `build.py` bundles these sources into an embedded Blob worker; no third-party API, language model or network service is called at runtime.

Candidate families include direct pots, ball-in-hand approach placements, one-cushion banks, two-ball combinations, kick/contact escapes, defensive contacts and breaks. Geometric candidates are refined over a bounded set of aim offsets, power and draw/follow values. Evaluation considers legal first contact, fouls/scratches, credited pots, mode-specific scoring and next direct-shot opportunities. It is not an exhaustive optimizer over every physically possible massé, jump, carom or multi-cushion pattern.

Search budgets are deliberately finite. The budget choices bound candidate evaluations and elapsed worker search time; stronger profiles consider broader options and narrower execution noise. The best few candidates can be sampled under the user's execution distribution. The reported robust-trial count is small and labeled as a simulator sample, not a calibrated probability. A timeout cannot promise a globally optimal shot or a real-world success rate.

The current positional evaluation is a next-shot heuristic, not a deep multi-rack game tree. The SL2-7 controls work and materially change behavior, but the requested high-end characterization of an SL7 reliably solving most banks/safeties is not yet experimentally demonstrated. It is a calibration goal, not a completed benchmark.

## Coaching interface

Coach reports a recommended ball/pocket or defensive objective, power, contact point, elevation, simulated result, next-shot opportunities, risk qualifications and alternatives when found. Detailed explanations are assembled from search results, not free-form invented tactical facts. The ideal finish region is shown on the table. Brief/detailed text is paginated with no required scrolling.

Watch demo reruns the selected exact ideal stroke on an independent world. Live positions, settings, call declaration, score, turn and seed remain unchanged. Closing the demo returns to the coach result. Apply suggestion only sets controls and any accepted ball-in-hand placement; the player must still press Shoot. The actual stroke then uses the selected skill/chalk model. If the bounded search fails to verify a legal candidate, the UI does not present it as a proven shot and Apply is disabled.

APA-style allowances default to two timeouts for profile 2/3 and one for 4-7 per rack, with separate APA9 handicap counts when that mode is selected. Custom, unlimited and off choices are implemented. Pre-break advice and enabled practice coaching do not consume a charge. Failed/cancelled searches are not charged. The optional one-minute advisory clock starts only after the result is ready, excluding computation time. It never creates a foul.

## Responsiveness and cancellation

Analysis runs off the UI thread. The computer has an independent presentation pause setting. A generation token and explicit cancellation prevent a stale worker result from shooting after undo, reset, import, settings, placement or a newer search. Computer play can be paused/resumed; undo pauses it so the restored position can be examined. There is a watchdog for failed workers. AI is never allowed to shoot recursively during a UI refresh.

## Lag and stalemate

The lag is a sequential local simulation using actual rail and cloth response. Computer lag speed is searched and then delivered with its execution profile. It is not a side-by-side simultaneous human lag simulation. Invalid or tied outcomes request another lag.

In APA stalemate mode, two human players confirm agreement. Against the computer, a bounded legal offensive-opportunity check for both sides informs acceptance; this is a conservative game heuristic, not mathematical proof of stalemate. APA8 discards that rack's scorekeeping contribution, while APA9 retains earned points, innings and defense and records all remaining ball values as dead according to the specific stalemate rule.

## Next improvements

Broader bank/kick search, multi-ball positional lookahead, break-pattern calibration, smarter safety valuation, empirical strength benchmarking and comparative match statistics are still worthwhile. Do not increase difficulty by secretly changing collision response, pocket acceptance or player equipment.
