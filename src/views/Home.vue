<template class="home">
  <div
    @keyup.enter="submit"
    class="home_container"
    :class="getTheme ? 'nightmode' : 'daymode'"
  >
    <!-- USER BUTTONS -->
    <div class="user_buttons">
      <button v-if="!getCurrentUserName" @click="displaySignUp">
        Sign up
      </button>
      <button v-if="!getCurrentUserName" @click="displaySignIn">
        Sign in
      </button>
      <button v-if="getCurrentUserName" @click="signOut">Sign out</button>
      <button v-if="getCurrentUserName" @click="displayProfile">
        Profile
      </button>
    </div>
    <!-- MODALS -->
    <div class="authModals">
      <div v-if="!getCurrentUserName" id="signin-modal">
        <signin @signedIn="reload"></signin>
      </div>
      <div v-if="!getCurrentUserName" id="signup-modal">
        <signup></signup>
      </div>
      <div v-if="getCurrentUserName" id="profile-modal">
        <profile-page></profile-page>
      </div>
    </div>
    <!--  -->
    <!-- THEME BUTTONS -->
    <div class="mode_buttons">
      <button v-if="!getTheme" @click="nightMode" class="mode_button">
        Night mode
      </button>
      <button v-if="getTheme" @click="dayMode" class="mode_button">
        Day mode
      </button>
    </div>
    <!--  -->
    <div class="main_panel" @keyup.enter="submit">
      <div v-if="getChatLogs.length <= 0" class="lds-circle"><div></div></div>
      <div v-if="getChatLogs.length > 0" class="sidebar"></div>
      <div v-if="getChatLogs.length > 0" class="chatbox">
        <div class="user_image"></div>
        <div
          v-for="(data, i) in orderChatsByDate"
          :key="i"
          class="text_display"
        >
          <div class="user_icon">
            <img
              class="user_icon-img"
              v-if="getTheme"
              :src="data.profilePicture ? data.profilePicture : nightmodeIcon"
            />
            <img
              class="user_icon-img"
              v-if="!getTheme"
              :src="data.profilePicture ? data.profilePicture : daymodeIcon"
            />
          </div>
          <div class="user-info-and-chat">
            <div class="name-and-date">
              <div class="text_display-username">
                <strong>{{ data.username }}&nbsp;</strong>
              </div>
              <div class="text_display-date">
                &nbsp; &nbsp;({{ data.date | moment("from", "now") }})
              </div>
            </div>
            <div class="chat-text">
              <div class="text_display-chat">{{ data.chat }}</div>
            </div>
          </div>
        </div>
        <div :class="getTheme ? 'text_input-night' : 'text_input-day'">
          <button
            v-if="chatTyping != ''"
            :disabled="chatLogs ? true : false"
            @click="submit"
            class="text_input-button"
          >
            Submit
          </button>
          <textarea
            placeholder="Say hi..."
            v-model="chatTyping"
            type="text"
            class="text_input-bar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import ProfilePage from "../components/ProfilePage";
import firebase from "firebase";
export default {
  components: {
    signin: SignIn,
    signup: SignUp,
    profilePage: ProfilePage
  },
  data() {
    return {
      // modals
      signinDisplay: false,
      signupDisplay: false,
      profileDisplay: false,
      //
      chatData: [],
      chatTyping: "",
      nightmode: false,
      nightmodeIcon: require("../../public/img/account-box-outline.png"),
      daymode: true,
      daymodeIcon: require("../../public/img/account-box-outline-dark.png")
    };
  },
  computed: {
    getProfilePicture() {
      return this.$store.getters.getProfilePicture;
    },
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
                this.$store.dispatch(
                  "storeChatLogsInState",
                  doc.data().userChatData
                );
              });
            });
          });
        });
      }
    });
  },
  methods: {
    test() {
      this.$router.go(0);
    },
    reload() {
      if (this.getCurrentUserName) {
        this.$router.go(0);
      }
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
      if (this.chatTyping == "") {
        return;
      } else {
        const userChatData = {
          chat: this.chatTyping,
          username: this.getCurrentUserName,
          date: Date(),
          dateMilSec: new Date().getTime(),
          profilePicture: this.getProfilePicture
        };
        this.$store.dispatch("addUserChatToFireStore", userChatData);
        this.$store.dispatch("storeChatLogsInState", userChatData);

        this.chatTyping = "";
      }
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
    displayProfile() {
      const profileModal = document.getElementById("profile-modal");
      if (this.profileDisplay == true) {
        profileModal.style.display = "none";
        this.profileDisplay = false;
      } else if (this.profileDisplay == false) {
        profileModal.style.display = "block";
        this.profileDisplay = true;
      }
    },
    signOut() {
      this.$store.dispatch("firestoreSignOut"); //Action in firestore.js module
      this.$store.dispatch("clearChatLogs");
      setTimeout(() => {
        this.$router.go(0);
      }, 500);
    }
  }
};
</script>

<style lang="sass"></style>
