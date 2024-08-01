<script lang="ts" setup>
import type { PrezUITermProps } from '@/types';
import PrezUILiteral from './PrezUILiteral.vue';
import PrezUINode from './PrezUINode.vue';
import PrezUIItemTable from './PrezUIItemTable.vue';
const props = defineProps<PrezUITermProps>();

</script>
<template>
    <div class="prezui-term">

        <PrezUILiteral 
            v-if="props.term.termType=='Literal'" 
            v-bind="props" 
        />

        <PrezUINode 
            v-else-if="props.term.termType=='NamedNode'" 
            v-bind="props"
        />

        <PrezUIItemTable
            v-else-if="props.term.termType == 'BlankNode'" 
            v-bind="props" 
        />

    </div>
</template>