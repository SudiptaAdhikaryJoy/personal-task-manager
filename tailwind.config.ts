// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#11181C",
          primary: {
            foreground: "#FFFFFF",
            DEFAULT: "#006FEE",
          },
          // Add more custom colors here
        },
      },
      dark: {
        colors: {
          background: "#11181C",
          foreground: "#ECEDEE",
          primary: {
            foreground: "#FFFFFF",
            DEFAULT: "#006FEE",
          },
          // Add more custom colors here
        },
      },
    },
  })],
};

export default config;