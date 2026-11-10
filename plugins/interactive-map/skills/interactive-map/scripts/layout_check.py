"""Checks a map's geometry the way the viewer will draw it, without a browser.

The viewer does not draw `layout` as written: it resizes every card to fit its text, keeps
each card centred on the authored box, snaps edge ends onto the resized cards and puts an
edge label on its line as a chip only when the line has a long enough straight run. This
module repeats those steps (with the font's measured widths from metrics.json) and reports
what a reader would see as broken: cards that overlap or leave their zone, edges drawn
through a card, labels that collide or lost their chip, text cut short on overview cards,
anything outside the visible area.

    import layout_check
    problems, notes = layout_check.check(definition)  # a completed definition, as render.py builds it
"""

import json
import math
import pathlib
import re

METRICS = json.loads((pathlib.Path(__file__).parent / 'metrics.json').read_text(encoding='utf-8'))

# The viewer's sizes (app/src/rendering/ml-canvas.js prepareLayout and app/src/runtime/scene.js), in map units.
CARD_MIN_W, CARD_PAD_W, CARD_H, QUEUE_EXTRA = 168, 76, 72, 26
CHIP_PAD, CHIP_ROOM, CHIP_H = 14, 18, 16            # full-map edge label chip
OV_CHIP_PAD, OV_CHIP_ROOM, OV_CHIP_H = 20, 24, 22   # overview edge label chip
INSET = 3                                           # how far inside a card an edge must go to count
NEAR = 10                                           # cards closer than this read as touching


def text_width(text, weight, size, spacing=0.0):
    table = METRICS[str(weight)]
    units = sum(table.get(c, table['default']) for c in str(text))
    return units * size / 1000 + spacing * size * len(str(text))


def wrap(text, width, weight, size):
    """The viewer's wrapText: greedy, on spaces."""
    lines, line = [], ''
    for word in str(text).split():
        candidate = f'{line} {word}' if line else word
        if line and text_width(candidate, weight, size) > width:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def points(d, sx=1.0, sy=1.0):
    return [[float(x) * sx, float(y) * sy] for x, y in re.findall(r'[ML]\s*([\d.-]+)[ ,]([\d.-]+)', d)]


class Box:
    def __init__(self, x, y, w, h):
        self.x, self.y, self.w, self.h = x, y, w, h

    @property
    def r(self):
        return self.x + self.w

    @property
    def b(self):
        return self.y + self.h

    def shrink(self, by):
        return Box(self.x + by, self.y + by, self.w - 2 * by, self.h - 2 * by)

    def overlaps(self, other, gap=0.0):
        return (self.x < other.r + gap and other.x < self.r + gap
                and self.y < other.b + gap and other.y < self.b + gap)

    def contains(self, other):
        return self.x <= other.x and self.y <= other.y and other.r <= self.r and other.b <= self.b

    def hits(self, a, b):
        """Whether the segment a-b passes through this box (Liang-Barsky clipping)."""
        t0, t1 = 0.0, 1.0
        dx, dy = b[0] - a[0], b[1] - a[1]
        for p, q in ((-dx, a[0] - self.x), (dx, self.r - a[0]), (-dy, a[1] - self.y), (dy, self.b - a[1])):
            if p == 0:
                if q <= 0:
                    return False
                continue
            t = q / p
            if p < 0:
                t0 = max(t0, t)
            else:
                t1 = min(t1, t)
            if t0 >= t1:
                return False
        return True

    def __repr__(self):
        return f'({round(self.x)},{round(self.y)} {round(self.w)}x{round(self.h)})'


def card_boxes(d):
    """Each node's card as the viewer resizes it, keyed by id."""
    scale = d['layout'].get('scale') or {'x': 1, 'y': 1}
    sx, sy = scale.get('x', 1), scale.get('y', 1)
    boxes, authored = {}, {}
    for n in d['nodes']:
        g = d['layout']['nodes'][n['id']]
        o = Box(g['x'] * sx, g['y'] * sy, g['w'] * sx, g['h'] * sy)
        w = max(CARD_MIN_W, math.ceil(max(text_width(n.get('tool', ''), 600, 13.5),
                                          text_width(n.get('concept', ''), 600, 13.5)) + CARD_PAD_W))
        w += QUEUE_EXTRA if n.get('shape') == 'queue' else 0
        boxes[n['id']] = Box(o.x + o.w / 2 - w / 2, o.y + o.h / 2 - CARD_H / 2, w, CARD_H)
        authored[n['id']] = o
    return boxes, authored, (sx, sy)


def snapped_path(e, geo, boxes, authored, scale):
    """The edge's corner points after the viewer snaps both ends onto the resized cards."""
    pts = points(geo['d'], *scale)
    if len(pts) < 2:
        return pts

    def snap(idx, node):
        n, o, p = boxes[node], authored[node], pts[idx]
        old = list(p)
        side = min((abs(p[0] - o.x), 'l'), (abs(p[0] - o.r), 'r'), (abs(p[1] - o.y), 't'), (abs(p[1] - o.b), 'b'))[1]
        if side in 'lr':
            p[0] = n.x if side == 'l' else n.r
            p[1] = max(n.y + 14, min(n.b - 14, p[1]))
        else:
            p[1] = n.y if side == 't' else n.b
            p[0] = max(n.x + 18, min(n.r - 18, p[0]))
        step = 1 if idx == 0 else -1
        j = idx + step
        while 0 <= j < len(pts) and abs(pts[j][0] - old[0]) < .1:
            pts[j][0] = p[0]
            j += step
        j = idx + step
        while 0 <= j < len(pts) and abs(pts[j][1] - old[1]) < .1:
            pts[j][1] = p[1]
            j += step

    if e['from'] in boxes:
        snap(0, e['from'])
    if e['to'] in boxes:
        snap(len(pts) - 1, e['to'])
    return pts


def longest_run(pts):
    best = None
    for a, b in zip(pts, pts[1:]):
        length = math.hypot(b[0] - a[0], b[1] - a[1])
        if best is None or length > best[0]:
            best = (length, abs(b[1] - a[1]) < 1, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    return best


def bare_label_box(e, pts):
    """Where the viewer puts a label that does not fit on its line (app/src/runtime/scene.js placeLabel)."""
    w = text_width(e['label'], 500, 10)
    if e.get('lx') is not None:
        x, y, anchor = e['lx'], e['ly'], e.get('anchor') or 'middle'
    else:
        a, b = pts[0], pts[1]
        for i in range(1, len(pts) - 1):
            p, q = pts[i], pts[i + 1]
            if abs(q[0] - p[0]) + abs(q[1] - p[1]) > abs(b[0] - a[0]) + abs(b[1] - a[1]):
                a, b = p, q
        if abs(b[1] - a[1]) < 1:
            x, y, anchor = (a[0] + b[0]) / 2, a[1] - 11, 'middle'
            if e.get('lside') == 'below':
                y = a[1] + 15
        else:
            x, y, anchor = a[0] + 10, (a[1] + b[1]) / 2 + 4, 'start'
            if e.get('lside') == 'left':
                x, anchor = a[0] - 8, 'end'
        x += e.get('ldx') or 0
        y += e.get('ldy') or 0
    left = x - w / 2 if anchor == 'middle' else x - w if anchor == 'end' else x
    return Box(left, y - 8, w, 10)


def zone_title(box, zone):
    return Box(box.x + 16, box.y + 14, text_width(zone.get('label', '').upper(), 600, 10.5, .08), 13)


def full_map(d, notes):
    out = []
    boxes, authored, scale = card_boxes(d)
    vw, vh = d['layout']['viewBoxes']['map']
    view = Box(0, 0, vw, vh)
    names = {n['id']: n for n in d['nodes']}
    zones = {}
    for z in d.get('zones', []):
        g = d['layout']['zones'][z['id']]
        zones[z['id']] = (Box(g['x'] * scale[0], g['y'] * scale[1], g['w'] * scale[0], g['h'] * scale[1]), z)

    ids = list(boxes)
    for i, a in enumerate(ids):
        box = boxes[a]
        if not view.contains(box):
            out.append(f'node {a} {box} is outside the map area 0,0 {vw}x{vh} (layout.viewBoxes.map)')
        for b in ids[i + 1:]:
            if box.overlaps(boxes[b]):
                out.append(f'nodes {a} and {b} overlap')
            elif box.overlaps(boxes[b], NEAR):
                out.append(f'nodes {a} and {b} are less than {NEAR} apart')
        zone = names[a].get('zone')
        if zone in zones:
            zbox = zones[zone][0]
            if not zbox.contains(box):
                out.append(f'node {a} {box} sticks out of its zone {zone} {zbox}')
            elif zone_title(zbox, zones[zone][1]).overlaps(box, 4):
                out.append(f'node {a} covers the title of its zone {zone}')
        for zid, (zbox, _) in zones.items():
            if zid != zone and zbox.overlaps(box):
                out.append(f'node {a} overlaps zone {zid}, which is not its zone')

    zlist = list(zones.items())
    for i, (a, (abox, z)) in enumerate(zlist):
        title = zone_title(abox, z)
        if title.r > abox.r - 8:
            out.append(f'zone {a}: its title is wider than the zone')
        if not view.contains(abox):
            out.append(f'zone {a} {abox} is outside the map area 0,0 {vw}x{vh}')
        for b, (bbox, _) in zlist[i + 1:]:
            if abox.overlaps(bbox):
                out.append(f'zones {a} and {b} overlap')

    paths, labels = {}, []
    for e in d['edges']:
        geo = d['layout']['edges'][e['id']]
        geo = {**geo, **{k: v * (scale[0] if k in ('lx', 'ldx') else scale[1]) for k, v in geo.items() if k in ('lx', 'ly', 'ldx', 'ldy') and v is not None}}
        pts = snapped_path(e, geo, boxes, authored, scale)
        paths[e['id']] = pts
        if len(pts) < 2:
            out.append(f'edge {e["id"]}: its path needs at least two points')
            continue
        for a, b in zip(pts, pts[1:]):
            if abs(a[0] - b[0]) > .5 and abs(a[1] - b[1]) > .5:
                out.append(f'edge {e["id"]}: segment {fmt(a)}-{fmt(b)} is diagonal; use horizontal and vertical runs')
                break
        crossed = sorted({n for n, box in boxes.items() for a, b in zip(pts, pts[1:]) if box.shrink(INSET).hits(a, b)})
        for n in crossed:
            own = ' (its own end: the line runs inside the card)' if n in (e['from'], e['to']) else ''
            out.append(f'edge {e["id"]} ({e["from"]} -> {e["to"]}) is drawn through node {n}{own}')
        if any(not view.contains(Box(p[0], p[1], 0, 0)) for p in pts):
            out.append(f'edge {e["id"]} leaves the map area')
        label = e.get('label')
        if not label:
            continue
        w = text_width(label, 500, 9.5) + CHIP_PAD
        run = longest_run(pts)
        if run and run[0] >= w + CHIP_ROOM:
            labels.append((e['id'], Box(run[2] - w / 2, run[3] - CHIP_H / 2, w, CHIP_H)))
        else:
            need = math.ceil(w + CHIP_ROOM)
            notes.append(f'edge {e["id"]}: label "{label}" has no room for its chip: the longest straight run is {round(run[0]) if run else 0}, it needs {need}')
            labels.append((e['id'], bare_label_box({**e, **geo}, pts)))

    for eid, box in labels:
        for n, nbox in boxes.items():
            if box.overlaps(nbox.shrink(1)):
                out.append(f'edge {eid}: its label covers node {n}')
        for other, pts in paths.items():
            if other != eid and any(box.shrink(2).hits(a, b) for a, b in zip(pts, pts[1:])):
                out.append(f'edge {eid}: its label is crossed by edge {other}')
    for i, (a, abox) in enumerate(labels):
        for b, bbox in labels[i + 1:]:
            if abox.overlaps(bbox, 2):
                out.append(f'edges {a} and {b}: their labels overlap')

    edge_ids = list(paths)
    for i, a in enumerate(edge_ids):
        for b in edge_ids[i + 1:]:
            shared = shared_run(paths[a], paths[b])
            if shared > 24:
                out.append(f'edges {a} and {b} run on top of each other for {round(shared)} units; a reader cannot tell them apart')
    return out


def shared_run(p, q):
    """The longest stretch two orthogonal paths draw on the same line."""
    best = 0.0
    for a, b in zip(p, p[1:]):
        for c, d in zip(q, q[1:]):
            if abs(a[1] - b[1]) < .5 and abs(c[1] - d[1]) < .5 and abs(a[1] - c[1]) < 2:
                lo, hi = max(min(a[0], b[0]), min(c[0], d[0])), min(max(a[0], b[0]), max(c[0], d[0]))
                best = max(best, hi - lo)
            elif abs(a[0] - b[0]) < .5 and abs(c[0] - d[0]) < .5 and abs(a[0] - c[0]) < 2:
                lo, hi = max(min(a[1], b[1]), min(c[1], d[1])), min(max(a[1], b[1]), max(c[1], d[1]))
                best = max(best, hi - lo)
    return best


def overview(d, notes):
    out = []
    lay = d['layout']
    bw, bh = lay['overviewCard']['width'], lay['overviewCard']['height']
    vw, vh = lay['viewBoxes']['map0']
    view = Box(0, 0, vw, vh)
    cards = {}
    for item in d.get('overview', []):
        g = lay['overview'][item['g']]
        cards[item['g']] = Box(g['x'], g['y'], bw, bh)
    groups = d.get('groups', {})
    keys = list(cards)
    for i, a in enumerate(keys):
        box = cards[a]
        if not view.contains(box):
            out.append(f'overview card {a} {box} is outside the overview area 0,0 {vw}x{vh} (layout.viewBoxes.map0)')
        for b in keys[i + 1:]:
            if box.overlaps(cards[b]):
                out.append(f'overview cards {a} and {b} overlap')
        group = groups.get(a, {})
        pad, tile = 22, 44
        title = wrap(group.get('title', ''), bw - pad - 30 - (pad + tile + 14), 700, 19)
        if len(title) > 2:
            out.append(f'overview card {a}: title "{group.get("title")}" needs {len(title)} lines, only 2 show')
        head = min(len(title), 2) * 23 + 18
        top = pad + max(tile, head) + 22
        foot = bh - 42
        room = max(1, (foot - 10 - top) // 21 + 1)
        desc = wrap(f'{group.get("line1", "")} {group.get("line2", "")}', bw - 2 * pad, 400, 14.5)
        if len(desc) > room:
            out.append(f'overview card {a}: line1 + line2 need {len(desc)} lines, {room} fit; the rest is cut with "…"')
        chips = text_width(group.get('chips', ''), 400, 12)
        if chips > bw - 2 * pad:
            out.append(f'overview card {a}: chips "{group.get("chips")}" are wider than the card')
        elif chips > bw - 2 * pad - text_width('Open', 700, 12.5) - 8:
            notes.append(f'overview card {a}: chips "{group.get("chips")}" run under the "Open" hint shown on hover')

    for e in d.get('overviewEdges', []):
        geo = lay['overviewEdges'][e['id']]
        pts = points(geo['d'])
        for a, b in zip(pts, pts[1:]):
            for g, box in cards.items():
                if box.shrink(INSET).hits(a, b):
                    out.append(f'overview edge {e["id"]} is drawn through card {g}')
        label = e.get('label')
        if not label or len(pts) < 2:
            continue
        w = text_width(label, 600, 12) + OV_CHIP_PAD
        run = longest_run(pts)
        fits = run and (run[0] >= w + OV_CHIP_ROOM if run[1] else run[0] >= 40)
        if fits:
            box = Box(run[2] - w / 2, run[3] - OV_CHIP_H / 2, w, OV_CHIP_H)
        else:
            tw = text_width(label, 500, 10)
            x, anchor = geo.get('x', 0), geo.get('anchor', 'middle')
            left = x - tw / 2 if anchor == 'middle' else x - tw if anchor == 'end' else x
            box = Box(left, geo.get('y', 0) - 8, tw, 10)
            notes.append(f'overview edge {e["id"]}: label "{label}" has no room for its chip (needs a straight run of {math.ceil(w + OV_CHIP_ROOM)})')
        for g, cbox in cards.items():
            if box.overlaps(cbox):
                out.append(f'overview edge {e["id"]}: its label covers card {g}')
    return out


def fmt(p):
    return f'{round(p[0])},{round(p[1])}'


def check(d):
    """The layout's problems (a reader sees something broken) and notes (worth a look), as lines."""
    notes = []
    try:
        found = full_map(d, notes) + overview(d, notes)
    except (KeyError, TypeError, ValueError) as error:
        # render.py reports missing geometry itself; a half-written layout is not checked.
        return [f'layout could not be checked: {error!r}'], []
    return list(dict.fromkeys(found)), list(dict.fromkeys(notes))
