<script lang="ts" setup>
import { ref, inject, watch } from "vue";
import router from "@/router";
import { useUiStore } from "@/stores/ui";
import { enabledPrezsConfigKey, type PrezFlavour } from "@/types";
import CatPrezSearch from "@/components/search/CatPrezSearch.vue";
import SpacePrezSearch from "@/components/search/SpacePrezSearch.vue";
import VocPrezSearch from "@/components/search/VocPrezSearch.vue";

const enabledPrezs = inject(enabledPrezsConfigKey) as PrezFlavour[];
const ui = useUiStore();

const props = withDefaults(defineProps<{
    flavour?: PrezFlavour;
    query?: {[key: string]: string};
    fullPage?: boolean;
}>(), {
    fullPage: false
});

const defaultSearchMethod = "exactMatch";

const expanded = ref(false);
const prez = ref(props.flavour ? props.flavour : (props.query ? props.query.prez || "all" : "all"));
const searchTerm = ref(props.query ? props.query.term : "");
const searchMethod = ref(props.query ? (props.query.method ? props.query.method : defaultSearchMethod) : defaultSearchMethod);
const searchOptions = ref<{[key: string]: string}>({});

watch(prez, (newValue, oldValue) => {
    if (newValue !== oldValue && newValue === "all") {
        expanded.value = false;
    }
    searchMethod.value = defaultSearchMethod;
});

function submit() {
    router.push({
        name: "search",
        query: {
            term: searchTerm.value,
            prez: prez.value !== "all" ? prez.value : undefined,
            method: searchMethod.value || undefined,
            ...searchOptions.value
        }
    });
}

function clearSearch() {
    searchTerm.value = "";
}

function camelToTitleCase(s: string): string {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
</script>

<template>
    <form @submit.stop.prevent="submit()">
        <div :class="`search-form ${props.fullPage ? 'lg' : ''}`">
            <div class="search-bar-container">
                <div :class="`search-bar ${expanded ? 'full-width' : ''}`">
                    <input
                        type="search"
                        name="term"
                        id=""
                        class="search-input"
                        v-model="searchTerm"
                        :placeholder="`${prez === 'all' ? 'Global search...' : 'Search...'}`"
                    >
                    <button type="button" @click="clearSearch()" class="clear-btn"><i class="fa-regular fa-xmark"></i></button>
                </div>
                <button v-if="!expanded" type="submit" class="btn submit-btn"><i class="fa-regular fa-magnifying-glass"></i></button>
            </div>
            <div class="search-below">
                <select v-if="!props.flavour" name="prez" id="" class="search-type" v-model="prez">
                    <option value="all">All</option>
                    <option v-for="prezFlavour in enabledPrezs" :value="prezFlavour">{{ prezFlavour }}</option>
                </select>
                <button v-if="prez !== 'all'" type="button" class="collapse-btn" @click.prevent="expanded = !expanded">
                    <template v-if="expanded">Collapse <i class="fa-regular fa-chevron-up"></i></template>
                    <template v-else>Expand <i class="fa-regular fa-chevron-down"></i></template>
                </button>
            </div>
            <div v-if="prez !== 'all' && expanded">
                <label for="search-method">Search Method</label>
                <br/>
                <select name="search-method" id="search-method" v-model="searchMethod">
                    <option v-for="method in ui.searchMethods[prez]" :value="method">{{ camelToTitleCase(method) }}</option>
                </select>
            </div>
            <template v-if="!props.flavour || (props.flavour === 'CatPrez')">
                <div v-show="prez === 'CatPrez' && expanded">
                    <CatPrezSearch @updateOptions="searchOptions = $event" :defaultSelected="props.query?.catalog" />
                </div>
            </template>
            <template v-if="!props.flavour || (props.flavour === 'SpacePrez')">
                <div v-show="prez === 'SpacePrez' && expanded">
                    <SpacePrezSearch @updateOptions="searchOptions = $event" :defaultSelected="{ dataset: props.query?.dataset, collection: props.query?.collection }" />
                </div>
            </template>
            <template v-if="!props.flavour || (props.flavour === 'VocPrez')">
                <div v-show="prez === 'VocPrez' && expanded">
                    <VocPrezSearch @updateOptions="searchOptions = $event" :defaultSelected="props.query?.vocab" />
                </div>
            </template>
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