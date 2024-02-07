<script lang="ts" setup>
import { literalLang, literalDatatype, literalGeom, node, blankNode } from "../util/storyData";
import PrezUILiteral from "../components/PrezUILiteral.vue";
import PrezUINode from "../components/PrezUINode.vue";
import PrezUIBlankNode from "../components/PrezUIBlankNode.vue";
</script>

<template>
    <h3>Literals</h3>
    <PrezUILiteral v-bind="literalLang" />
    <PrezUILiteral v-bind="literalDatatype" />
    <PrezUILiteral v-bind="literalGeom" />
    <h3>Nodes</h3>
    <PrezUINode v-bind="node" showType showProv />
    <h3>Blank Nodes</h3>
    <PrezUIBlankNode v-bind="blankNode" showProv showType />
</template>
