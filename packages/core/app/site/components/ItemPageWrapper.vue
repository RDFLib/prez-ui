<script lang="ts" setup>
/** this component wraps the item page to check for the special case where the list of alt profiles are requested, 
 * in which case we need to render the list page component */
const route = useRoute();
</script>
<template>
    <ItemPage v-if="route.query._profile != 'altr-ext:alt-profile'" />
    <ListPage v-else />
</template>
