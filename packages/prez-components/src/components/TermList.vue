<script setup lang="ts">
/** 
 * Render a term/blank node object recursively in a shortened form for a list view
 */
import { TermListProps } from "@/types";
import Node from "./Node.vue";
import Literal from "./Literal.vue";
import NodeList from "./NodeList.vue";

const props = withDefaults(defineProps<TermListProps>(), {
    level: 0,
    _components: () => {
        return {
            node: Node,
            literal: Literal,
            nodeList: NodeList,
        }
    }
});
</script>

<template>
    <!-- TermList -->
    <div v-if="props.level == 0">
    </div>
    <div class="pl-2" v-if="props.level < 20">
        <div :class="props.level > 0 ? 'before:content-[\'↳\'] before:mr-2' : ''">
            <component :is="props._components.node" v-if="props.term.termType == 'NamedNode'" :term="props.term" hideLink />
            <component :is="props._components.literal" v-else-if="props.term.termType == 'Literal'" :term="props.term" hideLanguage hideDataType />
            <component :is="props._components.nodeList" v-else-if="props.term.termType == 'BlankNode' && props.term.list" :list="props.term.list" />
            <div v-else-if="props.term.termType == 'BlankNode'" v-for="p of props.term.properties">
                <component :is="props._components.node" :term="p.predicate" />
                <TermList v-for="o of p.objects" :_components="props._components" :term="o" :level="props.level + 1" />
            </div>
        </div>
    </div>
    <div v-else>
        <!-- LIMIT REACHED -->
    </div>
</template>