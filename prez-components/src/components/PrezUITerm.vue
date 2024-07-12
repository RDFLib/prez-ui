<script lang="ts" setup>
import type { PrezUITermProps } from '../types';
import PrezUILiteral from './PrezUILiteral.vue';
import PrezUINode from './PrezUINode.vue';
import PrezUIPropertyTable from './PrezUIPropertyTable.vue';

const props = defineProps<PrezUITermProps>();

</script>
<template>
    <WithTheme component="PrezUITerm">
        <div class="prezui-term">
            <PrezUILiteral v-if="props.term.termType=='Literal'" v-bind="props" />
            <PrezUINode v-else-if="props.term.termType=='NamedNode'" v-bind="props" />
            <PrezUIPropertyTable v-else-if="props.term.termType == 'BlankNode'" v-bind="props" :properties="props.term.properties" />
        </div>
    </WithTheme>
</template>