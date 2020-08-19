<template>
  <div class="profile-page">
    <p class="modal-header">Upload a profile picture</p>
    <div class="change-user-image">
      <input id="file" type="file" @change="imageSelected" />

      <button class="upload-button" @click="uploadImage">Upload image</button>
    </div>
    <output id="image"></output>

    <div class="change-user-name">
      <p class="modal-header">Change your username</p>
      <input v-model="newUsername" type="text" />
      <button :disabled="!newUsername ? true : false" @click="changeUsername">Change username</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newUsername: "",
      imageData: null
    };
  },
  methods: {
    imageSelected(event) {
      this.imageData = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          document.getElementById("image").innerHTML = [
            '<img src="',
            e.target.result,
            '" title="',
            theFile.name,
            '" width="100" />'
          ].join("");
        };
      })(this.imageData);
      reader.readAsDataURL(this.imageData);
    },
    uploadImage() {
      this.$store.dispatch("submitPicture", this.imageData);
    },
    changeUsername() {
      this.$store.dispatch("changeUsernameOnFirestore", this.newUsername);
    }
  }
};
</script>
