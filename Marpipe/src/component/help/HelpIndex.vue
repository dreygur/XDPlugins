<template>
  <div>
    <!-- Help Icon & Help Header -->
    <div class="flex items-center mb-8">
      <img src="src/asset/images/temp_icons/Help.png" class="w-4 h-4 mr-2"/>
      <span class="font-bold text-lg">Help</span>
    </div>
    <!-- List of Help Topics -->
    <ul class="flex flex-col">
      <HelpIndexItem
        topic="Account select"
      />
      <HelpIndexItem
        topic="Adding image variants"
      />
      <HelpIndexItem
        topic="Adding copy variants"
      />
      <HelpIndexItem
        topic="Adding combo variants"
      />
      <HelpIndexItem
        topic="Previewing variants"
      />
      <HelpIndexItem
        topic="Linking & Unlinking a layer"
      />
      <HelpIndexItem
        topic="Multiple artboards and designs"
      />
      <HelpIndexItem
        topic="Unlinking an artboard"
      />
      <HelpIndexItem
        topic="Generate"
      />
    </ul>
  </div>
</template>

<script>
import HelpIndexItem from "@/component/help/HelpIndexItem.vue"

  export default {
    name: "HelpIndex",
    components: {
      HelpIndexItem,
    },
  }
</script>

<style lang="scss" scoped>

</style>