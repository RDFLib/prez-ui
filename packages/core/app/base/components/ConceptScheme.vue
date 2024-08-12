<script lang="ts" setup>
import type { ConceptSchemeProps } from "../types";
import { getTopConceptsUrl, SYSTEM_PREDICATES } from '@/base/lib';

const props = defineProps<ConceptSchemeProps>();
const api = useApi();
const variant = props.variant || 'minimal';
const isConceptScheme = props.item.rdfTypes?.find(n=>n.value == SYSTEM_PREDICATES.skosConceptScheme);

// we can either pass a URL as the starting point, or use the concept item that was passed in
const url = props.url || isConceptScheme ? (props.baseUrl || api.getBaseApiUrl()) + getTopConceptsUrl(props.item) : '';
//const url = '';
</script>

<template>
    <template v-if="url">
        <!-- variant == table, then output as a row -->
        <ItemTableProperty v-if="variant == 'table'">
            <template #predicate>
                Concept
            </template>
            <template #objects>
                <Concept :url="url" />
            </template>
        </ItemTableProperty>
        
        <!-- variant == minimal, then output on it's own -->
        <Concept v-if="variant =='minimal'" :url="url" />
    </template>
</template>

<style lang="scss" scoped>
</style>