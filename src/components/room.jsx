import { strokePath, roughRect, roughEllipse, rng } from './sketch.jsx';
import { Hedgehog } from './drawings.jsx';

// The room at the bottom of the fall: a reading corner and a desk, lit by lamps and a string of lights.
// Everything is drawn in the site's own hand (seeded strokes, crayon hatching). The SVG is static:
// what moves (glows, bulbs, flame, steam, the hedgehog breathing, the cursor) are HTML layers on top,
// placed in the same 1260 x 420 coordinates.
const W = 1260;
const H = 420;
const FLOOR = 404;
const at = (x, y, w, h) => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  ...(w != null && { width: `${(w / W) * 100}%` }),
  ...(h != null && { height: `${(h / H) * 100}%` }),
});

const line = { fill: 'none', stroke: 'var(--room-line)', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const thin = { ...line, strokeWidth: 1.4 };
const shade = { fill: 'var(--room-shade)' };

// a closed shape: dark body, crayon hatching, pencil outline
function Shape({ pts, seed, fill, wob = 0.8, op = 1, close = true }) {
  const d = strokePath(close ? [...pts, pts[0]] : pts, seed, wob);
  return (
    <>
      <path d={d} style={shade} />
      {fill && <path d={d} style={{ fill: `url(#${fill})` }} opacity={op} />}
      <path d={d} {...line} />
    </>
  );
}

// a leaf from its base to its tip, bellied on both sides
function leaf(bx, by, tx, ty, w, seed) {
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * w;
  const ny = (dx / len) * w;
  const p = (t, s) => [bx + dx * t + nx * s, by + dy * t + ny * s];
  return strokePath([[bx, by], p(0.3, 0.9), p(0.65, 0.8), [tx, ty], p(0.65, -0.8), p(0.3, -0.9), [bx, by]], seed, 0.4);
}
function Plant({ x, base, leaves, seed, pot }) {
  return (
    <g>
      {leaves.map(([tx, ty, w], k) => (
        <g key={k}>
          <path d={strokePath([[x, base], [(x + tx) / 2 + (k % 2 ? 4 : -4), (base + ty) / 2], [tx, ty]], seed + k, 0.4)} {...thin} />
          <path d={leaf((x * 2 + tx) / 3, (base * 2 + ty) / 3 + 4, tx, ty, w, seed + 20 + k)} style={shade} />
          <path d={leaf((x * 2 + tx) / 3, (base * 2 + ty) / 3 + 4, tx, ty, w, seed + 20 + k)} style={{ fill: 'url(#tree)' }} />
          <path d={leaf((x * 2 + tx) / 3, (base * 2 + ty) / 3 + 4, tx, ty, w, seed + 20 + k)} {...thin} strokeWidth="1.8" />
        </g>
      ))}
      <Shape pts={pot} seed={seed + 50} fill="p-orange-deep" op={0.85} />
      <path d={strokePath([[pot[0][0] - 3, pot[0][1] + 8], [pot[1][0] + 3, pot[1][1] + 8]], seed + 51, 0.4)} {...thin} />
    </g>
  );
}

// the string of lights: a sagging wire from the curtain rod across the wall
const WIRE = [
  [1078, 34],
  [960, 118],
  [790, 52],
];
const WIRE2 = [
  [790, 52],
  [700, 110],
  [610, 60],
];
const qpt = ([a, c, b], t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const BULBS = [
  ...Array.from({ length: 9 }, (_, i) => qpt(WIRE, (i + 0.5) / 9)),
  ...Array.from({ length: 5 }, (_, i) => qpt(WIRE2, (i + 0.5) / 5)),
].map(([x, y], i) => [x, y + 6, ['#ffd98a', '#ffb8de', '#bfefff', '#ffd98a', '#d9c6ff'][i % 5], (i * 0.73) % 3]);

const STARS = (() => {
  const r = rng(1207);
  return Array.from({ length: 9 }, () => [1102 + r() * 120, 52 + r() * 140, 2 + r() * 2.4]);
})();
// the chessboard lies flat on the rug: its light squares, in perspective
const CHESS = (() => {
  const edge = (y) => [548 - ((y - 402) * 14) / 18, 74 + ((y - 402) * 28) / 18];
  const x = (y, c) => edge(y)[0] + (edge(y)[1] * c) / 4;
  const out = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 4; c++) {
      if ((c + r) % 2) continue;
      const [y0, y1] = [402 + r * 9, 411 + r * 9];
      out.push(`M${x(y0, c)},${y0}L${x(y0, c + 1)},${y0}L${x(y1, c + 1)},${y1}L${x(y1, c)},${y1}Z`);
    }
  return out;
})();
const MOTES = [
  [10, 22, 3, 7],
  [15, 44, 2, 9],
  [20, 14, 3, 8],
  [12, 60, 2, 11],
  [24, 34, 2, 10],
  [8, 38, 2, 12],
];

export function CozyRoom() {
  // armchair
  const back = [[254, 332], [248, 262], [262, 226], [302, 212], [346, 209], [392, 212], [430, 226], [444, 262], [438, 332]];
  const armL = [[228, 374], [224, 304], [236, 286], [258, 286], [270, 302], [270, 374]];
  const armR = [[424, 374], [424, 302], [436, 286], [458, 286], [470, 304], [466, 374]];
  const seat = [[264, 336], [302, 326], [347, 323], [392, 326], [426, 336], [426, 366], [264, 366]];
  const skirt = [[226, 372], [470, 372], [468, 390], [228, 390]];
  const blanket = [[386, 212], [428, 222], [448, 256], [476, 302], [482, 356], [470, 350], [460, 362], [449, 350], [438, 362], [430, 318], [414, 262], [392, 232]];
  // desk
  const top = [[700, 294], [1064, 294], [1064, 308], [700, 308]];
  const drawers = [[712, 308], [806, 308], [806, 400], [712, 400]];
  return (
    <div className="floor-room" aria-hidden="true">
      {/* light first, the furniture stands in it */}
      <span className="room-light light-floor" style={at(170 - 260, 140 - 220, 520, 440)} />
      <span className="room-light light-desk" style={at(792 - 130, 236 - 100, 260, 200)} />
      <span className="room-light light-screen" style={at(925 - 190, 200 - 130, 380, 260)} />
      <span className="room-light light-moon" style={at(1162 - 110, 125 - 110, 220, 220)} />
      <div className="room-motes" style={at(60, 120, 260, 280)}>
        {MOTES.map(([x, y, w, d], i) => (
          <span key={i} style={{ left: `${x * 3.4}%`, top: `${y}%`, width: w, height: w, '--d': `${d}s`, '--o': `${-i * 1.3}s` }} />
        ))}
      </div>

      <svg className="room-art" viewBox={`0 0 ${W} ${H}`}>
        {/* the window: a violet night, a moon, a few stars, curtains tied back */}
        <path d={roughRect(1094, 44, 136, 164, 1201, 0.8)} style={{ fill: '#231a4d' }} />
        {STARS.map(([x, y, s], i) => (
          <path key={i} d={`M${x - s},${y}H${x + s}M${x},${y - s}V${y + s}`} {...thin} strokeWidth="1.2" opacity="0.8" />
        ))}
        <path d={`${roughEllipse(1196, 84, 17, 17, 1203, 1.02, 0.02)}`} style={{ fill: '#fff1c4' }} />
        <path d={roughEllipse(1204, 78, 15, 15, 1204, 1.02, 0.02)} style={{ fill: '#231a4d' }} />
        <path d={roughRect(1094, 44, 136, 164, 1205, 0.8)} {...line} />
        <path d={strokePath([[1162, 46], [1162, 206]], 1206, 0.4)} {...line} />
        <path d={strokePath([[1096, 126], [1228, 126]], 1207, 0.4)} {...line} />
        <Shape pts={[[1084, 208], [1240, 208], [1244, 218], [1080, 218]]} seed={1208} fill="p-orange" op={0.5} />
        <path d={strokePath([[1068, 32], [1256, 32]], 1209, 0.4)} {...line} strokeWidth="3" />
        <Shape pts={[[1074, 32], [1112, 32], [1104, 96], [1096, 120], [1112, 188], [1100, 236], [1078, 236], [1086, 188], [1080, 120], [1072, 96]]} seed={1210} fill="p-mint" op={0.9} />
        <Shape pts={[[1212, 32], [1250, 32], [1252, 96], [1244, 120], [1238, 188], [1246, 236], [1224, 236], [1214, 188], [1228, 120], [1220, 96]]} seed={1211} fill="p-mint" op={0.9} />
        <path d={strokePath([[1078, 120], [1106, 124]], 1212, 0.3)} {...line} strokeWidth="3" />
        <path d={strokePath([[1218, 124], [1248, 120]], 1213, 0.3)} {...line} strokeWidth="3" />

        {/* a little framed mountain over the armchair (the climbing) */}
        <Shape pts={[[318, 116], [394, 116], [394, 180], [318, 180]]} seed={1220} />
        <path d={strokePath([[324, 174], [346, 140], [358, 154], [372, 128], [388, 174]], 1221, 0.4) + ' Z'} style={{ fill: 'url(#p-violet)' }} />
        <path d={strokePath([[324, 174], [346, 140], [358, 154], [372, 128], [388, 174]], 1221, 0.4)} {...thin} />
        <path d={strokePath([[366, 138], [372, 128], [378, 140]], 1222, 0.2)} {...thin} stroke="#fff6ff" />
        <path d={strokePath([[336, 116], [356, 96], [376, 116]], 1223, 0.3)} {...thin} />

        {/* the string of lights */}
        <path d={`M${WIRE[0]} Q${WIRE[1]} ${WIRE[2]} Q${WIRE2[1]} ${WIRE2[2]}`} {...thin} opacity="0.7" />

        {/* where the wall meets the floor */}
        <path d={strokePath(Array.from({ length: 14 }, (_, i) => [i * 97, 352 + ((i * 7) % 3) - 1]), 1229, 0.8)} {...thin} opacity="0.28" />
        {/* the floor */}
        <path d={strokePath(Array.from({ length: 14 }, (_, i) => [i * 97, FLOOR + ((i * 13) % 5) - 2]), 1230, 1)} {...line} opacity="0.6" />
        {/* the rug */}
        <path d={roughEllipse(430, 398, 270, 19, 1231, 1.04, 0.02)} style={{ fill: 'url(#hatch-a3)' }} opacity="0.75" />
        <path d={roughEllipse(430, 398, 270, 19, 1231, 1.04, 0.02)} {...line} />
        <path d={roughEllipse(430, 398, 226, 12, 1232, 1.04, 0.02)} {...thin} strokeDasharray="5 7" opacity="0.7" />

        {/* a big plant on the left */}
        <Plant
          x={66}
          base={332}
          seed={1240}
          leaves={[[20, 238, 13], [46, 214, 14], [84, 206, 14], [116, 236, 13], [124, 286, 11], [8, 288, 11], [70, 250, 10]]}
          pot={[[34, 330], [100, 330], [92, 402], [42, 402]]}
        />

        {/* the reading lamp: a fabric shade on a tall stem */}
        <path d={roughEllipse(170, 400, 26, 5, 1250, 1.04, 0.02)} style={shade} />
        <path d={roughEllipse(170, 400, 26, 5, 1250, 1.04, 0.02)} {...line} />
        <path d={strokePath([[167, 398], [167, 150]], 1251, 0.4)} {...line} />
        <path d={strokePath([[173, 398], [173, 150]], 1252, 0.4)} {...line} />
        <path d={strokePath([[148, 96], [192, 96], [210, 152], [130, 152], [148, 96]], 1253, 0.5)} style={{ fill: '#ffe4ae' }} opacity="0.95" />
        <path d={strokePath([[148, 96], [192, 96], [210, 152], [130, 152], [148, 96]], 1253, 0.5)} style={{ fill: 'url(#p-orange)' }} opacity="0.6" />
        <path d={strokePath([[148, 96], [192, 96], [210, 152], [130, 152], [148, 96]], 1253, 0.5)} {...line} />
        <path d={strokePath([[134, 144], [206, 144]], 1254, 0.4)} {...thin} strokeDasharray="4 5" />

        {/* the armchair, a blanket thrown over its arm */}
        <Shape pts={back} seed={1260} fill="p-violet" />
        <path d={strokePath([[300, 236], [346, 228], [392, 236]], 1261, 0.5)} {...thin} opacity="0.7" />
        <circle cx="322" cy="262" r="2.4" fill="var(--room-line)" />
        <circle cx="370" cy="262" r="2.4" fill="var(--room-line)" />
        <Shape pts={seat} seed={1262} fill="p-violet" op={0.8} />
        <Shape pts={skirt} seed={1263} fill="p-violet" op={0.6} />
        <path d={strokePath([[240, 390], [242, 402]], 1264, 0.2)} {...line} strokeWidth="4" />
        <path d={strokePath([[456, 390], [454, 402]], 1265, 0.2)} {...line} strokeWidth="4" />
        <Shape pts={armL} seed={1266} fill="p-violet" />
        <Shape pts={armR} seed={1267} fill="p-violet" />
        <Shape pts={blanket} seed={1268} fill="p-rose" />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={strokePath([[404 + k * 4, 236 + k * 30], [432 + k * 6, 262 + k * 30], [456 + k * 4, 296 + k * 26]], 1269 + k, 0.4)}
            {...thin}
            strokeDasharray="2 4"
          />
        ))}
        {[452, 460, 468, 476].map((x, k) => (
          <path key={x} d={strokePath([[x - 2, 356 - (k % 2) * 6], [x - 3, 368 - (k % 2) * 6]], 1272 + k, 0.2)} {...thin} />
        ))}
        {/* a cushion against the back */}
        <Shape pts={[[270, 282], [298, 274], [328, 282], [322, 306], [328, 332], [298, 338], [268, 330], [276, 306]]} seed={1276} fill="p-orange" />
        <path d={strokePath([[282, 300], [298, 306], [314, 300]], 1277, 0.3)} {...thin} opacity="0.7" />
        <circle cx="298" cy="306" r="2.4" fill="var(--room-line)" />

        {/* a little table: tea, and a candle in a jar */}
        <path d={strokePath([[520, 320], [520, 398]], 1280, 0.3)} {...line} strokeWidth="3" />
        <path d={strokePath([[500, 401], [540, 401]], 1281, 0.3)} {...line} strokeWidth="3" />
        <path d={roughEllipse(520, 318, 42, 8, 1282, 1.04, 0.02)} style={shade} />
        <path d={roughEllipse(520, 318, 42, 8, 1282, 1.04, 0.02)} style={{ fill: 'url(#p-orange-deep)' }} opacity="0.55" />
        <path d={roughEllipse(520, 318, 42, 8, 1282, 1.04, 0.02)} {...line} />
        <path d={roughRect(538, 294, 16, 20, 1283, 0.4)} style={{ fill: 'color-mix(in oklab, #ffd98a 30%, var(--room-shade))' }} />
        <path d={roughRect(538, 294, 16, 20, 1283, 0.4)} {...thin} />
        <path d={strokePath([[546, 300], [546, 292]], 1284, 0.1)} {...thin} />

        {/* a pouf across from the armchair: the seat for whoever comes in */}
        <path d={roughEllipse(652, 380, 52, 23, 1295, 1.04, 0.03)} style={shade} />
        <path d={roughEllipse(652, 380, 52, 23, 1295, 1.04, 0.03)} style={{ fill: 'url(#hatch-a2)' }} opacity="0.85" />
        <path d={roughEllipse(652, 380, 52, 23, 1295, 1.04, 0.03)} {...line} />
        <path d={roughEllipse(652, 362, 44, 9, 1296, 1.04, 0.02)} style={{ fill: 'url(#hatch-a2)' }} />
        <path d={roughEllipse(652, 362, 44, 9, 1296, 1.04, 0.02)} {...line} />
        <circle cx="652" cy="362" r="2.4" fill="var(--room-line)" />
        {[620, 652, 684].map((x, k) => (
          <path key={x} d={strokePath([[x + (k - 1) * 4, 369], [x + (k - 1) * 9, 401]], 1297 + k, 0.4)} {...thin} opacity="0.7" />
        ))}

        {/* the desk */}
        <Shape pts={drawers} seed={1300} fill="p-orange-deep" op={0.35} />
        <path d={strokePath([[714, 352], [804, 352]], 1301, 0.3)} {...thin} />
        <path d={strokePath([[752, 330], [766, 330]], 1302, 0.2)} {...line} strokeWidth="3" />
        <path d={strokePath([[752, 376], [766, 376]], 1303, 0.2)} {...line} strokeWidth="3" />
        <path d={strokePath([[1048, 308], [1050, 402]], 1304, 0.3)} {...line} strokeWidth="3.2" />
        <path d={strokePath([[1056, 308], [1058, 402]], 1305, 0.3)} {...thin} />
        <Shape pts={top} seed={1306} fill="p-orange-deep" op={0.5} />

        {/* the desk lamp, bent over the papers */}
        <path d={roughEllipse(734, 291, 20, 4.5, 1310, 1.04, 0.02)} style={shade} />
        <path d={roughEllipse(734, 291, 20, 4.5, 1310, 1.04, 0.02)} {...line} />
        <path d={strokePath([[734, 288], [744, 222], [790, 202]], 1311, 0.3)} {...line} strokeWidth="3" />
        <circle cx="744" cy="222" r="3.4" style={shade} stroke="var(--room-line)" strokeWidth="1.8" />
        <path d={strokePath([[782, 196], [804, 192], [818, 222], [790, 236], [782, 196]], 1312, 0.3)} style={{ fill: 'url(#p-mint)' }} />
        <path d={strokePath([[782, 196], [804, 192], [818, 222], [790, 236], [782, 196]], 1312, 0.3)} {...line} />
        <path d={strokePath([[792, 232], [816, 222]], 1313, 0.2)} stroke="#fff1c4" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* a note and a pencil under the lamp */}
        <path d={strokePath([[740, 292], [790, 286], [794, 292]], 1314, 0.3)} {...thin} />

        {/* the computer */}
        <path d={roughEllipse(925, 292, 34, 4, 1320, 1.04, 0.02)} style={shade} />
        <path d={roughEllipse(925, 292, 34, 4, 1320, 1.04, 0.02)} {...line} />
        <path d={strokePath([[916, 290], [918, 268]], 1321, 0.2)} {...line} />
        <path d={strokePath([[934, 290], [932, 268]], 1322, 0.2)} {...line} />
        <path d={roughRect(810, 118, 230, 152, 1323, 0.6)} style={shade} />
        <path d={roughRect(820, 128, 210, 132, 1324, 0.5)} style={{ fill: 'var(--room-screen)' }} />
        <path d={roughRect(810, 118, 230, 152, 1323, 0.6)} {...line} />
        <path d={roughRect(820, 128, 210, 132, 1324, 0.5)} {...thin} />
        <circle cx="1030" cy="265" r="1.8" fill="#9ff0b0" />
        {/* sticky notes on the bezel */}
        <path d={strokePath([[1018, 112], [1044, 116], [1040, 142], [1014, 138], [1018, 112]], 1325, 0.3)} style={{ fill: '#ffd6f5' }} opacity="0.9" />
        <path d={strokePath([[1020, 124], [1036, 127]], 1326, 0.3)} stroke="#c2569f" strokeWidth="1.2" fill="none" />
        <path d={strokePath([[1019, 130], [1032, 132]], 1327, 0.3)} stroke="#c2569f" strokeWidth="1.2" fill="none" />
        <path d={strokePath([[798, 120], [820, 114], [824, 136], [802, 140], [798, 120]], 1328, 0.3)} style={{ fill: '#fdd08a' }} opacity="0.9" />
        {/* keyboard and mouse */}
        <path d={strokePath([[856, 282], [986, 282], [994, 293], [848, 293], [856, 282]], 1329, 0.3)} style={shade} />
        <path d={strokePath([[856, 282], [986, 282], [994, 293], [848, 293], [856, 282]], 1329, 0.3)} {...thin} />
        <path d={strokePath([[858, 287.5], [988, 287.5]], 1330, 0.2)} {...thin} strokeDasharray="5 3" opacity="0.7" />
        <path d={roughEllipse(1012, 290, 8, 4.5, 1331, 1.04, 0.02)} style={shade} />
        <path d={roughEllipse(1012, 290, 8, 4.5, 1331, 1.04, 0.02)} {...thin} />
        <path d={strokePath([[1012, 286], [1022, 270], [1040, 268]], 1332, 0.6)} {...thin} opacity="0.6" />
        {/* a cactus at the corner of the desk */}
        <path d={roughEllipse(1040, 270, 7, 14, 1333, 1.04, 0.03)} style={{ fill: 'url(#tree)' }} />
        <path d={roughEllipse(1040, 270, 7, 14, 1333, 1.04, 0.03)} {...thin} />
        <Shape pts={[[1030, 278], [1050, 278], [1047, 294], [1033, 294]]} seed={1334} fill="p-rose" />

        {/* a tall plant under the window */}
        <Plant
          x={1170}
          base={346}
          seed={1340}
          leaves={[[1130, 262, 12], [1150, 236, 13], [1184, 226, 13], [1212, 252, 12], [1222, 300, 10], [1116, 304, 10]]}
          pot={[[1140, 344], [1200, 344], [1192, 402], [1148, 402]]}
        />
        {/* a game of chess left halfway, in front, on the rug */}
        <Shape pts={[[548, 402], [622, 402], [636, 420], [534, 420]]} seed={1290} />
        {CHESS.map((d, i) => (
          <path key={i} d={d} style={{ fill: 'color-mix(in oklab, var(--room-line) 70%, transparent)' }} />
        ))}
        <path d={strokePath([[560, 406], [560, 396], [557, 392], [560, 387], [563, 392], [560, 396]], 1291, 0.2)} {...line} strokeWidth="2.6" />
        <path d={strokePath([[606, 406], [606, 384], [602, 380], [610, 380], [606, 384]], 1292, 0.2)} {...line} strokeWidth="2.6" />
        <path d={strokePath([[603, 376], [609, 376], [606, 373], [606, 379]], 1293, 0.1)} {...thin} />
        <path d={strokePath([[584, 409], [584, 400], [581, 396], [584, 392], [587, 396]], 1294, 0.2)} {...line} strokeWidth="2.6" />
      </svg>

      {/* the things that move */}
      {BULBS.map(([x, y, c, d], i) => (
        <span key={i} className="room-bulb" style={{ ...at(x - 5, y - 5, 10, 10), '--c': c, '--d': `${-d}s` }} />
      ))}
      <span className="room-flame" style={at(541, 278, 10, 16)} />
      <svg className="room-steam" viewBox="0 0 40 60" style={at(491, 222, 34, 50)}>
        {[8, 20, 32].map((x, i) => (
          <path
            key={x}
            d={strokePath([[x, 58], [x - 4, 44], [x + 4, 30], [x - 3, 16], [x + 2, 4]], 1910 + i, 0.5)}
            fill="none"
            stroke="var(--room-line)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ '--i': i }}
          />
        ))}
      </svg>
      <img className="room-mug" src="/room/mug.png" alt="" style={at(490, 270, 38)} />
      <img className="room-books" src="/room/books.png" alt="" style={at(748, 252, 60)} />
      <div className="room-screen" style={at(828, 134, 196, 122)}>
        <span className="screen-line">
          <b>~/terrier</b> $ ./discuter
        </span>
        <span className="screen-line dim">connexion… ok</span>
        <span className="screen-line">&gt; salut, installe-toi</span>
        <span className="screen-line">
          &gt; un thé ? <i className="screen-cursor" />
        </span>
      </div>
      <div className="room-hog" style={at(318, 234, 138)}>
        <Hedgehog light seed={91} />
      </div>
    </div>
  );
}
