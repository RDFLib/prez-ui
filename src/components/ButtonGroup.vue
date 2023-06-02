<template>
  <div class="button-container">
    <div v-for="(button, index) in buttons" :key="index" @click="selectButton(index)" class="btn sm" :class="{ outline: !selectedButtons.includes(index) }">
      {{ button.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType, computed, defineEmits, watch } from 'vue'

type Button = {
  text: string
  value: any
}

const props = defineProps({
  buttons: {
    type: Array as PropType<Button[]>,
    required: true
  },
  allowMultipleSelection: {
    type: Boolean,
    default: false
  },
  initialValue: {
    type: String,
    default: null
  }
})

const selectedButtons = ref<number[]>([])

function selectButton(index: number) {
  if (props.allowMultipleSelection) {
    const isSelected = selectedButtons.value.includes(index)

    if (isSelected) {
      selectedButtons.value = selectedButtons.value.filter(i => i !== index)
    } else {
      selectedButtons.value.push(index)
    }
  } else {
    selectedButtons.value = [index]
  }

  emit('change', selectedValues.value)
}

const selectedValues = computed(() => {
  return selectedButtons.value.map(index => props.buttons[index].value)
})

const emit = defineEmits(['change'])

if (props.initialValue) {
  const initialValueIndex = props.buttons.findIndex(button => button.value === props.initialValue)
  if (initialValueIndex >= 0) {
    selectedButtons.value.push(initialValueIndex)
  }
}

watch(() => props.initialValue, (newValue, oldValue) => {
  if(newValue == '') {
    return
  }
  const selectedIndex = props.buttons.findIndex(button => button.value == newValue)
  const selectedValue = (selectedIndex >= 0 ? props.buttons[selectedIndex] : '')
  if (newValue !== oldValue || newValue != selectedValue) {
    const newSelectedIndex = props.buttons.findIndex(button => button.value === newValue)
    if (newSelectedIndex >= 0) {
      selectedButtons.value = [newSelectedIndex]
    }
  }
})
</script>

<style scoped>
.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* center the buttons horizontally */
  gap: 10px; /* set the spacing between the buttons */
}
</style>
