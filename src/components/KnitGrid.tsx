import React, {useMemo} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import theme from '../constants/theme';
import {mixHex} from '../utils/format';

/**
 * The stockinette canvas. A single Animated.Value per axis drives every cell's
 * opacity and scale through interpolation - transform + opacity only, so the
 * 200 ms tween runs on the native driver.
 */
function KnitGrid({
  cols,
  rows,
  cell,
  fillCols,
  fillRows,
}: {
  cols: number;
  rows: number;
  cell: number;
  fillCols: Animated.Value;
  fillRows: Animated.Value;
}) {
  const colTint = useMemo(
    () =>
      Array.from({length: cols}, (_, c) =>
        mixHex(theme.colors.surfaceAlt, theme.colors.primaryLight, cols > 1 ? c / (cols - 1) : 0),
      ),
    [cols],
  );

  const colAnim = useMemo(
    () =>
      Array.from({length: cols}, (_, c) => ({
        opacity: fillCols.interpolate({
          inputRange: [c, c + 1],
          outputRange: [0.18, 1],
          extrapolate: 'clamp',
        }),
        scale: fillCols.interpolate({
          inputRange: [c, c + 1],
          outputRange: [0.72, 1],
          extrapolate: 'clamp',
        }),
      })),
    [cols, fillCols],
  );

  const rowAnim = useMemo(
    () =>
      Array.from({length: rows}, (_, r) => ({
        opacity: fillRows.interpolate({
          inputRange: [r, r + 1],
          outputRange: [0.18, 1],
          extrapolate: 'clamp',
        }),
        scale: fillRows.interpolate({
          inputRange: [r, r + 1],
          outputRange: [0.72, 1],
          extrapolate: 'clamp',
        }),
      })),
    [rows, fillRows],
  );

  return (
    <View style={[styles.grid, {width: cols * cell}]} pointerEvents="none">
      {rowAnim.map((ra, r) => (
        <View key={`r-${r}`} style={[styles.row, {marginLeft: r % 2 === 1 ? cell / 2 : 0}]}>
          {colAnim.map((ca, c) => (
            <Animated.View
              pointerEvents="none"
              key={`c-${r}-${c}`}
              style={[
                styles.cellBox,
                {
                  width: cell,
                  height: cell,
                  opacity: Animated.multiply(ca.opacity, ra.opacity),
                  transform: [{scale: Animated.multiply(ca.scale, ra.scale)}],
                },
              ]}>
              <View style={[styles.stitch, {backgroundColor: colTint[c]}]} />
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cellBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stitch: {
    width: '84%',
    height: '84%',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(142,51,83,0.18)',
  },
});

export default React.memo(KnitGrid);
