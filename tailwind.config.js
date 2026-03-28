/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        war: {
          bg: '#0a0a0b',
          surface: '#111113',
          card: '#18181c',
          border: '#2a2a30',
          accent: '#00ff88',
          blue: '#4d9fff',
          amber: '#ffb347',
          red: '#ff4d4d',
          muted: '#6b6b7a',
          text: '#e8e8f0',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.4s ease forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        glow: {
          from: { boxShadow: '0 0 5px rgba(0,255,136,0.3)' },
          to: { boxShadow: '0 0 20px rgba(0,255,136,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
