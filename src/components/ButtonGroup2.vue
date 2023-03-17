<template>
    <div class="button-container">
      <div v-for="(button, index) in buttons" :key="index" @click="selectButton(index)" class="btn sm" :class="{ outline: !isSelected(index) }">
        {{ button.text }}
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, type PropType, computed, defineProps, defineEmits } from 'vue'
  
  type Button = {
    text: string
    value: any
  }
  
  const props = defineProps({
    buttons: {
      type: Array as PropType<Button[]>,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: null
    }
  })
  
  const selectedButtons = ref<number[]>([])
  
  function selectButton(index: number) {
    if (props.multiple) {
      const isSelected = isSelected(index)
  
      if (isSelected) {
        selectedButtons.value = selectedButtons.value.filter(i => i !== index)
      } else {
        selectedButtons.value.push(index)
      }
    } else {
      selectedButtons.value = [index]
    }
    if (!props.multiple) {
      emit('update:value', props.buttons[selectedButtons.value[0]].value)
    } else {
      emit('update:value', selectedButtons.value.map(i => props.buttons[i].value))
    }
  }
  
  function isSelected(index: number) {
    return selectedButtons.value.includes(index)
  }
  
  const selectedValues = computed(() => {
    return selectedButtons.value.map(index => props.buttons[index].value)
  })
  
  const emit = defineEmits(['update:value'])
  
  // initialize the selected buttons based on the default value prop
  if (props.value !== null && !props.multiple) {
    const index = props.buttons.findIndex(button => button.value === props.value)
    selectedButtons.value = index !== -1 ? [index] : []
  } else if (Array.isArray(props.value)) {
    selectedButtons.value = props.buttons.reduce((acc, button, index) => {
      if (props.value.includes(button.value)) {
        acc.push(index)
      }
      return acc
    }, [])
  }
  
  </script>
  
  <style scoped>
  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; /* center the buttons horizontally */
    gap: 10px; /* set the spacing between the buttons */
  }
  </style>
  