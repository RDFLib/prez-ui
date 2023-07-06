<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";

// the searchable map component and related map type definitions
import MapClient from "@/components/MapClient.vue";
import { AreaTypes, ShapeTypes, type Coords } from "@/components/MapClient.d";

// the pinia search store and related type definitions to manage the returned catalog tree
import { refDataStore } from "@/stores/refDataStore";
import { QUERY_GET_CATALOGS, QUERY_GET_THEMES, QUERY_SEARCH } from "@/stores/catalogQueries"
import type { RDCatalog, RDSearch, RDTheme } from "@/stores/catalogQueries.d"
import { shapeQueryPart } from "@/util/mapSearchHelper"

import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import BaseModal from "@/components/BaseModal.vue";

const MAX_DESC_LENGTH = 200;

const rdCatalogs = refDataStore("catalogs")()
const rdThemes = refDataStore("themes")()
const rdSearch = refDataStore("search")()

const searchTermRef = ref("")
const selectedCatalogsRef = ref<string[]>([])
const selectedThemesRef = ref<string[]>([])
const shapeTypeRef = ref(ShapeTypes.None)
const coordsRef = ref<Coords>([])
const showQueryRef = ref(false)
const sparqlQueryRef = ref("")
const limitRef = ref(10)

const modal = ref<string | null>(null);

const allCatalogsSelected = computed(() => {
    let allSelected = true;
    (rdCatalogs.data as RDCatalog[]).forEach(catalog => {
        if (!selectedCatalogsRef.value.includes(catalog.c)) {
            allSelected = false;
            return false;
        }
    });
    return allSelected;
});

const allThemesSelected = computed(() => {
    let allSelected = true;
    (rdThemes.data as RDTheme[]).forEach(theme => {
        if (!selectedThemesRef.value.includes(theme.th)) {
            allSelected = false;
            return false;
        }
    });
    return allSelected;
});

async function toggleSelectAllCatalogs() {
    let selectedCatalogs: string[] = [];
    if (!allCatalogsSelected.value) {
        (rdCatalogs.data as RDCatalog[]).forEach(catalog => {
            selectedCatalogs.push(catalog.c);
        });
    }
    selectedCatalogsRef.value = selectedCatalogs;

    await performSearch();
}

async function toggleSelectAllThemes() {
    let selectedThemes: string[] = [];
    if (!allThemesSelected.value) {
        (rdThemes.data as RDTheme[]).forEach(theme => {
            selectedThemes.push(theme.th);
        });
    }
    selectedThemesRef.value = selectedThemes;

    await performSearch();
}

// called when a selection has changed
const updateSelection = async (selectedCoords:Coords, shapeType:ShapeTypes) => {
    //shapeTypeRef.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    shapeTypeRef.value = shapeType
    coordsRef.value = selectedCoords
    await performSearch();
}

const links = [
    {
        label: "Catalogs",
        url: "/c/catalogs",
        description: "A list of DCAT Catalogs"
    }
];

const fetchThemes = async () => {
    await rdThemes.fetch<RDTheme[]>(QUERY_GET_THEMES(selectedCatalogsRef.value));
}

const performSearch = async(event: Event|null=null) => {
    if(event) {
        event.preventDefault();
    }
    sparqlQueryRef.value = QUERY_SEARCH(selectedCatalogsRef.value, searchTermRef.value, selectedThemesRef.value, shapeQueryPart(coordsRef.value), //limitRef.value);
        (limitRef.value > 0 ? parseInt(limitRef.value.toString()) + 1 : 0));
    await rdSearch.fetch<RDSearch[]>(sparqlQueryRef.value)
}

function copySPARQL() {
    navigator.clipboard.writeText(sparqlQueryRef.value);
}

// start off by loading the main filter lists for catalogs and themes
onMounted(async ()=>{
    await rdCatalogs.fetch<RDCatalog[]>(QUERY_GET_CATALOGS);
    (rdCatalogs.data as RDCatalog[]).forEach(cat=>{
        selectedCatalogsRef.value.push(cat.c)
    });
    await fetchThemes();
    (rdThemes.data as RDTheme[]).forEach(theme=>{
        selectedThemesRef.value.push(theme.th);
    })
    await performSearch();
})

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
                            v-model="searchTermRef"
                            placeholder="Search..."
                            @keyup.enter="performSearch()"
                        >
                    </div>
                    <div class="form-section">
                        <h4>Catalogues</h4>
                        <div class="catalog-buttons">
                            <div class="select-all-input">
                                <input type="checkbox" name="select-all-catalogs" id="select-all-catalogs" @change="toggleSelectAllCatalogs" v-model="allCatalogsSelected">
                                <label for="select-all-catalogs">Select all</label>
                            </div>
                        </div>
                        <LoadingMessage v-if="rdCatalogs.loading" />
                        <ErrorMessage v-else-if="rdCatalogs.error" :message="`Unable to load catalogs: ${rdCatalogs.error}`" />
                        <ul v-else-if="rdCatalogs.data.length > 0" class="catalog-options">
                            <li v-for="(catalog, index) in <RDCatalog[]>rdCatalogs.data" class="catalog-option" :style="catalog.c.endsWith('/system/catprez') ? 'display: none;' : ''">
                                <input type="checkbox" :id="`catalog-${index}`" :value="catalog.c" v-model="selectedCatalogsRef" @change="async (event) => { await fetchThemes(); await performSearch(); }" />
                                <label :for="`catalog-${index}`">{{ catalog.t }}</label>
                            </li>
                        </ul>
                    </div>
                    <div class="form-section">
                        <h4>Themes</h4>
                        <div class="theme-buttons">
                            <div class="select-all-input">
                                <input type="checkbox" name="select-all-themes" id="select-all-themes" @change="toggleSelectAllThemes" v-model="allThemesSelected">
                                <label for="select-all-themes">Select all</label>
                            </div>
                        </div>
                        <LoadingMessage v-if="rdThemes.loading" />
                        <ErrorMessage v-else-if="rdThemes.error" :message="`Unable to load catalogs: ${rdThemes.error}`" />
                        <ul v-else-if="rdThemes.data.length > 0" class="theme-options">
                            <li v-for="(theme, index) in <RDTheme[]>rdThemes.data" class="theme-option" :key="theme.th">
                                <input type="checkbox" 
                                    :value="theme.th" 
                                    v-model="selectedThemesRef"
                                    :id="`theme-${index}`"
                                    @change="(event) => performSearch()"
                                />
                                <label :for="`theme-${index}`">{{ theme.pl }}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom-buttons">
                    <button class="btn outline" @click="modal = 'sparqlQuery'">Show Query <i class="fa-regular fa-code"></i></button>
                    <div class="right-buttons">
                        <div class="result-limit-input">
                            <label for="result-limit">Result limit</label>
                            <input id="result-limit" type="number" @change="performSearch()" v-model="limitRef" min="1" max="100">
                        </div>
                        <button class="btn" @click="performSearch()">Search <i class="fa-regular fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </div>
            <div class="search-map">
                <MapClient
                    ref="searchMapRef"
                    :drawing-modes="['RECTANGLE']"
                    @selectionUpdated="updateSelection"
                />
            </div>
        </div>
        <div class="results">
            <h3>Results</h3>
            <LoadingMessage v-if="rdSearch.loading" />
            <ErrorMessage v-else-if="rdSearch.error" :message="rdSearch.error" />
            <table v-else-if="rdSearch.data && rdSearch.data.length > 0">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Themes</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(result, index) in <RDSearch[]>rdSearch.data">
                        <tr :class="`${index % 2 === 1 ? 'grey' : '' }`">
                            <td><a :href="`/object?uri=${encodeURIComponent(result.r)}`">{{ result.t }}</a></td>
                            <td>
                                <template v-for="(th, tindex) in result.thlist.split('\t')">
                                    <a :href="`/object?uri=${th}`">
                                        {{ result.thpllist.split('\t')[tindex] }}
                                    </a>
                                    <br/>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="result.d" :class="`${index % 2 === 1 ? 'grey' : '' }`">
                            <td colspan="2" class="desc">{{ result.d.length > MAX_DESC_LENGTH ? result.d.slice(0, MAX_DESC_LENGTH) + '...' : result.d }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div v-else>
                No results
            </div>
        </div>
    </div>
    <BaseModal v-if="modal === 'sparqlQuery'" @modalClosed="modal = null">
        <template #headerMiddle>Spatial Search SPARQL Query</template>
        <div class="sparql-query-content">
            <pre>{{ sparqlQueryRef.trim() }}</pre>
        </div>
        <template #footer>
            <button class="btn outline sparql-copy-btn" @click="copySPARQL" title="Copy SPARQL query">Copy <i class="fa-regular fa-copy"></i></button>
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