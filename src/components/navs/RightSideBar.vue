<script lang="ts" setup>
import AltNav from "@/components/navs/AltNav.vue";
import type { ProfileHeader } from "@/types";

const props = defineProps<{
    profiles: ProfileHeader[];
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
    width: 260px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>