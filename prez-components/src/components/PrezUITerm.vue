<script lang="ts" setup>
import type { PrezUITermProps } from '@/types';
const props = defineProps<PrezUITermProps>();

</script>
<template>
    <PrezUI v-bind="props" component="PrezUITerm" :info="props.term">
        <div class="prezui-term">

            <PrezUILiteral v-if="props.term.termType=='Literal'" 
                v-bind="props" 
            />

            <PrezUINode v-else-if="props.term.termType=='NamedNode'" 
                v-bind="props" />

            <PrezUIPropertyTable v-else-if="props.term.termType == 'BlankNode'" 
                v-bind="props" 
            />

        </div>
    </PrezUI>
</template>