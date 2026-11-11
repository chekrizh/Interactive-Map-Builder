"""Generate the PrivateBin (pastebin) map definition: a repo map written with no layout at all.

The second C4 example after Kutt, built to test the automatic layout on a repository it was
not tuned on. Every position on the map comes from render.py.

Run: python3 evals/maps/build_privatebin.py > plugins/interactive-map/skills/interactive-map/examples/privatebin-pastebin.json
"""
import json

REPO = "https://github.com/PrivateBin/PrivateBin"
REF = "8a6312e7e666e6b5129de260dbe195b2be21b58e"


def node(id, group, cat, step, icon, concept, tool, what, why, tools, zone, **extra):
    return dict(id=id, group=group, cat=cat, step=step, icon=icon, tool=tool, concept=concept,
                what=what, why=why, tools=tools, zone=zone, **extra)


nodes = [
    node("author", "people", "person", 1, "user", "Author", "Person",
         "Writes a paste, picks how long it lives, and gets back a link to share.",
         "The author is the only one who ever sees the key being made: it is created in their browser and goes into the link.",
         "Any modern browser", "outside", shape="person"),
    node("reader", "people", "person", 1, "user", "Reader", "Person",
         "Opens a shared link, reads the paste and, if the discussion is open, comments on it.",
         "Whoever holds the full link can read the paste. Without the part after <code>#</code> the server's copy is noise.",
         "Any modern browser", "outside", shape="person"),
    node("shortener", "outside", "external", 6, "link", "URL shortener", "External · optional",
         "A YOURLS, Shlink, Chhoto or other shortener that turns the long paste link into a short one. Either the server's proxy calls it, or, when <code>urlshortener</code> points straight at its API, the browser does.",
         "Paste links are long because they carry the key. A shortener makes them easy to share, at the price of handing the full link, key included, to that service.",
         "YOURLS, Shlink or Chhoto API, set in <code>cfg/conf.php</code>", "outside", shape="external"),

    node("ui", "browser", "component", 1, "app-window", "Page UI", "Component · privatebin.js",
         "The single page: editor, paste viewer, attachments and the discussion. It reads the key from the link and drives every step.",
         "All the product logic runs here, so the server can stay a dumb, blind store.",
         "<code>js/privatebin.js</code> (Editor, PasteViewer, DiscussionViewer, TopNav, Controller) · Bootstrap 5", "browser"),
    node("crypto", "browser", "component", 2, "key-round", "Crypto in the browser", "Component · WebCrypto",
         "Makes a random 256-bit key, compresses the text with zlib (unless the browser lacks WebAssembly or the server sets compression to none) and encrypts it with AES-256-GCM; a password, if set, is appended to the key before PBKDF2.",
         "This is the zero-knowledge promise: the server only ever receives ciphertext, so a breach or a subpoena yields nothing readable.",
         "<code>js/privatebin.js</code> CryptTool · WebCrypto API · zlib in WebAssembly", "browser", inside="crypto"),
    node("calls", "browser", "component", 1, "arrow-left-right", "Server calls", "Component · fetch",
         "Sends new pastes and comments and fetches a paste, all as JSON. Two things go around it: the shortener request is a separate fetch from the paste status that reads back HTML, and the delete link is a plain page load.",
         "One small layer decides what crosses the network, which makes it easy to check that the key never does.",
         "<code>js/privatebin.js</code> ServerInteraction, Model.getPasteData · PasteStatus.sendToShortener", "browser"),

    node("controller", "server", "component", 1, "route", "Controller", "Component · index.php",
         "Every request lands in <code>index.php</code>; the controller picks create, read, delete, a shortener call, the JSON-LD contexts or the page, and answers with JSON or HTML. The delete link (<code>?pasteid=…&amp;deletetoken=…</code>) is a plain page load: the controller compares the token with the paste's HMAC, deletes and shows the result on the page.",
         "One entry point and no router: the operation is read from the method and the query string, which keeps the PHP side tiny.",
         "<code>lib/Controller.php</code> · <code>lib/Request.php</code> · <code>lib/FormatV2.php</code>", "server", inside="controller"),
    node("view", "server", "component", 1, "layout-template", "Page template", "Component · PHP template",
         "Renders the one HTML page with the settings the client needs: expiry options, formats, feature switches and a strict CSP. The template is selectable; <code>bootstrap5</code> is the default.",
         "The page carries no paste data, only a status or error such as the result of a delete. It is the same for every paste; the client fetches the paste afterwards.",
         "<code>lib/View.php</code> · <code>lib/TemplateSwitcher.php</code> · <code>tpl/bootstrap5.php</code>", "server"),
    node("limiter", "server", "component", 4, "gauge", "Traffic limiter", "Component · per IP",
         "Lets one IP post once every 10 seconds by default, pastes and comments alike. Exempted IP ranges skip the limit, a creators list can restrict posting to listed ranges, and a limit of 0 turns it off.",
         "A public pastebin is an easy spam target. The IP is stored only as a keyed hash, so the limit works without keeping addresses.",
         "<code>lib/Persistence/TrafficLimiter.php</code> · <code>[traffic]</code> in the config", "server"),
    node("paste", "rules", "component", 1, "file-text", "Paste rules", "Component · Paste, Comment",
         "Checks the settings that travel in clear text, turns the expiry choice into a date, makes the ID and the delete token, and deletes a paste when it has expired or was read once. Comment rules check that the discussion is open and the parent exists, and give each poster an icon derived from an HMAC of their IP.",
         "Expiry and burn-after-reading are enforced here, on the server, because the server is the only party that can actually delete the data.",
         "<code>lib/Model/Paste.php</code> · <code>lib/Model/Comment.php</code> · <code>lib/Persistence/ServerSalt.php</code>", "server", inside="paste"),
    node("purge", "rules", "background", 3, "trash-2", "Purge", "Component · on new pastes",
         "Deletes up to 10 expired pastes, at most once every 5 minutes by default, while handling a new paste (not a comment).",
         "There is no cron job to set up. Expired pastes nobody opens again would otherwise stay on disk forever.",
         "<code>lib/Model.php</code> purge · <code>lib/Persistence/PurgeLimiter.php</code> · <code>[purge]</code> in the config", "server"),
    node("store", "storage", "component", 1, "plug", "Storage adapter", "Component · lib/Data",
         "One interface for pastes, comments and small values (server salt, limiter times); the config picks the backend.",
         "Hosting differs a lot between installs, so storage is a plug-in: a folder by default, a database or a bucket when you need one.",
         "<code>lib/Data/AbstractData.php</code> and one class per backend · <code>[model]</code> in the config", "server"),
    node("proxy", "server", "component", 6, "link-2", "Shortener proxy", "Component · optional",
         "Calls the configured URL shortener from the server and shows the short link.",
         "The shortener's API key stays on the server instead of being shipped to every browser.",
         "<code>lib/Proxy/</code> (YOURLS, Shlink, Chhoto) · <code>tpl/shortenerproxy.php</code>", "server"),

    node("files", "storage", "store", 1, "folder", "Files on disk", "Default · data/",
         "One <code>.php</code> file per paste under <code>data/ab/cd/</code>: JSON behind a first line that makes PHP answer 403. Comments go in a folder beside it.",
         "Works on any PHP host with no database at all, which is why it is the default.",
         "<code>lib/Data/Filesystem.php</code> · <code>data/</code>", "data", shape="database"),
    node("sql", "storage", "store", 5, "database", "SQL database", "PDO · SQLite, MySQL, Postgres and more",
         "Three tables: pastes, comments and a small key-value config table.",
         "For installs that already run a database or need several web servers to share the data.",
         "<code>lib/Data/Database.php</code> · any PDO driver", "data", shape="database", inside="sql"),
    node("cloud", "storage", "store", 5, "cloud", "Object storage", "S3 or Google Cloud",
         "Each paste as one object in a bucket; comments and config values are separate objects.",
         "For serverless or container hosting where the local disk does not last.",
         "<code>lib/Data/S3Storage.php</code> · <code>lib/Data/GoogleCloudStorage.php</code>", "data", shape="database"),
]


def edge(id, a, b, label="", **extra):
    return dict(id=id, **{"from": a, "to": b}, label=label, **extra)


edges = [
    edge("au_ui", "author", "ui", "write, pick expiry"),
    edge("re_ui", "reader", "ui", "open link with #key"),
    edge("ui_cr", "ui", "crypto", "encrypt, decrypt"),
    edge("ui_ca", "ui", "calls", "send, fetch"),
    edge("ca_co", "calls", "controller", "JSON over HTTP(S)"),
    edge("co_vi", "controller", "view", "render"),
    edge("vi_ui", "view", "ui", "HTML and JS"),
    edge("co_li", "controller", "limiter", "check IP"),
    edge("co_pu", "controller", "purge", "on each new paste"),
    edge("co_pa", "controller", "paste", "create, read, delete"),
    edge("co_px", "controller", "proxy", "shorten"),
    edge("px_sh", "proxy", "shortener", "HTTP API"),
    edge("li_st", "limiter", "store", "last post time"),
    edge("pa_st", "paste", "store", "ciphertext and meta"),
    edge("pu_st", "purge", "store", "delete expired"),
    edge("st_fi", "store", "files", "JSON files"),
    edge("st_sq", "store", "sql", "PDO"),
    edge("st_cl", "store", "cloud", "S3 or GCS API"),
]

zones = [
    {"id": "outside", "label": "Outside · people and services", "hue": "external"},
    {"id": "browser", "label": "Browser · JavaScript client", "hue": "component"},
    {"id": "server", "label": "PrivateBin server · PHP", "hue": "component"},
    {"id": "data", "label": "Storage · one backend, set in config", "hue": "store"},
]

groups = {
    "people": {"title": "People", "huekey": "person", "icon": "users",
               "line1": "Authors write pastes.", "line2": "Readers open the link.",
               "chips": "Browser · link with #key",
               "text": "Two roles, both anonymous: the author who creates a paste and anyone the link is shared with.",
               "members": ["author", "reader"]},
    "browser": {"title": "Encrypt in the browser", "huekey": "component", "icon": "key-round",
                "line1": "Key made and kept client-side.", "line2": "Only ciphertext leaves.",
                "chips": "privatebin.js · WebCrypto · zlib",
                "text": "The JavaScript client does the real work: it encrypts before sending and decrypts after fetching.",
                "members": ["ui", "crypto", "calls"]},
    "server": {"title": "Accept, never read", "huekey": "component", "icon": "server",
               "line1": "One PHP entry point.", "line2": "JSON in, JSON or a page out.",
               "chips": "index.php · Controller · CSP",
               "text": "A small PHP app that routes requests, limits abuse and serves the page. It never sees a key.",
               "members": ["controller", "view", "limiter", "proxy"]},
    "rules": {"title": "Expire and burn", "huekey": "background", "icon": "hourglass",
              "line1": "Expiry, burn after reading,", "line2": "delete tokens and cleanup.",
              "chips": "Paste · Comment · PurgeLimiter",
              "text": "The server enforces the only rules it can: how long a paste lives and who may delete it.",
              "members": ["paste", "purge"]},
    "storage": {"title": "Keep only ciphertext", "huekey": "store", "icon": "database",
                "line1": "Disk by default,", "line2": "a database or a bucket.",
                "chips": "Filesystem · PDO · S3 · GCS",
                "text": "Pluggable storage behind one interface; whatever the backend, it holds encrypted blobs.",
                "members": ["store", "files", "sql", "cloud"]},
    "outside": {"title": "Outside services", "huekey": "external", "icon": "globe",
                "line1": "An optional URL shortener", "line2": "for the long links.",
                "chips": "YOURLS · Shlink · Chhoto",
                "text": "The only outside system PrivateBin talks to, and only if configured.",
                "members": ["shortener"]},
}

overview = [{"g": g} for g in ("people", "browser", "server", "outside", "storage", "rules")]
overview_edges = [
    {"id": "o1", "from": "people", "to": "browser", "label": "write, open"},
    {"id": "o2", "from": "browser", "to": "server", "label": "ciphertext"},
    {"id": "o3", "from": "server", "to": "rules", "label": "create, read"},
    {"id": "o4", "from": "rules", "to": "storage", "label": "store blobs"},
    {"id": "o5", "from": "server", "to": "outside", "label": "shorten"},
]

c = lambda path, span: f"{path}:{span}"
JS = "js/privatebin.js"

flows = {
    "create": {
        "title": "Create a paste", "hue": "component",
        "desc": "An author writes a paste. The browser encrypts it, the server stores a blob it cannot read, and the key ends up only in the link.",
        "hops": [
            {"e": "au_ui", "t": "The author types the text, adds files if they like, picks an expiry, burn after reading or an open discussion, and maybe a password."},
            {"e": "ui_cr", "t": "A fresh random 256-bit key from <code>CryptTool.getSymmetricKey</code>. The text is compressed with zlib (or not at all without WebAssembly or when the server says none) and encrypted with AES-256-GCM; the key, with the password appended if there is one, is stretched with PBKDF2 (100,000 rounds). The settings ride along as authenticated data, so the server cannot change them unnoticed."},
            {"e": "ui_ca", "t": "The request body is <code>{v: 2, ct, adata, meta: {expire}}</code>: the ciphertext, plus <code>adata</code> holding the cipher parameters and the format, discussion and burn-after-reading flags in clear, and the expiry. No key, no plaintext."},
            {"e": "ca_co", "t": "A POST, so <code>Request</code> sets the operation to create. The first thing the controller does is ask the traffic limiter."},
            {"e": "co_li", "t": "The traffic limiter hashes the IP with the server salt and refuses a second post from it within 10 seconds (the default; exempted ranges skip it)."},
            {"e": "li_st", "t": "The last post time per IP hash is a small value in the same store as the pastes."},
            {"e": "co_pa", "t": "Only now does the controller apply the size limit (10 MiB by default) and check the envelope's format, then run the purge. Paste rules turn the expiry choice into a date, reject a discussion on a burn-after-reading paste, and name the paste by a 64-bit hash of the ciphertext."},
            {"e": "pa_st", "t": "The paste gets its own random salt as it is stored, and the storage adapter writes it through the configured backend."},
            {"e": "st_fi", "t": "With the default backend, one file: <code>data/ab/cd/abcd….php</code>, JSON behind a first line <code>&lt;?php http_response_code(403);</code>, so a request for the file gets a 403."},
            {"e": "ca_co", "rev": True, "t": "The answer: the paste ID, its URL and a delete token, an HMAC of the ID with that paste's salt."},
            {"e": "ui_ca", "rev": True, "t": "The browser builds <code>?id#key</code> with the key in base58 after the <code>#</code> (<code>#-</code> for burn after reading). Browsers never send the fragment to a server, so the key stays with whoever has the link."},
        ],
    },
    "read": {
        "title": "Open a paste", "hue": "person",
        "desc": "A reader opens the link. The page arrives first, then the ciphertext, and the browser decrypts it with the key from the fragment.",
        "hops": [
            {"e": "re_ui", "t": "The reader opens <code>https://host/?id#key</code>. The browser requests <code>/?id</code> only; the key stays in the address bar."},
            {"e": "vi_ui", "t": "The server answers with the same page as for any paste: template, scripts and settings, no paste data."},
            {"e": "ui_ca", "t": "The client reads the ID from the query string and asks for the paste as JSON."},
            {"e": "ca_co", "t": "A GET with a paste ID and the header <code>X-Requested-With: JSONHttpRequest</code>, which marks it as a JSON call: the read operation."},
            {"e": "co_pa", "t": "If the paste has expired it is deleted now and the reader gets the same error as for a paste that never existed. A burn-after-reading paste is deleted as it is handed out."},
            {"e": "pa_st", "t": "The stored blob, its comments and the remaining lifetime are loaded. The controller then strips the paste's salt from the answer."},
            {"e": "ca_co", "rev": True, "t": "Ciphertext, authenticated settings and the encrypted comments come back."},
            {"e": "ui_cr", "t": "The key from the fragment, decoded from base58, decrypts the paste. If that fails, the reader is asked for the password and it is tried again."},
            {"e": "ui_cr", "rev": True, "t": "The plaintext is shown with the chosen format: Markdown is rendered and cleaned with DOMPurify, syntax highlighting escapes the text first, and plain text is set as text."},
        ],
    },
    "purge": {
        "title": "Clean up expired pastes", "hue": "background",
        "desc": "There is no scheduler. Expired pastes are removed while new ones are created, and any expired paste is removed the moment someone asks for it.",
        "hops": [
            {"e": "ca_co", "t": "A new paste arrives. Cleanup piggybacks on this request, so a busy instance cleans up often and a quiet one rarely."},
            {"e": "co_pu", "t": "The purge limiter allows one round every 5 minutes by default (configurable, 0 disables the limit), remembered as a small value in the store."},
            {"e": "pu_st", "t": "The backend lists up to 10 expired pastes and deletes them with their comments. On disk it only samples some random pastes, so a round may find fewer."},
            {"e": "st_fi", "t": "On disk that means unlinking the paste file and its discussion folder."},
        ],
    },
    "shorten": {
        "title": "Shorten the link", "hue": "external",
        "desc": "The long link with its key is sent to an outside shortener. This flow shows the server proxy, which holds the API key; if the urlshortener setting points straight at a shortener's API instead, the browser sends the link there itself.",
        "hops": [
            {"e": "ui_ca", "t": "After creating a paste, the author clicks Shorten (or it happens on its own when configured). The client fetches the configured <code>urlshortener</code> URL with the full link appended; with the proxy that is <code>?shortenviayourls</code>, <code>?shortenviashlink</code> or <code>?shortenviachhoto</code> with <code>&amp;link=…</code>."},
            {"e": "ca_co", "t": "The controller sees a shortener operation and builds the proxy for the configured service."},
            {"e": "co_px", "t": "The proxy checks that the link points to this instance, so it cannot be used to shorten arbitrary URLs."},
            {"e": "px_sh", "t": "It calls the shortener's API with the server-side key.", "note": "The shortener receives the full link, key included. Anyone running it can read the paste."},
            {"e": "co_vi", "t": "The short link comes back on a small page; the client reads the URL out of it and shows it in the paste status. Only if that fetch fails is the page opened in a new tab."},
        ],
    },
}

build_steps = [
    None,
    {"title": "A pastebin", "text": "Store text under an ID and give it back: a page, a JSON API and files on disk.",
     "decision": "No framework and no router: <code>index.php</code> builds one controller that reads the operation from the request.",
     "runnable": "php -S localhost:8080",
     "nodes": ["author", "reader", "ui", "calls", "controller", "view", "paste", "store", "files"]},
    {"title": "Zero knowledge", "text": "Encrypt in the browser and put the key in the URL fragment.",
     "decision": "The key lives after <code>#</code>, which browsers never send, so the server stores ciphertext it cannot decrypt.",
     "nodes": ["crypto"]},
    {"title": "Pastes that disappear", "text": "Expiry dates, burn after reading and cleanup without a cron job.",
     "decision": "Purging rides on new pastes, rate-limited to once every 5 minutes, so there is nothing extra to deploy.",
     "nodes": ["purge"]},
    {"title": "Abuse limits", "text": "One paste per IP every few seconds.",
     "decision": "IPs are stored only as HMAC hashes with a server salt.",
     "nodes": ["limiter"]},
    {"title": "Other backends", "text": "SQL through PDO, S3 and Google Cloud Storage behind the same interface.",
     "decision": "Backends implement one abstract class, so the rest of the server does not know where data lives.",
     "nodes": ["sql", "cloud"]},
    {"title": "Short links", "text": "An optional proxy to YOURLS, Shlink or Chhoto.",
     "decision": "The call goes through the server so the shortener's API key is not exposed in the browser.",
     "nodes": ["proxy", "shortener"]},
]

tour_chapters = [
    {"name": "Context", "hue": "--ink"},
    {"name": "Writing", "hue": "--h-component"},
    {"name": "Reading", "hue": "--h-person"},
    {"name": "Housekeeping", "hue": "--h-background"},
    {"name": "Recap", "hue": "--ink"},
]

tour = [
    {"ch": 0, "level": 0, "title": "A pastebin the server cannot read",
     "body": ["PrivateBin answers the classic pastebin question with a twist: the server stores only ciphertext.",
              "People use it from a browser; the PHP server keeps encrypted blobs in a folder, a database or a bucket, and may call a URL shortener."],
     "why": "The interview version stores text and serves it back. Here the hard part moves into the browser, and the server gets simpler."},
    {"ch": 1, "flow": "create", "hops": [0, 3], "title": "Encrypt before sending",
     "body": ["Follow a new paste from the editor to the request body."],
     "why": "Everything the server receives is already encrypted, so nothing on the server can leak the text."},
    {"ch": 1, "flow": "create", "hops": [3, 9], "title": "The server stores a blob",
     "body": ["Rate limit, rules on the clear-text settings, and a write to storage."],
     "why": "The server can enforce only what it can see: size, rate, expiry and burn after reading."},
    {"ch": 1, "flow": "create", "hops": [9, 11], "title": "The key stays in the fragment",
     "body": ["The answer is an ID and a delete token; the browser adds the key after #."],
     "why": "Whoever has the link has the key. That is the whole access model, so share links carefully."},
    {"ch": 2, "flow": "read", "title": "Reading: page, then data, then decrypt",
     "body": ["The page is the same for every paste; the data comes as JSON and is decrypted in place."],
     "why": "Expired and burned pastes are deleted on the server at the moment of reading."},
    {"ch": 3, "flow": "purge", "title": "Cleanup without a cron job",
     "body": ["Expired pastes are deleted in small batches while new ones are created."],
     "why": "Nothing extra to deploy, at the cost of cleanup depending on traffic."},
    {"ch": 4, "whole": True, "title": "The whole pastebin, on one map",
     "recap": {
         "people": "Authors write, readers open the link.",
         "browser": "The browser makes the key and does all the crypto.",
         "server": "One PHP entry point routes, limits and serves the page.",
         "outside": "An optional shortener for long links.",
         "storage": "Disk, SQL or a bucket, holding only ciphertext.",
         "rules": "Expiry, burn after reading and cleanup on the server.",
     },
     "body": ["A JavaScript client that encrypts, a small PHP server and pluggable storage.",
              "The design choice that shapes everything: the key never reaches the server."]},
]

insides = {
    "crypto": {
        "kind": "steps", "title": "Inside the browser crypto",
        "sub": "What <code>CryptTool.cipher()</code> does with a paste before it is sent. Decryption runs the same steps backwards.",
        "cap": "The settings that the server must read (format, discussion, burn after reading) are not encrypted but authenticated: they are part of the AES-GCM tag, so a changed flag makes decryption fail.",
        "steps": [
            {"t": "Make a random key", "d": "32 random bytes from the browser's crypto API; one key per paste.", "code": c(JS, "1356-1358")},
            {"t": "Pick the parameters", "d": "A random IV and salt, 100,000 PBKDF2 rounds, AES-256-GCM, zlib unless the browser lacks WebAssembly or the server's compression setting says none.", "code": c(JS, "1240-1257")},
            {"t": "Settings become authenticated data", "d": "The parameters and the clear-text options travel next to the ciphertext and are bound to it.", "code": c(JS, "1258-1264")},
            {"t": "Derive the AES key", "d": "PBKDF2 over the random key and the password, if any.", "code": c(JS, "1169-1203")},
            {"t": "Compress and encrypt", "code": c(JS, "1266-1282")},
            {"t": "Put the key in the link", "d": "Done by PasteEncrypter once the server answers: base58 after <code>#</code>; with burn after reading, after <code>#-</code> so the reader confirms before the paste is fetched and deleted.", "code": c(JS, "5280-5291")},
        ],
    },
    "controller": {
        "kind": "steps", "title": "Inside the controller: a new paste",
        "sub": "What <code>Controller::_create()</code> does with a POST, in order. Early exits answer with a JSON error.",
        "cap": "The same entry point handles comments: the browser encrypts the comment and POSTs it with a paste ID and a parent ID; Comment rules check that the paste allows discussion and the parent exists, add the poster's icon, and store it next to its paste.",
        "steps": [
            {"t": "Which operation?", "d": "POST, PUT or DELETE with a body means create; a paste ID with a delete token means delete (also by POST); a paste ID alone means read. JSON-LD and shortener requests have their own operations.", "code": "lib/Request.php:110-192"},
            {"t": "Rate limit", "code": "lib/Controller.php:279-290",
             "exit": {"when": "too soon", "t": "Please wait N seconds (10 by default)", "code": "lib/Persistence/TrafficLimiter.php:200-215"}},
            {"t": "Check the envelope", "d": "Version, base64 fields, cipher parameters: the server validates the shape it cannot read.", "code": "lib/Controller.php:292-299",
             "exit": {"when": "malformed", "t": "Invalid data", "code": "lib/FormatV2.php:32-161"}},
            {"t": "Comment or paste?", "code": "lib/Controller.php:301-316",
             "exit": {"when": "comment", "t": "Stored under its paste and parent", "code": "lib/Model/Comment.php:41-92"}},
            {"t": "Purge expired pastes", "d": "At most once every 5 minutes, up to 10 pastes.", "code": "lib/Controller.php:320"},
            {"t": "Apply the rules and store", "code": "lib/Controller.php:321-323",
             "exit": {"when": "same ID exists", "t": "You are unlucky. Try again.", "code": "lib/Model/Paste.php:97-100"}},
            {"t": "Answer with ID and delete token", "code": "lib/Controller.php:324"},
        ],
    },
    "paste": {
        "kind": "steps", "title": "Inside the paste rules: reading",
        "sub": "What <code>Paste::get()</code> does before a paste is handed out.",
        "cap": "Expiry is checked when a paste is read, not only by the purge. An expired paste is never served, even if no cleanup has run for weeks.",
        "steps": [
            {"t": "Load the blob", "code": "lib/Model/Paste.php:55-58",
             "exit": {"when": "missing", "t": "Does not exist, has expired or was deleted", "code": "lib/Controller.php:49"}},
            {"t": "Expired?", "d": "Delete it now and answer as if it never existed.", "code": "lib/Model/Paste.php:60-66",
             "exit": {"when": "past the date", "t": "Deleted, generic error"}},
            {"t": "Report the time left", "code": "lib/Model/Paste.php:67-70"},
            {"t": "Burn after reading?", "d": "Deleted as it is returned: the first reader is the last.", "code": "lib/Model/Paste.php:75-78"},
            {"t": "Attach the comments", "code": "lib/Model/Paste.php:80-86"},
        ],
    },
    "sql": {
        "kind": "schema", "title": "Inside the SQL database",
        "sub": "Three tables, created on first use by <code>Database.php</code>. Hover a reference to see the table it points to.",
        "cap": "There is no user table and no plaintext column: <code>data</code> is the whole encrypted JSON envelope. Only the expiry date is a separate column, so the purge can find old pastes without reading blobs.",
        "tables": [
            {"name": "paste", "note": "One encrypted paste.", "code": "lib/Data/Database.php:677-689",
             "fields": [{"n": "dataid", "type": "char(16)", "note": "64-bit hash of the ciphertext, hex"},
                        {"n": "data", "type": "mediumblob", "note": "ciphertext, settings and attachments as JSON; TEXT on Postgres, CLOB on Oracle"},
                        {"n": "expiredate", "type": "int", "note": "unix time; 0 means never"},
                        {"n": "meta", "type": "text", "note": "the paste's meta without the expiry date: for a new paste, just its salt"}]},
            {"name": "comment", "note": "Encrypted comments, threaded by parent.", "code": "lib/Data/Database.php:696-731",
             "fields": [{"n": "dataid", "type": "char(16)"},
                        {"n": "pasteid", "ref": "paste", "note": "indexed"},
                        {"n": "parentid", "type": "char(16)", "note": "the paste or another comment"},
                        {"n": "data", "type": "blob", "note": "encrypted nickname and text"},
                        {"n": "vizhash", "type": "blob", "note": "the poster's icon as a data URI (identicon, jdenticon or vizhash, per the icon setting), derived from an HMAC of their IP; TEXT on Postgres"},
                        {"n": "postdate", "type": "int"}]},
            {"name": "config", "note": "A small key-value table.", "code": "lib/Data/Database.php:738-752",
             "fields": [{"n": "id", "type": "char(16)", "note": "VERSION, salt, purge_limiter, traffic_limiter"},
                        {"n": "value", "type": "text"}]},
        ],
    },
}

files = {"entries": [
    {"path": "index.php", "t": "The only PHP entry point: loads Composer's autoloader and builds the controller.", "tag": "entry point", "nodes": ["controller"]},
    {"path": "lib/", "t": "The whole PHP server, one class per file.", "open": True},
    {"path": "lib/Controller.php", "t": "Picks the operation and answers with JSON or the page.", "why": "All server behaviour starts here, so reading this one file shows every request type.", "nodes": ["controller", "view"]},
    {"path": "lib/Request.php", "t": "Reads method, query string and JSON body into one operation.", "nodes": ["controller"]},
    {"path": "lib/FormatV2.php", "t": "Validates the shape of an encrypted envelope.", "nodes": ["controller"]},
    {"path": "lib/Model/", "t": "Paste and comment rules: expiry, burn after reading, IDs and delete tokens.", "nodes": ["paste"]},
    {"path": "lib/Model.php", "t": "Builds the storage backend from the config and runs the purge.", "nodes": ["store", "purge"]},
    {"path": "lib/Persistence/", "t": "Small server-side state: server salt, traffic limiter and purge limiter.", "why": "These values live in the same store as the pastes, so servers that share a backend (a database, a bucket or a shared data folder) share them too.", "nodes": ["limiter", "purge"]},
    {"path": "lib/Data/", "t": "One class per storage backend behind AbstractData.", "why": "Adding a backend means one new class, plus any defaults for it in <code>lib/Configuration.php</code>.", "nodes": ["store", "files", "sql", "cloud"]},
    {"path": "lib/Proxy/", "t": "Clients for the URL shorteners.", "nodes": ["proxy"]},
    {"path": "tpl/bootstrap5.php", "t": "The main HTML page, the default template; <code>tpl/shortenerproxy.php</code> is the small page for a short link.", "tag": "template", "nodes": ["view"]},
    {"path": "js/privatebin.js", "t": "The whole client: UI, crypto and server calls in one file of modules.", "why": "The security of the system rests on this file, since it is what handles keys and plaintext.", "tag": "client", "nodes": ["ui", "crypto", "calls"]},
    {"path": "js/zlib-1.3.2.wasm", "t": "zlib compiled to WebAssembly, used to compress before encrypting.", "nodes": ["crypto"]},
    {"path": "cfg/conf.sample.php", "t": "Every setting with its default: backend, limits, expiry options, shortener.", "tag": "config", "why": "Most behaviour on this map is switched here, so a real install may look different."},
    {"path": "bin/administration", "t": "Command line tool to purge, delete or list pastes and print statistics.", "tag": "admin", "nodes": ["purge", "store"]},
    {"path": "bin/migrate", "t": "Command line tool that copies pastes and comments from one storage backend to another.", "tag": "admin", "nodes": ["store"]},
    {"path": "tst/", "t": "PHPUnit tests for the server; js/test holds the client tests.", "more": "one test class per server class"},
    {"path": "doc/Installation.md", "t": "Hosting requirements and how to pick a backend.", "tag": "docs"},
]}

definition = {
    "id": "privatebin-pastebin",
    "page": {
        "title": "PrivateBin: a pastebin, mapped",
        "slots": {
            "overviewDescription": "PrivateBin in context: who uses it, what it is made of and what it talks to.",
            "mapDescription": "The browser client, the PHP server and its storage backends, with the paths a new paste and a read take.",
            "completionLessons": "<li>Why the key never reaches the server</li><li>What the server can still enforce</li><li>How storage stays pluggable</li>",
            "completionIntro": "You followed a paste from the editor to storage and back.",
        },
    },
    "panels": {
        "introHtml": "<div class=\"p-eyebrow\">Start here</div><h2>PrivateBin, the zero-knowledge pastebin</h2>"
                     "<p style=\"margin-top:8px\">A map of <a href=\"https://github.com/PrivateBin/PrivateBin\">PrivateBin/PrivateBin</a> 2.1.1 in C4 terms: context on the overview, the client, server and storage on the full map.</p>"
                     "<p><small>PrivateBin was originally written by Sébastien Sauvage (© 2012) and is developed by the PrivateBin contributors under the <a href=\"https://github.com/PrivateBin/PrivateBin/blob/8a6312e7e666e6b5129de260dbe195b2be21b58e/LICENSE.md\">zlib/libpng licence</a>. This map describes it in its own words and is not affiliated with its authors.</small></p><h3>Try it</h3><ul class=\"newlist\"><li>Open a card to see its part of the system.</li><li>Play <b>Create a paste</b> to see where the encryption happens.</li><li>Click a component for what it does and where it lives in the code.</li></ul>"
                     "<div class=\"panel-actions\"><button type=\"button\" class=\"panel-action\" id=\"gofull\">Open full map</button></div>",
        "overviewHtml": "<div class=\"p-eyebrow\">The full map</div><h2>The browser does the work</h2>"
                        "<p style=\"margin-top:8px\">PrivateBin runs as PHP on any web server; the client is one JavaScript file. Both are opened up into their components.</p>"
                        "<h3>How to read it</h3><p>People on the left, the browser client and the PHP server in the middle, storage on the right. Only one storage backend is active in an install.</p>",
    },
    "groups": groups,
    "overview": overview,
    "overviewEdges": overview_edges,
    "nodes": nodes,
    "zones": zones,
    "edges": edges,
    "flows": flows,
    "buildSteps": build_steps,
    "tourChapters": tour_chapters,
    "tour": tour,
    "insides": insides,
    "files": files,
    "source": {"repo": REPO, "ref": REF},
}

print(json.dumps(definition, ensure_ascii=False, indent=1))
