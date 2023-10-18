<script lang="ts" setup>
import PredicateCell from "@/components/proptable/PredicateCell.vue";
import ObjectCell from "@/components/proptable/ObjectCell.vue";
import type { PropTableRow } from "@/types";

const props = defineProps<PropTableRow>();
</script>

<template>
    <tr>
        <PredicateCell
            :id="props.id"
            :termType="props.termType"
            :iri="props.iri"
            :qname="props.qname"
            :label="props.label"
            :description="props.description"
            :provenance="props.provenance"
        />
        <td class="prop-objs">
            <ObjectCell v-for="obj in props.objects" v-bind="obj" :predIri="props.iri" />
        </td>
    </tr>
</template>

<style lang="scss" scoped>
.prop-objs {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>