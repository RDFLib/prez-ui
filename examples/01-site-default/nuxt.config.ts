// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  extends:
    (process.env.PREZ_LAYER_EXTENDS ? 
      process.env.PREZ_LAYER_EXTENDS.split(",") : []),

  app: {
    head: {
      title: 'My PrezUI application'
    } 
  },

  vite: {
    optimizeDeps: {
      exclude: ['primevue', 'n3']
    }
  },  

  runtimeConfig: {
    public: {
      prezApiEndpoint: process.env.NUXT_PUBLIC_PREZ_API_ENDPOINT
    }
  },

})
