<template class="home" :key="reload">
  <div
    @keyup.enter="submit"
    class="home_container"
    :class="getTheme ? 'nightmode' : 'daymode'"
  >
    <div class="user_buttons">
      <button v-if="!getCurrentUserName" @click="displaySignUp">
        Sign up
      </button>
      <button v-if="!getCurrentUserName" @click="displaySignIn">
        Sign in
      </button>
      <button v-if="getCurrentUserName" @click="signOut">Sign out</button>
      <button @click="test">Test</button>
    </div>
    <div class="authModals">
      <div id="signin-modal">
        <signin></signin>
      </div>
      <div id="signup-modal">
        <signup></signup>
      </div>
    </div>
    <div class="mode_buttons">
      <button v-if="!getTheme" @click="nightMode" class="mode_button">
        Night mode
      </button>
      <button v-if="getTheme" @click="dayMode" class="mode_button">
        Day mode
      </button>
    </div>
    {{ testNum }}
    <div class="main_panel">
      <div v-if="getChatLogs.length <= 0" class="lds-circle"><div></div></div>
      <div v-if="getChatLogs.length > 0" class="sidebar"></div>
      <div v-if="getChatLogs.length > 0" class="chatbox">
        <div class="user_image"></div>
        <div
          v-for="(data, i) in orderChatsByDate"
          :key="i"
          class="text_display"
        >
          <div class="user-icon">
            <img
              v-if="getTheme"
              src="../../public/img/account-box-outline.png"
            />
            <img
              v-if="!getTheme"
              src="../../public/img/account-box-outline-dark.png"
            />
          </div>
          <div class="user-info-and-chat">
            <div class="name-and-date">
              <div class="text_display-username">
                <strong>{{ data.username }}</strong>
                <div class="text_display-date">({{ data.date }})</div>
              </div>
            </div>
            <div class="chat-text">
              <div class="text_display-chat">{{ data.chat }}</div>
            </div>
          </div>
        </div>
        <div :class="getTheme ? 'text_input-night' : 'text_input-day'">
          <button
            :disabled="chatTyping ? false : true"
            @click="submit"
            class="text_input-button"
          >
            Submit
          </button>
          <textarea v-model="chatTyping" type="text" class="text_input-bar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import firebase from "firebase";
export default {
  components: {
    signin: SignIn,
    signup: SignUp
  },
  data() {
    return {
      testNum: 1,
      moment: require("moment"),
      // modal
      signinDisplay: false,
      signupDisplay: false,
      //
      chatData: [],
      chatTyping: "",
      nightmode: false,
      daymode: true,
      reload: 0
    };
  },
  computed: {
    getTheme() {
      return this.$store.getters.getTheme;
    },
    getCurrentUserName() {
      return this.$store.getters.getCurrentUserName;
    },
    getChatLogs() {
      return this.$store.getters.getChatLogs;
    },
    orderChatsByDate() {
      const timesOrdered = [];
      const datesOrdered = [];
      this.getChatLogs.forEach((el) => {
        timesOrdered.push(el.dateMilSec);
        timesOrdered.sort(function(a, b) {
          return a - b;
        });
      });
      timesOrdered.forEach((timeSec) => {
        this.getChatLogs.forEach((time) => {
          if (timeSec == time.dateMilSec) {
            datesOrdered.unshift(time);
          }
        });
      });
      return datesOrdered.reverse();
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
                const chatData = doc.data().userChatData;
                this.$store.dispatch("storeChatLogsInState", chatData);
              });
            });
          });
        });
      }
    });
  },
  methods: {
    reloadPage() {
      this.reload++;
    },
    test() {
      this.testNum++;
    },
    // sets website to nigtmode and daymode respecitvely, storing choice to maintain on reload
    nightMode() {
      this.$store.dispatch("nightMode");
    },
    dayMode() {
      this.$store.dispatch("dayMode");
    },
    // store chatlogs in store
    submit() {
      const userChatData = {
        chat: this.chatTyping,
        username: this.getCurrentUserName,
        date: Date(),
        dateMilSec: new Date().getTime()
      };
      this.$store.dispatch("addUserChatToFireStore", userChatData);
      this.$store.dispatch("storeChatLogsInState", userChatData);

      this.chatTyping = "";
    },
    // Displays signin/signup modals
    displaySignIn() {
      const signinModal = document.getElementById("signin-modal");
      const signupModal = document.getElementById("signup-modal");
      signupModal.style.display = "none";
      this.signupDisplay = false;
      if (this.signinDisplay == true) {
        signinModal.style.display = "none";
        this.signinDisplay = false;
      } else if (this.signinDisplay == false) {
        signinModal.style.display = "block";
        this.signinDisplay = true;
      }
    },
    displaySignUp() {
      const signupModal = document.getElementById("signup-modal");
      const signinModal = document.getElementById("signin-modal");
      this.signinDisplay = false;
      signinModal.style.display = "none";
      if (this.signupDisplay == true) {
        signupModal.style.display = "none";
        this.signupDisplay = false;
      } else if (this.signupDisplay == false) {
        signupModal.style.display = "block";
        this.signupDisplay = true;
      }
    },
    signOut() {
      this.$store.dispatch("firestoreSignOut"); //Action in firestore.js module
      this.reload++;
    }
  }
};
</script>

<style lang="sass"></style>
