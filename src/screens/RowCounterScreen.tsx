import React, {useEffect, useMemo, useRef} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft, Minus, Plus, RotateCcw} from 'lucide-react-native';

import assets from '../assets';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {HeaderIconButton} from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import ShapingRibbon from '../components/ShapingRibbon';
import {StatRow} from '../components/StatCard';
import TapCounter from '../components/TapCounter';
import theme from '../constants/theme';
import useRowCounter from '../hooks/useRowCounter';

const RIBBON_TEXT = 'INCREASE ROW - K2, M1, K TO LAST 2';

function RowCounterScreen({
  initialRow,
  targetRows,
  onBack,
  onLogged,
  onRowChange,
}: {
  initialRow: number;
  targetRows: number;
  onBack: () => void;
  onLogged: (delta: number) => void;
  onRowChange: (row: number) => void;
}) {
  const {row, ribbon, toShaping, tap, undo, addTen, reset} = useRowCounter(
    initialRow,
    onLogged,
  );

  const reportRef = useRef(onRowChange);
  reportRef.current = onRowChange;

  useEffect(() => {
    reportRef.current(row);
  }, [row]);

  const stats = useMemo(
    () => [
      {key: 'shaping', value: toShaping, label: 'TO SHAPING', color: theme.colors.accent},
      {key: 'target', value: targetRows, label: 'TARGET ROWS', color: theme.colors.primary},
    ],
    [toShaping, targetRows],
  );

  return (
    <ScreenBackground variant="counter">
      <ScreenHeader
        title="ROW COUNTER"
        subtitle="TAP ANYWHERE ON THE CIRCLE"
        leftSlot={<HeaderIconButton Icon={ChevronLeft} onPress={onBack} label="go back" />}
        rightSlot={
          <HeaderIconButton
            Icon={RotateCcw}
            onPress={undo}
            onLongPress={reset}
            label="undo one row, hold to reset"
          />
        }
      />

      <View style={styles.ribbonSlot}>
        <ShapingRibbon visible={ribbon} text={RIBBON_TEXT} />
      </View>

      <View style={styles.body}>
        <TapCounter row={row} onTap={tap} />
      </View>

      <View style={styles.decor}>
        <Image source={assets.sprite3} style={styles.decorSprite} resizeMode="contain" />
        <Text style={styles.decorText}>ONE TAP PER ROW - IT BUZZES SO YOU CAN KEEP KNITTING</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.footerSlot}>
            <SecondaryButton label="MINUS ONE" Icon={Minus} onPress={undo} />
          </View>
          <View style={styles.footerSlot}>
            <SecondaryButton label="PLUS TEN" Icon={Plus} onPress={addTen} />
          </View>
        </View>

        <StatRow items={stats} style={styles.stats} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  ribbonSlot: {
    height: 68,
    paddingTop: 12,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decor: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  decorSprite: {
    width: 44,
    height: 44,
  },
  decorText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    lineHeight: 15,
    color: theme.colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    marginTop: 12,
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderTopWidth: 1.5,
    borderTopColor: theme.colors.border,
    ...theme.shadows.sheet,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  footerSlot: {
    flex: 1,
  },
  stats: {
    marginTop: 12,
  },
});

export default RowCounterScreen;
