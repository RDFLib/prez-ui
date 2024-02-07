<script lang="ts" setup>
const props = defineProps<{
    search: boolean;
    profiles: any[];
}>();
</script>

<template>
    <div>
        <div v-if="props.search">search</div>
        <div>
            <h4>Alternate Profiles</h4>
            <div>
                <div>profile 1</div>
                <div>profile 2</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>