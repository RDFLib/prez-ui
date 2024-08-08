<script lang="ts" setup>

const prezConfig = usePrezConfig();
const api = useApi();

const runtimeConfigValues = ref();
try {
    const runtimeConfig = useRuntimeConfig();
    runtimeConfigValues.value = runtimeConfig;
} catch (ex) {
    console.error('Error loading runtime config', ex);
}

const configSets = [
    {
        title: 'Runtime configuration',
        items: [
        {
            name: 'runtimeConfig',
            value: Object.keys(runtimeConfigValues.value.public)
        }]
    },
    {
        title: 'App configuration',
        items: [
            {name: 'Layer', value: prezConfig.layer},
            {name: 'Menu', value: prezConfig.menu},
            {name: 'Base API URL', value: api.getBaseApiUrl()},
            {name: 'Relative API URL', value: api.getRelativeApiUrl()},
        ]
    },
    {
        title: 'Environment variables',
        items: [
            {name: 'import.meta.env', value: import.meta.env},
            {name: 'process.env', value: process.env},
        ]
    }
]
</script>

<template>

    <h1>Application configuration viewer</h1>

    <template v-for="set of configSets" :key="set.title">
        <hr>
        <h2>{{ set.title }}</h2>
        <table>
            <thead>
                <th>Name</th>
                <th>Value</th>
            </thead>
            <tbody>
                <tr v-for="item of set.items" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.value }}</td>
                </tr>
            </tbody>
        </table>
    </template>


</template>
