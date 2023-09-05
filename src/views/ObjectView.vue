<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useApiRequest } from "@/composables/api";
import router from "@/router";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const { namedNode } = DataFactory;

const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qnameToIri } = useRdfStore();
const { loading, error, apiGetRequest } = useApiRequest();

const links = ref<string[]>([]);

onMounted(async () => {
    if (route.query && route.query.uri) {
        const { data } = await apiGetRequest(route.fullPath);
        if (data && !error.value) {
            parseIntoStore(data);

            const subject = namedNode(route.query.uri as string);

            store.value.forEach(q => {
                if (q.predicate.value === qnameToIri("prez:link")) {
                    links.value.push(q.object.value);
                }
            }, subject, null, null, null);

            // if single link, redirect
            if (links.value.length === 1) {
                router.push(links.value[0]);
            }
            // else if multiple links, list on page
        }
    }

    ui.rightNavConfig = { enabled: false };
    document.title = "Get Object by URI | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "Get Object by URI", url: "/object" }];
});
</script>

<template>
    <h1 class="page-title">Get Object by URI</h1>
    <p v-if="!route.query || !route.query.uri">This page can be used to find objects by their URI (Uniform Resource Identifier) by adding <code>?uri=https://some.uri.here</code> (for example) to the end of this page's URL.</p>
    <template v-else-if="links.length > 1">
        <p>Please select from the links below:</p>
        <div class="links">
            <RouterLink class="link" v-for="link in links" :to="link">
                <h4 class="link-title">{{ link }}</h4>
            </RouterLink>
        </div>
    </template>
    <LoadingMessage v-else-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <ErrorMessage v-else-if="route.query && route.query.uri && links.length === 0" message="Not Found: This resource contains no links within Prez" />
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;;

    a.link {
        background-color: var(--cardBg);
        padding: 10px;
        border-radius: $borderRadius;

        .link-title {
            margin: 0;
        }
    }
}
</style>