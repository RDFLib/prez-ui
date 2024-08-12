<script setup lang="ts">

const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const configItems = [
    {
        name: 'Runtime public config', 
        description: `The runtime configuration is set in the Nuxt configuration file (nuxt.config.ts) and some are overwriteable through env variables. 
                      Prez runtime settings can be modified by changing values in the .env.* file or by setting env variables in the hosting environment.
                      Runtime settings do not require a rebuild.`, 
        value: runtimeConfig.public
    },
    {
        name: 'App config',
        description: 'The app configuration is set in the Nuxt App Configuration file (app.config.ts) and used at build time. These settings set application level defaults.',
        value: appConfig
    }
]

</script>
<template>

    <NuxtLayout contentonly name="utils">

        <div v-for="configItem in configItems" :key="configItem.name">
            <h1 class="text-2xl pt-14 font-bold mb-4">{{ configItem.name }}</h1>
            <p>{{ configItem.description }}</p>

            <table class="min-w-full bg-white border mt-4">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b">Setting</th>
                        <th class="py-2 px-4 border-b">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in configItem.value">
                        <td class="py-2 w-1 px-4 border-b">{{ idx }}</td>
                        <td class="py-2 px-4 border-b">
                            <pre class="bg-gray-100 p-4 border rounded overflow-auto max-h-40">{{ item }}</pre>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </NuxtLayout>

</template>