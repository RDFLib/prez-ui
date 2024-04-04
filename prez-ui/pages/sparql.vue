<script lang="ts" setup>
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

const config = useRuntimeConfig();

onMounted(() => {
    const yasgui = new Yasgui(document.getElementById("yasgui")!, {
        requestConfig: {
            endpoint: `${config.public.apiUrl}/sparql`,
            method: "GET"
        },
        copyEndpointOnNewTab: true,
        autofocus: true
    });
});
</script>

<template>
    <main>
        <h1>SPARQL</h1>
        <!-- <p>text</p> -->
        <div id="yasgui"></div>
    </main>
</template>

<style lang="scss" scoped>
.yasgui {
    .autocompleteWrapper { // disable endpoint selector
        display: none !important;
    }
}
</style>