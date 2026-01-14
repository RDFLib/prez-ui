<script lang="ts" setup>
import { ProvenanceDiagramProps, ProvenanceNode, ProvenanceLink } from "@/types";

import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
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

use([SVGRenderer, SankeyChart, TitleComponent, TooltipComponent, LegendComponent]);

const option = ref({
  series: {
    type: 'sankey',
    layout: 'none',
    emphasis: {
      focus: 'adjacency',
      label: {
        show: true
      }
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
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

<style>
.provenance-sankey-diagram {
  overflow: visible;
}
.provenance-sankey-diagram .chart {
  min-height: 500px;
  width: 100%;
  overflow: visible;
}

.provenance-sankey-diagram .chart > div {
  overflow: visible !important;
}

.provenance-sankey-diagram .chart > div > svg {
  overflow: visible;
}
</style>
