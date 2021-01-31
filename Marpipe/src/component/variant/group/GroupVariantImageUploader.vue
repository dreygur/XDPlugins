<template>
  <div class="w-full flex justify-between py-2 cursor-pointer">
    <div  @click.stop="uploadImage()" class="combo-image-upload-instruction">Upload Image Variant</div>
    <IconBase icon="upload"  @click.native="uploadImage()" class="upload-icon cursor-pointer" />
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";
import Experiment from "@/utils/Experiment.js";

export default {
  name: "GroupVariantImageUploader",
  mixins: [Experiment],
  components: {
    IconBase
  },
  methods: {
    async uploadImage() {
      let imageFile = await this.uploadSingleImage();
      if (imageFile) {
        this.$emit("image", imageFile);
      }
    }
  }
};
</script>

<style scoped>
.combo-image-upload-instruction {
  color: #d8d8d8;
  font-size: 0.6rem;
}

.upload-icon {
  width: 0.55rem;
}
</style>