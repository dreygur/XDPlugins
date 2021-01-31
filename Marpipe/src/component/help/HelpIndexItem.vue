<template>
  <div class="flex mb-3">
    <span
      class="font-bold mr-2 cursor-pointer"
      @click.stop="$router.push({
        name: 'HelpPage',
        params: { topic: topic }
      })"
    >?</span>
    <span
      class="cursor-pointer"
      @click.stop="$router.push({
        name: 'HelpPage',
        params: { topic: topic }
      })"
    >{{topic}}</span>
  </div>
</template>

<script>
  export default {
    name: "HelpIndexItem",
    props: {
      topic: {
        type: String,
        required: true
      },
    },
  }
</script>

<style scoped>

</style>