<script lang="ts" setup>
import { inject, onMounted, computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useApiRequest, useConcurrentApiRequests } from "@/composables/api";
import { sidenavConfigKey, type Profile } from "@/types";
import { getRDFList } from "@/util/helpers"
import MainNav from "@/components/navs/MainNav.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import RightSideBar from "@/components/navs/RightSideBar.vue";
import SearchBar from "./components/search/SearchBar.vue";
import packageJson from "../package.json";
import prezLogo from "@/assets/images/prez-logo.png";

const { namedNode } = DataFactory;

const version = packageJson.version;

const sidenav = inject(sidenavConfigKey) as boolean;
const route = useRoute();
const ui = useUiStore();
const { loading: rootLoading, error: rootError, apiGetRequest: rootApiGetRequest } = useApiRequest(); // main request to API root
const { loading: predicateLoading, error: predicateError, apiGetRequest: predicateApiGetRequest } = useApiRequest(); // annotation predicates request
const { loading: profLoading, error: profError, apiGetRequest: profApiGetRequest } = useApiRequest(); // profiles request
const { loading: concurrentLoading, hasError: concurrentHasError, concurrentApiRequests } = useConcurrentApiRequests(); // concurrent profile requests
const { store: rootStore, parseIntoStore: rootParseIntoStore, qnameToIri: rootQnameToIri } = useRdfStore(); // store for API root data
const { store: predicateStore, parseIntoStore: predicateParseIntoStore, qnameToIri: predicateQnameToIri } = useRdfStore(); // store for annotation predicates
const { store: profStore, parseIntoStore: profParseIntoStore, qnameToIri: profQnameToIri } = useRdfStore(); // profiles store

document.title = ui.pageTitle;

// query string arguments that will cause a re-render
const renderPath = computed(() => {
    let queryList: string[] = [];
    if (Object.keys(route.query).length > 0) {
        if (route.query._profile) {
            queryList.push(route.query._profile.toString());
        }
        if (route.query._mediatype) {
            queryList.push(route.query._mediatype.toString());
        }
        if (route.query.page) {
            queryList.push(route.query.page.toString());
        }
        if (route.query.per_page) {
            queryList.push(route.query.per_page.toString());
        }
    }
    return `${route.path}${queryList.length > 0 ? `?${queryList.join("&")}` : ""}`;
})

async function getRootApiMetadata() {
    // get API details
    const { data: rootData } = await rootApiGetRequest("/");
    if (rootData && !rootError.value) {
        rootParseIntoStore(rootData);

        // get API version
        const version = rootStore.value.getObjects(null, rootQnameToIri("prez:version"), null)[0];
        ui.apiVersion = version.value;

        // get search methods per flavour
        let searchMethods: {[key: string]: string[]} = {};
        rootStore.value.forObjects(object => {
            let flavour = "";
            let methods: string[] = [];
            rootStore.value.forEach(q => {
                if (q.predicate.value === rootQnameToIri("a")) {
                    flavour = q.object.value.split(`${rootQnameToIri("prez:")}`)[1];
                } else if (q.predicate.value === rootQnameToIri("prez:availableSearchMethod")) {
                    methods.push(q.object.value.split(`${rootQnameToIri("prez:")}`)[1]);
                }
            }, object, null, null, null);
            searchMethods[flavour] = methods;
        }, null, rootQnameToIri("prez:enabledPrezFlavour"), null);
        ui.searchMethods = searchMethods;
    }
}

async function getAnnotationPredicates() {
    // get annotation predicates
    const { data } = await predicateApiGetRequest("/annotation-predicates");
    if (data && !predicateError.value) {
        predicateParseIntoStore(data);

        const labelList = predicateStore.value.getObjects(namedNode(predicateQnameToIri("prez:AnnotationPropertyList")), namedNode(predicateQnameToIri("prez:labelList")), null)[0];
        const labels = getRDFList(predicateStore.value, labelList).map(o => o.value);
        const descriptionList = predicateStore.value.getObjects(namedNode(predicateQnameToIri("prez:AnnotationPropertyList")), namedNode(predicateQnameToIri("prez:descriptionList")), null)[0];
        const descriptions = getRDFList(predicateStore.value, descriptionList).map(o => o.value);
        const provenanceList = predicateStore.value.getObjects(namedNode(predicateQnameToIri("prez:AnnotationPropertyList")), namedNode(predicateQnameToIri("prez:provenanceList")), null)[0];
        const provenances = getRDFList(predicateStore.value, provenanceList).map(o => o.value);

        ui.annotationPredicates = {
            label: labels,
            description: descriptions,
            provenance: provenances
        };
    }
}

async function getLanguageList() {
    // browser language goes first
    const browserLanguages = navigator.languages;
    // languages from API config - hardcoded for now
    const configLanguages = ["en"];
    // adds languages that aren't in the list already
    ui.languageList.push(...browserLanguages, ...configLanguages.filter(l => !browserLanguages.includes(l)));
}

async function getProfiles() {
    // if profiles don't exist in pinia
    if (Object.keys(ui.profiles).length === 0) {
        const { data: profData } = await profApiGetRequest("/profiles");
        if (profData && !profError.value) {
            profParseIntoStore(profData);

            // get list of profiles
            let profileUris: {[uri: string]: {
                token: string;
                link: string;
            }} = {};

            profStore.value.forSubjects(subject => {
                profStore.value.forEach(q => {
                    profileUris[q.subject.value] = {
                        token: q.object.value.replace("/profiles/", ""),
                        link: q.object.value
                    }
                }, subject, namedNode(profQnameToIri("prez:link")), null, null);
            }, namedNode(profQnameToIri("a")), namedNode(profQnameToIri("prof:Profile")), null);


            // request each profile in parallel
            const profilesData = await concurrentApiRequests(Object.values(profileUris).map(p => p.link));

            profilesData.forEach(r => {
                if (r.value) {
                    profParseIntoStore(r.value);
                }
            });

            let profs: Profile[] = [];

            profStore.value.forSubjects(subject => {
                let p: Profile = {
                    namespace: subject.id,
                    token: profileUris[subject.id].token,
                    title: "",
                    description: "",
                    mediatypes: [],
                    defaultMediatype: "",
                    labelPredicates: [],
                    descriptionPredicates: [],
                    explanationPredicates: []
                };
                
                profStore.value.forEach(q => {
                    if (q.predicate.value === profQnameToIri("dcterms:title")) { // need to use label predicate from profile
                        p.title = q.object.value;
                    } else if (q.predicate.value === profQnameToIri("dcterms:description")) { // need to use description predicate from profile
                        p.description = q.object.value;
                    // } else if (q.predicate.value === profQnameToIri("dcterms:identifier")) {
                    //     p.token = q.object.value;
                    } else if (q.predicate.value === profQnameToIri("altr-ext:hasResourceFormat")) {
                        p.mediatypes.push(q.object.value);
                    } else if (q.predicate.value === profQnameToIri("altr-ext:hasDefaultResourceFormat")) {
                        p.defaultMediatype = q.object.value;
                    } else if (q.predicate.value === profQnameToIri("altr-ext:hasLabelPredicate")) {
                        p.labelPredicates.push(q.object.value);
                    } else if (q.predicate.value === profQnameToIri("altr-ext:hasDescriptionPredicate")) {
                        p.descriptionPredicates.push(q.object.value);
                    } else if (q.predicate.value === profQnameToIri("altr-ext:hasExplanationPredicate")) {
                        p.explanationPredicates.push(q.object.value);
                    }
                }, subject, null, null, null);
                p.mediatypes.sort((a, b) => Number(b === p.defaultMediatype) - Number(a === p.defaultMediatype));
                profs.push(p);
            }, namedNode(profQnameToIri("a")), namedNode(profQnameToIri("prof:Profile")), null);

            ui.profiles = profs.reduce<{[namespace: string]: Profile}>((obj, prof) => (obj[prof.namespace] = prof, obj), {}); // {uri: {...}, ...}
        }
    }
}

onMounted(async () => {
    await Promise.all([getRootApiMetadata(), getAnnotationPredicates(), getLanguageList(), getProfiles()]);
});
</script>

<template>
    <header>
        <div id="header-content">
            <div id="header-bottom">
                <div id="nav-header">
                    <img id="nav-logo" :src="prezLogo" alt="Prez logo">
                    <h2 id="nav-title">
                        Prez
                        <small id="nav-subtitle">A ConnegP Linked Data API</small>
                    </h2>
                </div>
                <SearchBar v-if="route.path !== '/search'" size="large" />
                <div></div>
            </div>
        </div>
    </header>
    <main>
        <div id="main-content" :class="`${sidenav ? 'sidenav' : ''}`">
            <MainNav :sidenav="sidenav" :version="version" />
            <div id="content">
                <RouterView v-slot="{ Component }">
                    <Transition name="fade" mode="out-in">
                        <div id="content-body" :key="renderPath">
                            <Breadcrumbs />
                            <component :is="Component" />
                        </div>
                    </Transition>
                </RouterView>
                <Transition name="fade">
                    <RightSideBar v-show="ui.rightNavConfig.enabled" :profiles="ui.rightNavConfig.profiles || []" :currentUrl="ui.rightNavConfig.currentUrl || ''" />
                </Transition>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
$contentPadding: 16px;

header {
    background-color: var(--headerBg);
    color: var(--headerColor);
    display: flex;

    #header-content {
        width: 100%;
        margin: 0 auto;
        padding: 6px 12px;
        display: flex;
        flex-direction: column;

        #header-bottom {
            display: grid;
            grid-template-columns:  1fr 1fr 1fr  ;
            gap: 20px;

            #nav-header {
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: center;

                #nav-logo {
                    width: 40px;
                    height: auto;
                }

                #nav-title {
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-weight: normal;

                    small#nav-subtitle {
                        font-size: 0.8rem;
                    }
                }
            }
        }
    }
}

main {
    flex-grow: 1;
    display: flex;
    // background-color: $mainBg;

    #main-content {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;

        &.sidenav {
            flex-direction: row;
        }

        #content {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            padding: $contentPadding;
            gap: $contentPadding;

            #content-body {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
        }
    }
}
</style>
