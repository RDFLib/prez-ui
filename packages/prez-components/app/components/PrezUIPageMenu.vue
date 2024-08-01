<script setup lang="ts">
import { ref } from 'vue';
import PrezUILink from './PrezUILink.vue';

import menu from '../menu.json';

//const appConfig = useAppConfig();
//const menu = appConfig.menu as MenuItem[];

type MenuItem = {
    label: string
    items?: MenuItem[]
    separator: boolean;
    icon?: string
    url?: string
    target?: string
}

const items = ref(menu as MenuItem[]);

</script>
<template>
    <ul class="pz-page-menu">
        <li v-for="(item, index) in items" :key="index">
            <PrezUILink :to="item.url" :target="item.target">{{ item.label }}</PrezUILink>
            <hr v-if="item.separator">
            <ul v-if="item.items">
                <li v-for="(subItem, subIndex) in item.items" :key="subIndex">
                    <PrezUILink :to="subItem.url" :target="subItem.target">{{ subItem.label }}</PrezUILink>
                    <hr v-if="subItem.separator">
                    <ul v-if="'items' in subItem">
                        <li v-for="(subsubItem, subsubIndex) in subItem.items" :key="subsubIndex">
                            <PrezUILink :to="subsubItem.url" :target="subsubItem.target">{{ subsubItem.label }}
                            </PrezUILink>
                            <hr v-if="subsubItem.separator">
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>
<style lang="scss" scoped>

ul.pz-page-menu {
    font-size:larger;
}

ul.pz-page-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex; /* Display items horizontally */
}

ul.pz-page-menu > li:hover {
    cursor: pointer;
}

ul.pz-page-menu > li {
  padding: 10px;
  margin: 0;
  position: relative; /* Ensure submenu position is relative to li */
  display: block;
}

ul.pz-page-menu > li > ul {
  display: none; /* Hide submenus by default */
  position: absolute;
  top: 100%;
  left: 0px;
  padding-bottom:20px;
  padding-left:10px;
  background-color: #fff; /* Optional: Background color for submenus */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* Optional: Box shadow for submenus */
  padding: 10px 0; /* Adjust padding as necessary */
  z-index: 1000;
}

ul.pz-page-menu > li:hover > ul {
  display: block; /* Display submenu when hovering over li */
}

ul.pz-page-menu li:hover {
    background-color: #eee;
}

ul.pz-page-menu > li > ul > li {
  padding: 10px;
  margin: 0;
  display: block;
}
</style>
