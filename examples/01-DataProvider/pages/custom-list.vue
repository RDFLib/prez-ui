<template>
    <PrezDataListProvider url="https://api.gswa.dev.kurrawong.ai/v/vocab">
        <template v-slot="{ data }">
            <CustomTest :data="data" />
        </template>
    </PrezDataListProvider>
</template>
