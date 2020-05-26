import Vue from "vue";
import Vuex from "vuex";
import firestore from "./modules/firestore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    firestore
  }
});
