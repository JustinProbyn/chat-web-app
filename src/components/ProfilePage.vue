<template>
  <div class="profilePage">
    <div class="change-user-image">
      <input class="file" type="file" @change="imageSelected" />
      <button @click="uploadImage">Upload image</button>
    </div>
    <div class="change-user-name">
      <input type="text" />
      <button>Change username</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageData: null
    };
  },
  methods: {
    imageSelected(event) {
      this.imageData = event.target.files[0];
    },
    uploadImage() {
      this.$store.dispatch("submitPicture", this.imageData);
    }
  }
};
</script>
