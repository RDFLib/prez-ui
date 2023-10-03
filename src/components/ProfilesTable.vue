<script lang="ts" setup>
import { computed } from "vue";
import { useUiStore } from "@/stores/ui";
import { ALT_PROFILE_URI } from "@/util/consts";

const mediatypeNames: {[key: string]: string} = {
    "text/html": "HTML",
    "application/json": "JSON",
    "application/ld+json": "JSON-LD",
    "text/turtle": "Turtle",
    "application/rdf+xml": "RDF/XML",
    "text/csv": "CSV",
    "application/geo+json": "GeoJSON"
};

const ui = useUiStore();

// const defaultToken = computed(() => {
//     const defaultProfile = ui.rightNavConfig.profiles!.find(p => p.default);
//     if (defaultProfile === undefined) {
//         throw new TypeError("A default profile must exist.");
//     }
//     return defaultProfile.token;
// });

const orderedProfiles = computed(() => {
    const includedProfiles = ui.rightNavConfig.profiles!.map(prof => prof.token);
    // sort profiles - alphabetical, alternates profile last
    return Object.values(ui.profiles)
        .filter(prof => includedProfiles.includes(prof.token))
        // .sort((a, b) => Number(b.token === defaultToken.value) - Number(a.token === defaultToken.value))
        .sort((a, b) => a.title.localeCompare(b.title))
        .sort((a, b) => Number(a.namespace === ALT_PROFILE_URI) - Number(b.namespace === ALT_PROFILE_URI));
});
</script>

<template>
    <h1 class="page-title">Alternate Profiles</h1>
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
                <RouterLink :to="`${ui.rightNavConfig.currentUrl}?_profile=${profile.token}`" title="Get profile representation">
                    {{ profile.token }}
                </RouterLink>
                <!-- <span v-if="(profile.token === defaultToken)" class="badge" title="This is the default profile for this endpoint">default</span> -->
            </td>
            <td><RouterLink :to="`/profiles/${profile.token}`" title="Go to profile page">{{ profile.title }}</RouterLink></td>
            <td>
                <div v-for="mediatype in profile.mediatypes">
                    <RouterLink :to="`${ui.rightNavConfig.currentUrl}?_profile=${profile.token}&_mediatype=${mediatype}`">
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
            background-color: var(--tableBg);
        }
    }
}

.badge {
    margin-left: 4px;
}
</style>