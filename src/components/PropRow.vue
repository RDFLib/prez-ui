<script setup>
import PredCell from "@/components/PredCell.vue";
import ObjCell from "@/components/ObjCell.vue";

const props = defineProps({
    iri: String,
    qname: String,
    title: String,
    description: String,
    explanation: String,
    order: Number,
    objs: Array
});
</script>

<template>
    <tr>
        <PredCell
            :iri="props.iri"
            :qname="props.qname"
            :title="props.title"
            :description="props.description"
            :explanation="props.explanation"
        />
        <td>
            <ObjCell v-for="obj in props.objs" v-bind="obj" />
        </td>
    </tr>
</template>

<style lang="scss" scoped>

</style>