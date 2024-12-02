<script lang="ts" setup>
import SpecialButton from "../components/SpecialButton.vue";
import CopyButton from "../components/CopyButton.vue";
import Parent from "../components/Parent.vue";
import Node from "../components/Node.vue";
import ItemLink from "../components/ItemLink.vue";
import Loading from "../components/Loading.vue";
import Message from "../components/Message.vue";

const term = {
    label: {
        termType: "Literal",
        value: 'term',
    },
    links: [
        {
            value: "/"
        }
    ],
}
</script>

<template>
    <div>
        Componeny library
        <SpecialButton>Slot content</SpecialButton>
        <Parent />
        <CopyButton value="copybuttonvalue" />
        <Node :term="term" />
        <ItemLink to="/" copyLink>item link</ItemLink>
        <div>Loading concept
            <Loading variant="concept" />
        </div>
        <Message text="error" severity="error" />
    </div>
</template>

