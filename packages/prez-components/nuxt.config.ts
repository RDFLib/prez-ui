import Aura from '@primevue/themes/aura';
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

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
            preset: Aura
        }
    }
  },
  alias: {
    '@prez-components': currentDir + '/app/components'
  },
  css: [
    'primeicons/primeicons.css'
  ]
})