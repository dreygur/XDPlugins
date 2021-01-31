
import Experiment from "./Experiment.js";
import Clone from './Clone.js';

export default {
  name: "GenerateVariant",
  mixins: [Experiment, Clone],
  data() {
    return {
      // renderGenerateVariantModal: false,                        //track if user generated variants
      invalidArtboards: [],
      errorMessage: "",                          //errorMessage from generating the variants
      totalArtboardVariantCount: 0,
      successfulVariantCount: 0,
      generateVariantModal: null
    }
  },
  methods: {
    resetGenerateVariantData() {
      // this.renderGenerateVariantModal = false;
      this.invalidArtboards = [];
      this.errorMessage = "";
      this.successfulVariantCount = 0;
      this.generateVariantModal = null;
    },
    async openGenerateVariantModal() {
      if (this.invalidArtboards.length > 0) {
        let invalidArtboards = this.invalidArtboards.join(", ");
        this.errorMessage = `Cannot generate variant for ${invalidArtboards}. Please ensure you have linked to nonempty image or copy variant.`
      }

      this.generateVariantModal = this.$refs.generateVariantModal.$el;

      if (!this.$refs.generateVariantModal.$el.open) {
        await this.$refs.generateVariantModal.$el.showModal().then(() => {
          this.resetGenerateVariantData();
        })
      }
    },
    generateExperiment() {
      const application = require('application');

      // this.totalArtboardVariantCount > 0 ? this.renderGenerateVariantModal = true : this.renderGenerateVariantModal = false;
      let designs = this.$store.getters.designs;

      application.editDocument(() => {
        designs.forEach(design => {
          this.generateArtboardVariants(design.mappedArtboardNode);
        })
      })

      this.openGenerateVariantModal();
    },
    generateArtboardVariants(artboardNode) {
      //generate all the possible variants of an artboard based on its mapping

      if (this.isValidArtboardMapping(artboardNode)) {
        const commands = require("commands");

        let artboardMappings = this.getArtboardMappings(artboardNode);
        let artboardVariantsMatrices = this.getArtboardVariantsMatrices(artboardMappings);
        let designIdx = this.$store.getters.designIdxByArtboardNode(artboardNode);
        let origArtboardObj = this.artboardClone(artboardNode, artboardNode.name);

        let experiment = {
          artboard: origArtboardObj,
          variants: []
        }

        //create a mutation to push the experiment data into design
        artboardVariantsMatrices.forEach(artboardVariantMatrix => {
          //selects main artboard to create a duplicate of it
          this.selection.items = [artboardNode];
          commands.duplicate();

          //access the duplicated artboard that were auto selected after duplication
          let artboardVariantNode = this.selection.items[0];
          this.applyVariantToNewArtboard(artboardNode, artboardVariantNode, artboardVariantMatrix);

          //get an object clone of this artboard variant
          let artboardVariantObj = this.artboardClone(artboardVariantNode);
          experiment.variants.push(artboardVariantObj);

          this.successfulVariantCount++;
        })

        let experimentPayload = {
          designIdx,
          experiment,
        }

        this.$store.commit("ADD_EXPERIMENT", experimentPayload);
      }
      else {
        this.invalidArtboards.push(artboardNode.name);
      }
    },
    applyVariantToNewArtboard(artboardNode, artboardVariantNode, artboardVariantMatrix) {
      //apply variant to all mapped artworks in the new artboard using artboardVariantMatrix = [{node, variantIdx}, {artworkVariant}, {artworkVariant}..]
      let artboardVariantName = `_Artboard(${artboardVariantNode.name})`;
      let artboardFullName = artboardVariantName;

      artboardVariantMatrix.forEach(artworkVariant => {                               //apply variant to each mapped artwork in artboard
        let mainNode = artworkVariant.node;                                           //mapped node from main artboard
        let variantIdx = artworkVariant.variantIdx;
        let mainNodes = this.getArrayOfItem(artboardNode.children);
        let nodeIdx = mainNodes.findIndex(node => node === mainNode);                 //find child index of mapped node in artboard
        let variantNode = artboardVariantNode.children.at(nodeIdx);                   //access the artwork in new artboard using index

        //each artworkVariant has a name
        let artworkVariantName = this.getArtworkListVariantName(mainNode, variantIdx);
        artboardFullName += artworkVariantName;

        //apply variant to node in artboardVariant that's newly duplicated from main artboard
        if (this.isValidNodeForImageMapping(variantNode)) {
          let variant = this.getImageNodeVariant(mainNode, variantIdx);
          this.applyImageVariantToNode(variantNode, variant);
        }
        else if (this.isValidNodeForCopyMapping(variantNode)) {
          let variant = this.getCopyNodeVariant(mainNode, variantIdx);
          this.applyCopyVariantToNode(variantNode, variant);
        }
        else if (this.isValidNodeForGroupMapping(variantNode)) {
          let variants = this.getGroupNodeVariants(mainNode, variantIdx);

          variantNode.children.forEach((child, childIdx) => {
            let variant = variants[childIdx];

            if (variant) {//in case not every image or copy node inside the group is being mapped for the future being
              if (this.isValidNodeForImageMapping(child)) {
                this.applyImageVariantToNode(child, variant);
              }
              else if (this.isValidNodeForCopyMapping(child)) {
                this.applyCopyVariantToNode(child, variant)
              }
            }
          })
        }
      })

      artboardVariantNode.name = artboardFullName;
    },
    getArtworkListVariantName(node, variantIdx) {
      //find the list name using node which should be mapped
      let listVariantName;
      let listName;
      let variantName;

      if (this.isValidNodeForImageMapping(node)) {
        let list = this.$store.getters.imageVariantList(node.listID);
        let variantID = list.variantIDs[variantIdx];
        let variant = this.$store.getters.imageVariant(variantID);
        listName = list.name;
        variantName = variant.name;
      }
      else if (this.isValidNodeForCopyMapping(node)) {
        let list = this.$store.getters.copyVariantList(node.listID);
        let variantID = list.variantIDs[variantIdx];
        let variant = this.$store.getters.copyVariant(variantID);
        listName = list.name;
        variantName = variant.name;
      }
      else if (this.isValidNodeForGroupMapping(node)) {
        let list = this.$store.getters.groupVariantList(node.listID);
        listName = list.name;
        variantName = this.$store.getters.groupVariantNamesByList(node.listID)[variantIdx];
      }

      listVariantName = `_${listName}(${variantName})`;
      return listVariantName;                                   //_listName(VariantName)
    },
    updateTotalArtboardVariantCount() {
      //calculates the sum of all design variants 
      let designs = this.$store.getters.designs;
      let totalVariantCount = 0;

      designs.forEach(design => {
        totalVariantCount += this.getArtboardVariantCount(design);
      })

      this.totalArtboardVariantCount = totalVariantCount;
    },
    getArtboardVariantCount(design) {
      //calculates the total variants of an artboard
      let variantCount = 1;

      design.mappedNodes.forEach(node => {
        variantCount *= this.getNodeVariantCount(node);
      })

      return variantCount;
    },
    getNodeVariantCount(node) {
      if (this.isValidNodeForImageMapping(node)) {
        return this.$store.getters.imageVariantCountByList(node.listID);
      }
      else if (this.isValidNodeForCopyMapping(node)) {
        return this.$store.getters.copyVariantCountByList(node.listID);
      }
      else if (this.isValidNodeForGroupMapping(node)) {
        return this.$store.getters.groupVariantCountByList(node.listID);
      }
    },
    getArtboardMappings(artboardNode) {
      //gathers mapping data for mapped artworks [{node, variantCount}, {mappedNode}, {mappedNode}, ...]
      let design = this.$store.getters.designByArtboardNode(artboardNode);
      let mappings = [];

      design.mappedNodes.forEach(node => {
        let obj = {
          node,
          variantCount: this.getNodeVariantCount(node)
        }

        mappings.push(obj);
      })

      return mappings;
    },
    getArtboardVariantsMatrices(artboardMappings) {
      //returns all the different variants of the artboard based on the mapped artwork and variant list items
      //artboardMappings = [{node, variantCount}, {mappedNode}, {mappedNode}, ...]
      let nodeCount = artboardMappings.length;           //number of mapped nodes
      let nodeIndex = nodeCount - 1;                     //start variant iteration of last node in array first
      let tempVariant = new Array(nodeCount).fill(0);    //initial artboard variant is [0, .., 0] as a combination of first variant of all mapped nodes, each arr index represents a node
      let artboardVariants = [];

      while (nodeIndex >= 0) {                                                          //while there are more design variants
        while (tempVariant[nodeIndex] < artboardMappings[nodeIndex].variantCount) {	    //while there are more variants that haven't been generated under current node
          let newVariant = tempVariant.slice();							                            //create a new design variant, an arr containing only variantIdx data [variantIdx, variantIdx, ..]
          let newArtboardVariant = [];

          newVariant.forEach((variantIdx, nodeIdx) => {

            let artworkVariant = {
              node: artboardMappings[nodeIdx].node,
              variantIdx
            }

            newArtboardVariant.push(artworkVariant);
          })
          artboardVariants.push(newArtboardVariant);

          //iterate the next variant of 'last artwork' for new design variant if possible
          if (nodeIndex !== nodeCount - 1) {
            nodeIndex = nodeCount - 1;
          }

          tempVariant[nodeIndex]++;								            //generate next asset variant of artwork
        }

        //when all asset variants of current artwork is generated for current fixed combination of other assets
        nodeIndex--;												                  //point to next artwork 
        tempVariant[nodeIndex]++;									            //assign variant of current artwork to be the next asset
        tempVariant[nodeIndex + 1] = 0;						            //reset the previous artwork's variant to be the first asset
      }

      return artboardVariants;                                //array of all combinations of different mapped variants, each arr item is an artboardVariant arr = [{node, variantIdx}, {}, {}..]
    },
    isValidArtboardMapping(artboardNode) {
      //valid mapping when there are nonempty image or copy variants
      let design = this.$store.getters.designByArtboardNode(artboardNode);

      for (const node of design.mappedNodes) {

        if (this.isValidNodeForImageMapping(node)) {//images
          let list = this.$store.getters.imageVariantList(node.listID);
          if (!this.isValidImageVariantListForMapping(list)) {
            return false;
          }
        }
        else if (this.isValidNodeForCopyMapping(node)) {//copies
          let list = this.$store.getters.copyVariantList(node.listID);
          if (!this.isValidCopyVariantListForMapping(list)) {
            return false;
          }
        }
        else if (this.isValidNodeForGroupMapping(node)) {//groups
          //verify that none of the artwork inside the group is mapped to an empty variant

          for (let i = 0; i < node.children.length; i++) {
            let child = node.children.at(i);

            if (this.isValidNodeForImageMapping(child)) {
              let list = this.$store.getters.imageVariantList(child.listID);
              if (!this.isValidImageVariantListForMapping(list)) {
                return false;
              }
            }
            else if (this.isValidNodeForCopyMapping(child)) {
              let list = this.$store.getters.copyVariantList(child.listID);
              if (!this.isValidCopyVariantListForMapping(list)) {
                return false;
              }
            }
          }
        }
      }

      return true;
    },
    isValidImageVariantListForMapping(list) {
      //valid when there are no placeholders to represent empty imageVariant (which may occur under groupVariants)
      return !list.variantIDs.includes("");
    },
    isValidCopyVariantListForMapping(list) {
      //valid when there are no copyVariant that contains empty text
      let variants = this.$store.getters.copyVariantsByList(list.id);
      for (const variant of variants) {
        let textString = this.getStringOfCopyVariant(variant);
        if (textString === "") {
          return false;
        }
      }
      return true;
    },
  }
}