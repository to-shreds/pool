# Game rules in Cue Lab 0.3

The original nine presets remain available: Club 8-ball, Club 9-ball, 14.1, 3-ball, one-pocket, 10-ball, short-rack banks, house rotation and free practice. Their baseline definitions and limitations are preserved in `RULES-v0.2.md`. They are not silently converted to APA rules.

Added APA-derived 8-ball and handicapped APA-derived 9-ball use a separate `apa.js` rules class and versioned handicap chart. `APA.md` describes the supported provisions, official sources and remaining exceptions. `session.js` handles multi-rack races, point carryover, breaker order, coaching counts, deterministic delivery state and scorekeeping without coupling rules to a camera.

Physical table and cue-ball changes are explicit settings that request a match restart. Rendering and theme changes do not. Ball arrangement and named-drill loading explicitly enter Practice. Called shots and safeties are captured before the stroke; APA ordinary pots are not incorrectly forced through Club called-shot requirements.

The coach and computer adjudicate candidate outcomes with the selected rules. Demo/replay do not call scoring on the live match. Undo restores the complete preceding table, rules, session, declarations and controls. Stalemates have dedicated APA8/9 treatment rather than resetting every kind of score identically.

This release does not claim full WPA/APA tournament-referee completeness. Unmodeled cue obstruction/double hits, full hanging-pocket behavior, exceptional frozen-ball/compound-foul cases and human referee discretion are identified in the physics and APA notes. Original Club rules retain their documented non-APA house choices.
