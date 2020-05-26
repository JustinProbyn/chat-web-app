import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import Vuelidate from "vuelidate";

Vue.use(Vuelidate);

Vue.config.productionTip = false;

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB8F-SN7rTAqbiOxPxGFOmclYj7vhoXWIA",
  authDomain: "web-chat-app-139d5.firebaseapp.com",
  databaseURL: "https://web-chat-app-139d5.firebaseio.com",
  projectId: "web-chat-app-139d5",
  storageBucket: "web-chat-app-139d5.appspot.com",
  messagingSenderId: "1036434828171",
  appId: "1:1036434828171:web:f870a8074a555454a65d8e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  created() {
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        console.log(`${firebaseUser} is signed in`);
      }
    });
  },
  render: (h) => h(App)
}).$mount("#app");
