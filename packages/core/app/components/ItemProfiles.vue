<script lang="ts" setup>
import type { ItemProfilesProps } from "../types";
const props = defineProps<ItemProfilesProps>();
</script>

<template>
    <div id="profile-nav">
        <PrezUILink :to="`?_profile=altr-ext:alt-profile`">
            <h4>Alternate Profiles</h4>
        </PrezUILink>
        <p>View alternate views &amp; formats</p>
        <div class="profiles">
            <div v-for="profile in props.profiles" :key="profile.token" class="profile">
                <div class="profile-title">
                    <PrezUILink :to="`?_profile=${profile.token}`" title="Get profile representation"><h5>{{ profile.title }}</h5></PrezUILink>
                    <PrezUILink :to="`/profiles/${profile.token}`" title="Go to profile page"><Button size="small" text icon="pi pi-file" /></PrezUILink>
                    <b v-if="profile.current">Current</b>
                </div>
                <div class="mediatypes">
                    <div v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype" class="mediatype">
                        <PrezUILink :to="`?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`" target="_blank" rel="noopener noreferrer">
                            <b>{{ mediatype.title || mediatype.mediatype }}</b>
                        </PrezUILink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profiles {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .profile {
        .profile-title {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 4px;
            align-items: center;
            margin-bottom: 8px;

            h5 {
                margin: 0;
            }
        }

        .mediatypes {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 6px;

            .mediatype {
                .p-chip {
                    font-size: 0.9rem;
                }
            }
        }
    }
}
</style>