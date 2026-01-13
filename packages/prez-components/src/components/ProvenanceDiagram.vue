<script lang="ts" setup>
import { ProvenanceDiagramProps, ProvenanceNode, ProvenanceLink } from "@/types";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
// import type EChartsOption from "echarts";
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

const props = defineProps<ProvenanceDiagramProps>();

const nodes: ProvenanceNode[] = [];
const links: ProvenanceLink[] = [];
const nodeAlreadyAdded = (nodeToCheck: ProvenanceNode) => {
  for (const existingNode of nodes) {
    if (existingNode.name === nodeToCheck.name) return true;
  }
  return false;
};
const addNode = (nodeToAdd: any, linkFromNode?: any) => {
  let newNode = {
    id: nodeToAdd.uri,
    name: nodeToAdd.label,
    label: {
      position: 'bottom',
      rotate: '0',
      formatter: '{b}'
    }
  };
  if (!nodeAlreadyAdded(newNode)) {
    nodes.push(newNode);
  }
  if (linkFromNode) {
    links.push({
      source: linkFromNode.uri,
      target: nodeToAdd.uri,
      value: 1,
      edgeLabel: {
        show: true,
        formatter: 'prov:wasDerivedFrom'
      }
    });
  }
  if (nodeToAdd.wasDerivedFrom?.length) {
    for (const nextNode of nodeToAdd.wasDerivedFrom) {
      addNode(nextNode, nodeToAdd);
    }
  }
}
if (props.data?.label && props.data?.wasDerivedFrom) {
  addNode(props.data);
}

use([CanvasRenderer, SankeyChart, TitleComponent, TooltipComponent, LegendComponent]);

const option = ref({
  series: {
    type: 'sankey',
    layout: 'none',
    emphasis: {
      focus: 'adjacency'
    },
    tooltip: {
      trigger: 'item'
    },
    data: nodes,
    links: links
  }
});
</script>

<template>
  <div class="provenance-sankey-diagram">
    <VChart class="chart" :option="option" />
  </div>
</template>

<style scoped>
.chart {
  height: 500px;
  width: 100%;
}
</style>
