// Base Colors that remain the same in both Light and Dark mode
export const COLORS = {
  primary: '#00c2e8',
  primaryHover: '#00b0d4',
  primaryLight: 'rgba(0, 194, 232, 0.1)',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  transparent: 'transparent',
};

// Light Theme Colors
export const lightTheme = {
  ...COLORS,
  background: '#f9fafb', // --light
  surface: '#ffffff', // --white
  text: '#1f2937', // --dark
  textSecondary: '#4b5563', // --dark-light
  border: '#e5e7eb', // --gray-200
  borderLight: '#f3f4f6', // --gray-100
  card: '#ffffff',
  navbarBg: '#ffffff',
};

// Dark Theme Colors
export const darkTheme = {
  ...COLORS,
  background: '#0f172a', // body.dark-mode --light
  surface: '#1e293b', // body.dark-mode --white
  text: '#f8fafc', // body.dark-mode --dark
  textSecondary: '#94a3b8', // body.dark-mode --dark-light
  border: '#334155', // body.dark-mode --gray-200
  borderLight: '#0f172a', // body.dark-mode --gray-100
  card: '#1e293b',
  navbarBg: 'rgba(30, 41, 59, 0.85)',
};

// Global Spacing & Sizes
export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  radius: 12, // --radius
};

// Global Typography
export const FONTS = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 18, fontWeight: 'bold' },
  body1: { fontSize: 16, fontWeight: 'normal' },
  body2: { fontSize: 14, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: 'normal' },
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
};
