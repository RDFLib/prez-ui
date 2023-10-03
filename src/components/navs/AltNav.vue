<script lang="ts" setup>
import { computed, inject } from "vue";
import { RouterLink } from "vue-router";
import { type ProfileHeader, apiBaseUrlConfigKey } from "@/types";
import { ALT_PROFILE_CURIE, ALT_PROFILE_URI } from "@/util/consts";

const mediatypeNames: {[key: string]: string} = {
    "text/html": "HTML",
    "application/json": "JSON",
    "application/ld+json": "JSON-LD",
    "text/turtle": "Turtle",
    "application/rdf+xml": "RDF/XML",
    "text/csv": "CSV",
    "application/geo+json": "GeoJSON"
};

const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;

const props = defineProps<{
    profiles: ProfileHeader[];
    currentUrl: string;
}>();

const orderedProfiles = computed(() => {
    // sort profiles - alphabetical, alternates profile last
    return !!props.profiles
        ? props.profiles
            // .sort((a, b) => Number(b.default) - Number(a.default))
            .sort((a, b) => a.title.localeCompare(b.title))
            .sort((a, b) => Number(a.uri === ALT_PROFILE_URI) - Number(b.uri === ALT_PROFILE_URI))
        : [];
});
</script>

<template>
    <div>
        <RouterLink :to="`${props.currentUrl}?_profile=${ALT_PROFILE_CURIE}`"><h4>Alternate Profiles</h4></RouterLink>
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
                    <RouterLink
                        :to="`/profiles/${profile.token}`"
                        title="Profile information"
                    >
                        <i class="fa-regular fa-file-circle-info"></i>
                    </RouterLink>
                    <a
                        :href="profile.uri"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Profile namespace"
                    >
                        <i class="fa-regular fa-arrow-up-right-from-square"></i>
                    </a>
                    <span
                        v-if="profile.current"
                        class="badge"
                        title="This is the current profile being used for this page"
                    >
                        current
                    </span>
                </div>
                <div class="mediatypes">
                    <a
                        v-for="mediatype in profile.mediatypes"
                        :href="`${apiBaseUrl}${props.currentUrl}?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`"
                        target="_blank"
                        class="mediatype"
                    >{{ mediatypeNames[mediatype.mediatype] || mediatype.mediatype }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/_mixins.scss";

h4 {
    font-size: 1.2rem;
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
                background-color: var(--secondary);
                color: white;
                border-radius: $borderRadius;
                font-size: 0.8rem;
                @include transition(background-color);

                &:hover {
                    background-color: var(--secondaryBtnHover);
                }
            }
        }
    }
}
</style>