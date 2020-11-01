import { createStore } from 'vuex'

export default createStore({
  state: {
    activeQuiz: {}
  },
  mutations: {
    activeQuiz (state, value) {
      state.activeQuiz = value
    }
  },
  actions: {

  },
  getters: {
    activeQuiz: (state, getters) => {
      return state.activeQuiz
    }
  }
})
