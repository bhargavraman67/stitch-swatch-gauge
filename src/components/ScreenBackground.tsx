import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import assets from '../assets';
import theme from '../constants/theme';

export type BgVariant = 'loader' | 'menu' | 'game' | 'result' | 'counter';

type Blob = {
  size: number;
  color: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const WASH: Record<BgVariant, string[]> = {
  loader: theme.gradients.loaderWash,
  menu: theme.gradients.menuWash,
  game: theme.gradients.gameWash,
  result: theme.gradients.resultWash,
  counter: theme.gradients.counterWash,
};

const BLOBS: Record<BgVariant, Blob[]> = {
  loader: [
    {size: 220, color: 'rgba(181,71,107,0.22)', top: -60, left: -40},
    {size: 180, color: 'rgba(91,141,184,0.16)', bottom: 80, right: -30},
    {size: 120, color: 'rgba(240,220,211,0.10)', top: 320, right: 24},
  ],
  menu: [
    {size: 200, color: 'rgba(181,71,107,0.12)', top: 40, left: -50},
    {size: 170, color: 'rgba(91,141,184,0.10)', top: 180, right: -40},
  ],
  game: [
    {size: 200, color: 'rgba(181,71,107,0.08)', top: 70, right: -60},
    {size: 170, color: 'rgba(91,141,184,0.07)', bottom: 120, left: -50},
  ],
  result: [
    {size: 230, color: 'rgba(181,71,107,0.14)', top: -40, right: -60},
    {size: 180, color: 'rgba(217,123,77,0.10)', bottom: 60, left: -50},
  ],
  counter: [
    {size: 240, color: 'rgba(91,141,184,0.16)', top: 60, left: -70},
    {size: 190, color: 'rgba(181,71,107,0.10)', bottom: 40, right: -50},
  ],
};

/**
 * One background component for every screen: the single bg_game image under a
 * per-variant gradient wash plus soft decor blobs (rule 14 keeps Loader != Menu).
 */
function ScreenBackground({
  variant,
  children,
}: {
  variant: BgVariant;
  children?: React.ReactNode;
}) {
  const blobs = BLOBS[variant];

  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={WASH[variant]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {blobs.map((b, i) => (
          <View
            key={`blob-${i}`}
            style={[
              styles.blob,
              {
                width: b.size,
                height: b.size,
                borderRadius: b.size / 2,
                backgroundColor: b.color,
                top: b.top,
                bottom: b.bottom,
                left: b.left,
                right: b.right,
              },
            ]}
          />
        ))}
      </View>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  blob: {
    position: 'absolute',
  },
});

export default React.memo(ScreenBackground);
