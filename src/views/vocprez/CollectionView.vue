<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig, type AnnotatedPredicate, type AnnotatedQuad, type ListItem } from "@/types";
import PropTable from "@/components/PropTable.vue";

interface Child {
    iri: string,
    title?: string,
    link?: string
};

const { namedNode } = DataFactory;

const { apiBaseUrl } = inject(configKey, defaultConfig);
const route = useRoute();
const ui = useUiStore();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const hiddenPreds = [
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "http://purl.org/dc/terms/identifier",
    "http://www.w3.org/2004/02/skos/core#definition",
    "http://www.w3.org/2004/02/skos/core#prefLabel",
    "http://www.w3.org/2004/02/skos/core#member"
];

const properties = ref<AnnotatedQuad[]>([]);
const collection = ref<ListItem>({} as ListItem);
const concepts = ref<Child[]>([]);

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/collection/${route.params.collectionId}`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("skos:Collection")), null)[0];
        collection.value.iri = subject.id;
        store.value.forEach(q => { // get preds & objs
            if (q.predicate.value === qname("skos:prefLabel")) {
                collection.value.title = q.object.value;
            } else if (q.predicate.value === qname("skos:definition")) {
                collection.value.description = q.object.value;
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
        
        // concept list
        store.value.forObjects(concept => {
            let c: Child = {
                iri: concept.id
            };
            store.value.forEach(q => {
                if (q.predicate.value === qname("rdfs:label")) {
                    c.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, concept, null, null, null);
            concepts.value.push(c);
        }, namedNode(collection.value.iri), namedNode(qname("skos:member")), null);

        ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        document.title = `${collection.value.title} | Prez`;
        ui.pageHeading = { name: "VocPrez", url: "/v"};
        ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "Collections", url: "/v/collection" }, { name: collection.value.title || "Collection", url: route.path }];
    });
});
</script>

<template>
    <h1>{{ collection.title }}</h1>
    <p>Instance IRI: <a :href="collection.iri" target="_blank" rel="noopener noreferrer">{{ collection.iri }} <i class="fa-regular fa-arrow-up-right-from-square"></i></a></p>
    <p v-if="!!collection.description">{{ collection.description }}</p>
    <PropTable v-if="properties.length > 0" :properties="properties" :prefixes="prefixes" :hiddenPreds="hiddenPreds">
        <template #bottom>
            <tr>
                <th>Concepts</th>
                <td>
                    <div class="concept-list">
                        <component
                            v-for="concept in concepts"
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
.concept-list {
    display: flex;
    flex-direction: column;
}
</style>