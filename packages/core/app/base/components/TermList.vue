<script setup lang="ts">
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
        <div class="flex">
            <Node v-if="props.term.termType == 'NamedNode'" :term="props.term" hideLink />
            <Literal v-if="props.term.termType == 'Literal'" :term="props.term" hideLanguage hideDataType />
            <div v-if="props.term.termType == 'BlankNode'" v-for="p of props.term.properties">
                <Node :term="p.predicate" hideLink />
                <TermList v-for="o of p.objects" :term="o" :level="props.level+1" />
            </div>
        </div>
    </div>
    <div v-else>
        <!-- LIMIT REACHED -->
    </div>
</template>