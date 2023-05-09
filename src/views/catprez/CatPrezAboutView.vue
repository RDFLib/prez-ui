<script lang="ts" setup>
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "About CatPrez | Prez";
    ui.pageHeading = { name: "CatPrez", url: "/c" };
    ui.breadcrumbs = [{ name: getPrezSystemLabel("CatPrez") + " Home", url: "/c" }, { name: "About", url: "/c/about" }];
});
</script>

<template>
    <h1 class="page-title">About CatPrez</h1>
    <p>
        CatPrez is a read-only web delivery system - web pages and API - for DCAT catalogues and resources. It complies with <a href="https://w3c.github.io/dx-connegp/connegp/"
            target="_blank" rel="noopener noreferrer">Content Negotiation by Profile</a>.
    </p>
    <p>
        Many instances of CatPrez are public and in production. See the <a href="http://rdflib.dev/prez">Prez
            documentation</a> for details.
    </p>
    <h2>Use</h2>
    <p>
        The basic structure of CatPrez is:
    </p>
    <pre style="background-color: white">
                /                               - API Home

                /catalog                        - list of Catalogues

                /catalog/{id}                   - a Catalogue

                /catalog/{id}/{resource-id}     - Resource within a Catalogue
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
        CatPrez' data is all natively stored in RDF graph form, according to the profile of DCAT and,
        optionally, according to other data models too, if implemented.
    </p>
</template>

<style lang="scss" scoped></style>