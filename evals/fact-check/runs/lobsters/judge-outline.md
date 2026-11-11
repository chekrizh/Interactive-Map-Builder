## Map X
Components:
- Visitor (Person)
- Member (Person)
- Moderator (Person)
- Caddy web server (Container · Caddy via Hatchbox)
- Anubis bot filter (Container · Anubis)
- Mail server (Container · Postfix with OpenDKIM)
- Request pipeline (Component · Rack + ApplicationController)
- Story lists and feeds (Component · HomeController)
- Search (Component · Search)
- Page cache refill (Jobs · CachePageJob and friends)
- Full-page cache (Files · public/cache/)
- Story submission and votes (Component · StoriesController)
- Comments (Component · CommentsController)
- Votes and ranking (Models · Story, Comment, Vote)
- Reply by email (Component · Action Mailbox)
- Moderation tools (Component · Mod:: controllers)
- Reply and mention notifier (Job · NotifyCommentJob)
- Link preview and webmention (Jobs · CreateStoryCardJob, SendWebmentionJob)
- Recurring jobs (Solid Queue recurring tasks)
- Cron scripts (Hatchbox cron)
- Primary database (SQLite · storage/primary.sqlite3)
- Cache databases (SQLite · Solid Cache)
- Job queue (SQLite · Solid Queue)
- Linked websites (External systems)
- Mastodon instance (External system)
- Pushover (External system)
Flows:
- A visitor opens the front page
- A member upvotes a story
- A comment reaches the person it answers
- A member submits a story
- A mailing-list member replies by email

## Map Y
Components:
- Visitor (Person)
- Member (Person)
- Moderator (Person)
- Caddy web server (Container · Caddy via Hatchbox)
- Anubis bot filter (Container · Anubis)
- Mail server (Container · Postfix with OpenDKIM)
- Request pipeline (Component · Rack + ApplicationController)
- Story lists and feeds (Component · HomeController)
- Search (Component · Search)
- Page cache refill (Jobs · CachePageJob and friends)
- Full-page cache (Files · public/cache/)
- Story submission and votes (Component · StoriesController)
- Comments (Component · CommentsController)
- Votes and ranking (Models · Story, Comment, Vote)
- Reply by email (Component · Action Mailbox)
- Moderation tools (Component · Mod:: controllers)
- Reply and mention notifier (Job · NotifyCommentJob)
- Link preview and webmention (Jobs · CreateStoryCardJob, SendWebmentionJob)
- Recurring jobs (Solid Queue recurring tasks)
- Cron scripts (Hatchbox cron)
- Primary database (SQLite · storage/primary.sqlite3)
- Cache databases (SQLite · Solid Cache)
- Job queue (SQLite · Solid Queue)
- Linked websites (External systems)
- Mastodon instance (External system)
- Pushover (External system)
Flows:
- A visitor opens the front page
- A member upvotes a story
- A comment reaches the person it answers
- A member submits a story
- A mailing-list member replies by email
