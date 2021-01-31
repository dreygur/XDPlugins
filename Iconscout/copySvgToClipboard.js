const clipboard = require("clipboard");
// file: {
//   format,
//   url,
//   name
// }
const copySvgToClipboard = async (file) => {
  const data = await fetch(file.url);
  const svg = await data.text();
  clipboard.copyText(svg);
}

module.exports = copySvgToClipboard
