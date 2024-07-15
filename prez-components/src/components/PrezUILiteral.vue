<script lang="ts" setup>
import type { PrezUILiteralProps } from '@/types';
import { PrezLiteral } from 'prez-lib';
const props = defineProps<PrezUILiteralProps>();
const term = props.term as PrezLiteral;
</script>
<template>
    <WithTheme v-bind="props" component="PrezUILiteral" :info="term">
        <slot :term="term">
            <div class="prezui-literal" v-if="props?.term?.value">
                <div class="prezui-text">
                    <slot name="text" :term="term" :text="term.value">
                        <span>{{ term.value }}</span>
                    </slot>
                    <slot v-if="term.language !== undefined" name="language" :term="term" :language="term.language">
                        <span class="prezui-language">{{ term.language }}</span>
                    </slot>
                    <slot v-if="term.datatype !== undefined" name="datatype" :term="term" :datatype="term.datatype">
                        <span class="prezui-datatype"><PrezUINode size="small" :term="term.datatype" /></span>
                    </slot>
                </div>
            </div>
        </slot>
    </WithTheme>
</template>
<style scoped>
.prezui-text {
    display: flex;
    justify-content: space-between;
}
</style>