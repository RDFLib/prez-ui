<script lang="ts" setup>

import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"

let zoom = ref(6)
let center = ref([38, 139.69])

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputGroup from "primevue/inputgroup"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Badge from "primevue/badge"

import { itemProperties } from './wireframesData'

import { onMounted, ref } from "vue";

const props = defineProps<{
    title: string,
    sidePanel: boolean,
    sidePanelSearch: boolean,
    sidePanelProfile: boolean,
    pageType: 'list' | 'item' | 'search',
    showMap: boolean
}>();

const profiles = [
    {label: 'Alternates Profile'},
    {label: 'DCAT'}
]

const listHeaders = [
    {field: 'id', header: 'Identifier', sortable: true},
    {field: 'type', header: 'Type', sortable: true},
    {field: 'label', header: 'Preferred Label', sortable: true},
    {field: 'link', header: 'Link', sortable: true},
]

const list = [
    {id: 'bblck-vcbs:api', type: 'Catalog', label: 'API Building Blocks', link: '/v/catalogs/bblck-ctlg:bblocks/collections/bblck-vcbs:api'},
    {id: 'bblck-vcbs:datatype', type: 'Catalog', label: 'Datatype Building Blocks', link: '/v/catalogs/bblck-ctlg:bblocks/collections/bblck-vcbs:datatype'}
]

const itemHeaders = [
    {field: 'predicate', header: 'Properties', sortable: false},
    {field: 'object', header: '', sortable: false}
]

const visible = ref(true);

onMounted(()=>{
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
        const width = mapContainer.clientWidth;
        mapContainer.style.height = `${width}px`;
    }
})

</script>

<template>
    <div class="layout">
        <div class="content">
            <h1>{{ title }}</h1>
            <div class="search" v-if="pageType == 'search'">
                <InputGroup>
                    <InputText placeholder="Keyword" />
                    <Button icon="pi pi-search" />
                </InputGroup>                
            </div>
            <div v-if="pageType == 'list'">
                <div class="card">
                    <DataTable :value="list" tableStyle="min-width: 50rem">
                        <Column v-for="col of listHeaders" body="" v-bind="col" v-bind:key="col.field" style="width: 25%">
                            <template #body="slotProps">
                                <span>{{ list[slotProps.index][col.field] }}</span>
                            </template>                            
                        </Column>
                    </DataTable>
                </div>                    
            </div>
            <div v-if="pageType == 'item'">
                <DataTable :value="itemProperties" tableStyle="min-width: 50rem">
                    <Column v-for="col of itemHeaders" body="" v-bind="col" v-bind:key="col.field">
                        <template #body="slotProps">
                            <span v-if="col.field == 'predicate'">{{ itemProperties[slotProps.index][col.field].label }}</span>
                            <span v-if="col.field == 'object'">
                                {{ itemProperties[slotProps.index][col.field].value }}
                                <Button v-if="itemProperties[slotProps.index][col.field].widget == 'button'">
                                    {{ itemProperties[slotProps.index][col.field].label }}
                                </Button>
                            </span>
                        </template>                            
                    </Column>
                </DataTable>                
            </div>
            <div v-if="showMap" id="map-container">
                <l-map ref="map" :zoom="zoom" :center="[47.41322, -1.219482]" :useGlobalLeaflet="false">
                    <l-tile-layer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        layer-type="base"
                        name="OpenStreetMap"
                    ></l-tile-layer>
                </l-map>
            </div>
        </div>
        <div class="sidebar" v-if="sidePanel">
            <template v-if="sidePanelSearch">
                <h3>Search collection</h3>
                <InputGroup>
                    <InputText placeholder="Keyword" />
                    <Button icon="pi pi-search" />
                </InputGroup>
            </template>
            <template v-if="sidePanelProfile">
                <h3>Profiles</h3>
                <Badge v-for="profile of profiles" :value="profile.label" v-bind:key="profile.label"/>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh; /* Adjust this value as needed */
}

.sidebar {
  width: 250px; /* Adjust the width of the side panel */
  padding: 20px;
  background-color: #f0f0f0; /* Set background color for the side panel */
}

.sidebar h3:first-child {
    margin-top:0;
}

.sidebar .p-badge:last-child {
    margin-left: 5px;
}

.search {
    margin-bottom:20px;
}

.content {
  flex: 1; /* Allow the main content to take up remaining space */
  padding: 20px; /* Add padding for the main content */
}
</style>