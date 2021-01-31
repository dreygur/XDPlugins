const {
  getApiKey,
  createToastMessage,
  createToastMessageWithCTA,
} = require("./utils/helpers");
const { CUSTOM_API_ERROR } = require("./utils/constants");
const { sendError } = require("./utils/errorHandling");
const { getCredits } = require("./utils/api");

async function learnCredits() {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return;

    await getCredits(apiKey)
      .then((credits) => {
        if (credits !== 0) {
          createToastMessage(`💡You have ${credits} credits left!`);
        } else {
          createToastMessageWithCTA(
            "Oopss...",
            "Unfortunately, you've run out of credits.",
            "Upgrade Now",
            "https://www.visualeyes.design/pricing?fromPlugin=adobexd"
          );
        }
      })
      .catch((error) => {
        sendError(error);
      });
  } catch (error) {
    sendError(error);
  }

  return;
}

module.exports = learnCredits;
