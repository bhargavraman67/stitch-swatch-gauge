import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 16;

type IconCmp = React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;

/** 40 px pill, flex:1 inside its row so every chip gets an explicit width. */
function Chip({
  label,
  active,
  Icon,
  onPress,
}: {
  label: string;
  active: boolean;
  Icon?: IconCmp;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
      ...theme.animation.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      ...theme.animation.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const tint = active ? theme.colors.primaryDark : theme.colors.textSecondary;

  return (
    <Pressable
      style={styles.press}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityState={{selected: active}}
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="none"
        style={[styles.shell, active ? styles.shellActive : null, {transform: [{scale}]}]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={tint} strokeWidth={2.4} /> : null}
          <Text numberOfLines={1} style={[styles.label, {color: tint}]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    flex: 1,
    height: 40,
  },
  shell: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shellActive: {
    backgroundColor: theme.colors.surfaceActive,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: ICON,
  },
});

export default React.memo(Chip);
