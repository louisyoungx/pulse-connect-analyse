import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"; // state持久化

export default createStore({
  plugins: [createPersistedState()], // state持久化
  state: {
    settings: {
      Host:"rocke.top",
      Port:"12000",
      Width: 150,
      Number: 1,
      Flash: 80,
      FPS: 0,
      choice:{
        eigenvalueOpen: false,
        animationOpen: false,
      },
      eigenvalueType: "triangle", // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
      eigenvalueSize: 10,
    },
    recording: []
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
    },
    recording_save(state, {recordingData, startTime, endTime}) {
      state.recording.unshift({
        name: new Date().toLocaleString(),
        record: recordingData,
        startTime: startTime,
        endTime: endTime
      })
    },
    recording_delete(state, index) {
      state.recording = [...state.recording.slice(0, index), ...state.recording.slice(index + 1)]
    }
  },
  actions: {
  },
  modules: {
  }
})
