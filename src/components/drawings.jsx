import { useId } from 'react';
import { roughEllipse, roughRect, strokePath, rng } from './sketch.jsx';

const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
const thin = { ...ink, strokeWidth: 1.4 };
const handText = { fontFamily: 'var(--hand)', fontStyle: 'italic', fontWeight: 500, fill: 'var(--ink)' };

// Zigzag of spines along an elliptical arc: alternates between the body edge and the spine tips.
function spines(cx, cy, rx, ry, a0, a1, n, reach, seed) {
  const r = rng(seed);
  const pts = [];
  for (let k = 0; k <= n * 2; k++) {
    const a = a0 + ((a1 - a0) * k) / (n * 2);
    const out = k % 2 ? reach * (0.85 + r() * 0.3) : 1;
    pts.push([cx + Math.cos(a) * rx * out, cy + Math.sin(a) * ry * out]);
  }
  return pts;
}

// Rows of single quills, drawn one by one along an arc: each leans back toward the tail, like a hand would draw them.
function quills(cx, cy, rx, ry, a0, a1, n, len, seed) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, k) => {
    const a = a0 + ((a1 - a0) * (k + 0.5 + (r() - 0.5) * 0.5)) / n;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    const out = a - 0.32 - r() * 0.2; // leaning back
    const l = len * (0.75 + r() * 0.5);
    return `M${x.toFixed(1)},${y.toFixed(1)} L${(x + Math.cos(out) * l).toFixed(1)},${(y + Math.sin(out) * l).toFixed(1)}`;
  }).join(' ');
}

// The hedgehog, drawn facing right. `light` draws it for a dark ground.
// A plump back of quills (outline, hatching, then rows of single strokes), a soft snout, a shiny eye, a blush.
function HedgehogArt({ light = false, seed = 1 }) {
  const spine = light ? 'url(#spine-light)' : 'url(#spine)';
  const back = spines(80, 86, 58, 48, Math.PI * 0.95, Math.PI * 1.86, 17, 1.3, seed);
  const outline = [...back, [120, 98], [104, 103], [72, 105], [42, 103], [26, 96], back[0]];
  const face = [[108, 54], [118, 50], [130, 54], [142, 64], [154, 74], [161, 80], [156, 88], [144, 94], [130, 99], [116, 101]];
  return (
    <g>
      {/* the back: paper under the quills, crayon hatching, a pencil outline */}
      <path d={strokePath(outline, seed + 1, 0.7)} style={{ fill: 'var(--paper)' }} />
      <path d={strokePath(outline, seed + 1, 0.7)} style={{ fill: spine }} opacity="0.55" />
      <path d={strokePath(outline, seed + 1, 0.7)} fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
      {/* quills, three rows, the inner ones shorter */}
      <path d={quills(80, 88, 50, 38, Math.PI * 1.0, Math.PI * 1.8, 16, 13, seed + 11)} {...thin} strokeWidth="1.6" />
      <path d={quills(80, 90, 38, 28, Math.PI * 1.02, Math.PI * 1.78, 12, 11, seed + 12)} {...thin} strokeWidth="1.4" />
      <path d={quills(80, 92, 24, 16, Math.PI * 1.05, Math.PI * 1.75, 8, 9, seed + 13)} {...thin} strokeWidth="1.2" opacity="0.8" />
      {/* a little tail */}
      <path d={strokePath([[27, 94], [19, 97], [23, 92]], seed + 14, 0.3)} {...thin} strokeWidth="1.8" />
      {/* face: a soft snout, an ear, a nose that shines */}
      <path d={strokePath(face, seed + 3, 0.5)} style={{ fill: 'var(--paper)' }} stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d={strokePath([[118, 51], [119, 43], [127, 45], [128, 54]], seed + 7, 0.3)} style={{ fill: 'var(--paper)' }} stroke="var(--ink)" strokeWidth="1.9" />
      <path d={strokePath([[121, 49], [124, 47]], seed + 15, 0.2)} {...thin} strokeWidth="1.2" />
      <path d={roughEllipse(159, 80, 4.6, 4.2, seed + 4)} style={{ fill: 'var(--ink)' }} />
      <circle cx="157.6" cy="78.4" r="1.2" style={{ fill: 'var(--paper)' }} />
      <path d={roughEllipse(137, 85, 6.5, 3.4, seed + 6, 1)} style={{ fill: 'url(#p-rose)' }} />
      <path d={strokePath([[146, 90], [149.5, 92.5], [153, 90.5]], seed + 16, 0.2)} {...thin} strokeWidth="1.6" />
      {/* eye, watching: an eyelid line, a pupil with a highlight */}
      <path d={strokePath([[128, 65], [133, 62.5], [139, 64]], seed + 17, 0.2)} {...thin} strokeWidth="1.6" />
      <path d={roughEllipse(134, 72, 4.4, 5, seed + 8, 1.05, 0.02)} style={{ fill: 'var(--paper)' }} stroke="var(--ink)" strokeWidth="1.7" />
      <g className="pupils">
        <circle cx="134.6" cy="73" r="2.7" style={{ fill: 'var(--ink)' }} />
        <circle cx="135.6" cy="71.8" r="0.9" style={{ fill: 'var(--paper)' }} />
      </g>
      {/* feet, with tiny toes */}
      <g className="leg leg-l">
        <path d={strokePath([[56, 103], [54, 111], [60, 112]], seed + 9, 0.3)} {...ink} strokeWidth="2.6" />
      </g>
      <g className="leg leg-r">
        <path d={strokePath([[104, 102], [105, 110], [111, 110.5]], seed + 10, 0.3)} {...ink} strokeWidth="2.6" />
      </g>
    </g>
  );
}

export function Hedgehog({ className, light, flip = false, seed = 1 }) {
  return (
    <svg className={className} viewBox="0 0 170 120" aria-hidden="true">
      <g transform={flip ? 'translate(170 0) scale(-1 1)' : undefined}>
        <HedgehogArt light={light} seed={seed} />
      </g>
    </svg>
  );
}

// Rolled up: how a hedgehog falls. Quills all round, the snout tucked in, eyes shut.
export function HedgehogBall({ className, light }) {
  const spine = light ? 'url(#spine-light)' : 'url(#spine)';
  const ring = spines(50, 50, 30, 30, 0, Math.PI * 2, 20, 1.36, 51);
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g>
        <path d={strokePath(ring, 52, 0.5)} style={{ fill: 'var(--paper)' }} />
        <path d={strokePath(ring, 52, 0.5)} style={{ fill: spine }} opacity="0.55" />
        <path d={strokePath(ring, 52, 0.5)} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d={quills(50, 50, 24, 24, 0, Math.PI * 2, 18, 9, 56)} {...thin} strokeWidth="1.4" />
        <path d={quills(50, 50, 15, 15, 0, Math.PI * 2, 11, 7, 57)} {...thin} strokeWidth="1.2" opacity="0.8" />
        <path d={roughEllipse(63, 63, 11, 9, 54)} style={{ fill: 'var(--paper)' }} stroke="var(--ink)" strokeWidth="1.9" />
        <path d={roughEllipse(72, 66, 2.8, 2.5, 55)} style={{ fill: 'var(--ink)' }} />
        <path d={strokePath([[57, 60], [60, 62.5], [63.5, 60.5]], 58, 0.2)} {...thin} strokeWidth="1.5" />
        <path d={roughEllipse(62, 68, 3.4, 1.8, 59, 1)} style={{ fill: 'url(#p-rose)' }} />
      </g>
    </svg>
  );
}

// A well dug into the dream ground: back wall, depth gradient, grass on the lip.
export function Hole({ className }) {
  const r = rng(24);
  const tufts = Array.from({ length: 16 }, (_, k) => {
    const a = Math.PI * (0.9 + (k / 15) * 1.2) + (r() - 0.5) * 0.1;
    return [200 + Math.cos(a) * 192, 84 + Math.sin(a) * 66];
  });
  return (
    <svg className={className} viewBox="0 0 400 168" aria-hidden="true">
      <defs>
        <radialGradient id="well" cx="50%" cy="62%" r="60%">
          <stop offset="0%" stopColor="#030108" />
          <stop offset="55%" stopColor="#0d0620" />
          <stop offset="100%" stopColor="#24104f" />
        </radialGradient>
      </defs>
      {/* the pit */}
      <path d={roughEllipse(200, 84, 190, 64, 21, 1.02, 0.03)} fill="url(#well)" />
      {/* its back wall, catching a little light */}
      <path
        d={strokePath(
          [
            ...Array.from({ length: 19 }, (_, k) => {
              const a = Math.PI + (Math.PI * k) / 18;
              return [200 + Math.cos(a) * 188, 84 + Math.sin(a) * 62];
            }),
            ...Array.from({ length: 19 }, (_, k) => {
              const a = 2 * Math.PI - (Math.PI * k) / 18;
              return [200 + Math.cos(a) * 172, 100 + Math.sin(a) * 40];
            }),
          ],
          25,
          0.6,
        )}
        style={{ fill: 'url(#hatch-wall)' }}
        opacity="0.9"
      />
      <path d={strokePath(Array.from({ length: 19 }, (_, k) => {
        const a = 2 * Math.PI - (Math.PI * k) / 18;
        return [200 + Math.cos(a) * 172, 100 + Math.sin(a) * 40];
      }), 26, 0.8)} fill="none" style={{ stroke: 'var(--star)' }} strokeWidth="1.2" opacity="0.45" />
      {/* the lip */}
      <path d={roughEllipse(200, 84, 192, 66, 22, 1.2, 0.05)} fill="none" style={{ stroke: 'var(--star)' }} strokeWidth="2.4" strokeLinecap="round" />
      {/* grass on the edge */}
      {tufts.map(([x, y], k) => (
        <path
          key={k}
          d={strokePath([[x - 5, y + 2], [x - 2, y - 8], [x, y + 1], [x + 4, y - 9], [x + 6, y + 2]], 30 + k, 0.5)}
          fill="none"
          style={{ stroke: 'var(--grass)' }}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {/* a stone about to go */}
      <path d={roughEllipse(352, 128, 9, 6, 27)} style={{ fill: 'var(--land-edge)' }} stroke="var(--ink)" strokeWidth="1.6" />
    </svg>
  );
}

const arrowHead = (x, y, dir, seed) => {
  const [dx, dy] = dir;
  const px = -dy;
  const py = dx;
  return strokePath(
    [
      [x - dx * 12 + px * 7, y - dy * 12 + py * 7],
      [x, y],
      [x - dx * 12 - px * 7, y - dy * 12 - py * 7],
    ],
    seed,
    0.5,
  );
};

// woody_woodpacker: an ELF whose code is scrambled, with a stub glued on that unlocks it.
export function Packer() {
  const r = rng(170);
  return (
    <svg viewBox="0 0 600 440" aria-hidden="true">
      <g className="sketch">
        <path d={roughRect(90, 30, 220, 370, 171)} style={{ fill: 'var(--paper)' }} {...ink} fillOpacity="1" />
        <text x="108" y="72" style={{ ...handText, fontSize: 30 }}>
          ELF
        </text>
        <path d={strokePath([[90, 88], [310, 88]], 172, 1)} {...thin} />
        {[108, 124, 140].map((y, i) => (
          <path key={y} d={strokePath([[108, y], [180 + i * 30, y]], 173 + i, 0.6)} {...thin} />
        ))}
        {/* the code, encrypted */}
        <path d={roughRect(108, 160, 184, 130, 176)} style={{ fill: 'url(#hatch-a1)' }} {...ink} fillOpacity="1" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={strokePath(
              Array.from({ length: 9 }, (_, k) => [122 + k * 19, 182 + i * 28 + (r() - 0.5) * 14]),
              180 + i,
              1.2,
            )}
            {...thin}
          />
        ))}
        {/* the stub, glued at the end */}
        <path d={roughRect(108, 312, 184, 64, 186)} style={{ fill: 'url(#hatch-a2)' }} {...ink} fillOpacity="1" />
        <text x="168" y="352" style={{ ...handText, fontSize: 22 }}>
          stub
        </text>
        {/* entry point now goes to the stub first... */}
        <path d={strokePath([[300, 116], [372, 170], [380, 280], [304, 344]], 187, 1.4)} {...ink} />
        <path d={arrowHead(304, 344, [-0.8, 0.6], 188)} {...ink} />
        {/* ...which decrypts the code and jumps back to it */}
        <path d={strokePath([[100, 344], [52, 300], [50, 214], [100, 188]], 189, 1.4)} {...ink} strokeDasharray="9 7" />
        <path d={arrowHead(100, 188, [0.85, -0.5], 190)} {...ink} />
        {/* the key it carries */}
        <path d={roughEllipse(476, 150, 26, 26, 191)} style={{ fill: 'url(#hatch-a3)' }} stroke="var(--ink)" strokeWidth="2.4" />
        <path d={roughEllipse(476, 150, 8, 8, 192)} {...ink} />
        <path d={strokePath([[476, 176], [476, 270], [492, 270], [476, 252], [492, 252], [476, 236]], 193, 0.6)} {...ink} />
      </g>
    </svg>
  );
}

export function Vault() {
  return (
    <svg viewBox="0 0 600 440" aria-hidden="true">
      <g className="sketch">
        <path d={roughRect(150, 70, 300, 290, 31)} style={{ fill: 'url(#hatch-a1)' }} {...ink} fillOpacity="1" />
        <path d={roughRect(175, 95, 250, 240, 32, 1.5)} {...thin} />
        <path d={roughEllipse(300, 215, 62, 62, 33)} style={{ fill: 'var(--paper)' }} stroke="var(--ink)" strokeWidth="2.4" />
        <path d={roughEllipse(300, 215, 14, 14, 34)} {...ink} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <path
              key={i}
              d={strokePath([[300 + Math.cos(a) * 44, 215 + Math.sin(a) * 44], [300 + Math.cos(a) * 54, 215 + Math.sin(a) * 54]], 40 + i, 0.6)}
              {...thin}
            />
          );
        })}
        <path d={strokePath([[392, 180], [404, 180], [404, 250], [392, 250]], 35)} {...ink} strokeWidth="3.4" />
        <path d={roughRect(140, 110, 14, 34, 36, 1)} style={{ fill: 'var(--ink)' }} />
        <path d={roughRect(140, 286, 14, 34, 37, 1)} style={{ fill: 'var(--ink)' }} />
        {/* the hedgehog guarding its own vault */}
        <g transform="translate(410 300) scale(0.85)">
          <HedgehogArt seed={61} />
        </g>
      </g>
    </svg>
  );
}

// Inception: three containers, one locked front door (TLS).
export function Containers() {
  const box = (x, y, w, h, sd, hatch, label) => (
    <>
      <path d={roughRect(x, y, w, h, sd)} style={{ fill: `url(#hatch-${hatch})` }} {...ink} fillOpacity="1" />
      <path d={strokePath([[x, y + 24], [x + w, y + 24]], sd + 1, 1)} {...thin} />
      <path d={roughEllipse(x + 14, y + 12, 4, 4, sd + 2)} {...thin} />
      <path d={roughEllipse(x + 28, y + 12, 4, 4, sd + 3)} {...thin} />
      <text x={x + 16} y={y + h - 16} style={{ ...handText, fontSize: 18 }}>
        {label}
      </text>
    </>
  );
  return (
    <svg viewBox="0 0 600 440" aria-hidden="true">
      <g className="sketch">
        {box(110, 250, 200, 120, 51, 'a2', 'wordpress')}
        {box(310, 250, 190, 120, 55, 'a4', 'mariadb')}
        {box(200, 110, 220, 120, 59, 'a1', 'nginx')}
        <path d={roughRect(294, 30, 42, 34, 63, 1)} style={{ fill: 'url(#hatch-a3)' }} stroke="var(--ink)" strokeWidth="2.4" />
        <path d={strokePath([[302, 30], [302, 16], [315, 8], [328, 16], [328, 30]], 64)} {...ink} />
        <path d={strokePath([[315, 66], [315, 108]], 65)} {...thin} strokeDasharray="5 6" />
        <path d={strokePath([[260, 232], [220, 250]], 66)} {...thin} />
        <path d={strokePath([[360, 232], [400, 250]], 67)} {...thin} />
        <path d={strokePath([[70, 392], [540, 388]], 69, 2)} {...ink} />
      </g>
    </svg>
  );
}

// ---- the dream sky: white-line objects drifting in violet space ----
// Drawn in light perspective, like things that came loose from a bedroom and float in the dark.
// Each object: polylines (stroked by hand), plus ellipses [cx, cy, rx, ry, rotation] for round parts.

const star = { fill: 'none', stroke: 'var(--star)', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };

const starPoints = (cx, cy, R, r, n = 5, rot = -90) =>
  Array.from({ length: n * 2 + 1 }, (_, k) => {
    const a = ((rot + (k * 180) / n) * Math.PI) / 180;
    const d = k % 2 ? r : R;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  });

const OBJECTS = {
  // an open book, its pages bowed
  book: {
    lines: [
      [[30, 22], [24, 17], [15, 15], [5, 19], [5, 44], [15, 40], [24, 42], [30, 47]],
      [[30, 22], [36, 17], [45, 15], [55, 19], [55, 44], [45, 40], [36, 42], [30, 47]],
      [[30, 22], [30, 47]],
      [[5, 44], [5, 48], [17, 45], [30, 51], [43, 45], [55, 48], [55, 44]],
      [[10, 24], [25, 26]],
      [[10, 29], [25, 31]],
      [[10, 34], [21, 35.5]],
      [[35, 26], [50, 24]],
      [[35, 31], [50, 29]],
      [[35, 36], [46, 34.5]],
    ],
  },
  // a long crystal, cut on both ends
  crystal: {
    lines: [
      [[30, 3], [41, 14], [41, 45], [30, 57], [19, 45], [19, 14], [30, 3]],
      [[19, 14], [27, 19], [41, 14]],
      [[27, 19], [27, 50], [30, 57]],
      [[19, 45], [27, 50], [41, 45]],
      [[27, 19], [30, 3]],
      [[22, 22], [22, 32]],
    ],
  },
  gem: {
    lines: [
      [[12, 22], [21, 11], [39, 11], [48, 22], [30, 50], [12, 22]],
      [[12, 22], [48, 22]],
      [[21, 11], [25, 22], [30, 50]],
      [[39, 11], [35, 22], [30, 50]],
      [[25, 22], [30, 11], [35, 22]],
    ],
  },
  lock: {
    lines: [
      [[12, 28], [48, 28], [48, 55], [12, 55], [12, 28]],
      [[18, 28], [18, 18], [22, 10], [30, 6], [38, 10], [42, 18], [42, 28]],
      [[24, 28], [24, 19], [30, 13], [36, 19], [36, 28]],
      [[30, 42], [30, 49]],
      [[16, 52], [21, 47]],
      [[16, 46], [19, 43]],
    ],
    rings: [[30, 39, 3.6, 3.6]],
  },
  key: {
    lines: [
      [[22, 27], [57, 27], [57, 32], [22, 32]],
      [[44, 32], [44, 40], [48, 40], [48, 32]],
      [[51, 32], [51, 37], [55, 37], [55, 32]],
    ],
    rings: [[14, 29.5, 10, 10], [14, 29.5, 4, 4]],
  },
  floppy: {
    lines: [
      [[9, 7], [46, 7], [53, 14], [53, 53], [9, 53], [9, 7]],
      [[18, 7], [18, 22], [42, 22], [42, 7]],
      [[34, 10], [34, 19], [38, 19], [38, 10], [34, 10]],
      [[15, 29], [47, 29], [47, 53]],
      [[15, 29], [15, 53]],
      [[20, 36], [42, 36]],
      [[20, 42], [36, 42]],
    ],
  },
  // a satellite with two gridded panels
  satellite: {
    lines: [
      [[24, 22], [36, 22], [36, 40], [24, 40], [24, 22]],
      [[3, 24], [19, 24], [19, 38], [3, 38], [3, 24]],
      [[41, 24], [57, 24], [57, 38], [41, 38], [41, 24]],
      [[3, 31], [19, 31]],
      [[41, 31], [57, 31]],
      [[8.5, 24], [8.5, 38]],
      [[13.5, 24], [13.5, 38]],
      [[46.5, 24], [46.5, 38]],
      [[51.5, 24], [51.5, 38]],
      [[19, 31], [24, 31]],
      [[36, 31], [41, 31]],
      [[30, 22], [30, 13]],
      [[27, 40], [26, 46], [34, 46], [33, 40]],
      [[24, 28], [36, 28]],
    ],
    rings: [[30, 11, 7, 2.6]],
  },
  pawn: {
    lines: [
      [[24, 26], [22, 36], [20, 45]],
      [[36, 26], [38, 36], [40, 45]],
      [[14, 45], [46, 45], [48, 53], [12, 53], [14, 45]],
    ],
    rings: [[30, 14, 7, 7], [30, 24.5, 9.5, 2.8]],
  },
  note: {
    lines: [
      [[23, 45], [23, 10]],
      [[47, 39], [47, 4]],
      [[23, 10], [47, 4]],
      [[23, 17], [47, 11]],
    ],
    rings: [[17, 46, 6.5, 4.8, -20], [41, 40, 6.5, 4.8, -20]],
  },
  // the bed: mattress, headboard, pillow, the blanket folded back
  bed: {
    lines: [
      [[5, 31], [30, 20], [55, 30], [30, 42], [5, 31]],
      [[5, 31], [5, 38], [30, 49], [30, 42]],
      [[30, 49], [55, 37], [55, 30]],
      [[5, 38], [5, 43]],
      [[30, 49], [30, 54]],
      [[55, 37], [55, 41]],
      [[30, 20], [30, 8], [55, 18], [55, 30]],
      [[33, 12], [52, 20]],
      [[36, 23], [42, 20], [50, 24], [44, 27], [36, 23]],
      [[12, 34], [34, 24], [37, 26], [14, 36]],
      [[14, 36], [14, 41]],
    ],
  },
  chair: {
    lines: [
      [[12, 33], [36, 27], [48, 33], [24, 39], [12, 33]],
      [[12, 33], [12, 36], [24, 42], [48, 36], [48, 33]],
      [[36, 27], [36, 5], [48, 10], [48, 33]],
      [[39, 12], [45, 15]],
      [[39, 18], [45, 21]],
      [[12, 36], [12, 53]],
      [[24, 42], [24, 58]],
      [[48, 36], [48, 53]],
      [[36, 30], [36, 46]],
    ],
  },
  // a little table, a vase, a flower
  table: {
    lines: [
      [[4, 33], [30, 25], [56, 33], [30, 41], [4, 33]],
      [[4, 33], [4, 36], [30, 44], [56, 36], [56, 33]],
      [[30, 41], [30, 44]],
      [[7, 37], [7, 56]],
      [[30, 44], [30, 59]],
      [[53, 37], [53, 56]],
      [[26, 33], [24, 28], [26, 23], [34, 23], [36, 28], [34, 33]],
      [[30, 23], [30, 12]],
      [[30, 18], [25, 14], [27, 19]],
    ],
    rings: [[30, 33, 4.2, 1.4], [30, 8.5, 4, 4], [30, 8.5, 1.3, 1.3]],
  },
  planet: {
    lines: [[[19, 27], [41, 27]], [[20, 34], [39, 33]]],
    rings: [[30, 30, 12.5, 12.5], [30, 30, 27, 6.5, -16]],
  },
  rock: {
    lines: [[[20, 18], [16, 26]]],
    rings: [[30, 30, 16, 15], [25, 26, 4, 3.4], [36, 37, 3, 2.6], [37, 23, 2, 1.8]],
  },
  star: {
    lines: [starPoints(30, 31, 22, 9.5)],
  },
  // the seed-like thing that floats in dreams
  seed: {
    lines: [
      [[6, 33], [16, 23], [30, 20], [44, 24], [54, 29], [44, 38], [30, 41], [16, 39], [6, 33]],
      [[14, 31], [30, 29], [46, 30]],
    ],
  },
};

export function SpaceObject({ kind, className, style, ...rest }) {
  const o = OBJECTS[kind] ?? { lines: [] };
  const seed = 820 + kind.length * 31;
  const paths = [
    ...o.lines.map((pts, k) => strokePath(pts, seed + k * 3, 0.5)),
    ...(o.rings ?? []).map(([cx, cy, rx, ry, rot = 0], k) => {
      const d = roughEllipse(cx, cy, rx, ry, seed + 100 + k, 1.08, 0.04);
      return rot ? { d, t: `rotate(${rot} ${cx} ${cy})` } : d;
    }),
  ];
  const draw = (props, key) => (
    <g key={key} {...props}>
      {paths.map((p, k) => (typeof p === 'string' ? <path key={k} d={p} /> : <path key={k} d={p.d} transform={p.t} />))}
    </g>
  );
  return (
    <svg className={`space-object ${className ?? ''}`} style={style} viewBox="0 0 60 60" aria-hidden="true" {...rest}>
      {draw({ ...star, className: 'so-glow', stroke: 'var(--glow)', strokeWidth: 7, opacity: 0.16 }, 'g1')}
      {draw({ ...star, className: 'so-glow', stroke: 'var(--glow)', strokeWidth: 3.6, opacity: 0.4 }, 'g2')}
      {draw(star, 'l')}
    </svg>
  );
}

export function Sparkle({ className, style }) {
  return (
    <svg className={`sparkle ${className ?? ''}`} style={style} viewBox="0 0 44 44" aria-hidden="true">
      <path
        d={strokePath([[22, 2], [25, 18], [42, 22], [25, 26], [22, 42], [19, 26], [2, 22], [19, 18], [22, 2]], 711, 0.4)}
        style={{ fill: 'var(--star)' }}
      />
    </svg>
  );
}

// Star dust, scattered by hand rather than on a grid: dots of every size, a few tiny crosses.
// One static SVG, cropped to the box it fills.
export function StarField({ className, seed = 1, count = 170, crosses = 14 }) {
  const r = rng(seed);
  const dots = Array.from({ length: count }, () => {
    const big = r() > 0.88;
    return [r() * 1600, r() * 1000, big ? 1.6 + r() * 1.4 : 0.5 + r() * 1.1, big ? 0.95 : 0.35 + r() * 0.55];
  });
  const xs = Array.from({ length: crosses }, () => [r() * 1600, r() * 1000, 4 + r() * 6]);
  return (
    <svg className={`starfield ${className ?? ''}`} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g style={{ fill: 'var(--star)' }}>
        {dots.map(([x, y, s, o], k) => (
          <circle key={k} cx={x.toFixed(1)} cy={y.toFixed(1)} r={s.toFixed(2)} opacity={o.toFixed(2)} />
        ))}
      </g>
      <g style={{ stroke: 'var(--star)' }} strokeWidth="1.4" strokeLinecap="round" opacity="0.85">
        {xs.map(([x, y, s], k) => (
          <path key={k} d={`M${x - s},${y}H${x + s}M${x},${y - s}V${y + s}`} />
        ))}
      </g>
    </svg>
  );
}

// The way into the burrow, seen from the surface: paper sky, a mound with a dark den, earth below with what it keeps.
// viewBox 1440 x 900; the den is centred at (720, 566). The parent box keeps this aspect, so HTML pieces can be placed in %.
export const DEN = { x: 720, y: 566, rx: 76, ry: 50, w: 1440, h: 900 };
export function BurrowGate() {
  const r = rng(1701);
  const surface = [];
  for (let x = -40; x <= 1480; x += 40) {
    const d = Math.abs(x - DEN.x);
    const mound = d < 200 ? Math.cos((d / 200) * (Math.PI / 2)) ** 1.6 * 96 : 0;
    surface.push([x, 600 + Math.sin(x * 0.013) * 5 + (r() - 0.5) * 4 - mound]);
  }
  // the earth runs on well below the frame: on a tall phone screen the scene is shown whole, with ground under it
  const earth = strokePath(surface, 1702, 1.2) + ' L1480,2000 L-40,2000 Z';
  const ground = (x) => {
    const i = Math.max(0, Math.min(surface.length - 2, Math.floor((x + 40) / 40)));
    const [x0, y0] = surface[i];
    const [x1, y1] = surface[i + 1];
    return y0 + ((x - x0) / 40) * (y1 - y0);
  };
  const tufts = Array.from({ length: 26 }, (_, k) => 30 + k * 54 + (r() - 0.5) * 30).filter((x) => Math.abs(x - DEN.x) > 96);
  const pebbles = Array.from({ length: 14 }, () => [40 + r() * 1360, 660 + r() * 230, 6 + r() * 12, ['url(#hatch-a4)', 'url(#hatch-a2)', 'url(#hatch-a1)'][Math.floor(r() * 3)]]);
  const roots = [180, 330, 960, 1210, 1350].map((x, k) => {
    const pts = [[x, ground(x) + 4]];
    for (let i = 1; i < 6; i++) pts.push([x + (r() - 0.5) * 34, ground(x) + i * (18 + r() * 10)]);
    return strokePath(pts, 1720 + k, 1);
  });
  const strata = [700, 790].map((y, k) => strokePath(Array.from({ length: 16 }, (_, i) => [-40 + i * 100, y + (r() - 0.5) * 18]), 1730 + k, 1.4));
  // the things the earth keeps: old storage and keys, buried
  const buried = [
    ['floppy', 230, 690, 74, -14],
    ['key', 1110, 672, 70, 22],
    ['gem', 1000, 800, 54, 8],
    ['lock', 420, 790, 60, -8],
    ['note', 1290, 790, 50, 12],
    ['crystal', 110, 810, 54, 30],
  ];
  return (
    <svg className="gate-art" viewBox={`0 0 ${DEN.w} ${DEN.h}`} aria-hidden="true">
      <defs>
        <radialGradient id="den" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#0c0806" />
          <stop offset="60%" stopColor="#1d130d" />
          <stop offset="100%" stopColor="#4a3020" />
        </radialGradient>
      </defs>
      <path d={earth} style={{ fill: 'url(#hatch-a3)' }} />
      <path d={earth} fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" />
      {strata.map((d, k) => (
        <path key={k} d={d} fill="none" stroke="var(--ink)" strokeWidth="1.4" opacity="0.4" strokeDasharray={k ? '14 10' : undefined} />
      ))}
      {roots.map((d, k) => (
        <path key={k} d={d} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      ))}
      {pebbles.map(([x, y, s, fill], k) => (
        <path key={k} d={roughEllipse(x, y, s, s * 0.7, 1740 + k, 1.1)} style={{ fill }} stroke="var(--ink)" strokeWidth="1.6" />
      ))}
      {buried.map(([kind, x, y, w, rot]) => (
        <g key={kind} transform={`rotate(${rot} ${x} ${y})`} opacity="0.85">
          <SpaceObject kind={kind} x={x - w / 2} y={y - w / 2} width={w} height={w} />
        </g>
      ))}
      {/* the den: a rim of dug earth, the dark mouth, a lip of light on its back wall */}
      <path d={roughEllipse(DEN.x, DEN.y - 4, DEN.rx + 16, DEN.ry + 14, 1750, 1.1)} fill="none" stroke="var(--ink)" strokeWidth="1.4" opacity="0.55" />
      <path className="gate-den" d={roughEllipse(DEN.x, DEN.y, DEN.rx, DEN.ry, 1751, 1.02, 0.03)} fill="url(#den)" />
      <path d={roughEllipse(DEN.x, DEN.y, DEN.rx, DEN.ry, 1752, 1.12, 0.04)} fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path
        d={strokePath(Array.from({ length: 9 }, (_, k) => [DEN.x - 56 + k * 14, DEN.y - 28 + Math.abs(k - 4) ** 1.6 * 2.4]), 1753, 0.6)}
        fill="none"
        stroke="#b88a66"
        strokeWidth="2"
        opacity="0.75"
      />
      {[[-92, 34], [-70, 50], [84, 40], [98, 26], [60, 56]].map(([dx, dy], k) => (
        <path key={k} d={roughEllipse(DEN.x + dx, DEN.y + dy, 4, 3, 1760 + k, 1.1)} style={{ fill: 'var(--ink)' }} opacity="0.7" />
      ))}
      {/* grass on the surface */}
      <g fill="none" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round">
        {tufts.map((x, k) => {
          const y = ground(x) + 1;
          return <path key={k} d={strokePath([[x - 7, y - 9], [x - 3, y], [x, y - 13], [x + 3, y], [x + 8, y - 8]], 1770 + k, 0.5)} />;
        })}
      </g>
      {/* the signpost */}
      <g transform={`rotate(-3 470 ${ground(470)})`}>
        <path d={strokePath([[470, ground(470) + 2], [468, ground(470) - 128]], 1790, 0.8)} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path
          d={strokePath([[380, 456], [548, 450], [578, 476], [550, 504], [382, 508], [380, 456]], 1791, 1)}
          style={{ fill: 'url(#hatch-a1)' }}
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <text x="462" y="488" textAnchor="middle" fontSize="30" style={{ fontFamily: 'var(--hand)', fontStyle: 'italic', fontWeight: 700, fill: 'var(--ink)' }}>
          le terrier
        </text>
      </g>
    </svg>
  );
}

// A round bush of the dream garden, hatched in teal.
export function Bush({ className, style, seed = 1 }) {
  const r = rng(seed);
  const blobs = Array.from({ length: 5 }, (_, k) => [30 + k * 34 + (r() - 0.5) * 10, 70 - Math.sin((k / 4) * Math.PI) * 26, 26 + r() * 12]);
  return (
    <svg className={`bush ${className ?? ''}`} style={style} viewBox="0 0 200 120" aria-hidden="true">
      {blobs.map(([x, y, rad], k) => (
        <g key={k}>
          <path d={roughEllipse(x, y, rad, rad * 0.9, seed + k * 5)} style={{ fill: 'url(#bush)' }} stroke="var(--bush-ink)" strokeWidth="2.2" />
          <path d={strokePath([[x - rad * 0.4, y - 2], [x - rad * 0.1, y - rad * 0.4], [x + rad * 0.3, y - 4]], seed + k * 5 + 2, 0.4)} fill="none" stroke="var(--bush-ink)" strokeWidth="1.4" />
        </g>
      ))}
    </svg>
  );
}

// A lamp post of the dream: white line, its head glowing (the glow is a CSS layer behind it).
export function LampPost({ className, style }) {
  return (
    <div className={`lamp ${className ?? ''}`} style={style} aria-hidden="true">
      <span className="lamp-glow" />
      <svg viewBox="0 0 40 160">
        <g {...star}>
          <path d={strokePath([[12, 22], [20, 8], [28, 22], [24, 30], [16, 30], [12, 22]], 731, 0.3)} style={{ fill: 'color-mix(in oklab, var(--star) 80%, transparent)' }} />
          <path d={strokePath([[20, 8], [20, 2]], 732, 0.2)} />
          <path d={strokePath([[17, 30], [17, 148]], 733, 0.5)} />
          <path d={strokePath([[23, 30], [23, 148]], 734, 0.5)} />
          <path d={strokePath([[10, 148], [30, 148], [32, 156], [8, 156], [10, 148]], 735, 0.3)} />
        </g>
      </svg>
    </div>
  );
}

// A world of the dream sky, drawn like everything else: line around, crayon hatching inside.
// The line follows --star, so a parent can set it to --ink on paper.
const WORLD_STYLE = {
  giant: { body: 'p-orange', band: 'p-orange-deep', bands: 3 },
  ice: { body: 'p-ice', band: null, bands: 0 },
  ringed: { body: 'p-mint', band: 'p-rose', bands: 2, ring: 'p-violet' },
  ember: { body: 'p-red', band: null, bands: 0 },
};
export function Planet({ kind = 'giant', className, style, seed = 5 }) {
  const id = useId().replace(/:/g, '');
  const w = WORLD_STYLE[kind];
  const ring = !!w.ring;
  const cx = ring ? 100 : 60;
  const body = roughEllipse(cx, 60, 44, 44, seed, 1.04, 0.03);
  const line = { fill: 'none', stroke: 'var(--star)', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const outer = roughEllipse(cx, 62, 94, 22, seed + 4, 1.04, 0.02);
  const inner = roughEllipse(cx, 62, 64, 12, seed + 5, 1.04, 0.02);
  const r = rng(seed + 9);
  return (
    <svg className={`planet ${className ?? ''}`} style={style} viewBox={`0 0 ${ring ? 200 : 120} 120`} aria-hidden="true">
      <defs>
        <clipPath id={`b${id}`}>
          <path d={body} />
        </clipPath>
        <clipPath id={`f${id}`}>
          <rect x="0" y="62" width="200" height="60" />
        </clipPath>
      </defs>
      {ring && (
        <g transform={`rotate(-12 ${cx} 60)`}>
          <path d={`${outer} ${inner}`} fillRule="evenodd" style={{ fill: `url(#${w.ring})` }} />
          <path d={outer} {...line} />
        </g>
      )}
      <path d={body} style={{ fill: 'var(--paper)' }} />
      <path d={body} style={{ fill: `url(#${w.body})` }} />
      <g clipPath={`url(#b${id})`}>
        {Array.from({ length: w.bands }, (_, k) => {
          const y = 32 + k * (60 / Math.max(w.bands, 1)) + r() * 8;
          const h = 7 + r() * 7;
          const top = Array.from({ length: 7 }, (_, i) => [cx - 50 + i * 17, y + Math.sin(i * 1.4 + k) * 3]);
          const bot = top.map(([x, yy]) => [x, yy + h + r() * 3]).reverse();
          return <path key={k} d={strokePath([...top, ...bot], seed + 20 + k, 0.4) + ' Z'} style={{ fill: `url(#${w.band})` }} />;
        })}
        <path d={`M0,0H200V120H0Z ${roughEllipse(cx - 12, 50, 46, 46, seed + 2, 1.02, 0.02)}`} fillRule="evenodd" style={{ fill: 'url(#p-shade)' }} opacity="0.55" />
      </g>
      <path d={body} {...line} />
      <path d={strokePath([[cx - 30, 44], [cx - 24, 32], [cx - 12, 24]], seed + 7, 0.3)} {...line} strokeWidth="3" opacity="0.8" />
      {ring && (
        <g transform={`rotate(-12 ${cx} 60)`} clipPath={`url(#f${id})`}>
          <path d={`${outer} ${inner}`} fillRule="evenodd" style={{ fill: `url(#${w.ring})` }} />
          <path d={outer} {...line} />
          <path d={inner} {...line} strokeWidth="1.6" />
        </g>
      )}
    </svg>
  );
}

// A patch of pencil flowers: stems, a leaf or two, five crayon petals, a pale heart.
const PETALS = ['p-rose', 'p-violet', 'p-ice', 'p-orange', 'p-rose', 'p-violet', 'p-mint'];
export function Flowers({ className, style, seed = 1, count = 7 }) {
  const r = rng(seed);
  const items = Array.from({ length: count }, (_, k) => {
    const x = 14 + (k / Math.max(count - 1, 1)) * 172 + (r() - 0.5) * 18;
    const h = 22 + r() * 40;
    return { x, h, lean: (r() - 0.5) * 14, size: 7 + r() * 5, pal: PETALS[(seed + k) % PETALS.length], leaf: r() > 0.4 };
  }).sort((a, b) => b.h - a.h);
  return (
    <svg className={`flowers ${className ?? ''}`} style={style} viewBox="0 0 200 80" aria-hidden="true">
      {items.map((f, k) => {
        const tip = [f.x + f.lean, 78 - f.h];
        const s = seed * 31 + k * 5;
        return (
          <g key={k}>
            <path d={strokePath([[f.x, 80], [f.x + f.lean * 0.4, 80 - f.h * 0.5], tip], s, 0.4)} fill="none" stroke="var(--bush-ink)" strokeWidth="1.8" strokeLinecap="round" />
            {f.leaf && (
              <path
                d={strokePath([[f.x + f.lean * 0.3, 80 - f.h * 0.4], [f.x + f.lean * 0.3 + 10, 80 - f.h * 0.5 - 6], [f.x + f.lean * 0.3 + 2, 80 - f.h * 0.4 - 2]], s + 1, 0.3)}
                style={{ fill: 'url(#tree)' }}
                stroke="var(--bush-ink)"
                strokeWidth="1.3"
              />
            )}
            {Array.from({ length: 5 }, (_, i) => {
              const a = (i / 5) * Math.PI * 2 + k;
              return (
                <path
                  key={i}
                  d={roughEllipse(tip[0] + Math.cos(a) * f.size * 0.62, tip[1] + Math.sin(a) * f.size * 0.62, f.size * 0.5, f.size * 0.42, s + 2 + i, 1.02, 0.03)}
                  style={{ fill: `url(#${f.pal})` }}
                  stroke="var(--bush-ink)"
                  strokeWidth="1.2"
                />
              );
            })}
            <circle cx={tip[0]} cy={tip[1]} r={f.size * 0.26} fill="#fff4c2" stroke="var(--bush-ink)" strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

export function InterestIcon({ id }) {
  const g = {
    climb: (
      <>
        <path d={roughEllipse(32, 30, 18, 14, 201)} style={{ fill: 'url(#hatch-a3)' }} stroke="var(--ink)" strokeWidth="2.2" />
        <path d={roughEllipse(32, 30, 4, 4, 202)} {...ink} />
        <path d={strokePath([[32, 44], [30, 62]], 203)} {...thin} strokeDasharray="3 4" />
      </>
    ),
    gym: (
      <>
        <path d={strokePath([[12, 34], [52, 34]], 211)} {...ink} strokeWidth="3" />
        <path d={roughRect(6, 20, 8, 28, 212, 0.8)} style={{ fill: 'var(--ink)' }} />
        <path d={roughRect(50, 20, 8, 28, 213, 0.8)} style={{ fill: 'var(--ink)' }} />
      </>
    ),
    lock: (
      <>
        <path d={roughRect(14, 28, 36, 28, 221, 1)} style={{ fill: 'url(#hatch-a4)' }} stroke="var(--ink)" strokeWidth="2.2" />
        <path d={strokePath([[21, 28], [21, 16], [32, 8], [43, 16], [43, 28]], 222)} {...ink} />
      </>
    ),
    music: (
      <>
        <path d={roughEllipse(20, 50, 9, 7, 231)} style={{ fill: 'var(--ink)' }} />
        <path d={roughEllipse(46, 44, 9, 7, 232)} style={{ fill: 'var(--ink)' }} />
        <path d={strokePath([[28, 50], [28, 12], [54, 6], [54, 44]], 233)} {...ink} />
        <path d={strokePath([[28, 22], [54, 16]], 234)} {...ink} />
      </>
    ),
    chess: (
      <>
        <path d={roughEllipse(32, 16, 8, 8, 241)} style={{ fill: 'url(#hatch-a3)' }} stroke="var(--ink)" strokeWidth="2.2" />
        <path d={strokePath([[26, 24], [22, 46], [42, 46], [38, 24]], 242)} {...ink} />
        <path d={roughRect(14, 46, 36, 10, 243, 0.8)} style={{ fill: 'var(--ink)' }} />
      </>
    ),
  }[id];
  return (
    <svg viewBox="0 0 64 64" className="interest-icon sketch" aria-hidden="true">
      {g}
    </svg>
  );
}

// Small doodles that live in the dark: they rise out of the hole and stream past during the fall.
const DOODLES = {
  lock: (
    <>
      <path d={roughRect(8, 20, 28, 22, 601, 0.8)} {...ink} />
      <path d={strokePath([[14, 20], [14, 10], [22, 4], [30, 10], [30, 20]], 602, 0.6)} {...ink} />
    </>
  ),
  key: (
    <>
      <path d={roughEllipse(12, 22, 8, 8, 611)} {...ink} />
      <path d={strokePath([[20, 22], [42, 22], [42, 30], [36, 22]], 612, 0.6)} {...ink} />
    </>
  ),
  zero: <path d={roughEllipse(22, 22, 9, 15, 621, 1.15)} {...ink} />,
  one: <path d={strokePath([[16, 12], [24, 6], [24, 38], [16, 38], [32, 38]], 631, 0.6)} {...ink} />,
  hog: (
    <>
      <path d={strokePath(spines(22, 22, 11, 11, 0, Math.PI * 2, 9, 1.6, 671), 672, 0.4)} {...ink} />
      <path d={roughEllipse(29, 27, 3, 2.6, 673)} style={{ fill: 'var(--ink)' }} />
    </>
  ),
  star: (
    <path
      d={strokePath([[22, 4], [27, 17], [41, 17], [30, 26], [34, 40], [22, 31], [10, 40], [14, 26], [3, 17], [17, 17], [22, 4]], 641, 0.8)}
      {...ink}
    />
  ),
  eye: (
    <>
      <path d={strokePath([[2, 22], [22, 10], [42, 22], [22, 34], [2, 22]], 651, 0.8)} {...ink} />
      <path d={roughEllipse(22, 22, 5, 5, 652)} style={{ fill: 'var(--ink)' }} />
    </>
  ),
  bracket: <path d={strokePath([[18, 4], [8, 14], [8, 30], [18, 40]], 661, 0.6)} {...ink} />,
};

export const DOODLE_KINDS = Object.keys(DOODLES);

export function Doodle({ kind, className, style }) {
  return (
    <svg className={`doodle ${className ?? ''}`} style={style} viewBox="0 0 44 44" aria-hidden="true">
      {DOODLES[kind]}
    </svg>
  );
}

// ---- the dark room at the top: a bulb on its cord, and what the light finds ----

const chalk = { fill: 'none', stroke: 'var(--star)', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// A bare bulb, drawn in white line. Its glass and rays light up through CSS (.sky.lit).
export function Bulb({ className }) {
  const arc = [];
  for (let a = 235; a >= -55; a -= 18) arc.push([30 + Math.cos((a * Math.PI) / 180) * 17, 52 + Math.sin((a * Math.PI) / 180) * 17]);
  const glass = strokePath([[23, 18], [22, 30], ...arc, [38, 30], [37, 18]], 1201, 0.4);
  const rays = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2 + 0.3;
    return strokePath([[30 + Math.cos(a) * 27, 52 + Math.sin(a) * 27], [30 + Math.cos(a) * (k % 2 ? 33 : 37), 52 + Math.sin(a) * (k % 2 ? 33 : 37)]], 1220 + k, 0.3);
  });
  return (
    <svg className={`bulb-art ${className ?? ''}`} viewBox="-12 -4 84 104" aria-hidden="true">
      <path className="bulb-glass" d={glass} />
      <path d={glass} {...chalk} />
      <path d={strokePath([[27, 22], [27, 40], [29, 35], [31, 41], [33, 35], [33, 22]], 1203, 0.3)} {...chalk} strokeWidth="1.4" />
      <path d={roughRect(21, 0, 18, 18, 1204, 0.5)} style={{ fill: 'var(--dark)' }} {...{ ...chalk, fill: undefined }} />
      <path d={strokePath([[21, 6], [39, 7]], 1205, 0.3)} {...chalk} strokeWidth="1.4" />
      <path d={strokePath([[21, 12], [39, 13]], 1206, 0.3)} {...chalk} strokeWidth="1.4" />
      <path className="bulb-shine" d={strokePath([[20, 50], [21, 43], [25, 38]], 1207, 0.2)} {...chalk} strokeWidth="2.6" />
      <g className="bulb-rays">
        {rays.map((d, k) => (
          <path key={k} d={d} {...chalk} strokeWidth="2" />
        ))}
      </g>
    </svg>
  );
}
