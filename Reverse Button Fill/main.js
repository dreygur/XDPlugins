const { Ellipse, Rectangle, Text, Color } = require('scenegraph');
const { t } = require('./data/locales.js');
const { alert, error } = require('./lib/dialogs.js');
const info = {
  nodeTypeName: {
    bg: 'bgNode',
    text: 'textNode',
    unknown: 'unknownNode',
  },
};

// Utility Functions
async function showSelectedNodesError() {
  await alert(
    t('wayDialogTitle'),
    t('wayDialogDescription')
  );
}

function isSelectedNodesError(nodes) {
  if (nodes.length !== 2) {
    // Error when user select more than 2 nodes.
    return true;
  } else {
    // Error when user don't select 1 Text + ( 1 Rectangle or 1 Ellipse )
    let textNodeNum = 0;
    let bgNodeNum = 0;
    let unknownNodeNum = 0;
    nodes.forEach(node => {
      if (getNodeType(node) === info.nodeTypeName.text) {
        textNodeNum += 1;
      } else if (getNodeType(node) === info.nodeTypeName.bg) {
        bgNodeNum += 1;
      } else {
        unknownNodeNum += 1;
      }
    });
    return textNodeNum !== 1 || bgNodeNum !== 1 || unknownNodeNum >= 1;
  }
}

function getNodeType(node) {
  if (node instanceof Text) {
    return info.nodeTypeName.text;
  } else if (node instanceof Rectangle || node instanceof Ellipse) {
    return info.nodeTypeName.bg;
  } else {
    return info.nodeTypeName.unknown;
  }
}

// Main Function
function reverseButtonFill(selection) {
  const selectedItems = selection.items;
  const strage = {};

  // Selected Nodes Error
  if (isSelectedNodesError(selectedItems)) {
    showSelectedNodesError();
    return false;
  }
  // Create Color Strage
  selectedItems.forEach((item) => {
    if (getNodeType(item) === info.nodeTypeName.bg) strage.bgFill = new Color(item.fill);
    if (getNodeType(item) === info.nodeTypeName.text) strage.textFill = new Color(item.fill);
  });
  // Set New Color Each Nodes
  selectedItems.forEach((item) => {
    if (getNodeType(item) === info.nodeTypeName.bg) item.fill = new Color(strage.textFill);
    if (getNodeType(item) === info.nodeTypeName.text) item.fill = new Color(strage.bgFill);
  });
}

module.exports = {
  commands: { reverseButtonFill }
};
