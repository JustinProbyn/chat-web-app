<template>
  <div class="form" @keyup.enter="submit">
    <h2 class="display-1">Sign In</h2>
    <div class="inputs">
      <input
        type="text"
        v-model="email"
        :error-messages="emailErrors"
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      />
      <input
        type="text"
        v-model="password"
        :error-messages="passwordErrors"
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      />
      <div class="btns">
        <button :disabled="$v.$invalid" @click="submit">submit</button>
        <!-- <v-btn color="info" @click="goToSignUp">Register</v-btn> -->
      </div>
    </div>
  </div>
</template>

<script>
/**
 * A sign up component that is displayed on the website as a modal
 * It is accesible from the Home.vue page dropdown menu
 * A choice to sign in or sign up is displayed
 * when a user tries to access the checkout page without signing in
 */
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    password: { required },
    email: { required, email }
  },

  data: () => ({
    password: "",
    email: ""
  }),

  computed: {
    //Errors that are thrown to user if validations aren't met
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("Email is required");
      return errors;
    }
  },

  methods: {
    /* checks if validation errors then signs into firebase */
    submit() {
      this.$v.$touch();
      const userData = {
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("firestoreSignIn", userData);
      this.$emit("signedIn");
    }
  }
};
</script>
