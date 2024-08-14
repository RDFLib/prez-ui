import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

if(process.env.PREZ_CORE_EXTENDS) {
  console.log("PREZ_CORE_EXTENDS: ", process.env.PREZ_CORE_EXTENDS)
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  app: {
    head: {
      htmlAttrs: {
        class: 'dark'
      },
    },
  },

  runtimeConfig: {
    public: {
      prezApiEndpoint: "http://localhost:8000",
      prezUtilsTestPath: "/catalogs/ns:catId/collections/ns:colId/items/ns:itemId"
    }
  },  

  extends: [
    ...(process.env.PREZ_CORE_EXTENDS ? process.env.PREZ_CORE_EXTENDS.split(",") : []),
    'app/base',
    'app/site',
    'app/tools',
  ],

  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', "@nuxtjs/tailwindcss"],
  primevue: {
    importTheme: {from: resolve('./app/base/assets/theme/mainTheme.ts')},
  },
  css: [
    'primeicons/primeicons.css',
  ],

  nitro: {
    esbuild: {
      options: {
        target: 'es2020'
      }
    }
  },

  ssr: false
})