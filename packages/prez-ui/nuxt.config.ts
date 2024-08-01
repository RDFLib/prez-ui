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
      apiEndpoint: process.env.NUXT_PUBLIC_API_ENDPOINT
    }
  },
  extends: [
    '../prez-components'
  ],
  devtools: { enabled: true },
  compatibilityDate: "2024-07-30"
})