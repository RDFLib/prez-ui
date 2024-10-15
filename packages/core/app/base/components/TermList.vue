<script setup lang="ts">
/** 
 * Render a term/blank node object recursively in a shortened form for a list view
 */
import type { PrezTerm } from '@/base/lib';

interface Props {
    term: PrezTerm;
    level?: number;
}
const props = withDefaults(defineProps<Props>(), {level: 0});
</script>
<template>
    <div v-if="props.level == 0">
    </div>
    <div class="pl-2" v-if="props.level < 20">
        <div :class="props.level > 0 ? 'before:content-[\'↳\'] before:mr-2' : ''">
            <Node v-if="props.term.termType == 'NamedNode'" :term="props.term" hideLink />
            <Literal v-else-if="props.term.termType == 'Literal'" :term="props.term" hideLanguage hideDataType />
            <NodeList v-else-if="props.term.termType == 'BlankNode' && props.term.list" :list="props.term.list" />
            <div v-else-if="props.term.termType == 'BlankNode'" v-for="p of props.term.properties">
                <Node :term="p.predicate" />
                <TermList v-for="o of p.objects" :term="o" :level="props.level+1" />
            </div>
        </div>
    </div>
    <div v-else>
        <!-- LIMIT REACHED -->
    </div>
</template>