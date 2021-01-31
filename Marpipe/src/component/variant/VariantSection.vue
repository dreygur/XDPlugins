<template>
  <div class="w-full">
    <div class="flex justify-between items-center h-full mb-4">
      <div class="section-title font-regular text-3xs tracking-widest flex">VARIANTS</div>

      <IconBase
        :icon="addVariantListAllow ? 'active-add-circle' : 'inactive-add-circle'"
        :class="{ 'cursor-pointer': addVariantListAllow }"
        class="h-4 w-4"
        @click.native="createVariantList()"
      />
    </div>

    <div class="variant-list">
      <ImageVariantList v-for="(imageVariantList, idx ) in imageVariantLists" :key="imageVariantList.id" 
                        :index="idx" :imageVariantList="imageVariantList" class="mb-4" />

      <CopyVariantList v-for="(copyVariantList, idx ) in copyVariantLists" :key="copyVariantList.id" 
                        :index="idx" :copyVariantList="copyVariantList" class="mb-4" />
      
      <GroupVariantList
        v-for="groupVariantList in groupVariantLists"
        :key="groupVariantList.id"
        :groupVariantListID="groupVariantList.id"
        @map="openGroupMappingModal"
        class="mb-4"
      />

      <GroupMappingModal
        ref="groupMappingModal"
        v-if="renderGroupMappingModal"
        :dialog="groupMappingModal"
        :groupVariantListID="activeGroupVariantListID"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { nanoid } from "nanoid/non-secure";

import IconBase from "@/lib/icon/IconBase.vue";
import ImageVariantList from "@/component/variant/image/ImageVariantList.vue";
import CopyVariantList from "@/component/variant/copy/CopyVariantList.vue";
import GroupVariantList from "@/component/variant/group/GroupVariantList.vue";
import GroupMappingModal from "@/component/variant/group/GroupMappingModal.vue";
import Experiment from "@/utils/Experiment.js";

export default {
  name: "VariantSection",
  mixins: [Experiment],
  components: {
    IconBase,
    ImageVariantList,
    CopyVariantList,
    GroupVariantList,
    GroupMappingModal
  },
  props: {
    addVariantListAllow: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      groupMappingModal: null,
      renderGroupMappingModal: false,
      activeGroupVariantListID: ""
    };
  },
  computed: {
    ...mapGetters([
      "selection",
      "nodeVariantType",
      "imageVariantLists",
      "copyVariantLists",
      "groupVariantLists"
    ])
  },
  methods: {
    createVariantList() {
      if (this.addVariantListAllow) {
        if (this.nodeVariantType === "Image") {
          this.createImageVariantList();
        } else if (this.nodeVariantType === "Text") {
          this.createCopyVariantList();
        } else if (this.nodeVariantType === "Group") {
          this.openGroupMappingModal("");
        }
      }
    },
    openGroupMappingModal(activeGroupVariantListID) {
      this.activeGroupVariantListID = activeGroupVariantListID;
      this.renderGroupMappingModal = true;

      Vue.nextTick(async () => {
        this.groupMappingModal = this.$refs.groupMappingModal.$el;
        if (!this.$refs.groupMappingModal.$el.open) {
          await this.$refs.groupMappingModal.$el.showModal().then(() => {
            this.activeGroupVariantListID = "";
            this.renderGroupMappingModal = false; //destroy dialog
          });
        }
      });
    },
    createCopyVariantList() {
      const node = this.selection.items[0];
      const listCounter = this.$store.getters.copyVariantListCounter;
      const name = `Text Group-${listCounter}`;
      const copyLines = node.text.split("\n");
      const listID = nanoid();

      this.$store.dispatch("createCopyVariantList", { id: listID, name });
      node.listID = listID;

      this.$store.dispatch("incrementCopyVariantListCounter");
      this.$store.dispatch("mapCopyNode", node);
      this.$store.dispatch("addMappingToDesign", node);

      this.$store
        .dispatch("createCopy", { name: "Text-1", listID })
        .then(copy => {
          this.$store.dispatch("addCopyToList", copy);
          this.$store.dispatch("setVariantCountFlag");

          copyLines.forEach((copyLine, index) => {
            this.$store.dispatch("createCopyLine", {
              variantID: copy.id,
              text: copyLine,
              index
            });
          });
        });
    },
    createImageVariantList() {
      const node = this.selection.items[0];
      let listCounter = this.$store.getters.imageVariantListCounter;
      const name = `Image Group-${listCounter}`;
      const listID = nanoid();

      this.uploadMultipleImages().then(imageFiles => {
        if (imageFiles.length > 0) {
          this.$store.dispatch("createImageVariantList", { id: listID, name });
          node.listID = listID;

          this.$store.dispatch("incrementImageVariantListCounter");
          this.$store.dispatch("mapImageNode", node);
          this.$store.dispatch("addMappingToDesign", node);

          imageFiles.forEach(imageFile => this.storeImage(imageFile, listID));
        }
      });
    },
    storeImage(imageFile, listID) {
      let formData = new FormData();
      formData.append("asset_file", imageFile);

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
    }
  }
};
</script>

<style scoped>
</style>



