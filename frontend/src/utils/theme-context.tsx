import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
  themeMode: 'system',
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(defaultMode);
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Update isDark when theme mode or system color scheme changes
  useEffect(() => {
    switch (themeMode) {
      case 'light':
        setIsDark(false);
        break;
      case 'dark':
        setIsDark(true);
        break;
      case 'system':
      default:
        setIsDark(colorScheme === 'dark');
        break;
    }
  }, [themeMode, colorScheme]);

  // Listen for system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (themeMode === 'system') {
        setIsDark(newColorScheme === 'dark');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      // If system, toggle to opposite of current
      return isDark ? 'light' : 'dark';
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme in any component
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to get themed styles
export function useThemedStyles<T>(createStyles: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return createStyles(theme);
}

export default ThemeContext;
