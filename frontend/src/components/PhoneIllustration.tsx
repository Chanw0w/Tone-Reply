import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';

interface PhoneIllustrationProps {
  size?: number;
  style?: ViewStyle;
  showBubbles?: boolean;
  variant?: 'default' | 'compact' | 'large';
}

export function PhoneIllustration({
  size = 180,
  style,
  showBubbles = true,
  variant = 'default',
}: PhoneIllustrationProps) {
  const { theme } = useTheme();

  const phoneWidth = size;
  const phoneHeight = size * 1.6;
  const bezelWidth = phoneWidth * 0.06;
  const screenWidth = phoneWidth - bezelWidth * 2;
  const screenHeight = phoneHeight - bezelWidth * 2.5;

  return (
    <View style={[styles.container, { width: phoneWidth, height: phoneHeight }, style]}>
      {/* Phone outer shell */}
      <View
        style={[
          styles.phoneShell,
          {
            width: phoneWidth,
            height: phoneHeight,
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        {/* Screen area */}
        <View
          style={[
            styles.screen,
            {
              width: screenWidth,
              height: screenHeight,
              backgroundColor: theme.background,
            },
          ]}
        >
          {showBubbles && (
            <View style={styles.bubblesContainer}>
              {/* Incoming message bubble */}
              <View
                style={[
                  styles.bubble,
                  styles.incomingBubble,
                  {
                    backgroundColor: theme.secondaryLight,
                    alignSelf: 'flex-start',
                  },
                ]}
              >
                <View style={[styles.bubbleLine, { backgroundColor: theme.textMuted }]} />
                <View style={[styles.bubbleLine, styles.bubbleLineShort, { backgroundColor: theme.textMuted }]} />
              </View>

              {/* Outgoing message bubble */}
              <View
                style={[
                  styles.bubble,
                  styles.outgoingBubble,
                  {
                    backgroundColor: theme.primary,
                    alignSelf: 'flex-end',
                  },
                ]}
              >
                <View style={[styles.bubbleLine, { backgroundColor: theme.textInverse }]} />
                <View style={[styles.bubbleLine, styles.bubbleLineShort, { backgroundColor: theme.textInverse }]} />
              </View>

              {/* Another incoming */}
              <View
                style={[
                  styles.bubble,
                  styles.incomingBubble,
                  {
                    backgroundColor: theme.secondaryLight,
                    alignSelf: 'flex-start',
                  },
                ]}
              >
                <View style={[styles.bubbleLine, styles.bubbleLineMedium, { backgroundColor: theme.textMuted }]} />
              </View>

              {/* Sparkle indicator */}
              <View style={styles.sparkleIndicator}>
                <View style={[styles.sparkle, { backgroundColor: theme.accent.gold }]} />
              </View>
            </View>
          )}
        </View>

        {/* Home button / notch indicator */}
        <View style={styles.homeButtonContainer}>
          <View
            style={[
              styles.homeButton,
              { backgroundColor: theme.border },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

interface PhoneIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function PhoneIcon({ size = 24, color, style }: PhoneIconProps) {
  const { theme } = useTheme();
  const iconColor = color || theme.textPrimary;

  return (
    <View style={[styles.iconContainer, { width: size, height: size * 1.6 }, style]}>
      <View
        style={[
          styles.iconPhone,
          {
            width: size,
            height: size * 1.6,
            borderColor: iconColor,
          },
        ]}
      >
        <View style={[styles.iconScreen, { backgroundColor: iconColor }]} />
        <View style={[styles.iconHomeButton, { backgroundColor: iconColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneShell: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  screen: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  bubblesContainer: {
    gap: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  incomingBubble: {
    borderTopLeftRadius: 4,
  },
  outgoingBubble: {
    borderTopRightRadius: 4,
  },
  bubbleLine: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
    width: '100%',
  },
  bubbleLineShort: {
    width: '60%',
    marginBottom: 0,
  },
  bubbleLineMedium: {
    width: '80%',
  },
  sparkleIndicator: {
    alignItems: 'center',
    marginTop: 4,
  },
  sparkle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  homeButtonContainer: {
    position: 'absolute',
    bottom: 6,
    alignItems: 'center',
  },
  homeButton: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconPhone: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  iconScreen: {
    width: '70%',
    height: '60%',
    borderRadius: 1,
    opacity: 0.3,
  },
  iconHomeButton: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.5,
  },
});

export default PhoneIllustration;
