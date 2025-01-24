<script lang="ts" setup>
import { File } from "lucide-vue-next";
import { ItemProfilesProps } from "@/types";
import ItemLink from "./ItemLink.vue";
import Loading from "./Loading.vue";

const props = withDefaults(defineProps<ItemProfilesProps>(), {
    _components: () => {
        return {
            itemLink: ItemLink,
            loading: Loading,
        }
    }
});

const uriComponent = props.objectUri ? `uri=${encodeURIComponent(props.objectUri)}&` : '';
</script>

<template>
    <!-- ItemProfiles -->
    <div id="profile-nav" class="ml-0 pt-4 border-l pl-10 pb-10">
        <div>
            <div class="text-xl">
                <component :is="props._components.itemLink" :to="`?${uriComponent}_profile=altr-ext:alt-profile`">
                    Alternate Profiles
                </component>
                <p class="text-sm">View alternate views &amp; formats</p>
            </div>

            <Loading v-if="props.loading" variant="concept" class="mt-4" />

            <div v-else-if="props.profiles">
                <div v-for="profile in props.profiles.sort((a, b) => a.title.localeCompare(b.title))" :key="profile.token" class="mb-4">
                    <div class="pt-2">
                        <div :class="`inline-flex gap-1 items-center ${profile.current ? 'text-bold' : ''}`">
                            <span class="mr-1">
                                <component :is="props._components.itemLink" :to="`/profiles/${profile.token}`" variant="item-profiles" title="Go to profile page">
                                    <File class="w-4 h-4" />
                                </component>
                            </span>
                            <component :is="props._components.itemLink" :to="`?${uriComponent}_profile=${profile.token}`" title="Get profile representation" variant="item-profiles">
                                <span class="text-sm">{{ profile.title }}</span>
                            </component>
                        </div>
                        <div v-if="profile.current" class="text-sm text-bold text-primary">(currently viewing)</div>
                        <ul class="text-sm">
                            <li class="mediatypes" v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                                - <component
                                    :is="props._components.itemLink"
                                    :to="`${apiUrl}?${uriComponent}_profile=${encodeURIComponent(profile.token)}&_mediatype=${encodeURIComponent(mediatype.mediatype)}`"
                                    variant="item-profiles"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span class="font-normal">{{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}</span>
                                </component>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
