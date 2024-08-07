// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: [
    ['github:RDFLib/prez-ui/packages/core#hjohns/next/alpha']//, {install: true}]
//    '../../packages/core/nuxt.config.ts'
  ]
})
