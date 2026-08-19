import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';

interface OrganicBackgroundProps {
  style?: ViewStyle;
  variant?: 'default' | 'top' | 'bottom' | 'full';
}

export function OrganicBackground({ style, variant = 'default' }: OrganicBackgroundProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Large organic curve - top right */}
      <View
        style={[
          styles.curve,
          styles.curveTopRight,
          { backgroundColor: theme.organicCurve },
        ]}
      />
      {/* Smaller organic curve - bottom left */}
      <View
        style={[
          styles.curve,
          styles.curveBottomLeft,
          { backgroundColor: theme.secondaryLight },
        ]}
      />
      {/* Accent dot */}
      <View
        style={[
          styles.accentDot,
          { backgroundColor: theme.accent.gold },
        ]}
      />
    </View>
  );
}

interface OrganicCurveProps {
  color?: string;
  size?: number;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  style?: ViewStyle;
}

export function OrganicCurve({
  color,
  size = 200,
  position = 'topRight',
  style,
}: OrganicCurveProps) {
  const { theme } = useTheme();
  const curveColor = color || theme.organicCurve;

  const getPositionStyle = (): ViewStyle => {
    switch (position) {
      case 'topLeft':
        return { top: -size / 2, left: -size / 2 };
      case 'topRight':
        return { top: -size / 2, right: -size / 2 };
      case 'bottomLeft':
        return { bottom: -size / 2, left: -size / 2 };
      case 'bottomRight':
        return { bottom: -size / 2, right: -size / 2 };
    }
  };

  return (
    <View
      style={[
        styles.organicShape,
        {
          width: size,
          height: size,
          backgroundColor: curveColor,
          opacity: 0.3,
        },
        getPositionStyle(),
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  curve: {
    position: 'absolute',
    borderRadius: 999,
  },
  curveTopRight: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    opacity: 0.4,
  },
  curveBottomLeft: {
    width: 200,
    height: 200,
    bottom: -60,
    left: -60,
    opacity: 0.3,
  },
  accentDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: '20%',
    right: '15%',
    opacity: 0.6,
  },
  organicShape: {
    position: 'absolute',
    borderRadius: 999,
  },
});

export default OrganicBackground;
