<script lang="ts" setup>
import SearchMap from "@/components/SearchMap.vue";
import { queryStore } from "@/stores/query";
import { QUERY_DATASETS } from '@/queries'
import { configKey, defaultConfig } from '@/types'
import { inject } from "vue";
const { apiBaseUrl } = inject(configKey, defaultConfig);

const data = queryStore()

const fetchData = () => {
  data.fetchData(`${apiBaseUrl}/s/sparql`, QUERY_DATASETS)
}

</script>

<template>
    <div>
        <button @click="fetchData">Fetch Data</button>
        <div v-if="data.loading">Loading...</div>
        <div v-else-if="data.error">{{ data.error }}</div>
        <div v-else>xx{{ JSON.stringify(data.data) }}</div>
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