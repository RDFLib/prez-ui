<script lang="ts" setup>
import SearchMap from "@/components/SearchMap.vue";
import { queryStore, matchDatasets, matchFeatureCollections } from "@/stores/query";
import { QUERY_DATASETS, QUERY_DATASETS_FC } from '@/QUERIES'
import { configKey, defaultConfig } from '@/types'
import { inject, onMounted } from "vue";

const { apiBaseUrl } = inject(configKey, defaultConfig);

const data = queryStore()

const fetchData = async () => {
  await data.fetchData(`${apiBaseUrl}/s/sparql`, QUERY_DATASETS_FC)
}

onMounted(async ()=>{
    await fetchData()
})

</script>

<template>
    <div>
        <div v-if="data.loading">Loading...</div>
        <div v-else-if="data.error">{{ data.error }}</div>
        <div v-else>
            <b>Datasets:</b> <ul><li v-for="item of data.matchData(matchDatasets)">{{  item.subject }}</li></ul>
            <b>Feature Collections:</b> <ul><li v-for="item of data.matchData(matchFeatureCollections)">{{  item.object }}</li></ul>
        </div>
    </div>
    <SearchMap />
    <form action="">
        <div class="search-form">
            <input type="text" name="" id="" placeholder="Enter search term...">
            <input type="text" name="" id="" placeholder="Enter search term...">
            <select name="" id="" multiple>
                <option value="">Something</option>
            </select>
            <select name="" id="" multiple>
                <option value="">Something</option>
            </select>
            <textarea name="" id="" cols="30" rows="10"></textarea>
            <button class="btn" type="submit">Search</button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.search-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button[type="submit"] {
        align-self: flex-start;
    }
}
</style>