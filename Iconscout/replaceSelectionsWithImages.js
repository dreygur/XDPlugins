const scenegraph = require("scenegraph");
const getUrlAsBase64 = require('./getUrlAsBase64.js');
const reportError = require('./reportError');

// file: {
//   format,
//   url,
//   name
// }
const insertImage = async (selection, files) => {
  // Fetch Image
  const key = 0
  try {
    const base64 = await getUrlAsBase64(files[key].url);

    // Create ImageFill for this image
    const ImageFill = scenegraph.ImageFill;
    var imageFill = new ImageFill(base64);
    selection.items[key].fill = imageFill;
  } catch (e) {
    await reportError(files[key].url);
    console.error(e.stack);
  }
}

module.exports = insertImage
