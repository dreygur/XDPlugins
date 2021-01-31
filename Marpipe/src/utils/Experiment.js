
export default {
  name: "Experiment",
  methods: {
    async uploadMultipleImages() {
      const storage = require('uxp').storage;
      const fs = storage.localFileSystem;
      const imageFiles = await fs.getFileForOpening({ allowMultiple: true, types: storage.fileTypes.images });
      // imageFiles = Array.from(imageFiles);

      return imageFiles;    //array of image localPaths
    },
    async uploadSingleImage() {
      const storage = require('uxp').storage;
      const fs = storage.localFileSystem;
      const imageFile = await fs.getFileForOpening({ allowMultiple: false, types: storage.fileTypes.images });

      return imageFile;
    },
    applyImageVariantToNode(node, variant) {
      //function must be called inside application.editDocument
      if (variant.localPath !== "") {
        const ImageFill = require("scenegraph").ImageFill;
        let fill = new ImageFill(variant.localPath);

        if (node.constructor.name === "Path") {
          node.fillEnabled = true;
        }
        node.fill = fill;
      }
    },
    applyCopyVariantToNode(node, variant) {
      //function must be called inside application.editDocument  
      let textString = this.getStringOfCopyVariant(variant);
      if (textString !== "") {
        node.text = textString;
      }
    },
    getImageVariantListsByGroupID(groupVariantListID) {
      let imageVariantListIDs = this.$store.getters.groupVariantList(groupVariantListID).imageVariantListIDs;
      let imageVariantLists = imageVariantListIDs.map(listID =>
        this.$store.getters.imageVariantList(listID)
      );
      return imageVariantLists; //an array of imageVariantLists
    },
    getCopyVariantListsByGroupID(groupVariantListID) {
      let copyVariantListIDs = this.$store.getters.groupVariantList(groupVariantListID).copyVariantListIDs;
      let copyVariantLists = copyVariantListIDs.map(listID =>
        this.$store.getters.copyVariantList(listID)
      );
      return copyVariantLists; //an array of copyVariantLists
    },
    getImageNodeVariant(node, variantIdx) {
      let variantList = this.$store.getters.imageVariantList(node.listID);
      let variantID = variantList.variantIDs[variantIdx];
      let variant = this.$store.getters.imageVariant(variantID);
      return variant;
    },
    getCopyNodeVariant(node, variantIdx) {
      let variantList = this.$store.getters.copyNodeVariantList(node);
      let variantID = variantList.variantIDs[variantIdx];
      let variant = this.$store.getters.copyVariant(variantID);
      return variant;
    },
    getGroupNodeVariants(node, variantIdx) {
      let variants = [];

      node.children.forEach(child => {
        if (this.isValidNodeForImageMapping(child)) {
          let variant = this.getImageNodeVariant(child, variantIdx)
          variants.push(variant);
        }
        else if (this.isValidNodeForCopyMapping(child)) {
          let variant = this.getCopyNodeVariant(child, variantIdx)
          variants.push(variant);
        }
        else {
          variants.push(null);                                                   //so the index of corresponding variant matched child index
        }
      })

      return variants;
    },
    getArrayOfItem(iterableObject) {
      let arr = [];
      iterableObject.forEach(item => arr.push(item));

      return arr;
    },
    getStringOfCopyVariant(copyVariant) {
      let copyLines = this.$store.getters.copyLinesByVariant(copyVariant);
      let textString = copyLines.map(copyLine => copyLine.text);
      let isEmptyText = textString.join("").replace(/\s+$/, "") === "";

      return isEmptyText ? "" : textString.join("\n");
    },
    getNodeVariantType(node) {
      if (this.isValidNodeForImageMapping(node)) {
        return "Image";
      } else if (this.isValidNodeForCopyMapping(node)) {
        return "Text";
      } else if (this.isValidNodeForGroupMapping(node)) {
        return "Group";
      }
    },
    getImageNodeCountInGroup(groupNode) {
      //calculates the number of image nodes in the group
      let counter = 0;
      groupNode.children.forEach(node => {
        if (this.isValidNodeForImageMapping(node)) {
          counter++;
        }
      });

      return counter;
    },
    getCopyNodeCountInGroup(groupNode) {
      //calculates the number of text nodes in the group
      let counter = 0;
      groupNode.children.forEach(node => {
        if (this.isValidNodeForCopyMapping(node)) {
          counter++;
        }
      });

      return counter;
    },
    isSingleSelectionVal() {
      return this.selection.items.length === 1
    },
    isInsideArtboardVal() {
      let node = this.selection.items[0];
      return node.parent.constructor.name === 'Artboard';
    },
    isValidNodeForMapping(node) {
      return this.isValidNodeForImageMapping(node) || this.isValidNodeForCopyMapping(node) || this.isValidNodeForGroupMapping(node);
    },
    isValidNodeForImageMapping(node) {
      //valid if it is a 'Rectangle || Ellipse || Polygon || Path' artwork which can be filled by an image
      switch (node.constructor.name) {
        case "Rectangle":
        case "Ellipse":
        case "Polygon":
        case "Path":
          return true;
        default:
          return false;
      }
    },
    isValidNodeForCopyMapping(node) {
      return node.constructor.name === "Text";
    },
    isValidNodeForGroupMapping(node) {
      //valid if it is a 'Group' scenenode that contains at least 2 valid artwork (image+image, text+text, image+text)

      if (node.constructor.name === "Group") {
        let graphicCounter = 0;

        node.children.forEach(artworkNode => {
          if (
            this.isValidNodeForImageMapping(artworkNode) ||
            this.isValidNodeForCopyMapping(artworkNode)
          ) {
            graphicCounter++;
          }
        });

        if (graphicCounter >= 2) {
          return true;
        }
      }

      return false;
    },
    isMappedArtboard(node) {
      return this.$store.getters.designIdxByArtboardNode(node) !== -1;
    },
    isMappedNodeVal(node) {
      return this.$store.getters.designIdxByNode(node) !== -1;
    },
    isMappableNodeVal(node) {
      //node is mappable if it's inside artboard, can map to image/text/group but unmapped
      return this.isInsideArtboardVal(node) && this.isValidNodeForMapping(node) && !this.isMappedNodeVal(node);
    },
    isMappedGroupImageNodeVal(node) {
      let imageNodes = this.$store.getters.groupImageNodes;
      return imageNodes.hasOwnProperty(node.guid);
    },
    isMappedGroupCopyNodeVal(node) {
      let copyNodes = this.$store.getters.groupCopyNodes;
      return copyNodes.hasOwnProperty(node.guid);
    },
    getMappedGroupChildren(node) {
      let mappedChildren = [];
      let mappedImageNodes = this.$store.getters.imageNodes;
      let mappedCopyNodes = this.$store.getters.copyNodes;

      node.children.forEach(child => {
        let isMappedImageNode = mappedImageNodes.hasOwnProperty(child.guid);
        let isMappedCopyNode = mappedCopyNodes.hasOwnProperty(child.guid);

        if (isMappedImageNode || isMappedCopyNode) {
          mappedChildren.push(child);
        }
      })

      return mappedChildren;
    },
    trackNodeDeletion() {
      //remove mapping of deleted mapped node
      let designs = this.$store.getters.designs;

      designs.forEach(design => {
        design.mappedNodes.forEach(node => {
          if (this.isValidNodeForImageMapping(node) && !node.isInArtworkTree) {
            this.$store.dispatch("unmapImageNode", node);
            this.$store.dispatch("deleteMappingFromDesign", node);
          }
          else if (this.isValidNodeForCopyMapping(node) && !node.isInArtworkTree) {
            this.$store.dispatch("unmapCopyNode", node);
            this.$store.dispatch("deleteMappingFromDesign", node);
          }
          else if (node.constructor.name === "Group") {
            //unmap entire groupNode if at least one mapped child node is deleted because new group structure won't match to current combo structure
            //if new group mapping features allows user to map partial valid child nodes, 
            //then we need a function to verify if new group structure matches existing mapped combo structure,
            //if it still matches, no need to unmap group node from existing combo structure
            if (!node.isInArtworkTree) {
              //unmap group if group is deleted
              this.$store.dispatch("unmapGroupNode", node);
              this.$store.dispatch("deleteMappingFromDesign", node);
            }
            else {
              //unmap group if a mapped child is deleted
              let mappedChildren = this.getMappedGroupChildren(node);

              for (const child of mappedChildren) {
                if (!child.isInArtworkTree) {
                  this.$store.dispatch("unmapGroupNode", node);
                  this.$store.dispatch("deleteMappingFromDesign", node);
                  break;
                }
              }
            }
          }
        })
      })
    }
  }
}