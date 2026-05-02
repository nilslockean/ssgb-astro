/* eslint-disable no-undef */
import { defineConfig, envField, fontProviders } from "astro/config";
// import sanity from "@sanity/astro";
import dotenv from "dotenv";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Load environment variables from local .env file into process.env
dotenv.config();

// These variables are needed before Astro is initialized and sets up the runtime
// environment variables so we need to access them directly from process.env
// const { SANITY_DATASET = "production", SANITY_TOKEN } = process.env;

// Throw if no sanity token is found
// if (!SANITY_TOKEN) {
//   throw new Error("SANITY_TOKEN is not set in the environment variables");
// }

// https://astro.build/config
export default defineConfig({
  site: "https://ssgb.se",

  integrations: [
    // sanity({
    //   projectId: "",
    //   dataset: SANITY_DATASET,
    //   apiVersion: "2026-03-22",
    //   useCdn: false,
    //   token: SANITY_TOKEN,
    // }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/partials/"),
    }),
  ],

  adapter: netlify(),

  image: {
    domains: ["cdn.sanity.io"],
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
        default: "", // dev API key is the default
      }),
      // FIENTA_API_KEY: envField.string({
      //   context: "server",
      //   access: "secret",
      //   optional: false,
      // }),
      FIENTA_INCLUDE_DRAFTS: envField.boolean({
        context: "server",
        access: "public",
        optional: true,
        default: false,
      }),
    },
  },
});
