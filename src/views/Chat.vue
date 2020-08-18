<template class="home">
  <div @keyup.enter="submit" class="home_container" :class="getTheme ? 'nightmode' : 'daymode'">
    <div id="main_panel" @keyup.enter="submit">
      <div v-if="getChatLogs.length <= 0" class="lds-circle"></div>
      <!--  -->
      <div
        v-if="!getCurrentUserName && getChatLogs.length <= 0 || getCurrentUserName"
        class="sidebar"
      >
        <!-- THEME BUTTONS -->
        <div class="mode_buttons">
          <button v-if="!getTheme" @click="nightMode" class="mode_button">Night mode</button>
          <button v-if="getTheme" @click="dayMode" class="mode_button">Day mode</button>
        </div>
        <!--  -->
        <!-- USER BUTTONS -->
        <div class="sidebar_buttons">
          <button class="sidebar_button" v-if="getCurrentUserName" @click="displayProfile">Profile</button>
          <button class="sidebar_button" v-if="getCurrentUserName" @click="signOut">Sign out</button>
        </div>
        <!-- MODALS -->
        <div class="authModals">
          <div id="profile-modal">
            <profile-page></profile-page>
          </div>
        </div>
        <!--  -->
        <div class="channels">CHANNELS</div>
      </div>
      <!-- CHATBOX -->
      <div v-if="getChatLogs.length > 0" id="chatbox">
        <div class="user_image"></div>
        <div v-for="(data, i) in orderChatsByDate" :key="i" class="text_display">
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
              <div class="text_display-date">&nbsp; &nbsp;({{ data.date | moment("from", "now") }})</div>
            </div>
            <div class="chat-text">
              <div class="text_display-chat">{{ data.chat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="text_input">
        <div>
          <button
            v-if="chatTyping != ''"
            :disabled="getChatLogs ? true : false"
            @click="submit"
            class="text_input-button"
          >Submit</button>
          <textarea placeholder="Say hi..." v-model="chatTyping" type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import ProfilePage from "../components/ProfilePage";
import firebase from "firebase";
export default {
  components: {
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
      this.getChatLogs.forEach(el => {
        timesOrdered.push(el.dateMilSec);
        timesOrdered.sort(function(a, b) {
          return a - b;
        });
      });
      timesOrdered.forEach(timeSec => {
        this.getChatLogs.forEach(time => {
          if (timeSec == time.dateMilSec) {
            datesOrdered.unshift(time);
          }
        });
      });
      return datesOrdered.reverse();
    }
  },
  // Fetches all chat logs on page load. Also updates UI when new message added with onSnaphot.
  created() {
    let chatLogs = [];
    // this.$store.dispatch("clearChatLogs");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const fireStoreRef = firebase.firestore().collection("userdata");
        fireStoreRef.get().then(snapShot => {
          snapShot.forEach(doc => {
            const userEmail = doc.data().email;
            const fireStoreRef2 = firebase
              .firestore()
              .collection("userdata")
              .doc(userEmail)
              .collection("chatLogs");
            fireStoreRef2.onSnapshot(snapShot => {
              snapShot.forEach(doc2 => {
                chatLogs.push(doc2.data().userChatData);
                this.$store.dispatch("storeChatLogsInState", chatLogs);
              });
              chatLogs = [];
            });
          });
        });
      }
    });
  },
  methods: {
    // store chatlogs in store
    submit() {
      if (this.chatTyping == "") {
        return;
      } else {
        var dateobj = new Date();
        var date = dateobj.toISOString();
        const userChatData = {
          chat: this.chatTyping,
          username: this.getCurrentUserName,
          date: date,
          dateMilSec: new Date().getTime(),
          profilePicture: this.getProfilePicture
        };
        this.$store.dispatch("addUserChatToFireStore", userChatData);
        // this.$store.dispatch("storeChatLogsInState", userChatData);
        this.chatTyping = "";
      }
      var element = document.getElementById("chatbox");
      element.scrollTop = element.scrollHeight;
    },
    // sets website to nigtmode and daymode respecitvely, storing choice to maintain on reload
    nightMode() {
      this.$store.dispatch("nightMode");
    },
    dayMode() {
      this.$store.dispatch("dayMode");
    },

    // Displays signin/signup modals

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

      this.$router.push("/");
    }
  }
};
</script>

<style lang="sass"></style>
