const getScaleDialog = require("./functions/getScaleDialog");
const {
  showSelectedNoedsLengthError,
  showRootNodeContextError,
} = require("./functions/utilities");

async function showScaleDialog(selection) {
  // Error
  if (selection.items.length !== 1 && selection.items.length !== 2) {
    showSelectedNoedsLengthError();
    return false;
  }
  // Error2
  if (selection.items[0].parent.constructor.name === "RootNode") {
    showRootNodeContextError();
    return false;
  }
  // Get and show the dialog
  const dialog = getScaleDialog(selection);
  const result = await dialog.showModal();
  // Exit if the user cancels the modal
  if (result === "reasonCanceled")
    console.log("[LOG] The user canncel or escape the menu");
  // Exit on user completion of task
  return console.log("[LOG] Operation finished");
}

module.exports = {
  commands: {
    run: showScaleDialog,
  },
};
