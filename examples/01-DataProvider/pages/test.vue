
<template>
    hello

    <!-- <PrezUIHeader theme="primevue" :term="literal({value: 'http://abc', language: 'engrish'})" /> -->

    <PrezUIDataProvider
      type="list"
      :url="'http://localhost:6006/test/data/composite-00-object.json'"
      :urlx="'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs?_mediatype=application/anot%2Bld%2Bjson'"
      >

      <template v-slot="{data, debug}">
            <PrezUIData theme="primevue" :debug="debug" :data="data" />
      </template>

    </PrezUIDataProvider>
  </template>
<script lang="ts" setup>
import { literal, node } from 'prez-lib';
//https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs?_mediatype=application/anot%2Bld%2Bjson
//http://localhost:6006/test/data/composite-00-object.json
</script>