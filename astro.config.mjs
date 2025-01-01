import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://colinyates.co.uk",
  integrations: [preact(), icon(), sitemap(), tailwind()],
});