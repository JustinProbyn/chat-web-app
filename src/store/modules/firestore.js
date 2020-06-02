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
      localStorage.removeItem("username");
      commit("removeUserName");
    },

    // Change user profile pic
    // Uploads image to Firestore storage
    submitPicture({ dispatch }, imageData) {
      console.log(imageData);
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child("profileImages/" + imageData.name);

      imageRef.put(imageData).then(() => {
        imageRef
          .getDownloadURL()
          .then((url) => {
            dispatch("storePictureData", url);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    // Stores picture details on Firestore under userData
    storePictureData({ dispatch }, url) {
      const user = firebase.auth().currentUser;
      const fireStoreRef = firebase
        .firestore()
        .collection("userdata")
        .doc(user.email);
      fireStoreRef
        .update({
          profilePicture: url
        })
        .then(function() {
          dispatch("loadProfilePicture");
          console.log("Profile picture successfully updated!");
        })
        .catch(function(error) {
          console.error("Error adding picture: ", error);
        });
    },
    // Action also dispatched in 'onReload'
    async loadProfilePicture({ commit }) {
      const user = firebase.auth().currentUser;
      console.log(user);
      const picture = await firebase
        .firestore()
        .collection("userdata")
        .doc(user.email)
        .get();

      commit("setpProfilePicture", picture.data().profilePicture);
    },

    /********************/
    // Adds each chat message of a specific user to their user profile on Firestore
    async addUserChatToFireStore(state, userChatData) {
      const user = await firebase.auth().currentUser;
      const fireStoreRef = await firebase
        .firestore()
        .collection("userdata")
        .doc(user.email)
        .collection("chatLogs");
      fireStoreRef.add({
        userChatData
      });
    },

    // Loads chat logs from Firestore on page load and refresh
    loadChatLogs() {
      let chatData = [];
      firebase.auth().onAuthStateChanged((user) => {
        if (user && this.getChatLogs != []) {
          const fireStoreRef = firebase.firestore().collection("userdata");
          fireStoreRef.onSnapshot((snapShot) => {
            snapShot.forEach((doc) => {
              const userEmail = doc.data().email;
              const fireStoreRef = firebase
                .firestore()
                .collection("userdata")
                .doc(userEmail)
                .collection("chatLogs");
              fireStoreRef.get().then((snapShot) => {
                snapShot.forEach((doc) => {
                  chatData.push(doc.data().userChatData);
                });
              });
            });
          });
          this.$store.dispatch("storeChatLogsInState", chatData);
          console.log(chatData);
        }
      });
    }
  }
};

export default firestore;
