<script lang="ts" setup>
import type { PrezLiteral, PrezNode } from 'prez-lib';
import { TermProps } from "@/types";
import Literal from "./Literal.vue";
import NodeList from "./NodeList.vue";
import TermList from "./TermList.vue";
import ItemTable from "./ItemTable.vue";

const props = withDefaults(defineProps<TermProps>(), {
    _components: () => {
        return {
            literal: Literal,
            node: Node,
            nodeList: NodeList,
            itemTable: ItemTable,
            termList: TermList,
        }
    }
});
</script>

<template>
    <!-- Term -->
    <component
        :is="props._components.literal" 
        v-if="props.term.termType == 'Literal'" 
        :term="(props.term as PrezLiteral)"
        :variant="props.variant"
    />

    <component
        :is="props._components.node" 
        v-else-if="props.term.termType == 'NamedNode'" 
        :term="(props.term as PrezNode)"
        :variant="props.variant"
    />

    <div v-else-if="props.term.termType == 'BlankNode' && props.term.list">
        <component :is="props._components.nodeList"  :list="props.term.list" />
    </div>

    <component
        :is="props._components.itemTable"
        v-else-if="props.term.termType == 'BlankNode' && props.variant == 'item-table'" 
        :variant="props.variant"
        :term="term"
        class="border-y border-x-0 my-1"
    />

    <div v-else-if="props.term.termType == 'BlankNode' && props.variant == 'item-list'">
        <component :is="props._components.termList" :term="props.term" />
    </div>
</template>