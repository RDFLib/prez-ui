
<template>
    <PrezDataProvider
        type="object"
        url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/bblck-ctlg:bblocks"
        objectId="bblck-ctlg:bblocks">

        <template v-slot="{ data, properties }">
            <PrezUIDataItem
                :data="data"
                :properties="properties"
            />
        </template>

    </PrezDataProvider>
</template>
