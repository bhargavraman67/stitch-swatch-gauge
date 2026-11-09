import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {ArrowLeftRight, Flame, Hash, Ruler, Shirt, Sparkles} from 'lucide-react-native';

import assets from '../assets';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {HeaderIconButton} from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StitchedCard from '../components/StitchedCard';
import {StatRow} from '../components/StatCard';
import {PROJECTS} from '../constants/config';
import theme from '../constants/theme';
import {fmt1, fmtPct} from '../utils/format';

const DECOR_DASHES = 11;

type IconCmp = React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;

/** The three-beat explainer that fills the art area (icons already used elsewhere). */
const STEPS: {key: string; Icon: IconCmp; label: string}[] = [
  {key: 'measure', Icon: Ruler, label: 'MEASURE'},
  {key: 'compare', Icon: ArrowLeftRight, label: 'COMPARE'},
  {key: 'count', Icon: Hash, label: 'COUNT'},
];

/** Project Basket - archetype M2: full-bleed art on top, cream sheet below. */
function MenuScreen({
  projectIndex,
  onProject,
  userStPer10,
  patternStPer10,
  diffPct,
  rowsLogged,
  onStart,
  onCounter,
}: {
  projectIndex: number;
  onProject: (i: number) => void;
  userStPer10: number;
  patternStPer10: number;
  diffPct: number;
  rowsLogged: number;
  onStart: () => void;
  onCounter: () => void;
}) {
  const sheetY = useRef(new Animated.Value(60)).current;
  const sheetFade = useRef(new Animated.Value(0)).current;
  const chipsFade = useRef(new Animated.Value(0)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheetY, {
        toValue: 0,
        ...theme.animation.sheet,
        useNativeDriver: true,
      }),
      Animated.timing(sheetFade, {toValue: 1, duration: 280, useNativeDriver: true}),
      Animated.timing(chipsFade, {
        toValue: 1,
        duration: 280,
        delay: 60,
        useNativeDriver: true,
      }),
      Animated.timing(statsFade, {
        toValue: 1,
        duration: 280,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sheetY, sheetFade, chipsFade, statsFade, float]);

  const floatY = float.interpolate({inputRange: [0, 1], outputRange: [0, -8]});
  const chipsRise = chipsFade.interpolate({inputRange: [0, 1], outputRange: [14, 0]});
  const statsRise = statsFade.interpolate({inputRange: [0, 1], outputRange: [14, 0]});

  const stats = useMemo(
    () => [
      {key: 'mine', value: fmt1(userStPer10), label: 'YOUR GAUGE', color: theme.colors.primary},
      {
        key: 'pattern',
        value: fmt1(patternStPer10),
        label: 'PATTERN',
        color: theme.colors.accent,
      },
      {key: 'diff', value: fmtPct(diffPct), label: 'OFF BY', color: theme.colors.warning},
    ],
    [userStPer10, patternStPer10, diffPct],
  );

  const dashes = useMemo(() => Array.from({length: DECOR_DASHES}, (_, i) => i), []);

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="STITCH SWATCH GAUGE"
        subtitle="WASHED - BLOCKED - MEASURED"
        rightSlot={
          <HeaderIconButton Icon={Hash} onPress={onCounter} label="open row counter" />
        }
      />

      <View style={styles.art}>
        <StitchedCard style={styles.heroCard} padded={false}>
          <View style={styles.heroInner}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>SWATCH FIRST</Text>
              <Text style={styles.heroBody}>
                KNIT 10 CM, COUNT THE STITCHES, AND EVERY PATTERN NUMBER IS REDONE FOR YOUR
                HANDS
              </Text>
            </View>
            <Animated.Image
              source={assets.sprite1}
              style={[styles.heroArt, {transform: [{translateY: floatY}]}]}
              resizeMode="contain"
            />
          </View>
        </StitchedCard>

        <View style={styles.steps}>
          {STEPS.map(step => (
            <View key={step.key} style={styles.step}>
              <View style={styles.stepIcon}>
                <step.Icon size={20} color={theme.colors.primaryDark} strokeWidth={2.2} />
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.streak}>
          {rowsLogged > 0 ? (
            <Flame size={16} color={theme.colors.warning} strokeWidth={2.4} />
          ) : (
            <Sparkles size={16} color={theme.colors.accent} strokeWidth={2.4} />
          )}
          <Text style={styles.streakText}>
            {rowsLogged > 0 ? `${rowsLogged} ROWS TODAY` : 'READY TO CAST ON'}
          </Text>
        </View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, {opacity: sheetFade, transform: [{translateY: sheetY}]}]}>
        <View style={styles.handle} />

        <Text style={styles.title}>PROJECT BASKET</Text>
        <Text style={styles.tagline}>YOUR GAUGE, YOUR NUMBERS</Text>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.chipsRow,
            {opacity: chipsFade, transform: [{translateY: chipsRise}]},
          ]}>
          {PROJECTS.map((p, i) => (
            <Chip
              key={p.id}
              label={p.label}
              Icon={Shirt}
              active={i === projectIndex}
              onPress={() => onProject(i)}
            />
          ))}
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.statsWrap,
            {opacity: statsFade, transform: [{translateY: statsRise}]},
          ]}>
          <StatRow items={stats} />
        </Animated.View>

        <Text style={styles.hint}>WASH AND BLOCK THE SWATCH FIRST</Text>

        <PrimaryButton label="START SWATCH" Icon={Ruler} onPress={onStart} />

        <SecondaryButton
          label="ROW COUNTER"
          Icon={Hash}
          onPress={onCounter}
          style={styles.secondary}
        />

        <View style={styles.dashRow} pointerEvents="none">
          {dashes.map(i => (
            <View key={`md-${i}`} style={styles.dash} />
          ))}
        </View>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  art: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  heroCard: {
    alignSelf: 'stretch',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 12,
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: theme.colors.text,
  },
  heroBody: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 16,
    color: theme.colors.textSecondary,
  },
  heroArt: {
    width: 104,
    height: 104,
  },
  steps: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
  },
  step: {
    flex: 1,
    height: 86,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,252,248,0.88)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stepIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
  },
  streak: {
    alignSelf: 'center',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,248,241,0.82)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: 16,
    color: theme.colors.text,
  },
  sheet: {
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderTopWidth: 1.5,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingBottom: 18,
    alignItems: 'center',
    ...theme.shadows.sheet,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    marginTop: 12,
  },
  title: {
    marginTop: 14,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: theme.colors.text,
  },
  tagline: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
  chipsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
  },
  statsWrap: {
    marginTop: 14,
    alignSelf: 'stretch',
  },
  hint: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  secondary: {
    marginTop: 10,
  },
  dashRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 7,
  },
  dash: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(142,51,83,0.10)',
  },
});

export default MenuScreen;
