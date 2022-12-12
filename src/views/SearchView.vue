<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();

const enabledPrezs = inject("config").enabledPrezs;

onMounted(() => {
    ui.rightNavConfig = { enabled: false };
    document.title = "Search | Prez";
    ui.pageHeading = { name: "Prez", url: "/"};
    ui.breadcrumbs = [{ name: "Search", url: "/search" }];
});
</script>

<template>
    <h1>Search</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non dolore earum, vero corporis saepe iste, minus blanditiis tenetur amet corrupti id perferendis quos nisi est ducimus magnam voluptates repellat delectus!</p>
    <div id="search-container">
        <div v-if="enabledPrezs.includes('CatPrez')" class="search-type">
            <h2>Catalogue Search</h2>
            <form action="">
                <div class="search-form">
                    <input type="text" name="" id="" placeholder="Enter search term...">
                    <button type="submit">Search</button>
                </div>
            </form>
        </div>
        <div v-if="enabledPrezs.includes('SpacePrez')" class="search-type">
            <h2>Feature Search</h2>
            <form action="">
                <div class="search-form">
                    <input type="text" name="" id="" placeholder="Enter search term...">
                    <input type="text" name="" id="" placeholder="Enter search term...">
                    <select name="" id="" multiple>
                        <option value="">Something</option>
                    </select>
                    <select name="" id="" multiple>
                        <option value="">Something</option>
                    </select>
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                    <button type="submit">Search</button>
                </div>
            </form>
        </div>
        <div v-if="enabledPrezs.includes('VocPrez')" class="search-type">
            <h2>Concept Search</h2>
            <form action="">
                <div class="search-form">
                    <input type="text" name="" id="" placeholder="Enter search term...">
                    <select name="" id="" multiple>
                        <option value="">Something</option>
                    </select>
                    <button type="submit">Search</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#search-container {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .search-type {
        flex: 1;

        .search-form {
            display: flex;
            flex-direction: column;
            gap: 12px;

            input, select, textarea {
                padding: 6px;
            }

            button[type="submit"] {
                align-self: flex-start;
            }
        }
    }
}
</style>