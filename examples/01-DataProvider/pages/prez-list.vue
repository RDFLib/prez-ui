<script lang="ts" setup>
//import PrezDataListProvider from 'prez-components/src/components/PrezDataListProvider.vue'
</script>
<template>

    <PrezDataProvider url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">
        <template v-slot="{ data }">
            <PrezUIList :data="data" />
        </template>
    </PrezDataProvider>
    
</template>
