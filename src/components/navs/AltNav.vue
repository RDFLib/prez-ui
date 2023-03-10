<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { ProfileHeader } from "@/types";

const mediatypeNames: {[key: string]: string} = {
    "text/html": "HTML",
    "application/json": "JSON",
    "application/ld+json": "JSON-LD",
    "text/turtle": "Turtle",
    "application/rdf+xml": "RDF/XML",
    "text/csv": "CSV",
    "application/geo+json": "GeoJSON"
};

const props = defineProps<{
    profiles: ProfileHeader[];
    currentUrl: string;
}>();

const orderedProfiles = computed(() => {
    return !!props.profiles ? props.profiles.sort((a, b) => Number(b.default) - Number(a.default)) : [];
});
</script>

<template>
    <div>
        <RouterLink :to="`${props.currentUrl}?_profile=alt`"><h4>Alternate Profiles</h4></RouterLink>
        <p>View alternate views &amp; formats</p>
        <div id="profiles">
            <div v-for="profile in orderedProfiles" class="profile">
                <div class="profile-title-container">
                    <RouterLink
                        :to="`${props.currentUrl}?_profile=${profile.token}`"
                        class="profile-title"
                    >
                        <h5>{{ profile.title }}</h5>
                    </RouterLink>
                    <span v-if="profile.default" class="badge" title="This is the default profile for this endpoint">default</span>
                </div>
                <div class="mediatypes">
                    <RouterLink
                        v-for="mediatype in profile.mediatypes"
                        :to="`${props.currentUrl}?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`"
                        class="mediatype"
                    >{{ mediatypeNames[mediatype.mediatype] || mediatype.mediatype }}</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/_mixins.scss";

h4 {
    font-size: 1.1rem;
    margin: 0;
}

p {
    margin: 0.6em 0;
    font-size: 0.9em;
}

#profiles {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .profile {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .profile-title-container {
            display: flex;
            flex-direction: row;
            gap: 8px;
            
            .profile-title {
                h5 {
                    font-size: 1rem;
                    margin: 0;
                }
            }
        }
        
        .mediatypes {
            display: flex;
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;

            a.mediatype {
                padding: 6px;
                background-color: $navColor;
                color: white;
                border-radius: $borderRadius;
                font-size: 0.8rem;
                @include transition(background-color);

                &:hover {
                    background-color: adjust-color($color: $navColor, $saturation: 5%, $lightness: -10%);
                }
            }
        }
    }
}
</style>