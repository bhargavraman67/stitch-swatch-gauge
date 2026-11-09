import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

/** 12 px uppercase heading with a hairline rule, optional small sprite marker. */
function SectionHead({
  title,
  sprite,
  tint = theme.colors.primaryDark,
}: {
  title: string;
  sprite?: ImageSourcePropType;
  tint?: string;
}) {
  return (
    <View style={styles.wrap}>
      {sprite ? <Image source={sprite} style={styles.sprite} resizeMode="contain" /> : null}
      <Text style={[styles.title, {color: tint}]}>{title}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sprite: {
    width: 26,
    height: 26,
  },
  title: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
});

export default React.memo(SectionHead);
