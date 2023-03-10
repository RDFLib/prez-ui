<script lang="ts" setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig, type Breadcrumb, type ListItem } from "@/types";
import ItemList from "@/components/ItemList.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";

const { namedNode } = DataFactory;

const { apiBaseUrl } = inject(configKey, defaultConfig);
const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const props = defineProps<{
    title: string;
    parentType?: string;
    itemPred: string; // soon replaced with default profile hasLabelPredicate?
    childButton?: { name: string, url: string }; // undefined or link to children (/collections or /items)
    titlePred: string; // soon replaced with default profile hasLabelPredicate
    descPred: string; // soon replaced with default profile hasLabelPredicate
    enableSearch?: boolean;
}>();

const items = ref<ListItem[]>([]);

const flavour = computed(() => {
    if (route.path.startsWith("/c/")) {
        return "CatPrez";
    } else if (route.path.startsWith("/s/")) {
        return "SpacePrez";
    } else if (route.path.startsWith("/v/")) {
        return "VocPrez";
    } else {
        return undefined;
    }
});

function getBreadcrumbs(): Breadcrumb[] {
    let breadcrumbs: Breadcrumb[] = [];
    if (flavour.value) {
        breadcrumbs.push({ name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`});
        if (props.parentType) {
            if (["dcat:Dataset", "geo:FeatureCollection"].includes(props.parentType)) {
                breadcrumbs.push({ name: "Datasets", url: "/s/datasets" });
                breadcrumbs.push({ name: "Dataset", url: `/s/datasets/${route.params.datasetId}` }); // need parent info in data (link, title & type)
            }
            if (["geo:FeatureCollection"].includes(props.parentType)) {
                breadcrumbs.push({ name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` }); // need parent info in data (link, title & type)
                breadcrumbs.push({ name: "Feature Collection", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` }); // need parent info in data (link, title & type)
            }
        }
    } else if (props.parentType === "prof:Profile") {
        breadcrumbs.push({ name: "Profiles", url: "/profiles"});
    }
    return breadcrumbs;
}

function getSearchDefaults(): {[key: string]: string} { // need IRI of parent to set default search params
    if (props.enableSearch) {
        return {};
    } else {
        return {};
    }
}

onMounted(() => {
    doRequest(`${apiBaseUrl.replace(/\/$/, "")}${route.path}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0]; // need a consistent way to select the parent (previously was rdf:bag)

        store.value.forObjects(member => {
            let c: ListItem = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname(props.titlePred)) {
                    c.title = q.object.value;
                } else if (q.predicate.value === qname(props.descPred)) {
                    c.description = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, member, null, null, null);
            items.value.push(c);
        }, subject, namedNode(qname(props.itemPred)), null);

        ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        document.title = `${props.title} | Prez`;
        if (flavour.value) {
            ui.pageHeading = { name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`};
        } else {
            ui.pageHeading = { name: "Prez", url: "/"};
        }
        ui.breadcrumbs = [
            ...getBreadcrumbs(),
            { name: props.title, url: route.path }
        ];
    });
});
</script>

<template>
    <h1 class="page-title">{{ props.title }}</h1>
    <div>
        <ItemList v-if="data" :items="items" :childName="props.childButton?.name" :childLink="props.childButton?.url" />
        <template v-else-if="loading">loading...</template>
        <template v-else-if="error">Network error: {{ error }}</template>
    </div>
    <Teleport v-if="props.enableSearch" to="#right-bar-content">
        <AdvancedSearch :flavour="flavour ? flavour.toLowerCase() : undefined" :query="getSearchDefaults()" />
    </Teleport>
</template>

<style lang="scss" scoped>

</style>