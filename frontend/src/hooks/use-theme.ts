// Re-export theme hooks for convenience
export { useTheme, useThemedStyles } from '../utils/theme-context';

// Helper to create themed styles with proper typing
import { Theme } from '../constants/theme';
import { StyleSheet } from 'react-native';

type ThemedStyles<T> = T extends Record<string, any>
  ? { [K in keyof T]: T[K] }
  : never;

// Utility to create a stylesheet with theme colors
export function createThemedStyleSheet<T extends Record<string, any>>(
  styleCreator: (theme: Theme) => T
): (theme: Theme) => ThemedStyles<T> {
  return (theme: Theme) => {
    const styles = styleCreator(theme);
    return StyleSheet.create(styles) as ThemedStyles<T>;
  };
}
