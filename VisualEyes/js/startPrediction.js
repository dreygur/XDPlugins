// Documentation: https://adobexdplatform.com/plugin-docs/reference/scenegraph.html
const application = require("application");
const { ImageFill, Rectangle } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;
const formats = require("uxp").storage.formats;
const base64 = require("./utils/base64-arraybuffer");
const { saveValue } = require("./utils/storage");
const { sendError } = require("./utils/errorHandling");
const { predict, getCreditsXML, postFeedback } = require("./utils/api");
const {
  PREDICTION_URL,
  VISUALEYES_VERSION,
  COMMAND_TYPE,
} = require("./utils/constants");
const {
  getApiKey,
  createToastMessage,
  createToastMessageWithCTA,
  createToastMessageWithTitle,
  createFinishDialog,
} = require("./utils/helpers");

const { createFinishWindow, trackAnalytics } = require ("./utils/resultwindow");

const MAX_AOI = 10;
const MIN_AOI = 10;

function getAOI(artboard) {
  const layers = artboard.children;

  return layers
    .filter((layer) => {
      const isRectangle =
        layer instanceof Rectangle && layer.name.trim().toUpperCase() === "AOI";

      if (isRectangle) {
        const { x, y, width, height } = layer.boundsInParent;
        const maxWidth = artboard.width;
        const maxHeight = artboard.height;

        const isInsideArtboard =
          x >= 0 && y >= 0 && x + width <= maxWidth && y + height <= maxHeight;

        const isSmall = width < MAX_AOI || height < MIN_AOI;

        if (isSmall) {
          createToastMessage(
            `👎 One of your rectangles was not big enough (minimum ${MAX_AOI}x${MIN_AOI} pixels)`
          );
          layer.visible = false;
          layer.name = `🚨 Too small (minimum ${MAX_AOI}x${MIN_AOI})`;
        } else if (!isInsideArtboard) {
          createToastMessage(
            " 😱 One of your rectangles is outside the current Artboard."
          );
          layer.visible = false;
          layer.name = "🚨 Off the current Artboard";
        }

        return isInsideArtboard && !isSmall;
      } else {
        return false;
      }
    })
    .map((rect, index) => {
      // Get the bounding box
      const { x, y, width, height } = rect.boundsInParent;

      rect.visible = false;

      const topLeft = { x: x, y: y, index: 0 };
      const topRight = { x: x + width, y: y, index: 1 };
      const bottomRight = { x: x + width, y: y + height, index: 2 };
      const bottomLeft = { x: x, y: y + height, index: 3 };
      const points = [topLeft, topRight, bottomRight, bottomLeft];

      return {
        id: `aoi-${index}`,
        points,
      };
    });
}

async function startPrediction(selection, commandType) {
  try {
    await saveValue("commandId", commandType);

    if (!selection.hasArtboards)
      return createToastMessage(`👎 Please select an Artboard`);

    const artboard = selection.items[0]; // TODO: find artboard the correct way

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

    createToastMessageWithTitle(
      `Analyzing your image...`,
      `💡 The results will be available as separate hidden layer into the Artboard.`
    );

    const rectangles = getAOI(artboard);
    trackAnalytics("startplugin",apiKey,commandType);
    // Export Artboard to temporary image file
    const folder = await fs.getTemporaryFolder();
    const file = await folder.createFile("tmp", { overwrite: true });
    const renditionSettings = [
      {
        node: artboard,
        outputFile: file,
        type: application.RenditionType.JPG,
        scale: 1,
        quality: 70,
      },
    ];

    const metric =
      commandType === COMMAND_TYPE.attentionDesktop ||
      commandType === COMMAND_TYPE.attentionMobile
        ? "attention"
        : "clarity";

    const attentionRectangle = new Rectangle();
    const clarityRectangle = new Rectangle();
    createResultLayer(
      attentionRectangle,
      artboard,
      "🔥 Attention Map",
      metric === false
    );
    createResultLayer(
      clarityRectangle,
      artboard,
      "💎 Clarity",
      metric === false
    );

    const base64Artboard = await new Promise((resolve) => {
      application.createRenditions(renditionSettings).then(async (results) => {
        const binary = await results[0].outputFile.read({
          format: formats.binary,
        });

        const imgBase64 = "data:image/jpg;base64," + base64.encode(binary);
        resolve(imgBase64);
      });
    });

    const model =
      commandType === COMMAND_TYPE.attentionDesktop ||
      commandType === COMMAND_TYPE.clarityDesktop
        ? "desktop"
        : "mobile";

    const formData = new FormData();
    formData.append("version", VISUALEYES_VERSION);
    formData.append("platform", "adobeXD");
    formData.append("model", model);
    formData.append("metric", metric);
    formData.append("name", artboard.name);
    formData.append("image", base64Artboard);

    if (rectangles.length > 0) {
      trackAnalytics("hasAOI",apiKey);
      console.log(rectangles);
      formData.append("aoi", JSON.stringify(rectangles));
    }

    const { clarityUrl, attentionUrl, dashboardUrl, score } = await predict(
      PREDICTION_URL,
      formData,
      apiKey
    ).catch((err) => {
      sendError(err);
    });

    if (!clarityUrl || !attentionUrl || !dashboardUrl) {
      createToastMessage(`😭 Something something went wrong`, dashboardUrl);
      return;
    } else {
      attentionRectangle.fill = await getImageFill(attentionUrl);
      clarityRectangle.fill = await getImageFill(clarityUrl);
      createToastMessage(`🧠 See Results.`, dashboardUrl);
      // console.log(attentionUrl, clarityUrl, base64Artboard, score);

      createFinishWindow(
        attentionUrl,
        clarityUrl,
        base64Artboard,
        score,
        "Hint: The clarity is a hidden layer inside your Artboard.",
        dashboardUrl,
        apiKey
      );
    }
  } catch (error) {
    sendError(error);
  }

  return;
}
function createResultLayer(rectangle, artboard, name, isVisible) {
  rectangle.name = name;
  rectangle.width = artboard.width;
  rectangle.height = artboard.height;
  rectangle.visible = isVisible;
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


module.exports = startPrediction;
