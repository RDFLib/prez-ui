<script setup lang="ts">

export type PrezUIErrorProps = {
    severity?: "info" | "error"
};
const props = defineProps<PrezUIErrorProps>();

</script>

<template>
    <div :class="`prez-message${props.severity ? ' ' + props.severity : ''}`"><slot></slot></div>
</template>

<style scoped>
.prez-message {
    border: 1px solid blue;
    color: blue;
}
.prez-message.error {
    border: 1px solid red;
    color: red;
}

</style>