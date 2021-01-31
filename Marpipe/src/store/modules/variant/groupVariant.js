
/*Normalizated Data 
groupVariantLists: {
  "id-1": {
    id: "id-1",
    name: "",                                       //naming convention: Combo Group-1, Combo Group-2, etc
    groupNodes: [],
    variantCounter: 1,                              //for unique numbering of default variantNames Combo-1, Combo-2, etc
    variantCount: 0,
    variantNames: [],                               //Combo-1, Combo-2, 
    imageVariantListIDs: ["id-3", "id-4", etc],
    copyVariantListsIDs: ["id-5", "id-6", etc],
  },
  "id-2": {},
},
*/

const Vue = require("vue").default;

const state = {
  listCounter: 1,                          //for unique numbering of groupVariantList default names: Combo Group-1, Combo Group-2
  groupVariantLists: {},
}

const getters = {
  groupVariantLists: (state) => Object.values(state.groupVariantLists),
  groupVariantList: (state) => (listID) => state.groupVariantLists[listID],
  groupVariantCountByList: (state) => (listID) => {
    return state.groupVariantLists[listID].variantCount;
  },
  groupVariantNamesByList: (state) => (listID) => {
    return state.groupVariantLists[listID].variantNames;
  },
}

const mutations = {
  INCREMENT_GROUP_VARIANT_LIST_COUNTER: (state) => {
    state.listCounter++;
  },
  INCREMENT_GROUP_VARIANT_COUNT: (state, groupVariantListID) => {
    state.groupVariantLists[groupVariantListID].variantCount++;
  },
  DECREMENT_GROUP_VARIANT_COUNT: (state, groupVariantListID) => {
    state.groupVariantLists[groupVariantListID].variantCount--;
  },
  INCREMENT_GROUP_VARIANT_COUNTER: (state, groupVariantListID) => {
    state.groupVariantLists[groupVariantListID].variantCounter++;
  },
  ADD_GROUP_VARIANT_NAME: (state, { groupVariantListID, variantName }) => {
    state.groupVariantLists[groupVariantListID].variantNames.push(variantName);
  },
  SET_GROUP_VARIANT_LIST: (state, groupVariantList) => {
    Vue.set(state.groupVariantLists, groupVariantList.id, groupVariantList);
  },
  ADD_GROUP_NODE_TO_GROUP_VARIANT_LIST: (state, node) => {
    state.groupVariantLists[node.listID].groupNodes.push(node);
  },
  UPDATE_GROUP_VARIANT_NAME: (state, { groupVariantListID, variantIdx, variantName }) => {
    Vue.set(state.groupVariantLists[groupVariantListID].variantNames, variantIdx, variantName);
  },
  REMOVE_GROUP_VARIANT_NAME: (state, { groupVariantListID, variantIdx }) => {
    state.groupVariantLists[groupVariantListID].variantNames.splice(variantIdx, 1);
  },
  REMOVE_GROUP_VARIANT_LIST: (state, groupVariantListID) => {
    Vue.delete(state.groupVariantLists, groupVariantListID)
  },
  REMOVE_GROUP_VARIANT: (state, { groupVariantListID, variantIdx }) => {
    let imageVariantListIDs = state.groupVariantLists[groupVariantListID].imageVariantListIDs;
    let copyVariantListIDs = state.groupVariantLists[groupVariantListID].copyVariantListIDs;

    //remove the variantID from each imageVariantList
    imageVariantListIDs.forEach(listID => {
      let variantID = state.imageVariantLists[listID].variantIDs[variantIdx];

      Vue.delete(state.imageVariants, variantID)                                   //remove imageVariant
      state.imageVariantLists[listID].variantIDs.splice(variantIdx, 1);            //remove imageVariantID
    })

    //remove the variantID from each copyVariantList
    copyVariantListIDs.forEach(listID => {
      let variantID = state.copyVariantLists[listID].variantIDs[variantIdx];
      let copyLineIDs = state.copyVariants[variantID].copyLineIDs;

      copyLineIDs.forEach(id => Vue.delete(state.copyLines, id));                   //remove copyLines
      Vue.delete(state.copyVariants, variantID);                                    //remove copyVariant
      state.copyVariantLists[listID].variantIDs.splice(variantIdx, 1);              //remove copyVariantID
    })
  },
  REMOVE_GROUP_NODE_FROM_GROUP_VARIANT_LIST: (state, node) => {
    state.groupVariantLists[node.listID].groupNodes = state.groupVariantLists[node.listID].groupNodes.filter(node => node !== node);
  },
  ADD_IMAGE_VARIANT_LIST_TO_GROUP: (state, imageVariantList) => {
    state.groupVariantLists[imageVariantList.groupVariantListID].imageVariantListIDs.push(imageVariantList.id);
  },
  ADD_COPY_VARIANT_LIST_TO_GROUP: (state, copyVariantList) => {
    state.groupVariantLists[copyVariantList.groupVariantListID].copyVariantListIDs.push(copyVariantList.id);
  },
  RESET_GROUP_STATE: (state) => {
    state.listCounter = 1;
    state.groupVariantLists = {};
  },
}

const actions = {
  incrementGroupVariantCounter: (context, groupVariantListID) => {
    context.commit("INCREMENT_GROUP_VARIANT_COUNTER", groupVariantListID);
  },
  incrementGroupVariantCount: (context, groupVariantListID) => {
    context.commit("INCREMENT_GROUP_VARIANT_COUNT", groupVariantListID);
    context.dispatch("setVariantCountFlag");
  },
  decrementGroupVariantCount: (context, groupVariantListID) => {
    context.commit("DECREMENT_GROUP_VARIANT_COUNT", groupVariantListID);
  },
  createGroupVariantList: (context, id) => {
    //create and add a new groupVariantList
    let list = {
      id,
      name: `Combo Group-${context.state.listCounter}`,
      groupNodes: [],
      variantCount: 0,
      variantCounter: 1,
      variantNames: ["Combo-1"],                                    //initial combo is created along with new list
      imageVariantListIDs: [],
      copyVariantListIDs: []
    }

    context.commit("SET_GROUP_VARIANT_LIST", list);
    context.commit("INCREMENT_GROUP_VARIANT_LIST_COUNTER");
    context.commit("INCREMENT_GROUP_VARIANT_COUNTER", list.id);
  },
  setGroupVariantList: (context, list) => {
    context.commit("SET_GROUP_VARIANT_LIST", list);
  },
  deleteGroupVariantList: (context, groupVariantListID) => {
    let imageVariantListIDs = context.state.groupVariantLists[groupVariantListID].imageVariantListIDs;
    let copyVariantListIDs = context.state.groupVariantLists[groupVariantListID].copyVariantListIDs;
    let groupNodes = context.state.groupVariantLists[groupVariantListID].groupNodes;

    //remove all imageVariantLists under this groupVariantList
    imageVariantListIDs.forEach(listID => {
      let list = context.getters.imageVariantList(listID);
      context.dispatch("deleteImageVariantList", list);
    })

    //remove all copyVariantLists under this groupVariantList
    copyVariantListIDs.forEach(listID => {
      let list = context.getters.copyVariantList(listID);
      context.dispatch("deleteCopyVariantList", list);
    })

    //remove all groupNodes mapped to this list
    groupNodes.forEach(groupNode => {
      context.dispatch("deleteMappingFromDesign", groupNode);
    })

    context.commit("REMOVE_GROUP_VARIANT_LIST", groupVariantListID);
  },
  addGroupVariantName: (context, groupVariantListID) => {
    let groupVariantCounter = context.state.groupVariantLists[groupVariantListID].variantCounter;
    let variantName = `Combo-${groupVariantCounter}`;
    context.commit("ADD_GROUP_VARIANT_NAME", { groupVariantListID, variantName });
  },
  updateGroupVariantName: (context, { groupVariantListID, variantIdx, variantName }) => {
    context.commit("UPDATE_GROUP_VARIANT_NAME", { groupVariantListID, variantIdx, variantName });
  },
  deleteGroupVariantName: (context, { groupVariantListID, variantIdx }) => {
    context.commit("REMOVE_GROUP_VARIANT_NAME", { groupVariantListID, variantIdx });
  },
  addImageVariantListToGroup: (context, imageVariantList) => {
    context.commit("ADD_IMAGE_VARIANT_LIST_TO_GROUP", imageVariantList);
  },
  addCopyVariantListToGroup: (context, copyVariantList) => {
    context.commit("ADD_COPY_VARIANT_LIST_TO_GROUP", copyVariantList);
  },
  addGroupVariant: (context, groupVariantListID) => {
    context.dispatch("addGroupVariantName", groupVariantListID);
    context.commit("INCREMENT_GROUP_VARIANT_COUNTER", groupVariantListID);      //prepare counter for new variant naming
    context.dispatch("setVariantCountFlag");
  },
  deleteGroupVariant: (context, { groupVariantListID, variantIdx }) => {
    context.commit("REMOVE_GROUP_VARIANT_NAME", { groupVariantListID, variantIdx });
    context.commit("DECREMENT_GROUP_VARIANT_COUNT", groupVariantListID);

    let variantCount = context.getters.groupVariantCountByList(groupVariantListID);

    if (variantCount > 0) {//if the groupVariantList still have variants after deletion
      let imageVariantListIDs = context.state.groupVariantLists[groupVariantListID].imageVariantListIDs;
      let copyVariantListIDs = context.state.groupVariantLists[groupVariantListID].copyVariantListIDs;

      //remove imageVariants at variantIdx from all the imageVariantLists under this groupVariantList
      imageVariantListIDs.forEach(listID => {
        let variant = context.getters.imageVariantsByList(listID)[variantIdx];
        if (variant) {//variant will be undefined when variantID === "" (empty imageVariant)
          context.dispatch("deleteImage", variant);
          context.dispatch("removeImageFromList", variant);
        }
      })

      //remove copyVariants at variantIdx from all the copyVariantLists under this groupVariantList
      copyVariantListIDs.forEach(listID => {
        let variant = context.getters.copyVariantsByList(listID)[variantIdx];

        context.dispatch("deleteCopy", variant);
        context.dispatch("removeCopyFromList", variant);
      })

    }
    else if (variantCount === 0) {//if the groupVariantList have no more variants after deletion
      context.dispatch("deleteGroupVariantList", groupVariantListID);
    }
  },
  mapGroupNode: (context, node) => {
    context.commit("ADD_GROUP_NODE_TO_GROUP_VARIANT_LIST", node);
  },
  unmapGroupNode: (context, groupNode) => {
    //unmap groupNode including its children
    let mappedImageNodes = context.getters.imageNodes;
    let mappedCopyNodes = context.getters.copyNodes;

    groupNode.children.forEach(child => {
      let isMappedImageNode = mappedImageNodes.hasOwnProperty(child.guid);
      let isMappedCopyNode = mappedCopyNodes.hasOwnProperty(child.guid);

      if (isMappedImageNode) {
        context.dispatch("unmapImageNode", child);
      } else if (isMappedCopyNode) {
        context.dispatch("unmapCopyNode", child);
      }
    })

    context.commit("REMOVE_GROUP_NODE_FROM_GROUP_VARIANT_LIST", groupNode);
  },
  resetGroupVariants: (context) => {
    context.commit("RESET_GROUP_STATE");
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}