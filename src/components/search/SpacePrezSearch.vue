<script lang="ts" setup>
import { ref, onMounted, inject, watch } from "vue";
import { DataFactory } from "n3";
import { configKey, defaultConfig } from "@/types";
import { useGetRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";

const { namedNode } = DataFactory;

const { apiBaseUrl } = inject(configKey, defaultConfig);
const { data, loading, error, doRequest } = useGetRequest();
const { store, parseIntoStore, qname } = useRdfStore();

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
}, {deep: true});

onMounted(() => {
    // get dataset list
    doRequest(`${apiBaseUrl}/s/datasets`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0];

        store.value.forObjects(member => {
            let option: Option = {
                iri: member.value
            };

            let datasetLink = "";
            
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("dcterms:title")) {
                    option.title = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    datasetLink = q.object.value;
                }
            }, member, null, null, null);
            datasetOptions.value.push(option);

            // get feature collection list
            if (datasetLink !== "") {
                const { data: collectionData, loading: collectionLoading, error: collectionError, doRequest: collectionDoRequest } = useGetRequest();
                const { store: collectionStore, parseIntoStore: collectionParseIntoStore, qname: collectionQname } = useRdfStore();
                
                collectionDoRequest(`${apiBaseUrl}${datasetLink}/collections`, () => {
                    collectionParseIntoStore(collectionData.value);

                    const collectionSubject = collectionStore.value.getSubjects(namedNode(collectionQname("a")), namedNode(collectionQname("rdf:bag")), null)[0];

                    collectionStore.value.forObjects(member => {
                        let option: Option = {
                            iri: member.value
                        };
                        
                        collectionStore.value.forEach(q => { // get preds & objs for each subj
                            if (q.predicate.value === collectionQname("dcterms:title")) {
                                option.title = q.object.value;
                            }
                        }, member, null, null, null);
                        collectionOptions.value.push(option);
                    }, collectionSubject, namedNode(collectionQname("rdfs:member")), null);
                });
            }
        }, subject, namedNode(qname("rdfs:member")), null);
    });
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