<script lang="ts" setup>
/**
 * @file ConceptHierarchy.vue
 * 
 * This component renders a recursive hierarchy of concepts.
 * 
 * This component lives under the site project as it uses the lib composable from the site project.
 */
import { getNarrowersUrl, type PrezConceptNode } from '@/base/lib';
const appConfig = useAppConfig();
const apiEndpoint = useGetPrezAPIEndpoint();
const route = useRoute();

interface Props {
    baseUrl: string;
    urlPath: string;
    level?: number;
};

const props = withDefaults(defineProps<Props>(), { level: 0 });

const urlPath = ref(props.urlPath + '?page=1&limit=' + appConfig.pagination.conceptsPerPage.toString());

const { status, error, data, hasMore } = await useGetList(apiEndpoint, urlPath, { appendMode: true });

const concepts = computed(() => (data?.value?.data || []) as PrezConceptNode[]);

const open = ref<string[]>([]);
const page = ref(1);

function toggleOpen(value:string) {
    const idx = open.value.indexOf(value);
    if(idx >= 0) {
        open.value.splice(idx, 1);
    } else {
        open.value.push(value);
    }
}

function loadMore() {
    if(hasMore.value) {
        page.value+= 1;        
        urlPath.value = props.urlPath + '?' + new URLSearchParams({
            ...route.query, 
            page: page.value.toString(),
            limit: appConfig.pagination.conceptsPerPage.toString()
        }).toString();
    }
}
</script>

<template>
    <div v-if="data?.data">
        <div v-if="data.data.length == 0" class="text-gray-500 text-sm">No concepts found</div>
        <div v-else v-for="concept of concepts" :key="concept.value" class="pz-concept">
            <div class="pz-concept-node">
                <template v-if="concept.hasChildren">
                    <span v-if="!open.includes(concept.value)" @click="()=>toggleOpen(concept.value)">></span>
                    <span v-else @click="()=>toggleOpen(concept.value)">v</span>
                </template>
                <span v-else class="pz-concept-blank" />
                <Node :term="concept" />
            </div>
            <div v-if="open.includes(concept.value)" class="pz-concept-children">
                <ConceptHierarchy base-url="baseUrl" :url-path="getNarrowersUrl('', concept)" :level="props.level + 1" />
            </div>
        </div>
        <div v-if="error"><Message severity="error">{{ error }}</Message></div>
        <Loading class="ml-6" v-if="status == 'pending'" variant="concept" />
        <div v-if="hasMore && status != 'pending'" class="mt-4">
            <button class="ml-6" @click="loadMore">more</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pz-concept-blank {
    width:16px;
}
.pz-concept i {
    padding:4px;
}
.pz-concept i:hover {
    cursor: pointer;
    background-color: #eee;
    border-radius: 14px;
}
.pz-concept-node {
    place-items: end;    
    align-items: center;
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}
.pz-concept .pz-concept {
    padding-left:20px;
}

</style>