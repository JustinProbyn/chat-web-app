import firebase from "firebase";

const firestore = {
  state: {},
  mutations: {},
  actions: {
    // Signs in with Firestore
    firestoreSignIn({ commit }, userData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(userData.email, userData.password)
        .catch(function(error) {
          alert(error.message);
        })
        .then(() => {
          firebase
            .firestore()
            .collection("userdata")
            .doc(userData.email)
            .get()
            .then((snapShot) => {
              commit("storeUsername", snapShot.data().username);
              localStorage.setItem("username", snapShot.data().username);
            });
        });
    },
    // Signs user up with Firestore
    firestoreSignUp({ commit }, userData) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(userData.email, userData.password)
        .then(() => {
          const fireStoreRef = firebase
            .firestore()
            .collection("userdata")
            .doc(userData.email);
          fireStoreRef.set({
            username: userData.username,
            email: userData.email,
            password: userData.password
          });
        })
        .catch(function(error) {
          alert(error.message);
        });
      commit("storeUsername", userData.username);
      localStorage.setItem("username", userData.username);
    },
    // Signs user out with Firestore
    firestoreSignOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          console.log("Sign-out successful.");
        })
        .catch(function(er) {
          console.log(er);
        });
      localStorage.removeItem("nightmode");
      localStorage.removeItem("username");
      commit("removeUserName");
    },

    /********************/
    // Adds each chat message of a specific user to their user profile on Firestore
    async addUserChatToFireStore(state, userChatData) {
      console.log(userChatData);
      const user = await firebase.auth().currentUser;
      const fireStoreRef = await firebase
        .firestore()
        .collection("userdata")
        .doc(user.email)
        .collection("chatLogs");
      fireStoreRef.add({
        userChatData
      });
    }
  }
};

export default firestore;
