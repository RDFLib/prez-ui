<script lang="ts" setup>
import { File, Eye, Download } from "lucide-vue-next";
import { ItemProfilesProps } from "@/types";
import ItemLink from "./ItemLink.vue";
import Loading from "./Loading.vue";
import { RouterLink } from "vue-router";
import { Badge } from "./ui/badge";

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
            <h3 class="text-xl">
                <RouterLink :to="`?${uriComponent}_profile=altr-ext:alt-profile`">
                    Alternate Profiles
                </RouterLink>
            </h3>
	        <span class="text-sm">View alternate views &amp; formats</span>

            <Loading v-if="props.loading" variant="concept" class="mt-4" />

            <div v-else-if="props.profiles" class="flex flex-col gap-5 mt-4">
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
<!--	                <Badge v-if="profile.default" variant="outline" class="text-sm text-muted">(default)</Badge>-->
                    <ul class="text-sm flex flex-row flex-wrap gap-2 mt-2">
                        <li v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                            <Badge variant="outline" class="!text-foreground !hover:no-underline" as-child>
                                <a
                                    :href="`${apiUrl}?${uriComponent}_profile=${encodeURIComponent(profile.token)}&_mediatype=${encodeURIComponent(mediatype.mediatype)}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}
                                    <Download class="h-3 w-3" />
                                </a>
                            </Badge>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
