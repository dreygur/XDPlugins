<template>
  <div :style="getGroupCSS()">
    <div v-for="artwork in artworks" :key="artwork.guid" :style="getArtworkCSS(artwork)"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GroupMockup",
  props: {
    group: {
      type: Object
    },
    artworks: {
      type: Array
    }
  },
  methods: {
    getGroupCSS() {
      let ratio =
        this.group.boundsInParent.height / this.group.boundsInParent.width;

      let groupCSS = {
        width: 100 + "px",
        height: 100 * ratio + "px",
        position: "relative",
        borderRadius: "4px",
        backgroundColor: "rgba(217, 217, 217, .5)"
      };

      return groupCSS;
    },
    getArtworkCSS(node) {
      let artwork = Object.assign(
        {},
        this.getArtworkDimension(node),
        this.getArtworkPosition(node)
      );

      let artworkWidth =
        (artwork.width / this.group.boundsInParent.width) * 100 + "%";
      let artworkHeight =
        (artwork.height / this.group.boundsInParent.height) * 100 + "%";

      let artworkCSS = {
        width: artworkWidth,
        height: artworkHeight,
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
      //boundsInParent value is not useful to create a pictorial relationship between the group and nested artworks
      let x = node.globalBounds.x - this.group.globalBounds.x; //artwork x value relative to its parent (group node)
      let y = node.globalBounds.y - this.group.globalBounds.y; //artwork y value relative to its parent (group node)

      let position = {
        top: (y / this.group.globalBounds.height) * 100 + "%",
        left: (x / this.group.globalBounds.width) * 100 + "%"
      };

      return position;
    }
  }
};
</script>
