import { create } from 'zustand'

type Store = {
  userinfo: object
  setUserInfo: (userinfo: object) => void
}

const useStore = create<Store>()((set) => ({
  userinfo: localStorage.getItem("userinfo") || {},
  setUserInfo: (userinfo) => set({ userinfo }),
}))

export default useStore
