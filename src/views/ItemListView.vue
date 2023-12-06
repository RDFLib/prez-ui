<script lang="ts" setup>
import { onMounted, onBeforeMount, ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory, type Quad_Object, type Quad_Subject } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useApiRequest } from "@/composables/api";
import { apiBaseUrlConfigKey, perPageConfigKey, type Breadcrumb, type PrezFlavour, type Profile, type ListItemExtra, type ListItemSortable } from "@/types";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";
import { sortByTitle, getBaseClassFromLink, ensureAnnotationPredicates, getLabel, getDescription, getObjects } from "@/util/helpers";
import { ALT_PROFILE_CURIE } from "@/util/consts";
import ItemList from "@/components/ItemList.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import SortableTabularList from "@/components/SortableTabularList.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import SearchBar from "@/components/search/SearchBar.vue";

const { namedNode, literal } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const defaultPerPage = inject(perPageConfigKey) as number;
const route = useRoute();
const ui = useUiStore();
const { loading, error, apiGetRequest } = useApiRequest();
const { store, parseIntoStore, qnameToIri, iriToQname } = useRdfStore();

const TOP_LEVEL_TYPES = [
    qnameToIri("dcat:Catalog"),
    qnameToIri("dcat:Dataset"),
    qnameToIri("skos:ConceptScheme"),
    qnameToIri("skos:Collection"),
    qnameToIri("prof:Profile"),
    qnameToIri("prez:CatPrezProfile"),
    qnameToIri("prez:SpacePrezProfile"),
    qnameToIri("prez:VocPrezProfile"),
];

// const parent = ref<ListItem>({} as ListItem); // might need to store parent info (dataset & feature collection)
const items = ref<ListItemExtra[]>([]);
const itemType = ref({
    uri: "",
    label: ""
});
const count = ref(0);
const isAltView = ref(false);
const flavour = ref<PrezFlavour | null>(null);
const currentProfile = ref<Profile | null>(null);
const searchEnabled = ref(false);
const searchDefaults = ref<{[key: string]: string}>({});
const childrenConfig = ref({
    showButton: false,
    buttonTitle: "",
    buttonLink: ""
});
const perPage = ref(Number(defaultPerPage));
const searchConfig = ref<{
    containerUri?: string;
    containerBaseClass?: string;
    baseClass?: string;
}>({});

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
        case qnameToIri("dcat:Catalog"):
            itemType.value.label = "Catalogs";
            searchEnabled.value = true;
            childrenConfig.value = {
                showButton: true,
                buttonTitle: "Resources",
                buttonLink: "/resources"
            };
            // searchDefaults.value = { catalog: item.value.iri };
            break;
        case qnameToIri("dcat:Resource"):
            itemType.value.label = "Resources";
            searchEnabled.value = true;
            // searchDefaults.value = { catalog: item.value.iri };
            break;
        case qnameToIri("dcat:Dataset"):
            itemType.value.label = "Datasets";
            searchEnabled.value = true;
            // searchDefaults.value = { dataset: item.value.iri };
            childrenConfig.value = {
                showButton: true,
                buttonTitle: "Collections",
                buttonLink: "/collections"
            };
            break;
        case qnameToIri("geo:FeatureCollection"):
            itemType.value.label = "Feature Collections";
            searchEnabled.value = true;
            // searchDefaults.value = { collection: item.value.iri };
            childrenConfig.value = {
                showButton: true,
                buttonTitle: "Features",
                buttonLink: "/items"
            };
            break;
        case qnameToIri("geo:Feature"):
            itemType.value.label = "Features";
            searchEnabled.value = true;
            break;
        case qnameToIri("skos:ConceptScheme"):
            itemType.value.label = "Vocabularies";
            searchEnabled.value = true;
            // searchDefaults.value = { vocab: item.value.iri };
            break;
        case qnameToIri("skos:Collection"):
            itemType.value.label = "Collections";
            break;
        case qnameToIri("prof:Profile"):
        case qnameToIri("prez:CatPrezProfile"):
        case qnameToIri("prez:SpacePrezProfile"):
        case qnameToIri("prez:VocPrezProfile"):
            itemType.value.label = "Profiles";
            break;
        default:
    }
}

function getBreadcrumbs(): Breadcrumb[] {
    // get parents info
    let parents: {
        id: string;
        title?: string;
        uri: string;
    }[] = [];

    const pathSegments = route.path.split("/").slice(1);

    pathSegments.forEach((id, index) => {
        const quads = store.value.getQuads(null, namedNode(qnameToIri("dcterms:identifier")), literal(id, namedNode(qnameToIri("prez:identifier"))), null);
        if (quads.length > 0) {
            let parent: {
                id: string;
                title?: string;
                uri: string;
            } = {
                id: id,
                uri: quads[0].subject.value
            };

            parent.title = getLabel(quads[0].subject.value, store.value);
            
            parents.push(parent);
        }
    });

    // build out the breadcrumbs using the URL path
    let crumbs: Breadcrumb[] = [];
    
    if (flavour.value) {
        crumbs.push({ name: getPrezSystemLabel(flavour.value) + " Home", url: `/${flavour.value[0].toLowerCase()}`});
    }
    
    let skipSegment = false;
    pathSegments.forEach((pathSegment, index) => {
        if (skipSegment) { // skip segment when an ID appears
            skipSegment = false;
            return;
        }
        switch (pathSegment) {
            case "catalogs":
                crumbs.push({ name: "Catalogs", url: "/c/catalogs" });
                if (index + 1 !== pathSegments.length) {
                    crumbs.push({ name: parents[0].title || parents[0].uri, url: `/c/catalogs/${route.params.catalogId}` });
                    skipSegment = true;
                }
                break;
            case "resources":
                crumbs.push({ name: "Resources", url: `/c/catalogs/${route.params.catalogId}/resources` });
                break;
            case "datasets":
                crumbs.push({ name: "Datasets", url: "/s/datasets" });
                if (index + 1 !== pathSegments.length) {
                    crumbs.push({ name: parents[0].title || parents[0].uri, url: `/s/datasets/${route.params.datasetId}` });
                    skipSegment = true;
                }
                break;
            case "collections":
                crumbs.push({ name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` });
                if (index + 1 !== pathSegments.length) {
                    crumbs.push({ name: parents[1].title || parents[1].uri, url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` });
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
        crumbs.push({ name: "Alternate Profiles", url: `${route.path}?_profile=${ALT_PROFILE_CURIE}` });
    }
    return crumbs;
}

function getProperties() {
    // find subject & handle top-level vs feature collections & features
    let nodeList: (Quad_Subject | Quad_Object)[] = [];
    const countQuad = store.value.getQuads(null, namedNode(qnameToIri("prez:count")), null, null)[0]; // isAltView breaks here - prez:count doesn't exist
    count.value = parseInt(countQuad.object.value);
    if (TOP_LEVEL_TYPES.includes(countQuad.subject.value)) {
        nodeList = store.value.getSubjects(namedNode(qnameToIri("a")), countQuad.subject, null);
        searchConfig.value = {
            baseClass: itemType.value.uri
        };

        // for /c/profiles, etc. need to look for prez:CatPrezProfile, etc.
    } else {
        nodeList = getObjects(countQuad.subject.value, [qnameToIri("rdfs:member"), qnameToIri("dcterms:hasPart")], store.value);
        const containerBaseClass = iriToQname(getBaseClassFromLink(route.path.slice(0, route.path.lastIndexOf("/"))).iri);
        searchConfig.value = {
            containerUri: countQuad.subject.value,
            containerBaseClass: containerBaseClass === "geo:FeatureCollection" ? "dcat:Dataset" : containerBaseClass // fix FC to dataset as search treats them as the same
        };
    }

    // fill out item list & handle vocprez items
    nodeList.forEach(member => {
        let c: ListItemExtra = {
            iri: member.id,
            extras: {}
        };

        c.title = getLabel(c.iri, store.value);
        c.description = getDescription(c.iri, store.value);

        store.value.forEach(q => {
            if (q.predicate.value === qnameToIri("prez:link")) {
                c.link = q.object.value;
            } else if (flavour.value === "VocPrez" && q.predicate.value === qnameToIri("reg:status")) {
                const status: ListItemSortable = {
                    iri: q.object.value,
                    label: getLabel(q.object.value, store.value) || getIRILocalName(q.object.value)
                };

                store.value.forObjects(result => {
                    status.color = result.value;
                }, q.object, qnameToIri("sdo:color"), null);

                c.extras.status = status;
            } else if (flavour.value === "VocPrez" && q.predicate.value === qnameToIri("prov:qualifiedDerivation")) {
                store.value.forObjects(result => {
                    const mode: ListItemSortable = {
                        iri: result.value,
                        label: getLabel(result.value, store.value) || getIRILocalName(result.value)
                    };

                    c.extras.derivationMode = mode;
                }, q.object, qnameToIri("prov:hadRole"), null);
            } else if (itemType.value.uri === qnameToIri("dcat:Resource") && q.predicate.value === qnameToIri("dcterms:publisher")) {
                const publisher: ListItemSortable = {
                    iri: q.object.value,
                    label: getLabel(q.object.value, store.value) || getIRILocalName(q.object.value)
                };

                c.extras.publisher = publisher;
            } else if (itemType.value.uri === qnameToIri("dcat:Resource") && q.predicate.value === qnameToIri("dcterms:creator")) {
                const creator: ListItemSortable = {
                    iri: q.object.value,
                    label: getLabel(q.object.value, store.value) || getIRILocalName(q.object.value)
                };
                
                c.extras.creator = creator;
            } else if (itemType.value.uri === qnameToIri("dcat:Resource") && q.predicate.value === qnameToIri("dcterms:issued")) {
                const issued: ListItemSortable = { label: q.object.value };
                c.extras.issued = issued;
            } 
        }, member, null, null, null);

        items.value.push(c);
    });

    items.value.sort(sortByTitle);
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
            configByType(qnameToIri("prof:Profile"));
        } else if (route.path.match(/c\/catalogs\/.+\/resources/)) {
            configByType(qnameToIri("dcat:Resource"));
        } else if (route.path.match(/c\/catalogs/)) {
            configByType(qnameToIri("dcat:Catalog"));
        }
    } else if (route.path.startsWith("/s/")) {
        flavour.value = "SpacePrez";
        if (route.path.match(/s\/profiles/)) {
            configByType(qnameToIri("prof:Profile"));
        } else if (route.path.match(/s\/datasets\/.+\/collections\/.+\/items/)) {
            configByType(qnameToIri("geo:Feature"));
        } else if (route.path.match(/s\/datasets\/.+\/collections/)) {
            configByType(qnameToIri("geo:FeatureCollection"));
        } else if (route.path.match(/s\/datasets/)) {
            configByType(qnameToIri("dcat:Dataset"));
        }
    } if (route.path.startsWith("/v/")) {
        flavour.value = "VocPrez";
        if (route.path.match(/v\/profiles/)) {
            configByType(qnameToIri("prof:Profile"));
        } else if (route.path.match(/v\/vocab/)) {
            configByType(qnameToIri("skos:ConceptScheme"));
        } else if (route.path.match(/v\/collection/)) {
            configByType(qnameToIri("skos:Collection"));
        }
    } else if (route.path.startsWith("/profiles")) {
        configByType(qnameToIri("prof:Profile"));
    }

    // check if alt profile & no mediatype, then show alt profiles page
    if (route.query._profile === ALT_PROFILE_CURIE && !route.query._mediatype) {
        isAltView.value = true;
    }

    if (route.query.per_page) {
        perPage.value = Number(route.query.per_page);
    }
});

onMounted(async () => {
    loading.value = true;

    let fullPath = "";
    if (Object.keys(route.query).length > 0) {
        fullPath = route.fullPath;
        if (isAltView.value) { // remove alt profile qsa to get title for breadcrumbs - already have profile info in pinia/link headers
            fullPath = fullPath.replace(`_profile=${ALT_PROFILE_CURIE}`, "");
        }

        if (!route.query.per_page) {
            fullPath += `&per_page=${perPage.value}`;
        }
    } else {
        fullPath = `${route.path}?per_page=${perPage.value}`;
    }

    const { data, profiles } = await apiGetRequest(fullPath);
    if (data && profiles.length > 0 && !error.value) {
        currentProfile.value = ui.profiles[profiles.find(p => p.current)!.uri];
            
        // if specify mediatype, or profile is not default or alt, redirect to API
        if ((route.query && route.query._profile) &&
            (route.query._mediatype || ![currentProfile.value.token, ALT_PROFILE_CURIE].includes(route.query._profile as string))) {
                window.location.replace(`${apiBaseUrl}${route.path}?_profile=${route.query._profile}${route.query._mediatype ? `&_mediatype=${route.query._mediatype}` : ""}`);
        }

        // disable right nav if AltView
        ui.rightNavConfig = {
            enabled: !isAltView.value,
            profiles: profiles,
            currentUrl: route.path
        };

        parseIntoStore(data);
        await ensureAnnotationPredicates();
        getProperties();

        document.title = `${itemType.value.label} | Prez`;
        ui.breadcrumbs = getBreadcrumbs();
    }
});
</script>

<template>
    <ProfilesTable v-if="isAltView" />
    <template v-else>
        <h1 class="page-title">{{ itemType.label }}</h1>
        <p>A list of <a :href="itemType.uri" target="_blank" rel="noopener noreferrer">{{ itemType.label }}.</a></p>
        <p v-if="!loading && items.length > 0">Showing {{ items.length }} of {{ count }} items.</p>
        <ErrorMessage v-if="error" :message="error" />
        <LoadingMessage v-else-if="loading" />
        <template v-else-if="items.length > 0">
            <SortableTabularList v-if="flavour === 'VocPrez'" :items="items" :predicates="['description', 'status', 'derivationMode']" />
            <SortableTabularList v-else-if="itemType.uri === qnameToIri('dcat:Resource')" :items="items" :predicates="['publisher', 'creator', 'issued']"/>
            <ItemList v-else :items="items" :childName="childrenConfig.buttonTitle" :childLink="childrenConfig.buttonLink" />
            <PaginationComponent :url="route.path" :totalCount="count" :currentPage="currentPageNumber" :perPage="perPage" />
        </template>
        <template v-else>No {{ itemType.label }} found.</template>
        <Teleport v-if="searchEnabled" to="#search-teleport">
            <SearchBar v-bind="searchConfig" />
        </Teleport>
    </template>
</template>

<style lang="scss" scoped>

</style>