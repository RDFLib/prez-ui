<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useApiRequest, useConcurrentApiRequests } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";

const { namedNode } = DataFactory;

const ui = useUiStore();
const { loading: datasetLoading, error: datasetError, apiGetRequest: datasetApiGetRequest } = useApiRequest(); // main request
const { loading: collectionLoading, hasError: collectionHasError, concurrentApiRequests: collectionConcurrentApiRequests } = useConcurrentApiRequests(); // feature collections requests
const { store, parseIntoStore, qnameToIri } = useRdfStore();

const DEFAULT_LABEL_PREDICATES = [qnameToIri("rdfs:label")];

const props = defineProps<{
    defaultSelected?: {
        dataset?: string;
        collection?: string;
    };
}>();

const emit = defineEmits<{
    (e: "updateOptions", options: {
        dataset?: string,
        collection?: string
    }): void;
}>();

interface Option {
    iri: string;
    title?: string;
    link: string;
};

const datasetOptions = ref<Option[]>([]);
const datasetSelected = ref(props.defaultSelected?.dataset?.split(",") || []);
const collectionOptions = ref<Option[]>([]);
const collectionSelected = ref(props.defaultSelected?.collection?.split(",") || []);
const useCql = ref(false);
const cql = ref("");

function emitOptions() {
    let options = {} as {
        dataset?: string,
        collection?: string
    };
    if (datasetSelected.value.length > 0) {
        options["dataset"] = datasetSelected.value.join(",")
    }
    if (collectionSelected.value.length > 0) {
        options["collection"] = collectionSelected.value.join(",")
    }
    emit("updateOptions", options);
}

watch(() => props.defaultSelected, (newValue, oldValue) => {
    if (newValue && !Object.values(newValue).every(val => val === "")) {
        datasetSelected.value = newValue.dataset?.split(",") || [];
        collectionSelected.value = newValue.collection?.split(",") || [];
        emitOptions();
    }
}, { deep: true });

onMounted(async () => {
    // get list of datasets
    const { data: datasetData, profiles: datasetProfiles } = await datasetApiGetRequest("/s/datasets");

    if (datasetData && datasetProfiles.length > 0 && !datasetError.value) {
        const currentProfile = ui.profiles[datasetProfiles.find(p => p.current)!.uri];
        const labelPredicates = currentProfile.labelPredicates.length > 0 ? currentProfile.labelPredicates : DEFAULT_LABEL_PREDICATES;

        parseIntoStore(datasetData);

        store.value.forSubjects(async (member) => {
            let title = "";
            let link = "";
            
            store.value.forEach(q => { // get preds & objs for each subj
                if (labelPredicates.includes(q.predicate.value)) {
                    title = q.object.value;
                } else if (q.predicate.value === qnameToIri("prez:link")) {
                    link = q.object.value;
                }
            }, member, null, null, null);
            
            datasetOptions.value.push({
                iri: member.value,
                title: title || undefined,
                link: link
            });
        }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Dataset")), null);
        
        // get list of feature collections
        const collectionData = await collectionConcurrentApiRequests(datasetOptions.value.map(d => `${d.link}/collections`));

        collectionData.forEach(r => {
            if (r.value) {
                parseIntoStore(r.value);
            }
        });

        datasetOptions.value.forEach(d => {
            store.value.forObjects(member => {
                let title = "";
                let link = "";
            
                store.value.forEach(q => { // get preds & objs for each subj
                    if (q.predicate.value === qnameToIri("rdfs:label")) { // need label predicates from profile
                        title = q.object.value;
                    } else if (q.predicate.value === qnameToIri("prez:link")) {
                        link = q.object.value;
                    }
                }, member, null, null, null);

                collectionOptions.value.push({
                    iri: member.value,
                    title: title || undefined,
                    link: link
                });
            }, namedNode(d.iri), namedNode(qnameToIri("rdfs:member")), null);
        });
    }
});
</script>

<template>
    <div class="search-form">
        <label for="dataset">Datasets</label>
        <select name="dataset" id="dataset" v-model="datasetSelected" @change="emitOptions()" multiple :disabled="useCql">
            <option v-for="option in datasetOptions" :value="option.iri">{{ option.title || option.iri }}</option>
        </select>
        <label for="collection">Feature Collections</label>
        <select name="collection" id="collection" v-model="collectionSelected" @change="emitOptions()" multiple :disabled="useCql">
            <option v-for="option in collectionOptions" :value="option.iri">{{ option.title || option.iri }}</option>
        </select>
        <label for="use-cql">Use CQL</label>
        <input type="checkbox" name="use-cql" id="use-cql" v-model="useCql">
        <label for="cql">CQL Query</label>
        <textarea name="cql" id="cql" v-model="cql" cols="30" rows="3" placeholder="CQL query" :disabled="!useCql"></textarea>
    </div>
</template>

<style lang="scss" scoped>

</style>