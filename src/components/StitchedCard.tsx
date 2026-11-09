import React from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';

import theme from '../constants/theme';

/**
 * The signature surface of the app: cream card with a dashed "stitched" edge,
 * 24 px corners and a soft rose shadow. Reused on every screen.
 */
function StitchedCard({
  children,
  style,
  padded = true,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return (
    <View style={[styles.card, padded ? styles.padded : null, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  padded: {
    padding: 14,
  },
});

export default React.memo(StitchedCard);
