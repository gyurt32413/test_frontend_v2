<template>
  <div class="min-h-screen">
    <main class="space-y-8">
      <!-- 使用者操作框 -->
      <section
        class="max-w-640px min-h-360px flex flex-col items-center text-white mx-auto border border-coolGray rounded-2xl border-solid px-20"
      >
        <div class="text-2xl font-semibold mb-4">操作</div>
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
            <EBtn
              text="新增"
              color="warn"
              @click="addUser(inputFormData.name, inputFormData.age)"
            />
          </div>
        </div>
      </section>

      <!-- 用戶資料清單 -->
      <section
        class="max-w-640px min-h-360px flex py-4 flex-col items-center text-white mx-auto border border-coolGray rounded-2xl border-solid px-10"
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
                <td class="px-8 py-2 align-middle">{{ user.id }}</td>
                <td class="px-8 py-2 align-middle">
                  <div v-if="currentEditUserId === user.id" class="w-24">
                    <ETextField v-model:input-value="editedFormData.name" :is-text-center="true" />
                  </div>
                  <div class="w-24" v-else>{{ user.name }}</div>
                </td>
                <td class="px-8 py-2 align-middle">
                  <div v-if="currentEditUserId === user.id" class="w-10">
                    <ETextField v-model:input-value="editedFormData.age" :is-text-center="true" />
                  </div>
                  <div class="w-10" v-else>{{ user.age }}</div>
                </td>
                <td class="px-8 py-2 align-middle">
                  <div class="flex space-x-2 justify-center">
                    <template v-if="currentEditUserId === user.id">
                      <EBtn text="儲存" @click="openDialog" />
                      <EBtn text="取消" color="warn" @click="cancelEdit" />
                    </template>

                    <template v-else>
                      <EBtn text="修改" @click="handleModifyUser(user.id)" />
                      <EBtn text="刪除" color="error" @click="deleteUser(user.id)" />
                    </template>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </section>
    </main>

    <div>{{ isDialogOpen }}</div>

    <dialog ref="dialogRef" class="rounded-lg space-y-4 text-center p-8 bg-gray-800 text-white">
      <div class="text-18px">確認是否進行以下修改?</div>

      <div>
        <div>#{{ editedFormData.id }}</div>
        <div>名字：{{ editedFormData.name }}</div>
        <div>年齡：{{ editedFormData.age }}</div>
      </div>

      <div class="flex space-x-2">
        <EBtn text="取消" color="warn" @click="cancelEdit" />
        <EBtn text="確認修改" />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useAppStore } from '~/store/app'
const appStore = useAppStore()

const { setUserList } = appStore
const { userList } = storeToRefs(appStore)

const baseUrl = 'https://2869.wu.elitepro.ltd' // 後端網址 將由面試官提供

// Dialog 控制
const dialogRef = ref<HTMLDialogElement | null>(null)
const isDialogOpen = ref(false)

const openDialog = () => {
  dialogRef.value?.showModal()
  isDialogOpen.value = true
}

const closeDialog = () => {
  dialogRef.value?.close()
  isDialogOpen.value = false
}

watchEffect(() => {
  dialogRef.value?.addEventListener('close', () => {
    isDialogOpen.value = false
  })
})

const inputFormData = ref({
  name: '',
  age: '' as number | string,
})

const errorMessage = ref({
  name: '',
  age: '',
})

// === 編輯使用者相關 ===
const currentEditUserId = ref<number | null>(null)
const editedFormData = ref({
  id: 0,
  name: '',
  age: '' as number | string,
})

const setCurrentEditUserId = (userId: number | null) => {
  currentEditUserId.value = userId
}

const setEditedFormData = (data: { id: number; name: string; age: number | string }) => {
  editedFormData.value = { id: data.id, name: data.name, age: data.age }
}

const useCloner = <T,>(data: T): T => {
  return JSON.parse(JSON.stringify(data))
}

const handleModifyUser = (userId: number) => {
  const cloneData = useCloner(userList.value.find((user) => user.id === userId))
  if (cloneData) {
    setCurrentEditUserId(userId)
    setEditedFormData({
      id: userId,
      name: cloneData.name,
      age: cloneData.age,
    })
  } else {
    console.error('User not found for modification')
    return
  }
}

const cancelEdit = () => {
  setCurrentEditUserId(null)
  closeDialog()
}
// === 編輯使用者相關 end ===

const validateInputName = (): boolean => {
  return inputFormData.value.name.trim().length > 0
}

const validateInputAge = (): boolean => {
  const ageNumber = Number(inputFormData.value.age)
  return !isNaN(ageNumber) && ageNumber > 0 && Number.isInteger(ageNumber)
}

const addUser = async (name: string, age: number | string) => {
  try {
    const params = {
      name,
      age: Number(age),
    }

    const response = await axios.post(`${baseUrl}/api/user`, params)

    console.log('add user response', response)

    if (response.data && response.data.data) {
      const newUser = {
        id: response.data.data.id,
        name,
        age: Number(age),
      }

      // 新增成功後，更新使用者清單
      setUserList([...userList.value, newUser])
      // 清空輸入欄位
      inputFormData.value.name = ''
      inputFormData.value.age = ''
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

const deleteUser = async (userId: number) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/user`, {
      data: {
        id: userId,
      },
    })

    console.log('delete user response', response)

    if (response.status === 200) {
      // 刪除成功後，更新使用者清單
      const updatedUserList = userList.value.filter((user) => user.id !== userId)
      setUserList(updatedUserList)
      console.log('User deleted successfully', userList.value)
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const modifyUser = async (userId: number, name: string, age: number | string) => {
  try {
    const params = {
      id: userId,
      name,
      age: Number(age),
    }

    const response = await axios.put(`${baseUrl}/api/user`, params)

    if (response.status === 200) {
      // 修改成功後，更新使用者清單
      const updatedUserList = userList.value.map((user) =>
        user.id === userId ? { ...user, name, age: Number(age) } : user
      )
      setUserList(updatedUserList)
    }
  } catch (error) {
    console.error('Error modifying user:', error)
  }
}

// SSR 取得使用者清單
const { data: userData, error } = await useFetch(`${baseUrl}/api/user`, {
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
