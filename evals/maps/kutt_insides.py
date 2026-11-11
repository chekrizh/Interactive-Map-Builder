H = "server/handlers/links.handler.js"
INSIDES = {
    "redirect": {
        "kind": "steps",
        "title": "Inside the redirect handler",
        "sub": "What <code>redirect()</code> does with every click, in order. Early exits branch to the right.",
        "cap": "Steps 2 and 3 usually hit Redis, so a hot link costs two cache reads and no database query. Everything slow, parsing the user agent, GeoIP and the stats write, happens after the response in step 8.",
        "steps": [
            {"t": "Skip reserved paths", "d": "Paths like <code>/login</code> or <code>/settings</code> belong to pages, not links.",
             "code": f"{H}:460-464", "exit": {"when": "reserved", "t": "Falls through to the 404 page"}},
            {"t": "Which domain was asked?", "d": "If the host is not the default domain, load that custom domain (Redis first, then the database).",
             "code": f"{H}:466-471"},
            {"t": "Find the link", "d": "By short address and domain. With Redis on, a cached copy lives there for 15 minutes.",
             "code": f"{H}:473-478", "exit": {"when": "not found", "t": "Domain homepage or /404", "code": f"{H}:480-484"}},
            {"t": "Check for a ban", "code": f"{H}:486-489", "exit": {"when": "banned", "t": "Redirect to /banned"}},
            {"t": "Info request?", "d": "For a link without a password, a trailing <code>+</code> asks where it goes instead of going there.",
             "code": f"{H}:491-503", "exit": {"when": "ends with +", "t": "Show the target, do not redirect"}},
            {"t": "Password protected?", "d": "Basic auth with the right password redirects at once, without recording a visit.",
             "code": f"{H}:505-529", "exit": {"when": "password", "t": "Password form; it posts to /api/links/:id/protected, which checks the hash, queues the visit and redirects", "code": f"{H}:547-585"}},
            {"t": "Queue the visit", "d": "Only for links with an owner and visitors that are not bots. Nothing waits for it; without Redis it runs inline.",
             "code": f"{H}:531-541", "async": True,
             "exit": {"when": "later", "t": "Worker parses the agent, looks up the country and stores the visit", "code": "server/queues/visit.js:8-34"}},
            {"t": "302 to the target", "d": "The browser leaves Kutt.", "code": f"{H}:543-544"},
        ],
    },
    "db": {
        "kind": "schema",
        "title": "Inside the database",
        "sub": "Six tables, created by Knex models and migrations. Hover a reference to see the table it points to.",
        "cap": "Visits are not one row per click: the worker keeps one row per link per hour and increments counters in it, so the stats page reads a few dozen rows instead of millions.",
        "tables": [
            {"name": "links", "note": "One short link.", "code": "server/models/link.model.js:1-44", "fields": [
                {"n": "address", "type": "string", "note": "the short id, unique per domain (checked in code)"},
                {"n": "target", "type": "string(2040)"},
                {"n": "domain_id", "ref": "domains", "note": "empty for the default domain"},
                {"n": "user_id", "ref": "users"},
                {"n": "password", "type": "bcrypt hash"},
                {"n": "expire_in", "type": "datetime", "note": "the expiry job deletes it after this"},
                {"n": "banned", "type": "bool"},
                {"n": "visit_count", "type": "int"},
                {"n": "uuid", "type": "uuid", "note": "public id for the password form"}]},
            {"name": "visits", "note": "Click stats, one row per link per hour.", "code": "server/models/visit.model.js:1-99", "fields": [
                {"n": "link_id", "ref": "links"},
                {"n": "user_id", "ref": "users"},
                {"n": "total", "type": "int"},
                {"n": "br_* · os_*", "type": "int", "note": "a counter per browser and per OS"},
                {"n": "countries · referrers", "type": "jsonb", "note": "counts by country and by referring site"},
                {"n": "created_at", "type": "datetime", "note": "insert time; stats group rows by the hour"}]},
            {"name": "users", "code": "server/models/user.model.js:1-44", "fields": [
                {"n": "email", "type": "string"},
                {"n": "password", "type": "bcrypt hash"},
                {"n": "apikey", "type": "string"},
                {"n": "role", "type": "USER | ADMIN"},
                {"n": "verified · banned", "type": "bool"},
                {"n": "*_token · *_expires", "note": "verification, password reset, email change"}]},
            {"name": "domains", "note": "Custom domains users bring.", "code": "server/models/domain.model.js:1-40", "fields": [
                {"n": "address", "type": "string"},
                {"n": "homepage", "type": "string", "note": "where unknown links on this domain go"},
                {"n": "user_id", "ref": "users"},
                {"n": "banned", "type": "bool"}]},
            {"name": "hosts", "note": "Target hosts admins have banned.", "code": "server/models/host.model.js:1-25", "fields": [
                {"n": "address", "type": "string"},
                {"n": "banned_by_id", "ref": "users"}]},
            {"name": "ips", "note": "Created by the first migration; no current code uses it.", "code": "server/models/ip.model.js:1-16", "fields": [
                {"n": "ip", "type": "string"}]},
        ],
    },
    "redis": {
        "kind": "schema",
        "title": "Inside Redis",
        "sub": "Cache keys, the visit queue and rate-limit counters. Every key can be lost without losing data.",
        "cap": "Redis only ever holds copies or work in flight. Writes go to the database first and then delete the cached copy, so the next read refills it.",
        "tables": [
            {"name": "l:&lt;address&gt;:&lt;domain id&gt;", "ttl": "15 min", "note": "A link, as the redirect reads it.", "code": "server/queries/link.queries.js:179-196", "fields": [
                {"n": "value", "ref": "links", "note": "the whole row as JSON"}]},
            {"name": "d:&lt;address&gt;", "ttl": "15 min", "note": "A custom domain.", "code": "server/queries/domain.queries.js", "fields": [
                {"n": "value", "ref": "domains"}]},
            {"name": "h:&lt;address&gt;", "ttl": "15 min", "note": "A target host, checked for a ban on every new link.", "code": "server/queries/host.queries.js:6-19", "fields": [
                {"n": "value", "ref": "hosts"}]},
            {"name": "u:&lt;id or api key&gt;", "ttl": "15 min", "note": "A user, looked up by id or API key on authenticated calls.", "code": "server/queries/user.queries.js", "fields": [
                {"n": "value", "ref": "users"}]},
            {"name": "s:&lt;link id&gt;", "ttl": "60 s", "note": "The computed stats page for one link.", "code": "server/queries/visit.queries.js:71-185", "fields": [
                {"n": "value", "ref": "visits", "note": "aggregated from the hourly rows"}]},
            {"name": "bull:visit:*", "ttl": "until done", "note": "The visit queue, under Bull's default prefix. Six workers take jobs and remove them when finished.", "code": "server/queues/queues.js"},
            {"name": "any-user", "ttl": "5 min", "note": "Whether any user exists, for the first-run admin check.", "code": "server/queries/user.queries.js:240-254"},
            {"name": "rl:&lt;route&gt;:&lt;ip&gt;", "note": "Rate-limit counters per route and IP on the auth routes, when <code>ENABLE_RATE_LIMIT</code> is on.", "code": "server/handlers/helpers.handler.js:88-116"},
        ],
    },
}
