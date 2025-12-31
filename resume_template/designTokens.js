/**
 * Design Tokens Configuration
 * 
 * Hero Section - Outline Card Style
 * Light Mode | Serif Typography | Staggered Fade Animation
 * 
 * Usage: Import these tokens into your components or CSS-in-JS solution
 */

export const designTokens = {
  // ============================================
  // COLOR SYSTEM
  // ============================================
  colors: {
    // Backgrounds
    background: {
      page: '#fafafa',        // zinc-50
      card: '#ffffff',        // white
      hover: '#f4f4f5',       // zinc-100
    },
    
    // Text
    text: {
      primary: '#18181b',     // zinc-900
      secondary: '#71717a',   // zinc-500
      muted: '#a1a1aa',       // zinc-400
      inverse: '#ffffff',     // white
    },
    
    // Borders & Dividers
    border: {
      default: '#e4e4e7',     // zinc-200
      hover: '#18181b',       // zinc-900
      divider: '#f4f4f5',     // zinc-100
    },
    
    // Accent (Primary = Black)
    accent: {
      primary: '#18181b',     // zinc-900
      primaryHover: '#27272a', // zinc-800
    },
    
    // Shadows
    shadow: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.02)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Font Families
    fontFamily: {
      heading: '"Playfair Display", Georgia, serif',
      body: '"Lora", Georgia, serif',
      mono: '"JetBrains Mono", monospace',
    },
    
    // Font Sizes (rem)
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '0.9375rem',  // 15px - body default
      md: '1rem',         // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px - subheading min
      '2xl': '1.375rem',  // 22px - subheading default
      '3xl': '1.5rem',    // 24px - subheading max
      '4xl': '2rem',      // 32px - heading min
      '5xl': '2.25rem',   // 36px - heading default
      '6xl': '2.5rem',    // 40px - heading max
    },
    
    // Font Weights
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      snug: 1.4,
      normal: 1.5,
      relaxed: 1.625,
      loose: 1.75,
    },
    
    // Letter Spacing
    letterSpacing: {
      tighter: '-0.025em',
      tight: '-0.0125em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    
    // Presets
    presets: {
      heading: {
        fontFamily: '"Playfair Display", serif',
        fontSize: '2.25rem',      // 32-40px
        fontWeight: 500,          // medium
        letterSpacing: '0.025em', // wide
        lineHeight: 1.2,
      },
      subheading: {
        fontFamily: '"Playfair Display", serif',
        fontSize: '1.375rem',     // 20-24px
        fontWeight: 500,
        letterSpacing: 'normal',
        lineHeight: 1.4,
      },
      body: {
        fontFamily: '"Lora", serif',
        fontSize: '0.9375rem',    // 14-16px
        fontWeight: 400,
        lineHeight: 1.625,
      },
      caption: {
        fontFamily: '"Lora", serif',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
  },

  // ============================================
  // SPACING
  // ============================================
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    
    // Component-specific
    cardPadding: {
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem 3rem',
    },
    sectionGap: '3rem',
    elementGap: '1.5rem',
  },

  // ============================================
  // BORDERS & RADIUS
  // ============================================
  borders: {
    width: {
      default: '1px',
      thick: '2px',
    },
    radius: {
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '8px',
      full: '9999px',
    },
  },

  // ============================================
  // ANIMATION
  // ============================================
  animation: {
    // Durations
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s',
      slower: '0.8s',
    },
    
    // Easing Functions
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      // Custom - smooth deceleration
      smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    
    // Presets for Fade Animation
    fadeUp: {
      duration: '0.8s',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      staggerDelay: 0.1, // seconds between each item
      translateY: '10px',
      iterationCount: 1,
      direction: 'normal',
      fillMode: 'forwards',
    },
    
    // Hover Transitions
    hover: {
      duration: '0.3s',
      easing: 'ease',
      transform: 'translateY(-2px)',
    },
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  // ============================================
  // Z-INDEX
  // ============================================
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
  },
};

// ============================================
// CSS CUSTOM PROPERTIES EXPORT
// ============================================
export const cssVariables = `
:root {
  /* Colors */
  --color-bg-page: ${designTokens.colors.background.page};
  --color-bg-card: ${designTokens.colors.background.card};
  --color-text-primary: ${designTokens.colors.text.primary};
  --color-text-secondary: ${designTokens.colors.text.secondary};
  --color-text-muted: ${designTokens.colors.text.muted};
  --color-border-default: ${designTokens.colors.border.default};
  --color-border-hover: ${designTokens.colors.border.hover};
  --color-accent-primary: ${designTokens.colors.accent.primary};
  
  /* Typography */
  --font-heading: ${designTokens.typography.fontFamily.heading};
  --font-body: ${designTokens.typography.fontFamily.body};
  --font-size-heading: ${designTokens.typography.presets.heading.fontSize};
  --font-size-subheading: ${designTokens.typography.presets.subheading.fontSize};
  --font-size-body: ${designTokens.typography.presets.body.fontSize};
  
  /* Animation */
  --animation-duration: ${designTokens.animation.fadeUp.duration};
  --animation-easing: ${designTokens.animation.fadeUp.easing};
  --animation-stagger: ${designTokens.animation.fadeUp.staggerDelay}s;
}
`;

// ============================================
// TAILWIND CONFIG EXPORT
// ============================================
export const tailwindExtend = {
  colors: {
    background: designTokens.colors.background.page,
    card: designTokens.colors.background.card,
    primary: designTokens.colors.accent.primary,
    secondary: designTokens.colors.text.secondary,
    muted: designTokens.colors.text.muted,
    border: designTokens.colors.border.default,
  },
  fontFamily: {
    heading: ['Playfair Display', 'serif'],
    body: ['Lora', 'serif'],
  },
  animation: {
    'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  keyframes: {
    fadeUp: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
  },
};

export default designTokens;
