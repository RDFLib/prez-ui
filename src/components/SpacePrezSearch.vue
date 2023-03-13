<script lang="ts" setup>
import SearchMap from "@/components/SearchMap.vue";
import { queryStore, matchDatasets, matchFeatureCollections } from "@/stores/query";
import { QUERY_DATASETS, QUERY_DATASETS_FC } from '@/QUERIES'
import { configKey, defaultConfig } from '@/types'
import { inject, ref, onMounted } from "vue";

const { apiBaseUrl } = inject(configKey, defaultConfig);

const data = queryStore()

const fetchData = async () => {
  await data.fetchData(`${apiBaseUrl}/s/sparql`, QUERY_DATASETS_FC)
}

onMounted(async ()=>{
    await fetchData()
})

enum AreaTypes {
    Nearby='Nearby',
    Contains='Contains',
    Overlaps='Overlaps',
    Within='Within'
} 
const areaTypeRef = ref(AreaTypes.Nearby)

type Coords = Coord[]
type Coord = [number, number]
enum ShapeTypes {
    None='No selection', Point='Point selected', Polygon='Polygon selected'
}

const shapeType = ref(ShapeTypes.None)
const coords = ref<Coords>([])

const updateSelection = (selectedCoords:Coords) => {
    shapeType.value = selectedCoords.length == 0 ? ShapeTypes.None : (selectedCoords.length == 1 ? ShapeTypes.Point : ShapeTypes.Polygon)
    coords.value = selectedCoords
}

</script>

<template>
    <div class="container">
        <div class="left-panel">

            <form action="" class="query-options">
                <div class="query-option">
                    <h4 class="query-option-title">Search map selection</h4>
                    <div class="btn sm outline">{{ shapeType }}</div>
                    <p />
                    <div v-if="shapeType == ShapeTypes.None">Select a point or rectangle on the map to begin</div>
                    <div v-if="shapeType != ShapeTypes.None" class="button-container">
                        <button @click="areaTypeRef = AreaTypes.Nearby" class="btn sm" v-bind:class="{ outline: areaTypeRef != AreaTypes.Nearby }">nearby</button>
                        <button @click="areaTypeRef = AreaTypes.Contains" class="btn sm" v-bind:class="{ outline: areaTypeRef != AreaTypes.Contains }">contains</button>
                        <button @click="areaTypeRef = AreaTypes.Overlaps" class="btn sm" v-bind:class="{ outline: areaTypeRef != AreaTypes.Overlaps }">overlaps</button>
                        <button @click="areaTypeRef = AreaTypes.Within" class="btn sm" v-bind:class="{ outline: areaTypeRef != AreaTypes.Within }">within</button>
                    </div>
                    <div v-if="shapeType != ShapeTypes.None && areaTypeRef == AreaTypes.Nearby" style="padding-top:10px;font-size:0.7em">
                        within <input style="font-size:small;height:1.5em;width:3em;" type="text" value="5"/> km
                    </div>
                </div>

                <div v-if="shapeType != ShapeTypes.None" class="query-option">
                    <h4 class="query-option-title">Filter by datasets &amp; features</h4>
                    <div v-if="data.loading">Loading...</div>
                    <div class="error" v-else-if="data.error">Unable to load datasets: {{ data.error }}</div>
                    <div v-else>
                        <b>Datasets:</b> <ul><li v-for="item of data.matchData(matchDatasets)">{{  item.subject }}</li></ul>
                        <b>Feature Collections:</b> <ul><li v-for="item of data.matchData(matchFeatureCollections)">{{  item.object }}</li></ul>
                    </div>
                </div>

                <p />
                <button v-bind:disabled="shapeType == ShapeTypes.None" class="btn" type="submit">Search</button>

            </form>

            

        </div>
        <div class="right-panel">
            <SearchMap @selectionUpdated="updateSelection" />            
        </div>
    </div>

<pre style="padding-left: 0;">
<b>Debug area</b>

- <button @click="fetchData">Fetch Data</button>

- Selected shape type = {{ shapeType }}

- Selected coords = <div style="white-space: normal;">{{  JSON.stringify(coords) }}</div>

</pre>

</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.search-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button[type="submit"] {
        align-self: flex-start;
    }
}

.container {
    display: grid;
    grid-template-columns: 1fr 3fr; /* set the column widths to 1/4 and 3/4 of the container width */
}

.left-panel {
    min-width: 280px;
    padding-right: 1em;
}
.right-panel {
}

// <div class="query-option" data-v-c11b2e84=""><div class="query-option-title" data-v-c11b2e84="">Examples</div><div class="example-buttons" data-v-c11b2e84=""><button class="btn sm outline" data-v-c11b2e84="">Basic Select</button><button class="btn sm outline" data-v-c11b2e84="">Basic Construct</button><button class="btn sm outline" data-v-c11b2e84="">Concept Count</button><button class="btn sm outline" data-v-c11b2e84="">Feature Info</button></div></div>

</style>



<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";


.search-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.query-options {
    gap: 10px;
    background-color: $cardBg;
    padding: 10px;
    border-radius: $borderRadius;

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

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* center the buttons horizontally */
  gap: 10px; /* set the spacing between the buttons */
}

.list {

    a.list-item {
        display: flex;
        flex-direction: row;
        gap: 10px;
        background-color: $cardBg;
        padding: 10px;
        border-radius: $borderRadius;

        .list-item-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;

            .list-item-title {
                margin: 0;
            }

            .list-item-desc {
                font-style: italic;
                color: grey;
                font-size: 0.8rem;
            }
        }

        .child-btn {
            align-self: baseline;
            flex-shrink: 0;
        }
    }
}
</style>