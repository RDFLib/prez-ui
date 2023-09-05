<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useApiRequest } from "@/composables/api";
import type { Profile } from "@/types";
import router from "@/router";
import LoadingMessage from "@/components/LoadingMessage.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const { namedNode, literal } = DataFactory;

const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qnameToIri } = useRdfStore();
const { loading, error, apiGetRequest } = useApiRequest();

const DEFAULT_LABEL_PREDICATES = [qnameToIri("rdfs:label")];
const DEFAULT_DESC_PREDICATES = [qnameToIri("dcterms:description")];

type objectItem = {
    iri: string;
    title?: string;
    description?: string;
    links: {
        parentIri: string;
        parentTitle?: string;
        parentLink: string;
        parentType: {
            iri: string;
            title?: string;
        };
        link: string;
        baseClass: {
            iri: string;
            title?: string;
        };
    }[];
    types: {
        iri: string;
        title?: string;
    }[];
};

const defaultProfile = ref<Profile | null>(null);
const item = ref<objectItem>({} as objectItem);
const links = ref<string[]>([]);

function getBaseClassFromLink(link: string): {iri: string; title: string} {
    const curieRegex = "[a-zA-Z0-9\\.\\-_]+:[a-zA-Z0-9\\.\\-_]+";
    const profileRegex = new RegExp(`^(\/[csv])?\/profiles\/${curieRegex}\/?$`);
    const catalogRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/?$`);
    const resourceRegex = new RegExp(`^\/c\/catalogs\/${curieRegex}\/${curieRegex}\/?$`);
    const datasetRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/?$`);
    const featureCollectionRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/collections\/${curieRegex}\/?$`);
    const featureRegex = new RegExp(`^\/s\/datasets\/${curieRegex}\/collections\/${curieRegex}\/items\/${curieRegex}\/?$`);
    const vocabRegex = new RegExp(`^\/v\/vocab\/${curieRegex}\/?$`);
    const collectionRegex = new RegExp(`^\/v\/collection\/${curieRegex}\/?$`);
    const conceptRegex = new RegExp(`^\/v\/(vocab|collection)\/${curieRegex}\/${curieRegex}\/?$`);

    switch (true) {
        case profileRegex.test(link):
            return { iri: qnameToIri("prof:Profile"), title: "Profile" };
        case catalogRegex.test(link):
            return { iri: qnameToIri("dcat:Catalog"), title: "Catalog" };
        case resourceRegex.test(link):
            return { iri: qnameToIri("dcat:Resource"), title: "Resource" };
        case datasetRegex.test(link):
            return { iri: qnameToIri("dcat:Dataset"), title: "Dataset" };
        case featureCollectionRegex.test(link):
            return { iri: qnameToIri("geo:FeatureCollection"), title: "Feature Collection" };
        case featureRegex.test(link):
            return { iri: qnameToIri("geo:Feature"), title: "Feature" };
        case vocabRegex.test(link):
            return { iri: qnameToIri("skos:ConceptScheme"), title: "Concept Scheme" };
        case collectionRegex.test(link):
            return { iri: qnameToIri("skos:Collection"), title: "Collection" };
        case conceptRegex.test(link):
            return { iri: qnameToIri("skos:Concept"), title: "Concept" };
        default:
            return { iri: "", title: "" };
    }
}

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
                defaultProfile.value = ui.profiles[profiles.find(p => p.default)!.uri];
                const labelPredicates = defaultProfile.value!.labelPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_LABEL_PREDICATES;
                const descPredicates = defaultProfile.value!.descriptionPredicates.length > 0 ? defaultProfile.value!.labelPredicates : DEFAULT_DESC_PREDICATES;

                store.value.forEach(q => {
                    if (labelPredicates.includes(q.predicate.value)) {
                        item.value.title = q.object.value;
                    } else if (descPredicates.includes(q.predicate.value)) {
                        item.value.description = q.object.value;
                    } else if (q.predicate.value === qnameToIri("a")) {
                        const typeLabel = store.value.getObjects(q.object, namedNode(qnameToIri("rdfs:label")), null);
                        item.value.types.push({
                            iri: q.object.value,
                            title: typeLabel.length > 0 ? typeLabel[0].value : undefined,
                        });
                    } else if (q.predicate.value === qnameToIri("prez:link")) {
                        const parentIds = store.value.getQuads(null, namedNode(qnameToIri("dcterms:identifier")), null, null).filter(q1 => q.object.value.includes(q1.object.value));
                        
                        if (parentIds.length === 1) {
                            let parentIri = parentIds[0].subject.value;
                            let parentId = parentIds[0].object.value;
                            let parentLink = q.object.value.split(parentId)[0] + parentId;
                            let titles = store.value.getObjects(namedNode(parentIri), namedNode(qnameToIri("rdfs:label")), null); // API only checks for rdfs:label?

                            item.value.links.push({
                                parentIri: parentIri,
                                parentLink: parentLink,
                                parentType: getBaseClassFromLink(parentLink),
                                parentTitle: titles.length > 0 ? titles[0].value : undefined,
                                link: q.object.value,
                                baseClass: getBaseClassFromLink(q.object.value)
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
                    <span class="badge">{{ link.parentType.title || link.parentType.iri }}</span>
                </div>
                <div class="separator">&gt;</div>
                <div class="object">
                    <h4>{{ item.title || item.iri }}</h4>
                    <span class="badge">{{ link.baseClass.title || link.baseClass.iri }}</span>
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