import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ArrowLeftRight, ChevronLeft, Info} from 'lucide-react-native';

import assets from '../assets';
import Chip from '../components/Chip';
import CounterField from '../components/CounterField';
import KnitGrid from '../components/KnitGrid';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {HeaderIconButton} from '../components/ScreenHeader';
import {StatRow} from '../components/StatCard';
import VerdictRibbon from '../components/VerdictRibbon';
import {GRID, SWATCH_SIZES} from '../constants/config';
import theme from '../constants/theme';
import {Band} from '../game/gauge';
import {clamp, fmt1, fmtPct} from '../utils/format';

// Board geometry - the parent's padding + border is part of the width (rule 4).
const SCREEN_W = Dimensions.get('window').width;
const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
const PAD = 10;
const BORDER = 2;
const BOARD_FRAME = PAD + BORDER;
const COLS = GRID.cols;
const ROWS = GRID.rows;
const CELL = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / COLS);
const BOARD_W = CELL * COLS + 2 * BOARD_FRAME;
const BOARD_H = CELL * ROWS + 2 * BOARD_FRAME;

const BAND_COLOR: Record<Band, string> = {
  on: theme.colors.success,
  close: theme.colors.accent,
  off: theme.colors.warning,
};

/** Swatch Entry + Pattern Compare - archetype G3: header / canvas / strip / CTA. */
function GameScreen({
  stitches,
  rows,
  sizeIndex,
  sizeCm,
  userStPer10,
  patternStPer10,
  diffPct,
  band,
  onStitches,
  onRows,
  onSize,
  onBack,
  onRescale,
}: {
  stitches: number;
  rows: number;
  sizeIndex: number;
  sizeCm: number;
  userStPer10: number;
  patternStPer10: number;
  diffPct: number;
  band: Band;
  onStitches: (v: number) => void;
  onRows: (v: number) => void;
  onSize: (i: number) => void;
  onBack: () => void;
  onRescale: () => void;
}) {
  const [showHint, setShowHint] = useState(false);

  const fillCols = useRef(new Animated.Value(0)).current;
  const fillRows = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  // the brief's 200 ms tween - transform + opacity only, so native driver is safe
  useEffect(() => {
    const targetCols = clamp((stitches / GRID.stitchesFull) * COLS, 1, COLS);
    const targetRows = clamp((rows / GRID.rowsFull) * ROWS, 1, ROWS);
    Animated.parallel([
      Animated.timing(fillCols, {
        toValue: targetCols,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fillRows, {
        toValue: targetRows,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [stitches, rows, fillCols, fillRows]);

  const toggleHint = useCallback(() => setShowHint(v => !v), []);

  const stats = useMemo(
    () => [
      {
        key: 'yours',
        value: fmt1(userStPer10),
        label: 'YOURS /10CM',
        color: theme.colors.primary,
      },
      {
        key: 'pattern',
        value: fmt1(patternStPer10),
        label: 'PATTERN /10CM',
        color: theme.colors.accent,
      },
      {
        key: 'diff',
        value: fmtPct(diffPct),
        label: 'DIFFERENCE',
        color: BAND_COLOR[band],
      },
    ],
    [userStPer10, patternStPer10, diffPct, band],
  );

  const enterScale = enter.interpolate({inputRange: [0, 1], outputRange: [0.96, 1]});

  return (
    <ScreenBackground variant="game">
      <ScreenHeader
        title="SWATCH ENTRY"
        subtitle="WASHED - BLOCKED - DRY"
        leftSlot={<HeaderIconButton Icon={ChevronLeft} onPress={onBack} label="back to basket" />}
        rightSlot={<HeaderIconButton Icon={Info} onPress={toggleHint} label="how to measure" />}
      />

      <View style={styles.area}>
        <View style={styles.readout}>
          <View style={styles.rule} />
          <Image source={assets.sprite4} style={styles.readoutSprite} resizeMode="contain" />
          {showHint ? (
            <Text style={styles.readoutHint} numberOfLines={2}>
              COUNT EVERY STITCH ACROSS THE WINDOW, THEN EVERY ROW DOWN IT
            </Text>
          ) : (
            <Text style={styles.readoutText}>
              {`${fmt1(sizeCm)} CM x ${fmt1(sizeCm)} CM`}
            </Text>
          )}
          <View style={styles.rule} />
        </View>

        <Animated.View
          pointerEvents="none"
          style={[styles.board, {opacity: enter, transform: [{scale: enterScale}]}]}>
          <KnitGrid
            cols={COLS}
            rows={ROWS}
            cell={CELL}
            fillCols={fillCols}
            fillRows={fillRows}
          />
        </Animated.View>

        <View style={styles.ribbonWrap}>
          <VerdictRibbon band={band} />
        </View>

        <StatRow items={stats} style={styles.stats} />
      </View>

      <View style={styles.controls}>
        <CounterField label="STITCHES" value={stitches} onChange={onStitches} />
        <CounterField label="ROWS" value={rows} onChange={onRows} />

        <View style={styles.chipsRow}>
          {SWATCH_SIZES.map((s, i) => (
            <Chip
              key={s.label}
              label={s.label}
              active={i === sizeIndex}
              onPress={() => onSize(i)}
            />
          ))}
        </View>

        <PrimaryButton
          label="GO RESCALE PATTERN"
          Icon={ArrowLeftRight}
          onPress={onRescale}
          style={styles.cta}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  readout: {
    width: BOARD_W,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  readoutSprite: {
    width: 28,
    height: 28,
  },
  readoutText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  readoutHint: {
    flex: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 14,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  board: {
    width: BOARD_W,
    height: BOARD_H,
    padding: PAD,
    borderWidth: BORDER,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  ribbonWrap: {
    marginTop: 12,
  },
  stats: {
    marginTop: 10,
    alignSelf: 'stretch',
  },
  controls: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderTopWidth: 1.5,
    borderTopColor: theme.colors.border,
    ...theme.shadows.sheet,
  },
  chipsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  cta: {
    marginTop: 14,
  },
});

export default GameScreen;
