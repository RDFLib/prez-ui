<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { PropTableObject } from "@/types";
import ToolTip from "@/components/ToolTip.vue";

const props = defineProps<PropTableObject>();

// dumb hack to guarantee vocab link is first if exists
const links = computed(() => {
    return props.links?.reverse();
});
</script>

<template>
    <div class="link">
        <component :is="!!props.description ? ToolTip : 'slot'">
            <RouterLink v-if="links" :to="links[0]">
                <template v-if="!!props.label">{{ props.label }}</template>
                <template v-else-if="!!props.qname">{{ props.qname }}</template>
                <template v-else>{{ props.value }}</template>
            </RouterLink>
            <a
                v-else
                :href="props.value"
                target="_blank"
                rel="noopener noreferrer"
            >
                <template v-if="!!props.label">{{ props.label }}</template>
                <template v-else-if="!!props.qname">{{ props.qname }}</template>
                <template v-else>{{ props.value }}</template>
            </a>
            <template v-if="!!props.description" #text>{{ props.description }}</template>
        </component>
        <span v-if="links && links.length > 1" class="multi-links">
            <template v-for="(link, index) in links.slice(1)">
                <template v-if="index === 0">(</template>
                <RouterLink :to="link" class="btn sm outline alt-internal-link"><i class="fa-solid fa-link" title="Alternative internal link"></i></RouterLink>
                <template v-if="index < links.length - 2">,&nbsp;</template>
                <template v-if="index === links.length - 2">)</template>
            </template>
        </span>
        <a
            v-if="links"
            :href="props.value"
            target="_blank"
            rel="noopener noreferrer"
            class="btn sm outline ext-link"
        >
            <i class="fa-solid fa-arrow-up-right-from-square" title="External link"></i>
        </a>
    </div>
</template>

<style lang="scss" scoped>
.link {
    .multi-links {
        margin: 0px 4px;

        .alt-internal-link {
            padding: 4px;
        }
    }

    i {
        font-size: 0.8rem;
    }

    .ext-link {
        margin-left: 4px;
    }
}
</style>