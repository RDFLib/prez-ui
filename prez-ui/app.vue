<script lang="ts" setup>
// import Breadcrumb from "primevue/breadcrumb";
import PrezUINav from "./components/PrezUINav.vue";

const config = useRuntimeConfig();
const route = useRoute();

// const home = {
//     icon: "pi pi-home",
//     route: "/"
// };

// const breadcrumbs = ref<{ label: string; route: string; }[]>([]);

// watch(() => route.fullPath, () => {
//     // if (newValue !== oldValue) {
//         if (route.path !== "/") {
//             const items = route.path.split("/").slice(1).map(segment => {
//                 return {
//                     label: segment,
//                     route: route.path.split(segment)[0] + "/" + segment
//                 }
//             });

//             if (route.params?._profile === "altr-ext:alt-profile") {
//                 items.push({
//                     label: "Alternate Profiles",
//                     route: route.fullPath
//                 });
//             }

//             breadcrumbs.value = items;
//         } else {
//             breadcrumbs.value = [];
//         }
//     // }
// }, { immediate: true });
</script>

<template>
    <header>
        <div id="header-content"><h2>Prez</h2></div>
        <div id="header-bar"></div>
    </header>
    <div id="container" :class="config.public.sidenav ? 'row' : 'col'">
        <PrezUINav :sidenav="config.public.sidenav" />
        <div id="content">
            <!-- <Breadcrumb :home="home" :model="breadcrumbs" /> -->
            <NuxtPage :pageKey="route.fullPath" />
        </div>
    </div>
    <footer>
        <div id="footer-content"></div>
        <div id="footer-bar">Prez UI v4.0.0-alpha</div>
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
    padding: 12px;
}
</style>

<style lang="scss" scoped>
$headerBg: white;
$footerBg: white;
// $pageMaxWidth: 1200px;

header {
    display: flex;
    flex-direction: column;
    background-color: $headerBg;

    #header-content {
        padding: 12px;

        h2 {
            margin: 0;
        }
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

    &.row {
        flex-direction: row;
    }

    &.col {
        flex-direction: column;
    }

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
        // padding: 12px;
    }

    #footer-bar {
        padding: 12px;
        border-top: 1px solid grey;
    }
}
</style>