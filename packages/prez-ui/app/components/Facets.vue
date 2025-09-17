<script lang="ts" setup>
import { Facets, type FacetsProps, type FacetEmitsPayload } from "prez-components";
import type { PrezFacetValue } from "prez-lib";

const props = defineProps<FacetsProps>();
const node = resolveComponent("Node") as Component;
const term = resolveComponent("Term") as Component;
const literal = resolveComponent("Literal") as Component;
const itemLink = resolveComponent("ItemLink") as Component;
const route = useRoute();
const router = useRouter();

const handleFacetSelected = (payload: FacetEmitsPayload) => {

    const filter = JSON.parse((route.query.filter || '{}') as string);

    if (!filter.args) {
        filter.args = [];
    }
    filter.op = 'and';
    filter.args.push({
        op: '=',
        args: [
            { property: payload.facetName.value },
            payload.facetValue.term.value
        ]
    });

    router.push({
        path: route.path,
        query: {
            ...route.query,
            filter: JSON.stringify(filter)
        }
    });

};
</script>

<template>
    <Facets v-bind="props" :_components="{node, term, literal, itemLink}" @facet-selected="handleFacetSelected" />
</template>
