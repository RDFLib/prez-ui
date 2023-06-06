<script lang="ts" setup>
import { inject, computed, ref, watch, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { enabledPrezsConfigKey, type PrezFlavour } from "@/types";
import { getPrezSystemLabel } from "@/util/prezSystemLabelMapping";
import { nextTick } from "process";

const routes: {[key: string]: any[]} = {
    "VocPrez": [
        {
            "label": "Vocabularies",
            "to": "/v/vocab"
        },
        {
            "label": "Collections",
            "to": "/v/collection"
        },
        {
            "label": "Profiles",
            "to": "/v/profiles"
        },
        {
            "label": "About",
            "to": "/v/about"
        },
    ],
    "SpacePrez": [
        {
            "label": "Datasets",
            "to": "/s/datasets"
        },
        {
            "label": "Conformance",
            "to": "/s/conformance"
        },
        {
            "label": "Profiles",
            "to": "/s/profiles"
        },
        {
            "label": "About",
            "to": "/s/about"
        },
    ],
    "CatPrez": [
        {
            "label": "Catalogs",
            "to": "/c/catalogs"
        },
        {
            "label": "Profiles",
            "to": "/c/profiles"
        },
        {
            "label": "About",
            "to": "/c/about"
        },
    ],
};

const route = useRoute();
const ui = useUiStore();

const enabledPrezs = computed<string[]>(() => {
    const enabledPrezsFlavours = inject(enabledPrezsConfigKey) as PrezFlavour[];
    return enabledPrezsFlavours.sort((a: string, b: string) => a.localeCompare(b));
});

const activePrez = computed(() => {
    return enabledPrezs.value.find(prez => route.path === `/${prez.toLowerCase()[0]}` || route.path.startsWith(`/${prez.toLowerCase()[0]}/`));
});

const collapse = ref(false);
const dropdowns = ref(enabledPrezs.value.reduce<{[key: string]: boolean}>((obj, prez) => (obj[prez] = props.sidenav ? prez === activePrez.value : false, obj), {})); // { CatPrez: false, ... }

watch(() => route.path, (newValue) => {
    if (props.sidenav) {
        Object.keys(dropdowns.value).forEach(prez => dropdowns.value[prez] = prez === activePrez.value);
    }
});

const props = defineProps<{
    sidenav: boolean;
    version: string;
}>();

function closeDropdowns() {
    if (!Object.values(dropdowns.value).every(isOpen => !isOpen)) { // if any are true
        Object.keys(dropdowns.value).forEach(prez => dropdowns.value[prez] = false); // set all to false
    }
}

function clickDropdown(prez: string) {
    if (props.sidenav) {
        dropdowns.value[prez] = !dropdowns.value[prez]
    } else {
        if (!dropdowns.value[prez]) { // closed
            nextTick(() => {
                dropdowns.value[prez] = true;
            });
        }
    }
}

onMounted(() => {
    if (!props.sidenav) {
        document.addEventListener("click", closeDropdowns);
    }
});

onUnmounted(() => {
    if (!props.sidenav) {
        document.removeEventListener("click", closeDropdowns);
    }
});
</script>

<template>
    <component :is="props.sidenav ? 'slot' : 'div'" id="nav-wrapper">
        <nav id="main-nav" :class="`${props.sidenav ? 'sidenav' : ''} ${collapse ? 'collapse' : ''}`">
            <div class="nav-item"><RouterLink to="/" class="nav-link">Home</RouterLink></div>
            <template v-for="prez in enabledPrezs">
                <div class="nav-item" :style="{ position: 'relative' }">
                    <RouterLink :to="`/${prez.toLowerCase()[0]}`" :class="`nav-link ${!props.sidenav && route.path.startsWith(`/${prez.toLowerCase()[0]}/`) ? 'active' : ''}`">
                        {{ getPrezSystemLabel(prez) }}
                    </RouterLink>
                    <button class="dropdown-btn" @click="clickDropdown(prez)">
                        <i :class="`fa-regular fa-chevron-${dropdowns[prez] ? 'up' : 'down'}`"></i>
                    </button>
                    <nav v-if="dropdowns[prez] && !props.sidenav" class="sub-nav col dropdown">
                        <div class="nav-item" v-for="subroute in routes[prez]">
                            <RouterLink
                                :to="subroute.to"
                                :class="`nav-link ${route.path.startsWith(subroute.to) ? 'active' : ''}`"
                            >
                                {{ subroute.label }}
                            </RouterLink>
                        </div>
                    </nav>
                </div>
                <nav v-if="dropdowns[prez] && props.sidenav" class="sub-nav col">
                    <div class="nav-item" v-for="subroute in routes[prez]">
                        <RouterLink
                            :to="subroute.to"
                            :class="`nav-link ${route.path.startsWith(subroute.to) ? 'active' : ''}`"
                        >
                            {{ subroute.label }}
                        </RouterLink>
                    </div>
                </nav>
            </template>
            <div class="nav-item"><RouterLink to="/search" class="nav-link">Advanced Search</RouterLink></div>
            <div class="nav-item"><RouterLink to="/sparql" class="nav-link">SPARQL</RouterLink></div>
            <div class="nav-item"><RouterLink to="/profiles" :class="`nav-link ${route.path.startsWith('/profiles') ? 'active' : ''}`">Profiles</RouterLink></div>
            <div class="nav-item"><RouterLink to="/about" class="nav-link">About</RouterLink></div>
            <div class="nav-item"><RouterLink to="/docs" class="nav-link">API Documentation</RouterLink></div>
            <div v-if="props.sidenav" class="bottom-nav-items">
                <a href="https://github.com/RDFLib/prez-ui" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Prez UI v{{ props.version }}</a>
                <a href="https://github.com/RDFLib/prez" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Prez API v{{ ui.apiVersion }}</a>
            </div>
        </nav>
    </component>
</template>

<style lang="scss" scoped>
div#nav-wrapper {
    display: flex;
    flex-direction: column;
}

nav#main-nav {
    display: flex;
    background-color: var(--navBg);

    &.sidenav {
        flex-direction: column;
        width: 240px;
        flex-shrink: 0;
    }

    &:not(.sidenav) {
        flex-direction: row;
        
        .nav-item {
            flex-grow: 1;
            text-align: center;

            a.nav-link {
                justify-content: center;
            }
        }
    }
}

.bottom-nav-items {
    margin-top: auto;
    display: flex;
    flex-direction: column;

    a {
        padding: 6px 10px;
    }
}

.nav-item {
    display: flex;
    flex-direction: row;

    a.nav-link {
        flex-grow: 1;
        color: var(--navColor);
        font-size: 1.1rem;
        text-decoration: none;
        padding: 6px 10px;
        display: flex;
        @include transition(color, background-color);

        &:hover {
            background-color: var(--navColor);
            color: white;
        }

        &.router-link-active, &.active {
            background-color: var(--navColor);
            color: white;
        }
    }

    button.dropdown-btn {
        margin-left: auto;
        cursor: pointer;
        color: var(--navColor);
        background-color: var(--navBg);
        border: none;
        padding: 6px 8px;
        @include transition(color, background-color);

        &:hover {
            background-color: var(--navColor);
            color: white;
        }
    }
}

.sub-nav {
    display: flex;
    background-color: var(--subNavBg);

    a.nav-link {
        font-size: 1rem !important;
    }

    &.row {
        flex-direction: row;
        border-top: 1px solid var(--navColor);
        
        .nav-item {
            flex-grow: 1;
            text-align: center;

            a.nav-link {
                justify-content: center;
            }
        }
    }

    &.col {
        flex-direction: column;
        padding: 10px;

        &.dropdown {
            position: absolute;
            z-index: 100;
            padding: 0;
            top: 100%;
            width: 100%;

            .nav-link {
                justify-content: unset !important;
            }
        }
    }
}
</style>