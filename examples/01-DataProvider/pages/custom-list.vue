<template>
    <PrezDataListProvider url="https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/bblck-ctlg:bblocks">
        <template v-slot="{ data }">
            <CustomTest :data="data" />
        </template>
    </PrezDataListProvider>
</template>
