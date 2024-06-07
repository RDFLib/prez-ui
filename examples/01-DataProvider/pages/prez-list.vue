<template>
    <h1>
        Vanilla Prez List page
    </h1>
    <PrezDataProvider type="list" url="https://ogc-prez-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">
        <template v-slot="{ data, properties }">
            <PrezUIDataList
                :data="data"
                :properties="properties"
            />
        </template>
    </PrezDataProvider>
    
</template>
