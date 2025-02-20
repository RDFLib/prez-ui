<script lang="ts" setup>
import { File, Eye, Download } from "lucide-vue-next";
import { ItemProfilesProps } from "@/types";
import ItemLink from "./ItemLink.vue";
import Loading from "./Loading.vue";
import { RouterLink } from "vue-router";
import { Button } from "./ui/button";

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
    <div class="item-profiles ml-0 pt-2 border-l pl-4 pb-4 sticky top-0">
        <div>
            <h3 class="text-xl mb-3">
                <RouterLink :to="`?${uriComponent}_profile=altr-ext:alt-profile`">
                    Alternate Profiles
                </RouterLink>
                <p class="text-sm">View alternate views &amp; formats</p>
            </h3>

            <Loading v-if="props.loading" variant="concept" class="mt-4" />

            <div v-else-if="props.profiles" class="flex flex-col gap-5">
                <div v-for="profile in props.profiles.sort((a, b) => a.title.localeCompare(b.title))" :key="profile.token" class="">
                    <div :class="`inline-flex gap-2 items-center ${profile.current ? 'font-bold' : ''}`">
                        <div v-if="profile.current" class="text-sm text-muted-foreground" title="Current profile"><Eye class="w-4 h-4" /></div>
                        <RouterLink :to="`?${uriComponent}_profile=${profile.token}`" title="Get profile representation">
                            {{ profile.title }}
                        </RouterLink>
                        <RouterLink :to="`/profiles/${profile.token}`" title="Go to profile page">
                            <File class="w-4 h-4" />
                        </RouterLink>
                    </div>
                    <!-- <div v-if="profile.default" class="text-sm text-muted">(default)</div> -->
                    <ul class="text-sm flex flex-row flex-wrap gap-2 mt-2">
                        <li v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                            <Button variant="outline" size="sm" class="py-0 px-2" as-child>
                                <a
                                    :href="`${apiUrl}?${uriComponent}_profile=${encodeURIComponent(profile.token)}&_mediatype=${encodeURIComponent(mediatype.mediatype)}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}
                                    <Download class="h-3 w-3" />
                                </a>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
