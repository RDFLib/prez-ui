<script lang="ts" setup>
import { type PrezNode } from 'prez-lib';
import type { ItemProperties } from './CustomItem2.d.ts';
const props = defineProps<{focusNode: PrezNode, properties: ItemProperties}>();

</script>

<template>
    
    <div class="item-header">
        <h1>{{ props.focusNode?.label?.value || props.focusNode?.value }}</h1>
        <div class="flex-row">
            IRI:
            <div class="iri">
                <a :href="props.focusNode?.value" target="_blank" rel="noopener noreferrer">{{ props.focusNode?.value }}</a>
                <CopyButton :value="props.focusNode?.value" iconOnly />
            </div>
        </div>

        <div v-if="props.properties?.['http://purl.org/dc/terms/isPartOf']" class="flex-row">
            <div v-tooltip="'Custom tooltip here...'">Defined By: </div>
            <PrezUITerm 
                v-for="o in props.properties['http://purl.org/dc/terms/isPartOf'].objects"
                v-bind="o"
            />
        </div>

        <div v-if="props.properties?.['http://www.opengis.net/def/metamodel/ogc-na/doctype']" class="flex-row">
            <div>Sub-type: </div>
            <PrezUITerm
                v-for="o in props.properties['http://www.opengis.net/def/metamodel/ogc-na/doctype'].objects"
                v-bind="o"
            />
        </div>

        <p class="desc">
            <template v-if="props.focusNode">{{ props.focusNode.description?.value }}</template>
        </p>

    </div>
</template>

<style scoped>
.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.types {
    display: flex;
    flex-direction: row;
    gap: 6px;
}

.iri {
    padding: 8px;
    background-color: #e9e9e9;
    border-radius: 4px;
    font-family: monospace;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
}

.desc {
    font-style: italic;
}

#right-nav {
    padding: 12px;
    min-width: 280px;
    max-width: 280px;
}
</style>