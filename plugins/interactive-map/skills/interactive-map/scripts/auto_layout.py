#!/usr/bin/env python3
"""Lays out the parts of a map that `layout` leaves out. Python 3 standard library only.

usage: python3 auto_layout.py MAP.json [OUT.json] [--freeze]

render.py calls `fill(definition)` itself, so a map can simply leave geometry out. Run this
script to steer the result: it writes the map (to OUT.json, or stdout) with `layout.grid`
filled in, the cell every card was given. Edit cells and render again. With --freeze it
writes every computed position and path instead, for edits by hand in map units.

What is computed, and how to steer it:
- Cards (`layout.nodes`). Each zone becomes a block of columns; zones are ordered left to
  right along the edges (people first), and zones that would share columns stack. Inside a
  zone, cards are layered along their edges, then ordered to cut crossings and aligned so
  connected cards share a row. Cards are sized to their text, as the viewer sizes them.
  Steer it with `layout.grid`: `{"node-id": [column, row]}` puts a card in that cell of the
  map's grid (both counted from 0); listed cards keep their cell, the rest are placed around
  them. Give every card a cell to place them all yourself.
- Zones (`layout.zones`): drawn around their cards.
- Edges (`layout.edges`): routed as horizontal and vertical runs around the cards (A* search
  with a cost for each turn and for running on top of another edge), each end on the side of
  its card that gives the shortest clean path. An edge with its own `d` keeps it.
- The overview (`layout.overview`, `layout.overviewEdges`): cards in reading order on a grid
  of up to three columns, edges routed the same way.
- `layout.viewBoxes`: fitted around everything.
Anything already in `layout` is kept as written. Leaving all of `layout.nodes` out lays out
every card; writing all of them keeps your hand layout and only fills in what else is missing.
"""
import heapq
import json
import math
import random
import pathlib
import sys

import layout_check

STEP = 10                 # routing lattice, in map units
CARD_H = layout_check.CARD_H
ROW_GAP = 70              # between rows of cards: room for a run with a label chip
COL_GAP = 64              # least room between columns of one zone
ZONE_PAD = 22             # zone frame around its cards
ZONE_TOP = 44             # zone title band
ZONE_GAP = 30             # between zone frames
MARGIN = 30               # around the whole map
CLEAR = 10                # edges keep this far from cards
OVERVIEW_CARD = {'width': 270, 'height': 200}
COMPACT = 8.0             # weight of the map's size in the grid cost
STAGE_RATIO = 2.2         # width / height of the stage the map is shown in


# ---------------------------------------------------------------- ordering

def feedback_order(items, edges, first):
    """Eades-Lin-Smyth: an order of items that keeps as many edges as possible pointing forward.
    `first` scores items that should lead when the graph allows a choice (people)."""
    out = {i: {} for i in items}
    inn = {i: {} for i in items}
    for a, b, w in edges:
        if a != b:
            out[a][b] = out[a].get(b, 0) + w
            inn[b][a] = inn[b].get(a, 0) + w
    left, right, rest = [], [], list(items)
    while rest:
        changed = True
        while changed:
            changed = False
            for i in list(rest):
                if not any(j in rest for j in out[i]):
                    right.insert(0, i)
                    rest.remove(i)
                    changed = True
            for i in list(rest):
                if not any(j in rest for j in inn[i]):
                    left.append(i)
                    rest.remove(i)
                    changed = True
        if rest:
            score = lambda i: (sum(w for j, w in out[i].items() if j in rest)
                               - sum(w for j, w in inn[i].items() if j in rest) + 1000 * first(i))
            best = max(rest, key=lambda i: (score(i), -rest.index(i)))
            left.append(best)
            rest.remove(best)
    return left + right


def layers(items, edges):
    """Longest-path layers for edges already pointing forward, then each card moved to the
    layer that keeps its edges short (a cheap network-simplex pass)."""
    preds = {i: [a for a, b in edges if b == i] for i in items}
    succs = {i: [b for a, b in edges if a == i] for i in items}
    rank = {}
    for i in items:  # items are in forward order
        rank[i] = max((rank[p] + 1 for p in preds[i] if p in rank), default=0)
    for _ in range(4):
        for i in reversed(items):
            lo = max((rank[p] + 1 for p in preds[i]), default=0)
            hi = min((rank[s] - 1 for s in succs[i]), default=None)
            near = sorted(rank[j] for j in preds[i] + succs[i])
            want = near[len(near) // 2] if near else rank[i]
            if hi is None:
                hi = max(lo, want)
            rank[i] = min(max(want, lo), hi) if lo <= hi else lo
    low = min(rank.values(), default=0)
    return {i: r - low for i, r in rank.items()}


# ---------------------------------------------------------------- cards

def is_person(n):
    return n.get('shape') == 'person' or n.get('cat') == 'person'


def place_cards(d, hints):
    """Grid cells (column, row) for every card."""
    nodes = d['nodes']
    ids = [n['id'] for n in nodes]
    byid = {n['id']: n for n in nodes}
    zone_of = {n['id']: n.get('zone') or '' for n in nodes}
    pairs = [(e['from'], e['to']) for e in d['edges'] if e['from'] in byid and e['to'] in byid]

    # Zones, left to right; zones on the same layer stack.
    zone_ids = list(dict.fromkeys([z['id'] for z in d.get('zones', [])] + [zone_of[i] for i in ids]))
    zone_ids = [z for z in zone_ids if any(zone_of[i] == z for i in ids)]
    zedges = [(zone_of[a], zone_of[b], 1) for a, b in pairs if zone_of[a] != zone_of[b]]
    people = {z: any(is_person(byid[i]) for i in ids if zone_of[i] == z) for z in zone_ids}
    zorder = feedback_order(zone_ids, zedges, lambda z: people[z])
    zpos = {z: k for k, z in enumerate(zorder)}
    zlayer = layers(zorder, [(a, b) for a, b, _ in zedges if zpos[a] < zpos[b]])

    # Cards inside each zone, in a forward order over the whole map.
    order = feedback_order(ids, [(a, b, 1) for a, b in pairs], lambda i: is_person(byid[i]))
    pos = {i: k for k, i in enumerate(order)}
    local = {}
    for z in zorder:
        # Each zone gets its own forward order, so a cycle through another zone does not
        # turn an edge inside this one backwards.
        members = [i for i in order if zone_of[i] == z]
        inside = [(a, b) for a, b in pairs if zone_of[a] == z == zone_of[b]]
        entered = lambda i: any(zone_of[a] != z and zlayer[zone_of[a]] < zlayer[z] for a, b in pairs if b == i)
        members = feedback_order(members, [(a, b, 1) for a, b in inside], lambda i: entered(i) + is_person(byid[i]))
        zpos_ = {i: k for k, i in enumerate(members)}
        inner = [(a, b) for a, b in inside if zpos_[a] < zpos_[b]]
        rank = layers(members, inner)
        # A card entered from a zone further left stays at its zone's left edge.
        for i in members:
            if entered(i) and not any(b == i for a, b in inner):
                rank[i] = 0
        local.update(rank)

    # Columns: each zone layer is a block as wide as its widest zone.
    width = {}
    for z in zorder:
        width[zlayer[z]] = max(width.get(zlayer[z], 0), 1 + max(local[i] for i in ids if zone_of[i] == z))
    start, col = {}, 0
    for layer in sorted(width):
        start[layer] = col
        col += width[layer]
    column = {i: start[zlayer[zone_of[i]]] + local[i] for i in ids}
    for i, (c, _) in hints.items():
        column[i] = c

    # Rows: order each column to cut crossings, then align connected cards.
    stack = {z: k for k, z in enumerate(zorder)}
    neighbours = {i: [b for a, b in pairs if a == i] + [a for a, b in pairs if b == i] for i in ids}
    columns = {}
    for i in order:
        columns.setdefault(column[i], []).append(i)
    rows = {i: k for c in columns.values() for k, i in enumerate(c)}
    for sweep in range(6):
        cols = sorted(columns) if sweep % 2 == 0 else sorted(columns, reverse=True)
        for c in cols:
            def centre(i):
                near = [rows[j] for j in neighbours[i] if column[j] != c]
                return sum(near) / len(near) if near else rows[i]
            columns[c].sort(key=lambda i: (stack[zone_of[i]], centre(i), rows[i]))
            for k, i in enumerate(columns[c]):
                rows[i] = k
    row = align_rows(columns, neighbours, zone_of, zorder, column, hints)
    span = {}
    for z in zorder:
        layer = zlayer[z]
        span[z] = (start[layer], start[layer] + width[layer])
    column, row = improve(ids, pairs, column, row, zone_of, zorder, zlayer, span, hints, Sizer(d))
    return column, row, zorder, zlayer


def segments_cross(p, q, r, s):
    def orient(a, b, c):
        v = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        return (v > 1e-9) - (v < -1e-9)
    return (orient(p, q, r) * orient(p, q, s) < 0) and (orient(r, s, p) * orient(r, s, q) < 0)


def grid_cost(pairs, column, row, sizer=None):
    """How hard the grid is to read: long and bent edges, edges against the reading
    direction, straight edges blocked by a card, crossings, and a sprawling grid."""
    cell = {(column[i], row[i]): i for i in column}
    cost = 0.0
    for a, b in pairs:
        dx, dy = column[b] - column[a], row[b] - row[a]
        cost += abs(dx) + abs(dy)
        if dx and dy:
            cost += 1.5
        if dx < 0:
            cost += 1.0
        elif dx == 0 and dy < 0:
            cost += 0.3
        if dx == 0 or dy == 0:
            n = max(abs(dx), abs(dy))
            for k in range(1, n):
                if (column[a] + dx // n * k, row[a] + dy // n * k) in cell:
                    cost += 3
    lines = [((column[a], row[a]), (column[b], row[b]), a, b) for a, b in pairs]
    for k, (p, q, a, b) in enumerate(lines):
        for r, s, c, d in lines[k + 1:]:
            if len({a, b, c, d}) == 4 and segments_cross(p, q, r, s):
                cost += 1.5
    cols, rows = len(set(column.values())), len(set(row.values()))
    if sizer:
        # The map has to fit a wide stage: whichever side is longer for that shape sets
        # how small the text gets at "Fit", so it costs the most.
        _, _, width, height = sizer.lines(column, row)
        cost += COMPACT * max(width / STAGE_RATIO, height) / (CARD_H + ROW_GAP)
    cost += 0.3 * (cols + rows)
    return cost


def improve(ids, pairs, column, row, zone_of, zorder, zlayer, span, hints, sizer=None):
    """Hill climbing on the grid: move a card to a free cell of its zone's columns, or swap
    two cards of one zone, while that makes the map easier to read. Stacked zones keep
    their order; cards placed with layout.grid stay put."""
    column, row = dict(column), dict(row)
    rows = max(row.values()) + 2
    stacks = {}
    for z in zorder:
        stacks.setdefault(zlayer[z], []).append(z)

    def valid():
        for layer in stacks.values():
            for upper, lower in zip(layer, layer[1:]):
                up = [row[i] for i in ids if zone_of[i] == upper]
                low = [row[i] for i in ids if zone_of[i] == lower]
                if up and low and max(up) >= min(low):
                    return False
        return True

    cost = lambda: grid_cost(pairs, column, row, sizer)
    best = cost()
    column, row, best = anneal(ids, pairs, column, row, zone_of, span, hints, rows, valid, best, sizer)
    for _ in range(12):
        improved = False
        for i in ids:
            if i in hints:
                continue
            lo, hi = span[zone_of[i]]
            cell = {(column[j], row[j]): j for j in ids}
            for c in range(lo, hi):
                for r in range(rows):
                    other = cell.get((c, r))
                    if other == i or (other and (other in hints or zone_of[other] != zone_of[i])):
                        continue
                    old = column[i], row[i]
                    column[i], row[i] = c, r
                    if other:
                        column[other], row[other] = old
                    now = grid_cost(pairs, column, row, sizer) if valid() else math.inf
                    if now < best - 1e-9:
                        best, improved = now, True
                        cell = {(column[j], row[j]): j for j in ids}
                    else:
                        if other:
                            column[other], row[other] = c, r
                        column[i], row[i] = old
        if not improved:
            break
    # Drop empty rows and columns.
    for axis in (column, row):
        used = sorted(set(axis.values()))
        squeeze = {v: k for k, v in enumerate(used)}
        for i in axis:
            axis[i] = squeeze[axis[i]]
    return column, row


def anneal(ids, pairs, column, row, zone_of, span, hints, rows, valid, cost, sizer=None, steps=6000):
    """Simulated annealing over the same moves as the hill climb, with a fixed seed so the
    same map always gets the same layout. Escapes the local optima a one-card move cannot
    leave, such as a whole column that could be folded into its neighbours."""
    rng = random.Random(7)
    free = [i for i in ids if i not in hints]
    if not free:
        return column, row, cost
    best = (cost, dict(column), dict(row))
    for k in range(steps):
        heat = 2.0 * (1 - k / steps) + 0.02
        i = rng.choice(free)
        lo, hi = span[zone_of[i]]
        c, r = rng.randrange(lo, hi), rng.randrange(rows)
        cell = {(column[j], row[j]): j for j in ids}
        other = cell.get((c, r))
        if other == i or (other and (other in hints or zone_of[other] != zone_of[i])):
            continue
        old = column[i], row[i]
        column[i], row[i] = c, r
        if other:
            column[other], row[other] = old
        new = grid_cost(pairs, column, row, sizer) if valid() else math.inf
        if new <= cost or rng.random() < math.exp((cost - new) / heat):
            cost = new
            if new < best[0]:
                best = (new, dict(column), dict(row))
        else:
            if other:
                column[other], row[other] = c, r
            column[i], row[i] = old
    return best[1], best[2], best[0]


def align_rows(columns, neighbours, zone_of, zorder, column, hints):
    """Integer rows: each card as close to the median row of its neighbours as the cards above
    it in its column allow; zones stacked in one column never interleave."""
    row = {i: k for c in columns.values() for k, i in enumerate(c)}
    row.update({i: r for i, (_, r) in hints.items()})
    for _ in range(8):
        for c in sorted(columns):
            prev = -1
            for i in columns[c]:
                if i in hints:
                    prev = row[i]
                    continue
                near = sorted(row[j] for j in neighbours[i] if column[j] != column[i])
                want = near[(len(near) - 1) // 2] if near else row[i]
                row[i] = max(prev + 1, round(want))
                prev = row[i]
        # Stacked zones: a zone starts below every row of the zones above it in its columns.
        for k, z in enumerate(zorder):
            mine = [i for i in row if zone_of[i] == z]
            cols = {column[i] for i in mine}
            above = [row[i] for i in row if zone_of[i] in zorder[:k] and column[i] in cols]
            if above and mine:
                shift = max(above) + 1 - min(row[i] for i in mine)
                if shift > 0:
                    for i in mine:
                        if i not in hints:
                            row[i] += shift
        # Pull everything up when no row is used at the top.
        low = min(row.values())
        if low > 0:
            for i in row:
                if i not in hints:
                    row[i] -= low
        # Two cards in one cell: push the later one down.
        for c in columns.values():
            taken = set()
            for i in sorted(c, key=lambda i: row[i]):
                while row[i] in taken:
                    row[i] += 1
                taken.add(row[i])
    return row


def card_size(n):
    w = max(layout_check.CARD_MIN_W, math.ceil(max(layout_check.text_width(n.get('tool', ''), 600, 13.5),
                                                   layout_check.text_width(n.get('concept', ''), 600, 13.5))
                                               + layout_check.CARD_PAD_W))
    return w + (layout_check.QUEUE_EXTRA if n.get('shape') == 'queue' else 0), CARD_H


def chip_room(label, size=9.5, weight=500, pad=layout_check.CHIP_PAD, room=layout_check.CHIP_ROOM):
    return layout_check.text_width(label, weight, size) + pad + room if label else 0


class Sizer:
    """Turns grid cells into map units: column widths from the cards' text, gaps wide enough
    for the labels that cross them, extra room where zones meet. Cheap enough to run inside
    the grid search, so the search can weigh the map's real size."""

    def __init__(self, d):
        nodes = {n['id']: n for n in d['nodes']}
        self.size = {i: card_size(n) for i, n in nodes.items()}
        self.zone_of = {i: n.get('zone') or '' for i, n in nodes.items()}
        self.labelled = [(e['from'], e['to'], chip_room(e['label'])) for e in d['edges']
                         if e.get('label') and e['from'] in nodes and e['to'] in nodes]
        self.has_zones = any(self.zone_of.values())

    def lines(self, column, row):
        cols, rows = sorted(set(column.values())), sorted(set(row.values()))
        ci, ri = {c: k for k, c in enumerate(cols)}, {r: k for k, r in enumerate(rows)}
        colw, zcol = [168] * len(cols), [set() for _ in cols]
        for i, c in column.items():
            colw[ci[c]] = max(colw[ci[c]], self.size[i][0])
            zcol[ci[c]].add(self.zone_of[i])
        gaps = [COL_GAP] * len(cols)
        for k in range(len(cols) - 1):
            if zcol[k] != zcol[k + 1] and (zcol[k] - {''} or zcol[k + 1] - {''}):
                gaps[k] = max(gaps[k], 2 * ZONE_PAD + ZONE_GAP)
        extra = [0] * len(rows)
        for a, b, room in self.labelled:
            ka, kb = ci[column[a]], ci[column[b]]
            if row[a] == row[b] and abs(ka - kb) == 1:
                gaps[min(ka, kb)] = max(gaps[min(ka, kb)], room + STEP)
            ra, rb = ri[row[a]], ri[row[b]]
            if ka == kb and abs(ra - rb) == 1:
                extra[max(ra, rb)] = max(extra[max(ra, rb)], room + STEP - ROW_GAP)
        # Zones stacked in one column: room for the frame, a gap and the next title.
        stacked = ZONE_PAD + ZONE_GAP + ZONE_TOP - ROW_GAP
        if stacked > 0:
            above = {}
            for i, r in row.items():
                above.setdefault((ci[column[i]], ri[r]), self.zone_of[i])
            for (k, r), z in above.items():
                if r and (k, r - 1) in above and above[(k, r - 1)] != z:
                    extra[r] = max(extra[r], stacked)
        x, colx = MARGIN + ZONE_PAD, []
        for k in range(len(cols)):
            colx.append(x)
            x += colw[k] + (gaps[k] if k < len(cols) - 1 else 0)
        y, rowy = MARGIN + (ZONE_TOP if self.has_zones else 0), []
        for k in range(len(rows)):
            y += max(0, extra[k])
            rowy.append(y)
            y += CARD_H + ROW_GAP
        width = x + ZONE_PAD + MARGIN
        height = y - ROW_GAP + ZONE_PAD + MARGIN
        return (ci, colx, colw), (ri, rowy), width, height


def pixels(d, column, row, zorder, zlayer):
    """Card boxes and zone frames in map units."""
    nodes = {n['id']: n for n in d['nodes']}
    zone_of = {i: n.get('zone') or '' for i, n in nodes.items()}
    sizer = Sizer(d)
    size = sizer.size
    (ci, colx, colw), (ri, rowy), _, _ = sizer.lines(column, row)
    column = {i: ci[c] for i, c in column.items()}
    row = {i: ri[r] for i, r in row.items()}
    cards = {}
    for i in nodes:
        w, h = size[i]
        cx = colx[column[i]] + colw[column[i]] / 2
        # Centres on the lattice, so ports and runs line up.
        cx = round(cx / STEP) * STEP
        cy = round((rowy[row[i]] + h / 2) / STEP) * STEP
        cards[i] = layout_check.Box(cx - w / 2, cy - h / 2, w, h)
    # Zones that share a layer and stand in the same columns share their width, so stacked
    # zones line up. A zone that layout.grid moved into other columns keeps its own width.
    span = {}
    for i in nodes:
        if zone_of[i]:
            lo, hi = span.get(zone_of[i], (cards[i].x, cards[i].r))
            span[zone_of[i]] = (min(lo, cards[i].x), max(hi, cards[i].r))
    group = {z: {z} for z in span}
    changed = True
    while changed:
        changed = False
        for a in span:
            for b in span:
                if b not in group[a] and zlayer[a] == zlayer[b] and \
                        min(span[a][1], span[b][1]) > max(span[a][0], span[b][0]):
                    merged = group[a] | group[b]
                    for z in merged:
                        group[z] = merged
                    changed = True
    zones = {}
    for z in zorder:
        if not z:
            continue
        mine = [cards[i] for i in nodes if zone_of[i] == z]
        peers = [cards[i] for i in nodes if zone_of[i] in group[z]]
        left = min(b.x for b in peers) - ZONE_PAD
        right = max(b.r for b in peers) + ZONE_PAD
        top = min(b.y for b in mine) - ZONE_TOP
        bottom = max(b.b for b in mine) + ZONE_PAD
        zones[z] = layout_check.Box(left, top, right - left, bottom - top)
    return cards, zones


# ---------------------------------------------------------------- routing

DIRS = ((1, 0), (0, 1), (-1, 0), (0, -1))  # right, down, left, up
SIDE_DIR = {'r': 0, 'b': 1, 'l': 2, 't': 3}


class Router:
    """Orthogonal edge routing on a lattice: A* over (point, heading) with costs for length,
    turns, running along another edge, crossing one, and passing close to a card."""

    TURN, ALONG, CROSS, NEAR, AVOID, PORT_REUSE, OFF_CENTRE = 7, 12, 3, 2, 40, 25, 1

    def __init__(self, boxes, width, height, soft=()):
        self.boxes = boxes
        self.nx, self.ny = int(width // STEP) + 1, int(height // STEP) + 1
        self.blocked = set()
        for b in boxes.values():
            for ix in range(max(0, math.ceil((b.x - CLEAR) / STEP)), min(self.nx, math.floor((b.r + CLEAR) / STEP) + 1)):
                for iy in range(max(0, math.ceil((b.y - CLEAR) / STEP)), min(self.ny, math.floor((b.b + CLEAR) / STEP) + 1)):
                    self.blocked.add((ix, iy))
        self.soft = set()
        for b in soft:  # zone titles: avoid, but may cross
            for ix in range(math.floor(b.x / STEP), math.ceil(b.r / STEP) + 1):
                for iy in range(math.floor(b.y / STEP), math.ceil(b.b / STEP) + 1):
                    self.soft.add((ix, iy))
        self.along = {}   # (cell, axis) -> edges using it
        self.cells = {}   # cell -> axes used there
        self.ports = {}   # (node, side, offset) -> times used
        self.avoid = set()  # cells under label chips
        self.taken = {}   # edge key -> what route() marked, so it can be undone

    def ports_of(self, node):
        """(side, border point, first free lattice cell, offset index) for each port of a card."""
        b = self.boxes[node]
        cx, cy = round((b.x + b.w / 2) / STEP), round((b.y + b.h / 2) / STEP)
        out = []
        for side in 'lrtb':
            if side in 'lr':
                offsets = [0, -2, 2]
                for k in offsets:
                    iy = cy + k
                    y = iy * STEP
                    if not (b.y + 14 <= y <= b.b - 14):
                        continue
                    if side == 'r':
                        ix = math.floor((b.r + CLEAR) / STEP) + 1
                        out.append((side, (b.r, y), (ix, iy), abs(k)))
                    else:
                        ix = math.ceil((b.x - CLEAR) / STEP) - 1
                        out.append((side, (b.x, y), (ix, iy), abs(k)))
            else:
                half = int((b.w / 2 - 20) // (2 * STEP))
                for k in sorted(range(-half, half + 1), key=abs):
                    ix = cx + 2 * k
                    x = ix * STEP
                    if side == 'b':
                        iy = math.floor((b.b + CLEAR) / STEP) + 1
                        out.append((side, (x, b.b), (ix, iy), abs(k)))
                    else:
                        iy = math.ceil((b.y - CLEAR) / STEP) - 1
                        out.append((side, (x, b.y), (ix, iy), abs(k)))
        return [p for p in out if 0 <= p[2][0] < self.nx and 0 <= p[2][1] < self.ny]

    def route(self, a, b, key=None):
        key = key or a + '>' + b
        starts = self.ports_of(a)
        goals = {}
        for side, point, cell, k in self.ports_of(b):
            heading = (SIDE_DIR[side] + 2) % 4  # arriving into the card
            cost = self.OFF_CENTRE * k + self.PORT_REUSE * self.ports.get((b, side, k), 0)
            goals.setdefault(cell, []).append((heading, cost, side, point, k))
        tx = sum(c[0] for c in goals) / max(1, len(goals))
        ty = sum(c[1] for c in goals) / max(1, len(goals))
        heap, best, came = [], {}, {}
        for side, point, cell, k in starts:
            heading = SIDE_DIR[side]
            g = self.OFF_CENTRE * k + self.PORT_REUSE * self.ports.get((a, side, k), 0)
            state = (cell, heading)
            if g < best.get(state, 1e18):
                best[state] = g
                came[state] = ('start', side, point, k)
                heapq.heappush(heap, (g + abs(cell[0] - tx) + abs(cell[1] - ty), g, state))
        found = None
        while heap:
            f, g, state = heapq.heappop(heap)
            if g > best.get(state, 1e18):
                continue
            cell, heading = state
            if found and f >= found[0]:
                break
            for goal in goals.get(cell, ()):
                total = g + goal[1] + (0 if goal[0] == heading else self.TURN)
                if not found or total < found[0]:
                    found = (total, state, goal)
            for turn, (dx, dy) in enumerate(DIRS):
                if turn == (heading + 2) % 4:
                    continue
                nxt = (cell[0] + dx, cell[1] + dy)
                if not (0 <= nxt[0] < self.nx and 0 <= nxt[1] < self.ny) or (nxt in self.blocked and nxt not in goals):
                    continue
                axis = turn % 2
                step = 1 + (self.TURN if turn != heading else 0)
                step += self.ALONG * len(self.along.get((cell, nxt), ()))
                if any(ax != axis and users for ax, users in self.cells.get(nxt, {}).items()):
                    step += self.CROSS
                # A lane right beside another edge reads as one thick line.
                side = (nxt[0] + dy, nxt[1] + dx), (nxt[0] - dy, nxt[1] - dx)
                if any(self.cells.get(c, {}).get(axis) for c in side):
                    step += self.NEAR
                if nxt in self.avoid:
                    step += self.AVOID
                if nxt in self.soft:
                    step += 2
                ng = g + step
                ns = (nxt, turn)
                if ng < best.get(ns, 1e18):
                    best[ns] = ng
                    came[ns] = state
                    heapq.heappush(heap, (ng + abs(nxt[0] - tx) + abs(nxt[1] - ty), ng, ns))
        if not found:
            return None
        _, state, (heading, _, side_b, point_b, kb) = found
        cells = []
        while True:
            cells.append(state[0])
            prev = came[state]
            if prev[0] == 'start':
                _, side_a, point_a, ka = prev
                break
            state = prev
        cells.reverse()
        marks = []
        for c0, c1 in zip(cells, cells[1:]):
            axis = 0 if c0[1] == c1[1] else 1
            self.along.setdefault((c0, c1), set()).add(key)
            self.along.setdefault((c1, c0), set()).add(key)
            self.cells.setdefault(c0, {}).setdefault(axis, set()).add(key)
            self.cells.setdefault(c1, {}).setdefault(axis, set()).add(key)
            marks.append((c0, c1, axis))
        self.ports[(a, side_a, ka)] = self.ports.get((a, side_a, ka), 0) + 1
        self.ports[(b, side_b, kb)] = self.ports.get((b, side_b, kb), 0) + 1
        self.taken[key] = (marks, [(a, side_a, ka), (b, side_b, kb)])
        pts = [point_a] + [(c[0] * STEP, c[1] * STEP) for c in cells] + [point_b]
        return simplify(pts)

    def remove(self, key):
        marks, ports = self.taken.pop(key, ([], []))
        for c0, c1, axis in marks:
            self.along.get((c0, c1), set()).discard(key)
            self.along.get((c1, c0), set()).discard(key)
            for c in (c0, c1):
                self.cells.get(c, {}).get(axis, set()).discard(key)
        for port in ports:
            self.ports[port] -= 1


def chip_box(label, pts, overview=False):
    if not label or len(pts) < 2:
        return None
    if overview:
        w = layout_check.text_width(label, 600, 12) + layout_check.OV_CHIP_PAD
        h = layout_check.OV_CHIP_H
    else:
        w = layout_check.text_width(label, 500, 9.5) + layout_check.CHIP_PAD
        h = layout_check.CHIP_H
    run = layout_check.longest_run([list(p) for p in pts])
    return layout_check.Box(run[2] - w / 2, run[3] - h / 2, w, h)


def cells_of(box, grow=0.0):
    return {(ix, iy) for ix in range(math.floor((box.x - grow) / STEP), math.ceil((box.r + grow) / STEP) + 1)
            for iy in range(math.floor((box.y - grow) / STEP), math.ceil((box.b + grow) / STEP) + 1)}


def route_all(router, edges, overview=False, rounds=4):
    """Route every edge, then rip up and reroute the ones whose label would be unreadable:
    an edge drawn through another edge's label chip, or an edge whose own chip would sit on a
    card (its longest run passes too close to it). Chips and the ground beside such cards
    become costly for the rerouted edge."""
    paths = {}
    for e in edges:
        pts = router.route(e['from'], e['to'], e['id'])
        if pts:
            paths[e['id']] = pts
    byid = {e['id']: e for e in edges}
    for _ in range(rounds):
        chips = {k: chip_box(byid[k].get('label'), pts, overview) for k, pts in paths.items()}
        crossing = {k for k, pts in paths.items()
                    if any(b and o != k and any(b.shrink(1).hits(p, q) for p, q in zip(pts, pts[1:]))
                           for o, b in chips.items())}
        covering = {k: [n for n, box in router.boxes.items() if chips[k].overlaps(box.shrink(1))]
                    for k in paths if chips[k]}
        covering = {k: v for k, v in covering.items() if v}
        bad = sorted(crossing | set(covering))
        if not bad:
            break
        taken = set().union(*(cells_of(b) for b in chips.values() if b))
        for k in bad:
            router.remove(k)
            avoid = taken - (cells_of(chips[k]) if chips[k] else set())
            for n in covering.get(k, ()):
                avoid |= cells_of(router.boxes[n], chips[k].w / 2 + 4) - router.blocked
            router.avoid = avoid
            pts = router.route(byid[k]['from'], byid[k]['to'], k)
            if pts:
                paths[k] = pts
    router.avoid = set()
    return paths


def simplify(pts):
    out = []
    for p in pts:
        p = (round(p[0], 1), round(p[1], 1))
        if out and p == out[-1]:
            continue
        if len(out) >= 2 and ((out[-2][0] == out[-1][0] == p[0]) or (out[-2][1] == out[-1][1] == p[1])):
            out[-1] = p
        else:
            out.append(p)
    return out


def path_d(pts):
    num = lambda v: str(int(v)) if float(v).is_integer() else str(v)
    return ' '.join(f'{"L" if k else "M"}{num(x)},{num(y)}' for k, (x, y) in enumerate(pts))


# ---------------------------------------------------------------- overview

def overview_layout(d, lay):
    groups = [b['g'] for b in d.get('overview', [])]
    card = lay.setdefault('overviewCard', dict(OVERVIEW_CARD))
    bw, bh = card['width'], card['height']
    n = len(groups)
    cols = n if n <= 3 else math.ceil(n / 2) if n <= 8 else 4
    labels = [e.get('label', '') for e in d.get('overviewEdges', [])]
    gap_x = max(150, max([chip_room(t, 12, 600, layout_check.OV_CHIP_PAD, layout_check.OV_CHIP_ROOM) for t in labels], default=0) + 20)
    gap_y = 110
    boxes = {}
    placed = lay.setdefault('overview', {})
    for k, g in enumerate(groups):
        if g not in placed:
            placed[g] = {'x': 60 + (k % cols) * (bw + gap_x), 'y': 40 + (k // cols) * (bh + gap_y)}
        boxes[g] = layout_check.Box(placed[g]['x'], placed[g]['y'], bw, bh)
    width = max(b.r for b in boxes.values()) + 60 if boxes else 600
    height = max(b.b for b in boxes.values()) + 40 if boxes else 400
    lay.setdefault('viewBoxes', {}).setdefault('map0', [round(width), round(height)])
    router = Router(boxes, width, height)
    edges = lay.setdefault('overviewEdges', {})
    todo = [e for e in sorted(d.get('overviewEdges', []), key=lambda e: centre_gap(boxes, e))
            if e['id'] not in edges and e['from'] in boxes and e['to'] in boxes]
    for key, pts in route_all(router, todo, overview=True).items():
        run = layout_check.longest_run([list(p) for p in pts])
        x, y = (run[2], run[3] - 13) if run[1] else (run[2] + 14, run[3] + 4)
        edges[key] = {'d': path_d(pts), 'x': round(x), 'y': round(y), 'anchor': 'middle' if run[1] else 'start'}


def centre_gap(boxes, e):
    a, b = boxes.get(e['from']), boxes.get(e['to'])
    if not a or not b:
        return 0
    return abs(a.x + a.w / 2 - b.x - b.w / 2) + abs(a.y + a.h / 2 - b.y - b.h / 2)


# ---------------------------------------------------------------- entry points

def fill(d, keep_grid=False):
    """The definition with every missing piece of `layout` computed. Returns a new dict."""
    d = json.loads(json.dumps(d))
    lay = d.setdefault('layout', {})
    nodes = {n['id']: n for n in d.get('nodes', [])}
    given = lay.setdefault('nodes', {})
    hints = {i: tuple(v) for i, v in (lay.get('grid') or {}).items() if i in nodes}
    if nodes and not all(i in given for i in nodes):
        column, row, zorder, zlayer = place_cards(d, hints)
        lay['grid'] = {i: [column[i], row[i]] for i in nodes}
        cards, zones = pixels(d, column, row, zorder, zlayer)
        for i, b in cards.items():
            given.setdefault(i, {'x': round(b.x), 'y': round(b.y), 'w': round(b.w), 'h': round(b.h)})
        for z, b in zones.items():
            lay.setdefault('zones', {}).setdefault(z, {'x': round(b.x), 'y': round(b.y), 'w': round(b.w), 'h': round(b.h)})
    cards = {i: layout_check.Box(g['x'], g['y'], g['w'], g['h']) for i, g in given.items() if i in nodes}
    zone_boxes = {z: layout_check.Box(g['x'], g['y'], g['w'], g['h']) for z, g in (lay.get('zones') or {}).items()}
    everything = list(cards.values()) + list(zone_boxes.values())
    width = max((b.r for b in everything), default=600) + MARGIN
    height = max((b.b for b in everything), default=400) + MARGIN
    edges = lay.setdefault('edges', {})
    todo = [e for e in d.get('edges', []) if 'd' not in edges.get(e['id'], {}) and e['from'] in cards and e['to'] in cards]
    if todo:
        titles = [layout_check.zone_title(zone_boxes[z['id']], z) for z in d.get('zones', []) if z['id'] in zone_boxes]
        router = Router(cards, width + 200, height + 200, titles)
        # Existing paths count as taken.
        for e in d.get('edges', []):
            if 'd' in edges.get(e['id'], {}):
                mark(router, layout_check.points(edges[e['id']]['d']))
        for e, pts in route_all(router, sorted(todo, key=lambda e: centre_gap(cards, e))).items():
            edges[e] = {'d': path_d(pts), **edges.get(e, {})}
    lay.setdefault('viewBoxes', {}).setdefault('map', [round(width), round(height)])
    overview_layout(d, lay)
    lay.setdefault('overviewCard', dict(OVERVIEW_CARD))
    if not keep_grid:
        lay.pop('grid', None)  # a hint for this script; the page does not read it
    return d


def mark(router, pts):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        steps = int(max(abs(x1 - x0), abs(y1 - y0)) // STEP)
        if steps == 0 or (x0 != x1 and y0 != y1):
            continue
        dx, dy = (x1 - x0) / steps / STEP, (y1 - y0) / steps / STEP
        cells = [(round(x0 / STEP + dx * k), round(y0 / STEP + dy * k)) for k in range(steps + 1)]
        for c0, c1 in zip(cells, cells[1:]):
            router.along.setdefault((c0, c1), set()).add('fixed')
            router.along.setdefault((c1, c0), set()).add('fixed')
            router.cells.setdefault(c0, {}).setdefault(0 if y0 == y1 else 1, set()).add('fixed')


def main(argv):
    args = [a for a in argv[1:] if a != '--freeze']
    if not args:
        sys.exit(__doc__.split('\n\n')[1])
    source = json.loads(sys.stdin.read() if args[0] == '-' else pathlib.Path(args[0]).read_text(encoding='utf-8'))
    done = fill(source, keep_grid=True)
    if '--freeze' not in argv:
        # Only the grid: render.py recomputes the rest from it, so editing a cell is enough.
        authored = source.get('layout') or {}
        lay = done['layout']
        for key in ('nodes', 'edges', 'zones', 'overview', 'overviewEdges'):
            lay[key] = {k: v for k, v in lay.get(key, {}).items() if k in (authored.get(key) or {})}
            if not lay[key]:
                del lay[key]
        lay['viewBoxes'] = {k: v for k, v in lay.get('viewBoxes', {}).items() if k in (authored.get('viewBoxes') or {})}
        if not lay['viewBoxes']:
            del lay['viewBoxes']
        if 'overviewCard' not in authored:
            lay.pop('overviewCard', None)
    text = json.dumps(done, ensure_ascii=False, indent=1)
    if len(args) > 1:
        pathlib.Path(args[1]).write_text(text + '\n', encoding='utf-8')
    else:
        print(text)


if __name__ == '__main__':
    main(sys.argv)
