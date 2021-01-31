// Documentation: https://adobexdplatform.com/plugin-docs/reference/scenegraph.html

const application = require("application");
const { ImageFill, Rectangle } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;
const formats = require("uxp").storage.formats;
const base64 = require("./utils/base64-arraybuffer");
const { saveValue } = require("./utils/storage");
const { sendError } = require("./utils/errorHandling");
const { predict, getCreditsXML } = require("./utils/api");
const { CLARITY_URL, VISUALEYES_VERSION } = require("./utils/constants");
const {
  getApiKey,
  createToastMessage,
  createToastMessageWithCTA,
} = require("./utils/helpers");

async function clarityDesktop(selection) {
  await clarity(selection, "desktop");
}

async function clarityMobile(selection) {
  await clarity(selection, "mobile");
}

async function clarity(selection, model) {
  try {
    await saveValue("commandId", model + "Clarity");

    if (!selection.hasArtboards)
      return createToastMessage(`👎 Please select an Artboard`);

    const artboard = selection.items[0];

    const apiKey = await getApiKey();
    if (!apiKey) return;

    // Check remaining credits
    const credits = await getCreditsXML(apiKey).catch((err) => {
      sendError(err);
    });

    if (credits === 0) {
      // No credits ledt
      createToastMessageWithCTA(
        "Oopss...",
        "Unfortunately, you've run out of credits.",
        "Upgrade Now",
        "https://www.visualeyes.design/pricing?fromPlugin=adobexd"
      );
      return;
    } else if (credits === undefined) {
      // API key is not valid
      return;
    }

    const modelEmoji = model === "desktop" ? "🖥" : "📱";
    createToastMessage(`🔮+${modelEmoji} Clarity prediction is generating...`);

    // Export Artboard to temporary image file
    const folder = await fs.getTemporaryFolder();
    const file = await folder.createFile("tmp", { overwrite: true });
    const renditionSettings = [
      {
        node: artboard,
        outputFile: file,
        type: application.RenditionType.JPG,
        scale: 1,
        quality: 100,
      },
    ];

    const rectangle = new Rectangle();
    createHeatmapLayer(rectangle, artboard);

    const base64Artboard = await new Promise((resolve) => {
      application.createRenditions(renditionSettings).then(async (results) => {
        const binary = await results[0].outputFile.read({
          format: formats.binary,
        });

        const imgBase64 = "data:image/jpg;base64," + base64.encode(binary);
        resolve(imgBase64);
      });
    });

    const formData = new FormData();
    formData.append("platform", "adobeXD");
    formData.append("image", base64Artboard);
    formData.append("model", model);
    formData.append("version", VISUALEYES_VERSION);

    const clarityUrl = await predict(
      CLARITY_URL,
      formData,
      apiKey
    ).catch((err) => sendError(err));

    if (!clarityUrl) {
      // Something failed, do nothing
      return;
    } else {
      rectangle.fill = await getImageFill(clarityUrl);
      createToastMessage(`🎉 Hooray! Your clarity prediction is ready!`);
    }
  } catch (error) {
    sendError(error);
  }

  return;
}

function createHeatmapLayer(rectangle, artboard) {
  rectangle.name = "VisualEyes Heatmap";
  rectangle.width = artboard.width;
  rectangle.height = artboard.height;
  artboard.addChild(rectangle);
  rectangle.moveInParentCoordinates(0, 0);
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

async function getImageFill(url) {
  try {
    const photoObj = await xhrBinary(url);
    const tempFolder = await fs.getTemporaryFolder();
    const file = await tempFolder.createFile("tmp", { overwrite: true });
    await file.write(photoObj, { format: formats.binary });
    const imageFill = new ImageFill(file);
    return imageFill;
  } catch (err) {
    sendError(err);
  }
}

module.exports = {
  clarityDesktop,
  clarityMobile,
};
