<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";
import { useGetRequest } from "@/composables/api";

const mediatypeNames = {
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
const apiBaseUrl = inject("config").apiBaseUrl;

const { data, profiles, loading, error, doRequest } = useGetRequest();

// const profileData = [
//     {
//         token: "alt",
//         name: "Alternates Profile",
//         mediatypes: [
//             {
//                 name: "HTML",
//                 format: "text/html"
//             },
//             {
//                 name: "JSON",
//                 format: "application/json"
//             },
//             {
//                 name: "Turtle",
//                 format: "text/turtle"
//             }
//         ],
//         languages: ["en", "de"],
//         description: "The representation of the resource that lists all other representations (profiles and Media Types)",
//         namespace: "http://www.w3.org/ns/dx/conneg/altr-ext#alt-profile",
//         default: false
//     }
// ];

// const profiles = ref([]);

const orderedProfiles = computed(() => {
    return profiles.value.sort((a, b) => b.default - a.default);
});

onMounted(() => {
    doRequest(`${apiBaseUrl}${route.path}`);
    ui.updateRightNavConfig({ enabled: false });
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
            <th>Languages</th>
            <th>Description</th>
            <th>Namespace</th>
        </tr>
        <tr v-for="profile in orderedProfiles">
            <td><RouterLink :to="`${route.path}?_profile=${profile.token}`">{{ profile.token }}</RouterLink> <span v-if="profile.default" class="badge outline">default</span></td>
            <td>{{ profile.name }}</td>
            <td>
                <template v-for="mediatype in profile.mediatypes">
                    <RouterLink :to="`${route.path}?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`">{{ mediatypeNames[mediatype.mediatype] }}</RouterLink>
                    <br/>
                </template>
            </td>
            <td>
                <template v-for="language in profile.languages">
                    <span>{{ language }}</span>
                    <br/>
                </template>
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
</style>