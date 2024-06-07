<template>
    <h1>
        Basic styled page
    </h1>
    <ul>
        <li>tableClass added to the list</li>
        <li>Custom header/footer slots</li>
    </ul>
    <PrezDataProvider type="list" url="https://ogc-prez-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs">
        <template v-slot="{ data, properties }">
            <PrezUIDataList
                tableClass="table"
                :data="data"
                :properties="properties">

                <template #header><h2>Custom header</h2></template>
                <template #footer><h2>Custom footer</h2></template>

            </PrezUIDataList>

        </template>
    </PrezDataProvider>
    
</template>
