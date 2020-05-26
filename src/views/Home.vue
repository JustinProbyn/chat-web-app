<template>
  <div class="home_container" :class="nightmode ? 'nightmode' : 'daymode'">
    <div class="mode_buttons">
      <button @click="nightmode = true" class="mode_button">
        Night mode
      </button>
      <button @click="nightmode = false" class="mode_button">Day mode</button>
    </div>
    <div class="main_panel">
      <div class="sidebar"></div>
      <div class="chatbox">
        <p>{{ chatText }}</p>
        <input v-model="chatText" type="text" class="text_input" />
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
      nightmode: false,
      daymode: true
    };
  }
};
</script>

<style lang="sass"></style>
