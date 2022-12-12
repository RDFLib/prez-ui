<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { DataFactory } from "n3";
import { useUiStore } from "@/stores/ui";
import { useRdfStore } from "@/composables/rdfStore";
import { useGetRequest } from "@/composables/api";
import MainNav from "@/components/navs/MainNav.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import RightSideBar from "@/components/navs/RightSideBar.vue";
import AltView from "@/views/AltView.vue";

const { namedNode } = DataFactory;

const version = __APP_VERSION__;

const sidenav = inject("config").sidenav;
const apiBaseUrl = inject("config").apiBaseUrl;
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

            let profs = [];

            store.value.forSubjects(subject => {
                let p = {
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
                }, subject, null, null);
                // const sortedMediatypes = p.mediatypes.sort((a, b) => b === p.defaultMediatype - a === p.defaultMediatype);
                profs.push(p);
            }, namedNode(qname("a")), namedNode(qname("prof:Profile")));

            ui.profiles = profs.reduce((obj, prof) => (obj[prof.token] = prof, obj), {}); // {"dcat": {...}, "vocpub": {...}, ...}
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
            <Breadcrumbs />
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
                    <RightSideBar v-show="ui.rightNavConfig.enabled" :profiles="ui.rightNavConfig.profiles" :currentUrl="ui.rightNavConfig.currentUrl" />
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

<style lang="scss">
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/_mixins.scss";
@import "@/assets/sass/_transitions.scss";

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    height: 100vh;
    font-family: $bodyFont;
}

h1, h2, h3, h4, h5, h6 {
    font-family: $headerFont;
}

a {
    color: $linkColor;
    text-decoration: none;
}

.btn {
    cursor: pointer;
    background-color: $primary;
    color: white;
    border: 1px solid $primary;
    padding: 6px 8px;
    border-radius: $borderRadius;
    @include transition(color, background-color);

    &:hover {
        background-color: adjust-color($color: $primary, $saturation: 10%, $lightness: -7%)
    }

    &.outline {
        background-color: transparent;
        color: $primary;

        &:hover {
            background-color: $primary;
            color: white;
        }
    }

    &.sm {
        font-size: 0.7em;
        padding: 4px 6px;
    }
}

.badge {
    padding: 2px 4px;
    border: 1px solid $secondary;
    background-color: $secondary;
    color: white;
    border-radius: $borderRadius;
    font-size: 0.7rem;  

    &.outline {
        background-color: transparent;
        color: $secondary;
    }
}

#app {
    display: flex;
    flex-direction: column;
    height: 100%;

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

                #content-body {
                    display: flex;
                    flex-direction: column;
                    padding: $contentPadding;
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
}
</style>
