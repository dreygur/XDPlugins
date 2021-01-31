<template>
  <div class="flex flex-col mt-2">
    <div class="flex flex-col">
      <h1 class="mb-2 px-2 text-2xs">SIGN IN</h1>
      
      <form class="flex flex-col" @submit.prevent="signIn()">
        <input type="text" v-model="email" placeholder="Enter Email" />
        <input type="password" v-model="password" placeholder="Enter Password" />

        <div class="flex justify-center mt-4">
          <button class="cursor-pointer" uxp-variant="cta" @click.prevent="signIn()">Sign In</button>
        </div>
      </form>

      <div class="flex flex-col items-center">
        <div class="flex justify-center mb-1">
          <span class="mr-1 text-2xs text-gray-500">New User?</span>
          <span
            class="flex align-bottom color-blue text-2xs cursor-pointer"
            @click="routeSignUp"
          >Sign Up</span>
        </div>

        <a href="https://app.marpipe.com/passwordRecovery" class="link text-3xs cursor-pointer" >Forget Password?</a>
      </div>
      
    </div>
    <MarpipeInfo/>    
  </div>
</template>

<script>
import MarpipeInfo from '@/component/MarpipeInfo.vue';

export default {
  name: "SignIn",
  components: {
    MarpipeInfo
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    signIn() {
      this.$store.dispatch("signIn", {
        email: this.email,
        password: this.password
      });
    },
    routeSignUp() {
      this.$router.push("/signup");
    }
  },
};
</script>

<style scoped>
.link:hover {
  text-decoration: none;
}
</style>