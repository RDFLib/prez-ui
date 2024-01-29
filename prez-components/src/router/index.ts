import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BasicView from "../views/BasicView.vue";
import ListView from "../views/ListView.vue";
import ObjectView from "../views/ObjectView.vue";
import NavView from "../views/NavView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/basic",
            name: "basic",
            component: BasicView
        },
        {
            path: "/list",
            name: "list",
            component: ListView
        },
        {
            path: "/object",
            name: "object",
            component: ObjectView
        },
        {
            path: "/nav",
            name: "nav",
            component: NavView
        },
    ]
});

export default router;
