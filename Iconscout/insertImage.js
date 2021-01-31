const scenegraph = require("scenegraph");
const getUrlAsBase64 = require('./getUrlAsBase64.js');
const reportError = require('./reportError');

// file: {
//   format,
//   url,
//   name
// }
const insertImage = async (selection, file) => {
  // Fetch Image
  try {
    const base64 = await getUrlAsBase64(file.url);

    // Create ImageFill for this image
    const ImageFill = scenegraph.ImageFill;
    var imageFill = new ImageFill(base64);

    // Insert Image into Xd App
    var newShape = new scenegraph.Rectangle();
    newShape.fill = imageFill;

    if (selection.insertionParent instanceof scenegraph.Artboard) {
      // If Artboard is selected
      const ratio = imageFill.naturalWidth / imageFill.naturalHeight;
      newShape.width = selection.insertionParent.width
      newShape.height = selection.insertionParent.width / ratio;

      // Horizontal
      if (newShape.height > selection.insertionParent.height) {
        newShape.height = selection.insertionParent.height;
        newShape.width = selection.insertionParent.height * ratio;
      }
    } else {      
      newShape.width = imageFill.naturalWidth;
      newShape.height = imageFill.naturalHeight;
    }

    selection.insertionParent.addChild(newShape);
  } catch (e) {
    await reportError(file.url);
    console.error(e.stack);
  }
}

module.exports = insertImage
