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
            <slot name="header-text" :data="data">
                <Node v-if="data" :key="data?.data.value" :term="data.data" variant="item-header" />
                <div v-else>&nbsp;</div>
            </slot>
        </template>

        <template #breadcrumb>
            <slot name="breadcrumb" :data="data">
                <div :key="data?.parents.join()">
                    <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents" />
                    <ItemBreadcrumb v-else-if="error" :custom-items="[{url: '/', label: 'Unable to load page'}]" />
                    <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{url: '#', label: '...'}]" />
                </div>
            </slot>
        </template>

        <template #default>
            <slot :data="data" :status="status" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl">

                <slot name="top" :data="data" :status="status" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl"></slot>

                <slot name="message">
                    <div v-if="error">
                        <Message severity="error">{{ error }}</Message>
                    </div>
                </slot>

                <div v-if="data?.data" :key="data?.data.value">
                    <slot name="header-section" :data="data">
                        <slot name="header-top" :data="data"></slot>
                        <slot name="header-description" :data="data">
                            <div v-if="data.data.description" class="mt-4 mb-4">
                                <Literal :term="data.data.description" hide-language />
                            </div>
                        </slot>
                        <slot name="header-middle" :data="data"></slot>
                        <slot name="header-identifiers" :data="data">
                            <div class="mb-2 mt-2">
                                <Badge class="mr-2">IRI</Badge> <ItemLink :secondary-to="data.data.value" copy-link>{{ data.data.value }}</ItemLink>
                            </div>
                            <div class="flex" v-if="data?.data.rdfTypes">
                                <Badge class="mr-2">Type</Badge>
                                <div>
                                    <div class="ml-2 mr-2" v-for="rdfType in data.data.rdfTypes" ><Node :term="rdfType" /></div>
                                </div>
                            </div>
                        </slot>
                        <slot name="header-bottom" :data="data"></slot>
                    </slot>
                    <div class="mt-2 mb-12">
                        <slot name="item-section" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl">
                            <slot name="item-top" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl"></slot>
                            <slot name="item-table" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl">
                                <ItemTable :term="data.data" :key="urlPath"  :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl"/>
                            </slot>
                            <slot name="item-middle" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl"></slot>

                            <slot name="item-members" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl">
                                <p class="mt-6" v-if="data.data.members">
                                    <Button size="small" color="secondary" label="Members" @click="()=>router.push(data!.data.members!.value)" />
                                </p>
                            </slot>

                            <slot name="item-concepts" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl">
                                <div class="mt-6" v-if="isConceptScheme && topConceptsUrl != ''">
                                    <p><b>Concepts</b></p>
                                    <div class="mt-4">
                                        <ConceptHierarchy
                                            :base-url="runtimeConfig.public.prezApiEndpoint" 
                                            :url-path="topConceptsUrl"
                                        />
                                    </div>
                                </div>
                            </slot>

                            <slot name="item-bottom" :data="data" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl"></slot>
                        </slot>
                    </div>
                </div>
                <slot name="loading" :status="status">
                    <Loading v-if="status == 'pending'" />
                </slot>
                <slot name="bottom" :data="data" :status="status" :is-concept-scheme="isConceptScheme" top-concepts-url="topConceptsUrl"></slot>
            </slot>
        </template>

        <template #sidepanel>
            <slot name="profiles" :data="data" :apiUrl="apiUrl" :status="status">
                <ItemProfiles :key="status" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
            </slot>
        </template>

    </NuxtLayout>
</template>
