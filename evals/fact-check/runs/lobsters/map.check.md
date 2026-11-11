# Map check: Lobsters

Summary (after round 2): 187 claims checked in round 1 and 18 changed claims rechecked in round 2; 3 claims came back wrong (2 in round 1, 1 in round 2) and all 3 were fixed; 0 marked as assumptions. Of 7 reported gaps, 5 were folded into existing panels and 2 were declined. 2 of at most 3 rounds used; the round-2 fix still needs a recheck.

## Round 1

### Wrong claims

**flow:submit/5 (the title fetch in "A member submits a story")**
- Map said: the title fetch through Sponge came after the form was posted and `StoriesController` had built the story, as if `create` fetched the URL.
- Code says: only `stories#new` (with `?url=`) and `stories#fetch_url_attributes` call `fetched_attributes` (app/controllers/stories_controller.rb:84-100), before the form is posted. `create` never fetches.
- Why I got it wrong: I wrote the flow as one linear story of a submission and placed the fetch where it read naturally. I knew the fetch lived in `new` and `fetch_url_attributes` but did not keep the order of the HTTP requests apart.
- Fix: the flow now starts with the fetch request (`me_ca`, `ca_an`, `an_pi`, `pi_st` to `fetch_url_attributes`/`new`, then `st_si`). A second `pi_st` hop is the POST to `/stories` and says `create` does not fetch again. The flow description and tour text now say the fetch happens while the form is filled in.

**files:app/models/vote.rb ("The one method every vote and flag goes through")**
- Map said: every vote goes through `Vote.vote_thusly_on_story_or_comment_for_user_because`.
- Code says: a new comment's own upvote is created directly with `Vote.create!` in `Comment#record_initial_upvote` (app/models/comment.rb:506-511). Site votes, flags and a story's first upvote do use the method.
- Why I got it wrong: I generalised from the story path, where `Story#record_initial_upvote` calls the method. I had read the comment's version, which skips it, and did not carry that over.
- Fix: the files entry now names the exceptions. The ranking node's `why`, which said a comment saved from email goes "through the same code", was the same overstatement. It now says every vote ends in the same `update_score_and_recalculate!` recount, and names the direct `Vote.create!` for a comment's own upvote.

### Gaps accepted (folded into existing panels, no new nodes)
- **Comment redirect file cache**: Rails writes it in `comments_controller.rb:105` and Caddy serves it for `/c/<short_id>`. Now in the Caddy node's `what`. I had seen it in Caddyfile.pre but left it out as minor; it is a second cache that bypasses Rails, so it belongs there.
- **Restic off-site repository**: the primary database panel now says ResticJob pushes the backup, logs and config to a restic repository whose location is in `shared/etc/restic-env`, outside the repo.
- **Private messages and mod mail notifications**: the notifier's tools line now names the sibling jobs `NotifyMessageJob` and `NotifyModMailMessageJob`. No separate flow.
- **Login and session**: the request pipeline panel now says `LoginController` sets `session[:u]` to the user's `session_token`.
- **Other outbound fetches from recurring jobs**: the recurring jobs panel now names the weekly disposable-email blocklist fetch and the monthly IANA TLD fetch.

### Gaps declined
- **Telebugs error reporting**: optional, only on when credentials are set, and it plays no part in any flow; a node would add clutter.
- **GitHub OAuth account linking and the DiffBot client**: GitHub is a minor settings feature, and DiffBot is only called from the disabled mailing-list script. Neither carries a flow. Signup and invitation flows are left out for the same reason: the map's flows are about reading, posting and voting.

## Round 2

18 changed or added claims rechecked: 17 confirmed, 1 wrong, fixed below.

**node:ranking (`why`)**
- Map said: every vote ends in the same `update_score_and_recalculate!` recount, including a story's first upvote.
- Code says: `Story#record_initial_upvote` calls the vote method with `update_counters = false` (app/models/story.rb:905-907). `vote.rb:158` skips karma and the recount when that flag is false. The new story's hotness is set in `assign_initial_attributes` (story.rb:586). Site votes, flags and `Comment#record_initial_upvote` do run the recount.
- Why the fix went wrong: in round 1 I corrected the comment exception and then generalised again ("every vote ends in the recount") without rereading the story's call, whose sixth argument turns the counters off. It is the same mistake as round 1, overgeneralising from one path. Lesson: when writing "every", check each caller's arguments, not only which method it calls.
- Fix: the `why` now says site votes, flags and a comment's own upvote end in the recount, and that a new story's own upvote skips the recount and karma, with its first hotness set in `assign_initial_attributes`.
