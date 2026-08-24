// Tone Reply Design Theme
// Matches Figma RedesignAppFrontend design tokens

// Light Mode Colors (Figma theme.css)
export const lightTheme = {
  // Backgrounds
  background: '#FDF6EC',        // Warm cream - Figma --background
  surface: '#FFFFFF',            // White cards - Figma --card
  surfaceAlt: '#EDE8E0',        // Warm light gray - Figma --muted
  surfaceElevated: '#FFFFFF',   // Elevated cards

  // Primary Palette - Forest Green
  primary: '#3D6B4F',           // Forest Green - Figma --primary
  primaryLight: '#5A8A6A',      // Lighter green
  primaryDark: '#2D5040',       // Darker green
  primaryMuted: '#E8F0EB',     // Muted green for backgrounds

  // Secondary Palette - Blush Pink
  secondary: '#E8C4B8',         // Blush Pink - Figma --secondary
  secondaryLight: '#F2DDD4',    // Lighter pink
  secondaryDark: '#D4A698',     // Darker pink
  secondaryMuted: '#FBF0EB',   // Muted pink for backgrounds

  // Accent Colors - Rainbow
  accent: {
    teal: '#4A9BA8',            // Interactive elements
    orange: '#D4845A',          // Highlights, badges
    gold: '#C9A84C',            // Success, stars - Figma --accent
    purple: '#7B6B8D',          // Secondary accents
    pink: '#E87898',            // Playful accents
    yellow: '#E8A840',          // Warning, attention
  },

  // Rainbow Stripe Colors
  rainbow: ['#7B6B8D', '#E87898', '#D4845A', '#E8A840', '#4A9BA8'],

  // Text Colors (Figma)
  textPrimary: '#1A1A1A',       // Near-black - Figma --foreground
  textSecondary: '#6B7280',     // Gray - Figma --muted-foreground
  textMuted: '#9CA3AF',         // Light gray - placeholders
  textInverse: '#FDF6EC',       // Cream text on dark backgrounds
  textLink: '#4A9BA8',          // Teal - links, interactive

  // Borders & Dividers (Figma)
  border: 'rgba(26, 26, 26, 0.12)', // Figma --border
  borderLight: 'rgba(26, 26, 26, 0.06)',
  borderFocus: '#3D6B4F',       // Green - focus states - Figma --ring
  divider: 'rgba(26, 26, 26, 0.12)',

  // Status Colors
  error: '#d4183d',             // Figma --destructive
  errorBackground: '#FDE8E8',
  errorBorder: '#F5D0D0',
  success: '#C9A84C',           // Gold
  successBackground: '#FDF6E3',
  warning: '#D4845A',           // Orange
  warningBackground: '#FDF0E6',
  info: '#4A9BA8',              // Teal
  infoBackground: '#E8F4F6',

  // Input States (Figma)
  inputBackground: '#EDE8E0',   // Figma --input-background
  inputBorder: 'rgba(26, 26, 26, 0.12)',
  inputBorderFocus: '#3D6B4F',
  inputPlaceholder: '#9CA3AF',

  // Button States
  buttonPrimary: '#3D6B4F',
  buttonPrimaryText: '#FDF6EC', // Figma --primary-foreground
  buttonSecondary: '#E8C4B8',
  buttonSecondaryText: '#1A1A1A',
  buttonDisabled: '#D4CFC8',
  buttonTextDisabled: '#FFFFFF',

  // Shadows - Warm brown tones
  shadow: '#8B6F5E',
  shadowLight: 'rgba(139, 111, 94, 0.08)',
  shadowMedium: 'rgba(139, 111, 94, 0.12)',

  // Special Elements
  headerBackground: '#FDF6EC',
  tabBarBackground: '#FDF6EC',
  tabBarBorder: 'rgba(26, 26, 26, 0.12)',
  tabBarActive: '#3D6B4F',
  tabBarInactive: '#6B7280',

  // Decorative
  sparkle: '#C9A84C',           // Gold sparkles
  organicCurve: '#E8C4B8',      // Pink organic shapes
  botanicalSilhouette: '#3D6B4F', // Green botanicals
}

// Dark Mode Colors (Figma theme.css .dark)
export const darkTheme = {
  // Backgrounds (Figma)
  background: '#0A0F0C',        // Dark green-black - Figma --background
  surface: '#111827',            // Dark card - Figma --card
  surfaceAlt: '#1A2E35',        // Dark teal - Figma --muted
  surfaceElevated: '#1F2937',   // Elevated cards

  // Primary Palette (Figma)
  primary: '#4A9BA8',           // Teal - Figma --primary
  primaryLight: '#6BB5C0',      // Lighter teal
  primaryDark: '#3A8090',       // Darker teal
  primaryMuted: '#1A2E35',     // Muted teal for backgrounds

  // Secondary Palette (Figma)
  secondary: '#1A2E35',         // Dark teal - Figma --secondary
  secondaryLight: '#243B42',    // Lighter teal
  secondaryDark: '#0F1F25',     // Darker teal
  secondaryMuted: '#0F1F25',   // Muted for backgrounds

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

  // Text Colors (Figma)
  textPrimary: '#F5F0E6',       // Warm off-white - Figma --foreground
  textSecondary: '#9CA3AF',     // Gray - Figma --muted-foreground
  textMuted: '#6B7280',         // Muted gray - placeholders
  textInverse: '#0A0F0C',       // Dark text on light backgrounds
  textLink: '#6BB5C0',          // Light teal - links

  // Borders & Dividers (Figma)
  border: 'rgba(245, 240, 230, 0.12)', // Figma --border
  borderLight: 'rgba(245, 240, 230, 0.06)',
  borderFocus: '#4A9BA8',       // Teal - focus states - Figma --ring
  divider: 'rgba(245, 240, 230, 0.12)',

  // Status Colors
  error: '#E86B6B',             // Lighter red for dark mode
  errorBackground: '#3D2828',
  errorBorder: '#5A3838',
  success: '#C9A84C',
  successBackground: '#2D2A1E',
  warning: '#D4845A',
  warningBackground: '#2D2520',
  info: '#6BB5C0',
  infoBackground: '#1A2E35',

  // Input States (Figma)
  inputBackground: '#1A2E35',   // Figma --input
  inputBorder: 'rgba(245, 240, 230, 0.12)',
  inputBorderFocus: '#4A9BA8',
  inputPlaceholder: '#6B7280',

  // Button States
  buttonPrimary: '#4A9BA8',
  buttonPrimaryText: '#0A0F0C', // Figma --primary-foreground
  buttonSecondary: '#1A2E35',
  buttonSecondaryText: '#F5F0E6',
  buttonDisabled: '#2E4850',
  buttonTextDisabled: '#6B7280',

  // Shadows - Dark mode shadows
  shadow: '#0D1A1F',
  shadowLight: 'rgba(13, 26, 31, 0.3)',
  shadowMedium: 'rgba(13, 26, 31, 0.5)',

  // Special Elements
  headerBackground: '#0A0F0C',
  tabBarBackground: '#111827',
  tabBarBorder: 'rgba(245, 240, 230, 0.12)',
  tabBarActive: '#6BB5C0',
  tabBarInactive: '#6B7280',

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
      regular: 'Poppins_400Regular',
      bold: 'Poppins_700Bold',
      black: 'Poppins_900Black',
    },
    sans: {
      regular: 'DMSans_400Regular',
      medium: 'DMSans_500Medium',
      semibold: 'DMSans_600SemiBold',
      bold: 'DMSans_700Bold',
    },
  },

  // Font family strings for StyleSheet
  fontFamily: {
    serifRegular: 'Poppins_400Regular',
    serifBold: 'Poppins_700Bold',
    serifBlack: 'Poppins_900Black',
    sansRegular: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    sansSemibold: 'DMSans_600SemiBold',
    sansBold: 'DMSans_700Bold',
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
