<script setup lang="ts">

export type PrezUIErrorProps = {
    severity?: "info" | "error"
};
const props = defineProps<PrezUIErrorProps>();

</script>

<template>
    <div :class="`prezui-message${props.severity ? ' ' + props.severity : ''}`"><slot></slot></div>
</template>

<style scoped>
.prezui-message {
    border: 1px solid blue;
    color: blue;
}
.prezui-message.error {
    border: 1px solid red;
    color: red;
}

</style>