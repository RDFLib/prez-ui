<script lang="ts" setup>
defineProps<{
    id: string;
    state: boolean | null;
}>();
</script>

<template>
    <span class="pointer" @click="$emit('clicked', id)">
        <i v-if="state === true" class="fa-solid fa-arrow-up-a-z"></i>
        <i v-else-if="state === false" class="fa-solid fa-arrow-down-z-a"></i>
        <i v-else class="fa-thin fa-arrow-up-a-z"></i>
    </span>
</template>

<style scoped>
.pointer {
    cursor: pointer;
}
</style>
