<script lang="ts" setup>
import { computed, ref } from "vue";
import type { ProfileHeader } from "@/types";
import AltNav from "@/components/navs/AltNav.vue";

const props = defineProps<{
    profiles: ProfileHeader[];
    currentUrl: string;
}>();

const teleportRef = ref<HTMLElement | null>(null);
const teleportChildren = computed(() => {
    if (teleportRef.value) {
        return teleportRef.value.children.length;
    } else {
        return 0;
    }
});
</script>

<template>
    <div id="right-nav">
        <div id="search-teleport"></div>
        <div id="right-bar-content" ref="teleportRef"></div>
        <hr v-if="(props.profiles && props.profiles.length > 0) && teleportChildren > 0"/>
        <Transition name="fade">
            <AltNav v-show="!!props.profiles && props.profiles.length > 0" :profiles="props.profiles" :currentUrl="props.currentUrl" />
        </Transition>
        <div id="score-teleport"></div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_transitions.scss";

#right-nav {
    width: 260px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    #score-teleport {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
}

hr {
    width: 80%;
    border: none;
    border-top: 1px solid #e4e4e4;
}
</style>