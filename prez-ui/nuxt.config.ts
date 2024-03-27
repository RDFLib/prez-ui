// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    modules: [
        // "@pinia/nuxt",
        "nuxt-primevue",
    ],
    // pinia: {
    //     storesDirs: ["./stores/**"],
    // },
    imports: { // fixes a Nuxt bug when importing local built packages during development
        transform: {
            exclude: [
                /\bprez\-components\b/,
                /\bprez\-lib\b/,
            ]
        }
    },
    css: [
        "primevue/resources/themes/lara-dark-indigo/theme.css",
        "primeicons/primeicons.css"
    ],
    nitro: {
        esbuild: {
            options: {
                target: "esnext"
            }
        }
    }
})
