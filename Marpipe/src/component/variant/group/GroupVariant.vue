<template>
  <div
    class="flex flex-col cursor-pointer"
    @click.stop="previewGroupVariant()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- COMBO HEADER -->
    <div
      class="flex items-center justify-between cursor-pointer h-4 mb-2"
      @click.stop="previewGroupVariant()"
    >
      <!-- GROUP VARIANT NAME -->
      <div>
        <div
          v-show="!renameVariantStatus"
          @dblclick.stop="renameVariant()"
          class="combo-title underline cursor-text"
        >{{ variantNameInput || groupVariantName }}</div>

        <form v-show="renameVariantStatus" @submit.prevent="renameVariantStatus = false">
          <input
            ref="variantName"
            type="text"
            v-model="variantNameInput"
            @input="debouncedUpdateVariantName"
            @blur="renameVariantStatus = false"
            :placeholder="variantNameInput || groupVariantName"
          />
        </form>
      </div>

      <div class="flex items-center">
        <IconBase icon="eye" class="eye-icon mr-2 fill-blue" v-show="currentPreviewGroup" />
        <IconBase
          icon="minus"
          @click.native="deleteGroupVariant()"
          class="minus-icon"
          :class="[currentPreviewGroup || hover ? 'fill-red-500' : 'fill-red-500-60']"
        />
      </div>
    </div>

    <!-- COMBO CONTENT -->
    <div
      class="bg-white w-full rounded-lg"
      :class="{ 
        'border border-solid border-blue': currentPreviewGroup,
        'border border-solid border-blue-500-50': hover && !currentPreviewGroup 
      }"
    >
      <!-- IMAGE VARIANTS -->
      <div
        v-for="(imageVariantList, imageVariantListIdx) in imageVariantLists"
        :key="`${imageVariantList.variantIDs[variantIdx]}-${imageVariantListIdx}`"
      >
        <div class="px-2 pt-3">
          <div class="combo-variant-title">{{ imageVariantList.name }}</div>

          <div class="w-full h-9 flex items-center">
            <ImageUploader
              v-if="!imageIsUploaded(imageVariantList.variantIDs[variantIdx])"
              @image="storeImage($event, imageVariantList.id)"
              class="combo-image-uploader pl-5"
            />
            <ImageItem
              v-if="imageIsUploaded(imageVariantList.variantIDs[variantIdx])"
              :imageVariant="getImageVariant(imageVariantList.variantIDs[variantIdx])"
              @delete="removeImage(imageVariantList.variantIDs[variantIdx])"
              class="combo-image-list-item py-1"
            />
          </div>
        </div>
        <div class="w-full combo-variant-divider"></div>
      </div>

      <!-- COPY VARIANTS -->
      <div
        v-for="(copyVariantList, copyVariantListIdx) in copyVariantLists"
        :key="`${copyVariantList.variantIDs[variantIdx]}-${copyVariantListIdx}`"
      >
        <label class="px-2 py-3 flex flex-col">
          <div class="w-full text-left combo-variant-title mb-1">{{ copyVariantList.name }}</div>

          <textarea
            class="combo-textarea w-full"
            @input="updateCopyLines($event, copyVariantList.variantIDs[variantIdx])"
            placeholder="Type your text variant"
            v-model="copyVariantInputs[copyVariantListIdx]"
          />
        </label>
        <div
          v-show="copyVariantListIdx !== copyVariantLists.length-1"
          class="combo-variant-divider w-full"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";
import ImageUploader from "@/component/variant/group/GroupVariantImageUploader.vue";
import ImageItem from "@/component/variant/group/GroupVariantImageItem.vue";
import Experiment from "@/utils/Experiment.js";
import { mapGetters } from "vuex";
import application from "application";

export default {
  name: "GroupVariant",
  mixins: [Experiment],
  components: {
    IconBase,
    ImageUploader,
    ImageItem
  },
  props: {
    groupVariantListID: {
      type: String,
      required: true
    },
    variantIdx: {
      type: Number,
      required: true
    },
    previewIdx: Number
  },
  data() {
    return {
      variantNameInput: "",
      renameVariantStatus: false,
      debouncedUpdateVariantName: this.debounce(this.updateVariantName, 500),
      hover: false,
      copyVariantInputs: [] //each index represent a copyVariantList
    };
  },
  computed: {
    groupVariantList() {
      return this.$store.getters.groupVariantList(this.groupVariantListID);
    },
    imageVariantLists() {
      return this.getImageVariantListsByGroupID(this.groupVariantListID);
    },
    copyVariantLists() {
      return this.getCopyVariantListsByGroupID(this.groupVariantListID);
    },
    groupVariantName() {
      return this.$store.getters.groupVariantNamesByList(
        this.groupVariantListID
      )[this.variantIdx];
    },
    currentPreviewGroup() {
      return this.previewIdx === this.variantIdx;
    }
  },
  mounted() {
    this.initializeCopyVariants();
  },
  methods: {
    imageIsUploaded(variantID) {
      return variantID !== "";
    },
    getImageVariant(variantID) {
      return this.$store.getters.imageVariant(variantID);
    },
    initializeCopyVariants() {
      //setup copyVariantInputs to display existing copyVariant

      this.copyVariantLists.forEach(list => {
        let variantID = list.variantIDs[this.variantIdx];

        if (variantID) {
          let variant = this.$store.getters.copyVariant(variantID);
          let copyString = "";
          if (variant.copyLineIDs.length > 0) {
            copyString = this.getStringOfCopyVariant(variant);
          }

          this.copyVariantInputs.push(copyString);
        }
      });
    },
    renameVariant() {
      this.renameVariantStatus = true;
      this.$refs.variantName.focus();
    },
    updateVariantName() {
      let payload = {
        groupVariantListID: this.groupVariantListID,
        variantIdx: this.variantIdx,
        variantName: this.variantNameInput
      };
      this.$store.dispatch("updateGroupVariantName", payload);
      this.updateCopyVariantName();
    },
    updateCopyVariantName() {
      //update all the copyVariant name to be the new groupVariant name
      this.copyVariantLists.forEach(list => {
        let variantID = list.variantIDs[this.variantIdx];
        let variant = this.$store.getters.copyVariant(variantID);
        variant.name = this.variantNameInput;

        this.$store.dispatch("updateCopy", variant);
      });
    },
    storeImage(imageFile, listID) {
      //create image
      let formData = new FormData();
      formData.append("asset_file", imageFile);

      this.$store
        .dispatch("createImage", {
          formData,
          imageFile,
          listID
        })
        .then(image => {
          image.variantIdx = this.variantIdx;
          this.$store.dispatch("updateImageInList", image); //update image.id in list.variantIDs arr to real ID
        });
    },
    removeImage(variantID) {
      //delete image
      let imageVariant = this.$store.getters.imageVariant(variantID);
      this.$store.dispatch("deleteImage", imageVariant);

      //update image.id in list.variantIDs arr to be empty string for placeholder role
      imageVariant.id = "";
      this.$store.dispatch("updateImageInList", imageVariant);
    },
    updateCopyLines(event, copyVariantID) {
      let newLines = event.target.value.split(/\n/);
      let oldLines = [];
      let copyVariant = this.$store.getters.copyVariant(copyVariantID);

      if (copyVariant.copyLineIDs.length > 0) {
        oldLines = this.$store.getters.copyLinesByVariant(copyVariant);
      }

      let mostLines = newLines.length >= oldLines.length ? newLines : oldLines;
      let fewerLines = newLines.length >= oldLines.length ? oldLines : newLines;

      for (let i = 0; i < mostLines.length; i++) {
        let newLine = newLines[i];
        let oldLine = oldLines[i];

        if (fewerLines.length > i) {
          this.$store.dispatch(
            "updateCopyLine",
            Object.assign({}, oldLine, { text: newLine, index: i })
          );
        } else if (oldLines.length < newLines.length) {
          this.$store.dispatch("createCopyLine", {
            variantID: copyVariantID,
            text: newLine,
            index: i
          });
        } else {
          this.$store.dispatch("deleteCopyLine", oldLine);
        }
      }
    },
    deleteGroupVariant() {
      let variant = {
        groupVariantListID: this.groupVariantListID,
        variantIdx: this.variantIdx
      };
      this.$store.dispatch("deleteGroupVariant", variant);
      this.$store.dispatch("setVariantCountFlag");
    },
    previewGroupVariant() {
      application.editDocument(() => {
        this.previewImageVariantInGroup();
        this.previewCopyVariantInGroup();
      });
      this.$emit("changePreview");
    },
    previewImageVariantInGroup() {
      //apply imageVariant to all the nodes map to this list
      this.imageVariantLists.forEach(list => {
        let variantID = list.variantIDs[this.variantIdx];

        //if imageVariant is nonempty
        if (variantID !== "") {
          let variant = this.$store.getters.imageVariant(variantID);
          this.$store.dispatch("updateImageNodes", variant);
        }
      });
    },
    previewCopyVariantInGroup() {
      //apply copyVariant to all the nodes map to this list
      this.copyVariantLists.forEach((list, idx) => {
        let variantID = list.variantIDs[this.variantIdx];
        let variant = this.$store.getters.copyVariant(variantID);

        this.$store.dispatch("updateCopyNodes", {
          listID: list.id,
          text: this.copyVariantInputs[idx]
        });
      });
    }
  }
};
</script>

<style scoped>
.combo-header {
  padding-right: 2px;
}
.combo-title {
  color: #2b2b2b;
  font-size: 0.68rem;
}

.combo-variant-divider {
  height: 1px;
  background-color: rgba(112, 112, 112, 0.1);
}
.combo-variant-title {
  color: #656565;
  font-size: 0.65rem;
}
.combo-image-uploader {
  padding-right: 0.75rem;
}
.combo-image-list-item {
  padding-right: 0.7rem;
}
.combo-textarea {
  height: 4.75rem;
}
</style>