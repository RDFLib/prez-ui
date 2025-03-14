<script lang="ts" setup>
import { dumpNodeArray } from "prez-lib";

const appConfig = useAppConfig();
const route = useRoute();
const { globalProfiles } = useGlobalProfiles();

const urlPath = ref(useGetInitialPageUrl());
const apiEndpoint = useGetPrezAPIEndpoint();
const { status, error, data } = useGetList(apiEndpoint, urlPath);

const { getPageUrl, pagination } = usePageInfo(data);

const apiUrl = (apiEndpoint + urlPath.value).split("?")[0];
const currentProfile = computed(() => data.value ? data.value.profiles.find(p => p.current) : undefined);

const header = computed(() => {
    const lastParent = data.value && data.value.parents?.length > 0
        ? data.value.parents[data.value.parents.length - 1]!.segment : false;
    return lastParent ? appConfig.nameSubstitutions?.[lastParent] || lastParent : "";
});

// when a new page is navigated to
watch(() => route.fullPath, () => {
    urlPath.value = getPageUrl();
});
</script>

<template>
    <NuxtLayout sidepanel>
        <template #header-text>
            <slot name="header-text" :data="data">
                {{ header }}
            </slot>
        </template>
        <template #debug>
            <pre class="p-2"><b>{{ currentProfile?.title }}</b><br>{{ dumpNodeArray(globalProfiles?.[currentProfile?.uri || '']) }}</pre>
        </template>
        <template #breadcrumb>
            <slot name="breadcrumb" :data="data">
                <div :key="data?.parents.join()">
                    <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend || []" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
                    <ItemBreadcrumb v-else-if="error" :custom-items="[{ url: '/', label: 'Unable to load page' }]" />
                    <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{ url: '#', label: '...' }]" />
                </div>
            </slot>
        </template>

        <template #default>
            <slot :data="data" :status="status">

                <slot name="top" :data="data" :status="status"></slot>

                <slot v-if="error" name="message">
                    <Message severity="error">{{ error }}</Message>
                </slot>

                <slot v-else-if="status == 'pending'" name="loading" :status="status">
                    <Loading />
                </slot>

                <div v-else-if="data?.data">
                    <slot name="list-top" :data="data"></slot>
                    <ItemList v-if="globalProfiles && currentProfile" :fields="globalProfiles?.[currentProfile?.uri || '']" :list="data.data" :key="urlPath" />

                    <slot name="pagination" :data="data" :pagination="pagination">
                        <PrezPagination :totalItems="data.count" :pagination="pagination" :maxReached="data.maxReached" />
                    </slot>

                    <slot name="list-bottom" :data="data"></slot>
                </div>

            </slot>

            <slot name="bottom" :data="data" :status="status"></slot>
        </template>

        <template #sidepanel>
            <ItemProfiles :key="status" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
        </template>

    </NuxtLayout>
</template>
