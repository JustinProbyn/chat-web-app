// import firebase from "firebase";

const onReload = {
  state: {},
  mutations: {},
  actions: {
    onPageReload({ commit }) {
      /**** fetches theme (daymode or nightmode) and username ****/
      const theme = localStorage.getItem("nightmode");
      const username = localStorage.getItem("username");
      if (!theme) return;

      if (theme == "nightmode") {
        commit("setNightMode");
      } else if (theme == "daymode") {
        commit("setDayMode");
      }

      if (!username) return;
      if (username) {
        commit("storeUsername", username);
      }

      /**** fetches chat logs from firestore ****/
    }
  }
};

export default onReload;
