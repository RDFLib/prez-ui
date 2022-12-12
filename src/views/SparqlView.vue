<script lang="ts" setup>
import { nextTick, onMounted } from "vue";
import Yasqe from "@triply/yasqe";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "SPARQL | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "SPARQL", url: "/sparql" }];

    nextTick(() => {
        const yasqe = new Yasqe(document.getElementById("yasqe"), {
            showQueryButton: true,
            resizeable: false,
            createShareableLink: null,
            persistenceId: null
        });
    });
});
</script>

<template>
    <h1>SPARQL Endpoint</h1>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur maiores voluptate quibusdam. Earum nostrum
        ipsum, quas eos quidem deserunt expedita illo labore amet ipsam molestiae officia veritatis recusandae, quo
        magnam?</p>
    <h2>Interactive UI</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, assumenda. Natus vero nostrum velit, eius iusto
        cupiditate alias quidem in dolorem suscipit veritatis magnam minima. Eveniet quisquam similique molestiae
        dolorum.</p>
    <div id="yasqe"></div>
    
    <h2>Example Queries</h2>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia quo, maiores saepe alias consectetur
        accusantium ipsum architecto impedit sed temporibus, ipsam commodi enim vitae porro! Deleniti numquam facilis
        distinctio doloribus.</p>
</template>

<style lang="scss" scoped>

</style>