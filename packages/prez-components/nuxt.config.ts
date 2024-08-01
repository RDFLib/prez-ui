import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-31",
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@primevue/nuxt-module'
  ],
  
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