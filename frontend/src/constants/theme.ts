// Tone Reply Design Theme
// Inspired by Rosehip Morning Society retro-modern aesthetic

// Light Mode Colors (Image 1 + 2 inspired)
export const lightTheme = {
  // Backgrounds
  background: '#FDF6EC',        // Cream - warm, inviting
  surface: '#FFFFFF',            // White cards
  surfaceAlt: '#FAF8F5',        // Off-white inputs
  surfaceElevated: '#FFFFFF',   // Elevated cards

  // Primary Palette - Forest Green
  primary: '#3D6B4F',           // Forest Green - main actions
  primaryLight: '#5A8A6A',      // Lighter green
  primaryDark: '#2D5040',       // Darker green
  primaryMuted: '#E8F0EB',     // Muted green for backgrounds

  // Secondary Palette - Blush Pink
  secondary: '#E8C4B8',         // Blush Pink
  secondaryLight: '#F2DDD4',    // Lighter pink
  secondaryDark: '#D4A698',     // Darker pink
  secondaryMuted: '#FBF0EB',   // Muted pink for backgrounds

  // Accent Colors - Rainbow from Image 2
  accent: {
    teal: '#4A9BA8',            // Interactive elements
    orange: '#D4845A',          // Highlights, badges
    gold: '#C9A84C',            // Success, stars
    purple: '#7B6B8D',          // Secondary accents
    pink: '#E87898',            // Playful accents
    yellow: '#E8A840',          // Warning, attention
  },

  // Rainbow Stripe Colors
  rainbow: ['#7B6B8D', '#E87898', '#D4845A', '#E8A840', '#4A9BA8'],

  // Text Colors
  textPrimary: '#8B2D2D',       // Burgundy - headers, important text
  textSecondary: '#6B5E57',     // Warm Gray - body text
  textMuted: '#9B8E87',         // Light warm gray - placeholders
  textInverse: '#FFFFFF',       // White text on dark backgrounds
  textLink: '#4A9BA8',          // Teal - links, interactive

  // Borders & Dividers
  border: '#E8E4DC',            // Light Sage
  borderLight: '#F0ECE4',      // Lighter sage
  borderFocus: '#4A9BA8',       // Teal - focus states
  divider: '#E8E4DC',

  // Status Colors - Warm tones
  error: '#C44B4B',             // Warm Red
  errorBackground: '#FDE8E8',
  errorBorder: '#F5D0D0',
  success: '#C9A84C',           // Gold
  successBackground: '#FDF6E3',
  warning: '#D4845A',           // Orange
  warningBackground: '#FDF0E6',
  info: '#4A9BA8',              // Teal
  infoBackground: '#E8F4F6',

  // Input States
  inputBackground: '#FAF8F5',
  inputBorder: '#E8E4DC',
  inputBorderFocus: '#4A9BA8',
  inputPlaceholder: '#9B8E87',

  // Button States
  buttonPrimary: '#3D6B4F',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#E8C4B8',
  buttonSecondaryText: '#8B2D2D',
  buttonDisabled: '#D4CFC8',
  buttonTextDisabled: '#FFFFFF',

  // Shadows - Warm brown tones
  shadow: '#8B6F5E',
  shadowLight: 'rgba(139, 111, 94, 0.08)',
  shadowMedium: 'rgba(139, 111, 94, 0.12)',

  // Special Elements
  headerBackground: '#FFFFFF',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E8E4DC',
  tabBarActive: '#3D6B4F',
  tabBarInactive: '#6B5E57',

  // Decorative
  sparkle: '#C9A84C',           // Gold sparkles
  organicCurve: '#E8C4B8',      // Pink organic shapes
  botanicalSilhouette: '#3D6B4F', // Green botanicals
}

// Dark Mode Colors (Image 3 inspired - teal/black)
export const darkTheme = {
  // Backgrounds
  background: '#1A2E35',        // Deep teal
  surface: '#243B42',           // Lighter teal
  surfaceAlt: '#1E3339',        // Slightly lighter
  surfaceElevated: '#2A4550',   // Elevated cards

  // Primary Palette
  primary: '#4A9BA8',           // Teal - main actions
  primaryLight: '#6BB5C0',      // Lighter teal
  primaryDark: '#3A8090',       // Darker teal
  primaryMuted: '#1E3339',     // Muted teal for backgrounds

  // Secondary Palette
  secondary: '#7B6B8D',         // Purple
  secondaryLight: '#9585A5',    // Lighter purple
  secondaryDark: '#625575',     // Darker purple
  secondaryMuted: '#2A2530',   // Muted purple for backgrounds

  // Accent Colors - Rainbow (same for both modes)
  accent: {
    teal: '#4A9BA8',
    orange: '#D4845A',
    gold: '#C9A84C',
    purple: '#7B6B8D',
    pink: '#E87898',
    yellow: '#E8A840',
  },

  // Rainbow Stripe Colors
  rainbow: ['#7B6B8D', '#E87898', '#D4845A', '#E8A840', '#4A9BA8'],

  // Text Colors
  textPrimary: '#F5F0E6',       // Cream - headers, important text
  textSecondary: '#A8B8BE',     // Light teal-gray - body text
  textMuted: '#6B8088',         // Muted teal - placeholders
  textInverse: '#1A2E35',       // Dark text on light backgrounds
  textLink: '#6BB5C0',          // Light teal - links

  // Borders & Dividers
  border: '#3A5560',            // Medium teal
  borderLight: '#2E4850',      // Lighter teal
  borderFocus: '#6BB5C0',       // Light teal - focus states
  divider: '#3A5560',

  // Status Colors
  error: '#E86B6B',             // Lighter red for dark mode
  errorBackground: '#3D2828',
  errorBorder: '#5A3838',
  success: '#C9A84C',
  successBackground: '#2D2A1E',
  warning: '#D4845A',
  warningBackground: '#2D2520',
  info: '#6BB5C0',
  infoBackground: '#1E3339',

  // Input States
  inputBackground: '#1E3339',
  inputBorder: '#3A5560',
  inputBorderFocus: '#6BB5C0',
  inputPlaceholder: '#6B8088',

  // Button States
  buttonPrimary: '#4A9BA8',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#7B6B8D',
  buttonSecondaryText: '#F5F0E6',
  buttonDisabled: '#2E4850',
  buttonTextDisabled: '#6B8088',

  // Shadows - Dark mode shadows
  shadow: '#0D1A1F',
  shadowLight: 'rgba(13, 26, 31, 0.3)',
  shadowMedium: 'rgba(13, 26, 31, 0.5)',

  // Special Elements
  headerBackground: '#243B42',
  tabBarBackground: '#243B42',
  tabBarBorder: '#3A5560',
  tabBarActive: '#6BB5C0',
  tabBarInactive: '#6B8088',

  // Decorative
  sparkle: '#C9A84C',           // Gold sparkles (same)
  organicCurve: '#7B6B8D',      // Purple organic shapes
  botanicalSilhouette: '#4A9BA8', // Teal botanicals
}

// Typography Configuration
export const typography = {
  // Font families
  fonts: {
    serif: {
      regular: 'PlayfairDisplay_400Regular',
      bold: 'PlayfairDisplay_700Bold',
      black: 'PlayfairDisplay_900Black',
    },
    sans: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System',
    },
  },

  // Font family strings for StyleSheet
  fontFamily: {
    serifRegular: 'PlayfairDisplay_400Regular',
    serifBold: 'PlayfairDisplay_700Bold',
    serifBlack: 'PlayfairDisplay_900Black',
    sansRegular: undefined, // System font
    sansBold: undefined, // System font
  },

  // Font sizes
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 34,
  },

  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -1,
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.1,
    widest: 2,
  },
}

// Spacing Scale
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
}

// Border Radius Scale
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
  xxl: 24,
  xxxl: 28,
  full: 9999,
}

// Shadow Presets
export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
}

// Opacity Values
export const opacity = {
  disabled: 0.5,
  muted: 0.7,
  active: 1,
}

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
}

// Export theme type
export type Theme = typeof lightTheme
export type ThemeMode = 'light' | 'dark'
