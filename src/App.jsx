import { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { SketchDefs, roughEllipse, strokePath, rng } from './components/sketch.jsx';
import {
  Hedgehog,
  HedgehogBall,
  Hole,
  Packer,
  Vault,
  Containers,
  SpaceObject,
  Sparkle,
  StarField,
  Bush,
  InterestIcon,
  Doodle,
  DOODLE_KINDS,
  LampPost,
  Planet,
  Flowers,
  Bulb,
  BurrowGate,
  DEN,
} from './components/drawings.jsx';
import { CozyRoom } from './components/room.jsx';
import { person, intro, featured, burrow, skills, path, interests, traits } from './data.js';

gsap.registerPlugin(ScrollTrigger);
// phones: the browser bar sliding in and out must not re-measure every scene mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });

const DEPTH = 412; // metres at the floor; the meter maps scroll to this
const ALTITUDE = 1200; // metres above the well where the intro starts

// Worlds hanging in the dream sky: [kind, layer, x %, y %, width vw, float s].
// The big one rises from behind the horizon, the others recede at different depths.
const WORLDS = [
  ['giant', 'far', 2, 33, 17, 16],
  ['ringed', 'far', 62, 3, 9, 19],
  ['ember', 'far', 27, 9, 2.2, 10],
  ['ice', 'mid', 86, 31, 5.4, 12],
];
// Flower patches on the ground: [left %, bottom %, width vw, seed, count]. Small near the horizon, big in front,
// and none over the well in the middle.
const PATCHES = [
  [-2, -4, 24, 3, 9],
  [77, -6, 26, 8, 10],
  [37, 4, 11, 21, 6],
  [55, -2, 10, 39, 5],
  [4, 30, 12, 25, 6],
  [86, 30, 11, 27, 6],
  [17, 46, 8, 13, 5],
  [69, 52, 6, 17, 4],
  [22, 64, 5, 29, 4],
  [9, 70, 4, 41, 3],
  [76, 70, 4.5, 43, 3],
  [88, 60, 5, 47, 4],
  [30, 78, 3, 51, 3],
  [64, 78, 3, 53, 3],
];

// A drawing left in the margin of a stratum; drifts with the scroll on wide screens.
function Deco({ className, drift = 0.5, children }) {
  return (
    <div className={`deco ${className}`} data-drift={drift} aria-hidden="true">
      {children}
    </div>
  );
}
// Worlds coming at you as the room gives way to the night: [kind, x %, y %, width vw].
const ARRIVALS = [
  ['giant', 18, 30, 24],
  ['ringed', 80, 64, 20],
  ['ice', 88, 18, 11],
  ['ember', 10, 74, 6],
];

// What you read on the way down.
// The story, told in two rooms: the bedroom at 9, today; then the way down.
const SKY_LINES = [
  { small: 'chapitre 0', pre: 'depuis mes', age: '9', then: 'Un PC dans ma chambre. Je ne l’ai plus jamais lâché.' },
  { small: 'aujourd’hui · C · C++ · assembleur · Linux', big: 'Je construis mes outils de zéro,', then: 'pour comprendre comment on les attaque.' },
  { small: 'la suite est sous vos pieds', big: 'Préparez-vous à la descente.', then: 'Projets, outils, parcours : tout est en bas.' },
];
// The night you fall through before the well: two layers of things adrift, scattered on a jittered grid.
// [kind, x %, y % of the layer, size px, rotation, float s]. The near layer keeps clear of the text in the middle.
const NIGHT_KINDS = ['bed', 'book', 'crystal', 'table', 'satellite', 'planet', 'gem', 'chair', 'star', 'rock', 'seed', 'lock', 'floppy', 'key', 'note', 'pawn'];
const scatter = (seed, cols, rows, [s0, s1], clear) => {
  const r = rng(seed);
  const out = [];
  for (let row = 0; row < rows; row++)
    for (let c = 0; c < cols; c++) {
      const x = 10 + ((c + 0.12 + r() * 0.76) / cols) * 88; // the meter keeps the left edge
      const y = ((row + 0.12 + r() * 0.76) / rows) * 100;
      if (x > 32 && x < 68 && (clear || r() < 0.5)) continue;
      out.push([NIGHT_KINDS[(out.length * 7 + seed) % NIGHT_KINDS.length], x, y, s0 + r() * (s1 - s0), (r() - 0.5) * 50, 7 + r() * 6]);
    }
  return out;
};
const NIGHT_FAR = scatter(5, 6, 6, [30, 46]);
const NIGHT_NEAR = scatter(9, 4, 7, [62, 96], true);
const NIGHT_SPARKS = (() => {
  const r = rng(13);
  return Array.from({ length: 16 }, () => [r() * 100, r() * 100, 8 + r() * 10]);
})();
// Specks of dust hanging in the bulb's light: [x %, y %, size px, drift s].
const MOTES = (() => {
  const r = rng(909);
  return Array.from({ length: 34 }, () => [30 + r() * 40, 8 + r() * 60, 1.5 + r() * 3, 7 + r() * 9]);
})();
// Inside the well: its two walls rush up past you. Each wall is a tall strip of earth (520vh) with things buried in it
// and depth marks painted on it; the inner edge is a rough line. [kind, x % of the wall, y % of the wall, size px, rotation]
const SHAFT_H = 520; // vh
const BURIED = ['rock', 'gem', 'crystal', 'floppy', 'key', 'lock', 'seed', 'note', 'pawn'];
const shaftWall = (seed) => {
  const r = rng(seed);
  const things = Array.from({ length: 11 }, (_, i) => [BURIED[(i * 5 + seed) % BURIED.length], 8 + r() * 40, 4 + (i / 11) * 92 + r() * 5, 30 + r() * 26, (r() - 0.5) * 70]);
  const edge = [];
  for (let y = 0; y <= 1000; y += 9) edge.push([74 + r() * 12 + (r() > 0.9 ? 8 : 0), y]);
  return { things, edge };
};
const SHAFT = [shaftWall(611), shaftWall(733)];
// depth marks painted on the right wall every 60vh (vh from the top of the wall); their numbers are read off the meter
const MARKS = [60, 120, 180, 240, 300, 360, 420];
// streaks of air rushing up: [x %, length vh, opacity, phase]
const WIND = (() => {
  const r = rng(321);
  return Array.from({ length: 36 }, (_, i) => [14 + r() * 72, 8 + r() * 22, 0.25 + r() * 0.4, (i / 36 + r() * 0.05) % 1]);
})();
// The hedgehog of my GitHub profile, in braille.
const ASCII_HOG = `⠀⠀⠀⠀⠀⠀⢠⠠⣆⢆⢶⢴⢄⣦⢊⠴⡘⢆⢤⡞⢢⡤⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢦⡝⣇⠻⡘⠄⠀⡸⠊⠀⠀⠀⠀⠀⠀⠀⠐⠁⠒⣤⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣴⡄⠁⡈⠀⡇⡃⡐⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⣀⠀⠻⣧⣄⡀⠀⠀
⠀⠀⠀⠀⠙⣿⡌⣉⡀⠀⢠⠁⠀⢀⠄⡠⠏⠀⠀⠂⠁⠁⢀⡀⠀⠀⠸⠿⡀⠀
⠀⠀⠀⠀⠀⣿⠓⢿⣧⣾⠷⢅⠀⠀⠀⠀⣠⡇⠀⢀⠄⠘⠋⠀⠀⠀⠀⠀⠿⠄
⠀⠀⠀⢀⠎⠀⠀⠄⠈⠁⢁⣅⠇⢀⣀⣨⠁⠀⡠⠋⠀⢠⠴⢂⡔⢦⡈⣑⢄⠀
⠀⠀⡠⠊⠀⣶⡄⠀⠀⠀⡚⠋⠛⠿⠭⣤⢖⣋⠀⠀⢀⡀⠄⠑⠂⣀⠀⠀⠛⠅
⣴⡏⠀⠀⠀⠉⠁⠀⠀⠄⠃⠀⠀⠀⠀⠀⠀⠉⠉⠃⠾⠗⣆⣳⡄⠀⠉⠀⠹⢥
⠀⠃⠠⠤⠀⠀⠀⠐⠋⠀⠀⡀⢀⠀⠀⠀⠀⠀⠰⣦⠀⠀⢀⠙⠻⠂⣸⣧⡱⡂
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡆⠑⠰⠆⡀⢠⣐⠀⢀⠀⠀⠀⠂⡄⠁⢀⢀⠾⠉⠀⠉
⠀⠀⠀⠀⠀⠀⠀⠺⠭⠤⢢⡄⠂⣀⡠⠉⠉⠀⠉⠒⠚⣶⢃⡠⠞⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠤⠤⠤⠤⠤⠄⠀⠤⠤⠤⠄⠀⠀⠀⠀⠀⠀⠀⠀`;
// Chapters marked on the depth meter: click one to go there.
// The meter reads the same depth as each chapter title, and interpolates in between.
const NOTCHES = [
  ['qui', 'Qui tombe', 38],
  ['projets', 'Projets', 112],
  ['outils', 'Outils', 190],
  ['parcours', 'Parcours', 268],
  ['hors-ecran', 'Hors de l’écran', 344],
  ['contact', 'Chez moi', DEPTH],
];
// Scroll position <-> depth, piecewise between anchors [[scrollY, metres], ...] sorted by both.
const lerpAnchors = (a, v, from, to) => {
  if (v <= a[0][from]) return a[0][to];
  for (let i = 1; i < a.length; i++) {
    if (v <= a[i][from]) {
      const [p, q] = [a[i - 1], a[i]];
      return p[to] + ((v - p[from]) / Math.max(q[from] - p[from], 1e-6)) * (q[to] - p[to]);
    }
  }
  return a[a.length - 1][to];
};
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// a small machine: fewer costly effects (set from the hardware, or when frames start to drop)
const lite = () => document.documentElement.classList.contains('lite');

// Doodles that drift out of the hole while you hesitate at the edge.
const RISING = ['zero', 'key', 'one', 'lock', 'hog', 'one', 'eye'];

// The dream sky above the well: white-line objects adrift in violet space.
// [kind, x %, y %, size px, base rotation, float duration s]
// [kind, x %, y %, size px, rotation, float s, x % and y % on a phone (off the name)]
const FLOATERS = [
  ['bed', 9, 8, 92, -10, 10],
  ['chair', 80, 25, 66, 16, 8, 84, 57],
  ['table', 94, 6, 58, -6, 9],
  ['book', 22, 30, 64, -14, 9, 12, 52],
  ['crystal', 22, 38, 58, 12, 7, 30, 61],
  ['lock', 87, 9, 64, 10, 8],
  ['satellite', 72, 35, 92, -22, 11, 68, 47],
  ['planet', 3, 40, 76, 0, 10],
  ['note', 41, 42, 50, 14, 6.5],
  ['floppy', 57, 41, 58, -10, 9.5],
  ['key', 92, 42, 66, 30, 8.5],
  ['pawn', 33, 5, 46, -8, 7.5],
  ['rock', 65, 4, 52, 0, 12],
  ['crystal', 4, 30, 44, -20, 6],
];
const SPARKS = [
  [13, 31, 16],
  [29, 52, 10],
  [47, 36, 12],
  [62, 28, 9],
  [81, 50, 14],
  [91, 20, 10],
  [18, 6, 10],
  [70, 14, 12],
];

// Doodles that stream past you during the fall: stable pseudo-random layout.
const STREAM = (() => {
  const r = rng(77);
  return Array.from({ length: 30 }, (_, i) => {
    const size = 24 + r() * 80;
    return {
      kind: DOODLE_KINDS[i % DOODLE_KINDS.length],
      x: 2 + r() * 92,
      phase: (i / 30 + r() * 0.06) % 1, // when it crosses the screen, spread along the whole fall
      size,
      speed: 0.6 + size / 90, // the closer (bigger), the faster
      spin: (r() - 0.5) * 260,
    };
  });
})();

function Letters({ text, className, bob = false }) {
  let n = 0;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={w} className="word">
            {w > 0 && ' '}
            <span className="word-in">
              {[...word].map((c, i) => (
                <span key={i} className="ltr">
                  {bob ? (
                    <span className="bob" style={{ '--i': n++ }}>
                      {c}
                    </span>
                  ) : (
                    c
                  )}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

function Scribble({ w = 200, h = 16, seed = 1, className }) {
  const r = rng(seed);
  const pts = [];
  for (let x = 0; x <= w; x += w / 8) pts.push([x, h / 2 + (r() - 0.5) * h * 0.5]);
  return (
    <svg className={`scribble sketch ${className ?? ''}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={strokePath(pts, seed, 1)} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function Leader({ from, to, seed }) {
  const mid = [(from[0] + to[0]) / 2 + (seed % 2 ? 18 : -18), (from[1] + to[1]) / 2];
  return (
    <>
      <path className="leader" d={strokePath([from, mid, to], seed, 1)} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      <path d={roughEllipse(from[0], from[1], 4, 4, seed + 1, 1.1)} style={{ fill: 'var(--ink)' }} />
    </>
  );
}

// Where each annotation pins onto its drawing (viewBox 600 x 440) and where its label sits (%).
const pins = {
  woody: [
    { at: [476, 128], label: [70, 2] },
    { at: [292, 352], label: [60, 86] },
    { at: [200, 100], label: [24, -6] },
    { at: [378, 230], label: [70, 52] },
  ],
  hedgepass: [
    { at: [300, 215], label: [4, 2] },
    { at: [404, 215], label: [80, 30] },
    { at: [160, 300], label: [0, 86] },
    { at: [470, 360], label: [78, 6] },
  ],
  inception: [
    { at: [315, 40], label: [62, -4] },
    { at: [210, 300], label: [0, 92] },
    { at: [405, 300], label: [70, 92] },
    { at: [210, 160], label: [0, 18] },
  ],
};

function ProjectDrawing({ id, notes }) {
  const Art = { woody: Packer, hedgepass: Vault, inception: Containers }[id];
  return (
    <figure className="drawing">
      <div className="drawing-art" data-drift="0.6">
        <Art />
        <svg className="drawing-leaders" viewBox="0 0 600 440" aria-hidden="true">
          {pins[id].map((p, i) => (
            <Leader key={i} from={p.at} to={[(p.label[0] / 100) * 600 + 40, (p.label[1] / 100) * 440 + 10]} seed={400 + i * 7 + id.length} />
          ))}
        </svg>
      </div>
      <figcaption className="notes">
        {notes.map((n, i) => (
          <span key={n} className="note" style={{ left: `${pins[id][i].label[0]}%`, top: `${pins[id][i].label[1]}%` }}>
            {n}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

function Chapter({ id, title, depth, seed }) {
  return (
    <header className="chapter" id={id}>
      <h2 className="chapter-title">
        <Letters text={title} />
      </h2>
      <p className="chapter-depth">
        <Scribble w={120} h={14} seed={seed} />
        <span>−{depth} m</span>
      </p>
    </header>
  );
}

export default function App() {
  const root = useRef(null);
  const meter = useRef(null);
  const lenisRef = useRef(null);
  const zone = useRef('sky'); // where the visitor is: 'sky', 'hero' or 'below'
  const litRef = useRef(false); // the bulb of the dark room is on
  const turnOnRef = useRef(null);
  const hangRef = useRef(null);
  const drag = useRef(null);
  const lightNowRef = useRef(null); // lights the room at once, without the show
  const scrollMap = useRef({ top: 0, max: 1, notches: {}, anchors: [[0, 0], [1, DEPTH]] }); // scroll y <-> depth
  const meterDrag = useRef(null);
  const meterRect = useRef(null);

  // The depth meter is a ruler you can use: click a depth to go there, or drag the hedgehog along it.
  const meterAt = (e) => {
    const r = meterRect.current ?? (meterRect.current = meter.current.getBoundingClientRect());
    let f = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    // a click close to a chapter's knot lands on the chapter
    const near = NOTCHES.find(([, , d]) => Math.abs((d / DEPTH - f) * r.height) < 11);
    if (near) f = near[2] / DEPTH;
    return { f, y: near ? scrollMap.current.notches[near[0]] ?? 0 : lerpAnchors(scrollMap.current.anchors, f * DEPTH, 1, 0) };
  };
  const navUntil = useRef(0); // a jump asked by the visitor (meter, links): no stop at the hole on the way
  const goTo = (y, follow) => {
    navUntil.current = performance.now() + 2600;
    if (!litRef.current) lightNowRef.current?.();
    const l = lenisRef.current;
    if (l) l.scrollTo(y, follow ? { lerp: 0.16 } : { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: y });
  };
  const onMeterEnter = () => {
    meterRect.current = meter.current.getBoundingClientRect();
  };
  const onMeterDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onMeterEnter();
    meterDrag.current = { y0: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMeterMove = (e) => {
    const { f, y } = meterAt(e);
    meter.current.style.setProperty('--g', f.toFixed(4));
    meter.current.querySelector('.meter-ghost-value').textContent = `−${Math.round(f * DEPTH)} m`;
    const d = meterDrag.current;
    if (!d || (!d.moved && Math.abs(e.clientY - d.y0) < 5)) return;
    if (!d.moved) meter.current.classList.add('meter-dragging');
    d.moved = true;
    goTo(y, true);
  };
  const onMeterUp = (e) => {
    const d = meterDrag.current;
    if (!d) return;
    meterDrag.current = null;
    meter.current.classList.remove('meter-dragging');
    if (!d.moved) goTo(meterAt(e).y, false);
  };
  const onNotch = (id) => {
    const y = scrollMap.current.notches[id];
    if (y != null) goTo(y, false);
  };

  // Pulling the bulb down stretches its cord; let go and it springs back, and the light comes on.
  const onBulbDown = (e) => {
    if (litRef.current) return;
    drag.current = { y: e.clientY, pull: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    gsap.killTweensOf(hangRef.current, '--pull');
  };
  const onBulbMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dy = Math.max(0, e.clientY - d.y);
    d.pull = 150 * (1 - Math.exp(-dy / 150)); // the further, the harder
    hangRef.current.style.setProperty('--pull', `${d.pull.toFixed(1)}px`);
  };
  const onBulbUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    gsap.to(hangRef.current, { '--pull': '0px', duration: 1.2, ease: 'elastic.out(1, 0.3)' });
    if (d.pull > 30) turnOnRef.current?.();
  };

  // The hedgehog watches your cursor, and the sky drifts with it.
  // Throttled to one write per frame, and only on the few elements that move.
  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    const q = (sel) => root.current.querySelector(sel);
    const fig = q('.hero-figure');
    const pupils = q('.hero-figure .pupils');
    const far = q('.dream-far');
    const mid = q('.dream-mid');
    const sky = q('.sky');
    // in the dark, the cursor is a small torch, and the bulb leans after it
    const lean = gsap.quickTo(q('.hang-swing'), 'rotation', { duration: 1.4, ease: 'elastic.out(1, 0.4)' });
    let raf = 0;
    let ev = null;
    const frame = () => {
      raf = 0;
      const mx = ev.clientX / window.innerWidth - 0.5;
      const my = ev.clientY / window.innerHeight - 0.5;
      if (zone.current === 'sky') {
        if (litRef.current) return;
        sky.style.setProperty('--mx', `${ev.clientX}px`);
        sky.style.setProperty('--my', `${ev.clientY}px`);
        if (!drag.current) lean(Math.max(-9, Math.min(9, -mx * 16)));
        return;
      }
      if (zone.current !== 'hero') return; // nothing moves with the cursor elsewhere
      const r = fig.getBoundingClientRect(); // read before any write: no forced layout
      far.style.translate = `${(-mx * 14).toFixed(1)}px ${(-my * 10).toFixed(1)}px`;
      mid.style.translate = `${(-mx * 38).toFixed(1)}px ${(-my * 22).toFixed(1)}px`;
      const dx = ev.clientX - (r.left + r.width * 0.8);
      const dy = ev.clientY - (r.top + r.height * 0.6);
      const d = Math.max(Math.hypot(dx, dy), 1);
      pupils.style.translate = `${((dx / d) * 2.2).toFixed(2)}px ${((dy / d) * 2.2).toFixed(2)}px`;
    };
    const move = (e) => {
      ev = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Small machines. Animations in a section you can't see are paused; and on a weak machine (few cores or little memory,
  // or frames that keep dropping) the costliest effects go: the paper grain, the pencil filter, glows and idle floating.
  useEffect(() => {
    const html = document.documentElement;
    if ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4) html.classList.add('lite');
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)), { rootMargin: '15% 0px' });
    root.current.querySelectorAll('main section').forEach((el) => io.observe(el));
    // frame watch: two slow stretches in a row (under ~38 fps) switch to the light version, once
    let frames = 0;
    let total = 0;
    let slow = 0;
    const watch = (time, dt) => {
      if (dt > 250 || document.hidden) return; // a background tab or a hiccup, not the machine
      total += dt;
      if (++frames < 90) return;
      slow = total / frames > 26 ? slow + 1 : 0;
      frames = total = 0;
      if (slow >= 2) {
        html.classList.add('lite');
        gsap.ticker.remove(watch);
      }
    };
    if (!html.classList.contains('lite')) gsap.ticker.add(watch);
    return () => {
      io.disconnect();
      gsap.ticker.remove(watch);
    };
  }, []);

  // Smooth scroll, wired to ScrollTrigger.
  useLayoutEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const nav = root.current.querySelector('.nav');
      const who = root.current.querySelector('.who');
      const floor = root.current.querySelector('.floor');
      let heroST = null;

      // Positions measured by ScrollTrigger on refresh, never read during scroll.
      const hero = root.current.querySelector('.hero');
      // refreshPriority -1: measured after the pins above them have added their spacing
      const whoST = ScrollTrigger.create({ trigger: who, start: 'top 40px', refreshPriority: -1 });
      const heroTop = ScrollTrigger.create({ trigger: hero, start: 'top top', refreshPriority: -1 });
      const sky = root.current.querySelector('.sky');
      const floorST = ScrollTrigger.create({ trigger: floor, start: 'top 40px', refreshPriority: -1 });
      const value = meter.current.querySelector('.meter-value');
      const state = { depth: null, quiet: null, dark: null, calm: null, skyCalm: null };
      const set = (key, v, apply) => {
        if (state[key] !== v) {
          state[key] = v;
          apply(v);
        }
      };

      // Chapters on the meter: their depth, measured once the pins have taken their room.
      const notchSTs = NOTCHES.map(([id]) => ScrollTrigger.create({ trigger: `#${id}`, start: 'top 90px', refreshPriority: -1 }));
      let meterST = null;
      const placeNotches = () => {
        const top = heroTop.start;
        const max = ScrollTrigger.maxScroll(window);
        const anchors = [[top, 0]];
        NOTCHES.forEach(([id, , depth], i) => {
          const y = Math.min(notchSTs[i].start, max);
          scrollMap.current.notches[id] = y;
          if (y > anchors[anchors.length - 1][0]) anchors.push([y, depth]);
          meter.current.querySelector(`[data-notch="${id}"]`)?.style.setProperty('--at', (depth / DEPTH).toFixed(4));
        });
        if (anchors[anchors.length - 1][1] < DEPTH) anchors.push([Math.max(max, anchors[anchors.length - 1][0] + 1), DEPTH]);
        scrollMap.current.anchors = anchors;
        if (meterST) meterST.vars.onUpdate(meterST);
      };
      ScrollTrigger.addEventListener('refresh', placeNotches);
      const offRefresh = () => ScrollTrigger.removeEventListener('refresh', placeNotches);

      // The depth meter follows the whole descent.
      meterST = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onRefresh: (st) => st.vars.onUpdate(st), // right state on load, before any scroll
        onUpdate: (st) => {
          const y = st.scroll();
          const top = heroTop.start;
          const depth = y < top ? 0 : lerpAnchors(scrollMap.current.anchors, y, 0, 1);
          meter.current.style.setProperty('--p', (depth / DEPTH).toFixed(4));
          // above the well the meter counts altitude down, below it counts depth
          const label = y < top ? `+${Math.round(((1 - y / Math.max(top, 1)) * ALTITUDE) / 10) * 10} m` : `−${Math.round(depth)} m`;
          set('depth', label, (d) => (value.textContent = d));
          const vh = window.innerHeight;
          zone.current = y < top - vh * 0.5 ? 'sky' : y < top + vh * 1.2 ? 'hero' : 'below';
          set('skyCalm', y > top, (v) => sky.classList.toggle('calm', v));
          // the links step aside while falling, come back when climbing
          set('quiet', st.direction === 1 && y > 200, (v) => nav.classList.toggle('nav-quiet', v));
          // light ink over the night sky, the fall and the floor
          const heroP = heroST ? (y - heroST.start) / (heroST.end - heroST.start) : 0;
          set('dark', y < whoST.start || y >= floorST.start, (v) => {
            nav.classList.toggle('nav-dark', v);
            meter.current.classList.toggle('meter-dark', v);
          });
          // once the hole has swallowed the sky, stop its idle animations
          set('calm', heroP > 0.45, (v) => hero.classList.toggle('calm', v));
        },
      });

      // Without motion, the room is lit from the start and nothing is locked.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        litRef.current = true;
        sky.classList.add('lit');
        turnOnRef.current = () => {};
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 0. The dark room. Nothing scrolls until the bulb is pulled (or clicked): the light comes on,
        //    then scrolling takes you down through the floor into the night of the well.
        const vh = () => window.innerHeight;
        const vw = () => window.innerWidth;
        const html = document.documentElement;
        const lines = gsap.utils.toArray('.sky-line');
        const rooms = gsap.utils.toArray('.room');
        gsap.set(lines, { autoAlpha: 0 });
        gsap.set(rooms.slice(1), { xPercent: 100 });

        const unlock = () => {
          html.classList.remove('is-dark');
          lenisRef.current?.start();
        };
        const light = (animate) => {
          if (litRef.current) return;
          litRef.current = true;
          unlock();
          sky.classList.add('lit');
          if (!animate) {
            gsap.set(['.room', '.room-glow', '.bulb-glow'], { opacity: 1 });
            gsap.set('.rays', { opacity: 0.5 });
            gsap.set(lines[0], { autoAlpha: 1 });
            return;
          }
          // the filament warms up: it sputters twice, then holds, and the light pours out of the bulb into the room
          const bulb = root.current.querySelector('.bulb-art').getBoundingClientRect();
          const cx = bulb.left + bulb.width / 2;
          const cy = bulb.top + bulb.height * 0.62;
          const reach = Math.hypot(Math.max(cx, vw() - cx), Math.max(cy, vh() - cy)) + 40;
          const on = gsap.timeline();
          on.to('.hang-swing', { rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.4)' }, 0)
            .to('.bulb-glow', {
              keyframes: [
                { opacity: 0.45, duration: 0.07 },
                { opacity: 0.05, duration: 0.16 },
                { opacity: 0.7, duration: 0.06 },
                { opacity: 0.15, duration: 0.2 },
                { opacity: 1, duration: 0.35, ease: 'power2.out' },
              ],
            }, 0)
            .fromTo('.room-glow', { opacity: 0, scale: 0.15 }, { opacity: 1, scale: 1, duration: 1.9, ease: 'expo.out' }, 0.5)
            .fromTo(
              '.room',
              { opacity: 1, clipPath: `circle(0px at ${cx}px ${cy}px)` },
              { clipPath: `circle(${reach}px at ${cx}px ${cy}px)`, duration: 1.3, ease: 'power2.inOut', clearProps: 'clipPath' },
              0.5,
            )
            .fromTo('.rays', { opacity: 0 }, { opacity: 0.32, duration: 2.4, ease: 'power1.out' }, 0.8)
            // the furniture drops onto the floor, one piece after the other
            .fromTo('.room-a .prop', { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.09, ease: 'bounce.out' }, 0.7)
            .set(lines[0], { autoAlpha: 1 }, 0.5)
            .from('.sky-line-0 .sky-small', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.6)
            .from('.age-n', { scale: 3.2, yPercent: 18, opacity: 0, filter: lite() ? 'none' : 'blur(18px)', duration: 1.3, ease: 'expo.out' }, 0.62)
            .from('.age-pre', { xPercent: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.9)
            .from('.age-ans', { xPercent: -40, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.95)
            .from('.sky-line-0 .sky-then', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 1.15)
            .from('.sky-cue', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, 1.8);
        };
        turnOnRef.current = () => light(true);
        lightNowRef.current = () => light(false);

        // trying to scroll in the dark only makes the bulb swing
        const nudge = () => {
          if (litRef.current) return;
          if (!gsap.isTweening('.hang-swing')) {
            gsap.fromTo('.hang-swing', { rotation: 0 }, { keyframes: [{ rotation: 7, duration: 0.25 }, { rotation: -4, duration: 0.35 }, { rotation: 0, duration: 0.5 }], ease: 'sine.inOut' });
          }
          const hint = root.current.querySelector('.switch-hint');
          hint.classList.remove('nudge');
          void hint.offsetWidth;
          hint.classList.add('shown', 'nudge');
        };
        const keys = new Set(['ArrowDown', 'PageDown', ' ', 'End']);
        const onKey = (e) => keys.has(e.key) && e.target === document.body && nudge();
        // a link to further down turns the light on before it jumps
        const onLink = (e) => {
          if (!litRef.current && e.target.closest?.('a[href^="#"]')) light(false);
        };
        // came back mid-page (reload, history): no dark room
        const onScroll = () => window.scrollY > 20 && light(false);

        if (litRef.current || window.scrollY > 20) {
          litRef.current = false;
          light(false);
        } else {
          html.classList.add('is-dark');
          lenisRef.current?.stop();
          window.addEventListener('wheel', nudge, { passive: true });
          window.addEventListener('touchmove', nudge, { passive: true });
          window.addEventListener('keydown', onKey);
          window.addEventListener('scroll', onScroll, { passive: true });
          document.addEventListener('click', onLink, true);
        }

        const fall = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '.sky', start: 'top top', end: '+=320%', pin: true, scrub: 0.9, invalidateOnRefresh: true },
        });
        fall.to('.sky-cue', { opacity: 0, duration: 0.03 }, 0);
        // the lines come and go in the light, the second half a beat after the first
        const show = (el, at, out) => {
          fall.fromTo(el, { autoAlpha: 0, y: 60, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.06, ease: 'power2.out' }, at);
          const then = el.querySelector('.sky-then');
          if (then) fall.fromTo(then, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, at + 0.05);
          if (out != null) fall.to(el, { autoAlpha: 0, y: -80, scale: 1.06, duration: 0.06, ease: 'power2.in' }, out);
        };
        fall.to(lines[0], { autoAlpha: 0, y: -90, scale: 1.06, duration: 0.06, ease: 'power2.in' }, 0.1);
        // walking through the house: the bedroom slides away and today comes in
        fall
          .to(rooms[0], { xPercent: -100, duration: 0.12, ease: 'power2.inOut' }, 0.12)
          .fromTo(rooms[1], { xPercent: 100 }, { xPercent: 0, duration: 0.12, ease: 'power2.inOut' }, 0.12);
        show(lines[1], 0.22, 0.46);
        // then the floor gives way: the room rises past you and the bulb goes up out of sight
        fall
          .to(rooms[1], { y: () => -vh() * 1.1, duration: 0.14, ease: 'power1.in' }, 0.5)
          .to(['.hang', '.motes'], { y: () => -vh() * 0.9, duration: 0.18, ease: 'power1.in' }, 0.52)
          .to(['.room-glow', '.rays'], { y: () => -vh() * 0.9, opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.52)
          .to('.sky-night', { opacity: 1, duration: 0.16, ease: 'power1.inOut' }, 0.58)
          .fromTo('.night', { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.56)
          .fromTo('.night-far', { y: () => vh() * 0.15 }, { y: () => -vh() * 0.75, duration: 0.5 }, 0.52)
          .fromTo('.night-near', { y: () => vh() * 0.35 }, { y: () => -vh() * 1.65, duration: 0.5 }, 0.52);
        show(lines[2], 0.7, 0.92);
        // pixel worlds come out of the night and swing past
        gsap.utils.toArray('.sky-space .planet').forEach((el, i) => {
          const [, x, y] = ARRIVALS[i];
          const at = 0.6 + i * 0.07;
          fall
            .fromTo(
              el,
              { scale: 0.15, x: 0, y: 0, rotation: -8 },
              { scale: 2.6, x: () => ((x - 50) / 100) * vw() * 1.4, y: () => ((y - 50) / 100) * vh() * 1.3, rotation: 10, duration: 0.26, ease: 'power2.in' },
              at,
            )
            .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.03 }, at)
            .to(el, { opacity: 0, duration: 0.03 }, at + 0.22);
        });
        fall.to({}, { duration: 0.02 }, 1); // a breath of night before the well
        // 1. The fall: the name flies off, the figure slips in, the hole swallows the page,
        //    then everything that lives in the dark streams past.
        const hole = root.current.querySelector('.hero-hole');
        const cover = () => {
          const r = hole.getBoundingClientRect();
          return (Math.hypot(window.innerWidth, window.innerHeight) * 2.2) / Math.max(r.height, 1);
        };
        // from the ball to the middle of the well (measured relative to each other, so scroll doesn't matter)
        const ball = root.current.querySelector('.hero-ball');
        const intoHole = () => {
          const h = hole.getBoundingClientRect();
          const b = ball.getBoundingClientRect();
          return { x: h.left + h.width / 2 - (b.left + b.width / 2), y: h.top + h.height * 0.56 - (b.top + b.height / 2) };
        };
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=280%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        heroST = tl.scrollTrigger;
        // the scenery stays where it is: the sky drifts up as one piece, the ground (lamps, bushes, flowers) zooms as one
        tl.to(['.dream-far', '.dream-mid'], { yPercent: -18, duration: 0.4 }, 0);
        // letters fly off the top of the screen whatever its height, and fade as they go
        tl.to(
          '.hero-name .ltr',
          {
            y: (i) => -vh() * 0.75 - (i % 4) * 40,
            rotation: (i) => [-14, 9, -6, 16, -10, 5][i % 6],
            opacity: 0,
            stagger: 0.012,
            duration: 0.36,
          },
          0,
        )
          .to(['.hero-cue', '.rising'], { opacity: 0, duration: 0.08 }, 0)
          // the hedgehog curls up, hops onto the lip, and drops into the dark
          .to('.hero-figure', { x: 14, rotation: 14, duration: 0.1, ease: 'power1.in' }, 0.04)
          .set('.hero-figure', { opacity: 0 }, 0.14)
          .set('.hero-ball', { opacity: 1 }, 0.14)
          .fromTo('.hero-ball', { x: 0, y: 0, rotation: 0, scale: 1 }, { x: () => intoHole().x * 0.35, y: -90, rotation: 260, duration: 0.07, ease: 'power2.out' }, 0.14)
          .to('.hero-ball', { x: () => intoHole().x, y: () => intoHole().y, rotation: 820, scale: 0.18, duration: 0.12, ease: 'power2.in' }, 0.21)
          .to('.hero-ball', { opacity: 0, duration: 0.03 }, 0.3)
          // a ring of dust puffs out of the well where he fell in
          .fromTo('.hero-puff', { scale: 0.3, opacity: 0 }, { scale: 1.4, opacity: 0.9, duration: 0.05, ease: 'power2.out' }, 0.31)
          .to('.hero-puff', { opacity: 0, scale: 1.8, duration: 0.06 }, 0.36)
          // then the camera dives after him: the ground rushes up, the well swallows the screen
          .to('.hero-land', { scale: 2.4, duration: 0.3, ease: 'power2.in' }, 0.3)
          .to(['.dream-far', '.dream-mid'], { scale: 1.25, opacity: 0, duration: 0.26, ease: 'power1.in' }, 0.32)
          .to('.hero-hole', { scale: cover, duration: 0.28, ease: 'power3.in' }, 0.32)
          // the well's walls would fill the screen when it grows: the dark takes over instead
          .to('.hero-void', { opacity: 1, duration: 0.1, ease: 'power1.in' }, 0.5);
        // inside, you fall down the shaft: its walls rush up faster and faster, depth marks fly by,
        // the air streaks past, and the hedgehog tumbles just below you
        tl.fromTo('.shaft', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.5)
          .fromTo('.shaft-wall', { y: 0 }, { y: () => (-vh() * (SHAFT_H - 120)) / 100, duration: 0.5, ease: 'none' }, 0.5);
        gsap.utils.toArray('.wind span').forEach((el, i) => {
          const [, h, , phase] = WIND[i];
          const span = 0.06;
          tl.fromTo(el, { y: () => vh() * 1.05 }, { y: () => (-vh() * h) / 100, duration: span }, 0.52 + phase * (0.46 - span));
        });
        tl.set('.fall-hog', { opacity: 1 }, 0.55)
          .fromTo('.fall-hog', { y: () => -vh() * 0.2 }, { y: () => vh() * 0.4, duration: 0.1, ease: 'power2.out' }, 0.55)
          .fromTo('.fall-hog', { x: 0 }, { keyframes: { x: [0, 46, -38, 28, -14, 0] }, duration: 0.32, ease: 'sine.inOut' }, 0.62)
          .fromTo(['.fall-ball', '.fall-ghost'], { rotation: 0 }, { rotation: 1800, duration: 0.45, ease: 'none' }, 0.55)
          // and he drops ahead of you into the first chapter
          .to('.fall-hog', { y: () => vh() * 1.3, duration: 0.07, ease: 'power2.in' }, 0.93);
        // the marks on the wall read the depth the meter shows when they pass the middle of the screen
        const markDepths = () => {
          const st = tl.scrollTrigger;
          root.current.querySelectorAll('.shaft-mark').forEach((el) => {
            const t = Math.max(+el.dataset.at - 50, 0) / (SHAFT_H - 120); // where the walls have brought it to mid-screen
            const d = lerpAnchors(scrollMap.current.anchors, st.start + (0.5 + 0.5 * t) * (st.end - st.start), 0, 1);
            el.firstChild.textContent = `−${Math.round(d)} m`;
          });
        };
        ScrollTrigger.addEventListener('refresh', markDepths);
        // each doodle crosses the screen at its own moment, so the dark is never empty
        gsap.utils.toArray('.stream .doodle').forEach((el, i) => {
          const d = STREAM[i];
          const span = 0.2 / d.speed;
          tl.fromTo(
            el,
            { y: () => vh() * 1.05, rotation: 0 },
            { y: () => -d.size * 1.5, rotation: d.spin, duration: span },
            0.56 + d.phase * (0.44 - span),
          );
        });

        // 1b. Right at the edge of the hole, the scroll stops for a breath, even if the wheel ran on a little too far.
        const lenis = lenisRef.current;
        const holdAtHole = (() => {
          if (!lenis) return null;
          let armed = true;
          let holding = false;
          let prev = lenis.scroll;
          let timer = 0;
          const onScroll = (l) => {
            const y = l.scroll;
            const S = heroTop.start;
            if (y < S - vh() * 0.4) armed = true;
            const crossed = prev < S && y >= S;
            prev = y;
            if (!armed || holding || !crossed || l.direction !== 1) return;
            if (y - S > vh() * 1.5 || performance.now() < navUntil.current) return; // a jump, not a scroll
            armed = false;
            holding = true;
            l.scrollTo(S, {
              force: true,
              lock: true,
              duration: 0.5,
              easing: (t) => 1 - Math.pow(1 - t, 3),
              onComplete: () => {
                l.stop();
                timer = setTimeout(() => {
                  l.start();
                  holding = false;
                }, 650);
              },
            });
          };
          const off = lenis.on('scroll', onScroll);
          return () => {
            clearTimeout(timer);
            off?.();
          };
        })();

        // 2. Debris drifts up past you as you keep falling (wide screens only).
        if (window.matchMedia('(min-width: 901px)').matches) {
          gsap.utils.toArray('[data-drift]').forEach((el) => {
            const s = parseFloat(el.dataset.drift) || 0.5;
            gsap.fromTo(el, { y: 90 * s }, { y: -90 * s, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
        }

        // 2b. The burrow. First the surface: the hedgehog trots to the den, curls up and dives in, the camera follows
        //     him into the dark, the tunnel opens like an eye, and he lands inside. Then scrolling walks you sideways.
        if (window.matchMedia('(min-width: 901px)').matches) {
          const burrowEl = root.current.querySelector('.burrow');
          const track = root.current.querySelector('.burrow-track');
          const box = root.current.querySelector('.gate-box');
          const dist = () => Math.max(track.scrollWidth - window.innerWidth, 0);
          const intro = () => vh() * 1.7; // scroll spent on the way in
          // the den, in the box (layout sizes: unaffected by the zoom) and on screen
          const denX = DEN.x / DEN.w;
          const denY = DEN.y / DEN.h;
          const bw = () => box.offsetWidth;
          const bh = () => box.offsetHeight;
          const denScreen = () => ({ x: burrowEl.offsetWidth / 2, y: burrowEl.offsetHeight / 2 + (denY - 0.5) * bh() });
          const iris = (rad) => () => `circle(${rad()}px at ${denScreen().x}px ${denScreen().y}px)`;
          const W = Math.max(dist() / intro(), 0.5); // the walk, in units of the way in
          const E = 0.75; // the way out, in the same units
          // where the burrow hedgehog stands once the walk is over (layout values: unaffected by its tweens)
          const hogEl = root.current.querySelector('.burrow-hog');
          const hogEnd = () => {
            const cs = getComputedStyle(hogEl);
            const w = parseFloat(cs.width);
            const h = (w * 120) / 170;
            return { x: parseFloat(cs.left) + w / 2 + window.innerWidth * 0.72, y: burrowEl.offsetHeight - parseFloat(cs.bottom) - h * 0.55 };
          };
          const diag = () => Math.hypot(window.innerWidth, window.innerHeight);
          const shut = (rad) => () => `circle(${rad()}px at ${hogEnd().x}px ${hogEnd().y}px)`;
          const walk = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: burrowEl,
              start: 'top top',
              end: () => `+=${intro() * (1 + E) + dist()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (st) => {
                const t = st.progress * (1 + W + E);
                burrowEl.classList.toggle('walking', st.isActive && t > 1 && t < 1 + W);
              },
              onToggle: (st) => !st.isActive && burrowEl.classList.remove('walking'),
            },
          });
          // from the hedgehog where he stands to the ball's own spot (the ball is drawn further right)
          const fromHog = () => (0.12 + 0.055 - 0.32) * bw();
          walk
            // he crouches where he stands…
            .fromTo('.gate-hog', { scaleX: 1, scaleY: 1, y: 0, rotation: 0 }, { scaleX: 1.12, scaleY: 0.78, duration: 0.05, ease: 'power2.in', transformOrigin: '50% 100%' }, 0)
            // …and springs: one big leap, curled up in the air, straight into the den
            .to('.gate-hog', { scaleX: 0.9, scaleY: 1.15, y: () => -0.06 * bh(), rotation: -12, duration: 0.03, ease: 'power2.out' }, 0.05)
            .set('.gate-hog', { opacity: 0 }, 0.08)
            .set('.gate-ball', { opacity: 1 }, 0.08)
            .fromTo('.gate-ball', { x: fromHog, rotation: 0, scale: 1 }, { x: () => (denX - 0.32) * bw(), rotation: 900, scale: 0.42, duration: 0.3, ease: 'none' }, 0.08)
            .fromTo('.gate-ball', { y: () => -0.06 * bh() }, { y: () => -0.32 * bh(), duration: 0.14, ease: 'power2.out' }, 0.08)
            .to('.gate-ball', { y: () => (denY - 0.614) * bh(), duration: 0.16, ease: 'power2.in' }, 0.22)
            .to('.gate-ball', { opacity: 0, duration: 0.02 }, 0.38)
            .fromTo('.gate-puff', { scale: 0.3, opacity: 0 }, { scale: 1.3, opacity: 1, duration: 0.05, ease: 'power2.out' }, 0.39)
            .to('.gate-puff', { scale: 1.7, opacity: 0, duration: 0.07 }, 0.44)
            // the camera dives after him: the den swallows the screen
            .fromTo(
              box,
              { scale: 1 },
              {
                scale: () => (Math.hypot(window.innerWidth, window.innerHeight) * 1.6) / ((DEN.ry * 2 * bh()) / DEN.h),
                duration: 0.36,
                ease: 'power3.in',
              },
              0.46,
            )
            // in the dark, the tunnel opens like an eye
            .fromTo(
              '.burrow-inside',
              { clipPath: iris(() => 0) },
              { clipPath: iris(() => Math.hypot(window.innerWidth, window.innerHeight)), duration: 0.2, ease: 'power2.in' },
              0.76,
            )
            // a pencil circle rides the edge of the opening
            .fromTo(
              '.gate-iris-in',
              { width: 0, height: 0, left: () => denScreen().x, top: () => denScreen().y, opacity: 1 },
              { width: () => Math.hypot(window.innerWidth, window.innerHeight) * 2, height: () => Math.hypot(window.innerWidth, window.innerHeight) * 2, duration: 0.2, ease: 'power2.in' },
              0.76,
            )
            .set('.gate-iris-in', { opacity: 0 }, 0.97)
            .set('.burrow-gate', { autoAlpha: 0 }, 0.97)
            // and he drops in from the roof, onto his feet
            .fromTo('.burrow-hog', { y: () => -vh() * 0.75, rotation: -30 }, { y: 0, rotation: 0, duration: 0.16, ease: 'bounce.out' }, 0.84)
            // the walk
            .to(track, { x: () => -dist(), duration: W }, 1)
            .fromTo('.burrow-hog', { x: 0 }, { x: () => window.innerWidth * 0.72, duration: W, immediateRender: false }, 1)
            // the way out: at the end of the tunnel he turns to you, hops, and the burrow closes on him like an eye,
            // leaving the paper of the next stratum
            .to('.burrow-hog', { y: -26, rotation: -6, duration: 0.07, ease: 'power2.out' }, 1 + W + 0.02)
            .to('.burrow-hog', { y: 0, rotation: 0, duration: 0.07, ease: 'power2.in' }, 1 + W + 0.09)
            .fromTo(
              '.burrow-inside',
              { clipPath: shut(diag) },
              { clipPath: shut(() => 0), duration: 0.36, ease: 'power2.inOut', immediateRender: false },
              1 + W + 0.12,
            )
            .fromTo(
              '.burrow-iris-out',
              { width: () => diag() * 2, height: () => diag() * 2, left: () => hogEnd().x, top: () => hogEnd().y, opacity: 1 },
              { width: 0, height: 0, duration: 0.36, ease: 'power2.inOut', immediateRender: false },
              1 + W + 0.12,
            )
            .set('.burrow-iris-out', { opacity: 0 }, 1 + W + 0.48)
            // closed on him, he curls up and drops through the floor: the descent goes on below
            .set('.burrow-drop', { opacity: 1 }, 1 + W + 0.46)
            .fromTo(
              '.burrow-drop',
              { x: () => hogEnd().x, y: () => hogEnd().y, scale: 0.4, rotation: 0 },
              { scale: 1, duration: 0.05, ease: 'back.out(2)', immediateRender: false },
              1 + W + 0.46,
            )
            .to('.burrow-drop', { y: () => burrowEl.offsetHeight + 80, rotation: 540, duration: 0.2, ease: 'power2.in' }, 1 + W + 0.52)
            .to({}, { duration: 0.03 }, 1 + W + E - 0.03);
        }

        // 3. Chapter titles settle letter by letter, like things landing.
        gsap.utils.toArray('.chapter-title').forEach((h) => {
          gsap.from(h.querySelectorAll('.ltr'), {
            yPercent: (i) => 28 + (i % 3) * 14,
            rotation: (i) => [-9, 6, -4, 10][i % 4],
            ease: 'none',
            stagger: 0.02,
            scrollTrigger: { trigger: h, start: 'top 98%', end: 'top 62%', scrub: 0.5 },
          });
        });

        // 4. Pencil leader lines draw themselves onto each drawing.
        gsap.utils.toArray('.drawing').forEach((fig) => {
          const lines = fig.querySelectorAll('.leader');
          lines.forEach((l) => {
            const len = l.getTotalLength();
            gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
          });
          gsap.to(lines, {
            strokeDashoffset: 0,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
          });
        });

        // 4b. At the floor, the computer answers, one line after the other.
        gsap.from('.screen-line', {
          opacity: 0,
          stagger: 0.55,
          duration: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.floor-room', start: 'top 92%', toggleActions: 'play none none reverse' },
        });

        // 5. The rope of the path unrolls as you go down it.
        const rope = root.current.querySelector('.rope-line');
        if (rope) {
          const len = rope.getTotalLength();
          gsap.fromTo(
            rope,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.path-list', start: 'top 70%', end: 'bottom 60%', scrub: true } },
          );
        }

        return () => {
          ScrollTrigger.removeEventListener('refresh', markDepths);
          holdAtHole?.();
          window.removeEventListener('wheel', nudge);
          window.removeEventListener('touchmove', nudge);
          window.removeEventListener('keydown', onKey);
          window.removeEventListener('scroll', onScroll);
          document.removeEventListener('click', onLink, true);
          html.classList.remove('is-dark');
        };
      });
      return offRefresh;
    }, root);
    return () => ctx.revert();
  }, []);

  const climb = () => (lenisRef.current ? lenisRef.current.scrollTo(0, { duration: 2.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }));

  return (
    <div ref={root} className="page">
      <SketchDefs />
      <a className="skip" href="#contact">
        Aller au contact
      </a>

      <nav className="nav" aria-label="Navigation principale">
        <a className="nav-name" href="#top">
          J. Crochet
        </a>
        <ul className="nav-links">
          <li><a href="#projets">Projets</a></li>
          <li><a href="#outils">Outils</a></li>
          <li><a href="#parcours">Parcours</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* the meter repeats the nav for the mouse: hidden from assistive tech, its buttons out of the tab order */}
      <aside className="meter" ref={meter} aria-hidden="true">
        <svg className="meter-ruler" viewBox="0 0 24 400" preserveAspectRatio="none">
          <path d={strokePath([[12, 0], [12, 400]], 501, 0.8)} fill="none" stroke="currentColor" strokeWidth="1.6" />
          {Array.from({ length: 21 }, (_, i) => (
            <path key={i} d={strokePath([[i % 5 ? 7 : 2, i * 20], [12, i * 20]], 510 + i, 0.4)} fill="none" stroke="currentColor" strokeWidth="1.4" />
          ))}
        </svg>
        {NOTCHES.map(([id, label]) => (
          <button key={id} className="meter-notch" data-notch={id} tabIndex={-1} onClick={() => onNotch(id)}>
            <span>{label}</span>
          </button>
        ))}
        <div
          className="meter-hit"
          onPointerEnter={onMeterEnter}
          onPointerDown={onMeterDown}
          onPointerMove={onMeterMove}
          onPointerUp={onMeterUp}
          onPointerCancel={onMeterUp}
        />
        <div className="meter-ghost">
          <span className="meter-ghost-value" />
        </div>
        <div className="meter-mark">
          <HedgehogBall className="meter-figure" />
          <span className="meter-value">−0 m</span>
        </div>
      </aside>

      <main>
        {/* THE DARK ROOM: the way in, before any fact */}
        <section className="sky" id="top" aria-label="Introduction">
          <div className="sky-night" aria-hidden="true">
            <StarField seed={7} count={200} />
          </div>
          <div className="night night-far" aria-hidden="true">
            <StarField seed={8} count={90} crosses={8} />
            {NIGHT_FAR.map(([kind, x, y, size, rot, dur], i) => (
              <SpaceObject
                key={i}
                kind={kind}
                style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, '--r': `${rot.toFixed(0)}deg`, '--dur': `${dur.toFixed(1)}s`, '--d': `${-i * 0.9}s` }}
              />
            ))}
            {NIGHT_SPARKS.map(([x, y, w], i) => (
              <Sparkle key={i} style={{ left: `${x}%`, top: `${y}%`, width: w, height: w, '--d': `${-i * 0.6}s` }} />
            ))}
          </div>
          <div className="night night-near" aria-hidden="true">
            {NIGHT_NEAR.map(([kind, x, y, size, rot, dur], i) => (
              <SpaceObject
                key={i}
                kind={kind}
                style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, '--r': `${rot.toFixed(0)}deg`, '--dur': `${dur.toFixed(1)}s`, '--d': `${-i * 1.3}s` }}
              />
            ))}
          </div>
          <div className="room-glow" aria-hidden="true" />
          <div className="sky-space" aria-hidden="true">
            {ARRIVALS.map(([kind, x, y, w], i) => (
              <Planet key={i} kind={kind} seed={60 + i} style={{ left: `${x}%`, top: `${y}%`, width: `${w}vw` }} />
            ))}
          </div>
          <div className="rays" aria-hidden="true" />
          <div className="motes" aria-hidden="true">
            {MOTES.map(([x, y, w, d], i) => (
              <span key={i} style={{ left: `${x}%`, top: `${y}%`, width: w, height: w, '--d': `${d}s`, '--o': `${-i * 0.9}s` }} />
            ))}
          </div>
          {/* the house, room by room: drawn in chalk (scripts/draw_room.py) */}
          <div className="room room-a" aria-hidden="true">
            <svg className="room-floor" viewBox="0 0 1200 20" preserveAspectRatio="none">
              <path d={strokePath(Array.from({ length: 13 }, (_, i) => [i * 100, 10 + ((i * 18) % 7) - 3]), 1351, 1.4)} fill="none" style={{ stroke: 'var(--star)' }} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <img className="prop ra-door" src="/room/door.png" alt="" />
            <img className="prop ra-window" src="/room/window.png" alt="" />
            <img className="prop ra-bed" src="/room/bed.png" alt="" />
            <img className="prop ra-pc" src="/room/pc-hog.png" alt="" />
          </div>
          <div className="room room-d" aria-hidden="true">
            <svg className="room-floor" viewBox="0 0 1200 20" preserveAspectRatio="none">
              <path d={strokePath(Array.from({ length: 13 }, (_, i) => [i * 100, 10 + ((i * 21) % 7) - 3]), 1354, 1.4)} fill="none" style={{ stroke: 'var(--star)' }} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="prop rd-monitor">
              <img src="/room/monitor.png" alt="" />
              <pre className="ascii-hog">{ASCII_HOG}</pre>
            </div>
            <img className="prop rd-books" src="/room/books.png" alt="" />
            <img className="prop rd-mug" src="/room/mug.png" alt="" />
          </div>
          <div className="torch" aria-hidden="true" />
          <div className="hang" ref={hangRef}>
            <div className="hang-swing">
              <span className="cord" aria-hidden="true" />
              <button
                className="bulb"
                aria-label="Allumer la lumière pour commencer"
                onPointerDown={onBulbDown}
                onPointerMove={onBulbMove}
                onPointerUp={onBulbUp}
                onPointerCancel={onBulbUp}
                onClick={() => turnOnRef.current?.()}
              >
                <span className="bulb-glow" aria-hidden="true" />
                <Bulb />
              </button>
            </div>
          </div>
          {/* a small arrow beside the bulb: pull it down */}
          <svg className="pull-cue" viewBox="0 0 40 90" aria-hidden="true">
            <path d={strokePath([[20, 4], [18, 30], [21, 56], [20, 82]], 1365, 0.5)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d={strokePath([[8, 66], [20, 84], [32, 66]], 1366, 0.4)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="switch-hint" aria-hidden="true">
            <svg viewBox="0 0 60 40">
              <path d={strokePath([[56, 30], [40, 34], [20, 26], [8, 10]], 1361, 0.6)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d={strokePath([[4, 20], [7, 9], [17, 12]], 1362, 0.4)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>
              il fait noir… tirez l’ampoule
              <small>(ou cherchez avec la souris)</small>
            </span>
          </p>
          <div className="sky-lines">
            {SKY_LINES.map((l, i) => (
              <p key={i} className={`sky-line sky-line-${i}`}>
                <span className="sky-small">{l.small}</span>
                {l.age ? (
                  <span className="sky-age">
                    <span className="sr-only">
                      {l.pre} {l.age} ans
                    </span>
                    <span className="age-pre" aria-hidden="true">
                      {l.pre}
                    </span>
                    <span className="age-n" aria-hidden="true">
                      {l.age}
                    </span>
                    <span className="age-ans" aria-hidden="true">
                      ans
                    </span>
                  </span>
                ) : (
                  <Letters text={l.big} className="sky-big" />
                )}
                {l.then && <Letters text={l.then} className="sky-big sky-then" />}
              </p>
            ))}
          </div>
          <a className="sky-cue" href="#qui">
            descendre
            <svg viewBox="0 0 20 40" aria-hidden="true">
              <path d={strokePath([[10, 2], [10, 34]], 73)} fill="none" stroke="currentColor" strokeWidth="2" />
              <path d={strokePath([[3, 26], [10, 36], [17, 26]], 74, 0.6)} fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </section>

        {/* SURFACE: almost nothing, on purpose */}
        <section className="hero" aria-label="Accueil">
          <div className="dream" aria-hidden="true">
            <div className="dream-far">
              <StarField seed={3} />
              {WORLDS.filter((w) => w[1] === 'far').map(([kind, , x, y, w, dur], i) => (
                <Planet
                  key={kind}
                  kind={kind}
                  seed={40 + i}
                  className={`world world-${kind}`}
                  style={{ left: `${x}%`, top: `${y}%`, width: `${w}vw`, '--dur': `${dur}s`, '--d': `${-i * 2.3}s` }}
                />
              ))}
              {SPARKS.map(([x, y, w], i) => (
                <Sparkle key={i} style={{ left: `${x}%`, top: `${y}%`, width: w, height: w, '--d': `${-i * 0.7}s` }} />
              ))}
            </div>
            <div className="dream-mid">
              {WORLDS.filter((w) => w[1] === 'mid').map(([kind, , x, y, w, dur], i) => (
                <Planet
                  key={kind}
                  kind={kind}
                  seed={50 + i}
                  className={`world world-${kind}`}
                  style={{ left: `${x}%`, top: `${y}%`, width: `${w}vw`, '--dur': `${dur}s`, '--d': `${-i * 1.7}s` }}
                />
              ))}
              {FLOATERS.map(([kind, x, y, size, rot, dur, px = x, py = y], i) => (
                <SpaceObject
                  key={i}
                  kind={kind}
                  className="floater"
                  style={{ '--x': `${x}%`, '--y': `${y}%`, '--px': `${px}%`, '--py': `${py}%`, width: size, height: size, '--r': `${rot}deg`, '--dur': `${dur}s`, '--d': `${-i * 1.3}s` }}
                />
              ))}
            </div>
          </div>
          <div className="hero-land" aria-hidden="true">
            <svg className="hero-ground" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <path d={strokePath(Array.from({ length: 13 }, (_, i) => [i * 100, 20 + ((i * 29) % 9) - 4]), 31, 2)} fill="none" style={{ stroke: 'var(--star)' }} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </svg>
            <LampPost className="lamp-far" />
            <LampPost className="lamp-r" />
            <LampPost className="lamp-l" />
            {PATCHES.map(([x, y, w, seed, count], i) => (
              <Flowers key={seed} seed={seed} count={count} className={`patch ${i >= 8 ? 'patch-far' : ''}`} style={{ left: `${x}%`, bottom: `${y}%`, width: `${w}vw` }} />
            ))}
            <Bush className="bush-l" seed={11} />
            <Bush className="bush-r" seed={23} />
          </div>
          <h1 className="hero-name">
            <Letters text={`${person.first} ${person.last}`} bob />
          </h1>
          <div className="hero-pit">
            {RISING.map((k, i) => (
              <Doodle key={i} kind={k} className={`rising rising-${i}`} />
            ))}
            <button
              className="hero-figure"
              aria-label="Faire sursauter le hérisson"
              onClick={(e) => {
                const b = e.currentTarget;
                b.classList.remove('hop');
                void b.offsetWidth;
                b.classList.add('hop');
              }}
            >
              <Hedgehog />
            </button>
            <HedgehogBall className="hero-ball" />
            <svg className="hero-puff" viewBox="0 0 200 80" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => {
                const a = Math.PI * (1.05 + (i / 8) * 0.9);
                return (
                  <path
                    key={i}
                    d={strokePath([[100 + Math.cos(a) * 30, 60 + Math.sin(a) * 14], [100 + Math.cos(a) * 80, 60 + Math.sin(a) * 50]], 940 + i, 0.6)}
                    fill="none"
                    style={{ stroke: 'var(--star)' }}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <Hole className="hero-hole" />
          </div>
          <a className="hero-cue" href="#qui">
            tomber
            <svg viewBox="0 0 20 40" aria-hidden="true">
              <path d={strokePath([[10, 2], [10, 34]], 71)} fill="none" stroke="currentColor" strokeWidth="2" />
              <path d={strokePath([[3, 26], [10, 36], [17, 26]], 72, 0.6)} fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
          <div className="hero-void" aria-hidden="true" />
          <div className="shaft" aria-hidden="true">
            {SHAFT.map((w, side) => (
              <div key={side} className={`shaft-wall ${side ? 'shaft-r' : 'shaft-l'}`}>
                <svg className="shaft-edge" viewBox="0 0 100 1000" preserveAspectRatio="none">
                  <path d={'M101,0 ' + w.edge.map(([x, y]) => `L${x.toFixed(1)},${y}`).join(' ') + ' L101,1000 Z'} style={{ fill: 'var(--void-ink)' }} />
                  <path d={'M' + w.edge.map(([x, y]) => `${x.toFixed(1)},${y}`).join(' L')} fill="none" style={{ stroke: 'var(--land-edge)' }} strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </svg>
                {w.things.map(([kind, x, y, size, rot], i) => (
                  <SpaceObject key={i} kind={kind} style={{ [side ? 'right' : 'left']: `${x}%`, top: `${y}%`, width: size, height: size, '--r': `${rot.toFixed(0)}deg` }} />
                ))}
                {side === 1 &&
                  MARKS.map((at) => (
                    <span key={at} className="shaft-mark" data-at={at} style={{ top: `${(at / SHAFT_H) * 100}%` }}>
                      <span>−{Math.round((at / 420) * 30)} m</span>
                    </span>
                  ))}
              </div>
            ))}
          </div>
          <div className="wind" aria-hidden="true">
            {WIND.map(([x, h, o], i) => (
              <span key={i} style={{ left: `${x}%`, height: `${h}vh`, opacity: o }} />
            ))}
          </div>
          <div className="fall-hog" aria-hidden="true">
            <HedgehogBall className="fall-ghost fall-ghost-3" />
            <HedgehogBall className="fall-ghost fall-ghost-2" />
            <HedgehogBall className="fall-ghost fall-ghost-1" />
            <HedgehogBall className="fall-ball" />
          </div>
          <div className="stream" aria-hidden="true">
            {STREAM.map((d, i) => (
              <Doodle key={i} kind={d.kind} style={{ left: `${d.x}%`, top: 0, width: d.size, height: d.size }} />
            ))}
          </div>
        </section>

        {/* STRATUM 0: who is falling */}
        <section className="stratum s1 who">
          <svg className="edge" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
            <path d={strokePath(Array.from({ length: 25 }, (_, i) => [i * 50, 18 + ((i * 37) % 23)]), 801, 3) + ' L1200,0 L0,0 Z'} style={{ fill: 'var(--void-ink)' }} />
          </svg>
          <Deco className="on-paper deco-who" drift={0.8}>
            <Planet kind="ringed" seed={71} />
          </Deco>
          <Deco className="on-paper deco-who-2" drift={0.4}>
            <SpaceObject kind="chair" style={{ '--r': '18deg' }} />
          </Deco>
          <Chapter id="qui" title="Qui tombe ?" depth={38} seed={79} />
          <div className="who-body">
            <p className="who-want">
              {intro.want}
              <Scribble w={300} h={14} seed={61} className="who-underline" />
            </p>
            <p className="who-pitch">{intro.pitch}</p>
            <p className="who-links">
              <a href={`mailto:${person.email}`}>m’écrire</a>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
        </section>

        {/* STRATUM 1: projects */}
        <section className="stratum s1">
          <Deco className="on-paper deco-proj" drift={0.7}>
            <Planet kind="ember" seed={73} />
          </Deco>
          <Chapter id="projets" title="Ce que j’ai construit" depth={112} seed={81} />
          <p className="stratum-intro">
            Une sélection parmi la vingtaine de dépôts de mon <a href={person.github} target="_blank" rel="noopener noreferrer">GitHub</a>, du shell au packer ELF. Tout est
            fait de zéro, pour voir ce qui se passe en dessous.
          </p>
          <div className="projects">
            {featured.map((p) => (
              <article key={p.id} className={`project project-${p.id}`}>
                <ProjectDrawing id={p.id} notes={p.notes} />
                <div className="project-text" data-drift="0.25">
                  <h3 className="project-name">{p.name.replace(/_/g, '_\u200b')}</h3>
                  <p className="project-what">{p.what}</p>
                  <p className="project-body">{p.text}</p>
                  <ul className="log" aria-label={`Côté sécurité de ${p.name}`}>
                    {p.log.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                  <a className="project-link" href={p.url} target="_blank" rel="noopener noreferrer">
                    voir le dépôt
                  </a>
                </div>
              </article>
            ))}
          </div>

        </section>

        {/* THE BURROW: the rest of GitHub, walked sideways */}
        <section className="burrow" aria-labelledby="terrier-title">
          {/* the way in, from the surface */}
          <div className="burrow-gate on-paper" aria-hidden="true">
            <div className="gate-box">
              <BurrowGate />
              <svg className="gate-puff" viewBox="0 0 200 120">
                {Array.from({ length: 11 }, (_, i) => {
                  const a = Math.PI * (1.02 + (i / 10) * 0.96);
                  return (
                    <path
                      key={i}
                      d={strokePath([[100 + Math.cos(a) * 34, 70 + Math.sin(a) * 20], [100 + Math.cos(a) * 88, 70 + Math.sin(a) * 58]], 1810 + i, 0.6)}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <Hedgehog className="gate-hog" seed={41} />
              <HedgehogBall className="gate-ball" />
            </div>
          </div>
          <div className="burrow-after" aria-hidden="true" />
          <HedgehogBall className="burrow-drop" />
          <svg className="gate-iris burrow-iris-out" viewBox="0 0 200 200" aria-hidden="true">
            <path d={roughEllipse(100, 100, 99, 99, 1840, 1.14, 0.03)} fill="none" stroke="#b88a66" strokeWidth="5" vectorEffect="non-scaling-stroke" />
            <path d={roughEllipse(100, 100, 98, 98, 1841, 1.1, 0.03)} fill="none" stroke="var(--ink)" strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className="gate-iris gate-iris-in" viewBox="0 0 200 200" aria-hidden="true">
            <path d={roughEllipse(100, 100, 99, 99, 1830, 1.14, 0.03)} fill="none" stroke="#b88a66" strokeWidth="5" vectorEffect="non-scaling-stroke" />
            <path d={roughEllipse(100, 100, 98, 98, 1831, 1.1, 0.03)} fill="none" stroke="var(--ink)" strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="burrow-inside">
          <svg className="burrow-earth burrow-roof" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
            <path
              d={'M0,0 L1200,0 L1200,80 ' + strokePath(Array.from({ length: 13 }, (_, i) => [1200 - i * 100, 84 + ((i * 41) % 26)]), 851, 3).replace(/^M/, 'L') + ' Z'}
              style={{ fill: 'url(#hatch-a3)' }}
              stroke="var(--ink)"
              strokeWidth="2"
            />
          </svg>
          <svg className="burrow-earth burrow-ground" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
            {/* solid under the hatching, so the signposts really go into the ground */}
            <path d={'M0,120 L1200,120 L1200,40 ' + strokePath(Array.from({ length: 13 }, (_, i) => [1200 - i * 100, 34 + ((i * 37) % 22)]), 852, 3).replace(/^M/, 'L') + ' Z'} fill="#e7e0d5" />
            <path
              d={'M0,120 L1200,120 L1200,40 ' + strokePath(Array.from({ length: 13 }, (_, i) => [1200 - i * 100, 34 + ((i * 37) % 22)]), 852, 3).replace(/^M/, 'L') + ' Z'}
              style={{ fill: 'url(#hatch-a3)' }}
              stroke="var(--ink)"
              strokeWidth="2"
            />
          </svg>
          <div className="burrow-track">
            <div className="burrow-intro">
              <h3 id="terrier-title" className="project-name">
                Le terrier
              </h3>
              <p>
                Tout le reste est rangé ici : une vingtaine de dépôts, de la sécurité au cursus 42.{' '}
                <span className="burrow-tour">Continuez à descendre, le hérisson vous fait la visite.</span>
              </p>
            </div>
            {burrow.map((g, gi) => (
              <div key={g.sign} className={`burrow-group ${gi === burrow.length - 1 ? 'burrow-chips' : ''}`}>
                {/* a wooden signpost planted in the floor of the tunnel, pointing the way; hover it to read what the notion covers */}
                <div className="burrow-sign" tabIndex={0}>
                  <span className="sign-board">
                    <svg className="sign-plank" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        d={strokePath([[4, 7], [100, 4 + (gi % 3)], [176, 5], [197, 30], [177, 56], [90, 55 - (gi % 2) * 2], [5, 53], [4, 7]], 860 + gi, 1.2) + ' Z'}
                        style={{ fill: 'color-mix(in oklab, var(--a3) 55%, var(--paper))' }}
                        stroke="var(--ink)"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="sign-text">{g.sign}</span>
                  </span>
                  <svg className="sign-post" viewBox="0 0 24 200" preserveAspectRatio="none" aria-hidden="true">
                    <path d={strokePath([[7, 0], [8, 200]], 900 + gi, 0.6) + ' L17,200 ' + strokePath([[16, 200], [17, 0]], 905 + gi, 0.6).replace(/^M/, 'L') + ' Z'} style={{ fill: 'color-mix(in oklab, var(--a3) 40%, var(--paper))' }} stroke="var(--ink)" strokeWidth="2" />
                  </svg>
                  {g.desc && <span className="sign-tip">{g.desc}</span>}
                </div>
                {g.repos.map((r) => (
                  <a key={r.name} className="tag" href={r.url} target="_blank" rel="noopener noreferrer">
                    <span className="tag-name">{r.name.replace(/_/g, '_\u200b')}</span>
                    <span className="tag-lang">{r.lang}</span>
                    <span className="tag-text">{r.text}</span>
                  </a>
                ))}
              </div>
            ))}
            <div className="burrow-end">
              <a href={person.github} target="_blank" rel="noopener noreferrer">Tout voir sur github.com/asnoj</a>
            </div>
          </div>
          <Hedgehog className="burrow-hog" seed={33} />
          </div>
        </section>

        {/* STRATUM 2: skills */}
        <section className="stratum s2">
          <Deco className="deco-skills" drift={0.2}>
            <Flowers seed={31} count={6} />
          </Deco>
          <Deco className="on-paper deco-skills-2" drift={0.6}>
            <SpaceObject kind="bed" style={{ '--r': '-12deg' }} />
          </Deco>
          <Chapter id="outils" title="Mes outils" depth={190} seed={91} />
          <p className="stratum-intro">Entourés au crayon : ce que j’apporte à une équipe sécurité.</p>
          <div className="skills">
            {skills.map((g, i) => (
              <div key={g.id} className={`skill skill-${g.id} ${g.on ? 'on' : ''}`} data-drift={[0.3, 0.6, 0.2, 0.5, 0.4][i]}>
                <h3 className="skill-title">
                  {g.on && (
                    <svg className="skill-ring sketch" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
                      <path d={roughEllipse(150, 40, 140, 30, 900 + i, 1.2)} fill="none" stroke="var(--ring)" strokeWidth="3" />
                    </svg>
                  )}
                  {g.title}
                </h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* STRATUM 3: path, as a climbing rope */}
        <section className="stratum s3">
          <Chapter id="parcours" title="D’où je viens" depth={268} seed={95} />
          <div className="path-list">
            <svg className="rope" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
              <path
                className="rope-line"
                d={strokePath(Array.from({ length: 21 }, (_, i) => [20 + Math.sin(i * 1.3) * 7, i * 50]), 701, 1.2)}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <ol>
              {path.map((s, i) => (
                <li key={s.title} className="step">
                  <svg className="knot sketch" viewBox="0 0 40 40" aria-hidden="true">
                    <path d={roughEllipse(20, 20, 11, 11, 720 + i, 1.4)} style={{ fill: 'url(#hatch-a2)' }} stroke="var(--ink)" strokeWidth="2.4" />
                  </svg>
                  <p className="step-when">{s.when}</p>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-where">{s.where}</p>
                  <p className="step-text">{s.text}</p>
                </li>
              ))}
              <li className="step step-next">
                <svg className="knot sketch" viewBox="0 0 40 40" aria-hidden="true">
                  <path d={roughEllipse(20, 20, 11, 11, 799, 1.4)} fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeDasharray="4 5" />
                </svg>
                <LampPost className="on-paper deco-next" />
                <p className="step-when">janv. 2027</p>
                <h3 className="step-title">Votre stage ou alternance ?</h3>
                <p className="step-text">
                  Le prochain nœud de la corde est encore vide. <a href="#contact">Me contacter</a>
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* STRATUM 4: off-screen */}
        <section className="stratum s4">
          <Deco className="on-paper deco-off" drift={0.7}>
            <Planet kind="ice" seed={77} />
          </Deco>
          <Deco className="on-paper deco-off-2" drift={0.35}>
            <SpaceObject kind="table" style={{ '--r': '8deg' }} />
          </Deco>
          <Chapter id="hors-ecran" title="Hors de l’écran" depth={344} seed={97} />
          <div className="offscreen">
            <ul className="interests">
              {interests.map((it, i) => (
                <li key={it.id} data-drift={[0.5, 0.2, 0.7, 0.35][i]}>
                  <InterestIcon id={it.id} />
                  <span>
                    {it.label}
                    {it.detail && <small>{it.detail}</small>}
                  </span>
                </li>
              ))}
            </ul>
            <div className="traits">
              <h3>Comment je travaille</h3>
              <ul>
                {traits.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="facts">Anglais B2 · Permis B, véhiculé · basé au Havre (76)</p>
            </div>
          </div>
        </section>

        {/* THE FLOOR */}
        <section className="floor" id="contact">
          <Chapter id="chez-moi" title="Chez moi." depth={DEPTH} seed={99} />
          <p className="floor-lead">Entrez, installez-vous : le thé est encore chaud. C’est ici qu’on se parle.</p>
          <a className="floor-mail" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <ul className="floor-links">
            <li><a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href={person.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
          {/* the room at the bottom of the fall: an armchair, a desk with the computer on, tea, and lights */}
          <CozyRoom />
          <button className="climb" onClick={climb}>
            <svg viewBox="0 0 30 90" aria-hidden="true">
              <path d={strokePath([[15, 88], [12, 60], [18, 32], [15, 4]], 990, 1)} fill="none" stroke="currentColor" strokeWidth="2.6" />
              <path d={strokePath([[6, 16], [15, 4], [24, 16]], 991, 0.6)} fill="none" stroke="currentColor" strokeWidth="2.6" />
            </svg>
            Remonter à la surface
          </button>
        </section>
      </main>
    </div>
  );
}
