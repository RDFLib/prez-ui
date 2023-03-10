<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import { configKey, defaultConfig, type Profile } from "@/types";
import MainNav from "@/components/navs/MainNav.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import RightSideBar from "@/components/navs/RightSideBar.vue";
import AltView from "@/views/AltView.vue";
import GlobalSearch from "@/components/search/GlobalSearch.vue";
import packageJson from "../package.json";

const { namedNode } = DataFactory;

const version = JSON.stringify(packageJson.version);

const { sidenav, apiBaseUrl } = inject(configKey, defaultConfig);
const route = useRoute();
const ui = useUiStore();

const { data: profData, profiles: profProfiles, loading: profLoading, error: profError, doRequest: profDoRequest } = useGetRequest();
const { store, prefixes, parseIntoStore, qname } = useRdfStore();

document.title = ui.pageTitle;

onMounted(() => {
    // if profiles don't exist in pinia
    if (Object.keys(ui.profiles).length === 0) {
        profDoRequest(`${apiBaseUrl}/s/profiles`, () => {
            parseIntoStore(profData.value);

            let profs: Profile[] = [];

            store.value.forSubjects(subject => {
                let p: Profile = {
                    namespace: subject.id,
                    token: "",
                    title: "",
                    description: "",
                    mediatypes: [],
                    defaultMediatype: ""
                };
                store.value.forEach(q => {
                    if (q.predicate.value === qname("dcterms:title")) {
                        p.title = q.object.value;
                    } else if (q.predicate.value === qname("dcterms:description")) {
                        p.description = q.object.value;
                    } else if (q.predicate.value === qname("dcterms:identifier")) {
                        p.token = q.object.value;
                    } else if (q.predicate.value === qname("altr-ext:hasResourceFormat")) {
                        p.mediatypes.push(q.object.value);
                    } else if (q.predicate.value === qname("altr-ext:hasDefaultResourceFormat")) {
                        p.defaultMediatype = q.object.value;
                    }
                }, subject, null, null, null);
                // const sortedMediatypes = p.mediatypes.sort((a, b) => b === p.defaultMediatype - a === p.defaultMediatype);
                profs.push(p);
            }, namedNode(qname("a")), namedNode(qname("prof:Profile")), null);

            ui.profiles = profs.reduce<{[token: string]: Profile}>((obj, prof) => (obj[prof.token] = prof, obj), {}); // {"dcat": {...}, "vocpub": {...}, ...}
        });
    }
});
</script>

<template>
    <header>
        <div id="header-content">
            <div id="header-html">
                <RouterLink id="page-heading" :to="ui.pageHeading.url"><h1>{{ ui.pageHeading.name }}</h1></RouterLink>
            </div>
            <div id="header-bottom">
                <Breadcrumbs />
                <GlobalSearch v-if="route.path !== '/search'" />
                <div></div>
            </div>
        </div>
    </header>
    <main>
        <div id="main-content" :class="`${sidenav ? 'sidenav' : ''}`">
            <MainNav :sidenav="sidenav" />
            <div id="content">
                <RouterView v-slot="{ Component }">
                    <Transition name="fade" mode="out-in">
                        <div id="content-body" :key="route.path">
                            <component :is="route.query && route.query._profile && route.query._profile === 'alt' ? AltView : Component" />
                        </div>
                    </Transition>
                </RouterView>
                <Transition name="fade">
                    <RightSideBar v-show="ui.rightNavConfig.enabled" :profiles="ui.rightNavConfig.profiles || []" :currentUrl="ui.rightNavConfig.currentUrl || ''" />
                </Transition>
            </div>
        </div>
    </main>
    <footer>
        <div id="footer-content">
            <div id="footer-html">footer</div>
            <div id="prez-footer">
                <a href="https://github.com/RDFLib/prez-ui" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Prez UI v{{ version }}</a>
                <a href="https://github.com/RDFLib/prez" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Prez API v{{ ui.apiVersion }}</a>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
$contentPadding: 16px;

header {
    background-color: $headerBg;
    color: $headerColor;
    display: flex;

    #header-content {
        width: 100%;
        // max-width: $pageMaxWidth;
        margin: 0 auto;
        padding: $contentPadding $contentPadding 6px $contentPadding;
        display: flex;
        flex-direction: column;
        gap: 16px;

        #header-html {
            display: flex;

            #page-heading {
                color: $headerColor;
                margin: auto;
            }
        }

        #header-bottom {
            display: grid;
            grid-template-columns:  1fr 1fr 1fr  ;
            gap: 20px;
        }
    }
}

main {
    flex-grow: 1;
    display: flex;
    background-color: $mainBg;

    #main-content {
        width: 100%;
        // max-width: $pageMaxWidth;
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

footer {
    background-color: $footerBg;
    color: $footerColor;
    display: flex;

    #footer-content {
        width: 100%;
        // max-width: $pageMaxWidth;
        margin: 0 auto;
        padding: $contentPadding;
        display: flex;
        flex-direction: column;
        gap: 16px;

        #prez-footer {
            display: flex;
            flex-direction: row;
            gap: 12px;
        }
    }
}

</style>
