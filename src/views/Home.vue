<template>
  <div class="home_container" :class="nightmode ? 'nightmode' : 'daymode'">
    <div class="user_buttons">
      <button @click="signup">Sign up</button>
      <button @click="signin">Sign in</button>
    </div>
    <div class="mode_buttons">
      <button @click="nightmode = true" class="mode_button">
        Night mode
      </button>
      <button @click="nightmode = false" class="mode_button">Day mode</button>
    </div>
    <div class="main_panel">
      <div class="sidebar"></div>
      <div class="chatbox">
        <div class="text_display">
          {{ chatText }}
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
      chatText: "",
      chatTyping: "",
      nightmode: false,
      daymode: true
    };
  },
  methods: {
    submit() {
      this.chatText = this.chatTyping;
      // store chat logs in store
    }
    // signin () {
    //   this.$store.dispatch("firestoreSignIn", userData)
    // },
    // signup () {
    //   this.$store.dispatch("firestoreSignUp", userData)
    // }
  }
};
</script>

<style lang="sass"></style>
