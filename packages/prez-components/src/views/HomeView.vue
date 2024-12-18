<script lang="ts" setup>
import CopyButton from "../components/CopyButton.vue";
import Node from "../components/Node.vue";
import ItemLink from "../components/ItemLink.vue";
import Loading from "../components/Loading.vue";
import Message from "../components/Message.vue";
import Literal from "../components/Literal.vue";
import { literal, node } from "prez-lib-test";

const term = node({
    value: "https://example.com",
    label: literal("term"),
    links: [
        {
            value: "/"
        }
    ],
});
</script>

<template>
    <div>
        Component library
        <CopyButton value="copybuttonvalue" />
        <Node :term="term" />
        <ItemLink to="/" copyLink>item link</ItemLink>
        <div>Loading concept
            <Loading variant="concept" />
        </div>
        <Message text="error" severity="error" />
        <Literal :term="literal('term')" textonly renderHtml renderMarkdown />
    </div>
</template>

