import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';

interface RainbowStripeProps {
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
  rounded?: boolean;
}

export function RainbowStripe({
  height = 4,
  style,
  rounded = true,
}: RainbowStripeProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { height },
        rounded && styles.rounded,
        style,
      ]}
    >
      {theme.rainbow.map((color, index) => (
        <View
          key={index}
          style={[
            styles.stripe,
            {
              backgroundColor: color,
              flex: 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

interface GradientStripeProps {
  colors?: string[];
  height?: number;
  style?: ViewStyle;
}

export function GradientStripe({ colors, height = 4, style }: GradientStripeProps) {
  const { theme } = useTheme();
  const stripeColors = colors || theme.rainbow;

  return (
    <View
      style={[
        styles.container,
        { height },
        style,
      ]}
    >
      {stripeColors.map((color, index) => (
        <View
          key={index}
          style={[
            styles.stripe,
            {
              backgroundColor: color,
              flex: 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 2,
  },
  stripe: {
    height: '100%',
  },
});

export default RainbowStripe;
