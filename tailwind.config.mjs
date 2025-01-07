import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "selector",
  theme: {
    extend: {
      container: {
        screens: {
          xl: "1100px",
          "2xl": "1100px",
        }
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Tauri", ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        xs: "0.7rem",
        sm: "0.875rem",
        base: "1rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.875rem",
        "2xl": "2.3rem",
      },
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        accent: "var(--accent)",

        primary: "#E21617",
        secondary: "#C81917",

        gray: {
          100: "#f2f2f2",
          200: "#e7e7e7",
          300: "#d9d9d9",
          400: "#b6b6b6",
          500: "#8c8c8c",
          600: "#757575",
          700: "#595959",
          800: "#373737",
          900: "#0d0d0d",
        },

        blue: {
          100: "#e6f1ff",
          200: "#cee4fe",
          300: "#b7d5f8",
          400: "#96c1f2",
          500: "#5ea2ef",
          600: "#0072f5",
          700: "#005fcc",
          800: "#004799",
          900: "#00254d",
        },

        orange: {
          100: "#fef5e7",
          200: "#fdefd8",
          300: "#fce7c5",
          400: "#fbdba7",
          500: "#f9cb80",
          600: "#f5a524",
          700: "#b97509",
          800: "#925d07",
          900: "#4e3104",
        },

        green: {
          100: "#e8fcf1",
          200: "#dafbe8",
          300: "#c8f9dd",
          400: "#adf5cc",
          500: "#88f1b6",
          600: "#17c964",
          700: "#13a452",
          800: "#108944",
          900: "#166534",
        },

        red: {
          100: "#ffdcdc",
          200: "#f18888",
          300: "#e9494a",
          400: "#e52d2e",
          500: "#e21617",
          600: "#c81917",
          700: "#b21c17",
          800: "#730202",
          900: "#400101",
        },

        purple: {
          100: "#f4eaff",
          200: "#e8d4fe",
          300: "#dba7fd",
          400: "#cc79fc",
          500: "#b94cfb",
          600: "#a020fa",
          700: "#8120c9",
          800: "#62189b",
          900: "#440d66",
        },

        yellow: {
          100: "#fff9cc",
          200: "#ffe169",
          300: "#fad643",
          400: "#edc531",
          500: "#dbb42c",
          600: "#c9a227",
          700: "#b69121",
          800: "#a47e1b",
          900: "#926c15",
        },
      },
    },
  },
  plugins: [],
};
