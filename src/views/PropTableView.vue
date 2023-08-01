<script lang="ts" setup>
import { ref, computed, onMounted, inject, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { BlankNode, DataFactory, Quad, Store, Literal } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey, enableScoresKey, type ListItem, type AnnotatedQuad, type Breadcrumb, type Concept, type PrezFlavour, type Profile, type ListItemExtra, type ListItemSortable } from "@/types";
import PropTable from "@/components/proptable/PropTable.vue";
import ConceptComponent from "@/components/ConceptComponent.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";
import MapClient from "@/components/MapClient.vue";
import type { WKTResult } from "@/stores/mapSearchStore.d";
import SortableTabularList from "@/components/SortableTabularList.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import { ensureProfiles, titleCase } from "@/util/helpers";
import ScoreWidget from "@/components/scores/ScoreWidget.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const enableScores = inject(enableScoresKey) as boolean;
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qnameToIri, iriToQname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const DEFAULT_LABEL_PREDICATES = [qnameToIri("rdfs:label")];
const DEFAULT_DESC_PREDICATES = [qnameToIri("dcterms:description")];
const DEFAULT_GEO_PREDICATES = [qnameToIri("geo:hasBoundingBox"), qnameToIri("geo:hasGeometry")];
const DEFAULT_CHILDREN_PREDICATES = [qnameToIri("rdfs:member"), qnameToIri("skos:member"), qnameToIri("dcterms:hasPart")];
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
    qnameToIri("a"),
    qnameToIri("dcterms:identifier"),
    qnameToIri("prez:count"),
    "https://linked.data.gov.au/def/scores/hasScore"
]);
const defaultProfile = ref<Profile | null>(null);
const childrenConfig = ref({
    showChildren: false,
    childrenTitle: "",
    showButton: false,
    buttonTitle: "",
    buttonLink: ""
});
const hasScores = ref(false);
const scores = ref<{[key: string]: {[key: string]: number}}>({}); // {fair: {f: 0, a: 0, i: 0, r: 0}, ...}

function configByBaseClass(baseClass: string) {
    item.value.baseClass = baseClass;
    switch (baseClass) {
        case qnameToIri("dcat:Catalog"):
            searchEnabled.value = true;
            searchDefaults.value = { catalog: item.value.iri };
            childrenConfig.value = {
                ...childrenConfig.value,
                showChildren: true,
                childrenTitle: "Resources"
            };
            break;
        case qnameToIri("dcat:Resource"):
            break;
        case qnameToIri("dcat:Dataset"):
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
        case qnameToIri("geo:FeatureCollection"):
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
        case qnameToIri("geo:Feature"):
            break;
        case qnameToIri("skos:ConceptScheme"):
            searchEnabled.value = true;
            searchDefaults.value = { vocab: item.value.iri };
            hiddenPredicates.value.push(qnameToIri("skos:hasTopConcept"));
            childrenConfig.value.showChildren = true;
            break;
        case qnameToIri("skos:Collection"):
            childrenConfig.value = {
                ...childrenConfig.value,
                showChildren: true,
                childrenTitle: "Concepts"
            };
            break;
        case qnameToIri("skos:Concept"):
            break;
        case qnameToIri("prof:Profile"):
            break;
        default:
    }
}

function getProperties() {
    // find subject
    const subject = isObjectView.value ? namedNode(route.query.uri as string) : store.value.getSubjects(namedNode(qnameToIri("a")), namedNode(item.value.baseClass!), null)[0];
    item.value = {
        iri: subject.id,
        types: []
    };

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
        } else if (q.predicate.value === qnameToIri("a")) {
            configByBaseClass(q.object.value); // might not be needed anymore with the /object changes
            const typeLabel = store.value.getObjects(q.object, namedNode(qnameToIri("rdfs:label")), null);
            const typeDesc = store.value.getObjects(q.object, namedNode(qnameToIri("dcterms:description")), null);
            const typeQname = iriToQname(q.object.value);

            item.value.types!.push({
                value: q.object.value,
                qname: typeQname !== "" ? typeQname : undefined,
                label: typeLabel.length > 0 ? typeLabel[0].value : undefined,
                description: typeDesc.length > 0 ? typeDesc[0].value : undefined,
            });
        } else if (DEFAULT_GEO_PREDICATES.indexOf(q.predicate.value) >= 0) {
            store.value.forEach(geoQ => {
                geoResults.value.push({
                    label: "",
                    fcLabel: "",
                    wkt: geoQ.object.value,
                    uri: item.value.iri,
                    link: `/object?uri=${item.value.iri}`
                })
            }, q.object, namedNode(qnameToIri("geo:asWKT")), null, null)
        } else if (q.predicate.value === "https://linked.data.gov.au/def/scores/hasScore" && enableScores && !hasScores.value) {
            hasScores.value = true;
        }

        if (!isAltView.value) {
            const annoQuad = createAnnoQuad(q, store.value);
            properties.value.push(annoQuad);

            let recursionCounter = 0;
            findBlankNodes(q, store.value, recursionCounter);
        }
    }, subject, null, null, null);

    if (hasScores.value) {
        getScores();
    }

    // set the item title after the item title has been set
    geoResults.value.forEach(result => {
        result.label = item.value.title ? item.value.title : item.value.iri
    });
}

function getScore(scoreName: string, normalised: boolean = false): {[key: string]: number} {
    const scores: {[key: string]: number} = {};

    store.value.forObjects(o => {
        store.value.forEach(q => {
            store.value.forObjects(o2 => {
                store.value.forEach(q2 => {
                    const match = q2.predicate.value.match(`https:\/\/linked.data.gov.au\/def\/scores\/${scoreName}([A-Z]){1}Score${normalised ? "Normalised" : ""}`);
                    if (match) {
                        scores[match[1].toLowerCase()] = Number(q2.object.value);
                    }
                }, o2, null, null, null);
            }, q.subject, namedNode("http://purl.org/linked-data/cube#observation"), null);
        }, o, namedNode(qnameToIri("a")), namedNode(`https://linked.data.gov.au/def/scores/${titleCase(scoreName)}Score${normalised ? "Normalised" : ""}`), null);
    }, namedNode(item.value.iri), namedNode("https://linked.data.gov.au/def/scores/hasScore"), null);

    return scores;
}

function getScores() {
    scores.value = {
        fair: getScore("fair"),
        care: getScore("care"),
    };
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

function getIRILocalName(iri: string) {
    let result = iri.split("#");
    if (result.length === 1) {
        return result[0].split("/").slice(-1)[0]
    }
    else {
        return result.slice(-1)[0];
    }
}

function getChildren() {
    if (item.value.baseClass === qnameToIri("skos:ConceptScheme")) {
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
                } else if (q.predicate.value === qnameToIri("prez:link")) {
                    child.link = q.object.value;
                } else if (q.predicate.value === qnameToIri("a")) {
                    child.baseClass = q.object.value;
                } else if (item.value.baseClass === qnameToIri("dcat:Catalog") && q.predicate.value === qnameToIri("dcterms:publisher")) {
                    const publisher: ListItemSortable = { iri: q.object.value, label: getIRILocalName(q.object.value) };

                    store.value.forObjects(result => {
                        publisher.label = result.value;
                    }, q.object, qnameToIri("rdfs:label"), null);

                    child.extras.publisher = publisher;
                } else if (item.value.baseClass === qnameToIri("dcat:Catalog") && q.predicate.value === qnameToIri("dcterms:creator")) {
                    const creator: ListItemSortable = { iri: q.object.value, label: getIRILocalName(q.object.value) };

                    store.value.forObjects(result => {
                        creator.label = result.value;
                    }, q.object, qnameToIri("rdfs:label"), null);
                    
                    child.extras.creator = creator;
                } else if (item.value.baseClass === qnameToIri("dcat:Catalog") && q.predicate.value === qnameToIri("dcterms:issued")) {
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
            if (q.predicate.value === qnameToIri("skos:prefLabel")) {
                c.title = q.object.value;
            } else if (q.predicate.value === qnameToIri("prez:link")) {
                c.link = q.object.value;
            } else if (q.predicate.value === qnameToIri("skos:narrower")) {
                c.narrower.push(q.object.value);
            } else if (q.predicate.value === qnameToIri("skos:broader")) {
                c.broader = q.object.value;
            }
        }, subject, null, null, null);
        conceptArray.push(c);
    }, namedNode(qnameToIri("skos:inScheme")), namedNode(item.value.iri), null);

    // get top concepts
    const hasTopConcepts = store.value.getObjects(namedNode(item.value.iri), namedNode(qnameToIri("skos:hasTopConcept")), null).map(o => o.id);
    const topConceptsOf = store.value.getSubjects(namedNode(qnameToIri("skos:topConceptOf")), namedNode(item.value.iri), null).map(s => s.id);
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
            parent.children = [...(parent.children || []), c].sort((a, b) => a.title.localeCompare(b.title));
        }
    });
    conceptsList.sort((a, b) => a.title.localeCompare(b.title));
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
        object: {
            termType: q.object.termType,
            value: q.object.value,
            id: q.object.id,
            datatype: q.object instanceof Literal ? q.object.datatype : undefined,
            language: q.object instanceof Literal ? q.object.language : undefined,
            annotations: store.getQuads(q.object, null, null, null)
        },
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

function getQname(iri: string): string {
    let qname = "";
    Object.entries(prefixes).forEach(([prefix, prefixIri]) => {
        if (iri.startsWith(prefixIri)) {
            qname = prefix + ":" + iri.split(prefixIri)[1];
        }
    });
    return qname;
}

onBeforeMount(() => {
    // inspect route to infer type & Prez flavour
    if (route.path.startsWith("/c/")) {
        flavour.value = "CatPrez";
        if (route.path.match(/c\/profiles\/.+/)) {
            configByBaseClass(qnameToIri("prof:Profile"));
        } else if (route.path.match(/c\/catalogs\/.+\/.+/)) {
            configByBaseClass(qnameToIri("dcat:Resource"));
        } else if (route.path.match(/c\/catalogs\/.+/)) {
            configByBaseClass(qnameToIri("dcat:Catalog"));
        }
    } else if (route.path.startsWith("/s/")) {
        flavour.value = "SpacePrez";
        if (route.path.match(/s\/profiles\/.+/)) {
            configByBaseClass(qnameToIri("prof:Profile"));
        } else if (route.path.match(/s\/datasets\/.+\/collections\/.+\/items\/.+/)) {
            configByBaseClass(qnameToIri("geo:Feature"));
        } else if (route.path.match(/s\/datasets\/.+\/collections\/.+/)) {
            configByBaseClass(qnameToIri("geo:FeatureCollection"));
        } else if (route.path.match(/s\/datasets\/.+/)) {
            configByBaseClass(qnameToIri("dcat:Dataset"));
        }
    } else if (route.path.startsWith("/v/")) {
        flavour.value = "VocPrez";
        if (route.path.match(/v\/profiles\/.+/)) {
            configByBaseClass(qnameToIri("prof:Profile"));
        } else if (route.path.match(/v\/vocab\/.+\/.+/)) {
            configByBaseClass(qnameToIri("skos:Concept"));
        } else if (route.path.match(/v\/collection\/.+\/.+/)) {
            // concept in collection
            configByBaseClass(qnameToIri("skos:Concept"));
        } else if (route.path.match(/v\/vocab\/.+/)) {
            configByBaseClass(qnameToIri("skos:ConceptScheme"));
        } else if (route.path.match(/v\/collection\/.+/)) {
            configByBaseClass(qnameToIri("skos:Collection"));
        }
    } else if (route.path.startsWith("/profiles/")) {
        configByBaseClass(qnameToIri("prof:Profile"));
    } else if (route.path.startsWith("/object")) {
        isObjectView.value = true;
    }

    // check if alt profile & no mediatype, then show alt profiles page
    if (route.query._profile === ALT_PROFILES_TOKEN && !route.query._mediatype) {
        isAltView.value = true;
    }
});

onMounted(() => {
    loading.value = true;
    // wait for profiles to be set in Pinia
    ensureProfiles().then(() => {
        console.log("profiles ready")
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
            <template v-if="item.baseClass === qnameToIri('skos:ConceptScheme')" #bottom>
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
                        v-if="item.baseClass === qnameToIri('dcat:Catalog')"
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
        <LoadingMessage v-else-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" />
        <Teleport v-if="searchEnabled" to="#search-teleport">
            <AdvancedSearch v-if="flavour" :flavour="flavour" :query="searchDefaults" />
        </Teleport>
        <Teleport v-if="enableScores && hasScores" to="#score-teleport">
            <ScoreWidget v-for="([name, score]) in Object.entries(scores)" :name="name" :score="score" />
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