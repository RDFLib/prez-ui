<template>
  <g>
    <rect
      v-if="itemClass === 'datatype'"
      :height="radius * scale * 2"
      :width="radius * scale * 2"
      :x="-radius * scale"
      :y="-radius * scale"
      :fill="fill"
      :stroke="stroke"
      class="v-ng-shape-rect"
    >
      <title v-text="itemClass"></title>
    </rect>
    <polygon
      v-else-if="['parameter', 'path'].includes(itemClass)"
      :points="resize(points.triangle, radius * scale)"
      :fill="fill"
      :stroke="stroke"
      :transform="itemClass === 'path' ? rotate180 : ''"
    >
      <title v-text="itemClass"></title>
    </polygon>
    <polygon
      v-else-if="itemClass === 'api'"
      :points="resize(points.hexagon, radius * scale * 1.1)"
      :fill="fill"
      :stroke="stroke"
    >
      <title v-text="itemClass"></title>
    </polygon>
    <circle
      v-else
      :r="radius * scale"
      :fill="itemClass ? fill : 'white'"
      :stroke="itemClass ? stroke : '#444'"
      :stroke-dasharray="itemClass ? 0 : 2"
    >
      <title v-text="itemClass ? itemClass : 'Unknown Building Block'"></title>
    </circle>
    <text v-if="!itemClass"
          x="0" :y="radius * scale * 0.1"
          text-anchor="middle" dominant-baseline="middle"
          :font-size="`${radius * scale * 1.3}px`" font-weight="bold" color="#444">?</text>
  </g>
</template>

<script lang="ts" setup>
  import { GraphNodeProps } from "@/types";
  withDefaults(defineProps<GraphNodeProps>(),{
    itemClass: '',
    scale: 1,
    fill: 'none',
    stroke: ''
  });

  const points = {
    triangle: [[0, -1], [1.155, 1], [-1.155, 1]],
    hexagon: [[-1, 0], [-0.5, -0.866], [0.5, -0.866], [1, 0], [0.5, 0.866], [-0.5, 0.866]],
  };
  const rotate180 = 'rotate(180, 0.5, 0.5)';

  const resize = (points: any, size: number) => {
    return points.map((p: any) => p.map((c: any) => c * size));
  }
</script>
