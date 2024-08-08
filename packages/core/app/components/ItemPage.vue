<script lang="ts" setup>
import { getItem } from "@/lib";
import type { PrezDataItem } from "@/lib";
const appConfig = useAppConfig();
const api = useApi();
const url = api.getRelativeApiUrl();
const baseUrl = api.getBaseApiUrl();
const pending = ref(false);
const error = ref<Error>();
const data = ref<PrezDataItem>();

onMounted(async ()=>{
    error.value = undefined;
    pending.value = true;
    try {
        data.value = await getItem(url);
    } catch (ex) {
        error.value = new Error(ex.message)
    } finally {
        pending.value = false;
    }

})
//const { pending, data: PrezFocusNode, error } = useAsyncData<PrezFocusNode>('item', async()=>await getItem(url))
</script>
<template>
    <NuxtLayout sidepanel>
        <template #header-text>
            <ItemHeader v-if="data?.data" :term="data.data" />
            <div v-else>&nbsp;</div>
        </template>
        <template #breadcrumb >
            <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
            <ItemBreadcrumb v-else :custom-items="[{url: '/', label: '...'}]" />
        </template>
        <template #default>
            <div v-if="error">
                <Message severity="error">{{ error }}</Message>
            </div>
            <div v-if="data">
                <ItemTable :base-url="baseUrl" :term="data.data" />
            </div>
            <Loading v-if="pending" />
        </template>
        <template #sidepanel>
            <ItemProfiles v-if="data" :profiles="data.profiles" />
            <Loading v-if="pending" />
        </template>
    </NuxtLayout>
</template>
