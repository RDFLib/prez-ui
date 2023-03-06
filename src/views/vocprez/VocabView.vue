<script lang="ts" setup>
import { onMounted, ref, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig, type AnnotatedPredicate, type AnnotatedQuad, type Concept, type ListItem } from "@/types";
import PropTable from "@/components/PropTable.vue";
import ConceptComponent from "@/components/ConceptComponent.vue";

const { namedNode } = DataFactory;

const { apiBaseUrl } = inject(configKey, defaultConfig);
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const hiddenPreds = [
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "http://www.w3.org/2004/02/skos/core#hasTopConcept",
    "http://purl.org/dc/terms/identifier",
    "http://www.w3.org/2004/02/skos/core#definition",
    "http://www.w3.org/2004/02/skos/core#prefLabel",
    "http://www.w3.org/2000/01/rdf-schema#member"
];

const properties = ref<AnnotatedQuad[]>([]);
const vocab = ref<ListItem>({} as ListItem);
const concepts = ref<Concept[]>([]);
const hideConcepts = ref(true);
const collapseAll = ref(true);

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/vocab/${route.params.vocabId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("skos:ConceptScheme")), null)[0];
        vocab.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("skos:prefLabel")) {
                vocab.value.title = q.object.value;
            } else if (q.predicate.value === qname("skos:definition")) {
                vocab.value.description = q.object.value;
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

        ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        document.title = `${vocab.value.title} | Prez`;
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Vocabs", url: "/v/vocab" }, { name: vocab.value.title || "Vocab", url: route.path }];
    });
});

function getConcepts() {
    // API request

    // RDF parsing
    // parseIntoStore(conceptData);

    let conceptArray: Concept[] = [];
    
    // RDF querying
    store.value.forSubjects(subject => { // for each concept
        let c: Concept = {
            iri: subject.id,
            narrower: [],
            broader: "",
            title: "",
            link: ""
        };
        store.value.forEach(q => { // get preds & objs for each subj
            if (q.predicate.value === qname("rdfs:label")) {
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
    }, namedNode(qname("skos:inScheme")), namedNode(vocab.value.iri), null);

    // get top concepts
    const hasTopConcepts = store.value.getObjects(namedNode(vocab.value.iri), namedNode(qname("skos:hasTopConcept")), null).map(o => o.id);
    const topConceptsOf = store.value.getSubjects(namedNode(qname("skos:topConceptOf")), namedNode(vocab.value.iri), null).map(s => s.id);
    const topConcepts = [...new Set([...hasTopConcepts, ...topConceptsOf])]; // merge & remove duplicates

    // build concept hierarchy tree
    const indexMap = conceptArray.reduce<{[iri: string]: number}>((obj, c, i) => {
        obj[c.iri] = i;
        return obj;
    }, {});

    let children: Concept[] = [];
    conceptArray.forEach(c => {
        if (c.narrower.length > 0) {
            c.narrower.forEach(n => conceptArray[indexMap[n]].broader = c.iri);
        }

        if (topConcepts.includes(c.iri)) {
            children.push(c);
            return;
        }

        if (!!c.broader) {
            const parent = conceptArray[indexMap[c.broader]];
            parent.children = [...(parent.children || []), c];
        }
    });
    concepts.value = children;
}
</script>

<template>
    <h1>{{ vocab.title }}</h1>
    <p>Instance IRI: <a :href="vocab.iri" target="_blank" rel="noopener noreferrer">{{ vocab.iri }}</a></p>
    <p v-if="!!vocab.description">{{ vocab.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <template #bottom>
            <tr>
                <th>Concepts</th>
                <td>
                    <button id="concept-hide-btn" class="btn" @click="concepts.length === 0 && getConcepts(); hideConcepts = !hideConcepts">
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
    </PropTable>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
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
</style>