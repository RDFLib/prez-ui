<script lang="ts" setup>
import type { RowObj } from "@/types";
import { copyToClipboard } from "@/util/helpers";
import PropRow from "@/components/proptable/PropRow.vue";

const props = defineProps<RowObj>();

const geometryPreds = [
    "http://www.opengis.net/ont/geosparql#geoJSONLiteral",
    "http://www.opengis.net/ont/geosparql#wktLiteral"
];

const MAX_GEOM_LENGTH = 100; // max character length for geometry strings
</script>

<template>
    <div class="prop-obj">
        <div class="obj-value">
            <template v-if="props.termType === 'BlankNode'">
                <table>
                    <PropRow v-for="row in props.rows" v-bind="row" />
                </table>
            </template>
            <template v-else-if="props.termType === 'NamedNode'">
                <template v-if="!!props.label">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.label }}</a>
                </template>
                <template v-else-if="!!props.qname">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.qname }}</a>
                </template>
                <template v-else>
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
                </template>
            </template>
            <template v-else>
                <template v-if="props.value.startsWith('http')">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
                </template>
                <div v-else-if="props.datatype && geometryPreds.includes(props.datatype.value)" class="geom-cell">
                    <pre>{{ props.value.length > MAX_GEOM_LENGTH ? `${props.value.slice(0, MAX_GEOM_LENGTH)}...` : props.value }}</pre>
                    <button class="btn outline sm" title="Copy geometry" @click="copyToClipboard(props.value)"><i class="fa-regular fa-clipboard"></i></button>
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