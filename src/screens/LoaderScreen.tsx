import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import assets from '../assets';
import ScreenBackground from '../components/ScreenBackground';
import {LOADER_DURATION_MS, LOADER_FADE_MS} from '../constants/config';
import theme from '../constants/theme';

const BAR_W = 200;
const DASHES = 9;

function DashRow() {
  const dashes = useMemo(() => Array.from({length: DASHES}, (_, i) => i), []);
  return (
    <View style={styles.dashRow} pointerEvents="none">
      {dashes.map(i => (
        <View key={`d-${i}`} style={styles.dash} />
      ))}
    </View>
  );
}

/**
 * Dark plum splash - deliberately a different palette from the cream Menu
 * (rule 14). Brand card only - no chips and no interactive affordance.
 */
function LoaderScreen({onDone}: {onDone: () => void}) {
  const cardScale = useRef(new Animated.Value(0.78)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleRise = useRef(new Animated.Value(16)).current;
  const subFade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 150,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(cardFade, {toValue: 1, duration: 420, useNativeDriver: true}),
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 520,
        delay: 260,
        useNativeDriver: true,
      }),
      Animated.timing(titleRise, {
        toValue: 0,
        duration: 520,
        delay: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(subFade, {
        toValue: 1,
        duration: 480,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    breathLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1, duration: 550, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0, duration: 550, useNativeDriver: true}),
      ]),
    );
    pulseLoop.start();

    // width is a layout prop -> the native driver is NOT allowed here
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    bar.start();

    let fadeTimer: ReturnType<typeof setTimeout> | null = null;
    const endTimer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start();
      fadeTimer = setTimeout(() => doneRef.current(), LOADER_FADE_MS);
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(endTimer);
      if (fadeTimer) {
        clearTimeout(fadeTimer);
      }
      breathLoop.stop();
      pulseLoop.stop();
      bar.stop();
    };
  }, [cardScale, cardFade, titleFade, titleRise, subFade, breath, pulse, progress, screenFade]);

  const breathScale = breath.interpolate({inputRange: [0, 1], outputRange: [1, 1.035]});
  const barWidth = progress.interpolate({inputRange: [0, 1], outputRange: [0, BAR_W]});
  const loadingOpacity = pulse.interpolate({inputRange: [0, 1], outputRange: [0.45, 1]});

  return (
    <Animated.View pointerEvents="box-none" style={[styles.root, {opacity: screenFade}]}>
      <ScreenBackground variant="loader">
        <View style={styles.body}>
          <DashRow />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.brandCard,
              {
                opacity: cardFade,
                transform: [{scale: Animated.multiply(cardScale, breathScale)}],
              },
            ]}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <DashRow />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.titleBlock,
              {opacity: titleFade, transform: [{translateY: titleRise}]},
            ]}>
            <Text style={styles.titleTop}>STITCH SWATCH</Text>
            <Text style={styles.titleBottom}>GAUGE</Text>
          </Animated.View>

          <Animated.Text style={[styles.subtitle, {opacity: subFade}]}>
            KNIT THE RIGHT SIZE, FIRST TIME
          </Animated.Text>

          <View style={styles.barTrack}>
            <Animated.View pointerEvents="none" style={[styles.barFillBox, {width: barWidth}]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.barFill}
              />
            </Animated.View>
          </View>

          <Animated.Text style={[styles.loading, {opacity: loadingOpacity}]}>
            LOADING...
          </Animated.Text>
        </View>
      </ScreenBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#33212A',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dashRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 18,
  },
  dash: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,248,241,0.10)',
  },
  brandCard: {
    width: 148,
    height: 148,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,248,241,0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,248,241,0.26)',
    borderStyle: 'dashed',
    ...theme.shadows.deep,
  },
  logo: {
    width: 96,
    height: 96,
  },
  titleBlock: {
    marginTop: 10,
    alignItems: 'center',
  },
  titleTop: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3.5,
    color: theme.colors.onDark,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 10,
  },
  titleBottom: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 8,
    color: theme.colors.onDarkMuted,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: 'rgba(240,220,211,0.72)',
  },
  barTrack: {
    marginTop: 30,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,248,241,0.16)',
    overflow: 'hidden',
  },
  barFillBox: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    flex: 1,
    borderRadius: 3,
  },
  loading: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(240,220,211,0.55)',
  },
});

export default LoaderScreen;
