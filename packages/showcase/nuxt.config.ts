import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  alias: {
    '@': resolve(__dirname, '../core/app')
  },

  extends: [
    '../core'
  ],

  modules: ["@nuxtjs/storybook"]
})