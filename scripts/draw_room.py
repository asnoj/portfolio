"""Chalk drawings for the dark-room intro, drawn with the claude-drawing skill (lib/chalk.py).

Each prop is drawn on its own canvas and exported as a transparent PNG (only the chalk, no slate), so it sits
on the page's dark background. Run from the project root:

    .claude/skills/claude-drawing/.venv/bin/python scripts/draw_room.py [name ...]
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, '.claude', 'skills', 'claude-drawing', 'lib'))
from chalk import Chalkboard, WHITE, YELLOW, PINK, BLUE  # noqa: E402

OUT = os.path.join(ROOT, 'public', 'room')


def board(w, h, seed):
    return Chalkboard(w, h, seed=seed)


def export(cb, name):
    """the chalk layer alone, un-premultiplied, as RGBA"""
    a = np.clip(cb.ca, 0, 1)
    rgb = np.where(a[..., None] > 1e-4, cb.cc / np.maximum(a[..., None], 1e-4), 0)
    img = np.dstack([np.clip(rgb, 0, 1), a])
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray((img * 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, f'{name}.png'), optimize=True)
    print('saved', name)


def mask(w, h, draw):
    im = Image.new('L', (w, h), 0)
    draw(ImageDraw.Draw(im))
    return np.asarray(im, np.float32) / 255


def arc(cx, cy, rx, ry, a0, a1, n=40):
    t = np.deg2rad(np.linspace(a0, a1, n))
    return [(cx + rx * np.cos(a), cy + ry * np.sin(a)) for a in t]


def spines(cx, cy, rx, ry, a0, a1, n, reach, rng):
    """zigzag between the body edge and the spine tips along an elliptical arc"""
    pts = []
    for k in range(n * 2 + 1):
        a = np.deg2rad(a0 + (a1 - a0) * k / (n * 2))
        out = reach * rng.uniform(0.88, 1.12) if k % 2 else 1.0
        pts.append((cx + np.cos(a) * rx * out, cy + np.sin(a) * ry * out))
    return pts


# ---------------------------------------------------------------- the bedroom, at 9: a hedgehog up late at the PC
def pc_hog():
    W, H = 980, 640
    cb = board(W, H, 9)
    r = np.random.default_rng(9)
    # desk
    cb.line(470, 384, 950, 380, WHITE, 6)
    cb.line(470, 398, 950, 394, WHITE, 3.4, 0.7)
    cb.line(498, 398, 494, 636, WHITE, 5)
    cb.line(924, 396, 928, 636, WHITE, 5)
    cb.box(800, 404, 912, 470, WHITE, 3.2, 0.75)
    cb.dot(856, 438, 4)
    # the CRT, glowing
    cb.box(586, 130, 860, 352, WHITE, 5.2)
    cb.box(612, 152, 834, 324, WHITE, 3, 0.75)
    glow = mask(W, H, lambda d: d.rectangle([618, 158, 828, 318], fill=255))
    cb.shade(glow, YELLOW, angle=8, stick=30, pressure=0.32, strength=0.5)
    cb.text('> hello_', 634, 206, 30, BLUE, font='sans_bold', hand=0.6)
    cb.text('world', 634, 248, 30, BLUE, font='sans_bold', hand=0.6)
    cb.stroke([(634, 284), (700, 286)], WHITE, 4)
    cb.line(690, 352, 680, 378, WHITE, 4.4)
    cb.line(756, 352, 766, 378, WHITE, 4.4)
    cb.box(540, 360, 720, 378, WHITE, 3.2, 0.8)       # keyboard
    for x in range(554, 712, 18):
        cb.line(x, 366, x + 8, 366, WHITE, 2.2, 0.6, overshoot=0.5)
    # stool
    cb.stroke([(170, 456), (270, 448), (372, 456)], WHITE, 6)
    cb.stroke([(176, 470), (272, 464), (366, 470)], WHITE, 3.4, 0.7)
    cb.line(200, 470, 184, 636, WHITE, 5)
    cb.line(342, 470, 358, 636, WHITE, 5)
    cb.line(196, 560, 346, 560, WHITE, 3.2, 0.7)
    # the hedgehog, sitting, leaning toward the screen
    cx, cy = 268, 380
    back = spines(cx, cy, 128, 104, 168, 318, 15, 1.34, r)
    body = mask(W, H, lambda d: d.polygon([(int(x), int(y)) for x, y in back] + [(356, 450), (150, 452)], fill=255))
    cb.shade(body, WHITE, angle=60, stick=26, pressure=0.22, strength=0.35)
    cb.hatch(body, WHITE, angle=58, spacing=11, width=2.4, pressure=0.62)
    cb.stroke(back, WHITE, 4.6, smooth=False)
    cb.stroke(spines(cx + 6, cy + 10, 96, 76, 176, 312, 11, 1.26, r), WHITE, 2.6, 0.7, smooth=False)
    # face and snout toward the screen
    face = [(352, 300), (392, 306), (432, 324), (474, 344), (482, 356), (466, 368), (430, 380), (392, 392), (360, 420)]
    fm = mask(W, H, lambda d: d.polygon([(int(x), int(y)) for x, y in face] + [(330, 440), (330, 300)], fill=255))
    cb.shade(fm, YELLOW, angle=0, stick=24, pressure=0.24, strength=0.45)   # the screen lights his face
    cb.stroke(face, WHITE, 4.6)
    cb.dot(482, 352, 7)                                   # nose
    cb.circle(410, 334, 10, WHITE, 3.4)                   # eye, wide awake
    cb.dot(414, 335, 4.6)
    cb.stroke([(372, 300), (380, 280), (394, 296)], WHITE, 3.4)          # ear
    cb.loop(398, 368, 14, 7, PINK, 4, 0.7, turns=1.0)                    # cheek
    cb.stroke([(428, 372), (440, 378)], WHITE, 3)                        # smile
    # arm reaching for the keyboard, feet hanging
    cb.stroke([(372, 412), (452, 396), (548, 366)], WHITE, 4.6)
    cb.stroke([(546, 360), (556, 364), (552, 372)], WHITE, 3.4)
    cb.stroke([(220, 452), (214, 492), (226, 500)], WHITE, 4.4)
    cb.stroke([(318, 454), (326, 494), (338, 500)], WHITE, 4.4)
    # sparks of the screen light
    for (x, y) in [(560, 110), (884, 120), (900, 250), (540, 220)]:
        cb.line(x - 9, y, x + 9, y, YELLOW, 2.6, 0.7, overshoot=0.5)
        cb.line(x, y - 9, x, y + 9, YELLOW, 2.6, 0.7, overshoot=0.5)
    export(cb, 'pc-hog')


def bed():
    W, H = 760, 340
    cb = board(W, H, 21)
    cb.box(20, 70, 76, 330, WHITE, 5)                       # headboard
    cb.box(76, 196, 740, 266, WHITE, 5)                     # mattress
    cb.line(96, 266, 96, 334, WHITE, 5)
    cb.line(720, 266, 720, 334, WHITE, 5)
    cb.loop(170, 176, 74, 30, WHITE, 4.4, turns=1.05)       # pillow
    blanket = [(270, 200), (330, 176), (430, 184), (540, 168), (660, 180), (736, 196), (736, 262), (270, 262)]
    bm = mask(W, H, lambda d: d.polygon([(int(x), int(y)) for x, y in blanket], fill=255))
    cb.hatch(bm, BLUE, angle=35, spacing=14, width=3, pressure=0.7)
    cb.stroke(blanket[:6] + [(736, 262)], WHITE, 4.6)
    cb.stroke([(270, 200), (262, 262)], WHITE, 4.2)
    # a teddy left on the pillow
    cb.circle(190, 140, 22, WHITE, 3.6)
    cb.circle(172, 120, 8, WHITE, 3)
    cb.circle(208, 120, 8, WHITE, 3)
    cb.dot(184, 138, 3)
    cb.dot(198, 138, 3)
    export(cb, 'bed')


def window():
    W, H = 380, 420
    cb = board(W, H, 33)
    cb.box(60, 40, 320, 340, WHITE, 5)
    cb.line(190, 44, 190, 336, WHITE, 3.6)
    cb.line(64, 190, 316, 190, WHITE, 3.6)
    moon = mask(W, H, lambda d: (d.ellipse([92, 70, 160, 138], fill=255), d.ellipse([108, 62, 176, 130], fill=0)))
    cb.shade(moon, YELLOW, angle=30, stick=20, pressure=0.6)
    for (x, y) in [(250, 90), (280, 140), (230, 250), (110, 260), (290, 280)]:
        cb.line(x - 7, y, x + 7, y, WHITE, 2.4, 0.7, overshoot=0.5)
        cb.line(x, y - 7, x, y + 7, WHITE, 2.4, 0.7, overshoot=0.5)
    cb.line(30, 30, 350, 26, WHITE, 5)                      # curtain rail
    for side, x0 in [(-1, 36), (1, 344)]:
        pts = [(x0, 30), (x0 + side * 20, 140), (x0 - side * 4, 250), (x0 + side * 22, 380)]
        cb.stroke(pts, PINK, 4.6)
        cb.stroke([(x0 - side * 30, 30), (x0 - side * 18, 140), (x0 - side * 40, 250), (x0 - side * 16, 380)], PINK, 3.4, 0.7)
    cb.line(40, 346, 340, 350, WHITE, 5)                    # sill
    export(cb, 'window')


def door():
    W, H = 300, 560
    cb = board(W, H, 41)
    cb.box(30, 20, 270, 556, WHITE, 5.4)
    cb.box(62, 60, 238, 240, WHITE, 3.4, 0.75)
    cb.box(62, 290, 238, 520, WHITE, 3.4, 0.75)
    cb.circle(232, 280, 11, YELLOW, 4)
    # a sign on the door
    cb.stroke([(150, 70), (110, 120)], WHITE, 2.4, 0.6)
    cb.stroke([(150, 70), (190, 120)], WHITE, 2.4, 0.6)
    cb.box(84, 120, 216, 176, WHITE, 3.4)
    cb.text('KEEP OUT', 150, 158, 26, PINK, anchor='ms', hand=0.8)
    export(cb, 'door')


# ---------------------------------------------------------------- today
def monitor():
    W, H = 640, 540
    cb = board(W, H, 51)
    cb.box(16, 16, 624, 440, WHITE, 6)
    cb.box(40, 38, 600, 416, WHITE, 3, 0.7)
    cb.stroke([(276, 440), (262, 500)], WHITE, 5)
    cb.stroke([(364, 440), (378, 500)], WHITE, 5)
    cb.box(196, 500, 444, 526, WHITE, 4.4)
    cb.dot(580, 428, 4, YELLOW)
    export(cb, 'monitor')


def books():
    W, H = 420, 300
    cb = board(W, H, 61)
    cb.box(20, 214, 380, 290, WHITE, 4.6)
    cb.box(44, 140, 360, 214, WHITE, 4.6)
    cb.stroke([(30, 132), (330, 70), (344, 128), (40, 140)], WHITE, 4.4, smooth=False)
    cb.text('x86-64', 200, 262, 34, YELLOW, anchor='ms')
    cb.text('K&R C', 202, 190, 34, BLUE, anchor='ms')
    cb.text('HACKING', 188, 120, 24, PINK, anchor='ms', rot=11)
    export(cb, 'books')


def mug():
    W, H = 240, 300
    cb = board(W, H, 71)
    cb.stroke([(40, 120), (46, 280), (170, 280), (176, 120)], WHITE, 5.2)
    cb.loop(108, 120, 68, 12, WHITE, 4, turns=1.04)
    cb.loop(196, 190, 26, 36, WHITE, 4.6, turns=0.9)
    cb.text('C', 108, 222, 54, YELLOW, anchor='ms')
    for x in (78, 108, 138):
        cb.stroke([(x, 96), (x - 12, 66), (x + 6, 36), (x - 4, 8)], WHITE, 3.2, 0.6)
    export(cb, 'mug')


ALL = {f.__name__.replace('_', '-'): f for f in (pc_hog, bed, window, door, monitor, books, mug)}

if __name__ == '__main__':
    for name in sys.argv[1:] or ALL:
        ALL[name]()
