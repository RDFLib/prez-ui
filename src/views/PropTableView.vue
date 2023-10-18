<script lang="ts" setup>
import { ref, onMounted, inject, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { BlankNode, DataFactory, Quad, Store } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useApiRequest } from "@/composables/api";
import type { WKTResult } from "@/components/MapClient.d";
import { apiBaseUrlConfigKey, conceptPerPageConfigKey, enableScoresKey, type ListItem, type Breadcrumb, type Concept, type PrezFlavour, type Profile, type ListItemExtra, type ListItemSortable, type AnnotatedTriple, type Prefixes } from "@/types";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";
import { titleCase, sortByTitle, ensureAnnotationPredicates, createAnnotatedTerm, getLabel, getDescription } from "@/util/helpers";
import { ALT_PROFILE_CURIE } from "@/util/consts";
import PropTable from "@/components/proptable/PropTable.vue";
import ConceptComponent from "@/components/ConceptComponent.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import MapClient from "@/components/MapClient.vue";
import SortableTabularList from "@/components/SortableTabularList.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ScoreWidget from "@/components/scores/ScoreWidget.vue";
import SearchBar from "@/components/search/SearchBar.vue";

const { namedNode, literal } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const enableScores = inject(enableScoresKey) as boolean;
const conceptPerPage = inject(conceptPerPageConfigKey) as number;
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qnameToIri, iriToQname } = useRdfStore(); // main store
const { store: conceptStore, parseIntoStore: conceptParseIntoStore, qnameToIri: conceptQnameToIri, clearStore: conceptClearStore } = useRdfStore(); // store for concepts
const { loading, error, apiGetRequest } = useApiRequest(); // main request
const { loading: countLoading, error: countError, apiGetRequest: countApiGetRequest } = useApiRequest(); // count concepts for vocab request
const { loading: conceptLoading, error: conceptError, apiGetRequest: conceptApiGetRequest } = useApiRequest(); // concept related requests

const DEFAULT_GEO_PREDICATES = [qnameToIri("geo:hasBoundingBox"), qnameToIri("geo:hasGeometry")];
const DEFAULT_CHILDREN_PREDICATES = [qnameToIri("rdfs:member"), qnameToIri("skos:member"), qnameToIri("dcterms:hasPart")];
const RECURSION_LIMIT = 5; // limit on recursive search of blank nodes

const item = ref<ListItem>({} as ListItem);
const children = ref<ListItemExtra[]>([]);
const concepts = ref<Concept[]>([]); // only for vocab
const properties = ref<AnnotatedTriple[]>([]);
const blankNodes = ref<AnnotatedTriple[]>([]);
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
    qnameToIri("prez:childrenCount"),
    qnameToIri("prez:link"),
    "https://linked.data.gov.au/def/scores/hasScore"
]);
const currentProfile = ref<Profile | null>(null);
const childrenConfig = ref({
    showChildren: false,
    childrenTitle: "",
    showButton: false,
    buttonTitle: "",
    buttonLink: ""
});
const hasScores = ref(false);
const scores = ref<{[key: string]: {[key: string]: number}}>({}); // {fair: {f: 0, a: 0, i: 0, r: 0}, ...}
const hasFewChildren = ref(false); // only for vocab
const searchConfig = ref<{
    containerUri?: string;
    containerBaseClass?: string;
    baseClass?: string;
}>({});

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
            searchEnabled.value = true;
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

async function getProperties() {
    store.value.forEach(q => {
        if (DEFAULT_CHILDREN_PREDICATES.includes(q.predicate.value)) {
            childrenPredicate.value = q.predicate.value;
            hiddenPredicates.value.push(q.predicate.value);
        } else if (q.predicate.value === qnameToIri("a")) {
            configByBaseClass(q.object.value); // might not be needed anymore with the /object changes
            const typeLabel = getLabel(q.object.value, store.value);
            const typeDesc = getDescription(q.object.value, store.value);
            const typeQname = iriToQname(q.object.value);

            item.value.types!.push({
                value: q.object.value,
                qname: typeQname !== "" ? typeQname : undefined,
                label: typeLabel,
                description: typeDesc,
            });
        } else if (DEFAULT_GEO_PREDICATES.includes(q.predicate.value)) {
            store.value.forEach(geoQ => {
                geoResults.value.push({
                    label: item.value.title ? item.value.title : item.value.iri,
                    fcLabel: "",
                    wkt: geoQ.object.value,
                    uri: item.value.iri,
                    link: `/object?uri=${item.value.iri}`
                })
            }, q.object, namedNode(qnameToIri("geo:asWKT")), null, null)
        } else if (q.predicate.value === "https://linked.data.gov.au/def/scores/hasScore" && enableScores && !hasScores.value) {
            hasScores.value = true;
        } else if (q.predicate.value === qnameToIri("prez:childrenCount")) {
            item.value.childrenCount = Number(q.object.value);
        }

        if (!isAltView.value) {
            const annoQuad = createAnnotatedTriple(q, store.value, prefixes.value);
            properties.value.push(annoQuad);

            let recursionCounter = 0;
            findBlankNodes(q, store.value, recursionCounter, prefixes.value);
        }
    }, namedNode(item.value.iri), null, null, null);

    if (hasScores.value) {
        getScores();
    }
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
    // get parents info
    let parents: {
        id: string;
        title?: string;
        uri: string;
    }[] = [];

    const pathSegments = route.path.split("/").slice(1, -1);

    pathSegments.forEach(id => {
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

    // if /object, then use home/object/<object>
    // else, build out the breadcrumbs using the URL path
    let crumbs: Breadcrumb[] = [];
    
    if (isObjectView.value) {
        crumbs.push({ name: "Get Object by URI", url: "/object" });
    } else {
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
                    if (index + 1 !== pathSegments.length) {
                        crumbs.push({ name: parents[0].title || parents[0].uri, url: `/v/vocab/${route.params.vocabId}` });
                        skipSegment = true;
                    }
                    break;
                case "collection":
                    crumbs.push({ name: "Collections", url: "/v/collection" });
                    if (index + 1 !== pathSegments.length) {
                        crumbs.push({ name: parents[0].title || parents[0].uri, url: `/v/collection/${route.params.collectionId}` });
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
        crumbs.push({ name: "Alternate Profiles", url: `${route.path}?_profile=${ALT_PROFILE_CURIE}` });
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

async function getChildren() {
    if (item.value.baseClass === qnameToIri("skos:ConceptScheme")) {
        if (hasFewChildren.value) {
            getAllConcepts();
        } else {
            getTopConcepts();
        }
    } else {
        store.value.forObjects(obj => {
            let child: ListItemExtra = {
                iri: obj.id,
                extras: {}
            };

            child.title = getLabel(obj.value, store.value);
            const links: string[] = [];

            store.value.forEach(q => {
                if (q.predicate.value === qnameToIri("prez:link")) {
                    links.push(q.object.value);
                } else if (q.predicate.value === qnameToIri("a")) {
                    child.baseClass = q.object.value;
                } else if (item.value.baseClass === qnameToIri("dcat:Catalog") && q.predicate.value === qnameToIri("dcterms:publisher")) {
                    const publisher: ListItemSortable = {
                        iri: q.object.value,
                        label: getLabel(q.object.value, store.value) || getIRILocalName(q.object.value)
                    };

                    child.extras.publisher = publisher;
                } else if (item.value.baseClass === qnameToIri("dcat:Catalog") && q.predicate.value === qnameToIri("dcterms:creator")) {
                    const creator: ListItemSortable = {
                        iri: q.object.value,
                        label: getLabel(q.object.value, store.value) || getIRILocalName(q.object.value)
                    };
                    
                    child.extras.creator = creator;
                } else if (item.value.baseClass === qnameToIri("dcat:Catalog") && q.predicate.value === qnameToIri("dcterms:issued")) {
                    const issued: ListItemSortable = { label: q.object.value };
                    child.extras.issued = issued;
                } 
            }, obj, null, null, null);

            // ensure the correct link is set
            if (links.length > 1) {
                let start = links.filter(link => link.startsWith(route.path));
                if (start.length > 0) {
                    child.link = start[0];
                } else {
                    child.link = links[0]; 
                }
            } else if (links.length === 1) {
                child.link = links[0];
            }

            children.value.push(child);
        }, namedNode(item.value.iri), namedNode(childrenPredicate.value), null);

        // sort by title, then by IRI
        children.value.sort(sortByTitle);
    }
}

async function getAllConcepts() {
    let conceptArray: Concept[] = [];

    store.value.forSubjects(subject => {
        let c: Concept = {
            iri: subject.id,
            narrower: [],
            broader: "",
            title: "",
            link: "",
            childrenCount: 0,
            children: []
        };

        c.title = getLabel(subject.value, store.value);
        
        store.value.forEach(q => {
            if (q.predicate.value === qnameToIri("prez:link") && q.object.value.startsWith(route.path)) { // enforce links within current vocab
                c.link = q.object.value;
            } else if (q.predicate.value === qnameToIri("skos:narrower")) {
                c.narrower!.push(q.object.value);
            } else if (q.predicate.value === qnameToIri("skos:broader")) {
                c.broader = q.object.value;
            }
        }, subject, null, null, null);

        c.childrenCount = c.narrower!.length;
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
        if (c.narrower!.length > 0) {
            c.narrower!.forEach(n => {
                conceptArray[indexMap[n]].broader = c.iri;
            });
        }

        if (topConcepts.includes(c.iri)) {
            conceptsList.push(c);
            return;
        }

        if (!!c.broader && c.broader !== "") {
            const parent = conceptArray[indexMap[c.broader]];
            parent.children = [...(parent.children || []), c].sort(sortByTitle);
            parent.childrenCount = parent.children.length;
        }
    });
    conceptsList.sort(sortByTitle);
    concepts.value = conceptsList;
}

async function getTopConcepts(page: number = 1) {
    conceptClearStore();
    const { data } = await conceptApiGetRequest(`${route.path}/top-concepts?page=${page}&per_page=${conceptPerPage}`);
    if (data && !conceptError.value) {
        conceptParseIntoStore(data);

        conceptStore.value.forObjects(object => {
            let c: Concept = {
                iri: object.id,
                title: "",
                link: "",
                childrenCount: 0,
                children: [],
                color: "",
            };
            
            c.title = getLabel(object.value, conceptStore.value);

            conceptStore.value.forEach(q => {
                if (q.predicate.value === conceptQnameToIri("prez:link")) {
                    c.link = q.object.value;
                } else if (q.predicate.value === conceptQnameToIri("prez:childrenCount")) {
                    c.childrenCount = Number(q.object.value);
                } else if (q.predicate.value === conceptQnameToIri("sdo:color")) {
                    c.color = q.object.value;
                }
            }, object, null, null, null);
            concepts.value.push(c);
        }, namedNode(item.value.iri), namedNode(conceptQnameToIri("skos:hasTopConcept")), null);

        concepts.value.sort(sortByTitle);
    }
}

async function getNarrowers({ iriPath, link, page = 1 }: { iriPath: string, link: string, page: number }) {
    // find parent to add narrowers to in hierarchy
    let parent: Concept | undefined;
    iriPath.split("|").forEach((iri, index) => {
        if (index === 0) {
            parent = concepts.value.find(c => c.iri === iri);
        } else {
            parent = parent!.children.find(c => c.iri === iri);
        }

        if (!parent) {
            // error
        }
    });
    
    conceptClearStore();
    const { data } = await conceptApiGetRequest(`${link}/narrowers?page=${page}&per_page=${conceptPerPage}`);
    if (data && !conceptError.value) {
        conceptParseIntoStore(data);

        conceptStore.value.forObjects(object => {
            let c: Concept = {
                iri: object.id,
                title: "",
                link: "",
                childrenCount: 0,
                children: [],
                color: "",
            };

            c.title = getLabel(object.value, conceptStore.value);
            
            conceptStore.value.forEach(q => {
                if (q.predicate.value === conceptQnameToIri("prez:link")) {
                    c.link = q.object.value;
                } else if (q.predicate.value === conceptQnameToIri("prez:childrenCount")) {
                    c.childrenCount = Number(q.object.value);
                } else if (q.predicate.value === conceptQnameToIri("sdo:color")) {
                    c.color = q.object.value;
                }
            }, object, null, null, null);
            parent!.children.push(c);
        }, namedNode(parent!.iri), namedNode(conceptQnameToIri("skos:narrower")), null);

        parent!.children.sort(sortByTitle);
    }
}

function createAnnotatedTriple(q: Quad, store: Store, prefixes?: Prefixes): AnnotatedTriple {
    return {
        subject: q.subject,
        predicate: createAnnotatedTerm(q.predicate, store, prefixes),
        object: createAnnotatedTerm(q.object, store, prefixes)
    }
}

function findBlankNodes(q: Quad, store: Store, recursionCounter: number, prefixes?: Prefixes) {
    if (q.object instanceof BlankNode) {
        recursionCounter++;
        store.forEach(q1 => {
            const annoQuad1 = createAnnotatedTriple(q1, store, prefixes);
            blankNodes.value.push(annoQuad1);
            if (recursionCounter < RECURSION_LIMIT) {
                findBlankNodes(q1, store, recursionCounter, prefixes);
            }
        }, q.object, null, null, null)
    }
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
    if (route.query._profile === ALT_PROFILE_CURIE && !route.query._mediatype) {
        isAltView.value = true;
    }
});

onMounted(async () => {
    loading.value = true;

    if (item.value.baseClass === qnameToIri("skos:ConceptScheme")) {
        const { data: countData } = await countApiGetRequest(`/count?curie=${route.path.split("/").slice(-1)[0]}&inbound=${encodeURIComponent(qnameToIri("skos:inScheme"))}`);
        if (countData && !countError.value) {
            if (parseInt(countData.replace('"', "")) <= conceptPerPage) {
                hasFewChildren.value = true;
            }
        }
    }

    let fullPath = "";
    if (hasFewChildren.value) {
        fullPath = `${route.path}/all${window.location.search}`;
    } else {
        fullPath = route.fullPath; // should use normal path for vocab for alt view to avoid getting concepts
    }
    if (Object.keys(route.query).length > 0) {
        if (isAltView.value) { // remove alt profile qsa to get title for breadcrumbs - already have profile info in pinia/link headers
            fullPath = fullPath.replace(`_profile=${ALT_PROFILE_CURIE}`, "");
        }
    }

    const { data, profiles } = await apiGetRequest(fullPath);

    if (data && profiles.length > 0 && !error.value) {
        // find the current profile
        currentProfile.value = ui.profiles[profiles.find(p => p.current)!.uri];
        
        // if specify mediatype, or profile is not current or alt, redirect to API
        if ((route.query && route.query._profile) &&
            (route.query._mediatype || ![currentProfile.value.token, ALT_PROFILE_CURIE].includes(route.query._profile as string))) {
                window.location.replace(`${apiBaseUrl}${route.path}?_profile=${route.query._profile}${route.query._mediatype ? `&_mediatype=${route.query._mediatype}` : ""}`);
        }

        ui.rightNavConfig = {
            enabled: !isAltView.value,
            profiles: profiles,
            currentUrl: route.path
        };
    
        parseIntoStore(data);

        const subject = isObjectView.value ? namedNode(route.query.uri as string) : store.value.getSubjects(namedNode(qnameToIri("a")), namedNode(item.value.baseClass!), null)[0]; // isAltView breaks here - subject doesn't exist
        item.value.iri = subject.value;
        item.value.types = [];
        searchConfig.value = {
            containerUri: subject.value,
            containerBaseClass: iriToQname(item.value.baseClass!)
        };

        await ensureAnnotationPredicates();

        hiddenPredicates.value.push(...ui.annotationPredicates.label, ...ui.annotationPredicates.description);
        item.value.title = getLabel(item.value.iri, store.value);
        item.value.description = getDescription(item.value.iri, store.value);

        // fire off getProperties() & getChildren() concurrently
        if (!isAltView.value) {
            getProperties();
            if (childrenConfig.value.showChildren) {
                getChildren();
            }
        }

        document.title = item.value.title ? `${item.value.title} | Prez` : "Prez";
        ui.breadcrumbs = getBreadcrumbs();
    }
});
</script>

<template>
    <ProfilesTable v-if="isAltView" />
    <template v-else>
        <PropTable v-if="properties.length > 0" :item="item" :properties="properties" :blankNodes="blankNodes" :prefixes="prefixes" :hiddenPredicates="hiddenPredicates">
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
                            <button v-if="hasFewChildren" id="collapse-all-btn" @click="collapseConcepts = !collapseConcepts" class="btn">
                                <template v-if="collapseConcepts"><i class="fa-regular fa-plus"></i> Expand all</template>
                                <template v-else><i class="fa-regular fa-minus"></i> Collapse all</template>
                            </button>
                            <ConceptComponent
                                v-for="concept in concepts"
                                v-bind="concept"
                                :baseUrl="route.path"
                                :collapseAll="collapseConcepts"
                                parentPath=""
                                :doNarrowerEmits="!hasFewChildren"
                                @getNarrowers="getNarrowers($event)"
                            />
                        </div>
                        <button
                            v-if="!hasFewChildren && concepts.length > 0 && item.childrenCount! > concepts.length"
                            class="btn outline sm"
                            @click="getTopConcepts(Math.round(concepts.length / conceptPerPage) + 1)"
                            :style="{marginLeft: '26px'}"
                        >
                            Load more
                        </button>
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
            <SearchBar v-bind="searchConfig" />
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