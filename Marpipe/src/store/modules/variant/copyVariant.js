import { securedAxiosInstance } from '../../../axios/index.js';
import { nanoid } from 'nanoid/non-secure';
const application = require('application');
import Vue from 'vue';

const apiVersion = "v1";

// SAMPLE STATE //
// const state = {
//   copyVariantLists: {
//     "listId-123": {
//       id: "listId-123",
//       name: "",
//       variantIDs: ["variantID-1, variantID-5"],
//       nodeIDs: ["node-guid-1", "node-guid-17"],
//     },
//     {}
//   },

//   copyVariants: {
//     "variantID-1": {
//       id: "variantID-1",
//       name: "",
//       listID: "listId-123",
//       copyLineIDs: ["copyLineID-15", "copyLineID-20"]
//     },
//     {}
//   },

//   copyLines: {
//     "copyLineID-3": {
//       id: "copyLineID-3",
//       variantID: "variantID-1",
//       text: "hello",
//     },
//     {}
//   },

//   copyNodes: {
//     "node-guid-1": {
//       guid: "node-guid-1",
//       listID: "listId-123",
//       text: "whatever was on artboard",
//       originalText: "asdzxc"
//     },
//     {},
//   }
// }
// END OF SAMPLE STATE //

const state = {
  listCounter: 1,             //for unique numbering of default imageVariantList names
  copyVariantLists: {},
  copyVariants: {},
  copyNodes: {},
  copyLines: {},
}

const getters = {
  copyVariantListCounter: (state) => state.listCounter,

  // COPY VARIANT LIST //
  copyVariantLists: (state) => {
    //return an array of copyVariantLists not under groupVariantList
    let allLists = Object.values(state.copyVariantLists);
    let lists = [];
    allLists.forEach(list => {
      if (!list.hasOwnProperty("groupVariantListID")) {
        lists.push(list);
      }
    });

    return lists;
  },
  copyVariantList: (state) => (listID) => state.copyVariantLists[listID],

  // COPY VARIANT //
  copyVariants: (state) => state.copyVariants,
  copyVariantsByList: (state) => (listID) => state.copyVariantLists[listID].variantIDs.map(variantID => state.copyVariants[variantID]),
  copyVariant: (state) => (variantID) => state.copyVariants[variantID],

  // COPY LINE //
  copyLines: (state) => state.copyLines,
  copyLinesByVariant: (state) => (copyVariant) => copyVariant.copyLineIDs.map(copyLineID => state.copyLines[copyLineID]),

  // COPY NODE //
  copyNodes: (state) => state.copyNodes,
  copyNode: (state) => (nodeID) => state.copyNodes[nodeID],
  copyVariantCountByList: (state) => (listID) => state.copyVariantLists[listID].variantIDs.length,
  copyNodeVariantList: (state) => (node) => state.copyVariantLists[node.listID],
}

const mutations = {
  INCREMENT_COPY_VARIANT_LIST_COUNTER: (state) => {
    state.listCounter++;
  },

  // COPY VARIANT LIST MUTATIONS //
  SET_COPY_VARIANT_LIST: (state, list) => {
    Vue.set(state.copyVariantLists, list.id, list);
  },
  REMOVE_COPY_VARIANT_LIST: (state, list) => {
    Vue.delete(state.copyVariantLists, list.id)
  },

  // COPY VARIANT MUTATIONS //
  ADD_COPY_TO_LIST: (state, copy) => {                                     // params: copy.id, copy.listID
    let variantIDs = state.copyVariantLists[copy.listID].variantIDs
    variantIDs.push(copy.id)                                               // add copyVariantID to copyVariantList.variantIDs array
    Vue.set(state.copyVariantLists[copy.listID], 'variantIDs', variantIDs)
  },
  SET_COPY: (state, copy) => {
    Vue.set(state.copyVariants, copy.id, copy)                              // add or update copy
  },
  REMOVE_COPY_FROM_LIST: (state, copy) => {                                 // params: copy.id, copy.listID
    let copyVariantList = state.copyVariantLists[copy.listID]
    const variantIdx = copyVariantList.variantIDs.indexOf(copy.id)

    if (variantIdx > -1) {
      copyVariantList.variantIDs.splice(variantIdx, 1)                      // remove copyVariantID record from copyVariantList.variantIDs 
      Vue.set(state.copyVariantLists, copy.listID, copyVariantList)
    }
  },
  REMOVE_COPY: (state, copy) => {
    Vue.delete(state.copyVariants, copy.id)
  },

  // COPY LINE MUTATIONS //
  ADD_COPY_LINE_TO_VARIANT: (state, copyLine) => {                          // params: copyLine.id, copyLine.variantID
    let copyLineIDs = state.copyVariants[copyLine.variantID].copyLineIDs
    copyLineIDs.push(copyLine.id)                                           // add copyLineID to copyVariant.copyLineIDs array
    Vue.set(state.copyVariants[copyLine.variantID], 'copyLineIDs', copyLineIDs)
  },
  SET_COPY_LINE: (state, copyLine) => {
    Vue.set(state.copyLines, copyLine.id, copyLine)                         // add or update copyLine
  },
  REMOVE_COPY_LINE_FROM_VARIANT: (state, copyLine) => {                     // params: copyLine.id, copyLine.variantID
    let copyVariant = state.copyVariants[copyLine.variantID]
    const lineIdx = copyVariant.copyLineIDs.indexOf(copyLine.id)

    if (lineIdx > -1) {
      copyVariant.copyLineIDs.splice(lineIdx, 1)                            // remove copyLineID from copyVariant.copyLineIDs array
      Vue.set(state.copyVariants, copyLine.variantID, copyVariant)
    }
  },
  REMOVE_COPY_LINE: (state, copyLine) => {
    Vue.delete(state.copyLines, copyLine.id)
  },

  // COPY NODE MUTATIONS //
  ADD_COPY_NODE_TO_LIST: (state, node) => {                                 // params: node.guid, node.listID
    let copyVariantList = state.copyVariantLists[node.listID]
    copyVariantList.nodeIDs.push(node.guid)                                 // add node.guid to copyVariantList.nodeIDs array 
    Vue.set(state.copyVariantLists, node.listID, copyVariantList)
  },
  SET_COPY_NODE: (state, node) => {
    Vue.set(state.copyNodes, node.guid, node)                               // add or update copyNode
  },
  UPDATE_COPY_NODES: (state, { listID, text }) => {                         // replace text of all copyNodes map to this list
    const nodeIDs = state.copyVariantLists[listID].nodeIDs

    nodeIDs.forEach((nodeID) => {
      Vue.set(state.copyNodes[nodeID], 'text', text)
    })
  },
  REMOVE_COPY_NODE_FROM_LIST: (state, node) => {                            // params: node.guid, node.listID
    let copyVariantList = state.copyVariantLists[node.listID]
    const nodeIdx = copyVariantList.nodeIDs.indexOf(node.guid)

    if (nodeIdx > -1) {
      copyVariantList.nodeIDs.splice(nodeIdx, 1)                            // remove node.guid from copyVariantList.nodeIDs array
      Vue.set(state.copyVariantLists, copyVariantList.id, copyVariantList)
    }
  },
  REMOVE_COPY_NODE: (state, node) => {
    delete node.listID;
    Vue.delete(state.copyNodes, node.guid)
  },
  // RESET STATE
  RESET_COPY_STATE: (state) => {
    state.listCounter = 1;
    state.copyVariantLists = {};
    state.copyLines = {};
    state.copyNodes = {};
    state.copyVariants = {};
  }
}

const actions = {
  incrementCopyVariantListCounter: (context) => {
    context.commit("INCREMENT_COPY_VARIANT_LIST_COUNTER");
  },

  // COPY VARIANT LIST ACTIONS //
  createCopyVariantList: (context, { id, name }) => {
    // CREATES copyVariantList OBJECT //
    const copyVariantList = { id, name, nodeIDs: [], variantIDs: [] }
    context.commit('SET_COPY_VARIANT_LIST', copyVariantList)
  },
  updateCopyVariantList: (context, list) => {
    context.commit('SET_COPY_VARIANT_LIST', list)
  },
  deleteCopyVariantList: (context, list) => {
    //remove all the copyVariant and copyLines belong to this list
    list.variantIDs.forEach(variantID => {
      let variant = context.getters.copyVariant(variantID);
      context.dispatch("deleteCopy", variant);
    })

    //remove all copyNodes mapped to list from local store and design store
    list.nodeIDs.forEach(nodeID => {
      let node = context.state.copyNodes[nodeID];
      context.dispatch("deleteMappingFromDesign", node);
      context.commit("REMOVE_COPY_NODE", node);
    })

    context.commit("REMOVE_COPY_VARIANT_LIST", list);
    context.dispatch("setVariantCountFlag");
  },

  // COPY VARIANT ACTIONS //
  createCopy: (context, copy) => {
    const { listID, name } = copy
    return securedAxiosInstance
      .post(`/${apiVersion}/accounts/${context.rootState.user.currentAccount.id}/copy_assets`, { name })
      .then(response => {
        copy = response.data;
        copy.listID = listID;                                 // adds copyVariant.listID property
        copy.copyLineIDs = [];                                // adds copyVariant.copyLineIDs property

        context.commit('SET_COPY', copy);
        context.dispatch("setVariantCountFlag");
        return copy;
      })
      .catch(error => {
        console.error(error);
      });
  },
  updateCopy: (context, copy) => {
    const { listID, name, id, copyLineIDs } = copy
    return securedAxiosInstance
      .patch(`/${apiVersion}/copy_assets/${id}`, { name })
      .then(response => {
        copy = response.data;
        copy.listID = listID;                                 // adds copyVariant.listID property
        copy.copyLineIDs = copyLineIDs;

        context.commit('SET_COPY', copy);
        return copy
      })
      .catch(error => {
        console.error(error);
      });
  },
  deleteCopy: (context, copy) => {
    //delete all the copyLines under this copyVariant first

    return securedAxiosInstance
      .delete(`/${apiVersion}/copy_assets/${copy.id}`)
      .then(() => {

        //remove copyLines from store
        let copyLines = context.getters.copyLinesByVariant(copy);
        copyLines.forEach(copyLine => {
          context.commit('REMOVE_COPY_LINE', copyLine);
        })

        //remove copyVariant from store
        context.commit('REMOVE_COPY', copy);
        return copy
      })
      .catch(error => {
        console.error(error);
      });
  },
  addCopyToList: (context, copy) => {
    context.commit('ADD_COPY_TO_LIST', copy);
  },
  removeCopyFromList: (context, copy) => {
    context.commit('REMOVE_COPY_FROM_LIST', copy);

    //remove entire list if there are no more variants
    const list = context.state.copyVariantLists[copy.listID];
    const isEmptyList = list.variantIDs.length === 0;
    if (isEmptyList) {
      context.dispatch("deleteCopyVariantList", list);
    }
  },

  // COPY LINE ACTIONS //
  createCopyLine: (context, copyLine) => {
    const { variantID, text, index } = copyLine

    return securedAxiosInstance
      .post(`/${apiVersion}/copy_assets/${variantID}/copy_lines`, { text, index })
      .then(response => {
        copyLine = response.data;
        copyLine.variantID = variantID;                         // adds copyLine.variantID property

        context.commit('ADD_COPY_LINE_TO_VARIANT', copyLine)
        context.commit('SET_COPY_LINE', copyLine)
        return copyLine
      })
      .catch(error => {
        console.error(error);
      });
  },
  updateCopyLine: (context, copyLine) => {
    const { id, variantID, text, index } = copyLine
    return securedAxiosInstance
      .patch(`/${apiVersion}/copy_lines/${id}`, { text, index })
      .then(response => {
        copyLine = response.data;
        copyLine.variantID = variantID;                        // adds copyLine.variantID property

        context.commit('SET_COPY_LINE', copyLine)
        return response.data
      })
      .catch(error => {
        console.error(error);
      });
  },
  deleteCopyLine: (context, copyLine) => {
    const { id, variantID } = copyLine
    return securedAxiosInstance
      .delete(`/${apiVersion}/copy_lines/${id}`)
      .then(response => {
        copyLine = response.data;
        copyLine.variantID = variantID;                       // adds copyLine.variantID property

        context.commit('REMOVE_COPY_LINE_FROM_VARIANT', copyLine)
        context.commit('REMOVE_COPY_LINE', copyLine)
      })
      .catch(error => {
        console.error(error);
      });
  },

  // NODE ACTIONS //
  mapCopyNode: (context, node) => {
    context.commit("ADD_COPY_NODE_TO_LIST", node);
    context.commit("SET_COPY_NODE", node);
  },
  unmapCopyNode: (context, node) => {
    context.commit("REMOVE_COPY_NODE_FROM_LIST", node);
    context.commit("REMOVE_COPY_NODE", node);
  },
  updateCopyNodes: (context, { listID, text }) => {
    //replace text for all the copyNodes mapped to this list
    let isEmptyText = text.replace(/\s+$/, "") === "";              //remove trailing spaces

    if (!isEmptyText) {
      context.commit("UPDATE_COPY_NODES", { listID, text });
    }
  },

  // RESET ACTION //
  resetCopies: (context) => {
    context.commit("RESET_COPY_STATE");
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}