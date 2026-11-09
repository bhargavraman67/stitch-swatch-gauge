import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

export interface StatItem {
  key: string;
  value: string | number;
  label: string;
  color: string;
}

function hasValue(v: string | number): boolean {
  if (typeof v === 'number') {
    return Number.isFinite(v) && v !== 0;
  }
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * Colour-coded pill: accent dot + big tabular number + caption.
 * No raster icons and no emoji, so every pill in a row is geometrically identical
 * (rule 21). `slot` carries the flex, `card` carries width:'100%' (rule 19a).
 */
function StatCard({value, label, color}: {value: string | number; label: string; color: string}) {
  if (!hasValue(value)) {
    return null;
  }

  return (
    <View style={styles.slot}>
      <View style={[styles.card, {borderColor: `${color}55`}]}>
        <View style={[styles.dot, {backgroundColor: color}]} />
        <Text numberOfLines={1} style={[styles.value, {color}]}>
          {value}
        </Text>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      </View>
    </View>
  );
}

/**
 * A row of pills. Renders nothing at all when fewer than two pills would be
 * visible - a lone pill looks orphaned, an empty pill looks broken.
 */
export function StatRow({items, style}: {items: StatItem[]; style?: any}) {
  const visible = items.filter(it => hasValue(it.value));
  if (visible.length < 2) {
    return null;
  }

  return (
    <View style={[styles.row, style]}>
      {visible.map(it => (
        <StatCard key={it.key} value={it.value} label={it.label} color={it.color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  slot: {
    flex: 1,
  },
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
    shadowOpacity: 0.08,
    elevation: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.4,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
});

export default React.memo(StatCard);
