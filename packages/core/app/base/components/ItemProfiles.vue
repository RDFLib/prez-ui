<script lang="ts" setup>
import type { PrezProfileHeader } from "../lib";
interface Props {
    profiles?: PrezProfileHeader[];
    loading?: boolean;
};

const props = defineProps<Props>();
const profileSelected = ref(props.profiles?.find(profile=>profile.current))
</script>

<template>
    <div id="profile-nav" class="ml-6 mt-4 border-l pl-8 pb-10">
        <div>
            <div>
                <ItemLink :to="`?_profile=altr-ext:alt-profile`">
                    <h4 class="text-xl">Alternate Profiles</h4>
                </ItemLink>
                <p class="text-sm">View alternate views &amp; formats</p>
            </div>

            <div v-if="props.loading">
                <Skeleton class="mb-2" />
            </div>

            <div v-else-if="props.profiles">

                <div v-for="profile in props.profiles.sort((a, b) => a.title.localeCompare(b.title))" :key="profile.token" class="mb-4">
                    <div class="pt-2">
                        <div :class="profile.current ? 'text-bold' : ''">
                            <ItemLink :to="`?_profile=${profile.token}`" title="Get profile representation" variant="item-profiles">
                                <span class="text-sm">{{ profile.title }}</span>
                            </ItemLink>
                            <span class="ml-3">
                                <ItemLink :to="`/profiles/${profile.token}`" variant="item-profiles" title="Go to profile page"><i class="text-xs pi pi-file" /></ItemLink>
                            </span>
                        </div>
                        <div v-if="profile.current" class="text-xs text-bold text-blue-500">(currently viewing)</div>
                        <ul class="text-xs">
                            <li class="mediatypes" v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                                - <ItemLink :to="`?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`" variant="item-profiles" target="_blank" rel="noopener noreferrer">
                                    <span class="font-normal">{{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}</span>
                                </ItemLink>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
