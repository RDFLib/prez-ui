<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useApiRequest } from "@/composables/api";
import type { Profile } from "@/types";
import { ensureAnnotationPredicates, getDescription, getLabel } from "@/util/helpers";
import router from "@/router";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const { namedNode } = DataFactory;

const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qnameToIri } = useRdfStore();
const { loading, error, apiGetRequest } = useApiRequest();

type objectItem = {
    iri: string;
    title?: string;
    description?: string;
    links: {
        parentIri: string;
        parentTitle?: string;
        parentLink: string;
        parentTypes: {
            iri: string;
            title?: string;
        }[];
        link: string;
    }[];
    types: {
        iri: string;
        title?: string;
    }[];
};

const currentProfile = ref<Profile | null>(null);
const item = ref<objectItem>({} as objectItem);
const links = ref<string[]>([]);

onMounted(async () => {
    if (route.query && route.query.uri) {
        const { data, profiles } = await apiGetRequest(route.fullPath);
        if (data && !error.value) {
            parseIntoStore(data);

            const subject = namedNode(route.query.uri as string);
            links.value = store.value.getObjects(subject, namedNode(qnameToIri("prez:link")), null).map(link => link.value);

            // if single link, redirect
            if (links.value.length === 1) {
                router.push(links.value[0]);
            } else if (links.value.length > 1) { // else if multiple links, list on page
                item.value = {
                    iri: subject.value,
                    links: [],
                    types: []
                };

                await ensureAnnotationPredicates();
                
                item.value.title = getLabel(subject.value, store.value);
                item.value.description = getDescription(subject.value, store.value);

                const id = store.value.getObjects(subject, namedNode(qnameToIri("dcterms:identifier")), null)[0].value;

                store.value.forEach(q => {
                    if (q.predicate.value === qnameToIri("a")) {
                        item.value.types.push({
                            iri: q.object.value,
                            title: getLabel(q.object.value, store.value),
                        });
                    } else if (q.predicate.value === qnameToIri("prez:link")) {
                        const parentIds = store.value.getQuads(null, namedNode(qnameToIri("dcterms:identifier")), null, null).filter(q1 => q1.object.value !== id && q.object.value.includes(q1.object.value));
                        
                        if (parentIds.length === 1) {
                            let parentIri = parentIds[0].subject.value;
                            let parentId = parentIds[0].object.value;
                            let parentLink = q.object.value.split(parentId)[0] + parentId;

                            const parentTitle = getLabel(parentIds[0].subject.value, store.value);

                            let parentTypes: { iri: string; title?: string; }[] = [];
                            store.value.getObjects(namedNode(parentIri), namedNode(qnameToIri("a")), null).forEach(t => {
                                parentTypes.push({
                                    iri: t.value,
                                    title: getLabel(t.value, store.value),
                                });
                            });

                            item.value.links.push({
                                parentIri: parentIri,
                                parentLink: parentLink,
                                parentTypes: parentTypes,
                                parentTitle: parentTitle,
                                link: q.object.value
                            });
                        }
                    }
                }, subject, null, null, null);
            }
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
        <p>Multiple links for this object were found. Please select one of the links below:</p>
        <div class="object-heading">
            <h2 class="object-title">{{ item.title || item.iri }}</h2>
            <div class="object-types">
                <span v-for="t in item.types" class="badge">{{ t.title || t.iri }}</span>
            </div>
        </div>
        <p v-if="item.description"><em>{{ item.description }}</em></p>
        <p>Links:</p>
        <div class="links">
            <RouterLink class="link" v-for="link in item.links" :to="link.link">
                <div class="parent">
                    <h4>{{ link.parentTitle || link.parentIri }}</h4>
                    <span v-for="t in link.parentTypes" class="badge">{{ t.title || t.iri }}</span>
                </div>
                <div class="separator">&gt;</div>
                <div class="object">
                    <h4>{{ item.title || item.iri }}</h4>
                    <span v-for="t in item.types" class="badge">{{ t.title || t.iri }}</span>
                </div>
            </RouterLink>
        </div>
    </template>
    <LoadingMessage v-else-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <ErrorMessage v-else-if="route.query && route.query.uri && links.length === 0" message="Not Found: This resource contains no links within Prez" />
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.object-heading {
    display: flex;
    flex-direction: column;
    gap: 6px;

    h2.object-title {
        margin: 0;
        font-size: 1.8em;
    }

    .object-types {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
}

.links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;;

    a.link {
        display: flex;
        flex-direction: row;
        gap: 8px;
        background-color: var(--cardBg);
        padding: 10px;
        border-radius: $borderRadius;

        .parent, .object {
            display: flex;
            flex-direction: row;
            gap: 4px;
            
            h4 {
                margin: 0;
            }
        }

        .parent, .separator {
            color: black;
        }
    }
}
</style>