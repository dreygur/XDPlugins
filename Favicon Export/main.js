const { attachUI, attachColorList } = require("./ui/index");
const { validateSelection } = require("./ui/validate");

let uiMounted = false;

async function show(event) {
  uiMounted = await attachUI(event);
  if (uiMounted) attachColorList(); // Ensures list is in sync with Assets
  return await update();
}

async function update() {
  if (uiMounted) {
    return validateSelection();
  }
}

module.exports = {
  panels: {
    faviconExport: {
      show,
      update
    }
  }
};
