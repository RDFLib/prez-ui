<script lang="ts" setup>
const props = defineProps<{
    limit: number;
}>();

const route = useRoute();

const limitOptions = ["5", "10", "20", "50", "100"];

function limitChange(limit: string) {
    navigateTo({
        path: route.path,
        query: {
            ...route.query,
            limit: limit,
        }
    });
}
</script>

<template>
    <div class="flex flex-row items-center justify-center gap-1 text-sm">
        Per page
        <Select @update:modelValue="limitChange" :defaultValue="props.limit.toString()">
            <SelectTrigger class="w-20">
                <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem v-for="option in limitOptions" :value="option">
                        {{ option }}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
</template>