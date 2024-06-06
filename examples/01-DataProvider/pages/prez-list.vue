<script lang="ts" setup>
//import PrezDataListProvider from 'prez-components/src/components/PrezDataListProvider.vue'
</script>
<template>

    <PrezDataListProvider url="https://api.gswa.dev.kurrawong.ai/v/vocab">
        <template v-slot="{ data }">
            <PrezUIList :data="data" />
        </template>
    </PrezDataListProvider>
    
</template>
