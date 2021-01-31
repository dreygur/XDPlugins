<template>
  <div
    class="flex justify-between w-full rounded-lg p-1 bg-white cursor-pointer"
    :class="currentImageVariant ? 'border border-solid border-blue' : 'image-variant'"
    @click.stop="updateImageNode()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="flex items-center" @click.stop="updateImageNode()">
      <img
        :src="imageVariant.localPath"
        alt="image variant thumbnail"
        class="w-5 h-5 object-cover mx-2"
        @click.stop="updateImageNode()"
      />
      <form v-show="rename" @submit.prevent="updateImage()">
        <input
          type="text"
          v-model="name"
          @blur="updateImage()"
          :ref="'imageVariant' + this.imageVariant.id"
          :placeholder="name || imageVariant.name"
        />
      </form>
      <p
        v-show="!rename"
        class="image-variant-title mr-2 truncate cursor-text"
        @dblclick.stop="renameVariant()"
      >{{ name || imageVariant.name }}</p>
    </div>

    <div class="flex items-center mr-1">
      <IconBase icon="eye" v-show="currentImageVariant" class="eye-icon mr-2 fill-blue" />
      <IconBase
        icon="minus"
        @click.native.stop="removeVariant()"
        class="minus-icon"
        :class="[currentImageVariant || hover ? 'fill-red-500' : 'fill-red-500-60']"
      />
    </div>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";

export default {
  name: "ImageVariant",
  components: {
    IconBase
  },
  props: {
    imageVariant: {
      type: Object,
      required: true
    },
    currentImageId: String
  },
  data() {
    return {
      name: "",
      rename: false,
      hover: false,
      nameRef: "imageVariant" + this.imageVariant.id
    };
  },
  computed: {
    currentImageVariant() {
      return this.currentImageId === this.imageVariant.id;
    }
  },
  methods: {
    removeVariant() {
      this.$emit("removeVariant");
    },
    updateImageNode() {
      const application = require("application");

      application.editDocument(() => {
        this.$store.dispatch("updateImageNodes", this.imageVariant);
      });

      this.$emit("changeCurrentImage");
      this.rename = false;
    },
    updateImage() {
      this.$store.dispatch(
        "updateImage",
        Object.assign({}, this.imageVariant, { name: this.name })
      );
      this.rename = false;
    },
    renameVariant() {
      this.rename = true;
      this.$refs[this.nameRef].focus();
    }
  },
  mounted() {
    this.name = this.imageVariant.name;
  }
};
</script>

<style scoped>
.image-variant-title {
  color: #666666;
  font-size: 0.65rem;
}

.image-variant:hover {
  border: solid 1px rgba(72, 190, 199, 0.5);
}
</style>
