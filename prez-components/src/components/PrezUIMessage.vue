<script setup lang="ts">
import { PrezUIMessageProps } from '@/types';
//import TestA from '@x/testA.vue';
const props = defineProps<PrezUIMessageProps>();

</script>

<template>
    <WithTheme v-bind="props" component="PrezUIMessage">
        <!-- <TestA></TestA> -->
        <slot :severity="props.severity">
            <div :class="`prezui-message ${props.severity || 'info'}`"><slot name="text" :severity="props.severity">{{ props.text }}</slot></div>
        </slot>
    </WithTheme>
</template>

<style scoped>
.prezui-message {
    padding:10px;
}
.prezui-message.info {
    border: 1px solid blue;
    color: blue;
}
.prezui-message.error {
    border: 1px solid red;
    color: red;
}

</style>