<script lang="ts" setup>
import { CircleX, Info } from "lucide-vue-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageProps } from "@/types";

const props = defineProps<MessageProps>();
</script>

<template>
    <!-- Message -->
    <Alert :variant="props.severity === 'error' ? 'destructive' : 'default'" class="message">
        <CircleX v-if="props.severity === 'error'" class="w-4 h-4" />
        <Info v-else class="w-4 h-4" />
        <AlertTitle>{{ props.severity === "error" ? "Error" : "Message" }}</AlertTitle>
        <AlertDescription>{{ props.text }}</AlertDescription>
    </Alert>
</template>
