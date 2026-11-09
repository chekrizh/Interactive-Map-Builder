"""Generate the Kutt (URL shortener) map definition as a first C4-style repo map.

Run: python3 evals/maps/build_kutt.py > evals/maps/kutt.json
"""
import json

W, H = 210, 58
C = {1: 340, 2: 630, 3: 920, 4: 1240, 0: 50}
R = {1: 130, 2: 300, 3: 470, 4: 640}


def at(c, r):
    return {"x": C[c], "y": R[r], "w": W, "h": H}


def node(id, group, cat, week, icon, tool, concept, what, why, tools, zone):
    return dict(id=id, group=group, cat=cat, week=week, icon=icon, tool=concept, concept=tool,
                what=what, why=why, tools=tools, zone=zone)


nodes = [
    node("visitor", "people", "person", 1, "person", "Visitor", "Person",
         "Anyone who clicks a short link such as <code>kutt.it/abc</code>. Never signs in.",
         "Most traffic is visitors, so the redirect path is the one that has to be fast and must never break.",
         "Any browser or HTTP client.", "outside"),
    node("target", "outside", "external", 1, "globe", "Target website", "External",
         "The original long URL a short link points to.",
         "Kutt never proxies the page. It answers with a 302 and the browser goes there on its own.",
         "Whatever site the link owner chose.", "outside"),
    node("user", "people", "person", 2, "person", "Link owner", "Person",
         "Signs up, shortens URLs, sets custom addresses, passwords and expiry, reads click stats. Admins are the same users with an admin role: they ban links, domains and users.",
         "Owners are the only ones who write data. Everything they do goes through the API.",
         "Browser (server-rendered pages with htmx) or any script with an API key.", "outside"),
    node("oidc", "outside", "external", 3, "key", "OIDC provider", "External · optional",
         "An OpenID Connect identity provider, used for single sign-on when <code>OIDC_ENABLED</code> is set.",
         "Lets a company plug Kutt into its existing login instead of passwords.",
         "Any OpenID Connect provider · <code>openid-client</code>", "outside"),
    node("redirect", "redirect", "app", 1, "bolt", "Redirect handler", "Component · Express",
         "Looks up the domain and the short address, checks bans and passwords, queues a visit and answers with a redirect to the target.",
         "This is the product. Every other part exists to create the links this handler serves.",
         "Express route registered last in <code>server/server.js</code> · <code>links.handler.js → redirect()</code>", "server"),
    node("web", "manage", "app", 2, "window", "Web pages", "Component · Handlebars, htmx",
         "Renders the home page, the links table, settings and the admin panel from Handlebars templates. Buttons and forms call the API through htmx.",
         "No separate frontend app: the server is the UI, which keeps deployment to one container.",
         "Handlebars (<code>server/views</code>) · htmx · <code>routes/renders.routes.js</code>", "server"),
    node("api", "manage", "app", 2, "api", "REST API", "Component · Express",
         "Routes for links, domains, users, auth and health. Validates input and applies rate limits before calling the handlers.",
         "The same API serves the web pages and external scripts, so there is one path for every write.",
         "Express routers in <code>server/routes</code> · express-validator · express-rate-limit", "server"),
    node("links", "manage", "app", 2, "link", "Link logic", "Component · Node.js",
         "Creates links: reuses an existing one if asked, checks custom addresses, bans on the target host, generates a random id, then saves. Also edits, deletes and bans.",
         "All link rules live here, so the redirect handler can stay small and fast.",
         "<code>server/handlers/links.handler.js</code> · nanoid", "server"),
    node("auth", "manage", "app", 3, "lock", "Auth", "Component · Passport",
         "Signup, login, email verification, password reset and API keys. Turns a JWT cookie, an API key or an OIDC session into <code>req.user</code>.",
         "Every write needs an owner, and stats are private to that owner.",
         "Passport (local, JWT, API key, OIDC) · bcrypt · <code>server/passport.js</code>, <code>auth.handler.js</code>", "server"),
    node("queries", "data", "app", 1, "layers", "Data access + cache", "Component · Knex",
         "One module per table. Reads check Redis first and keep links, domains, hosts and users there for 15 minutes; writes go to the database and clear the cached copy.",
         "The cache is what keeps redirects cheap. Without Redis the same code just goes straight to the database.",
         "Knex (<code>server/queries</code>, <code>server/knex.js</code>) · ioredis", "server"),
    node("visitq", "background", "async", 4, "inbox", "Visit processor", "Component · Bull worker",
         "Takes queued visits, works out browser, OS, referrer and country, increments the link's counter and stores the visit.",
         "Stats work is moved out of the redirect so a click is answered before any of it happens.",
         "Bull queue <code>visit</code>, 6 sandboxed workers · <code>server/queues/visit.js</code> · geoip-lite, express-useragent", "server"),
    node("cron", "background", "async", 3, "clock", "Expiry job", "Component · setInterval",
         "Every 30 seconds deletes links whose expiry time has passed.",
         "Runs inside the web process, only on instance 0, so a cluster does not delete twice.",
         "<code>setInterval</code> in <code>server/cron.js</code>", "server"),
    node("mail", "background", "async", 3, "mail", "Mailer", "Component · nodemailer",
         "Sends verification, password reset and change-of-email messages from HTML templates.",
         "Accounts are confirmed by email before they can create links (when verification is on).",
         "nodemailer · <code>server/mail</code>", "server"),
    node("redis", "data", "store", 4, "bolt-db", "Redis", "Container · optional",
         "Cache for hot lookups, the rate-limit counters and the visit queue.",
         "Optional: with <code>REDIS_ENABLED=false</code> the cache is skipped and visits are processed inline.",
         "redis:alpine in docker-compose · ioredis · Bull", "data"),
    node("db", "data", "store", 1, "db", "Database", "Container · SQL",
         "Tables for links, visits, users, domains, hosts and IPs. Migrations live in the repo.",
         "The single source of truth. Redis only holds copies.",
         "Postgres, MariaDB/MySQL or SQLite via Knex · <code>server/migrations</code>", "data"),
    node("smtp", "outside", "external", 3, "send", "Mail server", "External",
         "The SMTP server that actually delivers Kutt's emails.",
         "Kutt does not send mail itself; without SMTP settings, signup verification cannot work.",
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
    ("qu_rd", "queries", "redis", "cache, 15 min", f"M1100,{R[2]} L1100,225 L1320,225 L1320,{R[1]+H}", {"bidir": True}),
    ("qu_db", "queries", "db", "SQL via Knex", f"M1130,{cy(2)} L1240,{cy(2)}", {}),
    ("cr_qu", "cron", "queries", "delete expired", f"M840,{cy(2)} L920,{cy(2)}", {}),
    ("us_we", "user", "web", "uses", f"M260,{cy(3)} L340,{cy(3)}", {}),
    ("us_ap", "user", "api", "API key", f"M155,{R[3]+H} L155,575 L700,575 L700,{R[3]+H}", {}),
    ("we_ap", "web", "api", "htmx", f"M550,{cy(3)} L630,{cy(3)}", {}),
    ("ap_li", "api", "links", "", f"M840,{cy(3)} L920,{cy(3)}", {}),
    ("li_qu", "links", "queries", "read / write links", f"M1060,{R[3]} L1060,{R[2]+H}", {}),
    ("ap_au", "api", "auth", "authenticate", f"M770,{R[3]+H} L770,{R[4]}", {}),
    ("au_qu", "auth", "queries", "users", f"M840,{R[4]+12} L880,{R[4]+12} L880,410 L960,410 L960,{R[2]+H}", {}),
    ("au_oi", "auth", "oidc", "OpenID Connect", f"M630,{cy(4)} L260,{cy(4)}", {}),
    ("au_ma", "auth", "mail", "send email", f"M840,{cy(4)+10} L920,{cy(4)+10}", {}),
    ("ma_sm", "mail", "smtp", "SMTP", f"M1130,{cy(4)} L1240,{cy(4)}", {}),
]

E = [{"id": i, "from": f, "to": t, "label": l, **({"bidir": True} if x.get("bidir") else {})} for i, f, t, l, _, x in edges]
LE = {i: {"d": d, **{k: v for k, v in x.items() if k != "bidir"}} for i, f, t, l, d, x in edges}

flows = {
    "follow": {
        "title": "Open a short link", "hue": "app",
        "desc": "A visitor clicks kutt.it/abc and lands on the target site. Stats are written afterwards, in the background.",
        "hops": [
            {"e": "vi_re", "t": "The browser asks for <code>/abc</code>. Express tries every page and API route first; only then the catch-all <code>/:id</code> runs."},
            {"e": "re_qu", "t": "If the host is a custom domain, the handler loads that domain, then the link by address and domain."},
            {"e": "qu_rd", "t": "Both lookups check Redis first. A hot link is answered from the cache without touching the database."},
            {"e": "qu_db", "t": "On a miss the link is read from the database and put into Redis for 15 minutes."},
            {"e": "re_rd", "t": "The link is not banned and has no password, and the visitor is not a bot, so a visit job is added to the Bull queue. Nothing waits for it."},
            {"e": "re_ta", "t": "The handler answers 302 with the target URL. The browser leaves Kutt."},
            {"e": "rd_vq", "t": "Later, one of six workers picks up the job."},
            {"e": "vq_qu", "t": "It parses the user agent, looks up the country from the IP, increments the link's counter and stores the visit."},
            {"e": "qu_db", "t": "The visit row lands in the database, ready for the stats page."},
        ],
    },
    "create": {
        "title": "Shorten a URL", "hue": "person",
        "desc": "An owner pastes a long URL and gets a short one back.",
        "hops": [
            {"e": "us_we", "t": "The owner pastes a URL into the form on the home page."},
            {"e": "we_ap", "t": "htmx posts the form to <code>POST /api/v2/links</code>."},
            {"e": "ap_au", "t": "Passport identifies the caller from the JWT cookie or API key. Anonymous links can be allowed by config."},
            {"e": "ap_li", "t": "Validators check the URL, custom address and expiry; then the link handler runs."},
            {"e": "li_qu", "t": "In parallel it checks whether the custom address is taken, whether the target host is banned, and generates a free random id."},
            {"e": "qu_db", "t": "The new link is inserted."},
            {"e": "we_ap", "rev": True, "t": "The API renders the short-link card back into the page and tells the links table to reload."},
        ],
    },
    "signup": {
        "title": "Sign up", "hue": "external",
        "desc": "A new owner creates an account and confirms the email.",
        "hops": [
            {"e": "us_ap", "t": "The signup form posts email and password to the auth API."},
            {"e": "ap_au", "t": "The auth handler hashes the password with bcrypt."},
            {"e": "au_qu", "t": "It creates an unverified user with a verification token."},
            {"e": "qu_db", "t": "The user row is saved."},
            {"e": "au_ma", "t": "It asks the mailer for the verification email."},
            {"e": "ma_sm", "t": "The mailer hands the message to the SMTP server. The owner clicks the link to activate the account."},
        ],
    },
    "expire": {
        "title": "Expire old links", "hue": "async",
        "desc": "A timer inside the server removes links whose time is up.",
        "hops": [
            {"e": "cr_qu", "t": "Every 30 seconds the expiry job asks for links with <code>expire_in</code> in the past."},
            {"e": "qu_db", "t": "They are deleted in one batch; cached copies are removed from Redis."},
        ],
    },
}

groups = {
    "people": {"title": "People", "huekey": "person", "icon": "person", "line1": "Visitors open links.",
               "line2": "Owners create and manage them.", "chips": "Browser · API key",
               "text": "Two kinds of people use Kutt. Visitors only follow links. Owners sign in, create links and read stats; admins are owners with extra rights.",
               "members": ["visitor", "user"]},
    "redirect": {"title": "Serve the redirect", "huekey": "app", "icon": "bolt", "line1": "Turn /abc into a 302",
                 "line2": "as fast as possible.", "chips": "Express · GET /:id",
                 "text": "One handler answers every click: find the link, check it, queue a visit and redirect. It is the hot path of the system.",
                 "members": ["redirect"]},
    "outside": {"title": "Outside services", "huekey": "external", "icon": "globe", "line1": "Where visitors land,",
                "line2": "who sends mail and who logs in.", "chips": "Target sites · SMTP · OIDC",
                "text": "Systems Kutt depends on but does not run: the target websites, an SMTP server for email and, optionally, an OpenID Connect provider.",
                "members": ["target", "smtp", "oidc"]},
    "manage": {"title": "Create and manage", "huekey": "person", "icon": "window", "line1": "Pages, API and auth",
               "line2": "for everything owners do.", "chips": "Handlebars · htmx · Passport",
               "text": "Server-rendered pages, one REST API used by both the pages and scripts, the link rules and authentication.",
               "members": ["web", "api", "links", "auth"]},
    "data": {"title": "Remember it", "huekey": "store", "icon": "db", "line1": "A database for truth,",
             "line2": "Redis for speed.", "chips": "Knex · Postgres / MariaDB / SQLite · Redis",
             "text": "A queries layer in front of a SQL database, with Redis as an optional cache and queue.",
             "members": ["queries", "redis", "db"]},
    "background": {"title": "Work in the background", "huekey": "async", "icon": "clock", "line1": "Stats, expiry and email,",
                   "line2": "off the request path.", "chips": "Bull · setInterval · nodemailer",
                   "text": "Jobs that should not slow a click down: recording visits, deleting expired links and sending email.",
                   "members": ["visitq", "cron", "mail"]},
}
for g in groups.values():
    pass

overview = [{"g": g} for g in ["people", "redirect", "outside", "manage", "data", "background"]]
OP = {"people": (60, 40), "redirect": (400, 40), "outside": (740, 40),
      "manage": (60, 380), "data": (400, 380), "background": (740, 380)}
oedges = [
    ("o1", "people", "redirect", "open links", "M336,160 L395,160", 365, 147, "middle"),
    ("o2", "redirect", "outside", "302", "M676,160 L735,160", 705, 147, "middle"),
    ("o3", "people", "manage", "create links", "M195,286 L195,375", 209, 335, "start"),
    ("o4", "redirect", "data", "find link", "M535,286 L535,375", 549, 335, "start"),
    ("o5", "manage", "data", "read / write", "M336,500 L395,500", 365, 487, "middle"),
    ("o6", "background", "data", "visits", "M735,500 L676,500", 705, 487, "middle"),
    ("o7", "background", "outside", "email", "M875,375 L875,286", 889, 335, "start"),
]

roles = {
    "person": {"label": "Person", "light": "#3f6fd8", "dark": "#93b4ff", "fillLight": "#edf2ff", "fillDark": "#24304b"},
    "app": {"label": "Kutt component", "light": "#1f8a7a", "dark": "#72d3c2", "fillLight": "#e7f5f2", "fillDark": "#1f3b38"},
    "async": {"label": "Background work", "light": "#b7791f", "dark": "#f0c06a", "fillLight": "#fbf3e4", "fillDark": "#3d3222"},
    "store": {"label": "Data store", "light": "#7a55c7", "dark": "#c3a8ff", "fillLight": "#f2edfb", "fillDark": "#33294a"},
    "external": {"label": "External system", "light": "#6b7280", "dark": "#b4bac4", "fillLight": "#f1f2f4", "fillDark": "#2d3036"},
}

icons = {
    "person": '<circle cx="10" cy="6.5" r="3.2"/><path d="M3.5 18a6.5 6.5 0 0 1 13 0"/>',
    "globe": '<circle cx="10" cy="10" r="7.5"/><path d="M2.5 10h15M10 2.5c2.2 2.4 2.2 12.6 0 15M10 2.5c-2.2 2.4-2.2 12.6 0 15"/>',
    "key": '<circle cx="6.5" cy="13.5" r="3.5"/><path d="M9 11 17 3m-3 3 2.5 2.5"/>',
    "bolt": '<path d="M11 2 4 11.5h5.5L8.5 18 16 8.5h-5.5z"/>',
    "window": '<rect x="2.5" y="3.5" width="15" height="13" rx="2"/><path d="M2.5 7.5h15"/>',
    "api": '<path d="M7 5 2.5 10 7 15M13 5l4.5 5-4.5 5"/>',
    "link": '<path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1"/><path d="M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1"/>',
    "lock": '<rect x="4" y="9" width="12" height="8.5" rx="1.5"/><path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9"/>',
    "layers": '<path d="M10 2.5 2.5 6.5 10 10.5l7.5-4z"/><path d="m2.5 10 7.5 4 7.5-4M2.5 13.5l7.5 4 7.5-4"/>',
    "inbox": '<path d="M2.5 11.5 5 4h10l2.5 7.5V16H2.5z"/><path d="M2.5 11.5h4.5a3 3 0 0 0 6 0h4.5"/>',
    "clock": '<circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10l3 2"/>',
    "mail": '<rect x="2.5" y="4.5" width="15" height="11" rx="1.5"/><path d="m3 5.5 7 5.5 7-5.5"/>',
    "bolt-db": '<ellipse cx="10" cy="5" rx="6.5" ry="2.5"/><path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5"/><path d="m11 8.5-2.5 3.5h3L9 15.5"/>',
    "db": '<ellipse cx="10" cy="5" rx="6.5" ry="2.5"/><path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5"/>',
    "send": '<path d="M17.5 2.5 9 11M17.5 2.5 12 17.5 9 11 2.5 8z"/>',
}

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

tour_chapters = [{"name": "Context", "hue": "--ink"}, {"name": "A click", "hue": "--h-app"},
                 {"name": "A new link", "hue": "--h-person"}, {"name": "Background", "hue": "--h-async"},
                 {"name": "Recap", "hue": "--ink"}]
tour = [
    {"ch": 0, "level": 0, "title": "A URL shortener, as built",
     "body": ["Kutt turns long URLs into short ones and counts the clicks. It is the classic system design question, answered by real, running code.",
              "From outside it is one system: visitors open links, owners create them, and Kutt leans on target sites, an SMTP server and optionally an SSO provider."],
     "why": "The interview answer and the real code differ in instructive places: here, one container does almost everything."},
    {"ch": 1, "flow": "follow", "hops": [0, 6], "title": "One click, answered fast",
     "body": ["Follow a click from the browser to the redirect."],
     "why": "The redirect is read-heavy and latency-sensitive, so it reads from cache and defers all writes.",
     "moments": [{"hops": [1, 2], "text": "The catch-all route finds the domain and the link."},
                 {"hops": [3, 4], "text": "Redis answers hot links; the database only on a miss."},
                 {"hops": [5, 6], "text": "A visit job is queued and the browser is sent away with a 302."}]},
    {"ch": 1, "flow": "follow", "hops": [6, 9], "title": "Stats happen after the redirect",
     "body": ["The visit is recorded by a background worker, not by the request."],
     "why": "A slow GeoIP lookup or database write can never delay a click.",
     "moments": [{"hops": [7], "text": "A worker takes the job from the queue."},
                 {"hops": [8, 9], "text": "It enriches the visit and stores it."}]},
    {"ch": 2, "flow": "create", "title": "Creating a link",
     "body": ["The write path: page, API, auth, link rules, database."],
     "why": "Every write goes through one API, whether from the web page or a script.",
     "moments": [{"hops": [1, 2], "text": "The form posts to the API through htmx."},
                 {"hops": [3, 4], "text": "The caller is identified and the input validated."},
                 {"hops": [5, 6], "text": "The address is checked, an id generated, the link saved."},
                 {"hops": [7], "text": "The page updates in place."}]},
    {"ch": 3, "flow": "expire", "title": "Housekeeping inside the server",
     "body": ["There is no separate scheduler: a timer in the web process deletes expired links."],
     "why": "Simple to deploy, but with several instances only instance 0 may run it."},
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

d = {
    "id": "kutt-url-shortener",
    "page": {"title": "Kutt: a URL shortener, mapped",
             "slots": {
                 "overviewDescription": "Kutt in context: who uses it, what it is made of and which outside services it needs.",
                 "mapDescription": "Containers and the components inside the Kutt server, with the paths a click and a new link take.",
                 "completionLessons": "<li>Why the redirect reads from cache and defers writes</li><li>How one API serves pages and scripts</li><li>What runs in the background</li>",
                 "tourEntry": "Take the guided tour · 4 min",
                 "completionIntro": "You followed a click and a new link through Kutt."}},
    "panels": {
        "introHtml": "<div class=\"p-eyebrow\">Start here</div><h2>Kutt, the URL shortener</h2><p style=\"margin-top:8px\">A map of <a href=\"https://github.com/thedevs-network/kutt\">thedevs-network/kutt</a> v3.2.6 in C4 terms: context on the overview, containers and components on the full map.</p><h3>Try it</h3><ul class=\"newlist\"><li>Open a card to see its part of the system.</li><li>Play <b>Open a short link</b> to follow a click.</li><li>Click a component for what it does and where it lives in the code.</li></ul><div class=\"panel-actions\"><button type=\"button\" class=\"panel-action\" id=\"gofull\">Open full map</button></div>",
        "overviewHtml": "<div class=\"p-eyebrow\">The full map</div><h2>One container does almost everything</h2><p style=\"margin-top:8px\">docker-compose runs three containers: the Node server, a SQL database and Redis. The server zone is opened up into its components.</p><h3>How to read it</h3><p>People and outside services on the left, the server in the middle, data on the right.</p>",
        "stageEyebrow": "Part", "stageMembers": "Components in this part",
        "stageNote": "Flows follow the connections between these components.",
        "decision": "Design choice", "repository": "In the code", "course": "Note",
        "what": "What it does", "why": "Why it matters", "tools": "Technology and files",
        "newNodes": "Components added", "runnable": "Try it",
        "pinnedNote": "This view shows the system at this step.",
        "buildNote": "The steps build the shortener up from the bare redirect.",
        "fileSuffix": " · File", "nodeBuildLabel": "Build step {step} of {total}",
        "nodeCourseLabel": "Step {step}", "buildLabel": "Build order · Step {step} of {total}",
        "courseLabel": "Kutt · Step {step}", "buildRole": "app"},
    "ui": {"fullSystem": "Full system", "pinnedTitle": "Step {step}: {title}",
           "tourEntry": "Take the guided tour · 4 min",
           "flowComplete": "Flow complete. Choose another flow or open a component."},
    "groups": groups, "overview": overview,
    "overviewEdges": [{"id": i, "from": f, "to": t, "label": l} for i, f, t, l, *_ in oedges],
    "nodes": nodes,
    "zones": [{"id": "outside", "label": "Outside · people and services", "hue": "external"},
              {"id": "server", "label": "Kutt server · Node.js container", "hue": "app"},
              {"id": "data", "label": "Data · containers", "hue": "store"},
              {"id": "outside-mail", "label": "Outside · email", "hue": "external"}],
    "edges": E, "flows": flows, "buildSteps": build,
    "tourChapters": tour_chapters, "tour": tour,
    "beatSeconds": 15, "flowBeatSeconds": 15, "insides": {}, "insideMarkers": "",
    "roles": roles, "icons": icons, "logos": {},
    "settings": {"embedded": True, "zoomable": True, "linkTarget": "_top",
                 "recapOrder": ["people", "redirect", "outside", "manage", "data", "background"],
                 "pinnedFlowFraction": 0.5,
                 "appearanceRoles": {"accent": "app", "artifact": "store", "error": "external"}},
    "links": {"projectStructure": "https://github.com/thedevs-network/kutt"},
    "layout": {
        "viewBoxes": {"map": [1510, 740], "map0": [1070, 680]},
        "overviewCard": {"width": 270, "height": 240}, "scale": {"x": 1, "y": 1},
        "nodes": pos, "edges": LE,
        "zones": {"outside": {"x": 30, "y": 60, "w": 250, "h": 650},
                  "server": {"x": 310, "y": 60, "w": 870, "h": 650},
                  "data": {"x": 1210, "y": 60, "w": 270, "h": 330},
                  "outside-mail": {"x": 1210, "y": 600, "w": 270, "h": 110}},
        "overview": {g: {"x": x, "y": y} for g, (x, y) in OP.items()},
        "overviewEdges": {i: {"d": dd, "x": x, "y": y, "anchor": a} for i, f, t, l, dd, x, y, a in oedges},
        "annotations": [], "insideMarkers": ""},
}
SHAPE = {"visitor": "person", "user": "person", "target": "external", "oidc": "external", "smtp": "external",
         "visitq": "worker", "db": "database", "redis": "queue"}
if "--plain" not in __import__("sys").argv:
    for n in nodes:
        if n["id"] in SHAPE:
            n["shape"] = SHAPE[n["id"]]
print(json.dumps(d, ensure_ascii=False, indent=1))
