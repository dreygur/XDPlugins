/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

const { Rectangle, Color } = require("scenegraph");
const assets = require("assets");
const { alert } = require("./lib/dialogs.js");

async function showAlert(title, message) {
  await alert(title, message);
}

async function convertTextWithHex2Rectangle(selection) {
  let node = selection.items[0];
  if (!node) {
    await showAlert(
      "Empty selection",
      "Please select one Text element with a hexadecimal in format #rrggbb or #rgb",
    );
    return;
  }

  if (node.constructor.name !== "Text") {
    await showAlert(
      "Not Text element",
      "The selection needs to be an Text element.",
    );
    return;
  }

  const nodes = node.text
    .split(/\n/)
    .map((line) => line.trim())
    .map((line) => line.toLowerCase().match(/#[\da-f]{3,6}/g)[0])
    .map((color, index) => {
      const newElement = new Rectangle();
      const colorAsset = new Color(color);
      newElement.width = 50;
      newElement.height = 50;
      newElement.fill = colorAsset;
      selection.insertionParent.addChild(newElement);
      newElement.moveInParentCoordinates(index * 50, 0);

      assets.colors.add(colorAsset);
    });
}

module.exports = {
  commands: {
    convertHex2Rect: convertTextWithHex2Rectangle,
  },
};
