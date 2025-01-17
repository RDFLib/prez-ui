<script lang="ts" setup>
import { onMounted, ref, computed, inject, watch } from "vue";
import { DataFactory } from "n3";
import { apiBaseUrlConfigKey } from "@/types";
import { ShapeTypes, type Coords } from "@/components/MapClient.d";
import { useApiRequest, useSparqlRequest } from "@/composables/api";
import { useRdfStore } from "@/composables/rdfStore";
import { catalogSpatialSearch, getThemesQuery } from "@/sparqlQueries/catalogSearch";
import { shapeQueryPart } from "@/util/mapSearchHelper"
import { copyToClipboard, ensureAnnotationPredicates, getLabel, sortByTitle } from "@/util/helpers";
import MapClient from "@/components/MapClient.vue";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import BaseModal from "@/components/BaseModal.vue";

const { namedNode } = DataFactory;

type Option = {
    title?: string;
    iri: string;
};

type SparqlBinding = {
    [key: string]: {
        type: string;
        datatype?: string;
        value: string;
        "xml:lang"?: string;
    }
};

// type SparqlSelectResponse = {
//     head: {
//         vars: string[];
//     };
//     results: {
//         bindings: SparqlBinding[];
//     };
// };

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;

const { loading: catalogLoading, error: catalogError, apiGetRequest: catalogApiGetRequest } = useApiRequest();
const { loading: themesLoading, error: themesError, sparqlGetRequest: themesSparqlGetRequest, sparqlPostRequest: themesSparqlPostRequest } = useSparqlRequest();
const { loading: searchLoading, error: searchError, sparqlGetRequest: searchSparqlGetRequest, sparqlPostRequest: searchSparqlPostRequest } = useSparqlRequest();
const { store, parseIntoStore, qnameToIri } = useRdfStore();

const LIVE_SEARCH = true;
const MAX_DESC_LENGTH = 200;

const catalogs = ref<Option[]>([]);
const themes = ref<Option[]>([]);
const selectedCatalogs = ref<string[]>([]);
const selectedThemes = ref<string[]>([]);
const searchTerm = ref("");
const limit = ref(10);
const shape = ref<{
    type: ShapeTypes;
    coords: Coords;
}>({
    type: ShapeTypes.None,
    coords: []
});
const showQuery = ref(false);
const results = ref<{
    iri: string;
    title: string;
    description: string;
    themes: {
        iri: string;
        title: string;
    }[];
}[]>([]);

const query = computed(() => {
    return catalogSpatialSearch(
        selectedCatalogs.value,
        searchTerm.value,
        selectedThemes.value,
        shapeQueryPart(shape.value.coords),
        limit.value > 0 ? parseInt(limit.value.toString()) : 0
    );
});

const allCatalogsSelected = computed(() => {
    return catalogs.value.every(catalog => selectedCatalogs.value.includes(catalog.iri));
});

const allThemesSelected = computed(() => {
    return themes.value.every(theme => selectedThemes.value.includes(theme.iri));
});

function toggleSelectAllCatalogs() {
    selectedCatalogs.value = !allCatalogsSelected.value ? catalogs.value.map(catalog => catalog.iri) : [];
}

function toggleSelectAllThemes() {
    selectedThemes.value = !allThemesSelected.value ? themes.value.map(theme => theme.iri) : [];
}

function handleMapSelectionChange(selectedCoords: Coords, shapeType: ShapeTypes) {
    shape.value = {
        type: shapeType,
        coords: selectedCoords
    };
}

/**
 * Gets the list of Catalogs from the API endpoint `/c/catalogs` & creates the list of catalog options
 */
async function getCatalogs() {
    const { data } = await catalogApiGetRequest("/c/catalogs");
    if (data && !catalogError.value) {
        parseIntoStore(data);

        const catalogOptions: Option[] = [];

        store.value.forSubjects(subject => {
            if (!subject.value.endsWith("/system/catprez")) { // hide system catalog
                const catalog: Option = {
                    iri: subject.value
                };

                catalog.title = getLabel(subject.value, store.value);

                catalogOptions.push(catalog);
            }
        }, namedNode(qnameToIri("a")), namedNode(qnameToIri("dcat:Catalog")), null);

        catalogs.value = catalogOptions.sort(sortByTitle);
    }
}

/**
 * Gets a list of themes from a SPARQL query from the API & creates the list of theme options
 */
async function getThemes() {
    const themesData = await themesSparqlPostRequest(`${apiBaseUrl}/sparql`, getThemesQuery(selectedCatalogs.value));
    if (themesData && !themesError.value) {
        themes.value = (themesData.results.bindings as SparqlBinding[]).map(result => {
            return {
                title: result.title.value,
                iri: result.theme.value
            };
        });
    }
}

/**
 * Performs search via a SPARQL query
 */
async function doSearch() {
    const searchData = await searchSparqlPostRequest(`${apiBaseUrl}/sparql`, query.value);
    if (searchData && !searchError.value) {
        results.value = (searchData.results.bindings as SparqlBinding[]).map(result => {
            return {
                iri: result.resource.value,
                title: result.title.value,
                description: result.desc.value,
                themes: result.themeList.value.split("\t").map((theme, index) => {
                    return {
                        iri: theme,
                        title: result.themeListLabels.value.split("\t")[index]
                    };
                })
            }
        });
    }
}

watch(selectedCatalogs, async (newValue, oldValue) => {
    await getThemes();
    if (LIVE_SEARCH) {
        await doSearch();
    }
}, { deep: true });

watch(selectedThemes, async (newValue, oldValue) => {
    if (LIVE_SEARCH) {
        await doSearch();
    }
}, { deep: true });

watch(limit, async (newValue, oldValue) => {
    if (LIVE_SEARCH) {
        await doSearch();
    }
});

watch(searchTerm, async (newValue, oldValue) => {
    if (LIVE_SEARCH) {
        await doSearch();
    }
});

watch(shape, async (newValue, oldValue) => {
    if (LIVE_SEARCH) {
        await doSearch();
    }
}, { deep: true });

onMounted(async () => {
    await ensureAnnotationPredicates();
    await getCatalogs();
    selectedCatalogs.value = catalogs.value.map(catalog => catalog.iri); // select all by default
    await getThemes();
    selectedThemes.value = themes.value.map(theme => theme.iri); // select all by default
    // await doSearch();
});
</script>

<template>
    <div class="catalog-search">
        <div class="search-options">
            <div class="search-form-container">
                <div class="search-form">
                    <div class="form-section">
                        <h4>Text Search</h4>
                        <input
                            type="search"
                            name="term"
                            class="search-input"
                            v-model="searchTerm"
                            placeholder="Search..."
                            @keyup.enter="doSearch()"
                        >
                    </div>
                    <div class="form-section">
                        <h4>Catalogues</h4>
                        <div class="catalog-buttons">
                            <div class="select-all-input">
                                <input
                                    type="checkbox"
                                    name="select-all-catalogs"
                                    id="select-all-catalogs"
                                    @change="toggleSelectAllCatalogs"
                                    :checked="allCatalogsSelected"
                                >
                                <label for="select-all-catalogs">Select all</label>
                            </div>
                        </div>
                        <LoadingMessage v-if="catalogLoading" />
                        <ErrorMessage v-else-if="catalogError" :message="`Unable to load catalogs: ${catalogError}`" />
                        <ul v-else-if="catalogs.length > 0" class="catalog-options">
                            <li v-for="(catalog, index) in catalogs" class="catalog-option">
                                <input
                                    type="checkbox"
                                    :id="`catalog-${index}`"
                                    :value="catalog.iri"
                                    v-model="selectedCatalogs"
                                />
                                <label :for="`catalog-${index}`">{{ catalog.title }}</label>
                            </li>
                        </ul>
                    </div>
                    <div class="form-section">
                        <h4>Themes</h4>
                        <div class="theme-buttons">
                            <div class="select-all-input">
                                <input
                                    type="checkbox"
                                    name="select-all-themes"
                                    id="select-all-themes"
                                    @change="toggleSelectAllThemes"
                                    :checked="allThemesSelected"
                                >
                                <label for="select-all-themes">Select all</label>
                            </div>
                        </div>
                        <LoadingMessage v-if="themesLoading" />
                        <ErrorMessage v-else-if="themesError" :message="`Unable to load catalogs: ${themesError}`" />
                        <ul v-else-if="themes.length > 0" class="theme-options">
                            <li v-for="(theme, index) in themes" class="theme-option">
                                <input
                                    type="checkbox" 
                                    :value="theme.iri" 
                                    v-model="selectedThemes"
                                    :id="`theme-${index}`"
                                />
                                <label :for="`theme-${index}`">{{ theme.title }}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom-buttons">
                    <button class="btn outline" @click="showQuery = true">Show Query <i class="fa-regular fa-code"></i></button>
                    <div class="right-buttons">
                        <div class="result-limit-input">
                            <label for="result-limit">Result limit</label>
                            <input id="result-limit" type="number" v-model="limit" min="1" max="100">
                        </div>
                        <button class="btn" @click="doSearch()">Search <i class="fa-regular fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </div>
            <div class="search-map">
                <MapClient
                    :drawing-modes="['RECTANGLE']"
                    @selectionUpdated="handleMapSelectionChange"
                />
            </div>
        </div>
        <div class="results">
            <h3>Results</h3>
            <LoadingMessage v-if="searchLoading" />
            <ErrorMessage v-else-if="searchError" :message="searchError" />
            <table v-else-if="results.length > 0">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Themes</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(result, index) in results">
                        <tr :class="`${index % 2 === 1 ? 'grey' : '' }`">
                            <td><a :href="`/object?uri=${encodeURIComponent(result.iri)}`">{{ result.title }}</a></td>
                            <td>
                                <template v-for="theme in result.themes">
                                    <a :href="`/object?uri=${theme.iri}`">
                                        {{ theme.title }}
                                    </a>
                                    <br/>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="result.description" :class="`${index % 2 === 1 ? 'grey' : '' }`">
                            <td colspan="2" class="desc">{{ result.description.length > MAX_DESC_LENGTH ? result.description.slice(0, MAX_DESC_LENGTH) + '...' : result.description }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div v-else>
                No results
            </div>
        </div>
    </div>
    <BaseModal v-if="showQuery" @modalClosed="showQuery = false">
        <template #headerMiddle>Spatial Search SPARQL Query</template>
        <div class="sparql-query-content">
            <pre>{{ query.trim() }}</pre>
        </div>
        <template #footer>
            <button class="btn outline sparql-copy-btn" @click="copyToClipboard(query)" title="Copy SPARQL query">Copy <i class="fa-regular fa-copy"></i></button>
        </template>
    </BaseModal>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.catalog-search {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .search-options {
        display: grid;
        grid-template-columns: 2fr 3fr;
        // gap: 20px;

        .search-form-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
            background-color: var(--cardBg);
            border-radius: $borderRadius;
            height: 500px;

            .search-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex-grow: 1;
                overflow-y: auto;

                .form-section {
                    display: flex;
                    flex-direction: column;

                    h4 {
                        margin: 0px 0px 10px 0px;
                    }

                    // .search-input {
                    //     width: 100%;
                    // }

                    .catalog-buttons, .theme-buttons {
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        align-items: center;
                        margin-bottom: 12px;
                    }

                    ul.catalog-options, ul.theme-options {
                        padding-left: 0;
                        margin: 0;
                        
                        li.catalog-option, li.theme-option {
                            list-style-type: none;
                            margin-bottom: 6px;
                        }
                    }
                }
            }

            .bottom-buttons {
                display: flex;
                flex-direction: row;
                gap: 8px;
                justify-content: space-between;
                align-items: center;

                .right-buttons {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;

                    .result-limit-input {
                        display: flex;
                        flex-direction: row;
                        gap: 4px;
                        align-items: center;

                        input {
                            width: 60px;
                            padding: 6px;
                        }
                    }
                }
            }
        }
    }

    .results {
        h3 {
            margin-top: 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            // table-layout: fixed;

            thead {
                th {
                    padding: 10px;
                    background-color: #ccc;
                    text-align: center;
                }
            }

            tbody {
                td {
                    padding: 5px;
                }
            }

            tr.grey {
                background-color: var(--tableBg);
            }

            .desc {
                font-size: 0.8em;
                padding: 0px 8px 8px 8px;
                color: grey;
                font-style: italic;
            }
        }
    }
}

.sparql-query-content {
    padding: 12px;

    pre {
        white-space: pre-wrap;
        margin: 0;
    }
}

.sparql-copy-btn {
    margin-left: auto;
}

@media (max-width: 1024px) {
    .search-options {
        grid-template-columns: 1fr !important;
    }
}
</style>