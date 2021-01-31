//
// Plugin for Adobe XD
// Author: Janis janisrozenfelds
// - Web: www.janisrozenfelds.com/adobe-xd
// - Twitter: roziits
// - Email: janis.rozenfelds@gmail.com
//
//==============================================
const LocalFileSystem = require("uxp").storage.localFileSystem;
const { API_URL } = require("./config/config.js")
const { alert, error } = require("./lib/dialogs.js");
const { ImageFill } = require("scenegraph");
const h = require("./lib/h");


const selectedShapes = null;


async function imageFillCommand(selection) {

    try {
      const selectedShapes = selection;
      const userSelected = selectedShapes.items.length
      const maxImg = 50;
      let total_collection_pages = [];
      let dataArray = [];


      // In progress -- reading json from plugin folder
      // const pluginFolder = await LocalFileSystem.getPluginFolder();
      // const dbFile = await pluginFolder.getEntry("db/data.json");
      // const jsonData = await dbFile.read();
      //console.log(JSON.parse(jsonData))


      // not selected shapes !
      if (selectedShapes.items.length === 0) {
        showDialog("#selectShapeDialog", "Oops, something went wrong! Please select one or more shapes to be filled with image.\n\nPlugging supports shapes, rectangles, an ellipse.\n\nAlways stay awesome!");
      }

      if (maxImg >= selectedShapes.items.length && selectedShapes.items.length != 0) {
        const response = await fetch(`${API_URL}/photos?limit=${userSelected}`)
        const json = await response.json();

        // const json = await JSON.parse(jsonData);

        await json.data.forEach(item => {
          dataArray.push(item)
        })

        function shufflePhotos(dataArray) {
          let counter = dataArray.length;
          while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = dataArray[counter];
            dataArray[counter] = dataArray[index];
            dataArray[index] = temp;
          }
          return dataArray
        }
        return findImageUrl(selectedShapes, shufflePhotos(dataArray), userSelected)
      }

      else {
        showDialog("#selectShapeLimitDialog", `You selected ${selectedShapes.items.length}. The maximum allowed is 👉 ${maxImg}.\nThe limitation set based on API request limits.`);
      }

    } catch (err) {
      console.log(err)
      showDialog("#selectShapeLimitDialog", "Oops, something went wrong! Could be that server is too busy getting photos for you.\n\nTake your time and try again 🙂!");
    }

}

async function findImageUrl(selection, jsonResponse, userSelected) {
    try {
        const n = userSelected;
        const photoUrl = [];
        const photoDownloadLocation = [];
        await jsonResponse.forEach(item => {
          photoUrl.push(item.url)
        })

        // download locatiname: on endpoint
        await jsonResponse.forEach(item => {
          photoDownloadLocation.push(item.download_location)
        })

        // Find User name
        const photographArry = jsonResponse.map(user => {
          return {
            userName: user.userName,
            userLink: user.userLink
          }
        });
        try {
          const url = {
            photos: photoDownloadLocation.slice(0, n)
          };

          const response = await fetch(`${API_URL}/photos/download_location`, {
            method: 'post',
            body:    JSON.stringify(url),
            headers: {
              'Content-Type': 'application/json'
            }
          })

        } catch (err) {
          console.log(err)
        }

        return downloadImage(selection, photoUrl, userSelected, photographArry)

    } catch (err) {
        console.log(err.message)
    }
}

async function aboutCommand() {
    showDialog("#aboutPluginDialog", `I am Janis 👨‍💻. Creator of this Adobe XD plugin.\n\nThis could not be built without most generous photographers from "Unsplash". Each photo is selected to create a unique collection.`);
}

function applyImagefill(selection, base64, userSelected, photographArry) {
  const selectedPhotos = photographArry.slice(0, userSelected)
  const imageFill = new ImageFill(`data:image/jpeg;base64,${base64}`);
  selection.fill = imageFill;

  // Dialog
  // Displays photo credits
  let dialog
    function getDialog() {
        if (!dialog) {
            dialog =
            h("dialog", {id: "alertDialog", style: { backgroundColor: "#000000" }},
              h("div", { style: { borderBottom: "1px solid #4D4D4D", width: "100%", paddingBottom: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},
                h("div", {style: { display: "flex", flexDirection: "column" }},
                  h("div", {style: { display: "flex", flexDirection: "row" }},
                    h("h1", {style: { fontSize: "24px", color: "#FFFFFF" }}, "Done 👏 ")
                  )
                ),
                h("a", {style: { fontSize: "10px", color: "#116cd6",}, href: "https://www.janisrozenfelds.com/adobe-xd/how-to-use" }, "(?)"),
              ),
                h("form", { style: { width: 400 }},
                 h("div", { style: { display: "flex", flexWrap: "wrap", marginTop: 10, maxHeight: 100, overflowY: "scroll" }},
                  ...selectedPhotos.map((item) => {
                    return h("a", {style: { color: "#116cd6" }, href: `${item.userLink}` }, `${item.userName}`, ",")
                  })
                )
              ),
              h("footer",
                h("button", { uxpVariant:"cta", onclick() { dialog.close() } }, "Ok")
              )
            )
        }
        return dialog;
    }
    document.body.appendChild(getDialog()).showModal();
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

async function downloadImage(selection, jsonResponse, userSelected, photographArry) {
  var selected;
  for (selected in selection.items) {
    try {
      const photoUrl = jsonResponse[selected];
      const photoObj = await xhrBinary(photoUrl);
      const photoObjBase64 = await base64ArrayBuffer(photoObj);
      applyImagefill(selection.items[selected], photoObjBase64, userSelected, photographArry);

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


function showDialog(dialogId, messageText) {
    return new Promise((resolve, reject) => {
	    let dialog = document.querySelector(dialogId);
	    let message = document.querySelector(dialogId + " #message");
	    let closeButton = document.querySelector(dialogId + " #closeButton");
	    dialog.showModal();
	    message.textContent = messageText;
        closeButton.onclick = () => {
            dialog.close();
            resolve();
        }
    })
}


//
// in processs
// ==========================
let alertDialog =
		    h("dialog", {id: "alertDialog", style: { backgroundColor: "#000000" }},
		   		h("div", { style: { borderBottom: "1px solid #4D4D4D", width: "100%", paddingBottom: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},
              h("div", {style: { display: "flex", flexDirection: "column" }},
                h("div", {style: { display: "flex", flexDirection: "row" }},
                  h("h1", {style: { fontSize: "24px", color: "#FFFFFF" }}, "Done 👏 "),
                )
              ),
              h("a", {style: {fontSize: "10px", color: "#116cd6",}, href: "http://www.janisrozenfelds.com/adobe-xd/how-to-use" }, "(?)")
            ),
		        h("form", { method:"dialog", style: { width: 400 } },
		            h("div", {id: "message", style: { color: "#9B9B9B" }, marginTop: 10, maxHeight: 90, overflowY: "scroll"}, "Dialog message is not specified."),

		            h("footer",
		                h("button", {id: "closeButton", uxpVariant: "cta"}, "DONE"),
		            )
		        )
		    );

let aboutPluginDialog =
        h("dialog", {id: "aboutPluginDialog", style: { backgroundColor: "#000000" }},
          h("div", { style: { borderBottom: "1px solid #4D4D4D", width: "100%", paddingBottom: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},
                  h("div", {style: { display: "flex", flexDirection: "column" }},
                    h("div", {style: { display: "flex", flexDirection: "row" }},
                      h("img", {src: "images/icon.png", style: { width: 28, height: 28, marginRight: 10} }),
                      h("h1", {style: { fontSize: "24px", color: "#FFFFFF" }}, "Hello there 👋 "),
                    )
          ),

          h("a", {style: {fontSize: "10px", color: "#116cd6",}, href: "http://www.janisrozenfelds.com/adobe-xd/how-to-use" }, "(?)")
              ),
            h("form", { method:"dialog", style: { width: 400, textAlign: "left", display: "flex" } },

                h("p", {id: "message", style: { color: "#9B9B9B", paddingBottom: "20px" }}, "Dialog message is not specified."),

                  h("h2", {style: { fontSize: "14px", color: "#FFFFFF" }}, "Photo Credits:"),
                  h("p", { style: { color: "#9B9B9B" }}, `All authors of the generated user profile photos can be found in the Photo Credits.`,
                    h("a", { href: "http://www.janisrozenfelds.com/adobe-xd" }, "👉  Photo collection"),
                  ),

                h("footer",
                    h("button", {id: "closeButton", uxpVariant: "cta"}, "Close"),
                )
            )
        );

let selectShapeDialog =
		    h("dialog", {id: "selectShapeDialog", style: { backgroundColor: "#000000" }},
		    	h("div", { style: { borderBottom: "1px solid #4D4D4D", width: "100%", paddingBottom: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},
	                h("div", {style: { display: "flex", flexDirection: "column" }},
                    h("div", {style: { display: "flex", flexDirection: "row" }},
                      h("img", {src: "images/icon.png", style: { width: 28, height: 28, marginRight: 10} }),
  		                h("h1", {style: { fontSize: "24px", color: "#FFFFFF" }}, "User Profile"),
                    )
					),

					h("a", {style: { fontSize: "10px", color: "#116cd6",}, href: "http://www.janisrozenfelds.com/adobe-xd/how-to-use" }, "(?)")
	            ),
		        h("form", { method:"dialog", style: { paddingTop: "20px", width: 400, textAlign: "left", display: "flex" } },

		            h("img", {src: "images/black.gif", style: { width: 335, height: 120, alignSelf: "center" } }),

		            h("p", {id: "message", style: { color: "#9B9B9B" }}, "Dialog message is not specified."),
		            h("footer",
		                h("button", {id: "closeButton", uxpVariant: "cta"}, "OK"),
		            )
		        )
		    );

let selectShapeLimitDialog =
        h("dialog", {id: "selectShapeLimitDialog", style: { backgroundColor: "#000000" }},
          h("div", { style: { borderBottom: "1px solid #4D4D4D", width: "100%", paddingBottom: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},
                  h("div", {style: { display: "flex", flexDirection: "column" }},
                    h("div", {style: { display: "flex", flexDirection: "row" }},
                      h("img", {src: "images/icon.png", style: { width: 28, height: 28, marginRight: 10} }),
                      h("h1", {style: { fontSize: "24px", color: "#FFFFFF" }}, "User Profile"),
                    )
          ),

          h("a", {style: { fontSize: "10px", color: "#116cd6",}, href: "http://www.janisrozenfelds.com/adobe-xd/how-to-use" }, "(?)")
              ),
            h("form", { method:"dialog", style: { paddingTop: "20px", width: 400, textAlign: "left", display: "flex" } },

                h("p", {id: "message", style: { color: "#9B9B9B" }}, "Dialog message is not specified."),

                h("footer",
                    h("button", {id: "closeButton", uxpVariant: "cta"}, "OK"),
                )
            )
        );


document.body.appendChild(selectShapeDialog);
document.body.appendChild(aboutPluginDialog);
document.body.appendChild(selectShapeLimitDialog);
document.body.appendChild(alertDialog);

module.exports = {
    commands: {
        imageFillCommand: imageFillCommand,
        aboutCommand: aboutCommand
    }
}
