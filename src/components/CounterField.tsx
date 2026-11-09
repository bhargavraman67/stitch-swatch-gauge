import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {Minus, Plus} from 'lucide-react-native';

import {REPEAT_MS} from '../constants/config';
import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** 48x48 stepper. Holding it repeats every 120 ms through a ref-held interval. */
function StepButton({
  dir,
  onStep,
  label,
}: {
  dir: 1 | -1;
  onStep: (d: number) => void;
  label: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    Animated.spring(scale, {
      toValue: 1,
      ...theme.animation.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  useEffect(() => stop, [stop]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.9,
      ...theme.animation.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const startRepeat = useCallback(() => {
    if (timer.current) {
      return;
    }
    timer.current = setInterval(() => stepRef.current(dir), REPEAT_MS);
  }, [dir]);

  const Glyph = dir === 1 ? Plus : Minus;

  return (
    <Pressable
      style={styles.step}
      hitSlop={HIT}
      onPress={() => onStep(dir)}
      onPressIn={pressIn}
      onPressOut={stop}
      onLongPress={startRepeat}
      delayLongPress={320}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View pointerEvents="none" style={[styles.stepInner, {transform: [{scale}]}]}>
        <Glyph size={24} color={theme.colors.primaryDark} strokeWidth={3} />
      </Animated.View>
    </Pressable>
  );
}

function CounterField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  const flip = useRef(new Animated.Value(0)).current;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    flip.setValue(0);
    Animated.timing(flip, {
      toValue: 1,
      duration: 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, flip]);

  const step = useCallback(
    (d: number) => {
      onChange(valueRef.current + d);
    },
    [onChange],
  );

  const translateY = flip.interpolate({inputRange: [0, 1], outputRange: [10, 0]});

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <StepButton dir={-1} onStep={step} label={`decrease ${label}`} />
        <View style={styles.valueBox}>
          <Animated.Text style={[styles.value, {opacity: flip, transform: [{translateY}]}]}>
            {value}
          </Animated.Text>
        </View>
        <StepButton dir={1} onStep={step} label={`increase ${label}`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  step: {
    width: 48,
    height: 48,
  },
  stepInner: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBox: {
    width: 70,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(CounterField);
