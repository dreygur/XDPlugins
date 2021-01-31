const { version } = require("../../manifest.json");

// const API_BASE_URL = "http://2.85.195.84:8000/";
const API_BASE_URL = "https://api.visualeyes.design";
// const API_BASE_URL = "https://infinite-cliffs-54943.herokuapp.com";

const PREDICTION_URL = API_BASE_URL + "/predictions/tool";
const ERROR_TRACKING_URL = API_BASE_URL + "/tracker/errors";
const FEEDBACK_URL = API_BASE_URL + "/tracker/feedback";

const CUSTOM_API_ERROR = "CUSTOM_API_ERROR";

const VISUALEYES_VERSION = version;
const PLATFORM = "adobexd";
const GENERIC_ERROR =
  "Something went wrong! Please, report the bug at our Spectrum community.";

const API_ERRORS = {
  STATUS_400: "😱 We are deeply sorry, but something went wrong!",
  STATUS_401: "🙅‍ Your API key is invalid",
  STATUS_402: "🌈 You should upgrade your account to access this feature",
  STATUS_403: "🚨 Your heatmaps limit has been exceeded",
  STATUS_503:
    "🚧 Our elves are working hard to update our services. VisualEyes will be online really soon!!",
  GENERIC_ERROR:
    "😵 Something went wrong! Please, report the bug at our Spectrum community.",
};

const COMMAND_TYPE = {
  attentionDesktop: "attentionDesktop",
  attentionMobile: "attentionMobile",
  clarityDesktop: "clarityDesktop",
  clarityMobile: "clarityMobile",
};

const ORIGINAL = "originalbtn";
const ATTENTION = "attentionbtn";
const CLARITY = "claritybtn";
const ORIGINAL_IMAGE = "originalImg";
const ATTENTION_IMAGE = "openattention";
const CLARITY_IMAGE = "openclarity";
const HEATMAP_TIP =
  "Attention Map help you understand which parts of your screen are the most engaging. Basically, it forecasts where your users will look into your design.";
const CLARITY_TIP =
  "Clarity predicts how clear and aesthetically pleasing is your design. A lower score means that your design is cluttered.";
const FEEDBACK_TIP = "Click here and type in your message.";

module.exports = {
  API_BASE_URL,
  ERROR_TRACKING_URL,
  CUSTOM_API_ERROR,
  VISUALEYES_VERSION,
  PLATFORM,
  GENERIC_ERROR,
  API_ERRORS,
  PREDICTION_URL,
  COMMAND_TYPE,
  FEEDBACK_URL,
  ORIGINAL,
  ATTENTION,
  CLARITY,
  ORIGINAL_IMAGE,
  ATTENTION_IMAGE,
  CLARITY_IMAGE,
  HEATMAP_TIP,
  CLARITY_TIP,
  FEEDBACK_TIP
};
