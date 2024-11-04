<script lang="ts" setup>
interface Props {
    variant?: 'item' | 'item-table' | 'list' | 'search' | 'concept';
}

const props = defineProps<Props>();
</script>
<template>
    <!-- Loading -->
    <div v-if="props.variant == 'list'">
        <span>loading list</span>
    </div>
    <div v-else-if="props.variant == 'search'">
        <span>loading search</span>
    </div>
    <div v-else-if="props.variant == 'concept'">
        <span>spinner</span>
    </div>
    <div v-else>
        <hr v-if="props.variant == 'item-table'" class="mb-4 mt-8" >
        <span>loading</span>
    </div>
</template>
