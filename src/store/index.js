import Vue from "vue";
import Vuex from "vuex";
import firestore from "./modules/firestore";
import onReload from "./modules/onReload";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nightMode: false
  },
  mutations: {
    setNightMode(state) {
      localStorage.setItem("nightmode", "nightmode");
      state.nightMode = true;
    },
    setDayMode(state) {
      localStorage.setItem("nightmode", "daymode");
      state.nightMode = false;
    }
  },
  actions: {
    nightMode({ commit }) {
      commit("setNightMode");
    },
    dayMode({ commit }) {
      commit("setDayMode");
    }
  },
  getters: {
    getTheme(state) {
      return state.nightMode;
    }
  },
  modules: {
    firestore,
    onReload
  }
});
