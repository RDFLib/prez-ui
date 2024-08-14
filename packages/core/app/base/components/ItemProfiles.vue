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
    <div id="profile-nav">
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

            <div v-else>
                <SelectButton class="" v-model="profileSelected" :options="props.profiles" aria-labelledby="multiple" option-label="title">
                    <template #option="{option}">
                        <div class="text-xs">
                            {{ option.title }}&nbsp;
                            <i v-if="option.current" title="Currently viewing this profile" class="text-xs pi pi-circle-fill"></i>
                            <ItemLink v-else :to="`?_profile=${option.token}`" title="Get profile representation">
                                <i class="text-xs pi pi-circle hover:text-red-500"></i>
                            </ItemLink>
                        </div>
                    </template>
                </SelectButton>
                <div class="pt-4" v-if="profileSelected">
                    <div class="mediatypes pt-2" v-for="mediatype in profileSelected.mediatypes" :key="mediatype.mediatype">
                        <Tag class="text-xs font-normal" severity="info">
                        <ItemLink :to="`?_profile=${profileSelected.token}&_mediatype=${mediatype.mediatype}`" target="_blank" rel="noopener noreferrer">
                            <span class="font-normal">{{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}</span>
                        </ItemLink>
                        </Tag>
                    </div>
                </div>
            </div>
            <!-- <Accordion multiple :value="profileItems">
                <AccordionPanel :value="pidx" v-for="(profile, pidx) in props.profiles" :key="profile.token" class="profile">
                    <AccordionHeader>
                        <div :class="profile.current ? 'text-bold' : ''">
                            <ItemLink :to="`?_profile=${profile.token}`" title="Get profile representation">{{ profile.title }}</ItemLink>
                            <ItemLink :to="`/profiles/${profile.token}`" title="Go to profile page"><Button size="small" text icon="pi pi-file" /></ItemLink>                        
                        </div>
                    </AccordionHeader>
                    <AccordionContent>
                        <div class="flex flex-row flex-wrap gap-1.5 text-xs">
                            <div class="mediatypes" v-for="mediatype in profile.mediatypes" :key="mediatype.mediatype">
                                <Tag class="text-xs font-normal">
                                <ItemLink :to="`?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`" target="_blank" rel="noopener noreferrer">
                                    <span class="font-normal">{{ mediatype.title || mediatype.mediatype.replace(/^.*\//, '') }}</span>
                                </ItemLink>
                                </Tag>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion> -->
        </Panel>
    </div>
</template>
