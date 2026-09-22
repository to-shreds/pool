# APA-derived rules support in Cue Lab 0.3

## Authority and scope

Primary reference is APA's official online team manual for the 2026/27-2028/29 league years, consulted during this build. The game is not endorsed by APA and does not calculate an official Equalizer handicap. `apa.js` and its fixture tests define the current implemented scope; existing Club modes remain separate.

Official source pages:

- https://rules.poolplayers.com/game-rules/general-description/
- https://rules.poolplayers.com/game-rules/breaking/
- https://rules.poolplayers.com/game-rules/after-the-break/
- https://rules.poolplayers.com/game-rules/lagging/
- https://rules.poolplayers.com/game-rules/how-to-win-a-game/
- https://rules.poolplayers.com/game-rules/fouls/
- https://rules.poolplayers.com/game-rules/frozen-balls/
- https://rules.poolplayers.com/game-rules/balls-on-the-floor/
- https://rules.poolplayers.com/game-rules/stalemates/
- https://rules.poolplayers.com/general-rules/coaching/
- https://rules.poolplayers.com/general-rules/defensive-shots/
- https://rules.poolplayers.com/the-equalizer-handicap-system/games-must-win-charts/
- https://rules.poolplayers.com/the-equalizer-handicap-system/how-handicaps-are-determined/
- https://rules.poolplayers.com/time-guidelines/

## Implemented APA 8-ball

Single-category break pots assign groups; both categories leave the table open. Ordinary legal accidental pots count without a call. The 8 pocket is marked separately on the table. An early, unmarked/wrong-pocket or illegally pocketed 8 loses; the last group ball and 8 require separate strokes. A cue-ball scratch while playing the 8 loses even when the 8 remains up. An ordinary non-scratch failure to contact the 8 is a foul, not automatically a loss.

The 8 made on a legal break wins unless accompanied by the cue-ball foul. The break checks permitted initial rack contact, no cue rail before the rack, head-string start and pocket/four-distinct-object-rails requirement. Illegal break reracks for the same player except the applicable post-contact scratch switches the breaker. Legal-break foul gives kitchen ball-in-hand. Subsequent first contact is tested against the target's actual center at collision on/outside the head string, not an inference from a previous cushion.

Off-table object balls use delayed spotting, with the applicable completion-of-group handling. Frozen-rail contact rules use declared/automatically detected pre-shot state and the event sequence. Defensive intent is recorded; an accidental legal own-group pot on a defensive stroke does not incorrectly end the inning.

## Implemented handicapped APA 9-ball

Lowest active ball first. Balls 1-8 score one point each; the 9 scores two. A legal 9 ends the rack, while points carry into a new rack unless the match target has been reached. The target can be reached with the 9 still on the table. Foul pots of 1-8 become dead balls; the 9 is spotted. Off-table object balls are spotted immediately without inventing a universal additional foul. There is no push-out and no three-consecutive-foul loss in this preset.

The point targets for levels 1-9 are 14, 19, 25, 31, 38, 46, 55, 65 and 75. The complete official 8-ball race chart is separately stored in `apa.js`; it is not replaced with a formula guessed from the skill numbers. Handicap targets are independent of Cue Lab's 2-7 execution-strength controls.

## Match features

Selectable first breaker/random/sequential playable lag; winner breaks in APA presets; rack transitions; custom or handicap races; lag-loser complete innings; defensive shots; scratches, fouls, legal scoring strokes, break pots, run lengths and supported break-result events. Referee review lists exact simulated contacts and links to ordinary recorded replay, not human certainty about unmodeled cue contact.

Coaching has per-rack counts, free pre-break advice and optional non-punitive pacing. The one-minute advice clock starts after computation. House jump/massé restrictions affect stroke availability. All cues in this release represent ordinary playing-cue physics; there is no selectable specialty jump-cue equipment implementation.

Stalemates require agreement or the bounded computer acceptance test. APA8 voids the stalemated rack's innings/defensive contribution and restarts with the original breaker. APA9 keeps earned points, innings and defense, and records all remaining ball values as dead. The 9 being dead in an agreed stalemate is a specific exception, not permission to score an ordinary fouled 9 as dead.

## Explicit remaining exceptions

No claim of a complete tournament referee. Shaft/bridge obstruction, double-hit and push-stroke adjudication, accidental external ball movement, unsportsmanlike intent, complete simultaneous-first-contact disputes, every compound-foul ordering, social agreement procedures and all frozen-ball subtleties need further review. Pocket-hanging, delayed falls, wedge classification and balls rebounding out after crossing the current simplified sink region are not fully modeled.

The sequential lag is a local-game adaptation. Standard playing-cue use and house restrictions are supported, not a complete APA equipment-inspection workflow. The match statistics are a useful scorecard, not an official APA submission sheet, Equalizer implementation or team-season management system.

Where the remaining limitations could affect an exceptional shot, retain the APA-derived label and permit undo/practice review rather than claiming full official compliance.
