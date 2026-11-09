/** Display helpers. Pure, no React. */

export function fmt1(n: number): string {
  return Number.isFinite(n) ? n.toFixed(1) : '0.0';
}

export function fmtInt(n: number): string {
  return Number.isFinite(n) ? String(Math.round(n)) : '0';
}

export function fmtPct(n: number): string {
  if (!Number.isFinite(n)) {
    return '0%';
  }
  const r = Math.round(n);
  return `${r > 0 ? '+' : ''}${r}%`;
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** Linear blend of two "#rrggbb" strings. */
export function mixHex(a: string, b: string, t: number): string {
  const k = clamp(t, 0, 1);
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255;
  const ag = (pa >> 8) & 255;
  const ab = pa & 255;
  const br = (pb >> 16) & 255;
  const bg = (pb >> 8) & 255;
  const bb = pb & 255;
  const r = Math.round(ar + (br - ar) * k);
  const g = Math.round(ag + (bg - ag) * k);
  const bl = Math.round(ab + (bb - ab) * k);
  const hex = ((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0');
  return `#${hex}`;
}
