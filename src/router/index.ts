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
            component: () => import("@/views/vocprez/VocPrezProfilesView.vue")
        },
        {
            path: "/v/vocab",
            name: "vocabs",
            component: () => import("@/views/vocprez/VocabsView.vue")
        },
        {
            path: "/v/vocab/:vocabId",
            name: "vocab",
            component: () => import("@/views/vocprez/VocabView.vue")
        },
        {
            path: "/v/vocab/:vocabId/:conceptId",
            name: "concept",
            component: () => import("@/views/vocprez/ConceptView.vue")
        },
        {
            path: "/v/collection",
            name: "collections",
            component: () => import("@/views/vocprez/CollectionsView.vue")
        },
        {
            path: "/v/collection/:collectionId",
            name: "collection",
            component: () => import("@/views/vocprez/CollectionView.vue")
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
            component: () => import("@/views/spaceprez/DatasetsView.vue")
        },
        {
            path: "/s/datasets/:datasetId",
            name: "dataset",
            component: () => import("@/views/spaceprez/DatasetView.vue")
        },
        {
            path: "/s/datasets/:datasetId/collections",
            name: "feature collections",
            component: () => import("@/views/spaceprez/FeatureCollectionsView.vue")
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId",
            name: "feature collection",
            component: () => import("@/views/spaceprez/FeatureCollectionView.vue")
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId/items",
            name: "features",
            component: () => import("@/views/spaceprez/FeaturesView.vue")
        },
        {
            path: "/s/datasets/:datasetId/collections/:featureCollectionId/items/:featureId",
            name: "feature",
            component: () => import("@/views/spaceprez/FeatureView.vue")
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
            component: () => import("@/views/catprez/CatalogsView.vue")
        },
        {
            path: "/c/catalogs/:catalogId",
            name: "catalog",
            component: () => import("@/views/catprez/CatalogView.vue")
        },
        {
            path: "/c/catalogs/:catalogId/:resourceId",
            name: "resource",
            component: () => import("@/views/catprez/ResourceView.vue")
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
            path: "/:pathMatch(.*)*",
            name: "not found",
            component: () => import("@/views/NotFoundView.vue")
        },
    ]
});

router.beforeEach(() => {
    ui.rightNavConfig = { enabled: true, profiles: [], currentUrl: "" };
    // if (to.query && to.query._profile === "alt" && to.name !== "alternate profiles") {
    //     next({ name: "alternate profiles", params: { path: to.path.slice(1) }, query: { _profile: "alt" } });
    // } else {
    //     next();
    // }
    return true;
});

export default router;
