<script lang="ts" setup>
import { getList } from "@prez-ui/lib";
import type { PrezDataList } from "@prez-ui/lib";
const appConfig = useAppConfig();
const api = useApi();
const url = api.getRelativeApiUrl();
const pending = ref(false);
const error = ref<Error>();
const data = ref<PrezDataList>();
const lastParent = ref('');

onMounted(async ()=>{
    error.value = undefined;
    pending.value = true;
    try {
        data.value = await getList(url);
        if(data.value.parents?.length) {
            lastParent.value = data.value.parents[data.value.parents.length-1].segment;
        } else {
            lastParent.value = '';
        }
    } catch (ex) {
        error.value = new Error(ex.message)
    } finally {
        pending.value = false;
    }
})
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
            <div>
                <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                <div v-if="data">
                    <ItemList :list="data.data" />
                </div>
                <Loading v-if="pending" />
            </div>
        </template>
    </NuxtLayout>
</template>
