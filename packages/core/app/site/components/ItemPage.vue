<script lang="ts" setup>
import { getTopConceptsUrl, SYSTEM_PREDICATES } from '~/base/lib';

const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const { getPageUrl } = usePageInfo();
const urlPath = ref(getPageUrl());
const { status, error, data } = useGetItem(runtimeConfig.public.prezApiEndpoint, urlPath);
const isConceptScheme = computed(()=> data.value?.data.rdfTypes?.find(n=>n.value == SYSTEM_PREDICATES.skosConceptScheme));
const topConceptsUrl = computed(()=>isConceptScheme ? getTopConceptsUrl(data.value!.data) : '');
const apiUrl = (runtimeConfig.public.prezApiEndpoint + urlPath.value).split('?')[0];

</script>
<template>
    <NuxtLayout sidepanel>

        <template #header-text>
            <Node v-if="data" :term="data.data" variant="item-header" />
            <div v-else>&nbsp;</div>
        </template>

        <template #breadcrumb >
            <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
            <ItemBreadcrumb v-else-if="error" :custom-items="[{url: '/', label: 'Unable to load page'}]" />
            <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{url: '#', label: '...'}]" />
        </template>

        <template #default>
            <div v-if="error">
                <Message severity="error">{{ error }}</Message>
            </div>
            <div v-if="data?.data">
                <div v-if="data.data.description" class="mt-4 mb-4">
                    <Literal :term="data.data.description" hide-language />
                </div>
                <div class="mb-2 mt-2">
                    <Badge class="mr-2">IRI</Badge> <ItemLink :secondary-to="data.data.value" copy-link>{{ data.data.value }}</ItemLink>
                </div>
                <div class="flex" v-if="data?.data.rdfTypes">
                    <Badge class="mr-2">Type</Badge>
                    <div>
                        <div class="ml-2 mr-2" v-for="rdfType in data.data.rdfTypes" ><Node :term="rdfType" /></div>
                    </div>
                </div>
                <div class="mt-2 mb-12">
                    <ItemTable :term="data.data" />
                    <p class="mt-6" v-if="data.data.members">
                        <Button size="small" color="secondary" label="Members" @click="()=>router.push(data!.data.members!.value)" />
                    </p>
                    <div class="mt-6" v-if="isConceptScheme && topConceptsUrl != ''">
                        <p><b>Concepts</b></p>
                        <div class="mt-4">
                            <ConceptTree
                                :base-url="runtimeConfig.public.prezApiEndpoint" 
                                :url-path="topConceptsUrl"
                            />
                        </div>
                    </div>

                </div>
            </div>
            <Loading v-if="status == 'pending'" />
        </template>

        <template #sidepanel>
            <ItemProfiles :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
        </template>

    </NuxtLayout>
</template>
