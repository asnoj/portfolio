# Design: La Chute

Scrolling is falling. The page is one vertical descent through hand-drawn dream strata, from a white pencil "surface" down to a black floor where the contact waits. Original drawing inspired by the mood of OMORI (pencil line, pastel dream vs black-and-white void). No asset from the game. The mascot is a hedgehog (hérisson), Jonas’s own identity across his GitHub (hedgepass, hedgemon, ASCII hedgehogs in the READMEs).

## Tokens (src/index.css)

One world, cyber-focused content. The page goes from paper at the surface to the void at the floor.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f6f3ec` | ground |
| `--ink` | `#1c1a21` | line, text |
| `--ink-soft` | `#4b4654` | secondary text (≥ 4.5:1) |
| `--void-ink` | `#0f0e13` | the hole, the fall, the floor |
| `--a1` `#b7a3e3` lavender · `--a2` `#95d5bf` mint · `--a3` `#f0b48f` peach · `--a4` `#95c3e8` sky | | crayon hatching only |
| `--ring` | `#7458c9` | crayon circles, link hover, focus |
| `--night` / `--night-deep` | `#6b36e8` / `#4c1fc0` | the dream sky (hero only), with a CSS star-dust field |
| `--land` / `--land-deep` | `#3a1c98` / `#24106a` | the ground the well is dug into |
| `--star` / `--glow` | `#fff6ff` / `#ff9fe8` | white-line drawings in the sky, their pink glow |
| `--grass` / bush | `#8fe3d6`, hatch `#7fd9d4`/`#4fb0bf` | grass on the well's lip, teal bushes |
| `--s1`…`--s4` | `#f6f3ec` → `#cfc8bc` | one background per stratum, darker as you go down |

## Type

- **Fraunces Variable** (`--display`, opsz axis, via `@fontsource-variable/fraunces`): the name and every title (h1–h3), weight 600. Replaced the pencil fonts (Cabin Sketch, Schoolbell) on 2026-11-20: the user wanted something more classic.
- **Fraunces italic** (`--hand`, every `--hand` rule sets `font-style: italic`): annotations, labels, buttons. Nav and meter stay upright.
- **Atkinson Hyperlegible Next** (variable): body text only.
- French punctuation: narrow no-break space (U+202F) before `?`.
- Name: `clamp(4.4rem, 14.5vw, 14rem)`, letters breathe at rest. Chapter titles `clamp(3.2rem, 8.4vw, 7.6rem)`.

## Drawing technique

- All drawings are inline SVG built from `strokePath`, `roughRect`, `roughEllipse` (`src/components/sketch.jsx`), seeded so they are stable.
- `.sketch` applies a static `filter: url(#boil)` (turbulence displacement) to still drawings only. Never on anything that moves or is large: SVG `url()` filters run on the CPU and re-rasterize on every change.
- Colour sits inside the lines as crayon hatching (`url(#hatch-a1..a4)`), never as flat fills.
- Paper grain: fixed noise overlay (`body::after`), plain opacity, no blend mode.

## Dream garden (drawn, not pixel)

Mood-referenced on the user's `exemple*.jpg` screenshots: saturated violet space, worlds, white-line furniture adrift, glowing lamp posts, round teal trees with pink trunks, pastel flowers. A first pixel-art pass looked pasted on, so on 2026-11-20 everything was redrawn in the site's own hand: line around, crayon hatching inside (`Planet`, `TreeLine`, `Flowers`, `LampPost` in `drawings.jsx`; dream patterns `tree`, `trunk`, `p-*` in `SketchDefs`).

- Composition is organic, never symmetric: three depths everywhere (the big world rises behind the forest, small ones recede; lamps near / mid / far; flower patches small at the horizon, large in front). The tree line thins out in the middle so the name and the well breathe.
- The line of a dream drawing follows `--star`; `.on-paper` swaps it to `--ink` so the same drawings live in the paper strata.
- Each stratum keeps one or two drawings in its margin (`Deco`, drifting with `data-drift` on wide screens, hidden on phones), and the floor is a whole room (see below).
- Perf: all of it is static SVG (no boil filter, no animation inside an SVG). Only the worlds float and the lamp halos pulse (transform / opacity), and the hero pieces that move in the fall have `will-change: transform`.

## The night before the well (2026-11-20)

Once the room gives way, the night is never empty: a hand-scattered `StarField` (no more grid of dots, also used in the hero) and two layers of white-line objects (`.night-far` small and dimmer, `.night-near` big and glowing, kept clear of the text column and the meter) rise past you, already full when the night fades in. `SpaceObject` was redrawn in light perspective (bed with headboard and folded blanket, open book, cut crystal, gem, gridded satellite, table with vase and flower, ringed planet, cratered moon, star, seed…), with a double pink glow under the white line (the wider glow is dropped on paper). Intro lines: "chapitre 0 / depuis mes 9 ans", and the last line is "Préparez-vous à la descente. / Projets, outils, parcours : tout est en bas." (the user found the "bas niveau" pun too jargon-heavy for recruiters)

## The floor: a room to talk in (2026-11-21)

The user asked to drop the braille ASCII hedgehog at the floor and make the end a very cozy place to talk, with a computer. `CozyRoom` (`src/components/room.jsx`) is one static SVG (1260 × 420, drawn with the sketch helpers and dream hatchings) under the links: a big plant, a reading lamp with a fabric shade, a lavender armchair with a rose blanket where the hedgehog sits (breathing), a little table with tea and a candle, a mint pouf across from it (the visitor's seat), a chess game left halfway on the rug, a framed mountain, a desk with a lamp, the CV books and the computer on, a string of lights, a night window with curtains, a tall plant. Everything that moves is an HTML layer in the same coordinates (pools of light, bulbs, flame, steam, motes, the cursor); the screen types `~/terrier $ ./discuter … > un thé ?` when the room comes into view. "Remonter à la surface" hangs top right on wide screens. On phones the room is cropped to the armchair and the desk.

## Performance rules

- Idle loops animate only `transform` / `opacity` on HTML or root `<svg>` elements (compositor). Never animate inside an SVG (a layout per frame) except the burrow hedgehog's feet while it walks.
- No `mix-blend-mode` on fixed layers. Nav and meter switch colour by class.
- Pointer handlers are rAF-throttled and write only to the moving elements, never to a CSS variable on a big container.
- Scroll handlers read no layout: positions come from ScrollTrigger (`refreshPriority: -1` for triggers measured after pins), and DOM writes happen only when a value changes.
- The hero's idle loops pause (`.calm`) once the hole has swallowed the screen.

## Motion grammar

-1. **Above the clouds** (`.sky`, pinned 360%, scrubbed): on arrival a cloud curtain parts and the first line rises letter by letter while a hedgehog drifts down under a paper parachute. Scrolling sinks you through the sea of clouds (a short white-out), clouds fly at you from the distance, four lines come and go ("Plus on descend, plus c’est bas niveau."), and the dusk turns into the night of the well. The meter shows altitude (+1200 m → 0) above the well.
0. **The edge** (idle, before any scroll): mood-referenced on two OMORI wallpapers the user supplied (saturated violet, star dust, white-line floating objects with a pink glow, teal bushes), drawn originally: the objects are Jonas's own (lock, key, floppy, satellite, pawn, note, book, crystal, planet, rock). The name in white, a ground band, a well dug into it (back wall, depth gradient, grass on the lip, a stone), the hedgehog on the lip. Objects float, sparkles twinkle, two parallax layers follow the mouse, the hedgehog breathes and hops on click.
1. **The fall** (hero, pinned 230%, scrubbed): letters fly up, the hedgehog leans, rolls into a spiky ball and drops into the hole, the hole swallows the screen, a black veil fades in as the well grows (its walls would otherwise fill the screen on phones), the name's letters fly off the top and fade, then 30 doodles stream past in the dark, each crossing at its own moment.
2. **Debris**: `[data-drift]` elements drift upward faster than the scroll (desktop only).
3. **Landing**: chapter titles settle letter by letter.
4. **Pencil**: leader lines and the rope draw themselves (stroke-dashoffset scrub).
5. **The burrow** (desktop): first the way in, pinned for 170 % of a screen: the surface seen from the side (paper sky, a mound with a dark den, hatched earth keeping a floppy, a key, a lock…, a "le terrier" signpost, `BurrowGate` in `drawings.jsx`). The hedgehog trots to the den, curls up and hops in with a puff, the camera dives into the den (the box scales around it), the tunnel opens in the dark like an eye (`clip-path` circle on `.burrow-inside`, a pencil ring riding its edge), and the hedgehog drops in from the roof with a bounce. Then a pinned underground tunnel; scrolling down moves the track sideways while a hedgehog walks along the floor past every repo tag. On phones it becomes a vertical root: groups follow a dashed line downwards, the 42 cursus collapses into name chips.

Lenis smooth scroll drives ScrollTrigger. Everything is visible by default; `prefers-reduced-motion` removes the pin, the boil, the drift and the idle animations.

## Components

Nav (ink, turns light over the fall and the floor; links step aside while falling, whole bar on phones) · depth meter (fixed, rolling hedgehog ball + metres; reads the same depth as each chapter title and interpolates between them, so chapters sit evenly on the ruler as knots. Mouse-only shortcut, the nav stays the accessible path: click a depth to go there, a click near a knot snaps to its chapter, drag to scrub, hovering shows a pencil tick with the target depth and the chapter names) · chapter (title + depth annotation) · featured project (drawing + pinned annotations + text, security log list) · burrow (earth bands, signposts, hanging paper tags, one per repo) · hedgehog (sitting / ball, `light` variant for dark grounds; redrawn 2026-11-20 with three rows of single quills leaning back, a soft snout with a shiny nose, an ear, an eyelid and a highlight in the eye, a blush, a tiny tail) · the GitHub braille hedgehog printed at the floor under `$ cat herisson.txt`, line by line · skill group (crayon ring when relevant to the mode) · rope timeline · floor (contact).
