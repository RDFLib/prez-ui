<template>
  <div class="dependency-viewer">
    <div v-if="hasDependencies && graphData">
      <v-network-graph
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :layouts="graphData.layouts"
          :configs="configData.configs"
          :event-handlers="eventHandlers"
          style="height: 400px"
          ref="networkGraph"
        >
        <template #edge-label="{edge, hovered, ...slotProps}">
          <v-edge-label v-if="hovered || showEdgeTypes.includes(edge.type)"
                        :text="edge.type"
                        align="center"
                        vertical-align="above"
                        v-bind="slotProps"
          ></v-edge-label>
        </template>
        <template #override-node="{ nodeId, scale, config, ...slotProps }">
          <graph-node
            :item-class="configData.allBBlocks[nodeId]?.itemClass"
            :scale="scale"
            :radius="config.radius"
            :fill="config.color"
            :stroke="''"
            v-bind="slotProps">
          </graph-node>
        </template>
      </v-network-graph>
    </div>
    <div v-else>
      This building block has no dependencies.
    </div>
  </div>
</template>
<script lang="ts" setup>
import {VEdgeLabel, VNetworkGraph} from "v-network-graph";
import "v-network-graph/lib/style.css"
import dagre from "dagre";
import GraphNode from "./GraphNode.vue";
import { DependencyViewerProps } from "@/types";
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

const props = withDefaults(defineProps<DependencyViewerProps>(),{
  nodeSize: 30
});

const networkGraph = useTemplateRef<typeof VNetworkGraph>('networkGraph');

const itemClasses = [
  {label: 'Schema', value: 'schema'},
  {label: 'Data type', value: 'datatype'},
  {label: 'Model', value: 'model'},
  {label: 'API path', value: 'path'},
  {label: 'API parameter', value: 'parameter'},
  {label: 'API header', value: 'header'},
  {label: 'API cookie', value: 'cookie'},
  {label: 'API', value: 'api'},
];

const LABEL_MAP = Object.fromEntries(itemClasses.map(e => [e.value, e.label]));
const getItemClassLabel = (itemClass: string) => LABEL_MAP[itemClass] || itemClass;

interface EdgeColors {
  profileOf: string;
  dependsOn: string;
  extends: string;
  extensionSource: string;
  extensionTarget: string;
};
const edgeColors: EdgeColors = {
  profileOf: 'blue',
  dependsOn: '#aaa',
  extends: 'red',
  extensionSource: '#ff5a5a',
  extensionTarget: '#ff8e03',
};

const nodeColors = {
  current: 'red',
  local: 'blue',
  remote: 'gray',
};

const showEdgeTypes = ['profileOf', 'extensionBase', 'extensionSource', 'extensionTarget', 'extends'];

interface ConfigData {
  allBBlocks: any;
  mode: string;
  configs: any;
  nodeColors: any;
  showEdgeTypes: any;
}

const bblockId = ref(null);
const configData: ConfigData = {
  allBBlocks: null,
  mode: 'simplified',
  configs: {
    view: {
      autoPanAndZoomOnLoad: 'fit-content',
      scalingObjects: true,
    },
    node: {
      normal: {
        radius: props.nodeSize / 2,
        color: (node: any) => node.color,
      },
      hover: {
        color: (node: any) => node.color,
      },
      label: {
        directionAutoAdjustment: true,
      },
    },
    edge: {
      normal: {
        color: (edge: any) => edgeColors[edge.type as keyof EdgeColors],
        width: 2,
        dasharray: (edge: any) => edge.type === 'extends' ? "2" : "0",
      },
      hover: {
        color: (edge: any) => edgeColors[edge.type as keyof EdgeColors],
      },
      margin: 4,
      marker: {
        target: {
          type: 'arrow',
        },
      },
      label: {
        fontSize: 8,
      },
    },
  },
  nodeColors,
  showEdgeTypes,
};

onMounted(() => {
  configData.allBBlocks = {};
  if (props.data && props.data.value) {
    configData.allBBlocks[props.data.value] = props.data;
    configData.allBBlocks[props.data.value].register = {
      url: props.data.value
    };
    configData.allBBlocks[props.data.value].name = props.data.label?.value;
    // TODO: derive item class label from RDF
    configData.allBBlocks[props.data.value].itemClass = 'schema';
    bblockId.value = props.data.value;
  }
  for (const bblock of props.data.dependsOn) {
    configData.allBBlocks[bblock.value] = bblock;
    configData.allBBlocks[bblock.value].register = {
      url: bblock.value
    };
    configData.allBBlocks[bblock.value].name = bblock.label?.value;
    // TODO: derive item class label from RDF
    configData.allBBlocks[bblock.value].itemClass = 'schema';
  }
});

const hasDependencies = ref(false);

watch(() => bblockId.value, () => {
  if (configData.allBBlocks && bblockId.value) {
    hasDependencies.value = !!configData.allBBlocks[bblockId.value]?.dependsOn?.length;
  } else {
    hasDependencies.value = false;
  }
});

interface GraphRegister {
  [key: string]: any;
};
interface ItemClasses {
  [key: string]: any;
};
interface GraphNode {
  id: string;
  name: string;
  type: string;
  color: string;
}
interface GraphNodes {
  [key: string]: GraphNode;
};
interface GraphEdges {
  [key: string]: any;
};

interface Graph {
  nodes: GraphNodes;
  edges: GraphEdges;
  layouts: any;
  usedRegisters: GraphRegister;
  usedItemClasses: ItemClasses;
};

const graphData = computed(() => {
  if (!bblockId.value || !hasDependencies.value) {
    return null;
  }
  const g: Graph = {
    nodes: {},
    edges: {},
    layouts: {
      nodes: {},
    },
    usedRegisters: {},
    usedItemClasses: {},
  };
  const dg = new dagre.graphlib.Graph();
  dg.setGraph({
    rankdir: 'TB',
    nodesep: props.nodeSize,
    edgesep: props.nodeSize,
    ranksep: props.nodeSize,
  });
  dg.setDefaultEdgeLabel(() => ({}));
  g.layouts.nodes[bblockId.value] = {
    x: 0,
    y: 0,
    fixed: true,
  };
  const seen = new Set(), pending: string[] = [bblockId.value];
  let curId: string | undefined;
  while ((curId = pending.pop())) {
    if (seen.has(curId)) {
      continue;
    }
    let cur = configData.allBBlocks[curId];
    if (!cur) {
      cur = {
        local: false,
        name: curId,
      };
    } else {
      if (!g.usedRegisters[cur.register.url]) {
        g.usedRegisters[cur.register.url] = cur.register;
      }
      if (!g.usedItemClasses[cur.itemClass]) {
        g.usedItemClasses[cur.itemClass] = getItemClassLabel(cur.itemClass);
      }
    }
    let nodeType = cur['local'] ? 'local' : 'remote';
    if (curId === bblockId.value) {
      nodeType = 'current';
    }

    let showNodeDependencies = true;

    g.nodes[curId] = {
      id: curId,
      name: cur.name,
      type: nodeType,
      color: nodeColors[nodeType as keyof typeof nodeColors] || 'gray'
    };

    dg.setNode(curId, {
      label: cur.name,
      width: Math.max(props.nodeSize, cur.name.length * 5.2),
      height: props.nodeSize + 12,
    });

    const addEdge = (dependency: any, type: string, fromId = curId) => {
      let dep = dependency.register?.url || dependency;
      const edgeId = `${fromId}-${dep}`;
      if (fromId && !g.edges[edgeId]) {
        g.edges[edgeId] = {
          source: fromId,
          target: dep,
          type: type,
        };
        dg.setEdge({
          v: fromId,
          w: dep
        });
      }
      if (!seen.has(dep)) {
        pending.push(dep);
      }
    }

    if (showNodeDependencies) {
      const addedExtensions: any[] = [];
      cur.dependsOn?.forEach((dep: any) => addedExtensions.includes(dep) || addEdge(dep, 'dependsOn'));

      seen.add(curId);
    }
  }

  dagre.layout(dg);

  dg.nodes().forEach(nodeId => {
    const dgNode = dg.node(nodeId);
    if (dgNode) {
      g.layouts.nodes[nodeId] = {
        x: dgNode.x,
        y: dgNode.y,
      };
    }
  });

  return g;
});

watch(() => graphData.value, (newValue) => {
  if (newValue && networkGraph?.value) {
    networkGraph.value.fitToContents();
  }
});

const emit = defineEmits(['node:click']);

const eventHandlers = {
  "node:click": ({ node } : { node: any; }) => {
    emit('node:click', configData.allBBlocks[node]);
  },
  "edge:click": ({ edges } : { edges: any; }) => {
    const edgeType = graphData.value?.edges?.[edges[0]]?.type;
    if (edgeType) {
      window.open(`https://ogcincubator.github.io/bblocks-docs/overview/relationships#type-${edgeType}`)
    }
  },
};
</script>
<style scoped lang="scss">

.dependency-viewer {
  position: relative;
}

.legend {
  border-radius: 3px;
  border: 1px solid #eee;
  padding: 0.6rem;

  &.md-and-up {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
  }

  &.legend-left {
    right: initial;
    left: 0;
  }

  > div {
    margin-bottom: 0.25rem;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 0.4rem;
  }

  text {
    font-size: 14px;
  }

  .register-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss">
.dependency-viewer {
  .v-ng-layer-edges {
    .v-ng-line-background {
      cursor: help;
    }
  }
}
</style>
