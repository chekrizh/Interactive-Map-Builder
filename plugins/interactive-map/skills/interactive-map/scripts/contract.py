"""What the viewer reads from a map definition, and how it shows text. Used by render.py.

The text contract (also stated in SKILL.md):
- Labels: names the viewer draws on the map or uses as titles, tooltips and tags (LABELS below).
  Plain text only. The viewer always shows them as text, so a tag or an entity would show literally;
  render.py rejects them.
- Rich text: every other text field. Plain text or a small HTML subset (HTML_TAGS). The viewer always
  renders it as HTML, in panels, the tour, flows and close-ups alike. render.py removes any other tag
  or attribute (keeping the words) and says what it removed.
- SVG (SVG_FIELDS): icon bodies and hand-drawn scenes. Drawing elements only; no scripts, events or
  outside references.
- URLs, colours and ids are checked for their shape, so none of them can break out of the attribute
  or style rule the viewer puts them in.
"""
import html
import re
from html.parser import HTMLParser

import defaults

ANY = '*'

# The fields the viewer reads. A dict lists an object's keys; {ANY: x} is a map keyed by ids;
# [x] is a list of x; None is a value with nothing inside to check. Anything else is dropped by
# the viewer, so render.py warns about it.
LEAF = None
SCHEMA = {
    'id': LEAF,
    'page': {'title': LEAF, 'slots': {k: LEAF for k in (
        'overviewDescription', 'mapDescription', 'completionIntro', 'completionLessons', 'legend')}},
    'panels': {'introHtml': LEAF, 'overviewHtml': LEAF},
    'ui': {k: LEAF for k in defaults.UI},
    'roles': {ANY: {k: LEAF for k in ('label', 'light', 'dark', 'fillLight', 'fillDark')}},
    'icons': {ANY: LEAF},
    'logos': {ANY: {k: LEAF for k in ('name', 'src', 'size', 'tile')}},
    'settings': {'appearanceRoles': {k: LEAF for k in ('accent', 'artifact', 'error')}, 'recapOrder': LEAF,
                 'buildRole': LEAF},
    'nodes': [{k: LEAF for k in (
        'id', 'group', 'zone', 'cat', 'icon', 'logo', 'shape', 'inside', 'step', 'concept', 'tool', 'tools',
        'what', 'why', 'decision', 'art')}],
    'edges': [{k: LEAF for k in ('id', 'from', 'to', 'label', 'bidir')}],
    'zones': [{k: LEAF for k in ('id', 'label', 'hue')}],
    'groups': {ANY: {k: LEAF for k in (
        'title', 'line1', 'line2', 'chips', 'text', 'icon', 'huekey', 'members', 'decision', 'runnable')}},
    'overview': [{'g': LEAF}],
    'overviewEdges': [{k: LEAF for k in ('id', 'from', 'to', 'label')}],
    'flows': {ANY: {
        'title': LEAF, 'desc': LEAF, 'hue': LEAF, 'kind': LEAF, 'ok': LEAF, 'ending': LEAF, 'silent': LEAF,
        'hops': [{'e': LEAF, 't': LEAF, 'rev': LEAF, 'note': LEAF, 'bad': LEAF, 'breaks': LEAF,
                  'silent': {'e': LEAF, 't': LEAF}}]}},
    'buildSteps': [{k: LEAF for k in ('title', 'text', 'nodes', 'decision', 'runnable')}],
    'tourChapters': [{'name': LEAF, 'hue': LEAF}],
    'tour': [{k: LEAF for k in ('ch', 'level', 'title', 'body', 'why', 'flow', 'hops', 'whole', 'recap')}],
    'beatSeconds': LEAF,
    'flowBeatSeconds': LEAF,
    'insides': {ANY: {
        'kind': LEAF, 'title': LEAF, 'sub': LEAF, 'cap': LEAF, 'svg': LEAF,
        'steps': [{'t': LEAF, 'd': LEAF, 'code': LEAF, 'async': LEAF,
                   'exit': {'t': LEAF, 'when': LEAF, 'code': LEAF}}],
        'tables': [{'name': LEAF, 'ttl': LEAF, 'note': LEAF, 'code': LEAF,
                    'fields': [{k: LEAF for k in ('n', 'type', 'ref', 'note')}]}]}},
    'files': {'title': LEAF, 'heading': LEAF, 'intro': LEAF, 'panel': LEAF,
              'entries': [{k: LEAF for k in ('path', 't', 'why', 'nodes', 'tag', 'open', 'more')}]},
    'source': {'repo': LEAF, 'ref': LEAF},
    'layout': {
        'viewBoxes': {'map': LEAF, 'map0': LEAF},
        'overviewCard': {'width': LEAF, 'height': LEAF},
        'scale': {'x': LEAF, 'y': LEAF},
        'nodes': {ANY: {k: LEAF for k in ('x', 'y', 'w', 'h')}},
        'edges': {ANY: {k: LEAF for k in ('d', 'lside', 'ldx', 'ldy', 'lx', 'ly')}},
        'zones': {ANY: {k: LEAF for k in ('x', 'y', 'w', 'h')}},
        'overview': {ANY: {'x': LEAF, 'y': LEAF}},
        'overviewEdges': {ANY: {k: LEAF for k in ('d', 'x', 'y', 'anchor')}},
        'insides': {ANY: {'w': LEAF, 'h': LEAF}},
        'insideMarkers': LEAF,
        'annotations': [{k: LEAF for k in ('zone', 'label', 'rect', 'text')}],
    },
}

# Fields older maps carried that the viewer no longer reads, with the reason.
RETIRED = {
    'links': 'the Project structure view replaced the outside structure link',
    'settings.zoomable': 'zoom is always on',
    'settings.embedded': 'the compact layout is always on',
    'settings.linkTarget': 'only the retired structure link used it',
    'settings.pinnedFlowFraction': 'the pinned build-step view is gone',
    'page.slots.nextToolUrl': 'the end of the tour has no next-tool link',
    'page.slots.nextToolLabel': 'the end of the tour has no next-tool link',
    'page.slots.tourEntry': 'set ui.tourEntry instead',
    'page.slots.completionCount': 'set ui.completionCount instead',
    'panels.buildRole': 'set settings.buildRole instead, or leave it to default to the accent role',
    'ui.pinnedTitle': 'the pinned build-step view is gone',
}
for _key in ('course', 'nodeCourseLabel', 'courseLabel', 'pinnedNote'):
    RETIRED[f'panels.{_key}'] = 'course mode is gone'
for _key in ('structure', 'bootcampNote'):
    RETIRED[f'nodes[].{_key}'] = 'course mode and the outside structure link are gone'
RETIRED['groups.*.you'] = 'course mode is gone'

# Field patterns: "nodes[].concept" is the concept of any node, "groups.*.title" the title of any group.
LABELS = {
    'id', 'page.title', 'page.slots.overviewDescription', 'page.slots.mapDescription', 'ui.*', 'roles.*.label', 'logos.*.name',
    'nodes[].concept', 'nodes[].tool',
    'edges[].label', 'overviewEdges[].label', 'zones[].label',
    'groups.*.title', 'groups.*.line1', 'groups.*.line2', 'groups.*.chips',
    'flows.*.title', 'flows.*.desc', 'flows.*.hops[].silent.t',
    'buildSteps[].title', 'tourChapters[].name', 'tour[].title', 'insides.*.title',
    'layout.annotations[].label', 'files.title', 'files.heading', 'files.entries[].path', 'files.entries[].tag',
}
SVG_FIELDS = {'icons.*', 'insides.*.svg', 'layout.insideMarkers'}
URL_FIELDS = {'source.repo', 'logos.*.src'}
CODE_FIELDS = {'insides.*.steps[].code', 'insides.*.steps[].exit.code', 'insides.*.tables[].code'}
COLOR_FIELDS = {f'roles.*.{k}' for k in ('light', 'dark', 'fillLight', 'fillDark')}
ID_MAPS = ('groups', 'flows', 'insides', 'roles', 'icons', 'logos')
ID_LISTS = ('nodes', 'edges', 'zones', 'overviewEdges')
LINK_TARGETS = ('_blank', '_self', '_parent', '_top')

ID = re.compile(r'[A-Za-z0-9][A-Za-z0-9_.-]*\Z')
MARKUP = re.compile(r'<[A-Za-z/!?]|&(#[0-9]+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);')
COLOR = re.compile(r'(#[0-9a-fA-F]{3,8}|[a-zA-Z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\([-\w\s.,%/+]*\)|var\(--[\w-]+\))\Z')
CODE = re.compile(r'([^:\s<>"\'&]+)(?::([0-9]+)(?:-([0-9]+))?)?\Z')
# An HTTP(S) link, a mailto: link or an anchor; never javascript: or data:.
SAFE_HREF = re.compile(r'(https?://|mailto:|#)[^\s"<>]*\Z', re.I)

# Rich text: the HTML the viewer renders, with the attributes each tag may carry.
_COMMON = {'class', 'style', 'title'}
HTML_TAGS = {t: _COMMON for t in (
    'b', 'strong', 'i', 'em', 'u', 's', 'code', 'kbd', 'samp', 'var', 'mark', 'small', 'sub', 'sup', 'abbr',
    'span', 'div', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'h2', 'h3', 'h4', 'pre', 'blockquote')}
HTML_TAGS['a'] = _COMMON | {'href', 'target', 'rel'}
HTML_TAGS['button'] = _COMMON | {'type', 'id'}
VOID = {'br', 'hr'}
# Element ids the viewer wires up in authored panels; any other id could shadow the page's own.
HOOK_IDS = {'gofull'}
SVG_TAGS = {
    'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'text', 'tspan', 'title', 'desc',
    'defs', 'marker', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'pattern', 'symbol', 'use'}
# Removed together with everything inside them.
DROP_WITH_CONTENT = {'script', 'style', 'iframe', 'object', 'embed', 'template', 'textarea', 'noscript',
                     'select', 'svg', 'math', 'foreignobject', 'head', 'title'}
UNSAFE_CSS = re.compile(r'url\s*\(|expression|@import|javascript:|\\|[<>]', re.I)


class _Cleaner(HTMLParser):
    def __init__(self, svg):
        super().__init__(convert_charrefs=True)
        self.svg, self.out, self.removed, self.skip = svg, [], [], 0

    def _attrs(self, tag, attrs):
        kept = []
        for name, value in attrs:
            value = value or ''
            if self._allowed(tag, name, value):
                kept.append((name, value))
            else:
                self.removed.append(f'{name}="{value[:40]}" on <{tag}>')
        if tag == 'a' and any(n == 'target' for n, _ in kept):
            kept = [(n, v) for n, v in kept if n != 'rel'] + [('rel', 'noopener noreferrer')]
        return ''.join(f' {n}="{html.escape(v, quote=True)}"' for n, v in kept)

    def _allowed(self, tag, name, value):
        if name.startswith('on') or name in ('srcdoc', 'formaction'):
            return False
        if name == 'style':
            return not UNSAFE_CSS.search(value)
        if self.svg:
            if name in ('href', 'xlink:href'):
                return value.startswith('#')
            return re.fullmatch(r'[a-z][a-z0-9:-]*', name) is not None and not re.search(r'url\s*\((?!\s*#)|javascript:', value, re.I)
        if name not in HTML_TAGS[tag]:
            return False
        if name == 'href':
            return SAFE_HREF.match(value.strip()) is not None
        if name == 'target':
            return value in LINK_TARGETS
        if name == 'type':
            return value == 'button'
        if name == 'id':
            return value in HOOK_IDS
        return True

    def _open(self, tag, attrs, closed):
        if tag in DROP_WITH_CONTENT and not (self.svg and tag == 'title'):
            if not closed:
                self.skip += 1
            self.removed.append(f'<{tag}>')
            return
        if self.skip:
            return
        if tag not in (SVG_TAGS if self.svg else HTML_TAGS):
            self.removed.append(f'<{tag}>')
            return
        end = '/>' if closed and self.svg else '>' if tag in VOID or not closed else f'></{tag}>'
        self.out.append(f'<{tag}{self._attrs(tag, attrs)}{end}')

    def handle_starttag(self, tag, attrs):
        self._open(tag, attrs, False)

    def handle_startendtag(self, tag, attrs):
        self._open(tag, attrs, True)

    def handle_endtag(self, tag):
        if tag in DROP_WITH_CONTENT and not (self.svg and tag == 'title'):
            self.skip = max(0, self.skip - 1)
        elif not self.skip and tag in (SVG_TAGS if self.svg else HTML_TAGS) and tag not in VOID:
            self.out.append(f'</{tag}>')

    def handle_data(self, data):
        if not self.skip:
            self.out.append(html.escape(data, quote=False))


def clean(value, svg=False):
    """(safe markup, what was removed). Text without '<' is returned unchanged: it cannot hold a tag."""
    if '<' not in value:
        return value, []
    cleaner = _Cleaner(svg)
    cleaner.feed(value)
    cleaner.close()
    return ''.join(cleaner.out), cleaner.removed


def _child(schema, key):
    """(schema of the item under key, the pattern step for it): '*' inside maps keyed by ids."""
    if isinstance(schema, dict) and ANY in schema:
        return schema[ANY], '*'
    if isinstance(schema, dict):
        return schema.get(key, False), key
    return (None if schema is None else False), key  # inside a free value, or inside a dropped field


def _join(path, key):
    return f'{path}.{key}' if path else key


def walk(value, schema=SCHEMA, path='', pattern=''):
    """Yield (path, pattern, value, known) for every value in the map; known is False for a field
    the viewer does not read. path is "nodes[3].what", pattern is "nodes[].what"."""
    yield path, pattern, value, schema is not False
    if isinstance(value, dict):
        for key, item in value.items():
            sub, step = _child(schema, key)
            yield from walk(item, sub, _join(path, key), _join(pattern, step))
    elif isinstance(value, list):
        sub = schema[0] if isinstance(schema, list) else (None if schema is None else False)
        for i, item in enumerate(value):
            yield from walk(item, sub, f'{path}[{i}]', f'{pattern}[]')


def retired(path):
    """Why a field older maps carried is gone, or None when it never existed."""
    for key, why in RETIRED.items():
        rule = re.escape(key).replace(r'\[\]', r'\[[0-9]+\]').replace(r'\*', r'[^.\[]+')
        if re.fullmatch(rule, path):
            return why
    return None


def unknown_fields(d):
    """Fields the viewer would silently drop, outermost first (a dropped object is reported once)."""
    found = []
    for path, _, _, known in walk(d):
        if not known and not any(path.startswith(p + '.') or path.startswith(p + '[') for p in found):
            found.append(path)
    return found


def _rebuild(value, schema, path, pattern, leaf):
    if isinstance(value, dict):
        out = {}
        for key, item in value.items():
            sub, step = _child(schema, key)
            out[key] = _rebuild(item, sub, _join(path, key), _join(pattern, step), leaf)
        return out
    if isinstance(value, list):
        sub = schema[0] if isinstance(schema, list) else (None if schema is None else False)
        return [_rebuild(item, sub, f'{path}[{i}]', f'{pattern}[]', leaf) for i, item in enumerate(value)]
    return leaf(value, path, pattern) if isinstance(value, str) else value


def check_text(d):
    """(problems, warnings, cleaned map): the text contract applied to every string in the map."""
    problems, warnings = [], []

    def leaf(value, path, pattern):
        if pattern in LABELS or pattern.startswith('ui.'):
            if MARKUP.search(value):
                problems.append(f'{path} is a label, shown as plain text: remove the HTML tags and entities from {value[:60]!r}')
            return value
        if pattern in URL_FIELDS:
            return value  # render.py checks the scheme
        if pattern in COLOR_FIELDS:
            if not COLOR.match(value.strip()):
                problems.append(f'{path} must be a CSS colour such as #3b6fd8 or oklch(62% .15 250), got {value[:40]!r}')
            return value
        if pattern in CODE_FIELDS:
            if not CODE.match(value):
                problems.append(f'{path} must be a code reference like "src/app.py:10-24", got {value[:60]!r}')
            return value
        cleaned, removed = clean(value, svg=pattern in SVG_FIELDS)
        if removed:
            warnings.append(f'{path}: removed {", ".join(dict.fromkeys(removed))}, which map text may not contain')
        return cleaned

    return problems, warnings, _rebuild(d, SCHEMA, '', '', leaf)
