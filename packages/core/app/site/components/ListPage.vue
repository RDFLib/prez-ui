<script lang="ts" setup>
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const { getPageUrl, navigateToPage, pagination } = usePageInfo();

const urlPath = ref(getPageUrl());
const { status, error, data } = await useGetList(runtimeConfig.public.prezApiEndpoint, urlPath);

const header = computed(()=>{
    const lastParent = data.value && data.value.parents?.length > 0
        ? data.value.parents[data.value.parents.length - 1]!.segment : false;
    return lastParent ? appConfig.nameSubstitutions?.[lastParent] || lastParent : '';
});

// when a new page is navigated to
watch(()=>route.fullPath, () => {
    urlPath.value = getPageUrl();
});

</script>

<template>
    <NuxtLayout sidepanel>
        <template #header-text>
            {{ header }}
        </template>
        <template #breadcrumb>
            <ItemBreadcrumb :key="data?.data?.length" v-if="data" :prepend="appConfig.breadcrumbPrepend || []" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
            <ItemBreadcrumb v-else-if="error" :custom-items="[{url: '/', label: 'Unable to load page'}]" />
            <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{url: '#', label: '...'}]" />
        </template>
        <template #default>
            <div>
                <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                <Loading v-if="status == 'pending'" />
                <div v-else-if="data?.data">
                    <ItemList :list="data.data" :key="urlPath" />
                    <div class="pt-4">
                        <Paginator
                            v-if="data.count > pagination.per_page!"
                            :first="pagination.first" 
                            :rows="pagination.per_page" 
                            :page="pagination.page" 
                            :totalRecords="data.count" 
                            @page="navigateToPage" 
                        >
                        </Paginator>
                        <div v-if="data.count > 0" class="text-sm text-gray-500 text-center">
                            Showing {{ pagination.first }} to 
                                {{ Math.min(pagination.first! + pagination.per_page! - 1, data.count) }} of 
                                {{ data.count }}{{ data.maxReached ? '+' : '' }} items
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #sidepanel>
            <ItemProfiles v-if="status == 'pending'" loading />
            <ItemProfiles v-else-if="data" :profiles="data.profiles" />
        </template>
    </NuxtLayout>
</template>
