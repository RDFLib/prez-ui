<script lang="ts" setup>
// the searchable map component and related map type definitions
import MapClient from "@/components/MapClient.vue";
import { AreaTypes, ShapeTypes, type Coords } from "@/components/MapClient.d";

// the pinia search store and related type definitions to manage the returned dataset tree
import { refDataStore } from "@/stores/refDataStore";
import { onMounted, ref } from "vue";
import { QUERY_GET_CATALOGS, QUERY_GET_THEMES, QUERY_SEARCH } from '@/stores/catalogQueries'
import type { RDCatalog, RDSearch, RDTheme } from '@/stores/catalogQueries.d'
import { shapeQueryPart } from '@/util/mapSearchHelper'

const rdCatalogs = refDataStore('catalogs')()
const rdThemes = refDataStore('themes')()
const rdSearch = refDataStore('search')()

const searchTermRef = ref('')
const selectedCatalogsRef = ref([])
const selectedThemesRef = ref([])
const shapeTypeRef = ref(ShapeTypes.None)
const coordsRef = ref<Coords>([])
const showQueryRef = ref(false)
const sparqlQueryRef = ref('')
const limitRef = ref(10)

// called when a selection has changed
const updateSelection = async (selectedCoords:Coords, shapeType:ShapeTypes) => {
    //shapeTypeRef.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    shapeTypeRef.value = shapeType
    coordsRef.value = selectedCoords
}

const links = [
    {
        label: "Catalogs",
        url: "/c/catalogs",
        description: "A list of DCAT Catalogs"
    }
];

const fetchThemes = async () => {
    await rdThemes.fetch<RDTheme[]>('c', QUERY_GET_THEMES(selectedCatalogsRef.value));
}

const performSearch = async(event: Event|null=null) => {
    if(event) {
        event.preventDefault();
    }
    sparqlQueryRef.value = QUERY_SEARCH(selectedCatalogsRef.value, searchTermRef.value, selectedThemesRef.value, shapeQueryPart(coordsRef.value), //limitRef.value);
        (limitRef.value > 0 ? parseInt(limitRef.value.toString()) + 1 : 0));
    await rdSearch.fetch<RDSearch[]>('c', sparqlQueryRef.value)
}

// start off by loading the main filter lists for catalogs and themes
onMounted(async ()=>{
    await rdCatalogs.fetch<RDCatalog[]>('c', QUERY_GET_CATALOGS);
    await fetchThemes()
})

</script>

<template>
    <div class="container">
        <div class="left-panel">
            <form @submit="(event)=>performSearch(event)" class="query-options">
                <div class="query-option">
                    <h4 class="query-option-title">Catalogues to include</h4>
                    <ul>
                        <li v-for="cat in <RDCatalog[]>rdCatalogs.data" :key="cat.c">
                            <label>
                                <input type="checkbox" 
                                    :value="cat.c" 
                                    v-model="selectedCatalogsRef" 
                                    @change="(event) => fetchThemes()"
                                /> {{ cat.t }}
                            </label>
                        </li>
                    </ul>

                    <h4 class="query-option-title">Search text</h4>
                    <p>
                        <input
                            type="search"
                            name="term"
                            class="search-input"
                            v-model="searchTermRef"
                            placeholder="enter search terms"
                        >
                    </p>

                    <h4 class="query-option-title">Theme filter</h4>
                    <ul>
                        <li v-for="theme in <RDTheme[]>rdThemes.data" :key="theme.th">
                            <label>
                                <input type="checkbox" 
                                    :value="theme.th" 
                                    v-model="selectedThemesRef" 
                                    @change="(event) => null"
                                /> {{ theme.pl }}
                            </label>
                        </li>
                        <li v-if="rdThemes.data.length == 0">(none)</li>
                    </ul>
                </div>

                <div class="btn-container">
                    <span class="nowrap">Results limit: <input id="input-limit" class="space-right" v-model="limitRef" /></span>
                    <span class="nowrap"><label class="space-right"><input v-model="showQueryRef" type="checkbox">Show query</label></span>
                    <button class="btn" type="submit">Search</button>
                </div>

            </form>
        </div>
        <div class="right-panel">
            <MapClient 
                ref="searchMapRef" 
                :drawing-modes="['RECTANGLE']"
                @selectionUpdated="updateSelection"
                :style="'width: 100%; height: 550px; background-color: #eee;'"
            />
        </div>

    </div>

    <div v-if="rdSearch.loading">
        <h3>Loading...</h3>
        <div class="loading-icon"></div>
    </div>
    <div v-else>
        <div v-if="rdSearch.data && rdSearch.data.length > 0">
            <h3>Result set ({{ limitRef == 0 ? `${limitRef}` : rdSearch.data.length > limitRef ? `${limitRef}+` : rdSearch.data.length }})</h3>
            <table>
                <thead>
                    <th>Resource Label</th>
                    <th>Resource Description</th>
                    <th>Theme Labels</th>
                </thead>
                <tbody>
                    <template v-for="(result, index) in <RDSearch[]>rdSearch.data">
                        <tr :key="index" v-if="limitRef === 0 || index < limitRef">                            
                            <td><a target="_blank" v-bind:href="`${result.r}`">{{ result.t }}</a></td>
                            <td>{{ result.d }}</td>
                            <td class="th-list"><a v-for="(th, tindex) in result.thlist.split('\t')" target="_blank" v-bind:href="`${th}`">{{ result.thpllist.split('\t')[tindex] }}</a></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div v-else-if="rdSearch.error">
            <h3>Unable to search map</h3>
            <div class="error">
                {{ rdSearch.error }}
            </div>
        </div>
        <div v-else>
            <h3>No results</h3>
        </div>
    </div>


<pre v-if="showQueryRef" class="debug">

<b>SPARQL query:</b>

{{ sparqlQueryRef }}

</pre>


</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.btn-container {
    margin-top: auto;
    text-align:right;
}

.th-list a {
    display:block;
}

table {
    border-collapse: collapse;
    background-color: white;
    width:100%;
    thead {
        th {
            padding: 10px;
            background-color: #ccc;
            text-align:left;
        }
    }
    tbody {
        td {
            padding: 5px;
        }
    }
    tr {
        th, td {
        }

        th {
            text-align: center;
        }

        &:nth-child(2n) {
            background-color: var(--tableBg);
        }
    }
}


.container {
    display: grid;
    grid-template-columns: 1fr 3fr; /* set the column widths to 1/4 and 3/4 of the container width */
}

.left-panel {
    min-width: 480px;
    padding-right: 1em;
}
.right-panel {
}

.search-input {
    width: 100%;
}


/* Media query for small screens */
@media (max-width: 1024px) {
    .container {
        grid-template-columns: 1fr;
    }
    .left-panel {
        margin-bottom: 2em;
        width: 100%;
        padding-right: 0;
    }
    .search-input {
        width:100%;
    }
}

.space-right {
    margin-right:1em;    
}

#input-limit {
    width:3em;
}

.msg {
    color: var(--primary);    
}

.nowrap {
    display:inline-block;
    white-space: nowrap;
    margin-top:10px;
}

ul li {
    list-style-type: none;
    padding-bottom: 4px;
}

ul {
    padding-left:0;
    margin-left:0;
}

pre.debug {
    white-space: break-spaces;
}

.small-input {
    font-size:small;
    height:1.5em;
    width:3em; 
}
.query-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: var(--cardBg);
    padding: 10px;
    border-radius: $borderRadius;
    min-height: 550px;

    .query-option {

        padding-bottom: 20px;

        .query-option-title {
            padding-top:0;
            margin-top:5px;
            margin-bottom:8px;
        }

        .button {

        }

    }
}

.error {
    background-color: lightcoral;
    display: inline-block;
}

.loading-icon {
  position: relative;
  width: 20px;
  height: 20px; 
  margin:0;
  padding:0;
  -webkit-animation: fa-spin 2s infinite linear;
  animation: fa-spin 2s infinite linear;
}

.loading-icon:before {
  content: "\f1ce";
  font-family: FontAwesome;
  font-size:20px;
  line-height:21px;
  position: absolute;
  top: 0; 
  bottom:0;
}


</style>