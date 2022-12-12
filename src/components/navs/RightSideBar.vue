<script lang="ts" setup>
import AltNav from "@/components/navs/AltNav.vue";

const props = defineProps<{
    profiles: any[];
    currentUrl: string;
}>();
</script>

<template>
    <div id="right-nav">
        <Transition name="fade">
            <AltNav v-show="!!props.profiles && props.profiles.length > 0" :profiles="props.profiles" :currentUrl="props.currentUrl" />
        </Transition>
        <div>Optional other content</div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_transitions.scss";

#right-nav {
    min-width: 260px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
}
</style>