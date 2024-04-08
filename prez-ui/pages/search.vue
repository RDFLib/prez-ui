<script lang="ts" setup>
import Card from "primevue/card";
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import Message from "primevue/message";

const config = useRuntimeConfig();
const searchTerm = ref("");
const url = computed(() => {
    return config.public.apiUrl + "/search?q=" + searchTerm.value;
})
const { data, pending, error } = await useSearch(url);
</script>

<template>
    <main>
        <h1>Search</h1>
        <p>Search for items in Prez by using the search field below.</p>
        <Card class="search-form">
            <template #content>
                <InputGroup>
                    <InputText placeholder="Search..." name="search_term" type="search" v-model="searchTerm" />
                    <!-- <Button icon="pi pi-search" severity="success" @click="" /> -->
                </InputGroup>
            </template>
        </Card>
        <template v-if="searchTerm !== ''">
            <h2>Results</h2>
            <div id="results">
                <template v-if="pending">
                    <SearchResult loading />
                    <SearchResult loading />
                    <SearchResult loading />
                </template>
                <Message v-else-if="error" severity="error" :closable="false">Error: {{ error.message }}</Message>
                <p v-else-if="data.data.length === 0">No results found.</p>
                <template v-else>
                    <SearchResult v-for="result in data.data" :data="result" />
                </template>
            </div>
            <Paginator class="paginator" />
        </template>
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