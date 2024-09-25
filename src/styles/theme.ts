import { fontFamily } from 'tailwindcss/defaultTheme'

export const themeContext = {
  extend: {
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      lexend: ['Lexend Deca', 'Helvetica', 'Arial', 'sans-serif'],
      inter: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
}
