# ENDURANCE / Gemeinsam bis Le Mans

Approved intent: implement the user's accepted standalone endurance decision-game design, now, without another approval cycle.

An offline-first German browser game; no backend, account, analytics or remote assets. Distinct driver and manager careers. GT4 and GT3 careers branch into LMP3, LMP2 and Hypercar; GT3 and LMP2 also reach Le Mans. Fictional teams, drivers, calendars, costs and performance. Real category names are descriptive, not a licensed simulation. FIA categorisation is not represented as a universal experience ladder; in-game categories and lineup constraints are explicitly simplified.

One mutable JSON state with seeded RNG, independent opponent cars and crews, shared fuel/tyres/damage, autonomous teammate stints, fatigue/rest, weather, neutralisations, multiclass traffic, stops and repairs. Race ticks use minutes, independent of decision frequency. Driver choices during rest differ from driving; managers control every stint. Safety auto-pits prevent an unplayable fuel dead end. Quick mode simulates longer intervals; standard gives more decisions in the same world.

Career loop: preparation -> qualifying -> race -> result -> next round -> season recap and binding offer -> next season. Both driver and team standings accessible without advancing time. Team lineup, development, sponsor choice, manufacturers, contracts, progress and archive. Three local saves; validated JSON export/import and resumable race. Public-link deployment requires an external hosting connection; delivered files are usable without one on a desktop browser.

Delivery: built single HTML, ZIP with static site, source, tests, instructions. Responsive mobile/desktop midnight/teal/ivory visual system. No imitation of a source file we have not received. Fully playable vertical scope; manufacturer career is not in v1. No paid dependencies.
