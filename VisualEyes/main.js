// Documentation: (selection)=>https:COMMAND_TYPE,//adobexdplatform.com/plugin-docs/reference/scenegraph.html
const setApiKey = require("./js/setApiKey");
const learnCredits = require("./js/credits");
const startPrediction = require("./js/startPrediction");
const onBoarding = require("./js/onBoarding");
const { COMMAND_TYPE } = require("./js/utils/constants");

module.exports = {
  commands: {
    predictionDesktop: selection =>
      startPrediction(selection, COMMAND_TYPE.attentionDesktop),
    predictionMobile: selection =>
      startPrediction(selection, COMMAND_TYPE.attentionMobile),
    setApiKey,
    learnCredits,
    onBoarding
  }
};
