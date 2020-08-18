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
    profilePicture: "",
    chatLogs: []
  },
  mutations: {
    /******User mutations**********/
    storeCurrentUserEmail(state, email) {
      state.currentUserEmail = email;
    },
    storeUsername(state, username) {
      state.currentUserName = username;
    },
    removeUserName(state) {
      state.currentUserName = "";
    },
    setpProfilePicture(state, url) {
      state.profilePicture = url;
    },
    /********Chat mutations**********/
    storeChatLogsInState(state, chatLog) {
      // const chatLogs = {
      //   username: chatData.username,
      //   chat: chatData.chat,
      //   date: chatData.date,
      //   dateMilSec: chatData.dateMilSec,
      //   profilePicture: chatData.profilePicture
      // };
      state.chatLogs.push(chatLog);
      console.log(state.chatLogs);
    },
    clearLogs(state) {
      state.chatLogs = [];
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
    clearChatLogs({ commit }) {
      commit("clearLogs");
    },
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
    },
    getProfilePicture(state) {
      return state.profilePicture;
    }
  },
  modules: {
    firestore,
    onReload
  }
});
