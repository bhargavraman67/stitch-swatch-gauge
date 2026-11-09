import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const SIZE = 240;
const CIRCLE = 220;
const TICKS = 24;
const RING_R = CIRCLE / 2 - 6;

/** The oversized one-tap row target with a 24-tick progress ring. */
function TapCounter({row, onTap}: {row: number; onTap: () => void}) {
  const scale = useRef(new Animated.Value(1)).current;
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.08,
        ...theme.animation.bounce,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        ...theme.animation.settle,
        useNativeDriver: true,
      }),
    ]).start();
  }, [row, scale]);

  const press = useCallback(() => {
    onTap();
  }, [onTap]);

  const filled = row % TICKS === 0 && row > 0 ? TICKS : row % TICKS;

  const ticks = useMemo(
    () =>
      Array.from({length: TICKS}, (_, i) => ({
        key: `t-${i}`,
        angle: (360 / TICKS) * i,
      })),
    [],
  );

  return (
    <Pressable
      style={styles.press}
      hitSlop={HIT}
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`count row, currently ${row}`}>
      <View style={styles.ring} pointerEvents="none">
        {ticks.map((t, i) => (
          <View
            key={t.key}
            style={[
              styles.tick,
              {
                backgroundColor:
                  i < filled ? theme.colors.primary : 'rgba(142,51,83,0.18)',
                transform: [{rotate: `${t.angle}deg`}, {translateY: -RING_R}],
              },
            ]}
          />
        ))}
      </View>

      <Animated.View pointerEvents="none" style={[styles.shell, {transform: [{scale}]}]}>
        <LinearGradient
          colors={theme.gradients.primary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.circle}>
          <Text style={styles.number}>{row}</Text>
          <Text style={styles.caption}>ROW</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    width: 4,
    height: 10,
    borderRadius: 2,
  },
  shell: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    ...theme.shadows.button,
    shadowOpacity: 0.38,
    shadowRadius: 26,
    elevation: 12,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,248,241,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 72,
    lineHeight: 82,
    fontWeight: '900',
    color: theme.colors.onDark,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    color: 'rgba(240,220,211,0.85)',
  },
});

export default React.memo(TapCounter);
