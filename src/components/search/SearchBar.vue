<script lang="ts" setup>
import { ref } from "vue";
import type { PrezFlavour } from "@/types";
import router from "@/router";
import { containerQsa, defaultQnameToIri } from "@/util/helpers";

const BASE_CLASSES_PER_FLAVOUR: { [flavour in PrezFlavour]: string[] } = {
    "CatPrez": [
        defaultQnameToIri("dcat:Catalog"),
        defaultQnameToIri("dcat:Resource"),
    ],
    "SpacePrez": [
        defaultQnameToIri("dcat:Dataset"),
        defaultQnameToIri("geo:FeatureCollection"),
        defaultQnameToIri("geo:Feature"),
    ],
    "VocPrez": [
        defaultQnameToIri("skos:ConceptScheme"),
        defaultQnameToIri("skos:Collection"),
        defaultQnameToIri("skos:Concept"),
    ]
};

const props = withDefaults(defineProps<{
    containerUri?: string;
    containerBaseClass?: string;
    baseClass?: string;
    flavour?: PrezFlavour;
    size?: "normal" | "large";
}>(), {
    size: "normal"
});

const searchTerm = ref("");

function clearSearch() {
    searchTerm.value = "";
}

function submit() {
    const query: {[key: string]: string | number} = {
        term: searchTerm.value.trim(),
        limit: 10,
    };
    if (props.flavour) {
        query["focus-to-filter[rdf:type]"] = BASE_CLASSES_PER_FLAVOUR[props.flavour].join(",");
    } else {
        if (props.containerBaseClass && props.containerUri) {
            // treat feature collection container as a dataset
            query[containerQsa(props.containerBaseClass === defaultQnameToIri("geo:FeatureCollection") ? defaultQnameToIri("dcat:Dataset") : props.containerBaseClass)] = props.containerUri;
        }
        if (props.baseClass) {
            query["focus-to-filter[rdf:type]"] = props.baseClass;
        }
    }

    router.push({
        name: "search",
        query: query
    });
}
</script>

<template>
    <div :class="`search-bar-container ${props.size === 'large' ? 'lg' : ''}`">
        <div class="search-bar">
            <input
                type="search"
                name="search-term"
                id=""
                class="search-input"
                v-model="searchTerm"
                placeholder="Search..."
                @keyup.enter="searchTerm.trim() !== '' && submit()"
            >
            <button type="button" @click="clearSearch()" class="clear-btn"><i class="fa-regular fa-xmark"></i></button>
        </div>
        <button type="submit" :class="`btn submit-btn ${props.size === 'large' ? 'lg' : ''}`" @click="submit" :disabled="searchTerm.trim() === ''"><i class="fa-regular fa-magnifying-glass"></i></button>
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
            border: none !important;
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
    }

    button.submit-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
    }

    &.lg {
        * {
            font-size: 1em;
        }

        .search-bar {
            input.search-input {
                padding: 10px;
            }
            button.clear-btn {
                padding: 10px 12px;
            }
        }
    }
}
</style>