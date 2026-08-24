import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';

interface SparkleProps {
  size?: number;
  color?: string;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
}

function Sparkle({ size = 12, color, delay = 0, style }: SparkleProps) {
  const { theme } = useTheme();
  const sparkleColor = color || theme.sparkle;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity, scale, delay]);

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          width: size,
          height: size,
          opacity,
          transform: [{ scale }],
        },
        style,
      ]}
    >
      {/* Four-pointed star using views */}
      <View style={[styles.starVertical, { backgroundColor: sparkleColor }]} />
      <View style={[styles.starHorizontal, { backgroundColor: sparkleColor }]} />
      <View style={[styles.starCenter, { backgroundColor: sparkleColor }]} />
    </Animated.View>
  );
}

interface SparkleDecorationProps {
  count?: number;
  size?: number;
  color?: string;
  style?: ViewStyle | ViewStyle[];
}

export function SparkleDecoration({
  count = 3,
  size = 12,
  color,
  style,
}: SparkleDecorationProps) {
  const sparkles = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={[styles.container, style]}>
      {sparkles.map((index) => (
        <Sparkle
          key={index}
          size={size}
          color={color}
          delay={index * 400}
          style={{
            position: 'absolute',
            top: `${20 + (index * 30) % 60}%`,
            left: `${10 + (index * 35) % 80}%`,
          }}
        />
      ))}
    </View>
  );
}

// Simple static sparkle (no animation)
interface StaticSparkleProps {
  size?: number;
  color?: string;
  style?: ViewStyle | ViewStyle[];
}

export function StaticSparkle({ size = 12, color, style }: StaticSparkleProps) {
  const { theme } = useTheme();
  const sparkleColor = color || theme.sparkle;

  return (
    <View
      style={[
        styles.sparkle,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <View style={[styles.starVertical, { backgroundColor: sparkleColor }]} />
      <View style={[styles.starHorizontal, { backgroundColor: sparkleColor }]} />
      <View style={[styles.starCenter, { backgroundColor: sparkleColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
  },
  sparkle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starVertical: {
    position: 'absolute',
    width: 2,
    height: '70%',
    borderRadius: 1,
  },
  starHorizontal: {
    position: 'absolute',
    width: '70%',
    height: 2,
    borderRadius: 1,
  },
  starCenter: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default SparkleDecoration;
