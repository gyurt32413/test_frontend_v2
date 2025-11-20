<template>
  <div class="min-h-screen">
    <main>
      <!-- 使用者操作框 -->
      <section
        class="max-w-640px min-h-360px flex flex-col items-center text-white mx-auto border border-coolGray rounded-2xl border-solid px-40"
      >
        <h2 class="text-2xl font-semibold mb-4">操作</h2>
        <div class="mb-6 w-full">
          <ETextField v-model:input-value="formData.name" id="user-name" label="名字" />
        </div>

        <div class="w-full">
          <ETextField
            v-model:input-value="formData.age"
            id="user-age"
            label="年齡"
            inputType="number"
          />
        </div>

        <div class="mt-10 space-x-4 ml-auto">
          <EBtn text="修改" />
          <EBtn text="新增" color="warn" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const baseUrl = 'https://2869.wu.elitepro.ltd' // 後端網址 將由面試官提供

const formData = ref({
  name: '',
  age: null,
})
</script>

<style scoped lang="scss"></style>
