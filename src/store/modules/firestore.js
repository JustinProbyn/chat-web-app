import firebase from "firebase";
import router from "../../router";

const firestore = {
  state: {},
  mutations: {},
  actions: {
    // Signs in with firestore
    firestoreSignIn(state, userData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(userData.email, userData.password)
        .catch(function(error) {
          alert(error.message);
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
    }