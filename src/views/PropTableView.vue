<script lang="ts" setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig, type ListItem, type AnnotatedPredicate, type AnnotatedQuad, type Breadcrumb, type Concept } from "@/types";
import PropTableNew from "@/components/proptable/PropTableNew.vue";
import ConceptComponent from "@/components/ConceptComponent.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";

const { namedNode } = DataFactory;

const { apiBaseUrl } = inject(configKey, defaultConfig);
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const props = withDefaults(defineProps<{
    type: string;
    getChildren: boolean;
    childPred: string; // soon replaced with default profile hasLabelPredicate?
    childTitlePred: string; // soon replaced with default profile hasLabelPredicate?
    childDisplayTitle: string; // for display in table th
    childButton?: { name: string, url: string }; // undefined or link to children (/collections or /items)
    titlePred: string; // soon replaced with default profile hasLabelPredicate
    descPred: string; // soon replaced with default profile hasLabelPredicate
    enableSearch?: boolean;
}>(), {
    getChildren: false,
    childPred: "",
    childTitlePred: "",
    childDisplayTitle: "Members"
});

const hiddenPreds = [
    qname("a"),
    qname("dcterms:identifier"),
    qname("prez:count"),
    qname(props.titlePred),
    qname(props.descPred),
    ... props.type === "skos:ConceptScheme" ? [qname("skos:hasTopConcept")] : [],
    ... props.childPred ? [qname(props.childPred)] : []
];

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

const item = ref<ListItem>({} as ListItem);
const children = ref<ListItem[]>([]);
const concepts = ref<Concept[]>([]); // only for vocab
const properties = ref<AnnotatedQuad[]>([]);
const hideConcepts = ref(true); // only for vocab
const collapseAll = ref(true); // only for vocab

function getProperties() {
    const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname(props.type)), null)[0];
    item.value.iri = subject.id;
    store.value.forEach(q => {
        if (q.predicate.value === qname(props.titlePred)) {
            item.value.title = q.object.value;
        } else if (q.predicate.value === qname(props.descPred)) {
            item.value.description = q.object.value;
        } else if (q.predicate.value === qname("a")) {
            item.value.type = q.object.value;
        }

        const annoPred: AnnotatedPredicate = {
            termType: q.predicate.termType,
            value: q.predicate.value,
            id: q.predicate.id,
            annotations: store.value.getQuads(q.predicate, null, null, null)
        };
        const annoQuad: AnnotatedQuad = {
            subject: q.subject,
            predicate: annoPred,
            object: q.object,
            value: q.value,
            graph: q.graph,
            termType: q.termType,
            equals: q.equals,
            toJSON: q.toJSON
        };
        properties.value.push(annoQuad);
    }, subject, null, null, null);
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
            if (q.predicate.value === qname(props.childTitlePred)) {
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

function getChildren() {
    if (props.type === "skos:ConceptScheme") {
        getConcepts();
    } else {
        store.value.forObjects(part => {
            let p: ListItem = {
                iri: part.id
            }
            store.value.forEach(q => {
                if (q.predicate.value === qname(props.childTitlePred)) {
                    p.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    p.link = q.object.value;
                }
            }, part, null, null, null);
            children.value.push(p);
        }, namedNode(item.value.iri), namedNode(qname(props.childPred)), null);
    }
}

function getBreadcrumbs(): Breadcrumb[] {
    let breadcrumbs: Breadcrumb[] = [];
    if (flavour.value) {
        breadcrumbs.push({ name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`});
        if (["skos:ConceptScheme", "skos:Concept"].includes(props.type)) {
            breadcrumbs.push({ name: "Vocabs", url: "/v/vocab" });
        }
        if (["skos:Concept"].includes(props.type)) {
            breadcrumbs.push({ name: "Vocab", url: `/v/vocab/${route.params.vocabId}` }); // need parent info in data (link, title & type)
        }
        if (["skos:Collection"].includes(props.type)) {
            breadcrumbs.push({ name: "Collections", url: "/v/collection" });
        }
        if (["dcat:Catalog", "dcat:Resource"].includes(props.type)) {
            breadcrumbs.push({ name: "Catalogs", url: "/c/catalogs" });
        }
        if (["dcat:Resource"].includes(props.type)) {
            breadcrumbs.push({ name: "Catalog", url: `/c/catalogs/${route.params.catalogId}` }); // need parent info in data (link, title & type)
        }
        if (["dcat:Dataset", "geo:FeatureCollection", "geo:Feature"].includes(props.type)) {
            breadcrumbs.push({ name: "Datasets", url: "/s/datasets" });
        }
        if (["geo:FeatureCollection", "geo:Feature"].includes(props.type)) {
            breadcrumbs.push({ name: "Dataset", url: `/s/datasets/${route.params.datasetId}` }); // need parent info in data (link, title & type)
            breadcrumbs.push({ name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` }); // need parent info in data (link, title & type)
        }
        if (["geo:Feature"].includes(props.type)) {
            breadcrumbs.push({ name: "Feature Collection", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` }); // need parent info in data (link, title & type)
            breadcrumbs.push({ name: "Features", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}/items` }); // need parent info in data (link, title & type)
        }
    } else if (props.type === "prof:Profile") {
        breadcrumbs.push({ name: "Profiles", url: "/profiles"});
    }
    return breadcrumbs;
}

function getSearchDefaults(): {[key: string]: string} {
    if (props.enableSearch) {
        switch (props.type) {
            case "skos:ConceptScheme":
                return { vocab: item.value.iri };
            case "dcat:Catalog":
                return { catalog: item.value.iri };
            case "dcat:Dataset":
                return { dataset: item.value.iri };
            case "geo:FeatureCollection":
                return { collection: item.value.iri };
            default:
                return {};
        }
    } else {
        return {};
    }
}

onMounted(() => {
    doRequest(`${apiBaseUrl.replace(/\/$/, "")}${route.path}`, () => {
        parseIntoStore(data.value);
        getProperties();
        
        if (props.getChildren) {
            getChildren();
        }

        ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        document.title = `${item.value.title || props.type.split(":")[1]} | Prez`;
        if (flavour.value) {
            ui.pageHeading = { name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`};
        } else {
            ui.pageHeading = { name: "Prez", url: "/"};
        }
        ui.breadcrumbs = [
            ...getBreadcrumbs(),
            { name: item.value.title || props.type.split(":")[1], url: route.path }
        ];
    });
});
</script>

<template>
    <PropTableNew v-if="properties.length > 0" :item="item" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <!-- <template v-if="geometry" #map></template> -->
        <template v-if="props.type === 'skos:ConceptScheme'" #bottom>
            <tr>
                <th>Concepts</th>
                <td>
                    <button id="concept-hide-btn" class="btn" @click="hideConcepts = !hideConcepts">
                        <template v-if="hideConcepts">Show <i class="fa-regular fa-chevron-down"></i></template>
                        <template v-else>Hide <i class="fa-regular fa-chevron-up"></i></template>
                    </button>
                    <div :class="`concepts ${hideConcepts ? 'collapse' : ''}`">
                        <button id="collapse-all-btn" @click="collapseAll = !collapseAll" class="btn">
                            <template v-if="collapseAll"><i class="fa-regular fa-plus"></i> Expand all</template>
                            <template v-else><i class="fa-regular fa-minus"></i> Collapse all</template>
                        </button>
                        <ConceptComponent v-for="concept in concepts" v-bind="concept" :baseUrl="route.path" :collapseAll="collapseAll" />
                    </div>
                </td>
            </tr>
        </template>
        <template v-else-if="props.getChildren" #bottom>
            <tr>
                <th>{{ props.childDisplayTitle }}</th>
                <td>
                    <div class="children-list">
                        <RouterLink v-for="child in children" :to="child.link || ''">{{ child.title || child.iri }}</RouterLink>
                    </div>
                </td>
            </tr>
        </template>
        <template v-else-if="props.childButton" #bottom>
            <tr>
                <th>Members</th>
                <td>
                    <RouterLink :to="`${route.path}${props.childButton.url}`" class="btn">{{ props.childButton.name }}</RouterLink>
                </td>
            </tr>
        </template>
    </PropTableNew>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
    <Teleport v-if="props.enableSearch" to="#right-bar-content">
        <AdvancedSearch :flavour="flavour" :query="getSearchDefaults()" />
    </Teleport>
</template>

<style lang="scss" scoped>
button#concept-hide-btn {
    margin-bottom: 12px;
}

.concepts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    &.collapse {
        height: 0;
    }

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