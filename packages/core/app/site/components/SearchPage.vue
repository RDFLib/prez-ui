<script setup lang="ts">

const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const { getPageUrl, navigateToPage, pagination, formSubmitToNavigate } = usePageInfo();
const route = useRoute();
const urlPath = ref(getPageUrl());

const { status, error, data } = useSearch(runtimeConfig.public.prezApiEndpoint, urlPath);

const q = ref((route.query.q || '').toString());

// when a new page is navigated to
watch(()=>route.fullPath, () => {
    urlPath.value = getPageUrl();
});

const inSearchMode = computed(()=>{
    return (route.query?.q || '').length > 0;
});

</script>
<template>
    <NuxtLayout contentonly>
        <template #default>
            <div>
                <div class="mx-auto max-w-4xl">
                    <h1 v-if="!inSearchMode" class="text-2xl mt-8 text-center">
                        <slot name="search-text-large">Search</slot>
                    </h1>

                    <div :class="`flex items-center${inSearchMode ? ' mt-6' : ' justify-center'}`">
                        <div v-if="inSearchMode" class="text-2xl pl-2 align-middle">
                            <slot name="search-text-small">Search</slot>
                        </div>
                        <div class="flex-grow max-w-lg p-4">
                            <form method="get" @submit="formSubmitToNavigate">
                                <InputGroup>
                                    <InputText autofocus autocomplete="false" name="q" v-model="q" placeholder="Enter keywords..." class="flex-grow text-xl p-4 border rounded-l-lg shadow-sm" />
                                    <Button icon="pi pi-search" type="submit" />
                                </InputGroup>
                            </form>
                        </div>
                    </div>
                    <div class="pt-4">
                        <Loading v-if="status == 'pending'" variant="list" />
                        <div v-if="status == 'success' && data?.count == 0 && inSearchMode" class="w-full pl-4 text-sm text-gray-500">
                            No results found
                        </div>
                    </div>

                </div>
                <div class="flex justify-center mt-2 flex-grow">
                </div>

                <div class="flex justify-center mt-4 mb-12">
                    <div class="max-w-4xl w-full">
                        <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                        <div v-if="data">
                            <div v-if="data" :key="urlPath">
                                <div v-if="data.count > 0" class="pl-4 text-sm text-gray-500">
                                    Showing {{ pagination.first }} to {{ Math.min(pagination.first + pagination.limit - 1, data.count) }} of {{ data.count }} item{{ data.count > 1 ? 's' : ''}}
                                </div>
                                <SearchResults :results="data.data" />
                                <div class="pt-4">
                                    <Paginator
                                        v-if="data.count > pagination.limit"
                                        :first="pagination.first" 
                                        :rows="pagination.limit" 
                                        :page="pagination.page" 
                                        :totalRecords="data.count" 
                                        @page="navigateToPage" 
                                    >
                                    </Paginator>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </NuxtLayout>    
</template>
