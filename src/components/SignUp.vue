<template>
  <div class="form" @keyup.enter.native="submit">
    <div tyle="padding: 15px" width="500px" class="form mx-auto mt-10">
      <h2 class="display-1">Sign Up</h2>
      <div class="inputs">
        <input
          type="text"
          v-model="username"
          :error-messages="nameErrors"
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
        />
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
        />
        <input
          type="text"
          v-model="confirmPassword"
          :error-messages="confirmPasswordErrors"
          @input="$v.confirmPassword.$touch()"
          @blur="$v.confirmPassword.$touch()"
        />
        <div class="btns">
          <button :disabled="$v.$invalid" @click="submit">
            Submit
          </button>
        </div>
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
import {
  required,
  maxLength,
  email,
  minLength,
  sameAs
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  // Form Validations
  mixins: [validationMixin],
  validations: {
    username: { required, maxLength: maxLength(15) },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: { sameAs: sameAs("password") }
  },
  /***************************************/

  data() {
    return {
      showPassword: false,
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  computed: {
    // Errors thrown at user if validations aren't met
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required.");
      !this.$v.password.minLength &&
        errors.push("Password must be at least six characters");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.maxLength &&
        errors.push("Username must be at most 15 characters long");
      !this.$v.username.required && errors.push("Username is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid email");
      !this.$v.email.required && errors.push("Email is required");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      this.$v.confirmPassword.$error && errors.push("Passwords must match.");
      return errors;
    }
  },
  /***************************************/
  methods: {
    //checks if there are any errors in form and creates user with firebase
    submit() {
      this.$emit("signedUp");
      this.$v.$touch();
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("firestoreSignUp", userData);
    }
  }
};
</script>
