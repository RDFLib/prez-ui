<template>
    <h1>
        Custom item NuxtPage
    </h1>

    <PrezDataProvider
        type="object"
        url="https://ogc-prez-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/phcat:buildingblocks"
        objectId="phcat:buildingblocks">

        <template v-slot="{ data, properties }">
            <CustomItem2
                :focusNode="data?.data?.focusNode"
                :properties="data?.data?.properties"
            />
        </template>

    </PrezDataProvider>
</template>
