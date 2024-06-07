<template>
    <h1>
        Custom list page
    </h1>

    <PrezDataProvider
        type="list"
        url="https://ogc-prez-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">

        <template v-slot="{ data, properties }">
            <CustomList
                :data="data"
                :properties="properties"
            />
        </template>

    </PrezDataProvider>
    
</template>
