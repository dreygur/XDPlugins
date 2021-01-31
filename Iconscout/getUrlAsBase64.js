// Note: btoa is not available, so polyfill it using https://gist.github.com/sevir/3946819
require('./base64.js');

module.exports = async (url) => {
  const data = await fetch(url);
  const buffer = await data.arrayBuffer();
  // Get the file data in an array
  let buf = new Uint8Array(buffer);
  let out = '';
  for (let i = 0, length = buf.length; i < length; i += 1) { out += String.fromCharCode(buf[i]) }

  // Base64 String
  let fileData = window.btoa(out);

  const mime = data.headers.map['content-type'];
  return `data:${mime};base64,${fileData}`;
}
