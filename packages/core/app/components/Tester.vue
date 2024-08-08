<script lang="ts" setup>
//import prezConfig from '../utils/prezConfig';
//import { type PrezFocusNode, type PrezItem, type PrezList } from 'prez-lib';
// import { useApi } from '../composables/useApi';
// const api = useApi();
// const url = api.getApiUrl()

//const cfg = prezConfig;
//const baseUrl = cfg.getConfigItem('baseUrl');

</script>

<template>

    <Config />
    <!-- API = {{ baseUrl }} -->

    <h1>Tester</h1>

    <!-- <h2>Demonstrate custom widget override</h2>
    <DataProvider type="item" url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exds:sandgate">
        <template v-slot="{ item }">
            <Header :term="item" />
            <ItemTable :term="item" >
                <template #widget-row=" { property } ">
                    <tr v-if="property.predicate.value == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'">
                        <td colspan="2" style="background-color: red;">My awesome widget handler for {{ property.predicate.value }}</td>
                    </tr>
                </template>
            </ItemTable>
            
        </template>
    </DataProvider> -->

    
    <DataProvider type="list" url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">
        <template #default="{ list }">
            <h2>Basic list</h2>
            <div v-for="item of list" :key="item.value">
                {{item.value}}
            </div>

        <h2>Basic select</h2>
        <select style="height:max-content" multiple>
            <option v-for="item of list" :key="item.value">{{item.value}}</option>
        </select>
        
        <h2>List using Prez renderer</h2>
        <div v-for="item of list" :key="item.value">
            <Term :term="item" />
        </div>

        </template>
    </DataProvider>


</template>




<!--

<PrezUIDataProvider type="list" url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">
    <template v-slot="{ data: { data, type, profiles } }">
    </template>
</PrezUIDataProvider>


        <h2>Basic list</h2>
        <div v-for="item of (data as PrezList)">
            {{item.focusNode.value}}
        </div>
        <h2>Basic select</h2>
        <select style="height:max-content" multiple>
            <option v-for="item of (data as PrezList)">{{item.focusNode.value}}</option>
        </select>
        <h2>List using Prez renderer</h2>
        <div v-for="item of (data as PrezList)">
            <PrezUITerm :term="item.focusNode" />
        </div>


<PrezUIDataProvider type="list" url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">
    <template v-slot="{ data: { data, type, profiles } }">
        <div v-for="item of (data as PrezList)">
            {{item}}
        </div>
    </template>
</PrezUIDataProvider>


<PrezUIDataPage type="item" url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exds:sandgate" />

<PrezUIDataPage type="list" url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs" />

<PrezUIStaticPage>
    <h2>Static info page</h2>
    <p>About Prez and the this system...</p>
</PrezUIStaticPage>

-->
