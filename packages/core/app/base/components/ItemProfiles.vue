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
    <div id="profile-nav" class="ml-6 mt-4">
        <Panel>
            <template #header>
                <div>
                    <ItemLink :to="`?_profile=altr-ext:alt-profile`">
                        <h4 class="text-xl">Alternate Profiles</h4>
                    </ItemLink>
                    <p class="text-sm">View alternate views &amp; formats</p>
                </div>
            </template>

            <div v-if="props.loading">
                <Skeleton class="mb-2" />
            </div>

            <div v-else-if="props.profiles">

                <div v-for="profile in props.profiles.sort((a, b) => a.title.localeCompare(b.title))" :key="profile.token" class="mb-4">
                    <component :is="profile.current ? 'fieldset' : 'div'" :class="profile.current ? 'border rounded pt-2 px-4 pb-4' : 'border-t border-gray-200 pt-2'">
                        <legend v-if="profile.current" class="text-xs text-bold text-right text-blue-500">currently viewing</legend>
                        <div :class="profile.current ? 'text-bold' : ''">
                            <ItemLink :to="`?_profile=${profile.token}`" title="Get profile representation" variant="item-profiles"><span class="text-sm">{{ profile.title }}</span></ItemLink>
                            <span class="ml-3">
                                <ItemLink :to="`/profiles/${profile.token}`" variant="item-profiles" title="Go to profile page"><i class="text-xs pi pi-file" /></ItemLink>  
                            </span>
                        </div>
                        <div class="mt-2 flex flex-row flex-wrap gap-1.5 text-xs">
                            <div class="mediatypes" v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                                <Tag class="text-xs font-normal">
                                <ItemLink :to="`?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`" variant="item-profiles" target="_blank" rel="noopener noreferrer">
                                    <span class="font-normal">{{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}</span>
                                </ItemLink>
                                </Tag>
                            </div>
                        </div>
                    </component>
                </div>

            </div>
        </Panel>
    </div>
</template>
