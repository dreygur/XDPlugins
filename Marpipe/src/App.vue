<template>
  <div>
    <router-view v-if="CONNECTED"/>
    <span v-else class="w-full text-md">
      You must be connected to the internet in order to use Marpipe, check your network settings.
    </span>
  </div>
</template>

<script>
import Experiment from "@/utils/Experiment.js";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "App",
  mixins: [Experiment],
  computed: {
    ...mapGetters(["selection", "updateFlag", "mapFlag", "CONNECTED"])
  },
  created() {
    this.setSelectionStatus();
    this.updateConnection()
    window.addEventListener('online', this.updateConnection)
    window.addEventListener('offline', this.updateConnection)
  },
  
  watch: {
    updateFlag() {
      this.setSelectionStatus();
      this.trackNodeDeletion();
    },
    mapFlag() {
      this.setSelectionStatus();
    }
  },
  methods: {
    updateConnection(){
      this.$store.dispatch("updateConnection")
      this.$store.dispatch("removeAllDesign");
      this.$store.dispatch("resetImages");
      this.$store.dispatch("resetCopies");
      this.$store.dispatch("resetGroupVariants");
      this.$store.dispatch("setMapFlag");
      this.$store.dispatch("setVariantCountFlag");
    },
    setSelectionStatus() {
      let isSingleSelection = this.isSingleSelectionVal();
      let selectionIsInsideArtboard;
      let selectionIsMappedNode;
      let selectionIsMappableNode;
      let selectionVariantType;

      if (isSingleSelection) {
        let node = this.selection.items[0];
        selectionIsInsideArtboard = this.isInsideArtboardVal(node);
        selectionIsMappedNode = this.isMappedNodeVal(node);
        selectionIsMappableNode = this.isMappableNodeVal(node);
        selectionVariantType = this.getNodeVariantType(node);
      } else {
        selectionIsInsideArtboard = false;
        selectionIsMappedNode = false;
        selectionIsMappableNode = false;
        selectionVariantType = "";
      }

      this.$store.dispatch("setIsSingleSelection", isSingleSelection);
      this.$store.dispatch("setIsInsideArtboard", selectionIsInsideArtboard);
      this.$store.dispatch("setIsMappedNode", selectionIsMappedNode);
      this.$store.dispatch("setIsMappableNode", selectionIsMappableNode);
      this.$store.dispatch("setNodeVariantType", selectionVariantType);
    }
  }
};
</script>

<style scoped>
</style>
