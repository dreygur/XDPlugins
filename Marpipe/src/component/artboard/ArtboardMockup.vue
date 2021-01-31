<template>
  <div :style="getArtboardCSS()">
    <div
      v-for="artwork in artworks"
      :key="artwork.guid"
      :style="getArtworkCSS(artwork)"
      :class="{'highlight-artwork': artwork === selectedNode}"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Experiment from "@/utils/Experiment.js";

export default {
  name: "ArtboardMockup",
  mixins: [Experiment],
  props: {
    artboard: {
      type: Object
    },
    artworks: {
      type: Array
    }
  },
  data() {
    return {
      selectedNode: {}
    };
  },
  computed: {
    ...mapGetters(["selection", "isSingleSelection", "updateFlag"])
  },
  created() {
    this.setSelectedNode();
  },
  watch: {
    updateFlag() {
      this.setSelectedNode();
    }
  },
  methods: {
    setSelectedNode() {
      if (this.isSingleSelection) {
        this.selectedNode = this.selection.items[0];
      } else {
        this.selectedNode = null;
      }
    },
    getArtboardCSS() {
      let ratio = this.artboard.height / this.artboard.width;

      let artboardCSS = {
        width: 64 + "px",
        height: 64 * ratio + "px",
        position: "relative",
        borderRadius: "4px",
        backgroundColor: "rgba(217, 217, 217, .5)"
      };

      return artboardCSS;
    },
    getArtworkCSS(node) {
      let artwork = Object.assign(
        {},
        this.getArtworkDimension(node),
        this.getArtworkPosition(node)
      );

      let width = (artwork.width / this.artboard.width) * 100 + "%";
      let height = (artwork.height / this.artboard.height) * 100 + "%";

      let artworkCSS = {
        width: width,
        height: height,
        position: "absolute",
        top: artwork.top,
        left: artwork.left,
        backgroundColor: "rgba(181, 181, 181, .5)"
      };

      return artworkCSS;
    },
    getArtworkDimension(node) {
      //boundsInParent dimension value is useful to create a rectangle that represents a rotated node
      let dimension = {
        width: node.boundsInParent.width,
        height: node.boundsInParent.height
      };

      return dimension;
    },
    getArtworkPosition(node) {
      let position = {
        top: (node.boundsInParent.y / this.artboard.height) * 100 + "%",
        left: (node.boundsInParent.x / this.artboard.width) * 100 + "%"
      };

      return position;
    }
  }
};
</script>

<style scoped>
.highlight-artwork {
  border: 1px solid #9c90ff;
}
</style>
