# Map check: Umami

Summary (after round 2): 151 claims checked in round 1 (6 wrong, all fixed; 4 of 5 gaps added, 1 declined); 14 changed or added claims rechecked in round 2 (2 wrong, both fixed). 1 statement kept as an assumption ("probably an outside billing system" for the Redis keys nobody in the repo writes). The two round 2 fixes still need a fresh recheck.

## Round 1

### Wrong claims

1. **node:queries.** The map said the query layer "holds the Redis-backed loaders for websites, sessions and links". The code: `src/lib/load.ts` caches only websites and sessions (and reads account and team keys). `link:{slug}` and `pixel:{slug}` are cached directly in the `/q` and `/p` route handlers. Why I got it wrong: I saw `redis.client.fetch` in the `/q` route and filed it under the loader without checking where it was called. Fix: the panel now says where each cache lives, and the Redis panel says the same.
2. **node:kafka.** The map said only events, event data and session links go to Kafka. The code: six writers produce to topics: `event`, `event_data`, `session_link`, `session_data`, `session_replay` and `heatmap_event`. Why: I grepped `sendMessage` only in `events/` and `sessions/saveSessionLink`, and my grep output was cut off at `head`. Fix: the panel lists all six topics.
3. **flow:track/7** and 4. **inside:collect/step8.** The map said the visit "expires after 30 idle minutes". The code: `iat` is the visit's start time, carried unchanged in the cache token and reset only when a new visit starts (`route.ts:185-198`). A visit is therefore cut 30 minutes after it began, however active the visitor is. Why: I trusted the comment "Expire visit after 30 minutes" and the usual analytics convention instead of tracing where `iat` comes from. Fix: the hop text and the close-up step now describe the start-based cut-off.
5. **inside:clickhouse/table2.** The map said the hourly rollup holds one row per session, visit and hour. The code: the ORDER BY is website, event_type, hour and visit. Why: I read the column list but not the ORDER BY at lines 153-161. Fix: the note now gives the real key, and `website_id, event_type` was added as a field.
6. **files:src/components/hooks/queries/.** The map said there is one hook per API call and the names map one to one onto routes. The code: writes go through generic hooks (`useUpdateQuery`, `useDeleteQuery`), and several providers and forms call `useApi()` directly. Why: I generalised from `useWebsiteStatsQuery` alone. Fix: the entry is reworded.

### Missing items

- **Batch endpoint `POST /api/batch`.** Accepted. It is a second public ingestion entry that replays up to 500 payloads through the send handler. Added to the collect panel and the project structure.
- **umami.is update check and telemetry.** Accepted. Added an external node, `umami.is services`, with an edge for the dashboard's update check; the panel covers the telemetry pixel, the build telemetry and how to turn them off.
- **Cloud mode Redis keys written outside the repo.** Accepted as panel text on Redis. It says `account:`, `team:` and `white-label:` are read in cloud mode, nothing in the repository writes them, and probably an outside billing system does. I did not add a node because the writer is not visible.
- **Public share pages.** Accepted. Added a `Share page viewer` person with an edge to the dashboard; the panel explains the share token and the share-context header. I added no new flow, to stay at five.
- **DuckDuckGo favicon service.** Declined: it is a cosmetic image fetch in the dashboard, not part of any data path a reader needs.

Layout: after adding the two nodes, render.py reported one layout problem: the people overview card title "People and outside services" needed 3 lines. I shortened it to "People and services" and the next render was clean.

## Round 2

I read Round 1 again first. Both new mistakes came from the gap fixes I added in Round 1, and both repeat its lesson: I claimed more than I had grepped for.

1. **node:redis.** The map said `account:`, `team:` and `white-label:` keys are only read here and nothing in the repository writes them. The code: `POST /api/teams` writes `team:{teamId}` with a 90-day TTL in cloud mode (`src/app/api/teams/route.ts:78-91`); only `account:` and `white-label:` lack a writer. The panel also said `website:{id}` is cached for 24 hours, but a cloud-mode reset (`src/queries/prisma/website.ts:229`) rewrites it with the 1-hour default TTL. Why the fix went wrong: I copied the checker's gap note ("nothing in the repo writes them") without grepping for the writers myself. I had even seen the `redis.client.set` hits in `teams/route.ts` and `website.ts` in round 0 and did not connect them. Fix: the panel names the `team:` writer and its TTL, keeps "probably an outside billing system" only for `account:` and `white-label:`, and notes the 1-hour rewrite on reset.
2. **node:umamiis.** The map said telemetry is off with `DISABLE_TELEMETRY` or `PRIVATE_MODE`. The code: `PRIVATE_MODE` disables only the pixel script route; the build-time POST in `scripts/postbuild.js` checks only `DISABLE_TELEMETRY`. Why: I read the telemetry route's condition and assumed the build script used the same one. Fix: the panel now says which variable turns off which call.

No missing items were reported this round. Render with `--repo-dir` was clean: no warnings and no layout problems.
