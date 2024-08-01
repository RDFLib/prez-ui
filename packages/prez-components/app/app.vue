<script setup lang="ts">
import { literal, node } from 'prez-lib';
const baseUrl = 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';

</script>

<template>

  <h2>Sample Component list check</h2>
  <p>View the prez-showcase package to view in storybook</p>

  <ul>
    <li>
      <fieldset>
        <legend>PrezUILiteral</legend>
        <PrezUILiteral :term="literal({value: 'Literal string value', language: 'en'})"/>
      </fieldset>
    </li>
    <li>
      <fieldset>
        <legend>PrezUINode</legend>
      <PrezUINode :term="node({value: 'http://www.w3.org/', label: literal('w3 item')})"/>
      </fieldset>
    </li>
    <li>
      <fieldset>
        <legend>PrezUIBreadcrumb</legend>
        <PrezUIBreadcrumb
          :custom-items="[{url: '/', label: 'Home'}, {url: '/test/', label: 'Test'}, {url: '/test2/', label: 'Another item'}]"
      />
      </fieldset>
    </li>
    <li>
      <fieldset>
        <legend>Concept</legend>
        <PrezUIDataConcept
          :url="baseUrl + '/concept-hierarchy/exm:SchemingConceptScheme/top-concepts'"
        />
      </fieldset>
    </li>
    <li>
      <fieldset>
        <legend>PrezUILoading</legend>
        <PrezUILoading />
      </fieldset>
    </li>
    <li>
      <fieldset>
        <legend>PrezUIPageMenu</legend>
        <PrezUIPageMenu />
      </fieldset>
    </li>
  </ul>

</template>
<style lang="scss" scoped>
ul {
  list-style-type: none;
}
li {
  padding-bottom: 1rem;
}
</style>