// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://abakusrevyen.no",
  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },
  experimental: { contentLayer: true },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
});
