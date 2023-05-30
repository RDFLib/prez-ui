<script lang="ts" setup>
import { onMounted, onBeforeMount, ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory, type Quad_Object, type Quad_Subject } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey, type Breadcrumb, type ListItem, type PrezFlavour, type Profile, type ListItemExtra, type ListItemSortable } from "@/types";
import ItemList from "@/components/ItemList.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";
import SortableTabularList from "@/components/SortableTabularList.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const DEFAULT_LABEL_PREDICATES = [qname("rdfs:label")];
const DEFAULT_DESC_PREDICATES = [qname("dcterms:description")];
const TOP_LEVEL_TYPES = [
    qname("dcat:Catalog"),
    qname("dcat:Dataset"),
    qname("skos:ConceptScheme"),
    qname("skos:Collection"),
    qname("prof:Profile"),
    qname("prez:CatPrezProfile"),
    qname("prez:SpacePrezProfile"),
    qname("prez:VocPrezProfile"),
];
const ALT_PROFILES_TOKEN = "lt-prfl:alt-profile";

// const parent = ref<ListItem>({} as ListItem); // might need to store parent info (dataset & feature collection)
const items = ref<ListItemExtra[]>([]);
const itemType = ref({
    uri: "",
    label: ""
});
const count = ref(0);
const isAltView = ref(false);
const flavour = ref<PrezFlavour | null>(null);
const defaultProfile = ref<Profile | null>(null);
const searchEnabled = ref(false);
const searchDefaults = ref<{[key: string]: string}>({});
const childrenConfig = ref({
    showButton: false,
    buttonTitle: "",
    buttonLink: ""
});

const currentPageNumber = computed(() => {
    if (route.query && route.query.page) {
        return parseInt(route.query.page as string);
    } else {
        return 1;
    }
});

function configByType(type: string) {
    itemType.value.uri = type;
    switch (type) {
        case qname("dcat:Catalog"):
            itemType.value.label = "Catalogs";
            // searchEnabled.value = true;
            // searchDefaults.value = { catalog: item.value.iri };
            break;
        case qname("dcat:Dataset"):
            itemType.value.label = "Datasets";
            // searchEnabled.value = true;
            // searchDefaults.value = { dataset: item.value.iri };
            childrenConfig.value = {
                showButton: true,
                buttonTitle: "Collections",
                buttonLink: "/collections"
            };
            break;
        case qname("geo:FeatureCollection"):
            itemType.value.label = "Feature Collections";
            // searchEnabled.value = true;
            // searchDefaults.value = { collection: item.value.iri };
            childrenConfig.value = {
                showButton: true,
                buttonTitle: "Features",
                buttonLink: "/items"
            };
            break;
        case qname("geo:Feature"):
            itemType.value.label = "Features";
            // search?
            break;
        case qname("skos:ConceptScheme"):
            itemType.value.label = "Vocabularies";
            // searchEnabled.value = true;
            // searchDefaults.value = { vocab: item.value.iri };
            break;
        case qname("skos:Collection"):
            itemType.value.label = "Collections";
            break;
        case qname("prof:Profile"):
        case qname("prez:CatPrezProfile"):
        case qname("prez:SpacePrezProfile"):
        case qname("prez:VocPrezProfile"):
            itemType.value.label = "Profiles";
            break;
        default:
    }
}

function getBreadcrumbs(): Breadcrumb[] {
    // build out the breadcrumbs using the URL path
    let crumbs: Breadcrumb[] = [];
    
    if (flavour.value) {
        crumbs.push({ name: getPrezSystemLabel(flavour.value) + " Home", url: `/${flavour.value[0].toLowerCase()}`});
    }
    const pathSegments = route.path.split("/").slice(1);
    let skipSegment = false;
    pathSegments.forEach((pathSegment, index) => {
        if (skipSegment) { // skip segment when an ID appears
            skipSegment = false;
            return;
        }
        switch (pathSegment) {
            case "catalogs":
                crumbs.push({ name: "Catalogs", url: "/c/catalogs" });
                break;
            case "datasets":
                crumbs.push({ name: "Datasets", url: "/s/datasets" });
                if (index + 1 !== pathSegments.length) {
                    crumbs.push({ name: "Dataset", url: `/s/datasets/${route.params.datasetId}` });
                    skipSegment = true;
                }
                break;
            case "collections":
                crumbs.push({ name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` });
                if (index + 1 !== pathSegments.length) {
                    crumbs.push({ name: "Feature Collection", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` });
                    skipSegment = true;
                }
                break;
            case "items":
                crumbs.push({ name: "Features", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}/items` });
                break;
            case "vocab":
                crumbs.push({ name: "Vocabularies", url: "/v/vocab" });
                break;
            case "collection":
                crumbs.push({ name: "Collections", url: "/v/collection" });
                break;
            case "profiles":
                crumbs.push({ name: "Profiles", url: `${flavour.value ? flavour.value[0].toLowerCase() : ""}/profiles` });
                break;
            default:
        }
    });

    if (isAltView.value) {
        crumbs.push({ name: "Alternate Profiles", url: `${route.path}?_profile=${ALT_PROFILES_TOKEN}` });
    }
    return crumbs;
}

function getProperties() {
    // find subject & handle top-level vs feature collections & features
    let nodeList: (Quad_Subject | Quad_Object)[] = [];
    const countQuad = store.value.getQuads(null, namedNode(qname("prez:count")), null, null)[0];
    count.value = parseInt(countQuad.object.value);
    if (TOP_LEVEL_TYPES.includes(countQuad.subject.value)) {
        nodeList = store.value.getSubjects(namedNode(qname("a")), countQuad.subject, null);

        // for /c/profiles, etc. need to look for prez:CatPrezProfile, etc.
    } else {
        nodeList = store.value.getObjects(countQuad.subject, namedNode(qname("rdfs:member")), null);
    }

    // get label & description predicates
    const labelPredicates = defaultProfile.value!.labelPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_LABEL_PREDICATES;
    const descPredicates = defaultProfile.value!.descriptionPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_DESC_PREDICATES;

    // fill out item list & handle vocprez items
    nodeList.forEach(member => {
        let c: ListItemExtra = {
            iri: member.id,
            extras: {}
        };

        store.value.forEach(q => {
            if (labelPredicates.includes(q.predicate.value)) {
                c.title = q.object.value;
            } else if (descPredicates.includes(q.predicate.value)) {
                c.description = q.object.value;
            } else if (q.predicate.value === qname("prez:link")) {
                c.link = q.object.value;
            } else if (flavour.value === "VocPrez" && q.predicate.value === qname("reg:status")) {
                const status: ListItemSortable = {iri: q.object.value, label: getIRILocalName(q.object.value)};

                store.value.forObjects(result => {
                    status.label = result.value;
                }, q.object, qname("rdfs:label"), null);

                store.value.forObjects(result => {
                    status.color = result.value;
                }, q.object, qname("sdo:color"), null);
                c.extras.status = status;
            } else if (flavour.value === "VocPrez" && q.predicate.value === qname("prov:qualifiedDerivation")) {
                store.value.forObjects(result => {
                    const mode: ListItemSortable = {iri: result.value, label: getIRILocalName(result.value)};

                    store.value.forObjects(innerResult => {
                        mode.label = innerResult.value;
                    }, result,qname("rdfs:label"), null);

                    c.extras.derivationMode = mode;
                }, q.object, qname("prov:hadRole"), null);
            }
        }, member, null, null, null);
        items.value.push(c);
    });

    // sort by title first, then by IRI if no title
    items.value.sort((a, b) => {
        if (a.title && b.title) {
            return a.title.localeCompare(b.title);
        } else if (a.title) {
            return -1;
        } else if (b.title) {
            return 1;
        } else {
            return a.iri.localeCompare(b.iri);
        }
    });
}

function getIRILocalName(iri: string) {
    let result = iri.split("#");
    if (result.length === 1) {
        return result[0].split("/").slice(-1)[0]
    }
    else {
        return result.slice(-1)[0];
    }
}

onBeforeMount(() => {
    // inspect route to infer type & Prez flavour
    if (route.path.startsWith("/c/")) {
        flavour.value = "CatPrez";
        if (route.path.match(/c\/profiles/)) {
            configByType(qname("prof:Profile"));
        } else if (route.path.match(/c\/catalogs/)) {
            configByType(qname("dcat:Catalog"));
        }
    } else if (route.path.startsWith("/s/")) {
        flavour.value = "SpacePrez";
        if (route.path.match(/s\/profiles/)) {
            configByType(qname("prof:Profile"));
        } else if (route.path.match(/s\/datasets\/.+\/collections\/.+\/items/)) {
            configByType(qname("geo:Feature"));
        } else if (route.path.match(/s\/datasets\/.+\/collections/)) {
            configByType(qname("geo:FeatureCollection"));
        } else if (route.path.match(/s\/datasets/)) {
            configByType(qname("dcat:Dataset"));
        }
    } if (route.path.startsWith("/v/")) {
        flavour.value = "VocPrez";
        if (route.path.match(/v\/profiles/)) {
            configByType(qname("prof:Profile"));
        } else if (route.path.match(/v\/vocab/)) {
            configByType(qname("skos:ConceptScheme"));
        } else if (route.path.match(/v\/collection/)) {
            configByType(qname("skos:Collection"));
        }
    } else if (route.path.startsWith("/profiles")) {
        configByType(qname("prof:Profile"));
    }

    // check if alt profile & no mediatype, then show alt profiles page
    if (route.query._profile === ALT_PROFILES_TOKEN && !route.query._mediatype) {
        isAltView.value = true;
    }
});

onMounted(() => {
    doRequest(`${apiBaseUrl}${route.fullPath}`, () => {
        defaultProfile.value = ui.profiles[profiles.value.find(p => p.default)!.uri];
        
        // if specify mediatype, or profile is not default or alt, redirect to API
        if ((route.query && route.query._profile) &&
            (route.query._mediatype || ![defaultProfile.value.token, ALT_PROFILES_TOKEN].includes(route.query._profile as string))) {
                window.location.replace(`${apiBaseUrl}${route.path}?_profile=${route.query._profile}${route.query._mediatype ? `&_mediatype=${route.query._mediatype}` : ""}`);
        }

        // disable right nav if AltView
        if (isAltView.value) {
            ui.rightNavConfig = { enabled: false };
        } else {
            ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        }

        parseIntoStore(data.value);
        getProperties();

        document.title = `${itemType.value.label} | Prez`;
        ui.breadcrumbs = getBreadcrumbs();
    });
});
</script>

<template>
    <ProfilesTable v-if="isAltView" :profiles="profiles" :path="route.path" />
    <template v-else>
        <h1 class="page-title">{{ itemType.label }}</h1>
        <p>A list of <a :href="itemType.uri" target="_blank" rel="noopener noreferrer">{{ itemType.label }}.</a></p>
        <p v-if="items.length > 0">Showing {{ items.length }} of {{ count }} items.</p>
        <template v-if="error">
            <ErrorMessage :message="error" />
        </template>
        <template v-else-if="loading">
            <i class="fa-regular fa-spinner-third fa-spin"></i> Loading...
        </template>
        <template v-else-if="items.length > 0">
            <SortableTabularList v-if="flavour === 'VocPrez'" :items="items" :predicates="['description', 'status', 'derivationMode']" />
            <ItemList v-else :items="items" :childName="childrenConfig.buttonTitle" :childLink="childrenConfig.buttonLink" />
            <PaginationComponent :url="route.path" :totalCount="count" :currentPage="currentPageNumber" />
        </template>
        <template v-else>No {{ itemType.label }} found.</template>
        <Teleport v-if="searchEnabled && flavour" to="#right-bar-content">
            <AdvancedSearch :flavour="flavour" :query="searchDefaults" />
        </Teleport>
    </template>
</template>

<style lang="scss" scoped>

</style>