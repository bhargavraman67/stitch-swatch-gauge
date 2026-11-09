import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

type IconCmp = React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;

/**
 * 44x44 round header affordance. Pressable is the PARENT, the Animated.View
 * lives inside it (rule 8) so onPress never gets swallowed on release builds.
 */
export function HeaderIconButton({
  Icon,
  onPress,
  onLongPress,
  label,
  tint = theme.colors.primaryDark,
}: {
  Icon: IconCmp;
  onPress: () => void;
  onLongPress?: () => void;
  label: string;
  tint?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.92,
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
      style={styles.iconBtn}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onLongPress={onLongPress}
      delayLongPress={600}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="none"
        style={[styles.iconBtnInner, {transform: [{scale}]}]}>
        <Icon size={22} color={tint} strokeWidth={2.2} />
      </Animated.View>
    </Pressable>
  );
}

/** A 44x44 transparent spacer so a one-sided header stays optically centred. */
export function HeaderSpacer() {
  return <View style={styles.spacer} />;
}

/**
 * Shared header for every screen (Menu / Game / Rescale / Counter).
 * Same component, different slots - keeps the cross-screen styling identical.
 */
function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  tone = 'light',
}: {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
}) {
  const onDark = tone === 'dark';
  return (
    <View style={[styles.header, onDark ? styles.headerDark : null]}>
      <View style={styles.side}>{leftSlot ? leftSlot : <HeaderSpacer />}</View>

      <View style={styles.center}>
        <Text
          numberOfLines={1}
          style={[styles.title, onDark ? {color: theme.colors.onDark} : null]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, onDark ? {color: theme.colors.onDarkMuted} : null]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.side}>{rightSlot ? rightSlot : <HeaderSpacer />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 116,
    paddingTop: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,250,244,0.82)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerDark: {
    backgroundColor: 'rgba(51,33,42,0.28)',
    borderBottomColor: 'rgba(255,248,241,0.18)',
  },
  side: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.2,
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  iconBtn: {
    width: 44,
    height: 44,
  },
  iconBtnInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  spacer: {
    width: 44,
    height: 44,
  },
});

export default React.memo(ScreenHeader);
