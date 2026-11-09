/**
 * Knitting gauge arithmetic. Pure functions, no React imports.
 */

import {BANDS, PATTERN, SHAPING, YARN} from '../constants/config';

export type Band = 'on' | 'close' | 'off';

export interface Gauge {
  stPerCm: number;
  rowPerCm: number;
  stPer10: number;
  rowPer10: number;
}

export interface Rescale {
  targetWidthCm: number;
  targetLengthCm: number;
  newCastOn: number;
  newRows: number;
}

export interface Shaping {
  base: number;
  rem: number;
  repeats: number;
  over: number;
  text: string;
}

export interface YarnEstimate {
  grams: number;
  skeins: number;
  yards: number;
}

/** Stitch and row gauge from a swatch measured over `sizeCm` (square swatch). */
export function deriveGauge(stitches: number, rows: number, sizeCm: number): Gauge {
  const safeSize = sizeCm > 0 ? sizeCm : 10;
  const stPerCm = stitches / safeSize;
  const rowPerCm = rows / safeSize;
  return {
    stPerCm,
    rowPerCm,
    stPer10: stPerCm * 10,
    rowPer10: rowPerCm * 10,
  };
}

/** Percentage the maker's stitch gauge is off the pattern's. */
export function compareToPattern(
  userStPer10: number,
  patternStPer10: number = PATTERN.stPer10,
): number {
  if (!patternStPer10) {
    return 0;
  }
  return ((userStPer10 - patternStPer10) / patternStPer10) * 100;
}

export function verdictBand(diffPct: number): Band {
  const d = Math.abs(diffPct);
  if (d <= BANDS.onGauge) {
    return 'on';
  }
  if (d <= BANDS.close) {
    return 'close';
  }
  return 'off';
}

export function bandLabel(band: Band): string {
  if (band === 'on') {
    return 'ON GAUGE';
  }
  if (band === 'close') {
    return 'CLOSE - RESCALE';
  }
  return 'OFF GAUGE - RESCALE';
}

/** Re-cast the designer's numbers into the maker's own gauge. */
export function rescale(gauge: Gauge, pattern = PATTERN): Rescale {
  const patternStPerCm = pattern.stPer10 / 10;
  const targetWidthCm = patternStPerCm > 0 ? pattern.castOn / patternStPerCm : 0;
  return {
    targetWidthCm: Math.round(targetWidthCm * 10) / 10,
    targetLengthCm: pattern.targetLengthCm,
    newCastOn: Math.max(1, Math.round(targetWidthCm * gauge.stPerCm)),
    newRows: Math.max(1, Math.round(pattern.targetLengthCm * gauge.rowPerCm)),
  };
}

/**
 * Spread `increases` evenly across `over` stitches.
 * The first `rem` segments carry one extra knit stitch.
 */
export function spaceShaping(over: number, increases: number = SHAPING.increases): Shaping {
  const d = Math.max(1, increases);
  const n = Math.max(d, over);
  const base = Math.floor(n / d);
  const rem = n % d;

  let text: string;
  if (rem === 0) {
    text = `K ${base}, inc 1 - repeat ${d} times.`;
  } else {
    text = `K ${base + 1}, inc 1 - repeat ${rem} times, then K ${base}, inc 1 - repeat ${
      d - rem
    } times.`;
  }

  return {base, rem, repeats: d, over: n, text};
}

/** Yardage from the swatch weight spread over the finished pieces. */
export function estimateYarn(
  swatchWeightG: number,
  sizeCm: number,
  widthCm: number,
  lengthCm: number,
  pieceCount: number,
): YarnEstimate {
  const area = sizeCm * sizeCm;
  if (swatchWeightG <= 0 || area <= 0) {
    return {grams: 0, skeins: 0, yards: 0};
  }
  const gPerCm2 = swatchWeightG / area;
  const projectArea = widthCm * lengthCm * Math.max(1, pieceCount);
  const grams = Math.ceil(gPerCm2 * projectArea * YARN.safety);
  const skeins = Math.ceil(grams / YARN.skeinGrams);
  const yards = Math.round((grams / YARN.skeinGrams) * YARN.skeinYards);
  return {grams, skeins, yards};
}

/** 1..everyRows - never 0, so the stat pill always has a value. */
export function rowsUntilShaping(row: number, everyRows: number = SHAPING.everyRows): number {
  const e = Math.max(1, everyRows);
  const mod = row % e;
  return mod === 0 ? e : e - mod;
}

export function isShapingRow(row: number, everyRows: number = SHAPING.everyRows): boolean {
  return row > 0 && row % Math.max(1, everyRows) === 0;
}
