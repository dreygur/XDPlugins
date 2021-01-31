<template>
  <section>
    <div
      class="flex items-center flex-no-wrap justify-between"
      @click.stop="rename = false"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="flex items-center">
        <IconBase
          :icon="open? 'triangle-point-down' : 'triangle-point-right'"
          class="triangle-pointer-icon mr-1"
          @click.native.stop="open = !open"
        />
        <IconBase icon="image" class="mr-1 h-4 w-4" />


        <form v-show="rename" @submit.prevent="rename = false">
          <input
            type="text"
            v-model="name"
            @input="debouncedUpdate"
            @blur="rename = false"
            :ref="'imageVariantList-' + this.index.toString()"
            :placeholder="name || imageVariantList.name"
          />
        </form>
        <span
          v-show="!rename"
          class="variant-list-title truncate mr-2 cursor-text"
          @dblclick.stop="renameVariantList()"
        >{{name || imageVariantList.name}}</span>
      </div>
      <div class="flex items-center">
        <IconBase
          :icon="matchingNode ? 'unlink' : 'link'"
          class="link-icon mr-2"
          v-show="mappableImageNode"
          @click.native.stop="matchingNode ? unmapNode() : mapNode()"
        />
        <IconBase icon="plus" class="plus-icon mr-2" @click.native.stop="addImageVariant()" />
        <IconBase icon="trash" class="trash-icon" @click.native.stop="deleteImageVariantList()" />
      </div>
    </div>
    
    <div v-show="open" class="py-2">
      <ImageVariant
        v-for="(variant, idx) in variants"
        :key="variant.id"
        :number="idx + 1"
        :imageVariant="variant"
        :currentImageId="currentImageId"
        @changeCurrentImage="changeCurrentImage(variant.id)"
        @removeVariant="removeVariant(variant)"
        :class="{'mb-2': idx !== variants.length - 1}"
      />
    </div>
    
  </section>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";
import ImageVariant from "@/component/variant/image/ImageVariant.vue";
import Experiment from "@/utils/Experiment.js";
import { mapGetters } from "vuex";

export default {
  name: "ImageVariantList",
  mixins: [Experiment],
  components: {
    IconBase,
    ImageVariant
  },
  props: {
    imageVariantList: Object,
    index: Number
  },
  data() {
    return {
      open: false,
      name: "",
      rename: false,
      hover: false,
      nameInput: "imageVariantList-" + this.index.toString(),
      debouncedUpdate: this.debounce(this.updateImageVariantList, 500),
      currentImageId: null
    };
  },
  computed: {
    ...mapGetters([
      "selection",
      "isSingleSelection",
      "nodeVariantType",
      "isMappableNode"
    ]),
    mappedImageNodes() {
      const { nodeIDs } = this.imageVariantList;
      return nodeIDs.map(id => this.imageNodes[id]);
    },
    matchingNode() {
      const updateFlag = this.$store.getters.updateFlag;
      if (this.isSingleSelection) {
        return this.mappedImageNodes
          .map(node => node.guid)
          .includes(this.node.guid);
      }
    },
    variants() {
      return this.$store.getters.imageVariantsByList(this.imageVariantList.id);
    },
    node() {
      const updateFlag = this.$store.getters.updateFlag;
      return this.selection.items[0];
    },
    imageNodes() {
      return this.$store.getters.imageNodes;
    },
    mappableImageNode() {
      const updateFlag = this.$store.getters.updateFlag;
      return (
        this.nodeVariantType === "Image" &&
        (this.isMappableNode || this.matchingNode)
      );
    }
  },
  methods: {
    renameVariantList() {
      this.rename = true;
      this.$refs[this.nameInput].focus();
    },
    updateImageVariantList() {
      this.$store.commit(
        "SET_IMAGE_VARIANT_LIST",
        Object.assign({}, this.imageVariantList, { name: this.name })
      );
    },
    deleteImageVariantList() {
      this.$store.dispatch("deleteImageVariantList", this.imageVariantList);
    },
    removeVariant(image) {
      this.$store.dispatch("deleteImage", image);
      this.$store.dispatch("removeImageFromList", image);
      this.$store.dispatch("setVariantCountFlag");
    },
    addImageVariant() {
      this.uploadImages().then(imageFiles =>
        imageFiles.forEach(imageFile => this.storeImage(imageFile))
      );
    },
    async uploadImages() {
      let imageFiles = await this.uploadMultipleImages();
      return imageFiles;
    },
    storeImage(imageFile) {
      let formData = new FormData();
      formData.append("asset_file", imageFile);
      let listID = this.imageVariantList.id;

      this.$store
        .dispatch("createImage", {
          formData,
          imageFile,
          listID
        })
        .then(image => {
          this.$store.dispatch("addImageToList", image);
          this.$store.dispatch("setVariantCountFlag");
        });
    },
    mapNode() {
      this.node.listID = this.imageVariantList.id;
      this.$store.dispatch("mapImageNode", this.node);
      this.$store.dispatch("addMappingToDesign", this.node);
    },
    unmapNode() {
      this.$store.dispatch("unmapImageNode", this.node);
      this.$store.dispatch("deleteMappingFromDesign", this.node);
    },
    changeCurrentImage(imageId) {
      this.currentImageId = imageId;
    }
  },
  watch: {
    variants(newValue, oldValue) {
      if (newValue) {
        this.open = this.variants.length > 0;
      }
    }
  }
};
</script>

<style scoped>
</style>