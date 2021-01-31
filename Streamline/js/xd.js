const { ImageFill, Rectangle } = require("scenegraph");
const { editDocument } = require("application");
const clipboard = require("clipboard");
const fs = require("uxp").storage.localFileSystem;

const {notification} = require('./util')

exports.copyToClipBoard = function copyToClipBoard(svg) {
  clipboard.copyText(svg);
  notification.success("Copied to clipboard. Now you can paste it to artboard");
};

exports.insertPng = function insertPng(base64, size) {
  editDocument({ editLabel: "Inserts Icon" }, function (selection) {
    if (selection.items.length == 0) {
      const newElement = new Rectangle();
      newElement.width = size;
      newElement.height = size;
      newElement.fill = new ImageFill(base64);
      selection.insertionParent.addChild(newElement);
      newElement.moveInParentCoordinates(100, 100);
    } else {
      const selected = selection.items[0];
      let fill = new ImageFill(base64);
      selected.fill = fill;
    }
  });
};


//reads html from file and loads code into plugin
exports.loadPage = async (page) => {
  const pluginFolder = await fs.getPluginFolder();
  const pluginFolderEntries = await pluginFolder.getEntries();

  const markupFile = pluginFolderEntries.filter(
    (entry) => entry.name === page + ".html"
  )[0];
  const markupFileContents = await markupFile.read();

  return markupFileContents;
};
