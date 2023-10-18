<script lang="ts" setup>
import type { PropTableObject } from "@/types";
import { copyToClipboard } from "@/util/helpers";
import PropRow from "@/components/proptable/PropRow.vue";
import ToolTip from "@/components/ToolTip.vue";

const props = defineProps<PropTableObject>();

const geometryPreds = [
    "http://www.opengis.net/ont/geosparql#geoJSONLiteral",
    "http://www.opengis.net/ont/geosparql#wktLiteral"
];

const MAX_GEOM_LENGTH = 100; // max character length for geometry strings
</script>

<template>
    <div class="prop-obj">
        <div class="obj-value">
            <table v-if="props.termType === 'BlankNode'">
                <PropRow v-for="row in props.rows" v-bind="row" />
            </table>
            <component v-else-if="props.termType === 'NamedNode'" :is="!!props.description ? ToolTip : 'slot'">
                <a
                    :href="props.value"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <template v-if="!!props.label">{{ props.label }}</template>
                    <template v-else-if="!!props.qname">{{ props.qname }}</template>
                    <template v-else>{{ props.value }}</template>
                </a>
                <template #text>{{ props.description }}</template>
            </component>
            <template v-else>
                <template v-if="props.predicateIri === 'https://schema.org/color'">{{ props.value }}<span v-if="!!props.value" :style="{color: props.value, marginLeft: '4px'}" class="fa-solid fa-circle fa-2xs"></span></template>
                <template v-else-if="props.value.startsWith('http')">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
                </template>
                <div v-else-if="props.datatype && geometryPreds.includes(props.datatype.value)" class="geom-cell">
                    <pre>{{ props.value.length > MAX_GEOM_LENGTH ? `${props.value.slice(0, MAX_GEOM_LENGTH)}...` : props.value }}</pre>
                    <button class="btn outline sm" title="Copy geometry" @click="copyToClipboard(props.value)"><i class="fa-regular fa-clipboard"></i></button>
                </div>
                <div v-else-if="props.datatype && props.datatype.qname === 'xsd:double'">
                    {{ Number(props.value) }}
                </div>
                <template v-else>{{ props.value }}</template>
            </template>
        </div>
        <div class="obj-tag">
            <span v-if="!!props.language" class="badge outline" title="Language">{{ props.language }}</span>
            <a
                v-else-if="!!props.datatype"
                :href="props.datatype.value"
                target="_blank"
                rel="noopener noreferrer"
                class="badge outline"
                title="Datatype"
            >
                <template v-if="!!props.datatype.qname">{{ props.datatype.qname }}</template>
                <template v-else>{{ props.datatype.value }}</template>
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.prop-obj {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: space-between;

    table {
        font-size: 0.95em;
        background-color: rgba(0, 0, 0, 0.05);
    }

    .geom-cell {
        display: flex;
        flex-direction: row;
        gap: 4px;

        pre {
            margin: 0;
            white-space: pre-wrap;
        }

        button {
            align-self: center;
        }
    }

    .badge {
        margin-left: 6px;
    }
}
</style>