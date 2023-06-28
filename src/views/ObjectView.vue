<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey } from "@/types";
import router from "@/router";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qname } = useRdfStore();
const { data, loading, error, doRequest } = useGetRequest();

const links = ref<string[]>([]);

onMounted(() => {
    if (route.query && route.query.uri) {
        doRequest(`${apiBaseUrl}${route.fullPath}`, () => {
            // parse turtle
            parseIntoStore(data.value);

            const subject = namedNode(route.query.uri as string);

            store.value.forEach(q => {
                if (q.predicate.value === qname("prez:link")) {
                    links.value.push(q.object.value);
                }
            }, subject, null, null, null);

            // if single link, redirect
            if (links.value.length === 1) {
                router.push(links.value[0]);
            }
            // else if multiple links, list on page
        });
    }

    ui.rightNavConfig = { enabled: false };
    document.title = "Get Object by URI | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "Get Object by URI", url: "/object" }];
});
</script>

<template>
    <h1 class="page-title">Get Object by URI</h1>
    <template v-if="links.length > 1">
        <p>Please select from the links below</p>
        <ul>
            <li v-for="link in links"><RouterLink :to="link">{{ link }}</RouterLink></li>
        </ul>
    </template>
    <LoadingMessage v-else-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <p v-else>This page can be used to find objects by their URI (Uniform Resource Identifier) by adding <code>?uri=https://some.uri.here</code> (for example) to the end of this page's URL.</p>
</template>

<style lang="scss" scoped>

</style>