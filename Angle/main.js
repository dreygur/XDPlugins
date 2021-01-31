// Adobe Modules required for plugin
const application = require("application");
const uxp = require("uxp");
const scenegraph = require("scenegraph");
const ImageFill = require("scenegraph").ImageFill;
const Color = require("scenegraph").Color;
const commands = require("commands");

// Utilities
const base64Convert = require("./utilities/base64").base64Convert;
const randomString = require("./utilities/base64").randomString;
const extractAllText = require("./utilities/extractAllText").extractAllText;
const xhrBinary = require("./utilities/xhrBinary").xhrBinary;
const base64ArrayBuffer = require("./utilities/arrayBuffer").base64ArrayBuffer;

// Export module with commandId identifier for plugin
module.exports = {
  commands: {
    menuCommand: angleModal,
    blank: blankAngle
  }
};

/* ---------------------------------------------
Global Variables
--------------------------------------------- */

// User selected shapes
let userSelection = {};

// Dropdown selections
let pixelDensity = "dpr_auto";
let imageQuality = "q_auto";
let orientationFill = "a_auto";

/* ---------------------------------------------
Accessory Angle Functionality
--------------------------------------------- */

async function blankAngle(selection) {
  let selectedItem = selection.items[0];

  // Check is selected item is a Group
  // Throw error
  if (
    selectedItem instanceof scenegraph.SymbolInstance ||
    selectedItem instanceof scenegraph.Group ||
    selectedItem instanceof scenegraph.Artboard
  ) {
    let groupError = `Oops! Angle does not currently support ${
      selectedItem instanceof scenegraph.SymbolInstance
        ? "Symbol"
        : selectedItem instanceof scenegraph.Group
        ? "Group"
        : "Artboard"
    } selection. Please select your shape directly.`;

    const groupErrorDialog = createErrorDialog(groupError);

    try {
      const ret = await groupErrorDialog.showModal();
      // Display the return value of the modal
      if (ret) {
        console.log(`${ret}`);
      }
    } catch (err) {
      // Esc pressed or error
      console.log(`Error Dialog dismissed with ESC or error: ${err}`);
    }
  }

  if (selectedItem === undefined) {
    let lockError =
      "Oops! Your selection is locked or undefined. Please unlock to apply without error.";

    const lockErrorDialog = createErrorDialog(lockError);

    try {
      const ret = await lockErrorDialog.showModal();
      // Display the return value of the modal
      if (ret) {
        console.log(`${ret}`);
      }
    } catch (err) {
      // Esc pressed or error
      console.log(`Error Dialog dismissed with ESC or error: ${err}`);
    }
  }

  let selectedItemParent = selection.items[0].parent;
  let isMaskGroup = false;

  // Check if selected parent is a Masked Group
  // Ungroup
  if (
    selectedItemParent instanceof scenegraph.Group &&
    selectedItemParent.mask
  ) {
    isMaskGroup = true;
    commands.ungroup();
  }

  selectedItem.fill = new Color("white");

  // Group back with Mask if Mask Group
  if (isMaskGroup === true) {
    commands.createMaskGroup();
  }

  return;
}

function createErrorDialog(error) {
  document.body.innerHTML = `
    <style>
        .container {
          width: 500px;
        }

        .logo {
          background-image: url("./assets/logo-2.png");
          background-repeat: no-repeat;
          background-size: cover;
          width: 50px;
          height: 50px;
          position: relative;
          margin: 8px auto;
        }

        .box {
          margin: 8px;
        }

        .error {
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
        }

        #exit {
          margin: 0 auto;
        }

      </style>
        <dialog id="errorDialog">
            <form class="container">
                <div class="logo"></div>
                <div class="box">
                    <div class="error">${error}</div>
                </div>
                <footer>
                    <button id="exit">Exit</button>
                </footer>
            </form>
        </dialog>
  `;

  // Dialog to be used for closing
  const errorDialog = document.getElementById("errorDialog");

  // Exit > Close Dialog
  document.getElementById("exit").addEventListener("click", () => {
    errorDialog.close("exited error modal");
  });

  return errorDialog;
}

/* ---------------------------------------------
STEPS:
1. Show Modal
2. Applying Base64 image on a selected shape
--------------------------------------------- */

/*--- ENTRY POINT OF PLUGIN ---*/
// Step 1. Show modal to be able to select Artboard, Pixel Density, and Quality
// Selection and root node of scenegraph passed to dialog
async function angleModal(selection, rootnode) {
  // Save selection in entry point of app for later use
  userSelection = selection.items;
  console.log(`\n/*--- User Selected Items ---*/ \n${userSelection}\n`);

  const dialog = createDialog(selection, rootnode);

  try {
    const ret = await dialog.showModal();
    // Display the return value of the modal
    if (ret) {
      console.log(`${ret}`);
    }
  } catch (err) {
    // Esc pressed or error
    console.log(`Dialog dismissed with ESC or error: ${err}`);
  }
}

// Step 2: Get Base64 image and apply it on a selected shape
async function applyAngleFunction(selectedArtboard) {
  // Check if Group or Symbol
  // Throw errors for now, support this later!
  for (let i = 0; i < userSelection.length; i++) {
    // Check is selected item is a Group
    // Throw error
    if (userSelection[i] instanceof scenegraph.SymbolInstance) {
      throw new Error(
        "Angle does not currently support Symbol selection, please select your shape directly."
      );
    }

    // Check is selected item is a Group
    // Throw error
    if (userSelection[i] instanceof scenegraph.Group) {
      throw new Error(
        "Angle does not currently support Group selection, please select your shape directly."
      );
    }
  }

  // Get Base64 image from temporary storage for user selected Artboard
  // Upload image to Cloudinary API for later retrieval
  const imageData = await getBase64(selectedArtboard);
  const imageName = await uploadFile(imageData);

  const promisesToAwait = [];

  for (let i = 0; i < userSelection.length; i++) {
    promisesToAwait.push(angleFill(imageName, i));
  }

  const responses = await Promise.all(promisesToAwait);

  return responses;
}

/* ---------------------------------------------
Necessary Plugin Functions
--------------------------------------------- */

async function angleFill(imageName, itemNumber) {
  // Initializing user selected item+parent
  let selectedItem = userSelection[itemNumber];
  let selectedItemParent = userSelection[itemNumber].parent;
  let isMaskGroup = false;

  // Check if selected parent is a Masked Group
  // Ungroup
  if (
    selectedItemParent instanceof scenegraph.Group &&
    selectedItemParent.mask
  ) {
    isMaskGroup = true;
    commands.ungroup();
  }

  // Apply Bitmap with distortion
  // Calculation of coordinates from Path for image distortion
  const pathBounds = selectedItem.pathData;
  const pathBoundsArray = pathBounds.split(" ");
  let pathPoints = {
    topLeftX: pathBoundsArray[1],
    topLeftY: pathBoundsArray[2],
    topRightX: pathBoundsArray[4],
    topRightY: pathBoundsArray[5],
    bottomRightX: pathBoundsArray[7],
    bottomRightY: pathBoundsArray[8],
    bottomLeftX: pathBoundsArray[10],
    bottomLeftY: pathBoundsArray[11]
  };

  if (orientationFill === "rotate-left") {
    pathPoints = {
      topLeftX: pathBoundsArray[10],
      topLeftY: pathBoundsArray[11],
      topRightX: pathBoundsArray[1],
      topRightY: pathBoundsArray[2],
      bottomRightX: pathBoundsArray[4],
      bottomRightY: pathBoundsArray[5],
      bottomLeftX: pathBoundsArray[7],
      bottomLeftY: pathBoundsArray[8]
    };
  } else if (orientationFill === "rotate-right") {
    pathPoints = {
      topLeftX: pathBoundsArray[4],
      topLeftY: pathBoundsArray[5],
      topRightX: pathBoundsArray[7],
      topRightY: pathBoundsArray[8],
      bottomRightX: pathBoundsArray[10],
      bottomRightY: pathBoundsArray[11],
      bottomLeftX: pathBoundsArray[1],
      bottomLeftY: pathBoundsArray[2]
    };
  } else if (orientationFill === "flip") {
    pathPoints = {
      topLeftX: pathBoundsArray[7],
      topLeftY: pathBoundsArray[8],
      topRightX: pathBoundsArray[10],
      topRightY: pathBoundsArray[11],
      bottomRightX: pathBoundsArray[1],
      bottomRightY: pathBoundsArray[2],
      bottomLeftX: pathBoundsArray[4],
      bottomLeftY: pathBoundsArray[5]
    };
  }

  // Image URL from Cloudinary API with width, height, path coordinates, and Image Name
  const imageURL =
    "https://res.cloudinary.com/design-code/image/upload/e_distort:" +
    pathPoints.topLeftX +
    ":" +
    pathPoints.topLeftY +
    ":" +
    pathPoints.topRightX +
    ":" +
    pathPoints.topRightY +
    ":" +
    pathPoints.bottomRightX +
    ":" +
    pathPoints.bottomRightY +
    ":" +
    pathPoints.bottomLeftX +
    ":" +
    pathPoints.bottomLeftY +
    "/" +
    "e_trim" +
    "/" +
    pixelDensity +
    "/" +
    imageQuality +
    "/" +
    imageName +
    ".png";

  console.log(`Image URL: ${imageURL}`);

  // Receive Cloudinary API response with selected coordinates if skewed
  // Perform image distortion with coordinates from path
  // Apply distorted Bitmap
  try {
    const photoObj = await xhrBinary(imageURL);
    const photoObjBase64 = await base64ArrayBuffer(photoObj);
    applyBitmap(selectedItem, photoObjBase64);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw new Error(error);
  }

  // Group back with Mask if Mask Group
  if (isMaskGroup === true) {
    commands.createMaskGroup();
  }
}

// Function to Apply the Bitmap, depending on the user selected Item
function applyBitmap(selectedItem, base64) {
  const imageFill = new ImageFill(`data:image/png;base64,${base64}`);
  selectedItem.fill = imageFill;
}

// Function to upload file to Cloudinary
async function uploadFile(file) {
  console.log("starting upload to cloudinary...");

  const uploadUrl = "https://api.cloudinary.com/v1_1/design-code/image/upload";

  let imageName = Math.floor(Math.random() * Math.floor(100000000));
  console.log(`Uploaded Image Name: ${imageName}`);
  var imageNamePath = fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify({
      upload_preset: "anglify",
      file: "data:image/png;base64," + file,
      public_id: "" + imageName
    })
  })
    .then(function(response) {
      console.log(`Upload Response: ${JSON.stringify(response)}`);
      return imageName;
    })
    .catch(error => console.log(`Upload error: ${error}`));
  return imageNamePath;
}

// Function to export PNG rendition to temporary storage and convert to Base64
// If selected shape is a Path, distort image to fit 4 coordinates of that shape
async function getBase64(selectedArtboard) {
  const imageBase64FromNode = async function(node) {
    const tempFolder = await uxp.storage.localFileSystem.getTemporaryFolder();
    const shotFile = await tempFolder.createEntry(`${randomString()}.png`, {
      overwrite: true
    });

    return new Promise(function(resolve, reject) {
      application
        .createRenditions([
          {
            node: node,
            outputFile: shotFile,
            type: application.RenditionType.PNG,
            scale: 2
          }
        ])
        .then(async function(files) {
          const buffer = await files[0].outputFile.read({
            format: uxp.storage.formats.binary
          });

          let bytes = new Uint8Array(buffer);

          resolve(base64Convert(bytes));
        })
        .catch(function(error) {
          reject(`Error converting to base64: ${error}`);
        });
    });
  };

  return imageBase64FromNode(selectedArtboard).then(base64 => {
    return base64;
  });
}

// Function to create modal with input fields to select Artboard, Pixel Density, and Quality
const $ = sel => document.querySelector(sel);

// Function to create Modal dialog
function createDialog(selection, rootnode) {
  document.body.innerHTML = `
        <style>
            .container {
                width: 500px;
            }

            .logo {
                background-image: url("./assets/logo-2.png");
                background-repeat: no-repeat;
                background-size: cover;
                width: 50px;
                height: 50px;
                position: relative;
                margin: 8px auto;
            }

            .title {
                text-align: center;
                font-size: 28px;
                font-weight: 700;
                color: black;
                margin: 8px;
            }

            .box {
              margin: 8px;
            }

            .header {
              text-align: center;
              font-size: 14px;
              margin-bottom: 24px;
            }

            .table {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                margin-bottom: 24px;
            }

            .artboard {
              width: 150px;
            }

            .label {
              margin-left: 4px;
            }

            #artboard-select {
              min-width: 150px;
            }

            #pixel-select {
              max-width: 75px;
            }

            #quality-select {
              max-width: 75px;
            }

            #orientation-select {
              max-width: 100px;
            }

            .items-selected {
              margin-top: 12px;
              margin-bottom: 8px;
              font-size: 12px;
              font-weight: bold;
              text-align: center;
            }

            #loader {
              display: none;
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              position: relative;
              margin: 0 auto;
              margin-top: 50px;
              margin-bottom: 8px;
            }

            .loader {
              background-image: url("./assets/loading.gif");
              background-repeat: no-repeat;
              background-size: cover;
              width: 65px;
              height: 65px;
              position: absolute;
              top: 36px;
              left: 6px;
            }

            #error {
              display: none;
              color: #E1467C;
              text-align: left;
              font-size: 12px;
              font-weight: 500;
              position: relative;
              margin: 0 auto;
              margin-top: 12px;
              margin-bottom: 8px;
              width: 90%;
            }

            .footer {
              margin-top: 8px;
              display: flex;
              flex-direction: row;
              justify-content: center;
            }

            .tooltip {
              display: flex;
              flex-direction: row;
              justify-content: center;
              margin-top: 16px;
              margin-bottom: -12px;
            }
        </style>
        <dialog id="dialog">
            <form id="container-form" class="container">
                <a href="https://designcode.io/angle-xd/"><div class="logo"></div></a>
                <h1 class="title">Apply to Mockup</h1>
                <div class="box">
                    <div class="header">Choose an Artboard to apply onto your selected shape(s):</div>
                    <div class="table">
                        <div class="artboard">
                            <span class="label" id="artboard-span">Artboard</span>
                            <select id="artboard-select">
                            </select>
                        </div>
                        <div>
                            <span class="label" id="pixel-span">Pixel Density</span>
                            <select id="pixel-select">
                              <option value="1">1x</option>
                              <option value="2">2x</option>
                              <option value="3">3x</option>
                              <option value="4">4x</option>
                            </select>
                        </div>
                        <div>
                            <span class="label" id="quality-span">Quality</span>
                            <select id="quality-select">
                              <option value="Best">Best</option>
                              <option value="Better">Better</option>
                              <option value="Good">Good</option>
                              <option value="Average">Average</option>
                            </select>
                        </div>
                        <div>
                            <span class="label" id="orientation-span">Orientation</span>
                            <select id="orientation-select">
                              <option value="Default">Default</option>
                              <option value="Rotate-Left">Rotate Left</option>
                              <option value="Rotate-Right">Rotate Right</option>
                              <option value="Flip">Flip</option>
                            </select>
                        </div>
                    </div>
                    <p class="items-selected" id="items-selected"> ${
                      selection.items.length === 0
                        ? "No items selected. Select some shapes to apply Angle!"
                        : selection.items.length === 1
                        ? "1 item selected!"
                        : selection.items.length + " items selected!"
                    } </p>
                    <div id="loader">
                      <div class="loader"></div>
                    </div>
                    <div id="error"></div>
                </div>
                <div class="footer" id="footer">
                    <button uxp-variant="primary" id="cancel">Cancel</button>
                    <button uxp-variant="cta" type="submit" id="apply">Apply</button>
                </div>
                <div class="tooltip" id="tooltip">
                  <a href="https://designcode.io/angle-xd-instructions/"><button id="instructions" uxp-quiet="true">Instructions</button></a>
                  <a href="https://designcode.io/angle-xd/"><button id="mockups" uxp-quiet="true">Buy Mockups</button></a>
                  <a href="https://designcode.io/privacy/"><button id="privacy-policy" uxp-quiet="true">Privacy Policy</button></a>
                </div>
            </form>
        </dialog>
`;

  // Setting the options for Artboard select
  let artboardSelectValue = "";

  rootnode.children.forEach((node, index) => {
    if (node instanceof scenegraph.Artboard) {
      const artboardObj = node.toString();
      const artboardName = extractAllText(artboardObj).toString();

      const select = document.getElementById("artboard-select");

      let option = document.createElement("option");
      option.value = artboardName;
      option.textContent = artboardName;
      option.value = artboardName;

      if (index === 0) {
        artboardSelectValue = option.value;
      }

      select.appendChild(option);
    }
  });

  // Setting default select values for all select fields
  document.getElementById("artboard-select").value = artboardSelectValue;
  document.getElementById("pixel-select").value = "3";
  document.getElementById("quality-select").value = "Best";
  document.getElementById("orientation-select").value = "Default";

  // Dialog to be used for closing
  const dialog = document.getElementById("dialog");

  // Cancel > Close Dialog
  document.getElementById("cancel").addEventListener("click", () => {
    dialog.close("cancelled");
  });

  // If no items selected
  // Disable everything and prompt user to start over
  if (selection.items.length <= 0) {
    document.getElementById("apply").style.display = "none";
    document.getElementById("cancel").style.margin = "0 auto";
    document.getElementById("cancel").innerHTML = "Close and try again";
    document.getElementById("artboard-select").disabled = true;
    document.getElementById("pixel-select").disabled = true;
    document.getElementById("orientation-select").disabled = true;
    document.getElementById("quality-select").disabled = true;
  }

  function triggerApplyButton() {
    // Set pixel density from the select
    let pixelSelect = document.getElementById("pixel-select");
    let pixelSelectedOption =
      pixelSelect.options[pixelSelect.selectedIndex].textContent;

    console.log("optionSelected: (final) " + pixelSelectedOption);

    let pNumber = "3.0";
    if (pixelSelectedOption === "4x") {
      pNumber = "4.0";
    } else if (pixelSelectedOption === "3x") {
      pNumber = "3.0";
    } else if (pixelSelectedOption === "2x") {
      pNumber = "2.0";
    } else if (pixelSelectedOption === "1x") {
      pNumber = "1.0";
    }

    pixelDensity = `dpr_${pNumber}`;

    // Set image quality from the select
    let qualitySelect = document.getElementById("quality-select");
    let qualitySelectedOption =
      qualitySelect.options[qualitySelect.selectedIndex].textContent;

    console.log("optionSelected: (final) " + qualitySelectedOption);

    let qValue = "best";
    if (qualitySelectedOption === "Best") {
      qValue = "best";
    } else if (qualitySelectedOption === "Better") {
      qValue = "good";
    } else if (qualitySelectedOption === "Good") {
      qValue = "eco";
    } else if (qualitySelectedOption === "Average") {
      qValue = "low";
    }

    imageQuality = `q_auto:${qValue}`;

    // Set image quality from the select
    let orientationSelect = document.getElementById("orientation-select");
    let orientationSelectOption =
      orientationSelect.options[orientationSelect.selectedIndex].textContent;

    console.log("optionSelected: (final) " + orientationSelectOption);

    let oValue = "auto";
    if (orientationSelectOption === "Default") {
      oValue = "auto";
    } else if (orientationSelectOption === "Rotate Left") {
      oValue = "rotate-left";
    } else if (orientationSelectOption === "Rotate Right") {
      oValue = "rotate-right";
    } else if (orientationSelectOption === "Flip") {
      oValue = "flip";
    }

    orientationFill = oValue;

    // Displaying working loader and disable buttons
    const loaderText = document.createTextNode("Working...");
    if (selection.items.length > 0) {
      document.getElementById("apply").style.display = "none";
      document.getElementById("cancel").style.display = "none";
      document.getElementById("instructions").style.display = "none";
      document.getElementById("privacy-policy").style.display = "none";
      document.getElementById("mockups").style.display = "none";
      document.getElementById("items-selected").style.display = "none";
      document.getElementById("artboard-select").disabled = true;
      document.getElementById("pixel-select").disabled = true;
      document.getElementById("quality-select").disabled = true;
      document.getElementById("orientation-select").disabled = true;
      document.getElementById("loader").style.display = "block";
      document.getElementById("loader").appendChild(loaderText);

      // Matching the user selected artboard from dropdown respective artboard that on canvas
      const select = document.getElementById("artboard-select");
      const selectedOption = select.options[select.selectedIndex]
        ? select.options[select.selectedIndex].textContent
        : "";

      let selectedArtboard = {};
      rootnode.children.forEach(node => {
        const nodeObj = node.toString();
        const nodeName = extractAllText(nodeObj).toString();

        if (nodeName === selectedOption) {
          selectedArtboard = node;
        }
      });

      // Apply Angle Function > close dialog
      applyAngleFunction(selectedArtboard)
        .then(() => {
          dialog.close("Angle applied!");
        })
        .catch(async error => {
          const errorText = document.createTextNode(error);
          document.getElementById("loader").style.display = "none";
          document.getElementById("error").style.display = "block";
          document.getElementById("error").appendChild(errorText);
          document.getElementById("instructions").style.display = "block";
          document.getElementById("instructions").style.marginTop = "32px";
          document.getElementById("cancel").disabled = false;
          document.getElementById("cancel").style.display = "block";
          document.getElementById("cancel").style.margin = "0 auto";
          document.getElementById("cancel").innerHTML = "Close and try again";
        });
    }
  }

  // Apply Angle Button Actions
  document.getElementById("container-form").onsubmit = event => {
    event.preventDefault();
    triggerApplyButton();
  };

  return dialog;
}
