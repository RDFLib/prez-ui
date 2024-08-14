<script setup lang="ts">
import { search } from "@/base/lib";
import type { PrezDataSearch } from "@/base/lib";
import type { PageState } from "primevue/paginator";

const appConfig = useAppConfig().prez;
const router = useRouter();
const api = useApi();
const pending = ref(false);
const error = ref<Error>();
const data = ref<PrezDataSearch>();
const lastParent = ref('');
const per_page = ref(10);
const page = ref(1);
const first = ref(1);
const totalRecords = ref(0);
const url = ref('');

const q = ref(router.currentRoute.value.query.q?.toString() || '');
const inSearchMode = ref(false);


async function fetchData() {
    error.value = undefined;
    pending.value = true;
    data.value = undefined;
    if(q.value == '') {
        pending.value = false;
        inSearchMode.value = false;
        return;
    }
    try {
        inSearchMode.value = true;
        per_page.value = parseInt((router.currentRoute.value.query.per_page || appConfig.pagination.itemsPerPage || 10).toString());
        page.value = parseInt(router.currentRoute.value.query.page as string || '1');
        first.value = (page.value - 1) * per_page.value + 1;
        url.value = api.getRelativeApiUrlWithQueryParams({per_page: per_page.value, page: page.value, q: q.value});
        data.value = await search(url.value);
        totalRecords.value = data.value.count;
        if(data.value.parents?.length > 0) {
            lastParent.value = data.value.parents[data.value.parents.length-1]!.segment;
        } else {
            lastParent.value = '';
        }
    } catch (ex) {
        totalRecords.value = 0;
        error.value = new Error((ex as Error).message);
    } finally {
        pending.value = false;
    }
}

async function navigate(e: PageState) {
    page.value = e.page + 1;
    const queryParams = router.currentRoute.value.query;
    router.push({ query: { ...queryParams, page: page.value } });
}

watch(() => router.currentRoute.value.fullPath, async (newPage) => {
    q.value = router.currentRoute.value.query.q?.toString() || '';    
    await fetchData();
});

async function runSearch(e: Event) {
//    await fetchData();
    router.push({ query: { ...router.currentRoute.value.query, q: q.value } });
    e.preventDefault();
}

onMounted(fetchData);
</script>
<template>

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
                    <form method="get" @submit="runSearch">
                        <InputGroup>
                            <InputText autofocus name="q" v-model="q" placeholder="Enter keywords..." class="flex-grow text-xl p-4 border rounded-l-lg shadow-sm" />
                            <Button icon="pi pi-search" type="submit" />
                        </InputGroup>
                    </form>
                </div>
            </div>
            <div class="pt-4">
                <Loading v-if="pending" variant="list" />
                <div v-if="totalRecords == 0 && inSearchMode" class="w-full pl-4 text-sm text-gray-500">No results found</div>
            </div>

        </div>
        <div class="flex justify-center mt-2 flex-grow">
        </div>

        <div class="flex justify-center mt-4 mb-12">
            <div class="max-w-4xl">
                <div v-if="data">
                    <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                    <div v-if="data" :key="url">
                        <div v-if="totalRecords > 0" class="pl-4 text-sm text-gray-500">Showing {{ first }} to {{ Math.min(first + per_page - 1, totalRecords) }} of {{ totalRecords }} item{{ totalRecords > 1 ? 's' : ''}}</div>
                        <SearchResults :results="data.data" />
                        <div class="pt-4">
                            <Paginator
                                v-if="totalRecords > per_page"
                                :first="first" 
                                :rows="per_page" 
                                :page="page" 
                                :totalRecords="totalRecords" 
                                @page="navigate" 
                            >
                            </Paginator>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
