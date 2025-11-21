export const useAppStore = defineStore('app', () => {
  const userList = ref<Array<{ id: number; name: string; age: number }>>([])

  const setUserList = (users: Array<{ id: number; name: string; age: number }>) => {
    userList.value = users
  }

  return {
    userList,
    setUserList,
  }
})
