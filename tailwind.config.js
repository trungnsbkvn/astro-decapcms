import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },

      animation: {
        fade: 'fadeInUp 1s both',
        call: 'play 1.5s ease infinite'
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        play: {
          '0%': {
            transform: 'rotate(0deg) scale(1) skew(1deg)'
          },
          '10%': {
            transform: 'rotate(-25deg) scale(1) skew(1deg)'
          },
          '20%': {
            transform: 'rotate(25deg) scale(1) skew(1deg)',
            'box-shadow': '0 0 0 5px #09568a,0 0 0 10px #bedaf8'
          },
          '30%': {
            transform: 'rotate(-25deg) scale(1) skew(1deg)'
          },
          '40%': {
            transform: 'rotate(25deg) scale(1) skew(1deg)'
          },
          '100%': {
            transform: 'rotate(0deg) scale(1) skew(1deg)'
          },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  darkMode: 'class',
};
