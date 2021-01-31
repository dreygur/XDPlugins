<template>
  <div class="flex flex-col mt-2">
    <h1 class="mb-2 px-2 text-2xs">SIGN UP</h1>

    <form class="flex flex-col" @submit.prevent="signUp()">
      <input type="text" placeholder="Enter Email" v-model="email" />
      <input type="password" v-model="password" placeholder="Enter Password"/>
      <input type="password" v-model="password_confirmation" placeholder="Repeat Password" />

      <div class="flex justify-center mt-4">
        <button class="cursor-pointer" uxp-variant="cta" @click.prevent="signUp()">Sign Up</button>
      </div>
    </form>
    
    <div class="flex justify-center">
      <span class="mr-1 text-2xs text-gray-500">Have an account?</span>
      <span
        class="color-blue flex align-bottom text-2xs cursor-pointer"
        @click="routeSignIn"
      >Sign In</span>
    </div>
    
    <MarpipeInfo/>
  </div>
</template>

<script>
import MarpipeInfo from '@/component/MarpipeInfo.vue';

export default {
  name: "SignUp",
  components: {
    MarpipeInfo
  },
  data() {
    return {
      email: "",
      password: "",
      password_confirmation: ""
    };
  },
  methods: {
    signUp() {
      this.$store.dispatch("signUp", {
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      });
    },
    routeSignIn() {
      this.$router.push("/signin");
    }
  }
};
</script>

