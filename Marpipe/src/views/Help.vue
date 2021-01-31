<template>
  <div>
    <router-view/>
    <!-- Close Help button, routes to root -->
    <div class="flex justify-center">
      <button
        @click.stop="$router.push('/')"
        uxp-variant="secondary"
        class="w-fit self-center cursor-pointer"
      >Close Help</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Help"
  }
</script>

<style scoped>

</style>