<script lang="ts" setup>
import { search, type PrezSearchResult } from "prez-lib"
import Card from "primevue/card";
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import SearchResult from "~/components/SearchResult.vue";

const config = useRuntimeConfig();

const results = ref<PrezSearchResult[]>();

const searchTerm = ref("");

async function submit() {
    const { data } = await search(config.public.apiUrl + "/search?q=" + searchTerm.value);
    results.value = data;
}
</script>

<template>
    <main>
        <h1>Search</h1>
        <!-- <p>text</p> -->
        <Card class="search-form">
            <template #content>
                <InputGroup>
                    <InputText placeholder="Search..." name="search_term" type="search" v-model="searchTerm" @keyup.enter="submit" />
                    <Button icon="pi pi-search" severity="success" @click="submit" />
                </InputGroup>
            </template>
        </Card>
        <h2>Results</h2>
        <div id="results">
            <SearchResult v-for="result in results" v-bind="result" />
        </div>
        <Paginator class="paginator" />
    </main>
</template>

<style lang="scss" scoped>
.search-form {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}
#results {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.paginator {
    margin-top: auto;
}
</style>