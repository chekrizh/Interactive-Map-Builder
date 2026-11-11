# Map check: Miniflux

Summary so far: 166 claims checked in round 1; 162 confirmed, 4 wrong (all fixed), 0 not found. 2 of the 5 gaps added (sign-in flow, cron commands), 3 covered in panel text only. Round 1 of at most 3; recheck pending.

## Round 1

### Wrong claims

- **flow:poll/1** (scheduler batch)
  - Map said: the batch takes "only so many per host".
  - Code says: `WithLimitPerHost` only adds a cap when `POLLING_LIMIT_PER_HOST` > 0, and it defaults to 0, so there is no cap by default (internal/storage/batch.go:66-71, internal/config/options.go:515).
  - Why I got it wrong: I read the builder chain in scheduler.go and the builder method, but not the option's default. I assumed a builder call always means the limit applies.
  - Fix: the hop now says the cap is optional and off by default. The next hop ("per-host limit is applied in Go") now says "when configured".

- **inside:refresh/step12** (store the entries)
  - Map said: existing entries are updated only if the feed neither uses the crawler nor ignores updates.
  - Code says: `updateExistingEntries := forceRefresh || (!Crawler && !IgnoreEntryUpdates)` (handler.go:332), so a forced refresh always updates.
  - Why I got it wrong: I paraphrased the comment above the line and dropped the `forceRefresh ||` part of the expression.
  - Fix: the step text now includes the forced case. Flow hop poll/10 had the same omission and is fixed too.

- **inside:processor/step6** (scrape the article)
  - Map said: scraping happens only when the crawler is on and the entry is new.
  - Code says: `feed.Crawler && (entryIsNew || forceRefresh)` (processor.go:97).
  - Why I got it wrong: the same mistake of dropping `forceRefresh`. My own subscribe flow even relies on the forced case, so the two texts contradicted each other.
  - Fix: the step text now says "new or the refresh is forced".

- **inside:processor/step11** (YouTube durations in bulk)
  - Map said: this needs the user to show reading time and a YouTube API key to be set.
  - Code says: `shouldFetchYouTubeWatchTimeInBulk()` also needs `FETCH_YOUTUBE_WATCH_TIME` (youtube.go:37-38).
  - Why I got it wrong: I guessed what the helper checks from its name instead of opening youtube.go.
  - Fix: the step now names all three conditions and that it calls the YouTube Data API.

Lesson for later rounds: when code combines conditions with `||` or `&&`, quote the whole expression, and open any helper whose result decides a branch.

### Gaps

- **Sign-in flow.** Accepted. I added the flow "Sign in with OIDC" over existing edges: anonymous session, OAuth2 state and PKCE verifier, callback, user found or created, session rotated, cookie set. The password path is mentioned in the same flow. I also added a tour step and `internal/ui/auth.go` to the project structure. The idp panel now describes the redirect and the callback.
- **One-off CLI commands for cron** (`-refresh-feeds`, `-run-cleanup-tasks`, `DISABLE_SCHEDULER_SERVICE`). Accepted as text: the scheduler panel now explains them, and `internal/cli/refresh_feeds.go` is in the project structure. No new node, because they reuse the same RefreshFeed and cleanup code.
- **Prometheus metrics collector and /metrics.** Text only: one sentence in the router panel. It is optional monitoring and not on any main flow, and a node would push the map past 20 elements.
- **RSS-Bridge and YouTube Data API as outside systems.** Text only: they are named in the discovery panel and in the processor step. Both are optional, configured per user or per install, and fit under the existing "Feeds and websites" and finder cards.
- **Let's Encrypt (ACME).** Not added as a node. It is already named in the router panel; it is optional and only matters when the server starts with `CERT_DOMAIN`.
