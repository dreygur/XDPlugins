<template>
  <section>
    <!-- GROUP VARIANT HEADER -->
    <div class="flex justify-between">
      <div class="flex items-center">
        <!-- TOGGLE CONTENT ICON -->
        <IconBase
          :icon="expandContent ? 'triangle-point-down' : 'triangle-point-right'"
          @click.native="expandContent = !expandContent"
          class="triangle-pointer-icon mr-1"
        />

        <IconBase icon="combo" class="w-4 h-4 mr-1" />

        <!-- GROUP VARIANT LIST NAME -->
        <div class="flex">
          <span
            v-show="!renameListStatus"
            @dblclick.stop="renameVariantList()"
            class="variant-list-title truncate mr-2 cursor-text"
            :class="listStatusStyle()"
          >{{ listNameInput || groupVariantListName}}</span>

          <form v-show="renameListStatus" @submit.prevent="renameListStatus = false">
            <input
              ref="listName"
              type="text"
              v-model="listNameInput"
              @input="debouncedUpdateListName"
              @blur="renameListStatus = false"
              :placeholder="listNameInput || groupVariantListName"
            />
          </form>
        </div>
      </div>

      <div class="flex items-center">
        <IconBase
          v-show="isMappedToSelection"
          icon="pencil"
          @click.native="$emit('map', groupVariantListID)"
          class="pencil-icon mr-2"
        />
        <IconBase
          v-show="isMappableToSelection"
          icon="link"
          @click.native="$emit('map', groupVariantListID)"
          class="link-icon mr-2"
        />
        <IconBase icon="plus" @click.native="addGroupVariant()" class="plus-icon mr-2" />
        <IconBase icon="trash" @click.native="deleteGroupVariantList()" class="trash-icon" />
      </div>
    </div>

    <!-- GROUP VARIANT CONTENT -->
    <div v-show="expandContent" class="py-2">
      <GroupVariant
        v-for="n in variantCount"
        :key="`Combo-${n}`"
        :groupVariantListID="groupVariantListID"
        :variantIdx="n-1"
        @changePreview="changePreview(n-1)"
        :previewIdx="previewIdx"
        :class="{'mb-2': n !== variantCount}"
      />
    </div>

  </section>
</template>

<script>
import IconBase from "@/lib/icon/IconBase.vue";
import GroupVariant from "@/component/variant/group/GroupVariant.vue";
import Experiment from "@/utils/Experiment.js";
import { mapGetters } from "vuex";

export default {
  name: "GroupVariantList",
  mixins: [Experiment],
  components: {
    IconBase,
    GroupVariant
  },
  props: {
    groupVariantListID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      expandContent: true,
      listNameInput: "",
      renameListStatus: false,
      debouncedUpdateListName: this.debounce(this.updateListName, 500),
      previewIdx: null,
      selectionListID: "", //stores the index of groupVariantList mapped to selection,
      isMappableToSelection: false
    };
  },
  computed: {
    ...mapGetters([
      "updateFlag",
      "selection",
      "isSingleSelection",
      "isMappableNode",
      "isMappedNode"
    ]),
    groupVariantList: {
      get() {
        return this.$store.getters.groupVariantList(this.groupVariantListID);
      },
      set(updatedList) {
        this.$store.dispatch("setGroupVariantList", updatedList);
      }
    },
    imageVariantLists() {
      return this.getImageVariantListsByGroupID(this.groupVariantListID);
    },
    copyVariantLists() {
      return this.getCopyVariantListsByGroupID(this.groupVariantListID);
    },
    groupVariantListName() {
      return this.groupVariantList.name;
    },
    imageNodeCountInList() {
      return this.imageVariantLists.length;
    },
    copyNodeCountInList() {
      return this.copyVariantLists.length;
    },
    isMappedList() {
      return this.groupVariantList.groupNodes.length > 0;
    },
    isMappedToSelection() {
      return this.groupVariantListID === this.selectionListID;
    },
    variantCount() {
      return this.groupVariantList.variantCount;
    }
  },
  created() {
    this.setSelectionListID();
    this.listNameInput = this.groupVariantListName;
  },
  watch: {
    updateFlag() {
      this.setSelectionListID();
      this.setIsMappableToSelection();
    }
  },
  methods: {
    renameVariantList() {
      this.renameListStatus = true;
      this.$refs.listName.focus();
    },
    updateListName() {
      this.groupVariantList.name = this.listNameInput;
    },
    setSelectionListID() {
      //setup the listID of mapped selection
      let isMappedGroupNode =
        this.isMappedNode &&
        this.isValidNodeForGroupMapping(this.selection.items[0]);

      isMappedGroupNode
        ? (this.selectionListID = this.selection.items[0].listID)
        : (this.selectionListID = "");
    },
    setIsMappableToSelection() {
      if (this.isMappableNode) {
        let node = this.selection.items[0];

        let imageNodeCountMatch =
          this.getImageNodeCountInGroup(node) === this.imageNodeCountInList;
        let copyNodeCountMatch =
          this.getCopyNodeCountInGroup(node) === this.copyNodeCountInList;

        if (
          this.isValidNodeForGroupMapping(node) &&
          imageNodeCountMatch &&
          copyNodeCountMatch
        ) {
          this.isMappableToSelection = true;
        } else {
          this.isMappableToSelection = false;
        }
      } else {
        this.isMappableToSelection = false;
      }
    },
    listStatusStyle() {
      //selection status is priority
      if (this.isMappedToSelection) {
        return "isMappedToSelectionStatus";
      }

      return this.isMappedList ? "mappedStatus" : "unMappedStatus";
    },
    addGroupVariant() {
      this.$store.dispatch("addGroupVariant", this.groupVariantListID);
      this.addImageVariantInGroup();
      this.addCopyVariantInGroup();
    },
    addImageVariantInGroup() {
      //create an empty image variant placeholder by adding empty ID string for each list.variantIDs arr
      this.imageVariantLists.forEach((list, idx, arr) => {
        arr[idx].variantIDs.push("");
        this.$store.dispatch("updateImageVariantList", arr[idx]);
      });
    },
    addCopyVariantInGroup() {
      let variantNames = this.$store.getters.groupVariantNamesByList(
        this.groupVariantListID
      );
      let newVariantName = variantNames[variantNames.length - 1];

      //create an empty copy variant placeholder by creating an actual copyVariant with empty copyLines
      this.copyVariantLists.forEach(list => {
        this.$store
          .dispatch("createCopy", {
            listID: list.id,
            name: newVariantName
          })
          .then(newCopy => {
            this.$store.dispatch("addCopyToList", newCopy);

            this.$store.dispatch(
              "incrementGroupVariantCount",
              this.groupVariantListID
            );
          });
      });
    },
    deleteGroupVariantList() {
      this.$store.dispatch("deleteGroupVariantList", this.groupVariantListID);
    },
    changePreview(variantIdx) {
      this.previewIdx = variantIdx;
    }
  }
};
</script>

<style scoped>
.isMappedToSelectionStatus {
  color: #45b5ee;
}

.unMappedStatus {
  color: #fa9f67;
}

.mappedStatus {
  color: #666666;
}
</style>