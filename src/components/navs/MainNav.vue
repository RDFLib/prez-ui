<script lang="ts" setup>
import { inject, computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const routes = {
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

const enabledPrezs = computed<string[]>(() => {
    const config = inject<any>("config");
    return config.enabledPrezs.sort((a: string, b: string) => a.localeCompare(b));
});

const activePrez = computed(() => {
    return enabledPrezs.value.find(prez => route.path === `/${prez.toLowerCase()[0]}` || route.path.startsWith(`/${prez.toLowerCase()[0]}/`));
});

const collapse = ref(false);

const props = defineProps<{
    sidenav: boolean;
}>();

</script>

<template>
    <component :is="props.sidenav ? 'slot' : 'div'" id="nav-wrapper">
        <nav id="main-nav" :class="`${props.sidenav ? 'sidenav' : ''} ${collapse ? 'collapse' : ''}`">
            <RouterLink to="/" class="nav-item">Home</RouterLink>
            <template v-for="prez in enabledPrezs">
                <RouterLink :to="`/${prez.toLowerCase()[0]}`" class="nav-item">
                    {{ prez }} <i class="fa-regular fa-chevron-down"></i>
                </RouterLink>
                <nav v-if="prez === activePrez && props.sidenav" id="sub-nav" class="col">
                    <RouterLink
                        v-for="subroute in routes[prez]"
                        :to="subroute.to"
                        :class="`nav-item ${route.path.startsWith(subroute.to) ? 'active' : ''}`"
                    >
                        {{ subroute.label }}
                    </RouterLink>
                </nav>
            </template>
            <RouterLink to="/search" class="nav-item">Search</RouterLink>
            <RouterLink to="/sparql" class="nav-item">SPARQL</RouterLink>
            <RouterLink to="/profiles" class="nav-item">Profiles</RouterLink>
            <RouterLink to="/about" class="nav-item">About</RouterLink>
            <RouterLink to="/docs" class="nav-item">API Docs</RouterLink>
        </nav>
        <nav v-if="!!activePrez && !props.sidenav" id="sub-nav" class="row">
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
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/_mixins.scss";

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
        min-width: 200px;
    }

    &:not(.sidenav) {
        a.nav-item {
            flex: 1;
            text-align: center;
        }
    }
}

a.nav-item {
    color: $navColor;
    font-weight: bold;
    text-decoration: none;
    padding: 6px 10px;
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

#sub-nav {
    display: flex;
    background-color: $navBg;

    &.row {
        flex-direction: row;
        
        a.nav-item {
            flex: 1;
            text-align: center;
        }
    }

    &.col {
        margin-left: 16px;
        border-left: 2px solid $navColor;
        flex-direction: column;
    }
}
</style>