const { createToastMessageWithCTA } = require("./utils/helpers");
const { sendError } = require("./utils/errorHandling");
const { trackAnalytics } = require("./utils/resultwindow");
const {getApiKey } = require ("./utils/helpers");

async function onBoarding() {
  try {
    const apiKey = await getApiKey();
    trackAnalytics("onBoarding",apiKey);
    createToastMessageWithCTA(
      "Welcome on board",
      `
      <div style="display: flex; margin: 1rem auto 2rem 1rem">Create a FREE account <a href="https://app.visualeyes.design?fromPlugin=adobexd" style="margin-left: 0.3rem">here</a> and start designing with data in mind.</div>
    
      <b>⚡️ What is 1 credit?</b>
          From now on, one credit is equivalent to one prediction (Clarity and Attention map)

      <b>🔮 How to run a prediction:</b>
          1. Select an Artboard
          2. Specify the target device
          3. According to your target device, run the command "Desktop (or Mobile) Design".
          4. The results dialog will open and you can see your results (Attention and Clarity).
          5. By default, metrics layers are hidden layer in your Artboard. Toggle the visibility of them based on your needs.

      <b>📦 How to create Areas of Interest:</b>
          1. Create a Rectangle named AOI inside your Artboard.
          2. Select the Artboard.
          3. Run the command "Desktop (or Mobile) Design". The Attention Map's result will include your AOI.
      `,
      "Learn More",
      "http://bit.ly/visualeyes_learn"
    );
  } catch (error) {
    sendError(error);
  }

  return;
}

module.exports = onBoarding;
