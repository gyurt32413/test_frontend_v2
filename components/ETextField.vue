<template>
  <div class="flex flex-col space-y-1 w-full">
    <label v-if="!isEmpty(label)" :for="props.id">{{ label }}</label>
    <input
      :id="props.id"
      :type="props.inputType"
      :value="props.inputValue"
      class="border-1px text-white border-gray-200 text-16px bg-transparent rounded px-2 py-2 outline-none appearance-none m-0 shadow-none"
      :class="isTextCenter ? 'text-center' : ''"
      @input="$emit('update:input-value', $event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

interface Props {
  id?: string // 若使用者有輸入，以使用者輸入的為主，若沒有請產出一個唯一 ID
  label?: string
  inputType?: string
  inputValue: string | number
  isTextCenter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'text',
  isTextCenter: false,
  id: () => uuidv4(),
})

const isEmpty = (value: string | undefined): boolean => {
  return !value || value.trim().length === 0
}
</script>

<style scoped lang="scss">
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
