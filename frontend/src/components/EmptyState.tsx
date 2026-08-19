import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { PhoneIllustration } from './PhoneIllustration';
import { BotanicalDecoration } from './BotanicalDecoration';
import { SparkleDecoration } from './SparkleDecoration';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: 'phone' | 'star' | 'bookmark' | 'chat' | 'options';
  style?: ViewStyle;
  showDecorations?: boolean;
}

export function EmptyState({
  title,
  subtitle,
  icon = 'phone',
  style,
  showDecorations = true,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Decorative botanical elements */}
      {showDecorations && (
        <>
          <BotanicalDecoration
            size={40}
            color={theme.botanicalSilhouette}
            variant="leaves"
            style={styles.botanicalLeft}
          />
          <BotanicalDecoration
            size={40}
            color={theme.botanicalSilhouette}
            variant="berries"
            style={styles.botanicalRight}
          />
        </>
      )}

      {/* Center illustration */}
      <View style={styles.illustrationContainer}>
        {icon === 'phone' && (
          <PhoneIllustration size={100} showBubbles={true} />
        )}
        {icon === 'star' && (
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
            <Text style={[styles.iconText, { color: theme.primary }]}>⭐</Text>
          </View>
        )}
        {icon === 'bookmark' && (
          <View style={[styles.iconCircle, { backgroundColor: theme.secondaryMuted }]}>
            <Text style={[styles.iconText, { color: theme.secondary }]}>🔖</Text>
          </View>
        )}
        {icon === 'chat' && (
          <View style={[styles.iconCircle, { backgroundColor: theme.accent.teal + '20' }]}>
            <Text style={[styles.iconText, { color: theme.accent.teal }]}>💬</Text>
          </View>
        )}
        {icon === 'options' && (
          <View style={[styles.iconCircle, { backgroundColor: theme.accent.purple + '20' }]}>
            <Text style={[styles.iconText, { color: theme.accent.purple }]}>✨</Text>
          </View>
        )}

        {/* Sparkles */}
        {showDecorations && (
          <SparkleDecoration
            count={3}
            size={8}
            color={theme.accent.gold}
            style={styles.sparkles}
          />
        )}
      </View>

      {/* Text content */}
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    position: 'relative',
  },
  botanicalLeft: {
    position: 'absolute',
    left: 20,
    top: 30,
    opacity: 0.6,
  },
  botanicalRight: {
    position: 'absolute',
    right: 20,
    top: 40,
    opacity: 0.6,
    transform: [{ scaleX: -1 }],
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  sparkles: {
    position: 'absolute',
    top: -20,
    right: -30,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

export default EmptyState;
