<script lang="ts" setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey, type Breadcrumb, type ListItem, type PrezFlavour } from "@/types";
import ItemList from "@/components/ItemList.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const props = defineProps<{
    title: string;
    parentType?: string;
    itemPred: string; // soon replaced with default profile hasLabelPredicate?
    childButton?: { name: string, url: string }; // undefined or link to children (/collections or /items)
    // titlePred: string; // soon replaced with default profile hasLabelPredicate
    // descPred: string; // soon replaced with default profile hasLabelPredicate
    enableSearch?: boolean;
    content?: string;
}>();

const items = ref<ListItem[]>([]);

const isAltView = ref(false);

const flavour = computed<PrezFlavour | undefined>(() => {
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
    doRequest(`${apiBaseUrl}${route.path}`, () => {
        const defaultProfile = profiles.value.find(p => p.default)!;
        
        // check profile, potentially show Alt profiles page or redirect to API endpoint
        if (route.query && route.query._profile) {
            if (route.query._profile === defaultProfile.token && !route.query._mediatype) {
                isAltView.value = false;
            } else if (route.query._profile === "alt" && !route.query._mediatype) {
                // show alt profiles page
                isAltView.value = true;
            } else {
                // redirect to API
                window.location.replace(`${apiBaseUrl}${route.path}?_profile=${route.query._profile}${route.query._mediatype ? `&_mediatype=${route.query._mediatype}` : ""}`)
            }
        } else {
            isAltView.value = false;
        }

        parseIntoStore(data.value);

        // default label & description predicates
        let labelPred = qname("rdfs:label");
        let descPred = qname("dcterms:description");

        if (Object.keys(ui.profiles).includes(defaultProfile.token)) {
            const currentProfile = ui.profiles[defaultProfile.token];
            
            // get profile-specific label & description predicates if available
            if (currentProfile.labelPredicate) {
                labelPred = currentProfile.labelPredicate;
            }
            if (currentProfile.descPredicate) {
                descPred = currentProfile.descPredicate;
            }
        }

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0]; // need a consistent way to select the parent (previously was rdf:bag)

        store.value.forObjects(member => {
            let c: ListItem = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === labelPred) {
                    c.title = q.object.value;
                } else if (q.predicate.value === descPred) {
                    c.description = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, member, null, null, null);
            items.value.push(c);
        }, subject, namedNode(qname(props.itemPred)), null);

        if (isAltView.value) {
            ui.rightNavConfig = { enabled: false };
        } else {
            ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        }
        
        document.title = `${props.title} | Prez`;
        if (flavour.value) {
            ui.pageHeading = { name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`};
        } else {
            ui.pageHeading = { name: "Prez", url: "/"};
        }
        ui.breadcrumbs = [
            ...getBreadcrumbs(),
            { name: props.title, url: route.path },
            ... isAltView.value ? [{ name: "Alternate Profiles", url: `${route.path}?_profile=alt` }] : []
        ];
    });
});
</script>

<template>
    <ProfilesTable v-if="isAltView" :profiles="profiles" :path="route.path" />
    <template v-else>
        <h1 class="page-title">{{ props.title }}</h1>
        <p v-if="props.content" v-html="props.content"></p>
        <div>
            <ItemList v-if="data" :items="items" :childName="props.childButton?.name" :childLink="props.childButton?.url" />
            <template v-else-if="loading">loading...</template>
            <template v-else-if="error">Network error: {{ error }}</template>
        </div>
        <Teleport v-if="props.enableSearch" to="#right-bar-content">
            <AdvancedSearch :flavour="flavour" :query="getSearchDefaults()" />
        </Teleport>
    </template>
</template>

<style lang="scss" scoped>

</style>