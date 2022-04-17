import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"; // state持久化

export default createStore({
  plugins: [createPersistedState()], // state持久化
  state: {
    settings: {
      choice:{
        eigenvalueOpen: false,
        animationOpen: false,
      },
      Num: 150,
      Speed: 5,
      Flash: 100,
      FPS: "",
      Host:"rocke.top",
      Port:"12000",
    }
  },
  mutations: {
    setting_saveSettings(state, setting_info) {
      state.settings = setting_info
      // console.log(this.state.settings)
    },
    setting_eigenvalueOpen(state) {
      // console.log(state.settings.choice.eigenvalueOpen)
    },
    setting_animationOpen(state) {
      // console.log(state.settings.choice.animationOpen)
    }
  },
  actions: {
  },
  modules: {
  }
})
