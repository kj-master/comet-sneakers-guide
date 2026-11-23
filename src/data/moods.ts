export type MoodKey = 'xl-cortado' | 'xl-chestnut' | 'xl-snow' | 'aeon-sourbomb';

export interface MoodTheme {
  id: MoodKey;
  bg: string;
  surface: string;
  ink: string;
  mutedInk: string;
  accent: string;
  accentInk: string;
  pop: string;
  popInk: string;
  border: string;
  isDark: boolean;
}

/**
 * Complementary design palettes only (WCAG AA verified >= 4.5:1 text contrast).
 * Never describe these palette values as the shoe's colour in text.
 */
export const MOODS: Record<MoodKey, MoodTheme> = {
  'xl-cortado': {
    id: 'xl-cortado',
    bg: '#F4EADB',
    surface: '#FFFFFF',
    ink: '#2B1D14',
    mutedInk: '#543D2F',
    accent: '#0A6E66', // WCAG AA teal (6.25:1 with #FFFFFF)
    accentInk: '#FFFFFF',
    pop: '#FF8A5B', // 6.9:1 with #2B1D14
    popInk: '#2B1D14',
    border: '#2B1D14',
    isDark: false,
  },
  'xl-chestnut': {
    id: 'xl-chestnut',
    bg: '#E9D2B8',
    surface: '#FFFBF5',
    ink: '#2A1A10',
    mutedInk: '#4A3325',
    accent: '#B8412A', // WCAG AA rust (6.2:1 with #FFFFFF)
    accentInk: '#FFFFFF',
    pop: '#2F6DF6', // 4.66:1 with #FFFFFF
    popInk: '#FFFFFF',
    border: '#2A1A10',
    isDark: false,
  },
  'xl-snow': {
    id: 'xl-snow',
    bg: '#DCE7F5',
    surface: '#FFFFFF',
    ink: '#14213D',
    mutedInk: '#2A3B5E',
    accent: '#FF6B6B', // 5.4:1 with #14213D
    accentInk: '#14213D',
    pop: '#FFD166', // 10.8:1 with #14213D
    popInk: '#14213D',
    border: '#14213D',
    isDark: false,
  },
  'aeon-sourbomb': {
    id: 'aeon-sourbomb',
    bg: '#14161A',
    surface: '#1D2026',
    ink: '#F4FFE0',
    mutedInk: '#C9D4BA',
    accent: '#C6FF3D', // 15.2:1 with #14161A
    accentInk: '#14161A',
    pop: '#A78BFA', // 6.77:1 with #14161A
    popInk: '#14161A',
    border: '#F4FFE0',
    isDark: true,
  },
};

export const HERO_MOOD_ORDER: MoodKey[] = [
  'xl-cortado',
  'xl-chestnut',
  'xl-snow',
  'aeon-sourbomb',
];
