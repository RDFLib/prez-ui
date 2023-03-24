<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "About VocPrez | Prez";
    ui.pageHeading = { name: "VocPrez", url: "/v" };
    ui.breadcrumbs = [{ name: "VocPrez", url: "/v" }, { name: "About", url: "/v/about" }];
});
</script>

<template>
    <h1 class="page-title">About VocPrez</h1>
    <p>
        VocPrez is a read-only web delivery system - web pages and API - for Simple Knowledge Organization System
        (SKOS)-formulated RDF vocabularies. It complies with <a href="https://w3c.github.io/dx-connegp/connegp/"
            target="_blank" rel="noopener noreferrer">Content Negotiation by Profile</a>.
    </p>
    <p>
        Many instances of VocPrez are public and in production. See the <a href="http://rdflib.dev/prez">Prez
            documentation</a> for details.
    </p>
    <h2>Use</h2>
    <p>
        The basic structure of VocPrez is:
    </p>
    <pre style="background-color: white">
            /                               - API Home

            /vocab                          - list of Vocabularies

            /vocab/{id}                     - a vocabulary

            /vocab/{id}/{concept-id}        - Concept within a vocabulary
        </pre>
    <p>Navigation to any of those endpoints delivers content in HTML, for humans, and multiple <a
            href="https://www.w3.org/RDF/">RDF</a> formats, for machines.</p>
    <p>
        This API provides <em>alternate profiles</em> of all content, so a the information is resented according to several
        different data models.
    </p>
    <p>
        There are also convenience endpoints for searching and applying basic text or more advanced SPARQL queries.
    </p>
    <p>
        VocPrez' data is all natively stored in RDF graph form, according to the <a
            href="https://w3id.org/profile/vocpub">VocPub</a> profile of SKOS and,
        optionally, according to other data models too, if implemented.
    </p>
</template>

<style lang="scss" scoped></style>