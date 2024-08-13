<script lang="ts" setup>
import { getList } from "@/base/lib";
import type { PrezDataList } from "@/base/lib";
import type { PageState } from "primevue/paginator";
import type { PaginationProps } from "~/base/types";

const appConfig = useAppConfig().prez;
const router = useRouter();
const api = useApi();
const pending = ref(false);
const error = ref<Error>();
const data = ref<PrezDataList>();
const lastParent = ref('');
const per_page = ref(10);
const page = ref(1);
const first = ref(1);
const totalRecords = ref(0);
const url = ref('');

async function fetchData() {
    error.value = undefined;
    pending.value = true;
    data.value = undefined;
    try {
        per_page.value = parseInt((router.currentRoute.value.query.per_page || appConfig.pagination.itemsPerPage || 10).toString());
        page.value = parseInt(router.currentRoute.value.query.page as string || '1');
        first.value = (page.value - 1) * per_page.value + 1;
        url.value = api.getRelativeApiUrlWithQueryParams({per_page: per_page.value, page: page.value});
        data.value = await getList(url.value);
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

watch(() => router.currentRoute.value.query.page, async (newPage) => {
    await fetchData();
});

onMounted(fetchData);
</script>

<template>
    <NuxtLayout>
        <template #header-text>
            {{ appConfig.nameSubstitutions?.[lastParent] || lastParent || '&nbsp;' }}
        </template>
        <template #breadcrumb >
            <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend || []" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
            <ItemBreadcrumb v-else :custom-items="[{url: '/', label: '...'}]" />
        </template>
        <template #default>
            <div :key="url">
                <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                <div v-if="data" :key="url">
                    <ItemList :list="data.data" />
                    <Paginator
                        v-if="totalRecords > per_page"
                        :first="first" 
                        :rows="per_page" 
                        :page="page" 
                        :totalRecords="totalRecords" 
                        @page="navigate" 
                    >
                    </Paginator>
                    <div v-if="totalRecords > 0" class="text-sm text-gray-500 text-center">Showing {{ first }} to {{ first + per_page - 1 }} of {{ totalRecords }} items</div>
                </div>
                <Loading v-else-if="pending" />
            </div>
        </template>
    </NuxtLayout>
</template>
