<script lang="ts" setup>
import { inject, ref } from 'vue';
import { getDebug } from '../settingsManager';

interface Props {
  title: string;
  info?: any;
}

type ReplacerFunction = (this: any, key: string, value: any) => any;

function safeStringify(
  obj: any,
  replacer: ReplacerFunction | null = null,
  spaces: number = 2
): string {
  const seen = new WeakSet();

  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return replacer ? replacer.call(this, key, value) : value;
  }, spaces);
}

const props = defineProps<Props>();

const debug = inject('debug', ref(false));

</script>
<template>
    <fieldset class="pz-debug" v-if="debug">
        <legend :title="typeof(info) == 'object' ? safeStringify(info, null, 2) : (info === undefined ? safeStringify(props, null, 2) : info.toString())">{{ title }}</legend>
        <slot></slot>
    </fieldset>
    <slot v-else></slot>
</template>
<style lang="scss" scoped>
.pz-debug {
  legend:hover {
    cursor: pointer;
  }
  legend {
    font-size:small;
    color:#aaa;
  }
  fieldset {
    border: 1px dashed #aaa;
  }
}
</style>