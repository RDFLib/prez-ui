<script lang="ts" setup>
import type { PrezProfileHeader } from "@/base/lib";

interface Props {
    apiUrl?: string;
    profiles?: PrezProfileHeader[];
    loading?: boolean;
};

const props = defineProps<Props>();

</script>

<template>
    <div id="profile-nav" class="ml-0 pt-4 border-l pl-10 pb-10">
        <div>
            <div class="text-xl">
                <ItemLink :to="`?_profile=altr-ext:alt-profile`">
                    Alternate Profiles
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
                            <span class="mr-1">
                                <ItemLink :to="`/profiles/${profile.token}`" variant="item-profiles" title="Go to profile page"><i class="text-xs pi pi-file" /></ItemLink>
                            </span>
                            <ItemLink :to="`?_profile=${profile.token}`" title="Get profile representation" variant="item-profiles">
                                <span class="text-sm">{{ profile.title }}</span>
                            </ItemLink>
                        </div>
                        <div v-if="profile.current" class="text-sm text-bold text-blue-500">(currently viewing)</div>
                        <ul class="text-sm">
                            <li class="mediatypes" v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                                - <ItemLink :to="`${apiUrl}?_profile=${encodeURIComponent(profile.token)}&_mediatype=${encodeURIComponent(mediatype.mediatype)}`" variant="item-profiles" target="_blank" rel="noopener noreferrer">
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
