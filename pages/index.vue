<template>
  <div class="min-h-screen">
    <main class="space-y-8">
      <!-- 使用者操作框 -->
      <section
        class="max-w-640px min-h-360px flex flex-col items-center text-white mx-auto border border-coolGray rounded-2xl border-solid px-20"
      >
        <h2 class="text-2xl font-semibold mb-4">操作</h2>
        <div class="mb-6 w-full">
          <ETextField v-model:input-value="inputFormData.name" id="user-name" label="名字" />
        </div>

        <div class="w-full">
          <ETextField
            v-model:input-value="inputFormData.age"
            id="user-age"
            label="年齡"
            inputType="number"
          />
        </div>

        <div class="mt-10 flex space-x-4 ml-auto">
          <div class="w-18">
            <EBtn text="修改" />
          </div>

          <div class="w-18">
            <EBtn text="新增" color="warn" />
          </div>
        </div>
      </section>

      <!-- 用戶資料清單 -->
      <section
        class="max-w-640px min-h-360px flex py-4 flex-col items-center text-white mx-auto border border-coolGray rounded-2xl border-solid px-20"
      >
        <table>
          <thead class="text-18px">
            <tr>
              <th class="px-8 py-2">#</th>
              <th class="px-8 py-2">名字</th>
              <th class="px-8 py-2">年齡</th>
              <th class="px-8 py-2">操作</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(user, index) in userList" :key="user?.id || `user-${index}`">
              <tr class="text-center">
                <td class="px-8 py-2">{{ user.id }}</td>
                <td class="px-8 py-2">{{ user.name }}</td>
                <td class="px-8 py-2">{{ user.age }}</td>
                <td class="px-8 py-2 flex space-x-2">
                  <EBtn text="修改" />
                  <EBtn text="刪除" color="error" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store/app'
const appStore = useAppStore()

const { setUserList } = appStore
const { userList } = storeToRefs(appStore)

const baseUrl = 'https://2869.wu.elitepro.ltd' // 後端網址 將由面試官提供

const inputFormData = ref({
  name: '',
  age: null,
})

const {
  data: userData,
  error,
  refresh,
} = await useFetch(`${baseUrl}/api/user`, {
  key: 'fetch-user-data',
  onResponse({ response }) {
    console.log('fetch user data', response._data)
    if (response._data?.data && Array.isArray(response._data.data)) {
      setUserList(response._data.data)
    }
  },
  onResponseError({ response }) {
    console.error('Error fetching user data:', response.status, response._data)
  },
})
</script>

<style scoped lang="scss"></style>
