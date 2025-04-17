<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { PREZ_PREDICATES } from "prez-lib";

const appConfig = useAppConfig();
const { globalProfiles } = useGlobalProfiles();

const apiEndpoint = useGetPrezAPIEndpoint();
const { getPageUrl, pagination, formSubmitToNavigate } = usePageInfo();
const route = useRoute();
const urlPath = ref(getPageUrl());
const currentFacetProfile = route.query.facet_profile?.toString() || undefined;

const { status, error, data } = useSearch(apiEndpoint, urlPath);

const q = ref((route.query.q || '').toString());

// when a new page is navigated to
watch(() => route.fullPath, () => {
    urlPath.value = getPageUrl();
});

const inSearchMode = computed(() => (route.query?.q || '').length > 0);
</script>

<template>
    <NuxtLayout contentonly>
        <template #default>
            <div>
                <div class="mx-auto max-w-4xl">
                    <h1 class="text-2xl mt-8 text-center">
                        <slot name="search-text">Search</slot>
                    </h1>

                    <div class="flex items-center justify-center">
                        <div class="flex-grow max-w-lg p-4">
                            <form method="get" @submit="formSubmitToNavigate">
                                <div class="flex flex-row">
                                    <Input type="search" autofocus autocomplete="false" name="q" v-model="q" placeholder="Enter keywords..." class="rounded-r-none" />
                                    <Button type="submit" class="rounded-l-none h-auto"><Search class="w-4 h-4" /></Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Loading v-if="status == 'pending'" variant="search" />
                    <div v-if="status == 'success' && data?.count == 0 && inSearchMode" class="w-full pl-4 text-sm text-muted-foreground">
                        No results found
                    </div>

                </div>

                <div class="flex justify-center mt-4 mb-12">
                    <div class="max-w-4xl w-full">
                        <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                        <div v-if="data">
                            <div v-if="data" :key="urlPath">
                                <Facets v-if="globalProfiles && currentFacetProfile && globalProfiles[PREZ_PREDICATES.profile + '/' + currentFacetProfile]" 
                                    :facets="data.facets" 
                                    :profile="globalProfiles[PREZ_PREDICATES.profile + '/' + currentFacetProfile]" 
                                />
                                <SearchResults :results="data.data" />
                                <PrezPagination v-if="status == 'success' && data?.count > 0 && inSearchMode" :totalItems="data.count" :pagination="pagination" :maxReached="data.maxReached" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </NuxtLayout>    
</template>
