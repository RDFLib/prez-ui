<script lang="ts" setup>
import { dumpNodeArray } from 'prez-lib';

const appConfig = useAppConfig();
const route = useRoute();
const { globalProfiles } = useGlobalProfiles();

const urlPath = ref(useGetInitialPageUrl());
const apiEndpoint = useGetPrezAPIEndpoint();
const { status, error, data } = useGetList(apiEndpoint, urlPath);

const { getPageUrl, navigateToPage, pagination } = usePageInfo(data);

const apiUrl = (apiEndpoint + urlPath.value).split('?')[0];
const currentProfile = computed(()=>data.value ? data.value.profiles.find(p=>p.current) : undefined);

const header = computed(()=>{
    const lastParent = data.value && data.value.parents?.length > 0
        ? data.value.parents[data.value.parents.length - 1]!.segment : false;
    return lastParent ? appConfig.nameSubstitutions?.[lastParent] || lastParent : '';
});

// when a new page is navigated to
watch(() => route.fullPath, () => {
    urlPath.value = getPageUrl();
});
</script>

<template>
    <NuxtLayout sidepanel>
        <template #header-text>
            {{ header }}
        </template>
        <template #debug>
            <pre class="p-2"><b>{{currentProfile?.title}}</b><br>{{ dumpNodeArray(globalProfiles?.[currentProfile?.uri || '']) }}</pre>
        </template>
        <template #breadcrumb>
            <div :key="data?.parents.join()">
                <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend || []" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
                <ItemBreadcrumb v-else-if="error" :custom-items="[{url: '/', label: 'Unable to load page'}]" />
                <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{url: '#', label: '...'}]" />
            </div>
        </template>
        <template #default>
            <div>
                <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                <Loading v-if="status == 'pending'" variant="list" />
                <div v-else-if="data?.data">
                    <ItemList 
                        v-if="globalProfiles && currentProfile"
                        :fields="globalProfiles?.[currentProfile?.uri || '']"
                        :list="data.data" :key="urlPath" 
                    />
                    <Loading v-else variant="list" />

                    <PrezPagination :totalItems="data.count" :pagination="pagination" :maxReached="data.maxReached" />
                </div>
            </div>
        </template>
        <template #sidepanel>
            <ItemProfiles :key="status" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
        </template>

</NuxtLayout>
</template>
