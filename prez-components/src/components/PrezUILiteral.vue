<script lang="ts" setup>
import type { PrezUILiteralProps } from '@/src/types';
const props = defineProps<PrezUILiteralProps>();
</script>
<template>
    <WithTheme v-bind="props" component="PrezUILiteral" :info="props.term">
        <slot :term="props.term">
            <div class="prezui-literal" v-if="props?.term?.value">
                <div class="prezui-text">
                    <slot name="text" :term="props.term" :text="props.term.value">
                        <span>{{ props.term.value }}</span>
                    </slot>
                    <slot v-if="props.term.language !== undefined" name="language" :term="props.term" :language="props.term.language">
                        <span class="prezui-language">{{ props.term.language }}</span>
                    </slot>
                    <slot v-if="props.term.datatype !== undefined" name="datatype" :term="props.term" :datatype="props.term.datatype">
                        <span class="prezui-datatype"><PrezUINode size="small" :term="props.term.datatype" /></span>
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