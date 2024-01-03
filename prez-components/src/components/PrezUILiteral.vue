<script lang="ts" setup>
import Chip from "primevue/chip";
import { PrezUILiteralProps } from "../types";
import CopyButton from "./CopyButton.vue"

const MAX_GEOM_LENGTH = 100;

const props = defineProps<PrezUILiteralProps>();
</script>

<template>
    <div class="literal">
        <span class="value">
            <a v-if="props.value.startsWith('http')" :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
            <span v-else-if="props.isGeometry" class="geometry">
                <pre>{{ props.value.length > MAX_GEOM_LENGTH ? `${props.value.slice(0, MAX_GEOM_LENGTH)}...` : props.value }}</pre>
                <CopyButton :value="props.value" iconOnly />
            </span>
            <template v-else>{{ props.value }}</template>
        </span>
        <span v-if="props.language" class="language"><Chip :label="props.language" icon="pi pi-language" v-tooltip.top="'Language'" /></span>
        <span v-else-if="props.datatype" class="datatype">
            <a :href="props.datatype.iri" target="_blank" rel="noopener noreferrer">
                <Chip
                    v-tooltip.top="'Datatype'"
                    icon="pi pi-code"
                    :label="props.datatype.label ? props.datatype.label.value : (props.datatype.qname || props.datatype.iri)"
                />
            </a>
        </span>
    </div>
</template>

<style lang="scss" scoped>
.literal {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    .value {
        flex-grow: 1;

        .geometry {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            pre {
                font-size: 1rem;
            }
        }
    }

    .language {

    }

    .datatype {

    }
}
</style>