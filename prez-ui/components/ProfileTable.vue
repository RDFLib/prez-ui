<script lang="ts" setup>
import type { ProfileHeader } from "prez-lib";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const config = useRuntimeConfig();

const props = defineProps<{
    profiles: ProfileHeader[];
    path: string;
}>();
</script>

<template>
    <main>
        <h1>Alternate Profiles</h1>
        <DataTable :value="props.profiles" tableStyle="min-width: 50rem">
            <Column field="title" header="Title">
                <template #body="slotProps">
                    <NuxtLink :to="`/profiles/${slotProps.data.token}`" title="Go to profile page">{{ slotProps.data.title }}</NuxtLink>
                </template>
            </Column>
            <Column field="token" header="token">
                <template #body="slotProps">
                    <NuxtLink :to="`${props.path}?_profile=${slotProps.data.token}`" title="Get profile representation">{{ slotProps.data.token }}</NuxtLink>
                </template>
            </Column>
            <Column field="mediatypes" header="Formats">
                <template #body="slotProps">
                    <div class="mediatypes">
                        <a v-for="mediatype in slotProps.data.mediatypes" :href="`${config.public.apiUrl}${props.path}?_profile=${slotProps.data.token}&_mediatype=${mediatype.mediatype}`" target="_blank" rel="noopener noreferrer">
                            {{ mediatype.title || mediatype.mediatype }}
                        </a>
                    </div>
                </template>
            </Column>
            <Column field="description" header="Description"></Column>
            <Column field="uri" header="Namespace">
                <template #body="slotProps">
                    <a :href="slotProps.data.uri" target="_blank" rel="noopener noreferrer">{{ slotProps.data.uri }}</a>
                </template>
            </Column>
        </DataTable>
    </main>
</template>

<style lang="scss" scoped>
.mediatypes {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>