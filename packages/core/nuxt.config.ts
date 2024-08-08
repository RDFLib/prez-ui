import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-08-07",
  srcDir: "app",
  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module"],
  runtimeConfig: {
    public: {
      prezApiEndpoint: "http://localhost:8000",
      prezUtilsTestPath: "/catalogs/ns:catId/collections/ns:colId/items/ns:itemId"
    }
  },
  primevue: {
    options: {
        theme: {
            preset: Aura,
            options: {
              prefix: 'p',
              darkModeSelector: 'light',
              cssLayer: false
          }
      }
    }
  },
  css: [
    'primeicons/primeicons.css'
  ]  
})