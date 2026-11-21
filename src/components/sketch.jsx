// Seeded PRNG so every drawing keeps the same wobble between renders.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

// A pencil stroke through points: each segment gets a slightly bowed curve.
export function strokePath(points, seed = 1, wob = 1.6) {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 2 * wob;
  let d = `M${f(points[0][0] + j())},${f(points[0][1] + j())}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mx = (x0 + x1) / 2 + j() * 1.6;
    const my = (y0 + y1) / 2 + j() * 1.6;
    d += ` Q${f(mx)},${f(my)} ${f(x1 + j())},${f(y1 + j())}`;
  }
  return d;
}

// Rectangle drawn the way a hand does it: corners overshoot, lines double up.
export function roughRect(x, y, w, h, seed = 1, wob = 2) {
  const r = rng(seed);
  const o = () => (r() - 0.3) * 6;
  const one = (s) =>
    strokePath(
      [
        [x - o(), y],
        [x + w + o(), y],
        [x + w, y - o()],
        [x + w, y + h + o()],
        [x + w + o(), y + h],
        [x - o(), y + h],
        [x, y + h + o()],
        [x, y - o()],
      ],
      s,
      wob,
    );
  return `${one(seed)} ${one(seed + 7)}`;
}

// A hand-drawn loop: an ellipse that overshoots its start.
export function roughEllipse(cx, cy, rx, ry, seed = 1, turns = 1.18, wob = 0.06) {
  const r = rng(seed);
  const start = r() * Math.PI * 2;
  const steps = 28;
  const pts = [];
  for (let i = 0; i <= steps * turns; i++) {
    const a = start + (i / steps) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * wob + (i / (steps * turns)) * 0.05;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return strokePath(pts, seed + 3, 0.6);
}

// Shared SVG defs: hatching patterns and the pencil "boil" filter. The boil filter is static: re-seeding it on a timer forced every
// drawing on the page to re-rasterize several times a second.
export function SketchDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="bush" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
          <rect width="6" height="6" fill="#7fd9d4" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#4fb0bf" strokeWidth="2.4" />
        </pattern>
        <pattern id="hatch-wall" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="6" height="6" fill="#2e1773" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#4b2aa8" strokeWidth="2" />
        </pattern>
        {[
          ['spine', 'var(--ink)'],
          ['spine-light', 'var(--light)'],
        ].map(([id, c]) => (
          <pattern key={id} id={id} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(58)">
            <line x1="0" y1="0" x2="0" y2="5" style={{ stroke: c }} strokeWidth="1.7" />
          </pattern>
        ))}
        {/* dream colours: [id, wash, line, angle] */}
        {[
          ['tree', '#7ff3ea', '#22b8c8', -40, 1],
          ['tree-far', '#a9e9f0', '#6fc9dc', -40, 1],
          ['trunk', '#ffd3ea', '#e58fbf', 70, 1],
          ['p-orange', '#fdd08a', '#ef8a45', -30],
          ['p-orange-deep', '#f6a457', '#c9542a', 40],
          ['p-ice', '#bff6ff', '#43d3f2', 55],
          ['p-rose', '#ffd6f5', '#ee8fd8', -50],
          ['p-violet', '#e6d9ff', '#a98af5', 35],
          ['p-mint', '#dff5d6', '#9fd3a8', -20],
          ['p-red', '#ffb59e', '#e0533f', 25],
          ['p-shade', 'transparent', '#2a0f7a', -55],
        ].map(([id, wash, line, rot, op = 0.7]) => (
          <pattern key={id} id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
            <rect width="6" height="6" fill={wash} opacity={op} />
            <line x1="0" y1="0" x2="0" y2="6" stroke={line} strokeWidth="2.6" />
          </pattern>
        ))}
        {['a1', 'a2', 'a3', 'a4'].map((k, i) => (
          <pattern
            key={k}
            id={`hatch-${k}`}
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${[-38, 52, -24, 64][i]})`}
          >
            <rect width="7" height="7" style={{ fill: `var(--${k})` }} opacity="0.5" />
            <line x1="0" y1="0" x2="0" y2="7" style={{ stroke: `var(--${k})` }} strokeWidth="3.4" />
          </pattern>
        ))}
      </defs>
    </svg>
  );
}
