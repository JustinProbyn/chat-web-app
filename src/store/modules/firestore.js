import firebase from "firebase";
import router from "../../router";

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
    // Loads profile picture
    // Action also dispatched in 'onReload'
    async loadProfilePicture({ commit }) {
      const user = firebase.auth().currentUser;
      const picture = await firebase
        .firestore()
        .collection("userdata")
        .doc(user.email)
        .get();

      commit("setpProfilePicture", picture.data().profilePicture);
    },

    // Changes user's username

    changeUsernameOnFirestore({ commit }, username) {
      const user = firebase.auth().currentUser;
      console.log(username);
      const fireStoreUsernameRef = firebase
        .firestore()
        .collection("userdata")
        .doc(user.email);
      fireStoreUsernameRef
        .update({
          username: username
        })
        .catch(function(error) {
          alert(error.message);
        })
        .then(() => {
          const fireStoreRef = firebase
            .firestore()
            .collection("userdata")
            .doc(user.email)
            .collection("chatLogs");

          fireStoreRef.get().then((snapShot) => {
            snapShot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              fireStoreRef
                .doc(doc.id)
                .update({ "userChatData.username": username });
              router.go(0);
            });
          });
        });
      commit("storeUsername", username);
      localStorage.setItem("username", username);
    },

    /********************/
    // Adds chat message of a specific user to their user profile on Firestore
    addUserChatToFireStore(state, userChatData) {
      const user = firebase.auth().currentUser;
      const fireStoreRef = firebase
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
