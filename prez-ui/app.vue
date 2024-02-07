<script lang="ts" setup>
import PrezUINav from "./components/PrezUINav.vue";
</script>

<template>
    <header>
        <div id="header-content">header</div>
        <div id="header-bar">
            <div>nav teleport on mobile</div>
            <div>header content on mobile (replace on search click)</div>
            <div>search button & alt nav teleport on mobile</div>
        </div>
    </header>
    <div id="container">
        <PrezUINav />
        <div id="content">
            <NuxtPage />
        </div>
    </div>
    <footer>
        <div id="footer-content">footer</div>
        <div id="footer-bar">prez versions &amp; info</div>
    </footer>
</template>

<style lang="scss">
body, html {
    height: 100vh;
    margin: 0;
}

#__nuxt {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>

<style lang="scss" scoped>
$headerBg: darkblue;
$footerBg: #3a3a3a;
// $pageMaxWidth: 1200px;

header {
    display: flex;
    flex-direction: column;
    background-color: $headerBg;

    #header-content {
    
    }

    #header-bar {
        display: flex;
        flex-direction: row;
    }
}

#container {
    display: flex;
    flex-grow: 1;
    // max-width: $pageMaxWidth;
    // margin: 0 auto;

    #content {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
    }
}

footer {
    display: flex;
    flex-direction: column;
    background-color: $footerBg;

    #footer-content {

    }

    #footer-bar {
        border-top: 1px solid grey;
    }
}
</style>