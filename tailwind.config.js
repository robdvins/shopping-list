module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: { shake: 'shake 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both' },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%': {
            transform: 'translateX(-10px)'
          },
          '20%, 40%, 60%': {
            transform: 'translateX(10px)'
          },
          '80%': {
            transform: 'translateX(8px)'
          },
          '90%': {
            transform: 'translateX(-8px)'
          }
        }
      }
    }
  },
  plugins: []
}
