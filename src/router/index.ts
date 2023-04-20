import { createRouter, createWebHistory } from "vue-router";
import pinia from "@/stores/pinia";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore(pinia);

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("@/views/HomeView.vue")
        },
        {
            path: "/v",
            name: "vocprez home",
            component: () => import("@/views/vocprez/VocPrezHomeView.vue")
        },
        {
            path: "/v/about",
            name: "vocprez about",
            component: () => import("@/views/vocprez/VocPrezAboutView.vue")
        },
        {
            path: "/v/profiles",
            name: "vocprez profiles",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "VocPrez Profiles",
                class: "prez:VocPrezProfile",
                content: `A list of <a href="http://www.w3.org/ns/dx/prof/Profile" target="_blank" rel="noopener noreferrer">prof:Profiles</a> used by VocPrez.`
            }
        },
        {
            path: "/v/vocab",
            name: "vocabs",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Vocabs",
                class: "skos:ConceptScheme",
                enableSearch: true,
                content: `A list of <a href="http://www.w3.org/2004/02/skos/core#ConceptScheme" target="_blank" rel="noopener noreferrer">skos:ConceptSchemes</a>.`
            }
        },
        {
            path: "/v/vocab/:vocabId",
            name: "vocab",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "skos:ConceptScheme",
                getChildren: true,
                childPred: "skos:member", // placeholder
                childTitlePred: "skos:prefLabel",
                enableSearch: true
            }
        },
        {
            path: "/v/vocab/:vocabId/:conceptId",
            name: "concept",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "skos:Concept",
            }
        },
        {
            path: "/v/collection",
            name: "collections",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Collections",
                class: "skos:Collection",
                enableSearch: true,
                content: `A list of <a href="http://www.w3.org/2004/02/skos/core#Collection" target="_blank" rel="noopener noreferrer">skos:Collections</a>.`
            }
        },
        {
            path: "/v/collection/:collectionId",
            name: "collection",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "skos:Collection",
                getChildren: true,
                childPred: "skos:member",
                childTitlePred: "skos:prefLabel",
                childDisplayTitle: "Concepts",
            }
        },
        {
            path: "/s",
            name: "spaceprez home",
            component: () => import("@/views/spaceprez/SpacePrezHomeView.vue")
        },
        {
            path: "/s/conformance",
            name: "spaceprez conformance",
            component: () => import("@/views/spaceprez/ConformanceView.vue")
        },
        {
            path: "/s/about",
            name: "spaceprez about",
            component: () => import("@/views/spaceprez/SpacePrezAboutView.vue")
        },
        {
            path: "/s/profiles",
            name: "spaceprez profiles",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "SpacePrez Profiles",
                class: "prez:SpacePrezProfile",
                content: `A list of <a href="http://www.w3.org/ns/dx/prof/Profile" target="_blank" rel="noopener noreferrer">prof:Profiles</a> used by SpacePrez.`
            }
        },
        {
            path: "/s/datasets",
            name: "datasets",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Datasets",
                class: "dcat:Dataset",
                childButton: { name: "Collections", url: "/collections" },
                enableSearch: true,
                content: `A list of <a href="http://www.w3.org/ns/dcat#Dataset" target="_blank" rel="noopener noreferrer">dcat:Datasets</a>.`
            }
        },
        {
            path: "/s/datasets/:datasetId",
            name: "dataset",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "dcat:Dataset",
                childPred: "rdfs:member",
                childButton: { name: "Collections", url: "/collections" },
                enableSearch: true
            }
        },
        {
            path: "/s/datasets/:datasetId/collections",
            name: "feature collections",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Feature Collections",
                parentType: "dcat:Dataset",
                childButton: { name: "Features", url: "/items" },
                enableSearch: true,
                content: `A list of <a href="http://www.opengis.net/ont/geosparql#FeatureCollection" target="_blank" rel="noopener noreferrer">geo:FeatureCollections</a>.`
            }
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId",
            name: "feature collection",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "geo:FeatureCollection",
                childPred: "rdfs:member",
                childButton: { name: "Features", url: "/items" },
                enableSearch: true
            }
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId/items",
            name: "features",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Features",
                parentType: "geo:FeatureCollection",
                enableSearch: true,
                content: `A list of <a href="http://www.opengis.net/ont/geosparql#Feature" target="_blank" rel="noopener noreferrer">geo:Features</a>.`
            }
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId/items/:featureId",
            name: "feature",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "geo:Feature",
            }
        },
        {
            path: "/c",
            name: "catprez home",
            component: () => import("@/views/catprez/CatPrezHomeView.vue")
        },
        {
            path: "/c/about",
            name: "catprez about",
            component: () => import("@/views/catprez/CatPrezAboutView.vue")
        },
        {
            path: "/c/profiles",
            name: "catprez profiles",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "CatPrez Profiles",
                class: "prez:CatPrezProfile",
                content: `A list of <a href="http://www.w3.org/ns/dx/prof/Profile" target="_blank" rel="noopener noreferrer">prof:Profiles</a> used by CatPrez.`
            }
        },
        {
            path: "/c/catalogs",
            name: "catalogs",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Catalogs",
                class: "dcat:Catalog",
                enableSearch: true,
                content: `A list of <a href="http://www.w3.org/ns/dcat#Catalog" target="_blank" rel="noopener noreferrer">dcat:Catalogs</a>.`
            }
        },
        {
            path: "/c/catalogs/:catalogId",
            name: "catalog",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "dcat:Catalog",
                getChildren: true,
                childPred: "dcterms:hasPart",
                childTitlePred: "rdfs:label",
                childDisplayTitle: "Resources",
                enableSearch: true
            }
        },
        {
            path: "/c/catalogs/:catalogId/:resourceId",
            name: "resource",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "dcat:Resource",
            }
        },
        {
            path: "/sparql",
            name: "sparql",
            component: () => import("@/views/SparqlView.vue")
        },
        {
            path: "/about",
            name: "about",
            component: () => import("@/views/AboutView.vue")
        },
        {
            path: "/search",
            name: "search",
            component: () => import("@/views/SearchView.vue")
        },
        {
            path: "/profiles",
            name: "profiles",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Profiles",
                class: "prof:Profile",
                content: `A list of <a href="http://www.w3.org/ns/dx/prof/Profile" target="_blank" rel="noopener noreferrer">prof:Profiles</a> used across Prez.`
            }
        },
        {
            path: "/profiles/:profileId",
            name: "profile",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "prof:Profile",
            }
        },
        {
            path: "/object",
            name: "object",
            component: () => import("@/views/ObjectView.vue")
        },
        {
            path: "/docs",
            name: "docs",
            component: () => import("@/views/DocsView.vue")
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not found",
            component: () => import("@/views/NotFoundView.vue")
        },
    ]
});

router.beforeEach(() => {
    ui.rightNavConfig = { enabled: false, profiles: [], currentUrl: "" };
    return true;
});

export default router;
