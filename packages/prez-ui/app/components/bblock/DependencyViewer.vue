<template>
  <div class="dependency-viewer">
    <div v-if="hasDependencies && graphData">
      <v-network-graph
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :layouts="graphData.layouts"
          :configs="configs"
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
            :item-class="allBBlocks[nodeId]?.itemClass"
            :scale="scale"
            :radius="config.radius"
            :fill="config.color"
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
<script>
import {VEdgeLabel, VNetworkGraph} from "v-network-graph";
import "v-network-graph/lib/style.css"
import dagre from "dagre";
import GraphNode from "@/components/bblock/GraphNode.vue";
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
const getItemClassLabel = (itemClass) => LABEL_MAP[itemClass] || itemClass;

const edgeColors = {
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

export default {
  components: {
    GraphNode,
    VEdgeLabel,
    VNetworkGraph,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    nodeSize: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      allBBlocks: null,
      bblockId: null,
      mode: 'simplified',
      configs: {
        view: {
          autoPanAndZoomOnLoad: 'fit-content',
          scalingObjects: true,
        },
        node: {
          normal: {
            radius: this.nodeSize / 2,
            color: node => node.color,
          },
          hover: {
            color: node => node.color,
          },
          label: {
            directionAutoAdjustment: true,
          },
        },
        edge: {
          normal: {
            color: edge => edgeColors[edge.type],
            width: 2,
            dasharray: edge => edge.type === 'extends' ? "2" : "0",
          },
          hover: {
            color: edge => edgeColors[edge.type],
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
      eventHandlers: {
        "node:click": ({ node }) => {
          this.$emit('node:click', this.allBBlocks[node]);
        },
        "edge:click": ({ edges }) => {
          const edgeType = this.graphData.edges?.[edges[0]]?.type;
          if (edgeType) {
            window.open(`https://ogcincubator.github.io/bblocks-docs/overview/relationships#type-${edgeType}`)
          }
        },
      },
      nodeColors,
      showEdgeTypes,
    };
  },
  mounted() {
    this.allBBlocks = {};
    if (this.data && this.data.value) {
      this.allBBlocks[this.data.value] = this.data;
      this.allBBlocks[this.data.value].register = {
        url: this.data.value
      };
      this.allBBlocks[this.data.value].name = this.data.label?.value;
      // TODO: derive item class label from RDF
      this.allBBlocks[this.data.value].itemClass = 'schema';
      this.bblockId = this.data.value;
    }
    for (const bblock of this.data.dependsOn) {
      this.allBBlocks[bblock.value] = bblock;
      this.allBBlocks[bblock.value].register = {
        url: bblock.value
      };
      this.allBBlocks[bblock.value].name = bblock.label?.value;
      // TODO: derive item class label from RDF
      this.allBBlocks[bblock.value].itemClass = 'schema';
    }
    // bblockService.getBBlocks(true).then(bblocks => {
    //   this.allBBlocks = bblocks;
    // });
  },
  methods: {
    getItemClassLabel,
  },
  computed: {
    bblock() {
      if (this.allBBlocks && this.bblockId) {
        return this.allBBlocks[this.bblockId];
      }
      return null;
    },
    hasDependencies() {
      return !!this.bblock?.dependsOn?.length;
    },
    extensionPoints() {
      return this.bblock?.extensionPoints;
    },
    extensionBblocks() {
      const result = {};
      if (this.bblock?.extensionPoints) {
        result[this.bblock.extensionPoints.baseBuildingBlock] = 'extensionBase';
        Object.entries(this.bblock.extensionPoints.extensions).forEach(([k, v]) => {
          result[k] = 'extensionSource';
          result[v] = 'extensionTarget';
        });
      }
      return result;
    },
    graphData() {
      if (!this.hasDependencies) {
        return null;
      }
      const g = {
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
        nodesep: this.nodeSize,
        edgesep: this.nodeSize,
        ranksep: this.nodeSize,
      });
      dg.setDefaultEdgeLabel(() => ({}));
      g.layouts.nodes[this.bblockId] = {
        x: 0,
        y: 0,
        fixed: true,
      };
      const seen = new Set(), pending = [this.bblockId];
      let curId;
      while ((curId = pending.pop())) {
        if (seen.has(curId)) {
          continue;
        }
        let cur = this.allBBlocks[curId];
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
        if (curId === this.bblockId) {
          nodeType = 'current';
        }

        let showNodeDependencies = true;
        // if (this.mode === 'full') {
        //   showNodeDependencies = true;
        // } else if (this.mode === 'extensionPoints') {
        //   showNodeDependencies = nodeType === 'current';
        // } else {
        //   showNodeDependencies = cur.local;
        // }

        g.nodes[curId] = {
          id: curId,
          name: cur.name,
          type: nodeType,
          color: nodeColors[nodeType] || 'gray'
        };

        dg.setNode(curId, {
          label: cur.name,
          width: Math.max(this.nodeSize, cur.name.length * 5.2),
          height: this.nodeSize + 12,
        });

        const addEdge = (dependency, type, fromId = curId) => {
          let dep = dependency.register?.url || dependency;
          const edgeId = `${fromId}-${dep}`;
          if (!g.edges[edgeId]) {
            g.edges[edgeId] = {
              source: fromId,
              target: dep,
              type: type,
              label: 'test',
            };
            dg.setEdge(fromId, dep);
          }
          if (!seen.has(dep)) {
            pending.push(dep);
          }
        }

        if (showNodeDependencies) {
          const addedExtensions = [];
          // if (nodeType === 'current' && this.extensionPoints) {
          //   addEdge(this.extensionPoints.baseBuildingBlock, 'extends');
          //   addedExtensions.push(this.extensionPoints.baseBuildingBlock);
          //   Object.entries(this.extensionPoints.extensions).forEach(([extSource, extTarget]) => {
          //     addEdge(extTarget, 'extensionTarget');
          //     addEdge(extSource, 'extensionSource', extTarget);
          //     addedExtensions.push(extSource);
          //     addedExtensions.push(extTarget);
          //   });
          // }
          // if (cur.profileOf) {
          //   const profileOf = Array.isArray(cur.profileOf) ? cur.profileOf : [cur.profileOf];
          //   profileOf.forEach(dep => addedExtensions.includes(dep) || addEdge(dep, 'profileOf'));
          // }
          cur.dependsOn?.forEach(dep => addedExtensions.includes(dep) || addEdge(dep, 'dependsOn'));

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
    },
  },
  watch: {
    bblock() {
      if (this.extensionPoints) {
        this.mode = 'extensionPoints';
      }
    },
    graphData(v) {
      if (v && this.$refs.networkGraph) {
        this.$refs.networkGraph.fitToContents();
      }
    },
  }
}
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
