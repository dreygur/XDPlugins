<template>
  <section class="flex flex-col items-center">
    <img src="src/asset/images/sessionimage.png" />
    <span class="justify-center text-base text-gray-700">Join Marpipe</span>
    <span class="justify-center text-base mb-2 text-gray-700">For Free!</span>
    <span class="text-2xs text-gray-700">More Info</span>
    <a href="https://www.marpipe.com/" class="link mb-2 whitespace-no-wrap justify-center text-2xs">https://www.marpipe.com/</a>

    <span class="text-3xs text-red-600">{{sessionError}}</span>
  </section>
</template>

<script>
  export default {
    name: "MarpipeInfo",
    computed: {
    sessionError() {
      return this.$store.getters.USER_ERROR;
    }
  },
  }
</script>

<style scoped>
.link:hover {
  text-decoration: none;
}
</style>