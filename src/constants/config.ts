/**
 * Tunables for StitchSwatchGauge. Pure data, no React.
 */

/** Rule 13: EXACTLY 8000 ms. Shorter values race the screenshot capture window. */
export const LOADER_DURATION_MS = 8000;

export const LOADER_FADE_MS = 320;

/** The designer's gauge the maker is trying to match. */
export const PATTERN = {
  stPer10: 20,
  rowPer10: 28,
  castOn: 96,
  targetLengthCm: 58,
};

/** Measured swatch window. 4 in == 10.16 cm. */
export const SWATCH_SIZES = [
  {label: '10 CM', cm: 10},
  {label: '4 IN', cm: 10.16},
  {label: '15 CM', cm: 15},
];

export const DEFAULTS = {
  stitches: 22,
  rows: 30,
  sizeIndex: 0,
  projectIndex: 0,
  swatchWeightG: 9,
};

export const CLAMPS = {
  stitches: {min: 4, max: 80},
  rows: {min: 4, max: 120},
  weight: {min: 1, max: 200},
};

export const SHAPING = {
  increases: 10,
  everyRows: 8,
};

export const YARN = {
  safety: 1.15,
  skeinGrams: 100,
  skeinYards: 220,
};

export const PROJECTS = [
  {id: 'raglan', label: 'RAGLAN PULLOVER', pieceCount: 2},
  {id: 'socks', label: 'SOCK PAIR', pieceCount: 2},
];

/** The stockinette canvas on GameScreen. */
export const GRID = {
  cols: 12,
  rows: 7,
  /** stitch / row counts that fill the canvas completely */
  stitchesFull: 44,
  rowsFull: 60,
};

/** |diffPct| bands. */
export const BANDS = {
  onGauge: 2,
  close: 8,
};

/** Long-press repeat interval for the +/- buttons. */
export const REPEAT_MS = 120;

/** Row-counter ribbon timings. */
export const RIBBON_HOLD_MS = 2600;
export const RIBBON_OUT_MS = 240;
