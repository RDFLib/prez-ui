<script lang="ts" setup>
import { ref } from "vue";
import type { ConceptProps } from "../types";
import { getNarrowersUrl } from '@prez-ui/lib';

const props = defineProps<ConceptProps>();

const open = ref<string[]>([]);

function toggleOpen(value:string) {
    const idx = open.value.indexOf(value);
    if(idx >= 0) {
        open.value.splice(idx, 1);
    } else {
        open.value.push(value);
    }
}
</script>

<template>
    <DataProvider v-if="url != ''" type="list" loading-variant="concept" :url="props.url">
        <template #default="{ concepts }">
            <div v-for="concept of concepts" :key="concept.value" class="pz-concept">
                <div class="pz-concept-node">
                    <template v-if="concept.hasChildren">
                        <i v-if="!open.includes(concept.value)" class="pi pi-angle-right" @click="()=>toggleOpen(concept.value)" />
                        <i v-else class="pi pi-angle-down" @click="()=>toggleOpen(concept.value)" />
                    </template>
                    <span v-else class="pz-concept-blank" />
                    <Node :term="concept" />
                </div>
                <div v-if="open.includes(concept.value)" class="pz-concept-children">
                    <Concept :url="getNarrowersUrl(concept, url)" />
                </div>
            </div>
        </template>
    </DataProvider>
</template>

<style lang="scss" scoped>
.pz-concept-blank {
    width:16px;
}
.pz-concept i:hover {
    cursor: pointer;
    background-color: #eee;
    border-radius: 8px;
}
.pz-concept-node {
    place-items: end;    
    align-items: center;
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}
.pz-concept .pz-concept {
    padding-left:20px;
}

</style>