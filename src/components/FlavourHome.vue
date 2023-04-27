<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { useUiStore } from "@/stores/ui";
import type { PrezFlavour } from "@/types";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";

const ui = useUiStore();

const props = defineProps<{
    flavour: PrezFlavour;
    links: {
        label: string;
        url: string;
        description?: string;
    }[];
}>();

const letter = computed(() => {
    return props.flavour[0].toLowerCase();
});

const homeLinks = computed(() => {
    return [
        ...props.links,
        {
            label: "Profiles",
            description: `A list of Profiles used by ${props.flavour}`,
            url: `/${letter.value}/profiles`
        },
        {
            label: `About ${props.flavour}`,
            url: `/${letter.value}/about`
        }
    ]
});

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = `${getPrezSystemLabel(props.flavour) + " Home"} | Prez`;
    ui.pageHeading = { name: props.flavour, url: `/${letter.value}`};
    ui.breadcrumbs = [{ name: getPrezSystemLabel(props.flavour) + " Home", url: `/${letter.value}` }];
});
</script>

<template>
    <h1 class="page-title">{{ getPrezSystemLabel(props.flavour) }}</h1>
    <div class="home-page-links">
        <RouterLink v-for="link in homeLinks" :to="link.url" class="home-page-link">
            <h4 class="link-title">{{ link.label }}</h4>
            <p v-if="link.description" class="link-desc">{{ link.description }}</p>
        </RouterLink>
    </div>
    <AdvancedSearch :flavour="props.flavour" fullPage />
    <slot></slot>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.home-page-links {
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin: 20px auto;
    flex-wrap: wrap;
    // justify-content: center;

    a.home-page-link {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background-color: var(--cardBg);
        border-radius: $borderRadius;

        h4.link-title {
            margin: 0;
        }

        p.link-desc {
            margin: 0;
            color: black;
            font-size: 0.95rem;
        }
    }
}
</style>