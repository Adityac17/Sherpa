/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sherpa: {
          deep: '#0F3D44',     // Primary deep teal
          teal: '#0F766E',     // Accent teal
          tealLight: '#14B8A6',// Light teal for glow/accents
          amber: '#F4B942',    // Summit gold / amber
          amberDark: '#D99B26',
          mist: '#EAF2F0',     // Soft mist background
          mistDark: '#D5E5E2',
          ink: '#11262B',      // Dark slate / ink for typography
          night: '#071619',    // Deep night background for dark mode
          nightSurface: '#0E2429', // Card surface in dark mode
          nightElevated: '#14333A',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-teal': '0 0 24px -4px rgba(15, 118, 110, 0.35)',
        'glow-amber': '0 0 24px -4px rgba(244, 185, 66, 0.4)',
        'ridge': '0 20px 40px -15px rgba(15, 61, 68, 0.15)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
