/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      // typography: {
      //   DEFAULT: {
      //     css: {
      //       pre: {
      //         // otherwise shiki doesn't wrap the code and max-w-none takes things off the right hand side of the screen
      //         "white-space": "pre-wrap",
      //       },
      //     },
      //   },
      // },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
