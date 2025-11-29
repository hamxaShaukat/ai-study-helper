import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shooting-star': 'shootingStar 8s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',
        'slide-in-up': 'slideInUp 0.3s ease-out',
      },
      keyframes: {
        shootingStar: {
          '0%': { 
            transform: 'translateX(0) translateY(0) rotate(45deg)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateX(1000px) translateY(1000px) rotate(45deg)', 
            opacity: '0' 
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        slideInUp: {
          '0%': { 
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      }
    },
  },
  plugins: [],
}

export default config