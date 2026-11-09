import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

type IconCmp = React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;

/** Height 48, radius 22, blush fill with a stitched border. Same icon contract as Primary. */
function SecondaryButton({
  label,
  Icon,
  onPress,
  style,
  tint = theme.colors.primaryDark,
}: {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  tint?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
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

  return (
    <Pressable
      style={[styles.press, style]}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View pointerEvents="none" style={[styles.shell, {transform: [{scale}]}]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={tint} strokeWidth={2.4} /> : null}
          <Text style={[styles.label, {color: tint}]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 48,
  },
  shell: {
    width: '100%',
    height: 48,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: ICON,
  },
});

export default React.memo(SecondaryButton);
