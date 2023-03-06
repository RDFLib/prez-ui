<script lang="ts" setup>

</script>

<template>
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
            <button class="btn" type="submit">Search</button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.search-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button[type="submit"] {
        align-self: flex-start;
    }
}
</style>