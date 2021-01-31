
//DATA STRUCTURE
/*
let designs = [
  {
    mappedArtboardNode: {},
    mappedNodes: [node1, node2, etc], //store artwork and groups
    experiments: [
      {
        artboard: {},                 //artboardObj of original artboard
        variants: [{ artboardVariantObj1 }, { artboardVariantObj2 }, { artboardVariantObj3 }]
      },
      { experiment2 },
      { experiment3 },
    ]
  },
  { designMockup2 },
  { designMockup3 }
]
*/

//Data for mapped designs

const state = {
  designs: []
}

const getters = {
  designs: state => state.designs,
  designIdxByArtboardNode: (state) => (artboardNode) => {
    return state.designs.findIndex(design => design.mappedArtboardNode === artboardNode);
  },
  designIdxByNode: (state) => (node) => {
    return state.designs.findIndex(design => design.mappedNodes.includes(node));
  },
  designByArtboardNode: (state) => (artboardNode) => {
    return state.designs.find(design => design.mappedArtboardNode === artboardNode);
  },
  designByNode: (state) => (node) => {
    return state.designs.find(design => design.mappedNodes.includes(node));
  },
}

const mutations = {
  ADD_DESIGN: (state, design) => {
    state.designs.push(design);
  },
  ADD_NODE_TO_DESIGN: (state, { designIdx, node }) => {
    state.designs[designIdx].mappedNodes.push(node);
  },
  ADD_EXPERIMENT: (state, { designIdx, experiment }) => {
    state.designs[designIdx].experiments.push(experiment);
  },
  REMOVE_ALL_DESIGN: (state) => {
    state.designs = [];
  },
  REMOVE_DESIGN: (state, designIdx) => {
    state.designs.splice(designIdx, 1);
  },
  REMOVE_NODE_FROM_DESIGN: (state, { designIdx, node }) => {
    state.designs[designIdx].mappedNodes = state.designs[designIdx].mappedNodes.filter(mappedNode => mappedNode !== node);
  }
}

const actions = {
  addMappingToDesign: (context, node) => {
    //to record newly mapped node
    let artboardNode = node.parent;
    let designIdx = context.getters.designIdxByArtboardNode(artboardNode);
    let isMappedArtboard = designIdx !== -1;

    if (isMappedArtboard) {//if node's artboard is already mapped
      let data = {
        designIdx,
        node,
      }

      context.commit("ADD_NODE_TO_DESIGN", data);
    }
    else {//if node's artboard is never mapped
      let design = {
        mappedArtboardNode: artboardNode,
        mappedNodes: [node],
        experiments: []
      }
      context.commit("ADD_DESIGN", design);
    }

    context.dispatch("setMapFlag");
  },
  deleteMappingFromDesign: (context, node) => {
    let design = context.getters.designByNode(node);
    let designIdx = context.getters.designIdxByNode(node);
    let isMappedNode = designIdx !== -1;

    //delete mapped node from design
    if (isMappedNode) {
      context.commit("REMOVE_NODE_FROM_DESIGN", { designIdx, node });

      //delete design if it have no mapped nodes
      if (design.mappedNodes.length === 0) {
        context.commit("REMOVE_DESIGN", designIdx);
      }

      context.dispatch("setMapFlag");
    }
  },
  removeDesign: (context, designIdx) => {
    let mappedNodes = [...context.state.designs[designIdx].mappedNodes];

    mappedNodes.forEach(node => {
      let isImageNode = node.constructor.name === "Rectangle" || node.constructor.name === "Ellipse" || node.constructor.name === "Polygon" || node.constructor.name === "Path";
      let isCopyNode = node.constructor.name === "Text";
      let isGroupNode = node.constructor.name === 'Group';

      if (isImageNode) {
        context.dispatch("unmapImageNode", node);
      }
      else if (isCopyNode) {
        context.dispatch("unmapCopyNode", node);
      }
      else if (isGroupNode) {
        context.dispatch("unmapGroupNode", node);
      }
    })

    context.commit("REMOVE_DESIGN", designIdx);
    context.dispatch("setVariantCountFlag"); //trick to updateTotalArtboardVariantCount since the watcher is not reactive toward mapFlag in ExperimentPanel.vue
  },
  removeAllDesign: (context) => {
    context.commit("REMOVE_ALL_DESIGN");
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}