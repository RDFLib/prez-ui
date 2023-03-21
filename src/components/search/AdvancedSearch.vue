<script lang="ts" setup>
import { ref, inject, watch } from "vue";
import router from "@/router";
import { enabledPrezsConfigKey, type PrezFlavour } from "@/types";
import CatPrezSearch from "@/components/search/CatPrezSearch.vue";
import SpacePrezSearch from "@/components/search/SpacePrezSearch.vue";
import VocPrezSearch from "@/components/search/VocPrezSearch.vue";

const enabledPrezs = inject(enabledPrezsConfigKey) as PrezFlavour[];

const props = withDefaults(defineProps<{
    flavour?: PrezFlavour;
    query?: {[key: string]: string};
    fullPage?: boolean;
}>(), {
    fullPage: false
});

const expanded = ref(false);
const searchType = ref(props.flavour ? props.flavour : (props.query ? props.query.searchType || "all" : "all"));
const searchTerm = ref(props.query ? props.query.filter : "");
const searchOptions = ref<{[key: string]: string}>({});

watch(searchType, (newValue, oldValue) => {
    if (newValue !== oldValue && newValue === "all") {
        expanded.value = false;
    }
});

function submit() {
    router.push({
        name: "search",
        query: {
            filter: searchTerm.value,
            searchType: searchType.value !== "all" ? searchType.value : undefined,
            ...searchOptions.value
        }
    });
}

function clearSearch() {
    searchTerm.value = "";
}
</script>

<template>
    <form @submit.stop.prevent="submit()">
        <div :class="`search-form ${props.fullPage ? 'lg' : ''}`">
            <div class="search-bar-container">
                <div :class="`search-bar ${expanded ? 'full-width' : ''}`">
                    <input
                        type="search"
                        name="filter"
                        id=""
                        class="search-input"
                        v-model="searchTerm"
                        :placeholder="`${searchType === 'all' ? 'Global search...' : 'Search...'}`"
                    >
                    <button type="button" @click="clearSearch()" class="clear-btn"><i class="fa-regular fa-xmark"></i></button>
                </div>
                <button v-if="!expanded" type="submit" class="btn submit-btn"><i class="fa-regular fa-magnifying-glass"></i></button>
            </div>
            <div class="search-below">
                <select v-if="!props.flavour" name="searchType" id="" class="search-type" v-model="searchType">
                    <option value="all">All</option>
                    <option v-if="enabledPrezs.includes('CatPrez')" value="CatPrez">CatPrez</option>
                    <option v-if="enabledPrezs.includes('SpacePrez')" value="SpacePrez">SpacePrez</option>
                    <option v-if="enabledPrezs.includes('VocPrez')" value="VocPrez">VocPrez</option>
                </select>
                <button v-if="searchType !== 'all'" type="button" class="collapse-btn" @click.prevent="expanded = !expanded">
                    <template v-if="expanded">Collapse <i class="fa-regular fa-chevron-up"></i></template>
                    <template v-else>Expand <i class="fa-regular fa-chevron-down"></i></template>
                </button>
            </div>
            <div v-show="searchType === 'CatPrez' && expanded">
                <CatPrezSearch @updateOptions="searchOptions = $event" :defaultSelected="props.query?.catalog" />
            </div>
            <div v-show="searchType === 'SpacePrez' && expanded">
                <SpacePrezSearch @updateOptions="searchOptions = $event" :defaultSelected="{dataset: props.query?.dataset, collection: props.query?.collection}" />
            </div>
            <div v-show="searchType === 'VocPrez' && expanded">
                <VocPrezSearch @updateOptions="searchOptions = $event" :defaultSelected="props.query?.vocab" />
            </div>
            <button v-if="expanded" type="submit" class="btn submit-btn">Search <i class="fa-regular fa-magnifying-glass"></i></button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables";

.search-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    margin: 0 auto;
    
    &.lg {
        width: 50%;

        input.search-input, button.submit-btn {
            padding: 10px;
        }
        button.clear-btn {
            padding: 8px 12px !important;
        }

        input.search-input, button.submit-btn, button.clear-btn {
            font-size: 15px;
        }
    }

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

    .search-below {
        display: flex;
        flex-direction: row;
        align-items: flex-start;

        .collapse-btn {
            margin-left: auto;
            background-color: transparent;
            border: none;
            color: $primary;
            cursor: pointer;
        }
    }
}
</style>