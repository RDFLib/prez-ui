<script lang="ts" setup>
import { type PrezLiteral, SYSTEM_PREDICATES } from '@/lib';
import type { LiteralProps } from '../types';

const props = defineProps<LiteralProps>();
const term = props.term as PrezLiteral;
const variant = props.variant || 'item';
const showDataType = [SYSTEM_PREDICATES.xmlString, SYSTEM_PREDICATES.rdfLangString].indexOf(term.datatype?.value || '') < 0;

</script>
<template>
    <slot :term="term" :variant="variant">
        <div v-if="props?.term?.value" class="prezui-literal">
            <div class="prezui-text">
                <slot name="text" :term="term" :text="term.value">
                    <span>{{ term.value }}</span>
                </slot>
                <slot v-if="term.language !== undefined" name="language" :term="term" :language="term.language">
                    <Tag v-if="variant == 'item'" severity="info" :value="term.language" />
                </slot>
                <slot v-if="term.datatype !== undefined && showDataType" name="datatype" :term="term" :datatype="term.datatype">
                    <Tag v-if="variant == 'item'" severity="info">
                        <Term 
                            :term="term.datatype"
                        />
                    </Tag>
                </slot>
            </div>
        </div>
    </slot>
</template>
<style scoped>
.prezui-text {
    display: flex;
    justify-content: space-between;
}
</style>
