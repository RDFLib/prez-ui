<script lang="ts" setup>
import { ref, computed, onMounted, inject, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { BlankNode, DataFactory, Quad, Store } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey, type ListItem, type AnnotatedQuad, type Breadcrumb, type Concept, type PrezFlavour, type Profile, type ListItemExtra, type ListItemSortable } from "@/types";
import PropTable from "@/components/proptable/PropTable.vue";
import ConceptComponent from "@/components/ConceptComponent.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";
import MapClient from "@/components/MapClient.vue";
import type { WKTResult } from "@/stores/mapSearchStore.d";
import SortableTabularList from "@/components/SortableTabularList.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const DEFAULT_LABEL_PREDICATES = [qname("rdfs:label")];
const DEFAULT_DESC_PREDICATES = [qname("dcterms:description")];
const DEFAULT_GEO_PREDICATES = [qname("geo:hasBoundingBox"), qname("geo:hasGeometry")];
const DEFAULT_CHILDREN_PREDICATES = [qname("rdfs:member"), qname("skos:member"), qname("dcterms:hasPart")];
const RECURSION_LIMIT = 5; // limit on recursive search of blank nodes
const ALT_PROFILES_TOKEN = "lt-prfl:alt-profile";

const item = ref<ListItem>({} as ListItem);
const children = ref<ListItemExtra[]>([]);
const concepts = ref<Concept[]>([]); // only for vocab
const properties = ref<AnnotatedQuad[]>([]);
const blankNodes = ref<AnnotatedQuad[]>([]);
const collapseConcepts = ref(true); // only for vocab
const geoResults = ref<WKTResult[]>([]); // for spatial results
const isAltView = ref(false);
const isObjectView = ref(false);
const flavour = ref<PrezFlavour | null>(null);
const searchEnabled = ref(false);
const searchDefaults = ref<{[key: string]: string}>({});
const childrenPredicate = ref("");
const hiddenPredicates = ref<string[]>([
    qname("a"),
    qname("dcterms:identifier"),
    qname("prez:count")
]);
const defaultProfile = ref<Profile | null>(null);
const childrenConfig = ref({
    showChildren: false,
    childrenTitle: "",
    showButton: false,
    buttonTitle: "",
    buttonLink: ""
});

function configByType(type: string) {
    item.value.type = type;
    switch (type) {
        case qname("dcat:Catalog"):
            searchEnabled.value = true;
            searchDefaults.value = { catalog: item.value.iri };
            childrenConfig.value = {
                ...childrenConfig.value,
                showChildren: true,
                childrenTitle: "Resources"
            };
            break;
        case qname("dcat:Resource"):
            break;
        case qname("dcat:Dataset"):
            searchEnabled.value = true;
            searchDefaults.value = { dataset: item.value.iri };
            childrenConfig.value = {
                showChildren: false,
                showButton: true,
                childrenTitle: "Members",
                buttonTitle: "Collections",
                buttonLink: "/collections"
            };
            break;
        case qname("geo:FeatureCollection"):
            searchEnabled.value = true;
            searchDefaults.value = { collection: item.value.iri };
            childrenConfig.value = {
                showChildren: false,
                showButton: true,
                childrenTitle: "Members",
                buttonTitle: "Features",
                buttonLink: "/items"
            };
            break;
        case qname("geo:Feature"):
            break;
        case qname("skos:ConceptScheme"):
            searchEnabled.value = true;
            searchDefaults.value = { vocab: item.value.iri };
            hiddenPredicates.value.push(qname("skos:hasTopConcept"));
            childrenConfig.value.showChildren = true;
            break;
        case qname("skos:Collection"):
            childrenConfig.value = {
                ...childrenConfig.value,
                showChildren: true,
                childrenTitle: "Concepts"
            };
            break;
        case qname("skos:Concept"):
            break;
        case qname("prof:Profile"):
            break;
        default:
    }
}

function getProperties() {
    // find subject
    const subject = isObjectView.value ? namedNode(route.query.uri as string) : store.value.getSubjects(namedNode(qname("a")), namedNode(item.value.type!), null)[0];
    item.value.iri = subject.id;

    // get label & description predicates
    const labelPredicates = defaultProfile.value!.labelPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_LABEL_PREDICATES;
    const descPredicates = defaultProfile.value!.descriptionPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_DESC_PREDICATES;
    hiddenPredicates.value.push(...[...labelPredicates, ...descPredicates]);

    // get attributes for item object, fill out properties
    store.value.forEach(q => {
        if (labelPredicates.includes(q.predicate.value)) {
            item.value.title = q.object.value;
        } else if (descPredicates.includes(q.predicate.value)) {
            item.value.description = q.object.value;
        } else if (DEFAULT_CHILDREN_PREDICATES.includes(q.predicate.value)) {
            childrenPredicate.value = q.predicate.value;
            hiddenPredicates.value.push(q.predicate.value);
        } else if (q.predicate.value === qname("a") && isObjectView.value) {
            configByType(q.object.value);
        } else if (DEFAULT_GEO_PREDICATES.indexOf(q.predicate.value) >= 0) {
            store.value.forEach(geoQ => {
                geoResults.value.push({
                    label: "",
                    fcLabel: "",
                    wkt: geoQ.object.value,
                    uri: item.value.iri,
                    link: `/object?uri=${item.value.iri}`
                })
            }, q.object, namedNode(qname("geo:asWKT")), null, null)
        }

        if (!isAltView.value) {
            const annoQuad = createAnnoQuad(q, store.value);
            properties.value.push(annoQuad);

            let recursionCounter = 0;
            findBlankNodes(q, store.value, recursionCounter);
        }
    }, subject, null, null, null);

    // set the item title after the item title has been set
    geoResults.value.forEach(result => {
        result.label = item.value.title ? item.value.title : item.value.iri
    });
}

function getBreadcrumbs(): Breadcrumb[] {
    // if /object, then use home/object/<object>
    // else, build out the breadcrumbs using the URL path
    let crumbs: Breadcrumb[] = [];
    
    if (isObjectView.value) {
        crumbs.push({ name: "Get Object by URI", url: "/object" });
    } else {
        if (flavour.value) {
            crumbs.push({ name: getPrezSystemLabel(flavour.value) + " Home", url: `/${flavour.value[0].toLowerCase()}`});
        }
        const pathSegments = route.path.split("/").slice(1, -1);
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
                        crumbs.push({ name: "Catalog", url: `/c/catalogs/${route.params.catalogId}` });
                        skipSegment = true;
                    }
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
                    if (index + 1 !== pathSegments.length) {
                        crumbs.push({ name: "Vocabulary", url: `/v/vocab/${route.params.vocabId}` });
                        skipSegment = true;
                    }
                    break;
                case "collection":
                    crumbs.push({ name: "Collections", url: "/v/collection" });
                    if (index + 1 !== pathSegments.length) {
                        crumbs.push({ name: "Collection", url: `/v/vocab/${route.params.collectionId}` });
                        skipSegment = true;
                    }
                    break;
                case "profiles":
                    crumbs.push({ name: "Profiles", url: `${flavour.value ? flavour.value[0].toLowerCase() : ""}/profiles` });
                    break;
                default:
            }
        });
    }

    crumbs.push({ name: item.value.title || item.value.iri, url: route.path });
    if (isAltView.value) {
        crumbs.push({ name: "Alternate Profiles", url: `${route.path}?_profile=${ALT_PROFILES_TOKEN}` });
    }
    return crumbs;
}

function getChildren() {
    if (item.value.type === qname("skos:ConceptScheme")) {
        getConcepts();
    } else {
        const labelPredicates = defaultProfile.value!.labelPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_LABEL_PREDICATES;

        store.value.forObjects((obj) => {
            let child: ListItemExtra = {
                iri: obj.id,
                extras: {}
            };

            store.value.forEach(q => {
                if (labelPredicates.includes(q.predicate.value)) {
                    child.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    child.link = q.object.value;
                } else if (q.predicate.value === qname("a")) {
                    child.type = q.object.value;
                } else if (item.value.type === qname("dcat:Catalog") && q.predicate.value === qname("dcterms:publisher")) {
                    const publisher: ListItemSortable = { label: q.object.value };
                    child.extras.publisher = publisher;
                } else if (item.value.type === qname("dcat:Catalog") && q.predicate.value === qname("dcterms:creator")) {
                    const creator: ListItemSortable = { label: q.object.value };
                    child.extras.creator = creator;
                } else if (item.value.type === qname("dcat:Catalog") && q.predicate.value === qname("dcterms:issued")) {
                    const issued: ListItemSortable = { label: q.object.value };
                    child.extras.issued = issued;
                } 
            }, obj, null, null, null);

            children.value.push(child);
        }, namedNode(item.value.iri), namedNode(childrenPredicate.value), null);

        // sort by title, then by IRI
        children.value.sort((a, b) => {
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
}

function getConcepts() {
    let conceptArray: Concept[] = [];
    
    store.value.forSubjects(subject => {
        let c: Concept = {
            iri: subject.id,
            narrower: [],
            broader: "",
            title: "",
            link: ""
        };
        store.value.forEach(q => {
            if (q.predicate.value === qname("skos:prefLabel")) {
                c.title = q.object.value;
            } else if (q.predicate.value === qname("prez:link")) {
                c.link = q.object.value;
            } else if (q.predicate.value === qname("skos:narrower")) {
                c.narrower.push(q.object.value);
            } else if (q.predicate.value === qname("skos:broader")) {
                c.broader = q.object.value;
            }
        }, subject, null, null, null);
        conceptArray.push(c);
    }, namedNode(qname("skos:inScheme")), namedNode(item.value.iri), null);

    // get top concepts
    const hasTopConcepts = store.value.getObjects(namedNode(item.value.iri), namedNode(qname("skos:hasTopConcept")), null).map(o => o.id);
    const topConceptsOf = store.value.getSubjects(namedNode(qname("skos:topConceptOf")), namedNode(item.value.iri), null).map(s => s.id);
    const topConcepts = [...new Set([...hasTopConcepts, ...topConceptsOf])]; // merge & remove duplicates

    // build concept hierarchy tree
    const indexMap = conceptArray.reduce<{[iri: string]: number}>((obj, c, i) => {
        obj[c.iri] = i;
        return obj;
    }, {});

    let conceptsList: Concept[] = [];
    conceptArray.forEach(c => {
        if (c.narrower.length > 0) {
            c.narrower.forEach(n => conceptArray[indexMap[n]].broader = c.iri);
        }

        if (topConcepts.includes(c.iri)) {
            conceptsList.push(c);
            return;
        }

        if (!!c.broader) {
            const parent = conceptArray[indexMap[c.broader]];
            parent.children = [...(parent.children || []), c];
        }
    });
    concepts.value = conceptsList;
}

function createAnnoQuad(q: Quad, store: Store): AnnotatedQuad {
    return {
        subject: q.subject,
        predicate: {
            termType: q.predicate.termType,
            value: q.predicate.value,
            id: q.predicate.id,
            annotations: store.getQuads(q.predicate, null, null, null)
        },
        object: q.object,
        value: q.value,
        graph: q.graph,
        termType: q.termType,
        equals: q.equals,
        toJSON: q.toJSON
    };
}

function findBlankNodes(q: Quad, store: Store, recursionCounter: number) {
    if (q.object instanceof BlankNode) {
        recursionCounter++;
        store.forEach(q1 => {
            const annoQuad1 = createAnnoQuad(q1, store);
            blankNodes.value.push(annoQuad1);
            if (recursionCounter < RECURSION_LIMIT) {
                findBlankNodes(q1, store, recursionCounter);
            }
        }, q.object, null, null, null)
    }
}

onBeforeMount(() => {
    // inspect route to infer type & Prez flavour
    if (route.path.startsWith("/c/")) {
        flavour.value = "CatPrez";
        if (route.path.match(/c\/profiles\/.+/)) {
            configByType(qname("prof:Profile"));
        } else if (route.path.match(/c\/catalogs\/.+\/.+/)) {
            configByType(qname("dcat:Resource"));
        } else if (route.path.match(/c\/catalogs\/.+/)) {
            configByType(qname("dcat:Catalog"));
        }
    } else if (route.path.startsWith("/s/")) {
        flavour.value = "SpacePrez";
        if (route.path.match(/s\/profiles\/.+/)) {
            configByType(qname("prof:Profile"));
        } else if (route.path.match(/s\/datasets\/.+\/collections\/.+\/items\/.+/)) {
            configByType(qname("geo:Feature"));
        } else if (route.path.match(/s\/datasets\/.+\/collections\/.+/)) {
            configByType(qname("geo:FeatureCollection"));
        } else if (route.path.match(/s\/datasets\/.+/)) {
            configByType(qname("dcat:Dataset"));
        }
    } else if (route.path.startsWith("/v/")) {
        flavour.value = "VocPrez";
        if (route.path.match(/v\/profiles\/.+/)) {
            configByType(qname("prof:Profile"));
        } else if (route.path.match(/v\/vocab\/.+\/.+/)) {
            configByType(qname("skos:Concept"));
        } else if (route.path.match(/v\/collection\/.+\/.+/)) {
            // concept in collection
            configByType(qname("skos:Concept"));
        } else if (route.path.match(/v\/vocab\/.+/)) {
            configByType(qname("skos:ConceptScheme"));
        } else if (route.path.match(/v\/collection\/.+/)) {
            configByType(qname("skos:Collection"));
        }
    } else if (route.path.startsWith("/profiles/")) {
        configByType(qname("prof:Profile"));
    } else if (route.path.startsWith("/object")) {
        isObjectView.value = true;
    }

    // check if alt profile & no mediatype, then show alt profiles page
    if (route.query._profile === ALT_PROFILES_TOKEN && !route.query._mediatype) {
        isAltView.value = true;
    }
});

onMounted(() => {
    doRequest(`${apiBaseUrl}${route.fullPath}`, () => {
        // find the current/default profile
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
        if (!isAltView.value && childrenConfig.value.showChildren) {
            getChildren();
        }

        document.title = item.value.title ? `${item.value.title} | Prez` : "Prez";
        ui.breadcrumbs = getBreadcrumbs();
    });
});
</script>

<template>
    <ProfilesTable v-if="isAltView" :profiles="profiles" :path="route.path" />
    <template v-else>
        <PropTable v-if="properties.length > 0" :item="item" :properties="properties" :blankNodes="blankNodes" :prefixes="prefixes" :hiddenPreds="hiddenPredicates">
            <template #map>
                <MapClient v-if="geoResults.length"
                        ref="searchMapRef" 
                        :geo-w-k-t="geoResults"
                    />
            </template>
            <template v-if="item.type === qname('skos:ConceptScheme')" #bottom>
                <tr>
                    <th>Concepts</th>
                    <td>
                        <div class="concepts">
                            <button id="collapse-all-btn" @click="collapseConcepts = !collapseConcepts" class="btn">
                                <template v-if="collapseConcepts"><i class="fa-regular fa-plus"></i> Expand all</template>
                                <template v-else><i class="fa-regular fa-minus"></i> Collapse all</template>
                            </button>
                            <ConceptComponent v-for="concept in concepts" v-bind="concept" :baseUrl="route.path" :collapseAll="collapseConcepts" />
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else-if="childrenConfig.showChildren" #bottom>
                <tr>
                    <th>{{ childrenConfig.childrenTitle }}</th>
                    <SortableTabularList
                        v-if="item.type === qname('dcat:Catalog')"
                        :items="children"
                        :predicates="['publisher', 'creator', 'issued']"
                    />
                    <td v-else>
                        <div class="children-list">
                            <RouterLink v-for="child in children" :to="child.link || ''">{{ child.title || child.iri }}</RouterLink>
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else-if="childrenConfig.showButton && !isObjectView" #bottom>
                <tr>
                    <th>{{ childrenConfig.childrenTitle }}</th>
                    <td>
                        <RouterLink :to="`${route.path}${childrenConfig.buttonLink}`" class="btn">{{ childrenConfig.buttonTitle }}</RouterLink>
                    </td>
                </tr>
            </template>
        </PropTable>
        <template v-else-if="loading">
            <i class="fa-regular fa-spinner-third fa-spin"></i> Loading...
        </template>
        <template v-else-if="error">
            <ErrorMessage :message="error" />
        </template>
        <Teleport v-if="searchEnabled" to="#right-bar-content">
            <AdvancedSearch v-if="flavour" :flavour="flavour" :query="searchDefaults" />
        </Teleport>
    </template>
</template>


<style lang="scss" scoped>
.concepts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    button#collapse-all-btn {
        align-self: baseline;
    }
}

.children-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>