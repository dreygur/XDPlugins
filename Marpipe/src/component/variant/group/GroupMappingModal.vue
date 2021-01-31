<template>
  <dialog>
    <form method="dialog" @submit.prevent="map()" class="map-dialog">
      <div class="font-bold text-base text-left">Link Your Group Variants</div>
      <div class="map-dialog-section-divider w-full my-3"></div>

      <main class="mb-4">
        <div
          v-show="errorMessage === ''"
          class="map-dialog-instruction text-xs"
        >Assign your artwork to unique variants.</div>
        <div
          v-show="errorMessage !== ''"
          class="map-dialog-instruction text-xs text-red-400"
        >{{ errorMessage }}</div>
        <div class="w-full py-10 flex justify-center">
          <GroupMockup
            v-if="mappableArtworks.length > 0"
            :group="selectedGroup"
            :artworks="mappableArtworks"
          />
        </div>

        <label v-for="mapping in mappings" :key="mapping.id">
          <div class="w-full flex items-center">
            <div class="flex items-center mr-1">
              <span
                :title="mapping.node.name"
                class="w-24 truncate text-xs font-regular"
              >{{ mapping.node.name }}</span>
              <span>To</span>
            </div>

            <select class="w-32" @change="updateMapping(mapping.node, $event)">
              <option
                v-for="list in getVariantLists(mapping.node)"
                :key="list.id"
                :title="list.name"
                :value="list.name"
                :selected="list.id === mapping.listID"
              >{{ list.name }}</option>
            </select>
          </div>
        </label>
      </main>

      <footer class="flex justify-end">
        <button uxp-variant="secondary" class="mr-3" @click="close()">Cancel</button>
        <button
          v-show="isMappedNode"
          type="button"
          uxp-variant="warning"
          class="mr-3"
          @click="unmap()"
        >Unlink</button>
        <button type="submit" uxp-variant="cta">Submit</button>
      </footer>
    </form>
  </dialog>
</template>

<script>
import { nanoid } from "nanoid/non-secure";
import { mapGetters } from "vuex";
import Experiment from "@/utils/Experiment.js";
import GroupMockup from "@/component/variant/group/GroupMockup.vue";

export default {
  name: "GroupMappingModal",
  mixins: [Experiment],
  components: {
    GroupMockup
  },
  props: {
    dialog: {},
    groupVariantListID: {
      //if it's an empty string, then need to create a new groupVariantList
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedGroup: {},
      groupVariantList: {},
      imageVariantLists: [],
      copyVariantLists: [],
      mappings: [], //[{node, listName, listID}, {mapping#2}, {mapping#3}, etc]
      mappableArtworks: [], //for groupMockup
      errorMessage: ""
    };
  },
  computed: {
    ...mapGetters(["selection", "groupVariantLists", "isMappedNode"])
  },
  mounted() {
    this.resetMapping();
    this.setMappingData();
  },
  methods: {
    resetMapping() {
      this.mappings = [];
    },
    setMappingData() {
      this.selectedGroup = this.selection.items[0];

      this.setVariantLists();
      this.setMappingNode();

      if (this.isExistingMapping()) {
        this.setMappingList();
      }
    },
    setDummyVariantList() {
      let imageNodeCount = this.getImageNodeCountInGroup(this.selectedGroup);
      let copyNodeCount = this.getCopyNodeCountInGroup(this.selectedGroup);

      for (let i = 0; i < imageNodeCount; i++) {
        let list = {
          id: nanoid(),
          name: `Image-${i + 1}`
        };
        this.imageVariantLists.push(list);
      }

      for (let i = 0; i < copyNodeCount; i++) {
        let list = {
          id: nanoid(),
          name: `Text-${i + 1}`
        };
        this.copyVariantLists.push(list);
      }
    },
    setVariantLists() {
      if (this.groupVariantListID === "") {
        //if user wants to create a new groupVariantList, create dummy imageVariantLists and dummy copyVariantLists
        let imageNodeCount = this.getImageNodeCountInGroup(this.selectedGroup);
        let copyNodeCount = this.getCopyNodeCountInGroup(this.selectedGroup);

        for (let i = 0; i < imageNodeCount; i++) {
          let list = {
            id: nanoid(),
            name: `Image-${i + 1}`
          };
          this.imageVariantLists.push(list);
        }

        for (let i = 0; i < copyNodeCount; i++) {
          let list = {
            id: nanoid(),
            name: `Text-${i + 1}`
          };
          this.copyVariantLists.push(list);
        }
      } else {
        //setup existing variant lists
        this.groupVariantList = this.$store.getters.groupVariantList(
          this.groupVariantListID
        );
        this.imageVariantLists = this.getImageVariantListsByGroupID(
          this.groupVariantListID
        );
        this.copyVariantLists = this.getCopyVariantListsByGroupID(
          this.groupVariantListID
        );
      }
    },
    setMappingNode() {
      //initialize mappings with mappable artwork data
      this.selectedGroup.children.forEach(node => {
        if (
          this.isValidNodeForImageMapping(node) ||
          this.isValidNodeForCopyMapping(node)
        ) {
          let mapping = {
            id: nanoid(),
            node,
            listID: "",
            listName: ""
          };

          this.mappings.push(mapping);
          this.mappableArtworks.push(node);
        }
      });
    },
    setMappingList() {
      //setup existing variantList data mapped to node
      this.mappings.forEach(mapping => {
        let node = mapping.node;
        let variantList;

        if (this.isValidNodeForImageMapping(node)) {
          variantList = this.$store.getters.imageVariantList(node.listID);
        } else if (this.isValidNodeForCopyMapping(node)) {
          variantList = this.$store.getters.copyVariantList(node.listID);
        }

        mapping.listID = variantList.id;
        mapping.listName = variantList.name;
      });
    },
    getVariantLists(node) {
      //return all the variant list that can be mapped to node
      if (this.isValidNodeForImageMapping(node)) {
        return this.imageVariantLists;
      } else if (this.isValidNodeForCopyMapping(node)) {
        return this.copyVariantLists;
      }
    },
    updateMapping(node, event) {
      //update list mapped to node in this.mappings based on user input
      let listIdx = event.target.selectedIndex;
      let mapping = this.mappings.find(mapping => mapping.node === node);

      mapping.listName = event.target.value;

      if (this.isValidNodeForImageMapping(node)) {
        mapping.listID = this.imageVariantLists[listIdx].id;
      } else if (this.isValidNodeForCopyMapping(node)) {
        mapping.listID = this.copyVariantLists[listIdx].id;
      }
    },
    mapGroupNode() {
      //add to groupVariantList.mappedGroupNodes
      this.selectedGroup.listID = this.groupVariantList.id;
      this.$store.dispatch("mapGroupNode", this.selectedGroup);
      this.$store.dispatch("addMappingToDesign", this.selectedGroup);
    },
    mapGroupChildrenNode() {
      //mappings [{node, listName, listID}, {mapping#2}, {mapping#3}, etc]
      this.mappings.forEach(mapping => {
        let node = mapping.node;
        let listID = mapping.listID;

        if (this.isValidNodeForImageMapping(node)) {
          node.originalFill = node.fill;
          node.listID = listID;
          this.$store.dispatch("mapImageNode", node);
        } else if (this.isValidNodeForCopyMapping(node)) {
          node.originalText = node.text;
          node.listID = listID;
          this.$store.dispatch("mapCopyNode", node);
        }
      });
    },
    unmapGroupChildrenNode() {
      let mappedImageNodes = this.$store.getters.imageNodes;
      let mappedCopyNodes = this.$store.getters.copyNodes;

      this.mappings.forEach(mapping => {
        let node = mapping.node;

        if (mappedImageNodes.hasOwnProperty(node.guid)) {
          this.$store.dispatch("unmapImageNode", node);
        } else if (mappedCopyNodes.hasOwnProperty(node.guid)) {
          this.$store.dispatch("unmapCopyNode", node);
        }
      });
    },
    revertArtworkOriginalContent() {
      const application = require("application");

      application.editDocument(() => {
        this.selectedGroup.children.forEach(node => {
          if (this.isValidNodeForImageMapping(node)) {
            node.fill = node.originalFill;
          } else if (this.isValidNodeForCopyMapping(node)) {
            node.text = node.originalText;
          }
        });
      });
    },
    createInitialCopyVariant() {
      //initialize the newly created copyVariant with the mapped copyNode.text

      this.copyVariantLists.forEach(async copyVariantList => {
        let list = this.$store.getters.copyVariantList(copyVariantList.id); //retrieve the newly created list from store
        let initialCopyNode = this.$store.getters.copyNode(list.nodeIDs[0]);
        let initialCopyVariant = this.$store.getters.copyVariant(
          list.variantIDs[0]
        );
        let copyLines = initialCopyNode.text.split(/\n/);
        let variantName = this.$store.getters.groupVariantNamesByList(
          this.groupVariantList.id
        )[0];

        await this.$store
          .dispatch("createCopy", { name: variantName, listID: list.id })
          .then(copy => {
            this.$store.dispatch("addCopyToList", copy);

            copyLines.forEach((copyLine, index) => {
              this.$store.dispatch("createCopyLine", {
                variantID: copy.id,
                text: copyLine,
                index
              });
            });
          });

        this.$store.dispatch(
          "incrementGroupVariantCount",
          this.groupVariantList.id
        );
      });
    },
    applyInitialGroupVariantToNode() {
      const application = require("application");

      application.editDocument(() => {
        this.mappings.forEach(mapping => {
          let initialVariant;
          let node = mapping.node;

          if (this.isValidNodeForImageMapping(node)) {
            let imageVariants = this.$store.getters.imageVariantsByList(
              node.listID
            );
            let initialVariant = imageVariants[0];

            if (initialVariant) {
              this.applyImageVariantToNode(node, initialVariant);
            }
          } else if (this.isValidNodeForCopyMapping(node)) {
            let copyVariants = this.$store.getters.copyVariantsByList(
              node.listID
            );
            let initialVariant = copyVariants[0];
            this.applyCopyVariantToNode(node, initialVariant);
          }
        });
      });
    },
    isValidMapping() {
      return this.isAllMapped() && this.isUniqueMapping();
    },
    isUniqueMapping() {
      //verifies that all nodes are mapped to different variantList
      let listNames = this.mappings.map(mapping => mapping.listName);
      let uniquelistNames = [...new Set(listNames)];
      return uniquelistNames.length === listNames.length;
    },
    isAllMapped() {
      let emptyMappings = this.mappings.filter(
        mapping => mapping.listID === ""
      );
      return emptyMappings.length === 0;
    },
    isExistingMapping() {
      return this.isMappedNode && this.groupVariantListID !== "";
    },
    createNewVariantLists() {
      let groupVariantListID = nanoid();
      this.$store.dispatch("createGroupVariantList", groupVariantListID);
      this.groupVariantList = this.$store.getters.groupVariantList(
        groupVariantListID
      );

      this.imageVariantLists.forEach(list => {
        //create new imageVariantList
        this.$store.dispatch("createImageVariantList", {
          id: list.id,
          name: list.name
        });

        let newList = this.$store.getters.imageVariantList(list.id);
        newList.groupVariantListID = this.groupVariantList.id;
        newList.variantIDs.push("");
        this.$store.dispatch("updateImageVariantList", newList);

        //record newly created imageVariantList in groupVariantList
        this.$store.dispatch("addImageVariantListToGroup", newList);
      });

      this.copyVariantLists.forEach(list => {
        //create new copyVariantList
        this.$store.dispatch("createCopyVariantList", {
          id: list.id,
          name: list.name
        });

        let newList = this.$store.getters.copyVariantList(list.id);

        //add groupVariantListID property to copyVariantList
        newList.groupVariantListID = this.groupVariantList.id;
        this.$store.dispatch("updateCopyVariantList", newList);

        //record newly created copyVariantList in groupVariantList
        this.$store.dispatch("addCopyVariantListToGroup", newList);
      });
    },
    map() {
      if (this.isValidMapping()) {
        this.errorMessage = "";

        if (!this.isMappedNode) {
          if (this.groupVariantListID === "") {
            //map to new groupVariantList
            this.createNewVariantLists();
            this.mapGroupNode();
            this.mapGroupChildrenNode();
            this.createInitialCopyVariant();
          } else {
            //map to existing groupVariantList
            this.mapGroupNode();
            this.mapGroupChildrenNode();
            this.applyInitialGroupVariantToNode();
          }
        } else if (this.isExistingMapping()) {
          //update existing mapping
          this.unmapGroupChildrenNode();
          this.mapGroupChildrenNode();
        }
        this.close();
      } else {
        this.errorMessage =
          "Please link all your artworks to a unique variant.";
      }
    },
    unmap() {
      this.revertArtworkOriginalContent();
      this.$store.dispatch("unmapGroupNode", this.selectedGroup);
      this.$store.dispatch("deleteMappingFromDesign", this.selectedGroup);
      this.close();
    },
    close() {
      this.dialog.close();
    }
  }
};
</script>

<style scoped>
.map-dialog {
  width: 23rem;
}
.map-dialog-instruction {
  /* 14px regular */
  color: #4b4b4b;
}
.map-dialog-section-divider {
  height: 2px;
  background-color: #e1e1e1;
}
.map-dialog-artwork {
  /* 12px regular */
  color: #6e6e6e;
}
.map-dialog-dropdown {
  /* 14px regular */
  color: #4b4b4b;
}

.text-red-400 {
  color: rgb(204, 81, 65);
}
</style>