<script lang="ts" setup>
import { ref, onMounted, inject, watch } from "vue";
import { DataFactory } from "n3";
import { apiBaseUrlConfigKey } from "@/types";
import { useGetRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const { data, loading, error, doRequest } = useGetRequest();
const { store, parseIntoStore, qnameToIri } = useRdfStore();

const props = defineProps<{
    defaultSelected?: string;
}>();

const emit = defineEmits<{
    (e: "updateOptions", options: {catalog: string}): void;
}>();

interface CatalogOption {
    iri: string;
    title?: string;
};

const options = ref<CatalogOption[]>([]);
const selected = ref(props.defaultSelected?.split(",") || []);

watch(() => props.defaultSelected, (newValue, oldValue) => {
    if (newValue && newValue !== "") {
        selected.value = newValue.split(",");
        emit('updateOptions', {catalog: selected.value.join(',')})
    }
});

onMounted(() => {
    doRequest(`${apiBaseUrl}/c/catalogs`, () => {
        parseIntoStore(data.value);

        store.value.forSubjects(member => {
            let option: CatalogOption = {
                iri: member.value
            };
            
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === qnameToIri("rdfs:label")) {
                    option.title = q.object.value;
                }
            }, member, null, null, null);
            options.value.push(option);
        }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Catalog")), null);
    });
});
</script>

<template>
    <div class="search-form">
        <label for="catalog">Catalogs</label>
        <select name="catalog" id="catalog" v-model="selected" @change="emit('updateOptions', {catalog: selected.join(',')})" multiple>
            <option v-for="option in options" :value="option.iri">{{ option.title || option.iri }}</option>
        </select>
    </div>
</template>

<style lang="scss" scoped>

</style>