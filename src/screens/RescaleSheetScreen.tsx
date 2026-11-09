import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Hash, Home, RotateCcw} from 'lucide-react-native';

import assets from '../assets';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, {HeaderIconButton} from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SectionHead from '../components/SectionHead';
import StitchedCard from '../components/StitchedCard';
import {StatRow} from '../components/StatCard';
import theme from '../constants/theme';
import {Rescale, Shaping, YarnEstimate} from '../game/gauge';
import {fmt1, fmtInt} from '../utils/format';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const COUNT_STEPS = 20;
const COUNT_MS = 700;

function easeOutCubic(t: number): number {
  const p = 1 - t;
  return 1 - p * p * p;
}

/** Stagger helper: fade + rise, box-none so wrapped buttons still receive taps. */
function Section({
  delay,
  children,
  style,
}: {
  delay: number;
  children: React.ReactNode;
  style?: any;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);

  const translateY = anim.interpolate({inputRange: [0, 1], outputRange: [16, 0]});

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[style, {opacity: anim, transform: [{translateY}]}]}>
      {children}
    </Animated.View>
  );
}

/** The mandatory result screen (rule 12): Rescale + Shaping + Yarn. */
function RescaleSheetScreen({
  result,
  shaping,
  yarn,
  projectLabel,
  onAgain,
  onCounter,
  onMenu,
}: {
  result: Rescale;
  shaping: Shaping;
  yarn: YarnEstimate;
  projectLabel: string;
  onAgain: () => void;
  onCounter: () => void;
  onMenu: () => void;
}) {
  const [shown, setShown] = useState(0);
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const target = result.newCastOn;

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      ...theme.animation.enter,
      useNativeDriver: true,
    }).start();
  }, [cardScale]);

  useEffect(() => {
    let step = 0;
    setShown(0);
    const id = setInterval(() => {
      step += 1;
      const t = step / COUNT_STEPS;
      if (step >= COUNT_STEPS) {
        setShown(target);
        clearInterval(id);
        return;
      }
      setShown(Math.round(target * easeOutCubic(t)));
    }, COUNT_MS / COUNT_STEPS);
    return () => clearInterval(id);
  }, [target]);

  const yarnStats = useMemo(
    () => [
      {key: 'skeins', value: fmtInt(yarn.skeins), label: 'SKEINS', color: theme.colors.primary},
      {key: 'yards', value: fmtInt(yarn.yards), label: 'YARDS', color: theme.colors.accent},
      {key: 'grams', value: fmtInt(yarn.grams), label: 'GRAMS', color: theme.colors.success},
    ],
    [yarn.skeins, yarn.yards, yarn.grams],
  );

  const pills = useMemo(
    () => [
      {key: 'k', text: `K ${shaping.base}`},
      {key: 'inc', text: 'INC 1'},
      {key: 'x', text: `x ${shaping.repeats}`},
    ],
    [shaping.base, shaping.repeats],
  );

  return (
    <ScreenBackground variant="result">
      <ScreenHeader
        title="RESCALE SHEET"
        subtitle={projectLabel}
        leftSlot={<HeaderIconButton Icon={Home} onPress={onMenu} label="back to basket" />}
      />

      <View style={styles.body}>
        <Section delay={0}>
          <Animated.View style={{transform: [{scale: cardScale}]}} pointerEvents="box-none">
            <StitchedCard style={styles.hero} padded={false}>
              <View style={styles.heroInner}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroNumber}>{shown}</Text>
                  <Text style={styles.heroLabel}>CAST ON STITCHES</Text>
                </View>
                <View style={styles.heroTable}>
                  <Text style={styles.heroRow}>{`WIDTH ${fmt1(result.targetWidthCm)} CM`}</Text>
                  <Text style={styles.heroRow}>{`ROWS ${fmtInt(result.newRows)}`}</Text>
                  <Text style={styles.heroRow}>
                    {`LENGTH ${fmtInt(result.targetLengthCm)} CM`}
                  </Text>
                </View>
              </View>
              <Image source={assets.sprite2} style={styles.heroSprite} resizeMode="contain" />
            </StitchedCard>
          </Animated.View>
        </Section>

        <Section delay={90} style={styles.block}>
          <SectionHead title="SHAPING SPACER" />
          <View style={styles.pillRow}>
            {pills.map(p => (
              <View key={p.key} style={styles.pill}>
                <Text style={styles.pillText}>{p.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.instruction}>{shaping.text}</Text>
        </Section>

        <Section delay={180} style={styles.block}>
          <SectionHead title="YARN ESTIMATOR" sprite={assets.sprite5} />
          <StatRow items={yarnStats} style={styles.yarnRow} />
        </Section>
      </View>

      <Section delay={260} style={styles.ctaBlock}>
        <PrimaryButton label="MEASURE AGAIN" Icon={RotateCcw} onPress={onAgain} />
        <SecondaryButton
          label="OPEN ROW COUNTER"
          Icon={Hash}
          onPress={onCounter}
          style={styles.secondary}
        />
        <Pressable
          style={styles.tertiary}
          hitSlop={HIT}
          onPress={onMenu}
          accessibilityRole="button"
          accessibilityLabel="back to basket">
          <Text style={styles.tertiaryText}>BACK TO BASKET</Text>
        </Pressable>
      </Section>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    justifyContent: 'flex-start',
  },
  hero: {
    minHeight: 132,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 18,
    paddingRight: 96,
  },
  heroLeft: {
    minWidth: 110,
  },
  heroNumber: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '900',
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  heroLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textSecondary,
  },
  heroTable: {
    marginLeft: 14,
    gap: 6,
  },
  heroRow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text,
  },
  heroSprite: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 72,
    height: 72,
  },
  block: {
    marginTop: 16,
  },
  pillRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text,
  },
  instruction: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    color: theme.colors.text,
  },
  yarnRow: {
    marginTop: 10,
  },
  ctaBlock: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 10,
  },
  secondary: {
    marginTop: 10,
  },
  tertiary: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  tertiaryText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
});

export default RescaleSheetScreen;
