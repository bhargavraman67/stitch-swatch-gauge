import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

type IconCmp = React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;

/**
 * Height 60, radius 24, rose gradient, coloured shadow.
 * Icon locked to 24x24 with lineHeight 24 and gap 10 (rule 20).
 */
function PrimaryButton({
  label,
  Icon,
  onPress,
  style,
}: {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
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
        <LinearGradient
          colors={theme.gradients.primary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.onDark} strokeWidth={2.4} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
  },
  shell: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.xl,
    ...theme.shadows.button,
  },
  fill: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,248,241,0.35)',
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
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: ICON,
    color: theme.colors.onDark,
  },
});

export default React.memo(PrimaryButton);
