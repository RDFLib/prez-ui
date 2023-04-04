<script lang="ts" setup>
import { inject, computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { enabledPrezsConfigKey, type PrezFlavour } from "@/types";

const routes: {[key: string]: any[]} = {
    "VocPrez": [
        {
            "label": "Vocabs",
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
const dropdowns = ref(enabledPrezs.value.reduce<{[key: string]: boolean}>((obj, prez) => (obj[prez] = prez === activePrez.value, obj), {}));

watch(() => route.path, (newValue) => {
    Object.keys(dropdowns.value).forEach(prez => dropdowns.value[prez] = prez === activePrez.value);
});

const props = defineProps<{
    sidenav: boolean;
    version: string;
}>();
</script>

<template>
    <component :is="props.sidenav ? 'slot' : 'div'" id="nav-wrapper">
        <nav id="main-nav" :class="`${props.sidenav ? 'sidenav' : ''} ${collapse ? 'collapse' : ''}`">
            <div class="nav-item"><RouterLink to="/" class="nav-link">Home</RouterLink></div>
            <template v-for="prez in enabledPrezs">
                <div class="nav-item">
                    <RouterLink :to="`/${prez.toLowerCase()[0]}`" class="nav-link">
                        {{ prez }}
                    </RouterLink>
                    <button class="dropdown-btn" @click="dropdowns[prez] = !dropdowns[prez]">
                        <i :class="`fa-regular fa-chevron-${dropdowns[prez] ? 'up' : 'down'}`"></i>
                    </button>
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
            <div class="nav-item"><RouterLink to="/docs" class="nav-link">API Docs</RouterLink></div>
            <div class="bottom-nav-items">
                <a href="https://github.com/RDFLib/prez-ui" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Prez UI v{{ props.version }}</a>
                <a href="https://github.com/RDFLib/prez" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Prez API v{{ ui.apiVersion }}</a>
            </div>
        </nav>
        <nav v-if="!!activePrez && !props.sidenav" class="sub-nav row">
            <RouterLink
                v-for="route in routes[activePrez]"
                :to="route.to"
                class="nav-item"
            >
                {{ route.label }}
            </RouterLink>
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
    flex-direction: row;
    background-color: $navBg;

    &.sidenav {
        flex-direction: column;
        width: 240px;
        flex-shrink: 0;
    }

    &:not(.sidenav) {
        a.nav-item {
            flex: 1;
            text-align: center;
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
        color: $navColor;
        // font-weight: bold;
        font-size: 1.1rem;
        text-decoration: none;
        padding: 6px 10px;
        display: flex;
        @include transition(color, background-color);

        &:hover {
            background-color: $navColor;
            color: white;
        }

        &.router-link-active, &.active {
            background-color: $navColor;
            color: white;
        }
    }

    button.dropdown-btn {
        margin-left: auto;
        cursor: pointer;
        color: $navColor;
        background-color: $navBg;
        border: none;
        padding: 6px 8px;
        @include transition(color, background-color);

        &:hover {
            background-color: $navColor;
            color: white;
        }
    }
}

// a.nav-item {
//     color: $navColor;
//     // font-weight: bold;
//     text-decoration: none;
//     padding: 6px 10px;
//     display: flex;
//     @include transition(color, background-color);

//     &:hover {
//         background-color: $navColor;
//         color: white;
//     }

//     &.router-link-active, &.active {
//         background-color: $navColor;
//         color: white;
//     }
// }

.sub-nav {
    display: flex;
    background-color: darken($navBg, 10%);

    a.nav-link {
        font-size: 1rem !important;
    }

    &.row {
        flex-direction: row;
        
        a.nav-link {
            flex: 1;
            text-align: center;
        }
    }

    &.col {
        flex-direction: column;
        padding: 10px;
    }
}
</style>