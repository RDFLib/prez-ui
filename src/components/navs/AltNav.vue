<script setup>
import { ref, watch, computed } from "vue";
import { RouterLink } from "vue-router";
// import { DataFactory } from "n3";
// import { useRdfStore } from "@/composables/rdfStore";

// const { namedNode } = DataFactory;

const mediatypeNames = {
    "text/html": "HTML",
    "application/json": "JSON",
    "application/ld+json": "JSON-LD",
    "text/turtle": "Turtle",
    "application/rdf+xml": "RDF/XML",
    "text/csv": "CSV",
    "application/geo+json": "GeoJSON"
};

// const { store, prefixes, parseIntoStore, qname, clearStore } = useRdfStore();

const props = defineProps({
    profiles: Array,
    currentUrl: String
});

// watch(() => props.profileData, (newData, oldData) => {
//     // clear profiles
//     clearStore();
//     profiles.value = [];

//     if (!!newData) {
//         parseIntoStore(newData);

//         store.value.forSubjects(subject => { // for each profile
//             let p = {
//                 uri: subject.id,
//                 mediatypes: []
//             };
//             store.value.forEach(q => { // get preds & objs for each subj
//                 if (q.predicate.value === qname("dcterms:title")) {
//                     p.title = q.object.value;
//                 } else if (q.predicate.value === qname("dcterms:identifier")) {
//                     p.id = q.object.value;
//                 } else if (q.predicate.value === qname("dcterms:description")) {
//                     p.description = q.object.value;
//                 } else if (q.predicate.value === qname("altr-ext:hasDefaultResourceFormat")) {
//                     p.defaultMediatype = q.object.value;
//                 } else if (q.predicate.value === qname("altr-ext:hasResourceFormat")) {
//                     p.mediatypes.push(q.object.value);
//                 }
//             }, subject, null, null);
//             profiles.value.push(p);
//         }, namedNode(qname("a")), namedNode(qname("prof:Profile")));
//     }
// });

const orderedProfiles = computed(() => {
    return !!props.profiles ? props.profiles.sort((a, b) => b.default - a.default) : [];
});
</script>

<template>
    <div>
        <RouterLink :to="`${props.currentUrl}?_profile=alt`"><h4>Alternate Profiles</h4></RouterLink>
        <p>View alternate views &amp; formats</p>
        <div id="profiles">
            <div v-for="profile in orderedProfiles" class="profile">
                <div><RouterLink :to="`${props.currentUrl}?_profile=${profile.token}`" class="profile-title"><h5>{{ profile.name }}</h5></RouterLink> <span v-if="profile.default" class="badge outline">default</span></div>
                <div class="mediatypes">
                    <RouterLink
                        v-for="mediatype in profile.mediatypes"
                        :to="`${props.currentUrl}?_profile=${profile.token}&_mediatype=${mediatype.mediatype}`"
                        class="mediatype"
                    >{{ mediatypeNames[mediatype.mediatype] }}</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

h4 {
    font-size: 1.1rem;
    margin: 0.6em 0;
}

p {
    margin: 0.6em 0;
    font-size: 0.9em;
}

#profiles {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .profile {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .profile-title {
            h5 {
                font-size: 1rem;
                margin: 0;
            }
        }
        .mediatypes {
            display: flex;
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;

            a.mediatype {
                padding: 6px;
                background-color: #55828b;
                color: white;
                border-radius: $borderRadius;
                font-size: 0.8rem;  
            }
        }
    }
}
</style>