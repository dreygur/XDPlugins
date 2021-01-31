const { alert, error } = require("./lib/dialogs.js");
const { ImageFill } = require("scenegraph");

async function fillImage(selection) {
  if (selection.items.length) {
    const selectedShapes = selection.items.length;
    const url = `https://randomuser.me/api/?results=${selectedShapes}`;
    const imageUrl = await fetch(url);
    const json = await imageUrl.json();
    const userPhoto = [];
    for (let i = 0; i < selection.items.length; i++) {
      userPhoto.push(json.results[i].picture.large);
    }
    return downloadImage(selection, userPhoto);
  } else {
    error(
      "Something went wrong!",
      "<p>You must select atleast one shape. You can select: <b>Rectangle(s)</b> <b>Oval(s)</b><br><br>You cannot select: <b>Artboard(s)</b><b>Text Layer(s)</b></p>"
    );
  }
}

function applyImagefill(selection, base64) {
  const imageFill = new ImageFill(`data:image/jpeg;base64,${base64}`);
  selection.fill = imageFill;
}

function xhrBinary(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.onload = () => {
      if (req.status === 200) {
        try {
          const arr = new Uint8Array(req.response);
          resolve(arr);
        } catch (err) {
          reject(`Couldnt parse response. ${err.message}, ${req.response}`);
        }
      } else {
        reject(`Request had an error: ${req.status}`);
      }
    };
    req.onerror = reject;
    req.onabort = reject;
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.send();
  });
}

async function downloadImage(selection, jsonResponse) {
  var selected;
  for (selected in selection.items) {
    try {
      const photoUrl = jsonResponse[selected];
      const photoObj = await xhrBinary(photoUrl);
      const photoObjBase64 = await base64ArrayBuffer(photoObj);
      applyImagefill(selection.items[selected], photoObjBase64);
    } catch (err) {
      error("Error: " + err);
    }
  }
}

function base64ArrayBuffer(arrayBuffer) {
  var base64 = "";
  var encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  var bytes = new Uint8Array(arrayBuffer);
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;

  var a, b, c, d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + "==";
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + "=";
  }
  return base64;
}

module.exports = {
  commands: {
    fillImage
  }
};
