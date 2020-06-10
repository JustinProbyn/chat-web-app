<template>
  <div class="landing_container">
    <div class="landing_elements">
      <div class="landing-header-and-buttons">
        <h1>Please sign in to begin chatting!</h1>
        <div class="auth_buttons">
          <button class="auth_button" v-if="!getCurrentUserName" @click="displaySignUp">Sign up</button>
          <button class="auth_button" v-if="!getCurrentUserName" @click="displaySignIn">Sign in</button>
        </div>
      </div>
      <div class="auth-modals">
        <div v-if="!getCurrentUserName" id="signin-modal">
          <signin @signedIn="goToChat"></signin>
        </div>
        <div v-if="!getCurrentUserName" id="signup-modal">
          <signup></signup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import firebase from "firebase";
export default {
  data() {
    return {
      signinDisplay: false,
      signupDisplay: false
    };
  },
  components: {
    signin: SignIn,
    signup: SignUp
  },
  computed: {
    getCurrentUserName() {
      return this.$store.getters.getCurrentUserName;
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push("chat");
      }
    });
  },
  methods: {
    goToChat() {
      this.$router.push("chat");
    },
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
    }
  }
};
</script>