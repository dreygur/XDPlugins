
const Vue = require("vue").default;

const state = {
  selection: {},                  //to avoid repeated declaration in components
  root: {},
  updateFlag: false,              //to detect scenegraph updates
  variantCountFlag: false,        //to detect changes in variant count
  mapFlag: false,                 //to detect changes in mapping
  isSingleSelection: false,
  isInsideArtboard: false,        //single selection status
  isMappedNode: false,            //single selection status
  isMappableNode: false,          //single selection status
  nodeVariantType: "",            //single selection status
};

const getters = {
  selection: state => state.selection,
  root: state => state.root,
  updateFlag: state => state.updateFlag,
  variantCountFlag: state => state.variantCountFlag,
  mapFlag: state => state.mapFlag,
  isSingleSelection: state => state.isSingleSelection,
  isInsideArtboard: state => state.isInsideArtboard,
  isMappedNode: state => state.isMappedNode,
  isMappableNode: state => state.isMappableNode,
  nodeVariantType: state => state.nodeVariantType,
}

const mutations = {
  SET_UPDATE_FLAG: (state) => {
    state.updateFlag = !state.updateFlag;
  },
  SET_VARIANT_COUNT_FLAG: (state) => {
    state.variantCountFlag = !state.variantCountFlag;
  },
  SET_MAP_FLAG: (state) => {
    state.mapFlag = !state.mapFlag;
  },
  SET_SELECTION: (state, selection) => {
    state.selection = selection;
  },
  SET_ROOT: (state, root) => {
    state.root = root;
  },
  SET_IS_SINGLE_SELECTION: (state, payload) => {
    state.isSingleSelection = payload;
  },
  SET_IS_INSIDE_ARTBOARD: (state, payload) => {
    state.isInsideArtboard = payload;
  },
  SET_IS_MAPPED_NODE: (state, payload) => {
    state.isMappedNode = payload;
  },
  SET_IS_MAPPABLE_NODE: (state, payload) => {
    state.isMappableNode = payload;
  },
  SET_NODE_VARIANT_TYPE: (state, payload) => {
    state.nodeVariantType = payload;
  }
}

const actions = {
  setUpdateFlag: (context) => {
    context.commit("SET_UPDATE_FLAG");
  },
  setVariantCountFlag: (context) => {
    context.commit("SET_VARIANT_COUNT_FLAG");
  },
  setMapFlag: (context) => {
    context.commit("SET_MAP_FLAG");
  },
  setSelection: (context, selection) => {
    context.commit("SET_SELECTION", selection);
  },
  setRoot: (context, root) => {
    context.commit("SET_ROOT", root);
  },
  setIsSingleSelection: (context, payload) => {
    context.commit("SET_IS_SINGLE_SELECTION", payload);
  },
  setIsInsideArtboard: (context, payload) => {
    context.commit("SET_IS_INSIDE_ARTBOARD", payload);
  },
  setIsMappedNode: (context, payload) => {
    context.commit("SET_IS_MAPPED_NODE", payload);
  },
  setIsMappableNode: (context, payload) => {
    context.commit("SET_IS_MAPPABLE_NODE", payload);
  },
  setNodeVariantType: (context, payload) => {
    context.commit("SET_NODE_VARIANT_TYPE", payload);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}