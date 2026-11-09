import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';

import theme from '../constants/theme';
import {Band, bandLabel} from '../game/gauge';

const BAND_COLOR: Record<Band, string> = {
  on: theme.colors.success,
  close: theme.colors.accent,
  off: theme.colors.warning,
};

/** Cross-fades and pulses whenever the gauge crosses a band boundary. */
function VerdictRibbon({band}: {band: Band}) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const prev = useRef(band);

  useEffect(() => {
    if (prev.current === band) {
      return;
    }
    prev.current = band;
    fade.setValue(0);
    Animated.parallel([
      Animated.timing(fade, {toValue: 1, duration: 180, useNativeDriver: true}),
      Animated.sequence([
        Animated.spring(pulse, {
          toValue: 1.06,
          tension: 220,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(pulse, {
          toValue: 1,
          ...theme.animation.settle,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [band, fade, pulse]);

  const color = BAND_COLOR[band];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ribbon,
        {
          backgroundColor: `${color}1A`,
          borderColor: `${color}55`,
          opacity: fade,
          transform: [{scale: pulse}],
        },
      ]}>
      <Text style={[styles.text, {color}]}>{bandLabel(band)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ribbon: {
    alignSelf: 'center',
    height: 26,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    lineHeight: 14,
  },
});

export default React.memo(VerdictRibbon);
