<template>
  <div class="flex justify-between w-full bg-white rounded-lg">
    <div class="flex items-center">
      <img
        :src="imageVariant.localPath"
        alt="image variant thumbnail"
        class="w-5 h-5 object-cover mr-2"
      />
      <div class="image-variant-title mr-2 truncate">{{ imageVariant.name }}</div>
    </div>

    <div class="flex items-center">
      <IconBase icon="minus" @click.native="deleteImage()" class="minus-icon" />
    </div>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

export default {
  name: "GroupVariantImageItem",
  components: {
    IconBase
  },
  props: {
    imageVariant: {
      required: true
    }
  },
  methods: {
    deleteImage() {
      this.$emit("delete");
    }
  }
};
</script>

<style scoped>
.image-variant-title {
  color: #666666;
  font-size: 0.65rem;
}
</style>