// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  //components: true, // This enables Nuxt's default component resolution
  components: [
    // Add paths to directories where Nuxt should look for components
    '~/components', // Nuxt's default components directory
    // Add the path to the prez-components package
    '~/node_modules/prez-components/src/components'
  ],  
})
