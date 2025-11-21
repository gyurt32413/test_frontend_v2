<template>
  <button class="w-full font-semibold h-9 text-16px cursor-pointer border-none rounded-md" :class="`e-btn-${props.color || 'success'}`">
    <template v-if="props.text">{{ props.text }}</template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style scoped lang="scss">
.e-btn {
  // success 綠
  &-success {
    background-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
    }

    &:active {
      background-color: #1e7e34;
    }
  }

  // error 紅
  &-error {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }

    &:active {
      background-color: #bd2130;
    }
  }

  // warn 黃
  &-warn {
    background-color: #ffc107;
    color: black;

    &:hover {
      background-color: #e0a800;
    }

    &:active {
      background-color: #c69500;
    }
  }
}
</style>
