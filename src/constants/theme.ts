/**
 * WARM_EARTHY preset with the brief's rose-madder / denim-blue accent overrides.
 * The `name` field stays exactly as in design-system/preset.ts.
 */

export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: '#FFF8F1',
    bgAlt: '#F8EDE2',
    surface: '#FFFCF8',
    surfaceAlt: '#F0DCD3',
    surfaceActive: '#FBE6EC',
    border: '#E3CBBE',
    divider: '#F0DCD3',

    primary: '#B5476B',
    primaryDark: '#8E3353',
    primaryLight: '#D2769A',

    accent: '#5B8DB8',
    accentLight: '#8AB2D4',

    success: '#7FA46B',
    warning: '#D97B4D',

    text: '#33212A',
    textSecondary: '#6B4F5A',
    textMuted: '#9B8089',

    onDark: '#FFF8F1',
    onDarkMuted: '#F0DCD3',
  },

  gradients: {
    primary: ['#C85478', '#B5476B', '#8E3353'],
    accent: ['#5B8DB8', '#8AB2D4'],
    progress: ['#B5476B', '#D2769A', '#5B8DB8'],

    // one background image (bg_game) + a different wash per screen -> rule 14
    loaderWash: ['rgba(51,33,42,0.90)', 'rgba(90,46,62,0.86)', 'rgba(51,33,42,0.94)'],
    menuWash: ['rgba(255,248,241,0.08)', 'rgba(255,248,241,0.58)', '#FFF8F1'],
    gameWash: ['rgba(255,248,241,0.94)', 'rgba(248,237,226,0.97)', 'rgba(240,220,211,0.95)'],
    resultWash: ['rgba(142,51,83,0.22)', 'rgba(255,248,241,0.94)', 'rgba(240,220,211,0.97)'],
    counterWash: ['rgba(91,141,184,0.24)', 'rgba(255,248,241,0.93)', 'rgba(248,237,226,0.97)'],
  },

  typography: {
    hero: {fontSize: 34, fontWeight: '900' as const, letterSpacing: 3.5},
    display: {fontSize: 48, fontWeight: '900' as const, letterSpacing: 0},
    title: {fontSize: 26, fontWeight: '900' as const, letterSpacing: 1.6},
    section: {fontSize: 15, fontWeight: '900' as const, letterSpacing: 2.2},
    body: {fontSize: 13, fontWeight: '700' as const, letterSpacing: 0.2},
    caption: {fontSize: 11, fontWeight: '800' as const, letterSpacing: 1.6},
    micro: {fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.4},
    button: {fontSize: 17, fontWeight: '900' as const, letterSpacing: 2, lineHeight: 24},
  },

  radius: {sm: 8, md: 16, lg: 20, xl: 24, xxl: 28, pill: 999},
  spacing: {xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32},

  shadows: {
    card: {
      shadowColor: '#8E3353',
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: {width: 0, height: 8},
      elevation: 5,
    },
    button: {
      shadowColor: '#8E3353',
      shadowOpacity: 0.34,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 8},
      elevation: 9,
    },
    sheet: {
      shadowColor: '#8E3353',
      shadowOpacity: 0.16,
      shadowRadius: 22,
      shadowOffset: {width: 0, height: -8},
      elevation: 12,
    },
    deep: {
      shadowColor: '#000000',
      shadowOpacity: 0.35,
      shadowRadius: 24,
      shadowOffset: {width: 0, height: 10},
      elevation: 14,
    },
  },

  animation: {
    press: {tension: 300, friction: 12},
    enter: {tension: 140, friction: 10},
    sheet: {tension: 120, friction: 14},
    bounce: {tension: 400, friction: 6},
    settle: {tension: 220, friction: 9},
  },
};

export type Theme = typeof theme;
export default theme;
