<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
import { containerQsa } from "@/util/helpers";

const props = defineProps<{
    containerUri?: string;
    containerBaseClass?: string;
    baseClass?: string;
}>();

const searchTerm = ref("");

function clearSearch() {
    searchTerm.value = "";
}

function submit() {
    const query: {[key: string]: string | number} = {
        term: searchTerm.value,
        limit: 10,
    };
    if (props.containerBaseClass && props.containerUri) {
        query[containerQsa(props.containerBaseClass)] = props.containerUri;
    }
    if (props.baseClass) {
        query["focus-to-filter[rdf:type]"] = props.baseClass;
    }

    router.push({
        name: "search",
        query: query
    });
}
</script>

<template>
    <div class="search-bar-container">
        <div class="search-bar">
            <input
                type="search"
                name="term"
                id=""
                class="search-input"
                v-model="searchTerm"
                placeholder="Search..."
                @keyup.enter="searchTerm !== '' && submit()"
            >
            <button type="button" @click="clearSearch()" class="clear-btn"><i class="fa-regular fa-xmark"></i></button>
        </div>
        <button type="submit" class="btn submit-btn" @click="submit" :disabled="searchTerm === ''"><i class="fa-regular fa-magnifying-glass"></i></button>
    </div>
</template>

<style lang=scss scoped>
@import "@/assets/sass/_variables";

.search-bar-container {
    display: flex;
    flex-direction: row;
    width: 100%;

    .search-bar {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        background-color: white;
        border-top-left-radius: $borderRadius;
        border-bottom-left-radius: $borderRadius;
        border: 1px solid #aaaaaa;
        border-right: none;
        flex-grow: 1;

        input.search-input {
            background-color: unset;
            border: none;
            width: 100%;
        }

        button.clear-btn {
            padding: 8px 10px;
            background-color: transparent;
            border: none;
            color: #aaaaaa;
            cursor: pointer;
            @include transition(color);

            &:hover {
                color: #888888;
            }
        }

        &.full-width {
            border-right: 1px solid #aaaaaa;
            border-top-right-radius: $borderRadius;
            border-bottom-right-radius: $borderRadius;
        }
    }

    button.submit-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
    }
}
</style>