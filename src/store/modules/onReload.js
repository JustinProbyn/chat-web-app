// import firebase from "firebase";

const onReload = {
  state: {},
  mutations: {},
  actions: {
    onPageReload({ commit }) {
      //   firebase.auth().onAuthStateChanged((user) => {
      //     if (user) {
      // fetches theme (daymode or nightmode)
      const theme = localStorage.getItem("nightmode");
      if (!theme) {
        return;
      }
      if (theme == "nightmode") {
        commit("setNightMode");
      } else if (theme == "daymode") {
        commit("setDayMode");
      }
      //     } else if (!user) {
      //       return;
      //     }
      //   });
    }
  }
};

export default onReload;
