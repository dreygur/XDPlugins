const { exportRenditions } = require("./renditions");
const { exportMarkup } = require("./markup");
const { msg, showMessage } = require("../ui/message");

const handleExports = async () => {
  const renditionMsgOpts = await exportRenditions();

  //// Outcomes
  if (renditionMsgOpts.message === msg.opInfo.folderPickerCancel) {
    // Cancel
    return;
  } else if (renditionMsgOpts.message === msg.opInfo.success) {
    // Success
    const markupResOpts = exportMarkup(renditionMsgOpts.filesWithDetails);
    renditionMsgOpts.message += ` ${markupResOpts.message}`;
    showMessage(renditionMsgOpts);
  } else {
    // Errors
    showMessage(renditionMsgOpts);
  }
};

module.exports = {
  handleExports
};
