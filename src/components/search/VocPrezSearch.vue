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
    defaultSelected?: string;
}>();

const emit = defineEmits<{
    (e: "updateOptions", options: {vocab: string}): void;
}>();

interface VocabOption {
    iri: string;
    title?: string;
};

const options = ref<VocabOption[]>([]);
const selected = ref(props.defaultSelected?.split(",") || []);

watch(() => props.defaultSelected, (newValue, oldValue) => {
    if (newValue && newValue !== "") {
        selected.value = newValue.split(",");
        emit('updateOptions', {vocab: selected.value.join(',')})
    }
});

onMounted(() => {
    doRequest(`${apiBaseUrl}/v/vocab`, () => {
        parseIntoStore(data.value);

        const subject = store.value.getSubjects(namedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0];

        store.value.forObjects(member => {
            let option: VocabOption = {
                iri: member.value
            };
            
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qname("skos:prefLabel")) {
                    option.title = q.object.value;
                }
            }, member, null, null, null);
            options.value.push(option);
        }, subject, namedNode(qname("rdfs:member")), null);
    });
});
</script>

<template>
    <div class="search-form">
        <label for="vocab">Vocabs</label>
        <select name="vocab" id="vocab" v-model="selected" @change="emit('updateOptions', {vocab: selected.join(',')})" multiple>
            <option v-for="option in options" :value="option.iri">{{ option.title || option.iri }}</option>
        </select>
    </div>
</template>

<style lang="scss" scoped>

</style>