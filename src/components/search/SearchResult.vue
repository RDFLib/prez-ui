<script lang="ts" setup>
import { RouterLink } from "vue-router";
import type { SearchItem } from "@/types";

const MAX_DESC_LENGTH = 200;

const props = defineProps<SearchItem>();
</script>

<template>
    <div class="result">
        <div class="result-heading">
            <span class="result-title">{{ props.title || props.uri }}</span>
            <div class="result-types">
                <span v-for="t in props.types" class="badge">{{ t.label || t.uri }}</span>
            </div>
            <!-- <button class="btn outline sm map-btn" title="Show on map"><i class="fa-solid fa-location-crosshairs"></i></button> -->
        </div>
        <div class="result-links">
            <div v-if="props.links.length > 1">Links:</div>
            <RouterLink v-for="link in props.links" :to="link.link" :class="`link ${props.links.length > 1 ? 'link-list' : ''}`">
                <span v-for="parent in link.parents" class="link-parent">{{ parent.title || parent.iri }} &gt;&nbsp;</span>
                <span class="link-self">{{ props.title }}</span>
            </RouterLink>
        </div>
        <p v-if="props.description" class="result-desc">
            {{ props.description.length > MAX_DESC_LENGTH ? props.description.slice(0, MAX_DESC_LENGTH) + "..." : props.description }}
        </p>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.result {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background-color: var(--cardBg);
    padding: 6px;
    border-radius: $borderRadius;

    .result-heading {
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;

        .result-title {
            font-weight: bold;
        }

        .result-types {

        }

        button.map-btn {
            margin-left: auto;
        }
    }

    .result-links {
        display: flex;
        flex-direction: column;
        font-size: 0.9em;
        align-items: flex-start;

        a.link {
            transition: background-color 0.2s ease-in-out;
            &.link-list {
                margin-left: 8px;
            }

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            
            .link-parent {
                color: black;
            }

            .link-self {

            }
        }
    }

    .result-desc {
        margin: 0;
        font-style: italic;
        font-size: 0.8em;
        color: grey;
    }
}
</style>