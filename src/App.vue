<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
/**
 * The main Page that displays all other routes.
 * Dispatches actions when it is loaded.
 */
export default {
  created() {
    this.$store.dispatch("onPageReload");
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
