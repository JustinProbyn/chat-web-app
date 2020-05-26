import firebase from "firebase";

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
    firestoreSignUp(state, userData) {
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
    },
    firestoreSignOut() {
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
    }
  }
};

export default firestore;
