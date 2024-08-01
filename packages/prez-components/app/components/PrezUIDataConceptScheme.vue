<script lang="ts" setup>
import type { PrezUIDataConceptSchemeProps } from "../types";
import { getTopConceptsUrl, SYSTEM_PREDICATES } from "prez-lib";
import PrezUIDataConcept from "./PrezUIDataConcept.vue";
import PrezUIItemTableProperty from "./PrezUIItemTableProperty.vue";
const props = defineProps<PrezUIDataConceptSchemeProps>();

const variant = props.variant || 'minimal';
</script>

<template>
    <template v-if="props.item.rdfTypes?.find(n=>n.value == SYSTEM_PREDICATES.skosConceptScheme)">
        <!-- variant == table, then output as a row -->
        <PrezUIItemTableProperty v-if="variant == 'table'">
            <template #predicate>
                Concept
            </template>
            <template #objects>
                <PrezUIDataConcept :url="getTopConceptsUrl(item, url)" />
            </template>
        </PrezUIItemTableProperty>
        
        <!-- variant == minimal, then output on it's own -->
        <PrezUIDataConcept v-if="variant =='minimal'" :url="getTopConceptsUrl(item, props.url)" />
    </template>
</template>

<style lang="scss" scoped>
</style>