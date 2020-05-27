<template>
  <div
    @keyup.enter="submit"
    class="home_container"
    :class="getTheme ? 'nightmode' : 'daymode'"
  >
    <div class="user_buttons">
      <button @click="displaySignUp">
        Sign up
      </button>
      <button @click="displaySignIn">
        Sign in
      </button>
      <button @click="signOut">Sign out</button>
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
    <div class="main_panel">
      <div class="sidebar"></div>
      <div class="chatbox">
        <div v-for="(data, i) in getChatLogs" :key="i" class="text_display">
          <div class="text_display-username">{{ data.username }}:</div>
          <div class="text_display-chat">{{ data.chat }}</div>
          <div class="text_display-date">on {{ data.date }}</div>
        </div>
        <div class="text_input">
          <button @click="submit" class="text_input-button">Submit</button>
          <input v-model="chatTyping" type="text" class="text_input-bar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
export default {
  components: {
    signin: SignIn,
    signup: SignUp
  },
  data() {
    return {
      // modal
      signinDisplay: false,
      signupDisplay: false,
      //
      chatData: [],
      chatTyping: "",
      nightmode: false,
      daymode: true
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
    }
  },
  methods: {
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
        date: Date()
      };
      this.$store.dispatch("addUserChatToFireStore", userChatData);
      this.$store.dispatch("storeChatLogsInState", userChatData);
      console.log(this.chatData);
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
    }
  }
};
</script>

<style lang="sass"></style>
