import { defineConfig } from "astro/config";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import plugin from "@tailwindcss/typography"

// https://astro.build/config
export default defineConfig({
  site: "https://colinyates.co.uk",
  integrations: [icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "github-dark",
      },
      // unfortunately this isn't supported yet so it is done in global.css...
      // lineNumbers: true,
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
});
