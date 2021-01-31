
import { securedAxiosInstance } from '../../../axios/index.js';
import { nanoid } from 'nanoid/non-secure';
const application = require('application');
import Vue from 'vue';

const apiVersion = "v1";

// SAMPLE STATE //
// const state = {
//   imageVariantLists: {
//     "listId-21": {
//       id: "listId-21",
//       name: "",
//       variantIDs: ["variantID-3", "variantID-7"],
//       nodeIDs: ["node-guid-2", "node-guid-4"]
//     },
//     {}
//   },
//   imageVariants: {
//     "variantID-3": {
//       id: "variantID-3",
//       name: "",
//       listID: "listId-21",
//       localPath: someImageFile-1
//     },
//     {}
//   },
//   imageNodes: {
//     "node-guid-2": {
//       guid: "node-guid-2",
//       originalFill: imageFill
//     },
//     {}
//   }
// }
// END OF SAMPLE STATE //

const state = {
  listCounter: 1,                 //for unique numbering of default imageVariantList names
  imageVariantLists: {},
  imageVariants: {},
  imageNodes: {}
}

const getters = {
  imageVariantListCounter: (state) => state.listCounter,

  // IMAGE VARIANT LIST GETTERS //
  imageVariantLists: (state) => {
    //return an array of imageVariantLists not under groupVariantList
    let allLists = Object.values(state.imageVariantLists);
    let lists = [];
    allLists.forEach(list => {
      if (!list.hasOwnProperty("groupVariantListID")) {
        lists.push(list);
      }
    });

    return lists;
  },
  imageVariantList: (state) => (listID) => state.imageVariantLists[listID],

  // IMAGE VARIANT GETTERS //
  imageVariants: (state) => state.imageVariants,
  imageVariantsByList: (state) => (listID) => state.imageVariantLists[listID].variantIDs.map(variantID => state.imageVariants[variantID]),
  imageVariant: (state) => (variantID) => state.imageVariants[variantID],

  // IMAGE NODE GETTERS //
  imageNodes: (state) => state.imageNodes,
  imageNode: (state) => (guid) => state.imageNodes[guid],
  imageVariantCountByList: (state) => (listID) => state.imageVariantLists[listID].variantIDs.length,
}

const mutations = {
  INCREMENT_IMAGE_VARIANT_LIST_COUNTER: (state) => {
    state.listCounter++;
  },

  // IMAGE VARIANT LIST MUTATIONS //
  SET_IMAGE_VARIANT_LIST: (state, list) => {//add or update imageVariantList
    Vue.set(state.imageVariantLists, list.id, list)
  },
  REMOVE_IMAGE_VARIANT_LIST: (state, list) => {
    Vue.delete(state.imageVariantLists, list.id)
  },

  // IMAGE VARIANT MUTATIONS //
  ADD_IMAGE_TO_LIST: (state, image) => {
    let variantIDs = state.imageVariantLists[image.listID].variantIDs
    variantIDs.push(image.id)

    Vue.set(state.imageVariantLists[image.listID], 'variantIDs', variantIDs)
  },
  ADD_IMAGE: (state, image) => {
    Vue.set(state.imageVariants, image.id, image)
  },
  UPDATE_IMAGE_IN_LIST: (state, image) => {
    Vue.set(state.imageVariantLists[image.listID].variantIDs, image.variantIdx, image.id);
  },
  UPDATE_IMAGE: (state, image) => {
    Vue.set(state.imageVariants, image.id, image)
  },
  REMOVE_IMAGE_FROM_LIST: (state, image) => {
    //remove image.id from list.variantIDs array
    let variantIDs = state.imageVariantLists[image.listID].variantIDs;
    const variantIdx = variantIDs.indexOf(image.id)

    if (variantIdx > -1) {
      variantIDs.splice(variantIdx, 1);
      Vue.set(state.imageVariantLists[image.listID], 'variantIDs', variantIDs)
    }
  },
  REMOVE_IMAGE: (state, image) => {
    Vue.delete(state.imageVariants, image.id);
  },

  // IMAGE NODE MUTATIONS //
  ADD_IMAGE_NODE_TO_LIST: (state, node) => {
    let list = state.imageVariantLists[node.listID]
    list.nodeIDs.push(node.guid)

    Vue.set(state.imageVariantLists, node.listID, list)
  },
  SET_IMAGE_NODE: (state, node) => {
    Vue.set(state.imageNodes, node.guid, node)
  },
  UPDATE_IMAGE_NODES: (state, image) => {
    //apply ImageFill of current imageVariant to all the nodes mapped to this imageVariantList
    const ImageFill = require("scenegraph").ImageFill;
    let fill = new ImageFill(image.localPath);
    const nodeIDs = state.imageVariantLists[image.listID].nodeIDs

    nodeIDs.forEach(nodeID => {
      const node = state.imageNodes[nodeID]

      if (node.constructor.name === "Path") {
        node.fillEnabled = true;
      }
      node.fill = fill;
    })
  },
  UNMAP_IMAGE_NODE: (state, node) => {
    let imageVariantList = state.imageVariantLists[node.listID]
    const listNodeIndex = imageVariantList.nodeIDs.indexOf(node.guid)

    if (listNodeIndex > -1) {
      imageVariantList.nodeIDs.splice(listNodeIndex, 1)

      Vue.set(state.imageVariantLists, imageVariantList.id, imageVariantList)
      Vue.delete(state.imageNodes, node.guid)
    }
  },
  REMOVE_IMAGE_NODE_FROM_LIST: (state, node) => {
    let imageVariantList = state.imageVariantLists[node.listID]
    const listNodeIndex = imageVariantList.nodeIDs.indexOf(node.guid)

    if (listNodeIndex > -1) {
      imageVariantList.nodeIDs.splice(listNodeIndex, 1)

      Vue.set(state.imageVariantLists, imageVariantList.id, imageVariantList)
    }
  },
  REMOVE_IMAGE_NODE: (state, node) => {
    delete node.listID;
    Vue.delete(state.imageNodes, node.guid)
  },
  // RESET STATE MUTATION //
  RESET_IMAGE_STATE: (state) => {
    state.listCounter = 1;
    state.imageVariantLists = {};
    state.imageVariants = {};
    state.imageNodes = {};
  }
}

const actions = {
  incrementImageVariantListCounter: (context) => {
    context.commit("INCREMENT_IMAGE_VARIANT_LIST_COUNTER");
  },

  // IMAGE VARIANT LIST ACTIONS //
  createImageVariantList: (context, { id, name }) => {
    const imageVariantList = { id, name, nodeIDs: [], variantIDs: [] }
    context.commit("SET_IMAGE_VARIANT_LIST", imageVariantList);
  },
  updateImageVariantList: (context, list) => {
    context.commit("SET_IMAGE_VARIANT_LIST", list);
  },
  deleteImageVariantList: (context, list) => {
    //remove all the imageVariants

    list.variantIDs.forEach(variantID => {
      //variantID can be empty string to act as a placeholder that represents image variant in groupVariant
      if (variantID !== "") {
        let variant = context.getters.imageVariant(variantID);
        context.dispatch("deleteImage", variant);
      }
    })

    //remove all the imageNodes mapped to list from local store and design store
    list.nodeIDs.forEach(nodeID => {
      let node = context.state.imageNodes[nodeID];
      context.dispatch("deleteMappingFromDesign", node);
      context.commit("REMOVE_IMAGE_NODE", node);
    })

    context.commit("REMOVE_IMAGE_VARIANT_LIST", list);
    context.dispatch("setVariantCountFlag");
  },

  // IMAGE VARIANT ACTIONS //
  createImage: (context, image) => {
    let { formData, imageFile, listID } = image;
    let imageVariant = {
      name: imageFile.name,
      localPath: imageFile,
      listID
    };

    return securedAxiosInstance
      .post(`/${apiVersion}/accounts/${context.rootState.user.currentAccount.id}/image_assets`, formData)
      .then(response => {
        imageVariant.id = response.data.id
        context.commit('ADD_IMAGE', imageVariant);
        context.dispatch("setVariantCountFlag");

        return imageVariant;
      })
      .catch(error => {
        console.error(error);
      });
  },
  updateImage: (context, image) => {
    const { id, name } = image;

    return securedAxiosInstance
      .patch(`/${apiVersion}/image_assets/${id}`, { name })
      .then(() => {
        context.commit('UPDATE_IMAGE', image)
      })
      .catch(error => {
        console.error(error);
      });
  },
  deleteImage: (context, image) => {
    const { id } = image;

    return securedAxiosInstance
      .delete(`/${apiVersion}/image_assets/${id}`)
      .then(() => {
        context.commit('REMOVE_IMAGE', image)
      })
      .catch(error => {
        console.error(error);
      });
  },
  addImageToList: (context, image) => {
    context.commit('ADD_IMAGE_TO_LIST', image);
  },
  updateImageInList: (context, image) => {
    //need image.id, image.listID, image.variantIdx
    context.commit("UPDATE_IMAGE_IN_LIST", image);
  },
  removeImageFromList: (context, image) => {
    context.commit("REMOVE_IMAGE_FROM_LIST", image)

    //remove entire list if there are no more variants
    const list = context.state.imageVariantLists[image.listID];
    const isEmptyList = list.variantIDs.length === 0;
    if (isEmptyList) {
      context.dispatch("deleteImageVariantList", list);
    }
  },

  // IMAGE NODE ACTIONS //
  mapImageNode: (context, node) => {
    context.commit("ADD_IMAGE_NODE_TO_LIST", node);
    context.commit("SET_IMAGE_NODE", node);
  },
  unmapImageNode: (context, node) => {
    context.commit("REMOVE_IMAGE_NODE_FROM_LIST", node);
    context.commit("REMOVE_IMAGE_NODE", node);
  },
  updateImageNodes: (context, image) => {
    context.commit("UPDATE_IMAGE_NODES", image);
  },

  // RESET ACTION //
  resetImages: (context) => {
    context.commit("RESET_IMAGE_STATE");
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}