import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {RIBBON_OUT_MS} from '../constants/config';
import theme from '../constants/theme';

/** Denim yarn-strand reminder that slides down from under the header. */
function ShapingRibbon({visible, text}: {visible: boolean; text: string}) {
  const slide = useRef(new Animated.Value(-70)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slide, {
          toValue: 0,
          tension: 140,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {toValue: 1, duration: 160, useNativeDriver: true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: -70,
          duration: RIBBON_OUT_MS,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {toValue: 0, duration: RIBBON_OUT_MS, useNativeDriver: true}),
      ]).start();
    }
  }, [visible, slide, fade]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, {opacity: fade, transform: [{translateY: slide}]}]}>
      <LinearGradient
        colors={theme.gradients.accent}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.fill}>
        <Text numberOfLines={2} style={styles.text}>
          {text}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    height: 56,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,248,241,0.35)',
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.onDark,
  },
});

export default React.memo(ShapingRibbon);
