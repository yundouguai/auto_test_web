import {createStore} from 'vuex'

export default createStore({
    state: {
      dialogLogin: false,
    },
    mutations: {
      setTokenExpired(state, value) {
        state.dialogLogin = value;
      },
    },
  });