// Build-Konfiguration für das lokal erzeugte Tailwind-CSS (ersetzt das externe Tailwind-CDN).
// Neu bauen nach Änderungen an Klassen in index.html oder js/*.js:  npm run build:css
module.exports = {
  content: ['./index.html', './datenschutz.html', './js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      // THEME CONFIGURATION
      // Uses CSS variables managed by js/colors.js to allow dynamic theming
      colors: {
        indigo: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)', // Main Brand Color
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      animation: {
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      }
    },
  },
  safelist: [
    'translate-x-1',
    'translate-x-7',
    'text-green-600',
    'dark:text-green-400',
    'text-slate-400',
    'dark:text-slate-500',
    'italic',
    'font-medium',
    'opacity-50',
    'cursor-not-allowed'
  ],
  plugins: [],
};
