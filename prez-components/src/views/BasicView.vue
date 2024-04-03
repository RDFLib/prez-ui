<script lang="ts" setup>
import { bnode } from "prez-lib";
import { Default as literalDefaultData } from "../stories/PrezUILiteral.stories";
import { Default as nodeDefaultData } from "../stories/PrezUINode.stories";
import { Default as objectData } from "../stories/PrezUIObjectTable.stories";
import PrezUILiteral from "../components/PrezUILiteral.vue";
import PrezUINode from "../components/PrezUINode.vue";
import PrezUIBlankNode from "../components/PrezUIBlankNode.vue";

const bnodeData = bnode({value: "_:b0", properties: objectData.args.properties})
</script>

<template>
    <h3>Literals</h3>
    <PrezUILiteral v-bind="literalDefaultData.args" />
    <h3>Nodes</h3>
    <PrezUINode v-bind="nodeDefaultData.args" showType showProv />
    <h3>Blank Nodes</h3>
    <PrezUIBlankNode v-bind="bnodeData" showProv showType />
</template>
