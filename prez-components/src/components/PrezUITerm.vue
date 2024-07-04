<script lang="ts" setup>
import { PrezLiteral, PrezNode } from 'prez-lib';
import type { PrezUITermProps } from '../types';
import PrezUILiteral from './PrezUILiteral.vue';
import PrezUINode from './PrezUINode.vue';
import PrezUIDebug from './PrezUIDebug.vue';
import PrezUIPropertyTable from './PrezUIPropertyTable.vue';

const props = defineProps<PrezUITermProps>();

</script>
<template>
    <PrezUIDebug :debug="props.debug" title="PrezUITerm" :info="props.term">    
        <div class="prezui-term">
            <PrezUILiteral v-if="props.term.termType=='Literal'" v-bind="props" />
            <PrezUINode v-else-if="props.term.termType=='NamedNode'" v-bind="props" />
            <PrezUIPropertyTable v-else-if="props.term.termType == 'BlankNode'" :debug="props.debug" :properties="props.term.properties" />
        </div>
    </PrezUIDebug>
</template>