import {useCallback, useMemo, useState} from 'react';

import {CLAMPS, DEFAULTS, PATTERN, PROJECTS, SWATCH_SIZES} from '../constants/config';
import {
  compareToPattern,
  deriveGauge,
  estimateYarn,
  rescale,
  spaceShaping,
  verdictBand,
} from '../game/gauge';
import {clamp} from '../utils/format';

/**
 * Owns the swatch entry state and every number derived from it.
 * Screens receive individual values as props, not the whole object,
 * so a change to one count does not re-render unrelated subtrees.
 */
export function useSwatch() {
  const [stitches, setStitchesRaw] = useState(DEFAULTS.stitches);
  const [rows, setRowsRaw] = useState(DEFAULTS.rows);
  const [sizeIndex, setSizeIndex] = useState(DEFAULTS.sizeIndex);
  const [projectIndex, setProjectIndex] = useState(DEFAULTS.projectIndex);
  const [swatchWeightG] = useState(DEFAULTS.swatchWeightG);

  const setStitches = useCallback((v: number) => {
    setStitchesRaw(clamp(Math.round(v), CLAMPS.stitches.min, CLAMPS.stitches.max));
  }, []);

  const setRows = useCallback((v: number) => {
    setRowsRaw(clamp(Math.round(v), CLAMPS.rows.min, CLAMPS.rows.max));
  }, []);

  const sizeCm = SWATCH_SIZES[sizeIndex].cm;
  const project = PROJECTS[projectIndex];

  const gauge = useMemo(
    () => deriveGauge(stitches, rows, sizeCm),
    [stitches, rows, sizeCm],
  );

  const diffPct = useMemo(() => compareToPattern(gauge.stPer10), [gauge.stPer10]);
  const band = useMemo(() => verdictBand(diffPct), [diffPct]);
  const result = useMemo(() => rescale(gauge), [gauge]);
  const shaping = useMemo(() => spaceShaping(result.newCastOn), [result.newCastOn]);

  const yarn = useMemo(
    () =>
      estimateYarn(
        swatchWeightG,
        sizeCm,
        result.targetWidthCm,
        result.targetLengthCm,
        project.pieceCount,
      ),
    [swatchWeightG, sizeCm, result.targetWidthCm, result.targetLengthCm, project.pieceCount],
  );

  return {
    stitches,
    rows,
    sizeIndex,
    sizeCm,
    projectIndex,
    project,
    swatchWeightG,
    gauge,
    diffPct,
    band,
    result,
    shaping,
    yarn,
    patternStPer10: PATTERN.stPer10,
    patternRowPer10: PATTERN.rowPer10,
    setStitches,
    setRows,
    setSizeIndex,
    setProjectIndex,
  };
}

export default useSwatch;
