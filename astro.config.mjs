// astro.config.mjs
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  integrations: [
    sanity({
      projectId: "h1krgjqa",
      dataset: "production",
      useCdn: false, // See note on using the CDN
      apiVersion: "2026-03-15", // insert the current date to access the latest version of the API
      studioBasePath: "/studio", // If you want to access the Studio on a route
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
});
