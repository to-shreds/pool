# Club rules v0.1

## Scope

This release provides playable rule engines, not just alternative rack shapes. Physics emits ordered contact, cushion, pocket, and off-table events. `src/rules.js` interprets those events independently from rendering and input. The initial release deliberately labels its preset **Club rules v0.1**. It is not certified or complete tournament rules software.

WPA's official rules were consulted: https://wpapool.com/rules/ and the linked PDF https://wpapool.com/wp-content/uploads/2026/01/2026.01.02-WPA-Rules.pdf . The document examined states an effective date of September 15, 2025; its January 2026 URL is not its effective date. The implementation below must be judged against its documented preset, not assumed to implement every provision in that document.

## Common behavior

Competitive games use two local players. No AI, online opponents, lag for break, alternating-break match races, or tournament management. The first player breaks. Where relevant, a legal object-ball first contact and a rail or pocket after contact are required. Ball in hand is constrained to the kitchen or full cloth according to the mode. Occupied spotting locations are resolved by searching for space along the spotting line. Undo restores a pre-shot world and rules snapshot; replay never runs scoring again.

Called-shot games require selecting a ball and pocket in advance, or declaring safety. Bank pool additionally calls the number of banks. Called data is captured at stroke time. The app shows two-consecutive-foul warnings where a third foul loses or incurs a larger straight-pool penalty.

Global omissions: referee discretion, simultaneous first-contact adjudication, frozen-rail exceptions, double hits, push strokes, cue-shaft/bridge interference, ball movement by external contact, stalemate/rerack negotiations, time limits, and all optional break remedies. Kitchen escape is presently inferred from initial target position and a prior cue-ball rail contact, rather than explicitly tracking the cue ball's crossing of the head string. That can misjudge unusual curved or banked kitchen shots and needs replacement by a dedicated crossing event.

## 8-ball

Open table after the break. Assign solids/stripes on the first legally called pot, not on break pots. Contact a legal group ball first after assignment; clear the group before a legal called 8. An early, wrong-pocket, or fouled 8 loses. Break-shot 8s are spotted. On a dry break at least four distinct object balls must reach rails. The preset uses an incoming-player kitchen ball-in-hand outcome for illegal breaks, rather than the full official set of player choices. Later ordinary fouls give full-table ball in hand.

## 9-ball

Contact the lowest active numbered ball first. A legal 9 wins, including combinations and legal breaks. A fouled or off-table 9 is spotted. A push-out is available after a legal opening break; the incoming player can take the table or return the shot. First-contact/rail requirements are waived for that push-out, but scratches and off-table fouls are not. Three consecutive fouls lose. Illegal breaks use a fixed incoming-player full-table ball-in-hand remedy; all official break alternatives are not implemented.

## 10-ball

Lowest first; call a ball and pocket after the break. The 10 wins only when it is the last object ball and is legally called. An early or break-shot 10 is spotted. Wrongfully pocketed shots and declared safeties provide a take-or-return choice in this preset. Push-outs and three-consecutive-foul handling are implemented. Illegal breaks use the same simplified fixed remedy as 9-ball. These choices are surfaced explicitly in the UI rather than hiding turn changes.

## 14.1 straight pool

Selectable target, default 50. On a successful legal called shot, every pocketed object ball scores one. Uncalled, safety, and foul pots are spotted. Ordinary fouls deduct one point. A third ordinary consecutive foul costs one plus 15 additional points and requires that player to break a fresh rack; the streak resets. An opening-break requirement failure costs two points and gives the opponent accept-or-rebreak choice.

When one ball remains, fourteen are reracked while retaining the break ball. Main interference cases are implemented: cue ball or break ball in the rack area, both interfering, occupied head spot, and a full clearance. The rack frame's clearance region is a geometric approximation. Current run and personal high run are tracked. Further adversarial review of combined breaking fouls and exceptional rerack positions remains necessary before a full-WPA claim.

## 3-ball

Explicit fewest-strokes house variant. Each player clears a fresh three-ball rack. Every stroke, including the break, counts one. A scratch or off-table ball adds one penalty stroke; an off-table object ball is spotted. There is no post-contact rail requirement. Select the number of rounds; lower cumulative strokes wins, tied totals are a draw. Ball in hand after scratch is in the kitchen.

## One-pocket

Default pockets: Player 1 gets upper-right C; Player 2 gets lower-right D. Assignments may be swapped before play. First to eight, with points in the opponent's pocket normally credited to the opponent. Neutral-pocket pots wait to be spotted at the end of the inning. A foul returns a scored ball or creates a one-ball debt. Later legally scored balls pay owed balls first. A cue-ball scratch gives kitchen ball in hand. Three consecutive fouls lose. On a scratch, the opponent's balls pocketed on that shot are also spotted. Some compound simultaneous-foul outcomes remain unverified. Break-choice alternatives are not complete.

## Bank pool

Short-rack house preset: nine balls, first to five. Call ball, pocket, and one/two/three cushion banks. A scoring bank requires a direct cue-ball contact with the called object ball, the called number of main-cushion contacts, and no intervening collision of that ball with another ball. A cue-ball kick before first object contact does not qualify. Jaw contacts do not count as banks. Break pots do not score but a legal pot continues the inning. Non-scoring pots wait for spotting at inning end. Fouls cost a ball or create a debt; three consecutive fouls lose. The opening dry-break test uses four distinct object balls reaching rails in this preset. Long-rack banks and alternative bank rules are not included yet.

## Rotation

Named house variant: all fifteen balls, contact the lowest first, legal pots score face value, first to 61. Combinations count. Fouls give full-table ball in hand and spot object balls pocketed on the foul. This is not a claim to implement every regional rotation ruleset.

## Free practice

No opponent or fouls. A scratch restores the cue ball with placement available. Arrange/add/remove switches here before modifying the table. The six canned positions change setup and initial controls only; they do not override the physics or dictate an outcome.

## Expansion

User's broader requested scope remains active. Priorities include completing exception handling and official selectable presets, then full-rack banks, cutthroat, additional rotation variants, custom challenges, AI, and optional online multiplayer. No unimplemented mode is shown as an available game.
