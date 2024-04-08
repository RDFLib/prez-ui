<script lang="ts" setup>
import type { ProfileHeader } from "prez-lib";
import Tag from "primevue/tag";
import Chip from "primevue/chip";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";

const config = useRuntimeConfig();

const props = defineProps<{
    path: string;
    profiles: ProfileHeader[];
    loading?: boolean;
}>();
</script>

<template>
    <div id="profile-nav">
        <NuxtLink :to="`${path}?_profile=altr-ext:alt-profile`"><h4>Alternate Profiles</h4></NuxtLink>
        <p>View alternate views &amp; formats</p>
        <div class="profiles">
            <template v-if="props.loading">
                <div v-for="i in 3" class="profile">
                    <div class="profile-title">
                        <Skeleton height="1.3rem" width="8rem" class="mb-2"></Skeleton>
                    </div>
                    <div class="mediatypes">
                        <div v-for="j in 4" class="mediatype">
                            <Skeleton width="10rem" class="mb-2"></Skeleton>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-for="profile in props.profiles" class="profile">
                    <div class="profile-title">
                        <NuxtLink :to="`${props.path}?_profile=${profile.token}`" title="Get profile representation"><h5>{{ profile.title }}</h5></NuxtLink>
                        <NuxtLink :to="`/profiles/${profile.token}`" title="Go to profile page"><Button size="small" text icon="pi pi-file" /></NuxtLink>
                        <Tag v-if="profile.current" severity="secondary" value="Current"></Tag>
                    </div>
                    <div class="mediatypes">
                        <div v-for="mediatype in profile.mediatypes" class="mediatype">
                            <a :href="`${config.public.apiUrl}${props.path}?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`" target="_blank" rel="noopener noreferrer">
                                <Chip :label="mediatype.title || mediatype.mediatype" />
                            </a>
                        </div>
                    </div>
                </div>
            </template>
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