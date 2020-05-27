import Vue from "vue";
import Vuex from "vuex";
import firestore from "./modules/firestore";
import onReload from "./modules/onReload";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nightMode: false,
    currentUserEmail: "",
    currentUserName: "",
    chatLogs: []
  },
  mutations: {
    /******Username mutations**********/
    storeCurrentUserEmail(state, email) {
      state.currentUserEmail = email;
    },
    storeUsername(state, username) {
      state.currentUserName = username;
    },
    removeUserName(state) {
      state.currentUserName = "";
    },
    /********Chat mutations**********/
    storeChatLogsInState(state, chatLogs) {
      state.chatLogs.push(chatLogs);
    },

    /********Theme mutations**********/
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
    /********Chat Actions**********/
    storeChatLogsInState({ commit }, chatLogs) {
      commit("storeChatLogsInState", chatLogs);
    },
    storeUserEmail({ commit }, email) {
      commit("storeCurrentUserEmail", email); //this action is dispatched under main.js
    },
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
    },
    getCurrentUserName(state) {
      return state.currentUserName;
    },
    getChatLogs(state) {
      return state.chatLogs;
    }
  },
  modules: {
    firestore,
    onReload
  }
});
