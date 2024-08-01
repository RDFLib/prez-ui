// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  // set the page title meta data
  app: {
    head: {
      title: 'App',
      titleTemplate: '%s | PrezUI'
    }
  },
  // set the page title meta data when in dev
  $development: {
    app: {
      head: {
        title: 'DEV'
      }
    }
  },
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      prezApiEndpoint: process.env.NUXT_PUBLIC_PREZ_API_ENDPOINT || "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com"
    }
  },
  extends: [
    '../prez-components'
  ],
  devtools: { enabled: true },
  compatibilityDate: "2024-07-30"
})