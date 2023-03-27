<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { sidenavConfigKey, apiBaseUrlConfigKey, type Profile } from "@/types";
import MainNav from "@/components/navs/MainNav.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import RightSideBar from "@/components/navs/RightSideBar.vue";
import GlobalSearch from "@/components/search/GlobalSearch.vue";
import packageJson from "../package.json";
import prezLogo from "@/assets/images/prez-logo.png";

const { namedNode } = DataFactory;

const version = packageJson.version;

// const sidenav = inject(sidenavConfigKey) as boolean;
const sidenav = true;
const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
const route = useRoute();
const ui = useUiStore();

const { data, profiles, loading, error, doRequest } = useGetRequest();
const { data: profData, profiles: profProfiles, loading: profLoading, error: profError, doRequest: profDoRequest } = useGetRequest();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();
const { store: profStore, prefixes: profPrefixes, parseIntoStore: profParseIntoStore, qname: profQname } = useRdfStore();
const { store: combinedStore, prefixes: combinedPrefixes, parseIntoStore: combinedParseIntoStore, qname: combinedQname } = useRdfStore();

document.title = ui.pageTitle;

onMounted(() => {
    // get API details
    doRequest(apiBaseUrl, () => {
        parseIntoStore(data.value);

        // get API version
        const version = store.value.getObjects(null, qname("prez:version"), null)[0];
        ui.apiVersion = version.value;

        // get search methods per flavour
        let searchMethods: {[key: string]: string[]} = {};
        store.value.forObjects(object => {
            let flavour = "";
            let methods: string[] = [];
            store.value.forEach(q => {
                if (q.predicate.value === qname("a")) {
                    flavour = q.object.value.split(`${qname('prez:')}`)[1];
                } else if (q.predicate.value === qname("prez:availableSearchMethod")) {
                    methods.push(q.object.value.split(`${qname('prez:')}`)[1]);
                }
            }, object, null, null, null);
            searchMethods[flavour] = methods;
        }, null, qname("prez:enabledPrezFlavour"), null);
        ui.searchMethods = searchMethods;
    });

    // if profiles don't exist in pinia
    if (Object.keys(ui.profiles).length === 0) {
        profDoRequest(`${apiBaseUrl}/profiles`, () => {
            profParseIntoStore(profData.value);

            // get list of profiles
            let profileUris: string[] = [];
            profStore.value.forObjects(object => {
                profStore.value.forEach(q => {
                    if (q.predicate.value === profQname("prez:link")) {
                        profileUris.push(`${apiBaseUrl}${q.object.value}`);
                    }
                }, object, null, null, null);
            }, namedNode(profQname("prez:ProfilesList")), namedNode(profQname("rdfs:member")), null);
            
            // promise.all request for each profile in parallel
            Promise.all(profileUris.map(uri => fetch(uri).then(r => r.text()))).then(values => {
                // parse all results into store
                values.forEach(value => {
                    combinedParseIntoStore(value)
                });

                let profs: Profile[] = [];

                combinedStore.value.forSubjects(subject => {
                    let p: Profile = {
                        namespace: subject.id,
                        token: "",
                        title: "",
                        description: "",
                        mediatypes: [],
                        defaultMediatype: ""
                    };
                    combinedStore.value.forEach(q => {
                        if (q.predicate.value === combinedQname("dcterms:title")) {
                            p.title = q.object.value;
                        } else if (q.predicate.value === combinedQname("dcterms:description")) {
                            p.description = q.object.value;
                        } else if (q.predicate.value === combinedQname("dcterms:identifier")) {
                            p.token = q.object.value;
                        } else if (q.predicate.value === combinedQname("altr-ext:hasResourceFormat")) {
                            p.mediatypes.push(q.object.value);
                        } else if (q.predicate.value === combinedQname("altr-ext:hasDefaultResourceFormat")) {
                            p.defaultMediatype = q.object.value;
                        } else if (q.predicate.value === combinedQname("altrext:hasLabelPredicate")) {
                            p.labelPredicate = q.object.value;
                        } else if (q.predicate.value === combinedQname("altrext:hasDescriptionPredicate")) {
                            p.descPredicate = q.object.value;
                        }
                    }, subject, null, null, null);
                    p.mediatypes.sort((a, b) => Number(b === p.defaultMediatype) - Number(a === p.defaultMediatype));
                    profs.push(p);
                }, namedNode(combinedQname("a")), namedNode(combinedQname("prof:Profile")), null);

                ui.profiles = profs.reduce<{[token: string]: Profile}>((obj, prof) => (obj[prof.token] = prof, obj), {}); // {"dcat": {...}, "vocpub": {...}, ...}
            });
        });
    }
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
                <GlobalSearch v-if="route.path !== '/search'" />
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
                        <div id="content-body" :key="route.fullPath">
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
    background-color: $headerBg;
    color: $headerColor;
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
    background-color: $mainBg;

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
