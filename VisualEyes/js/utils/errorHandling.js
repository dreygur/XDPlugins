// import { postError } from "./api";
const application = require("application");
const {
  getApiKey,
  createToastMessageWithCTA,
  createToastMessage,
} = require("./helpers");
const { getValue } = require("./storage");
const {
  VISUALEYES_VERSION,
  PLATFORM,
  GENERIC_ERROR,
  CUSTOM_API_ERROR,
  API_ERRORS,
  ERROR_TRACKING_URL,
} = require("./constants");

function customError(name, message, status) {
  throw { name: name, message: message, status: status };
}

async function sendError(error) {
  try {
    console.log("[ErrorTracking]");
    console.log(error);

    if (error.name === CUSTOM_API_ERROR) {
      if (error.status === 403) {
        // No credits left
        createToastMessageWithCTA(
          "Oopss...",
          "Unfortunately, you've run out of credits.",
          "Upgrade Now",
          "https://www.visualeyes.design/pricing?fromPlugin=adobexd"
        );
      } else {
        createToastMessage(error.message);
      }

      return;
    }

    const name = error.name;
    const message = error.message;
    const stack = error.stack;
    const adobeVersion = await application.version;
    const apiKey = await getApiKey();
    const pluginCommand = await getValue("commandId");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    formData.append("stack", stack);
    formData.append("api_key", apiKey);
    formData.append("visualeyes_version", VISUALEYES_VERSION);
    formData.append("tool_version", adobeVersion);
    formData.append("platform", PLATFORM);
    formData.append("plugin_command", pluginCommand);

    await fetch(ERROR_TRACKING_URL, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log(res);

        const { status } = res;

        if (status === 200) {
          return res.json();
        } else {
          throw Error(`Error Tracking request failed with status ${status}`);
        }
      })
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        createToastMessageWithCTA(
          "😿 We're sorry!",
          GENERIC_ERROR,
          "Report the Bug",
          "https://spectrum.chat/visualeyes-designers/bugs?tab=posts"
        );
      });

    return;
  } catch (err) {
    console.log(err);
  }
}

function handleAPIError(status) {
  if (status === 400) {
    return { name: CUSTOM_API_ERROR, message: API_ERRORS.STATUS_400, status };
  } else if (status === 401) {
    return { name: CUSTOM_API_ERROR, message: API_ERRORS.STATUS_401, status };
  } else if (status === 402) {
    return { name: CUSTOM_API_ERROR, message: API_ERRORS.STATUS_402, status };
  } else if (status === 403) {
    return { name: CUSTOM_API_ERROR, message: API_ERRORS.STATUS_403, status };
  } else if (status === 503) {
    return { name: CUSTOM_API_ERROR, message: API_ERRORS.STATUS_503, status };
  } else {
    return {
      name: CUSTOM_API_ERROR,
      message: API_ERRORS.GENERIC_ERROR,
      status,
    };
  }
}

module.exports = { customError, sendError, handleAPIError };
