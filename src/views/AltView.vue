<script lang="ts" setup>
import { onMounted, computed, inject } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";
import { apiBaseUrlConfigKey } from "@/types";

const mediatypeNames: {[key: string]: string} = {
    "text/html": "HTML",
    "application/json": "JSON",
    "application/ld+json": "JSON-LD",
    "text/turtle": "Turtle",
    "application/rdf+xml": "RDF/XML",
    "text/csv": "CSV",
    "application/geo+json": "GeoJSON"
};

const route = useRoute();
const ui = useUiStore();
const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;

const { data, profiles, loading, error, doRequest } = useGetRequest();

const defaultToken = computed(() => {
    const defaultProfile = profiles.value.find(p => p.default);
    if (defaultProfile === undefined) {
        throw new TypeError("A default profile must exist.");
    }
    return defaultProfile.token;
});

const orderedProfiles = computed(() => {
    const includedProfiles = profiles.value.map(prof => prof.token);
    return Object.values(ui.profiles).filter(prof => includedProfiles.includes(prof.token)).sort((a, b) => Number(a.token === defaultToken.value) - Number(b.token === defaultToken.value));
});

onMounted(() => {
    doRequest(`${apiBaseUrl}${route.path}`); // needs to be HEAD request?
    ui.rightNavConfig = { enabled: false };
});
</script>

<template>
    <h1>Alternate Profiles</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic ex at nobis obcaecati? Praesentium tenetur inventore ratione temporibus cumque incidunt quo, recusandae, labore voluptatibus repudiandae iure deserunt maxime similique placeat.</p>
    <table>
        <tr>
            <th>Token</th>
            <th>Name</th>
            <th>Formats</th>
            <th>Description</th>
            <th>Namespace</th>
        </tr>
        <tr v-for="profile in orderedProfiles">
            <td>
                <RouterLink :to="`${route.path}?_profile=${profile.token}`">
                    {{ profile.token }}
                </RouterLink>
                <span v-if="(profile.token === defaultToken)" class="badge" title="This is the default profile for this endpoint">default</span>
            </td>
            <td>{{ profile.title }}</td>
            <td>
                <div v-for="mediatype in profile.mediatypes">
                    <RouterLink :to="`${route.path}?_profile=${profile.token}&_mediatype=${mediatype}`">
                        {{ mediatypeNames[mediatype] || mediatype }}
                    </RouterLink>
                    <span v-if="(mediatype === profile.defaultMediatype)" class="badge" title="This is the default format for this profile">default</span>
                </div>
            </td>
            <td>{{ profile.description }}</td>
            <td><a :href="profile.namespace" target="_blank">{{ profile.namespace }}</a></td>
        </tr>
    </table>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

table {
    border-collapse: collapse;

    & > tr {
        th, td {
            padding: 6px;
        }

        th {
            text-align: center;
        }

        &:nth-child(2n) {
            background-color: $tableBg;
        }
    }
}

.badge {
    margin-left: 4px;
}
</style>