/* eslint-disable no-undef */
import { defineConfig, envField, fontProviders } from "astro/config";
import dotenv from "dotenv";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Load environment variables from local .env file into process.env
dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: "https://ssgb.se",
  trailingSlash: "always",

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/partials/"),
    }),
  ],

  adapter: netlify(),

  image: {
    domains: ["www.datocms-assets.com"],
  },

  i18n: {
    locales: ["sv", "da", "en"],
    defaultLocale: "sv",
    // fallback: {
    //   da: "sv",
    // },
  },

  server: {
    allowedHosts: [
      "sydsverigesguidebyra.netlify.app",
      "devserver-main--ssgb-astro.netlify.app",
    ],
  },

  fonts: [
    {
      name: "Barlow Condensed",
      cssVariable: "--font-barlow-condensed",
      provider: fontProviders.fontsource(),
      weights: [400, 500],
    },
    {
      name: "Host Grotesk",
      cssVariable: "--font-host-grotesk",
      provider: fontProviders.fontsource(),
    },
  ],

  env: {
    schema: {
      ENABLE_POSTHOG: envField.boolean({
        context: "client",
        access: "public",
        default: true,
      }),
      POSTHOG_PROJECT_API_KEY: envField.string({
        context: "client",
        access: "public",
        default: "",
      }),
      DATOCMS_CDA_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
  redirects: {
    "/admin": "https://ssgb.admin.datocms.com/",
  },
});
