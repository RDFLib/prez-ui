<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import PropTable from "@/components/PropTable.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject("config").apiBaseUrl;
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const hiddenPreds = [
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "http://purl.org/dc/terms/identifier",
    "http://www.w3.org/2004/02/skos/core#definition",
    "http://www.w3.org/2004/02/skos/core#prefLabel",
    "http://www.w3.org/2004/02/skos/core#broader",
    "http://www.w3.org/2004/02/skos/core#narrower",
    "http://www.w3.org/2004/02/skos/core#inScheme",
    "http://www.w3.org/2004/02/skos/core#topConceptOf",
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy",
];

const properties = ref([]);
const concept = ref({
    iri: "",
    title: "",
    description: ""
});
const vocab = ref({});
const broader = ref({});
const narrower = ref([]);

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/vocab/${route.params.vocabId}/${route.params.conceptId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("skos:Concept")))[0];
        concept.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("skos:prefLabel")) {
                concept.value.title = q.object.value;
            } else if (q.predicate.value === qname("skos:definition")) {
                concept.value.description = q.object.value;
            } else if (q.predicate.value === qname("skos:definition")) {
                concept.value.description = q.object.value;
            }
            q.predicate.annotations = store.value.getQuads(q.predicate, null, null);
            properties.value.push(q);
        }, subject, null, null);

        // vocab parent
        // store.value.forObjects(concept => {
        //     let c = {
        //         iri: concept.id
        //     }
        //     store.value.forEach(q => {
        //         if (q.predicate.value === qname("rdfs:label")) {
        //             c.title = q.object.value;
        //         } else if (q.predicate.value === qname("prez:link")) {
        //             c.link = q.object.value;
        //         }
        //     }, concept, null, null);
        //     concepts.value.push(c);
        // }, namedNode(collection.value.iri), namedNode(qname("skos:member")));

        // broader
        const broaderList = store.value.getObjects(namedNode(concept.value.iri), namedNode(qname("skos:broader")));
        if (broaderList.length === 1) {
            let broaderObj = {
                iri: broaderList[0].id
            }
            store.value.forEach(q => {
                if (q.predicate.value === qname("rdfs:label")) {
                    broaderObj.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    broaderObj.link = q.object.value;
                }
            }, namedNode(broaderObj.iri), null, null);
            broader.value = broaderObj;
        }

        // narrower
        store.value.forObjects(concept => {
            let c = {
                iri: concept.id
            }
            store.value.forEach(q => {
                if (q.predicate.value === qname("rdfs:label")) {
                    c.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, concept, null, null);
            narrower.value.push(c);
        }, namedNode(concept.value.iri), namedNode(qname("skos:narrower")));

        ui.rightNavConfig = { enabled: true, profiles: profiles, currentUrl: route.path };
        document.title = `${concept.value.title} | Prez`;
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [
            { name: "VocPrez", url: "/v" },
            { name: "Vocabs", url: "/v/vocab" },
            { name: "Vocab", url: `/v/vocab/${route.params.vocabId}` },
            { name: concept.value.title, url: route.path }
        ];
    });
});
</script>

<template>
    <h1>{{ concept.title }}</h1>
    <p>Instance IRI: <a :href="concept.iri" target="_blank" rel="noopener noreferrer">{{ concept.iri }} <i class="fa-regular fa-arrow-up-right-from-square"></i></a></p>
    <p v-if="!!concept.description">{{ concept.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <template #bottom>
            <tr v-if="!!broader.iri">
                <th>Broader</th>
                <td>
                    <component
                        :is="broader.link ? RouterLink : 'a'"
                        :to="broader.link || ''"
                        :href="broader.link ? '' : broader.iri"
                        :target="broader.link ? '' : '_blank'"
                    >
                        {{ broader.title || broader.iri }}
                    </component>
                </td>
            </tr>
            <tr v-if="narrower.length > 0">
                <th>Narrower</th>
                <td>
                    <div class="narrower-list">
                        <component
                            v-for="concept in narrower"
                            :is="concept.link ? RouterLink : 'a'"
                            :to="concept.link || ''"
                            :href="concept.link ? '' : concept.iri"
                            :target="concept.link ? '' : '_blank'"
                        >
                            {{ concept.title || concept.iri }}
                        </component>
                    </div>
                </td>
            </tr>
        </template>
    </PropTable>
    <template v-else-if="loading">loading...</template>
    <template v-else-if="error">Network error: {{ error }}</template>
</template>

<style lang="scss" scoped>
.narrower-list {
    display: flex;
    flex-direction: column;
}
</style>