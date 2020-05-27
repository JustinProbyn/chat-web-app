import firebase from "firebase";

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
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const fireStoreRef = firebase
            .firestore()
            .collection("userdata")
            .doc(user.email)
            .collection("chatLogs");
          fireStoreRef.get().then((snapShot) => {
            snapShot.forEach((doc) => {
              const chatData = doc.data().userChatData;
              commit("storeChatLogsInState", chatData);

              // this.$store.dispatch("loadChatMsgs", chatData);
            });
          });
        }
      });
    }
  }
};

export default onReload;
