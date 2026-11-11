"""Generate the Kutt (URL shortener) example map: a C4-style repository map with a hand layout.

Run: python3 tools/examples/build_kutt.py > plugins/interactive-map/skills/interactive-map/examples/kutt-url-shortener.json
"""
import json
import pathlib

exec((pathlib.Path(__file__).parent / "kutt_insides.py").read_text())  # INSIDES

W, H = 210, 58
C = {1: 340, 2: 630, 3: 920, 4: 1240, 0: 50}
R = {1: 130, 2: 300, 3: 470, 4: 640}


def at(c, r):
    return {"x": C[c], "y": R[r], "w": W, "h": H}


def node(id, group, cat, step, icon, concept, tool, what, why, tools, zone):
    return dict(id=id, group=group, cat=cat, step=step, icon=icon, tool=tool, concept=concept,
                what=what, why=why, tools=tools, zone=zone)


nodes = [
    node("visitor", "people", "person", 1, "user", "Visitor", "Person",
         "Anyone who clicks a short link such as <code>kutt.it/abc</code>. Never signs in.",
         "Most traffic is visitors, so the redirect path is the one that has to be fast and must never break.",
         "Any browser or HTTP client.", "outside"),
    node("target", "outside", "external", 1, "globe", "Target website", "External",
         "The original long URL a short link points to.",
         "Kutt never proxies the page. It answers with a 302 and the browser goes there on its own.",
         "Whatever site the link owner chose.", "outside"),
    node("user", "people", "person", 2, "user", "Link owner", "Person",
         "Has an account (sign-up is off by default; the first admin is created on first run), shortens URLs, sets custom addresses, passwords and expiry, reads click stats. Admins are the same users with an admin role: they ban links, domains and users.",
         "Owners are the only ones who write data. Everything they do goes through the API.",
         "Browser (server-rendered pages with htmx) or any script with an API key.", "outside"),
    node("oidc", "outside", "external", 3, "key-round", "OIDC provider", "External · optional",
         "An OpenID Connect identity provider, used for single sign-on when <code>OIDC_ENABLED</code> is set.",
         "Lets a company plug Kutt into its existing login instead of passwords.",
         "Any OpenID Connect provider · <code>openid-client</code>", "outside"),
    node("redirect", "redirect", "component", 1, "zap", "Redirect handler", "Component · Express",
         "Looks up the domain and the short address, checks bans and passwords, queues a visit and answers with a redirect to the target. On a custom domain, a middleware before all routes sends <code>/</code> and reserved paths to the domain's homepage.",
         "This is the product. Every other part exists to create the links this handler serves.",
         "Express route after the page and API routes in <code>server/server.js</code> · <code>links.handler.js → redirect()</code>", "server"),
    node("web", "manage", "component", 2, "app-window", "Web pages", "Component · Handlebars",
         "Renders the home page, the links table, settings and the admin panel from Handlebars templates. Buttons and forms call the API through htmx.",
         "No separate frontend app: the server is the UI, which keeps deployment to one container.",
         "Handlebars (<code>server/views</code>) · htmx · <code>routes/renders.routes.js</code>", "server"),
    node("api", "manage", "component", 2, "code", "REST API", "Component · Express",
         "Routes for links, domains (add, remove, admin ban), users, auth and health. Validates input before calling the handlers; the auth routes are rate-limited when <code>ENABLE_RATE_LIMIT</code> is on.",
         "The same API serves the web pages and external scripts, so there is one path for every write.",
         "Express routers in <code>server/routes</code> · express-validator · express-rate-limit", "server"),
    node("links", "manage", "component", 2, "link", "Link logic", "Component · Node.js",
         "Creates links: reuses an existing one if asked, checks custom addresses, bans on the target host, generates a random id, then saves. Also edits, deletes, bans, serves click stats and emails abuse reports through the mailer.",
         "All link rules live here, so the redirect handler can stay small and fast.",
         "<code>server/handlers/links.handler.js</code> · nanoid", "server"),
    node("auth", "manage", "component", 3, "lock", "Auth", "Component · Passport",
         "Signup, login, email verification, password reset and API keys. Turns a JWT cookie (also set after an OIDC login) or an API key into <code>req.user</code>.",
         "Every write needs an owner, and stats are private to that owner.",
         "Passport (local, JWT, API key) · openid-client · bcryptjs · <code>server/passport.js</code>, <code>auth.handler.js</code>", "server"),
    node("queries", "data", "component", 1, "layers", "Data access + cache", "Component · Knex",
         "A module each for links, visits, users, domains and hosts. With Redis on, reads check it first and keep links, domains, hosts and users there for 15 minutes (stats for 60 s); writes go to the database and clear the cached copy.",
         "The cache is what keeps redirects cheap. Without Redis the same code just goes straight to the database.",
         "Knex (<code>server/queries</code>, <code>server/knex.js</code>) · ioredis", "server"),
    node("visitq", "background", "background", 4, "inbox", "Visit processor", "Component · Bull worker",
         "Takes queued visits, works out browser, OS, referrer and country (Cloudflare header, else GeoIP), increments the link's counter and stores the visit. Without Redis the same code runs inline in the web process.",
         "Stats work is moved out of the redirect so a click is answered before any of it happens.",
         "Bull queue <code>visit</code>, 6 sandboxed child processes · <code>server/queues/visit.js</code> · geoip-lite, express-useragent", "server"),
    node("cron", "background", "background", 3, "clock", "Expiry job", "Component · setInterval",
         "Every 30 seconds deletes links whose expiry time has passed.",
         "Runs inside the web process where <code>NODE_APP_INSTANCE</code> is 0, the default, so a cluster must set it per instance to avoid deleting twice.",
         "<code>setInterval</code> in <code>server/cron.js</code>", "server"),
    node("mail", "background", "background", 3, "mail", "Mailer", "Component · nodemailer",
         "Sends verification, password reset and change-of-email messages from HTML templates, and plain-text link reports to <code>REPORT_EMAIL</code>.",
         "Accounts are confirmed by email before they can create links (when verification is on).",
         "nodemailer · <code>server/mail</code>", "server"),
    node("redis", "data", "store", 4, "database-zap", "Redis", "Container · optional",
         "Cache for hot lookups, the visit queue and, when rate limiting is on, its counters.",
         "Optional and off by default: with <code>REDIS_ENABLED=false</code> the cache is skipped and visits are processed inline.",
         "redis:alpine in the redis, postgres and mariadb compose files · ioredis · Bull", "data"),
    node("db", "data", "store", 1, "database", "Database", "Container · SQL",
         "Tables for links, visits, users, domains and hosts, plus an unused ips table. Migrations run on every container start.",
         "The single source of truth. Redis only holds copies.",
         "SQLite by default, or Postgres or MariaDB/MySQL, via Knex · <code>server/migrations</code>", "data"),
    node("smtp", "outside", "external", 3, "send", "Mail server", "External",
         "The SMTP server that actually delivers Kutt's emails.",
         "Kutt does not send mail itself. Mail is off unless <code>MAIL_ENABLED</code> is set, and sign-up needs it.",
         "Any SMTP provider (<code>MAIL_HOST</code>, <code>MAIL_PORT</code>)", "outside-mail"),
]

pos = {
    "visitor": at(0, 1), "target": at(0, 2), "user": at(0, 3), "oidc": at(0, 4),
    "redirect": at(1, 1), "web": at(1, 3),
    "visitq": at(3, 1), "cron": at(2, 2), "queries": at(3, 2),
    "api": at(2, 3), "links": at(3, 3), "auth": at(2, 4), "mail": at(3, 4),
    "redis": at(4, 1), "db": at(4, 2), "smtp": at(4, 4),
}


def cy(r):
    return R[r] + H // 2


edges = [
    ("vi_re", "visitor", "redirect", "GET /:id", f"M260,{cy(1)} L340,{cy(1)}", {}),
    ("re_ta", "redirect", "target", "302 redirect", f"M380,{R[1]+H} L380,{cy(2)} L260,{cy(2)}", {"lside": "below"}),
    ("re_qu", "redirect", "queries", "find domain and link", f"M550,{R[1]+40} L600,{R[1]+40} L600,260 L960,260 L960,{R[2]}", {}),
    ("re_rd", "redirect", "redis", "queue the visit", f"M500,{R[1]} L500,100 L1300,100 L1300,{R[1]}", {}),
    ("rd_vq", "redis", "visitq", "visit job", f"M1240,{cy(1)} L1130,{cy(1)}", {}),
    ("vq_qu", "visitq", "queries", "count and store", f"M1010,{R[1]+H} L1010,{R[2]}", {}),
    ("qu_rd", "queries", "redis", "cache", f"M1100,{R[2]} L1100,225 L1320,225 L1320,{R[1]+H}", {"bidir": True}),
    ("qu_db", "queries", "db", "SQL via Knex", f"M1130,{cy(2)} L1240,{cy(2)}", {}),
    ("cr_qu", "cron", "queries", "delete expired", f"M840,{cy(2)} L920,{cy(2)}", {}),
    ("us_we", "user", "web", "uses", f"M260,{cy(3)} L340,{cy(3)}", {}),
    ("us_ap", "user", "api", "API key", f"M155,{R[3]+H} L155,575 L700,575 L700,{R[3]+H}", {}),
    ("we_ap", "web", "api", "htmx", f"M550,{cy(3)} L630,{cy(3)}", {}),
    ("ap_li", "api", "links", "", f"M840,{cy(3)} L920,{cy(3)}", {}),
    ("li_qu", "links", "queries", "links", f"M1060,{R[3]} L1060,{R[2]+H}", {}),
    ("ap_au", "api", "auth", "authenticate", f"M770,{R[3]+H} L770,{R[4]}", {}),
    ("au_qu", "auth", "queries", "users", f"M840,{R[4]+12} L880,{R[4]+12} L880,410 L960,410 L960,{R[2]+H}", {}),
    ("au_oi", "auth", "oidc", "OpenID Connect", f"M630,{cy(4)} L260,{cy(4)}", {}),
    ("au_ma", "auth", "mail", "email", f"M840,{cy(4)+10} L920,{cy(4)+10}", {}),
    ("ma_sm", "mail", "smtp", "SMTP", f"M1130,{cy(4)} L1240,{cy(4)}", {}),
]

E = [{"id": i, "from": f, "to": t, "label": l, **({"bidir": True} if x.get("bidir") else {})} for i, f, t, l, _, x in edges]
LE = {i: {"d": d, **{k: v for k, v in x.items() if k != "bidir"}} for i, f, t, l, d, x in edges}

flows = {
    "follow": {
        "title": "Open a short link", "hue": "component",
        "desc": "A visitor clicks kutt.it/abc and lands on the target site. Stats are written afterwards, in the background.",
        "hops": [
            {"e": "vi_re", "t": "The browser asks for <code>/abc</code>. On a custom domain, a middleware first sends <code>/</code> and reserved paths to the domain's homepage. Express then tries the page and API routes; only then the catch-all <code>/:id</code> runs."},
            {"e": "re_qu", "t": "If the host is not the default domain, the handler loads that custom domain, then the link by address and domain."},
            {"e": "qu_rd", "t": "With Redis on, both lookups check it first. A hot link is answered from the cache without touching the database."},
            {"e": "qu_db", "t": "On a miss the link is read from the database and, with Redis on, cached for 15 minutes."},
            {"e": "re_rd", "t": "The link has an owner, is not banned or password-protected, and the visitor is not a bot, so a visit job is added to the Bull queue. Nothing waits for it; without Redis the processor runs inline, also unawaited."},
            {"e": "re_ta", "t": "The handler answers 302 with the target URL. The browser leaves Kutt."},
            {"e": "rd_vq", "t": "Later, one of six Bull workers picks up the job."},
            {"e": "vq_qu", "t": "It parses the user agent, takes the country from the Cloudflare header or GeoIP, increments the link's counter and stores the visit."},
            {"e": "qu_db", "t": "It adds to the link's row for the current hour, or inserts one for the first visit in that hour, ready for the stats page."},
        ],
    },
    "create": {
        "title": "Shorten a URL", "hue": "person",
        "desc": "An owner pastes a long URL and gets a short one back.",
        "hops": [
            {"e": "us_we", "t": "The owner pastes a URL into the form on the home page."},
            {"e": "we_ap", "t": "htmx posts the form to <code>POST /api/links</code> (the same router is also mounted at <code>/api/v2</code>)."},
            {"e": "ap_au", "t": "Passport identifies the caller from the JWT cookie or API key. Anonymous links are off unless <code>DISALLOW_ANONYMOUS_LINKS</code> is false."},
            {"e": "ap_li", "t": "Validators check the URL, custom address and expiry; then the link handler runs."},
            {"e": "li_qu", "t": "In parallel it finds a link to reuse if asked, checks the custom address is free, checks the target domain and host (via DNS) against bans, and, without a custom address, generates a free random id."},
            {"e": "qu_db", "t": "The new link is inserted."},
            {"e": "we_ap", "rev": True, "t": "The API renders the short-link card back into the page and tells the links table to reload."},
        ],
    },
    "signup": {
        "title": "Sign up", "hue": "external",
        "desc": "A new owner creates an account and confirms the email.",
        "hops": [
            {"e": "us_ap", "t": "When registration and mail are on (both off by default), the signup form posts email and password to the auth API."},
            {"e": "ap_au", "t": "The auth handler hashes the password with bcryptjs, 12 rounds."},
            {"e": "au_qu", "t": "It creates an unverified user, or updates an unverified one with that email, with a token valid for 60 minutes."},
            {"e": "qu_db", "t": "The user row is saved."},
            {"e": "au_ma", "t": "It asks the mailer for the verification email."},
            {"e": "ma_sm", "t": "The mailer hands the message to the SMTP server. The owner clicks the link to activate the account."},
        ],
    },
    "expire": {
        "title": "Expire old links", "hue": "background",
        "desc": "A timer inside the server removes links whose time is up.",
        "hops": [
            {"e": "cr_qu", "t": "Every 30 seconds the expiry job asks for links with <code>expire_in</code> in the past."},
            {"e": "qu_db", "t": "They are deleted in one batch; cached copies are removed from Redis."},
        ],
    },
}

groups = {
    "people": {"title": "People", "huekey": "person", "icon": "user", "line1": "Visitors open links.",
               "line2": "Owners create and manage them.", "chips": "Browser · API key",
               "text": "Two kinds of people use Kutt. Visitors only follow links. Owners sign in, create links and read stats; admins are owners with extra rights.",
               "members": ["visitor", "user"]},
    "redirect": {"title": "Serve the redirect", "huekey": "component", "icon": "zap", "line1": "Turn /abc into a 302",
                 "line2": "as fast as possible.", "chips": "Express · GET /:id",
                 "text": "One handler answers every click: find the link, check it, queue a visit and redirect. It is the hot path of the system.",
                 "members": ["redirect"]},
    "outside": {"title": "Outside services", "huekey": "external", "icon": "globe", "line1": "Where visitors land,",
                "line2": "who sends mail and who logs in.", "chips": "Target sites · SMTP · OIDC",
                "text": "Systems Kutt depends on but does not run: the target websites, an SMTP server for email and, optionally, an OpenID Connect provider.",
                "members": ["target", "smtp", "oidc"]},
    "manage": {"title": "Create and manage", "huekey": "person", "icon": "app-window", "line1": "Pages, API and auth",
               "line2": "for everything owners do.", "chips": "Handlebars · htmx · Passport",
               "text": "Server-rendered pages, one REST API used by both the pages and scripts, the link rules and authentication.",
               "members": ["web", "api", "links", "auth"]},
    "data": {"title": "Remember it", "huekey": "store", "icon": "database", "line1": "A database for truth,",
             "line2": "Redis for speed.", "chips": "Knex · SQL · Redis",
             "text": "A queries layer in front of a SQL database, with Redis as an optional cache and queue.",
             "members": ["queries", "redis", "db"]},
    "background": {"title": "Work in the background", "huekey": "background", "icon": "clock", "line1": "Stats, expiry and email,",
                   "line2": "off the request path.", "chips": "Bull · setInterval · nodemailer",
                   "text": "Jobs that should not slow a click down: recording visits, deleting expired links and sending email.",
                   "members": ["visitq", "cron", "mail"]},
}
for g in groups.values():
    pass

overview = [{"g": g} for g in ["people", "redirect", "outside", "manage", "data", "background"]]
OP = {"people": (60, 40), "redirect": (480, 40), "outside": (900, 40),
      "manage": (60, 340), "data": (480, 340), "background": (900, 340)}
oedges = [
    ("o1", "people", "redirect", "open links", "M336,140 L475,140", 365, 127, "middle"),
    ("o2", "redirect", "outside", "302", "M756,140 L895,140", 785, 127, "middle"),
    ("o3", "people", "manage", "create links", "M195,246 L195,335", 209, 295, "start"),
    ("o4", "redirect", "data", "find link", "M615,246 L615,335", 629, 295, "start"),
    ("o5", "manage", "data", "read / write", "M336,440 L475,440", 365, 427, "middle"),
    ("o6", "background", "data", "visits", "M895,440 L756,440", 785, 427, "middle"),
    ("o7", "background", "outside", "email", "M1035,335 L1035,246", 1049, 295, "start"),
]



build = [None,
         {"title": "Redirect a link", "text": "The core of any URL shortener: a stored mapping and one route that follows it.",
          "decision": "The redirect route is registered last, after every page and API route, so a short id can never shadow a real page.",
          "runnable": "docker compose -f docker-compose.sqlite-redis.yml up",
          "nodes": ["visitor", "target", "redirect", "queries", "db"]},
         {"title": "Let owners create links", "text": "Pages, one API and the link rules.",
          "decision": "The web pages call the same API that scripts use, so there is one write path.",
          "runnable": "curl -H 'X-API-KEY: …' -d target=https://example.com https://kutt.it/api/v2/links",
          "nodes": ["user", "web", "api", "links"]},
         {"title": "Add accounts and expiry", "text": "Logins, email verification, optional SSO and a timer that removes expired links.",
          "decision": "The expiry timer lives inside the web process instead of a separate scheduler container.",
          "runnable": "npm run migrate && npm run dev",
          "nodes": ["auth", "oidc", "mail", "smtp", "cron"]},
         {"title": "Make it fast", "text": "Redis as cache and queue, and stats moved off the request path.",
          "decision": "Redis is optional: without it the same code skips the cache and records visits inline.",
          "runnable": "REDIS_ENABLED=true npm start",
          "nodes": ["redis", "visitq"]},
         ]

tour_chapters = [{"name": "Context", "hue": "--ink"}, {"name": "A click", "hue": "--h-component"},
                 {"name": "A new link", "hue": "--h-person"}, {"name": "Background", "hue": "--h-background"},
                 {"name": "Recap", "hue": "--ink"}]
tour = [
    {"ch": 0, "level": 0, "title": "A URL shortener, as built",
     "body": ["Kutt turns long URLs into short ones and counts the clicks. It is the classic system design question, answered by real, running code.",
              "From outside it is one system: visitors open links, owners create them, and Kutt leans on target sites, an SMTP server and optionally an SSO provider."],
     "why": "The interview answer and the real code differ in instructive places: here, one container does almost everything."},
    {"ch": 1, "flow": "follow", "hops": [0, 6], "title": "One click, answered fast",
     "body": ["Follow a click from the browser to the redirect."],
     "why": "The redirect is read-heavy and latency-sensitive, so it reads from cache and defers all writes."},
    {"ch": 1, "flow": "follow", "hops": [6, 9], "title": "Stats happen after the redirect",
     "body": ["The visit is recorded by a background worker, not by the request."],
     "why": "A slow GeoIP lookup or database write can never delay a click."},
    {"ch": 2, "flow": "create", "title": "Creating a link",
     "body": ["The write path: page, API, auth, link rules, database."],
     "why": "Every write goes through one API, whether from the web page or a script."},
    {"ch": 3, "flow": "expire", "title": "Housekeeping inside the server",
     "body": ["There is no separate scheduler: a timer in the web process deletes expired links."],
     "why": "Simple to deploy, but with several instances only one should run it (<code>NODE_APP_INSTANCE=0</code>)."},
    {"ch": 4, "whole": True, "title": "The whole shortener, on one map",
     "recap": {"people": "Visitors click, owners create and manage.",
               "redirect": "One handler answers every click with a 302.",
               "outside": "Targets, SMTP and SSO live outside.",
               "manage": "Pages and scripts share one API.",
               "data": "SQL is the truth; Redis caches and queues.",
               "background": "Stats, expiry and email run off the request path."},
     "body": ["One Node container, one database and an optional Redis.",
              "The interesting design lives inside the container: a cached read path and an asynchronous write path for stats."]},
]

# Files view: the paths a reader needs, each tied to the components it implements.
FILES = {"entries": [
    {"path": "server/", "t": "The whole Node.js app: one Express server holds every component on the map; with Redis, Bull runs the visit workers in child processes.", "open": True},
    {"path": "server/server.js", "t": "Starts Express, mounts the routes and registers the redirect last, as the catch-all.", "why": "Route order is the design here: the redirect must come after every page and API route, or <code>/login</code> would be read as a short link.", "tag": "entry point", "nodes": ["redirect", "web"]},
    {"path": "server/routes/", "t": "URL to handler wiring for the REST API and the pages.", "nodes": ["api", "web"]},
    {"path": "server/routes/renders.routes.js", "t": "Page routes: Handlebars views and the htmx fragments they swap in.", "nodes": ["web"]},
    {"path": "server/routes/link.routes.js", "t": "Mounted at <code>/api/links</code> and <code>/api/v2/links</code>: create, edit, delete, stats, reports, the password form and admin bans.", "nodes": ["api"]},
    {"path": "server/handlers/", "t": "Request logic. Routes stay thin; the decisions live here.", "open": True},
    {"path": "server/handlers/links.handler.js", "t": "Create a link and serve a redirect: the hot path of the system.", "why": "Every click lands here. It reads through the cache and hands the visit off without awaiting it, so a redirect never waits on a database write. <code>redirectProtected()</code> checks a submitted link password the same way.", "nodes": ["links", "redirect"]},
    {"path": "server/handlers/auth.handler.js", "t": "Login, signup, API keys and the checks every protected route runs.", "nodes": ["auth"]},
    {"path": "server/handlers/validators.handler.js", "t": "express-validator rules for every input: URLs, aliases, passwords."},
    {"path": "server/passport.js", "t": "Passport strategies: local, JWT, API key and OIDC.", "why": "One place decides who a request belongs to, so the pages, the API and scripts share the same rules.", "nodes": ["auth", "oidc"]},
    {"path": "server/queries/", "t": "The only code that talks to the database, with the Redis cache in front of reads.", "why": "Keeping SQL and cache invalidation together means a write can never forget to clear the cached copy.", "nodes": ["queries"]},
    {"path": "server/queries/link.queries.js", "t": "Find, create and batch-remove links; caches each link for 15 minutes by its address and domain id.", "nodes": ["queries"]},
    {"path": "server/models/", "t": "Table definitions; the first two migrations call them to create the schema.", "nodes": ["db"]},
    {"path": "server/migrations/", "t": "Knex migrations: the schema's history since 2020. The Docker image runs <code>npm run migrate</code> before <code>npm start</code> on every boot.", "nodes": ["db"], "more": "10 migrations, one per schema change"},
    {"path": "server/queues/visit.js", "t": "Bull worker that turns a raw click into visit stats, off the request path.", "why": "Stats are kept as one row per link per hour; updating them inline would make every redirect slower.", "nodes": ["visitq"]},
    {"path": "server/cron.js", "t": "Every 30 seconds, deletes links whose expiry has passed.", "why": "A plain <code>setInterval</code> instead of a job scheduler: one process, nothing extra to deploy.", "nodes": ["cron"]},
    {"path": "server/mail/", "t": "nodemailer setup and the verify, reset and change-email templates.", "nodes": ["mail", "smtp"]},
    {"path": "server/redis.js", "t": "The ioredis client, the cache key patterns and their invalidation.", "nodes": ["redis"]},
    {"path": "server/views/", "t": "Handlebars templates for every page and htmx partial.", "nodes": ["web"]},
    {"path": "server/env.js", "t": "Reads and validates every environment variable at start-up.", "why": "A missing or invalid value (<code>JWT_SECRET</code> is required) fails at boot with a clear message; a misspelled name is ignored and the default applies.", "tag": "config"},
    {"path": "static/", "t": "Browser assets served as they are: CSS, and htmx, Chart.js and a QR code library in <code>static/libs</code>."},
    {"path": "custom/", "t": "Empty hook for self-hosters: their own CSS, images and views override the defaults.", "why": "Lets a company brand its instance without forking the code."},
    {"path": "docs/api/", "t": "Generates the OpenAPI spec and a Redoc page for the REST API."},
    {"path": "docker-compose.yml", "t": "One container: the server, with SQLite on a volume. The sqlite-redis compose file adds Redis and keeps SQLite; the postgres and mariadb files add Redis and that database server.", "why": "The fastest way to see the deployment: pick the compose file for the database you want.", "tag": "deploy", "nodes": ["db", "redis"]},
    {"path": "knexfile.js", "t": "Database connection for migrations: Postgres, MariaDB/MySQL or SQLite.", "tag": "config", "nodes": ["db"]},
    {"path": ".example.env", "t": "The main settings with example values; copy to <code>.env</code> to run.", "tag": "config"},
    {"path": "package.json", "t": "Scripts and dependencies: Express, Knex, Bull, Passport, Handlebars.", "tag": "deploy"},
]}

d = {
    "id": "kutt-url-shortener",
    "page": {"title": "Kutt: a URL shortener, mapped",
             "slots": {
                 "overviewDescription": "Kutt in context: who uses it, what it is made of and which outside services it needs.",
                 "mapDescription": "Containers and the components inside the Kutt server, with the paths a click and a new link take.",
                 "completionLessons": "<li>Why the redirect reads from cache and defers writes</li><li>How one API serves pages and scripts</li><li>What runs in the background</li>",
                 "completionIntro": "You followed a click and a new link through Kutt."}},
    "panels": {
        "introHtml": "<div class=\"p-eyebrow\">Start here</div><h2>Kutt, the URL shortener</h2><p style=\"margin-top:8px\">A map of <a href=\"https://github.com/thedevs-network/kutt\">thedevs-network/kutt</a> v3.2.6 in C4 terms: context on the overview, containers and components on the full map.</p><p><small>Kutt is made by The Devs Network and contributors (© 2020 Kutt) and released under the <a href=\"https://github.com/thedevs-network/kutt/blob/029da42b2459693681886665589fd9512d6b473c/LICENSE\">MIT licence</a>. This map describes it in its own words and is not affiliated with its authors.</small></p><h3>Try it</h3><ul class=\"newlist\"><li>Open a card to see its part of the system.</li><li>Play <b>Open a short link</b> to follow a click.</li><li>Click a component for what it does and where it lives in the code.</li></ul><div class=\"panel-actions\"><button type=\"button\" class=\"panel-action\" id=\"gofull\">Open full map</button></div>",
        "overviewHtml": "<div class=\"p-eyebrow\">The full map</div><h2>One container does almost everything</h2><p style=\"margin-top:8px\">Up to three containers: the Node server, a SQL database and Redis. The default compose file runs only the server, with SQLite. The server zone is opened up into its components.</p><h3>How to read it</h3><p>People and outside services on the left, the server in the middle, data on the right.</p>"},
    # Interface strings: render.py fills in the rest from scripts/defaults.py.
    "ui": {"buildNote": "The steps build the shortener up from the bare redirect: one sensible order, not the project's history."},
    "groups": groups, "overview": overview,
    "overviewEdges": [{"id": i, "from": f, "to": t, "label": l} for i, f, t, l, *_ in oedges],
    "nodes": nodes,
    "zones": [{"id": "outside", "label": "Outside · people and services", "hue": "external"},
              {"id": "server", "label": "Kutt server · Node.js container", "hue": "component"},
              {"id": "data", "label": "Data · containers", "hue": "store"},
              {"id": "outside-mail", "label": "Outside · email", "hue": "external"}],
    "edges": E, "flows": flows, "buildSteps": build,
    "tourChapters": tour_chapters, "tour": tour,
    "insides": INSIDES,
    "files": FILES,
    "source": {"repo": "https://github.com/thedevs-network/kutt", "ref": "029da42b2459693681886665589fd9512d6b473c"},
    "layout": {
        "viewBoxes": {"map": [1510, 740], "map0": [1230, 580]},
        "overviewCard": {"width": 270, "height": 200},
        "nodes": pos, "edges": LE,
        "zones": {"outside": {"x": 30, "y": 60, "w": 250, "h": 650},
                  "server": {"x": 310, "y": 60, "w": 870, "h": 650},
                  "data": {"x": 1210, "y": 60, "w": 270, "h": 330},
                  "outside-mail": {"x": 1210, "y": 600, "w": 270, "h": 110}},
        "overview": {g: {"x": x, "y": y} for g, (x, y) in OP.items()},
        "overviewEdges": {i: {"d": dd, "x": x, "y": y, "anchor": a} for i, f, t, l, dd, x, y, a in oedges}},
}
SHAPE = {"visitor": "person", "user": "person", "target": "external", "oidc": "external", "smtp": "external",
         "visitq": "worker", "db": "database", "redis": "queue"}
LOGO = {
        "oidc": "openid", "redis": "redis", "db": "postgresql"}
for n in nodes:
    if n["id"] in LOGO:
        n["logo"] = LOGO[n["id"]]
for n in nodes:
    if n["id"] in INSIDES:
        n["inside"] = n["id"]
if "--plain" not in __import__("sys").argv:
    for n in nodes:
        if n["id"] in SHAPE:
            n["shape"] = SHAPE[n["id"]]
print(json.dumps(d, ensure_ascii=False, indent=1))
