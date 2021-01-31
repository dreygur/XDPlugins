const {  postFeedback } = require("./utils/api");
const {changeFeedbackMessage, errorFeedbackMessage} = require("./utils/resultwindow");
const { sendError } = require("./utils/errorHandling");


 async function sendFeedback(feedback,apiKey) {
    var formData = new FormData();
    formData.append("text", feedback);
    formData.append("api_key", apiKey);
    formData.append("platform", "adobexd");
    await postFeedback(formData)
      .then(res => {
        document.querySelector("#sendfeedbacksection").style.display = "none";
        document.querySelector("#thankyousection").style.display = "flex";
      })
      .catch(err => {
        console.log(err);
        document.querySelector("#sendfeedbacksection").style.display = "none";
        document.querySelector("#errorsection").style.display = "flex";
        sendError(err);
      });
}

module.exports = sendFeedback;