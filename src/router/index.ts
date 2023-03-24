import { createRouter, createWebHashHistory } from "vue-router";
import pinia from "@/stores/pinia";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore(pinia);

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
            component: () => import("@/views/vocprez/VocPrezProfilesView.vue")
        },
        {
            path: "/v/vocab",
            name: "vocabs",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Vocabs",
                itemPred: "rdfs:member",
                titlePred: "skos:prefLabel", // soon replaced with default profile hasLabelPredicate
                descPred: "skos:definition", // soon replaced with default profile hasDescPredicate?
                enableSearch: true
            }
        },
        {
            path: "/v/vocab/:vocabId",
            name: "vocab",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "skos:ConceptScheme",
                getChildren: true,
                titlePred: "skos:prefLabel", // soon replaced with default profile hasLabelPredicate
                descPred: "skos:definition", // soon replaced with default profile hasDescPredicate?
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
                titlePred: "skos:prefLabel", // soon replaced with default profile hasLabelPredicate
                descPred: "skos:definition" // soon replaced with default profile hasDescPredicate?
            }
        },
        {
            path: "/v/collection",
            name: "collections",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Collections",
                itemPred: "rdfs:member",
                titlePred: "skos:prefLabel", // soon replaced with default profile hasLabelPredicate
                descPred: "skos:definition", // soon replaced with default profile hasDescPredicate?
                enableSearch: true
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
                titlePred: "skos:prefLabel", // soon replaced with default profile hasLabelPredicate
                descPred: "skos:definition" // soon replaced with default profile hasDescPredicate?
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
            component: () => import("@/views/spaceprez/SpacePrezProfilesView.vue")
        },
        {
            path: "/s/datasets",
            name: "datasets",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Datasets",
                itemPred: "rdfs:member",
                childButton: { name: "Collections", url: "/collections" },
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
                enableSearch: true
            }
        },
        {
            path: "/s/datasets/:datasetId",
            name: "dataset",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "dcat:Dataset",
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
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
                itemPred: "rdfs:member",
                childButton: { name: "Features", url: "/items" },
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
                enableSearch: true
            }
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId",
            name: "feature collection",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "geo:FeatureCollection",
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
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
                itemPred: "rdfs:member",
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
            }
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId/items/:featureId",
            name: "feature",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "geo:Feature",
                titlePred: "rdfs:label", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description",
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
            component: () => import("@/views/catprez/CatPrezProfilesView.vue")
        },
        {
            path: "/c/catalogs",
            name: "catalogs",
            component: () => import("@/views/ItemListView.vue"),
            props: {
                title: "Catalogs",
                itemPred: "rdfs:member",
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasLabelPredicate
                enableSearch: true
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
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
                enableSearch: true
            }
        },
        {
            path: "/c/catalogs/:catalogId/:resourceId",
            name: "resource",
            component: () => import("@/views/PropTableView.vue"),
            props: {
                type: "dcat:Resource",
                titlePred: "dcterms:title", // soon replaced with default profile hasLabelPredicate
                descPred: "dcterms:description", // soon replaced with default profile hasDescPredicate?
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
            component: () => import("@/views/ProfilesView.vue")
        },
        {
            path: "/profiles/:profileId",
            name: "profile",
            component: () => import("@/views/ProfileView.vue"),
        },
        {
            path: "/object",
            name: "object",
            component: () => import("@/views/ObjectView.vue")
        },
        // {
        //     path: "/:path",
        //     name: "alternate profiles",
        //     component: () => import("@/views/AltView.vue")
        // },
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
    // if (to.query && to.query._profile === "alt" && to.name !== "alternate profiles") {
    //     next({ name: "alternate profiles", params: { path: to.path.slice(1) }, query: { _profile: "alt" } });
    // } else {
    //     next();
    // }
    return true;
});

export default router;
