<template>
  <div
    @keyup.enter="submit"
    class="home_container"
    :class="getTheme ? 'nightmode' : 'daymode'"
  >
    <div class="user_buttons">
      <button @click="displaySignUp">
        <router-link to="signup">Sign up</router-link>
      </button>
      <button @click="displaySignIn">
        <router-link to="signin">Sign in</router-link>
      </button>
      <button @click="signOut">Sign out</button>
    </div>
    <div class="mode_buttons">
      <button @click="nightMode" class="mode_button">
        Night mode
      </button>
      <button @click="dayMode" class="mode_button">Day mode</button>
    </div>
    <div class="main_panel">
      <div class="sidebar"></div>
      <div class="chatbox">
        <div v-for="(text, i) in chatText" :key="i" class="text_display">
          {{ text }}
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

export default {
  data() {
    return {
      chatText: new Set(),
      chatTyping: "",
      nightmode: false,
      daymode: true
    };
  },
  computed: {
    getTheme() {
      return this.$store.getters.getTheme;
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
      this.chatText.add(this.chatTyping);
      console.log(this.chatText);
      this.chatTyping = "";
    },
    // Displays signin/signup modals
    displaySignIn() {},
    displaySignUp() {},
    signOut() {
      this.$store.dispatch("firestoreSignOut"); //Action in firestore.js module
    }
  }
};
</script>

<style lang="sass"></style>
