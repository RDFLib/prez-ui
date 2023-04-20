<script lang="ts" setup>
import { ref, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { DataFactory, type Quad_Object, type Quad_Subject } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey, type Breadcrumb, type ListItem, type PrezFlavour } from "@/types";
import ItemList from "@/components/ItemList.vue";
import AdvancedSearch from "@/components/search/AdvancedSearch.vue";
import ProfilesTable from "@/components/ProfilesTable.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";

const { namedNode } = DataFactory;

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();
const { store, parseIntoStore, qname } = useRdfStore();
const { data, profiles, loading, error, doRequest } = useGetRequest();

const props = defineProps<{
    title: string;
    parentType?: string;
    class?: string;
    childButton?: { name: string, url: string }; // undefined or link to children (/collections or /items)
    enableSearch?: boolean;
    content?: string;
}>();

const items = ref<ListItem[]>([]);
const count = ref(0);
const isAltView = ref(false);

const flavour = computed<PrezFlavour | undefined>(() => {
    if (route.path.startsWith("/c/")) {
        return "CatPrez";
    } else if (route.path.startsWith("/s/")) {
        return "SpacePrez";
    } else if (route.path.startsWith("/v/")) {
        return "VocPrez";
    } else {
        return undefined;
    }
});

const currentPageNumber = computed(() => {
    if (route.query && route.query.page) {
        return parseInt(route.query.page as string);
    } else {
        return 1;
    }
});

function getBreadcrumbs(): Breadcrumb[] {
    let breadcrumbs: Breadcrumb[] = [];
    if (flavour.value) {
        breadcrumbs.push({ name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`});
        if (props.parentType) {
            if (["dcat:Dataset", "geo:FeatureCollection"].includes(props.parentType)) {
                breadcrumbs.push({ name: "Datasets", url: "/s/datasets" });
                breadcrumbs.push({ name: "Dataset", url: `/s/datasets/${route.params.datasetId}` }); // need parent info in data (link, title & type)
            }
            if (["geo:FeatureCollection"].includes(props.parentType)) {
                breadcrumbs.push({ name: "Feature Collections", url: `/s/datasets/${route.params.datasetId}/collections` }); // need parent info in data (link, title & type)
                breadcrumbs.push({ name: "Feature Collection", url: `/s/datasets/${route.params.datasetId}/collections/${route.params.featureCollectionId}` }); // need parent info in data (link, title & type)
            }
        }
    } else if (props.parentType === "prof:Profile") {
        breadcrumbs.push({ name: "Profiles", url: "/profiles"});
    }
    return breadcrumbs;
}

function getSearchDefaults(): {[key: string]: string} { // need IRI of parent to set default search params
    if (props.enableSearch) {
        return {};
    } else {
        return {};
    }
}

onMounted(() => {
    let paginationParams = "";

    if (route.query) {
        if (route.query.page) {
            paginationParams += `?page=${route.query.page}`;
        }

        if (route.query.per_page) {
            if (route.query.page) {
                paginationParams += "&";
            } else {
                paginationParams += "?";
            }

            paginationParams += `per_page=${route.query.per_page}`;
        }
    }

    doRequest(`${apiBaseUrl}${route.path}${paginationParams}`, () => {
        const defaultProfile = profiles.value.find(p => p.default)!;
        
        // check profile, potentially show Alt profiles page or redirect to API endpoint
        if (route.query && route.query._profile) {
            if (route.query._profile === defaultProfile.token && !route.query._mediatype) {
                isAltView.value = false;
            } else if (route.query._profile === "alt" && !route.query._mediatype) {
                // show alt profiles page
                isAltView.value = true;
            } else {
                // redirect to API
                window.location.replace(`${apiBaseUrl}${route.path}?_profile=${route.query._profile}${route.query._mediatype ? `&_mediatype=${route.query._mediatype}` : ""}`)
            }
        } else {
            isAltView.value = false;
        }

        parseIntoStore(data.value);

        // default label & description predicates
        let labelPred = qname("rdfs:label");
        let descPred = qname("dcterms:description");

        if (Object.keys(ui.profiles).includes(defaultProfile.uri)) {
            const currentProfile = ui.profiles[defaultProfile.uri];
            
            // get profile-specific label & description predicates if available
            if (currentProfile.labelPredicate) {
                labelPred = currentProfile.labelPredicate;
            }
            if (currentProfile.descPredicate) {
                descPred = currentProfile.descPredicate;
            }
        }

        let nodeList: Quad_Subject[] | Quad_Object[] = [];
        
        if (props.class) {
            count.value = parseInt(store.value.getObjects(namedNode(qname(props.class)), namedNode(qname("prez:count")), null)[0].value);
            nodeList = store.value.getSubjects(namedNode(qname("a")), namedNode(qname(props.class)), null);
        } else {
            const quad = store.value.getQuads(null, namedNode(qname("prez:count")), null, null)[0];
            count.value = parseInt(quad.object.value);
            nodeList = store.value.getObjects(quad.subject, namedNode(qname("rdfs:member")), null);
        }

        nodeList.forEach(member => {
            let c: ListItem = {
                iri: member.id
            };
            store.value.forEach(q => { // get preds & objs for each subj
                if (q.predicate.value === labelPred) {
                    c.title = q.object.value;
                } else if (q.predicate.value === descPred) {
                    c.description = q.object.value;
                } else if (q.predicate.value === qname("prez:link")) {
                    c.link = q.object.value;
                }
            }, member, null, null, null);
            items.value.push(c);
        });

        items.value.sort((a, b) => {
            if (a.title && b.title) {
                return a.title.localeCompare(b.title);
            } else if (a.title) {
                return -1;
            } else if (b.title) {
                return 1;
            } else {
                return a.iri.localeCompare(b.iri);
            }
        });

        if (isAltView.value) {
            ui.rightNavConfig = { enabled: false };
        } else {
            ui.rightNavConfig = { enabled: true, profiles: profiles.value, currentUrl: route.path };
        }
        
        document.title = `${props.title} | Prez`;
        if (flavour.value) {
            ui.pageHeading = { name: flavour.value, url: `/${flavour.value[0].toLowerCase()}`};
        } else {
            ui.pageHeading = { name: "Prez", url: "/"};
        }
        ui.breadcrumbs = [
            ...getBreadcrumbs(),
            { name: props.title, url: route.path },
            ... isAltView.value ? [{ name: "Alternate Profiles", url: `${route.path}?_profile=alt` }] : []
        ];
    });
});
</script>

<template>
    <ProfilesTable v-if="isAltView" :profiles="profiles" :path="route.path" />
    <template v-else>
        <h1 class="page-title">{{ props.title }}</h1>
        <p v-if="props.content" v-html="props.content"></p>
        <p v-if="items.length > 0">Showing {{ items.length }} of {{ count }} items.</p>
        <template v-if="error">
            <ErrorMessage :message="error" />
        </template>
        <template v-else-if="loading">
            <i class="fa-regular fa-spinner-third fa-spin"></i> Loading...
        </template>
        <template v-else-if="items.length > 0">
            <ItemList :items="items" :childName="props.childButton?.name" :childLink="props.childButton?.url" />
            <PaginationComponent :url="route.path" :totalCount="count" :currentPage="currentPageNumber" />
        </template>
        <template v-else>No {{ props.title }} found.</template>
        <Teleport v-if="props.enableSearch" to="#right-bar-content">
            <AdvancedSearch :flavour="flavour" :query="getSearchDefaults()" />
        </Teleport>
    </template>
</template>

<style lang="scss" scoped>

</style>