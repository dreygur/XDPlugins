const { handleExports } = require("../export/index");
const { renditionSizes } = require("../export/renditions");
const {
  getColorList,
  getColorDetails,
  setColorPreview
} = require("../color/index");
const application = require("application");
const fs = require("uxp").storage.localFileSystem;

let panel;

const attachUI = async event => {
  if (panel) return true;

  const markup = await getMarkup();
  panel = document.createElement("div");
  panel.id = "panel";
  panel.innerHTML = markup;

  attachExportLists();
  panel
    .querySelector("form")
    .addEventListener("submit", () => application.editDocument(handleExports));

  event.node.appendChild(panel);
  return true;
};

const getMarkup = async () => {
  const pluginFolder = await fs.getPluginFolder();
  const pluginFolderEntries = await pluginFolder.getEntries();

  const uiFolder = pluginFolderEntries.filter(entry => entry.name === "ui")[0];
  const uiFolderEntries = await uiFolder.getEntries();

  const markupFile = uiFolderEntries.filter(
    entry => entry.name === "markup.html"
  )[0];
  const markupFileContents = await markupFile.read();

  return markupFileContents;
};

const attachExportLists = () => {
  Object.values(renditionSizes).map(platform => {
    const platformDiv = attachContainer(platform);
    attachSizeList(platform, platformDiv);
  });
};

const attachContainer = platform => {
  const sizeListDiv = panel.querySelector("#size-list");
  const platformDiv = document.createElement("div");
  const platformHeading = document.createElement("h2");

  sizeListDiv.className = "container";
  platformDiv.id = platform.platformName;
  platformDiv.className = "col platform";
  platformHeading.textContent = platform.platformName;
  platformDiv.appendChild(platformHeading);
  sizeListDiv.appendChild(platformDiv);

  return platformDiv;
};

const attachSizeList = (platform, platformDiv) => {
  platform.sizes.map(size => {
    const sizeItem = document.createElement("div");
    sizeItem.textContent = `・${size}px`;
    sizeItem.className = "size-item";
    platformDiv.appendChild(sizeItem);
  });
};

const attachColorList = () => {
  const select = panel.querySelector("#color-select");
  const colorList = getColorList();

  const optionTags = colorList
    .map(colorAsset => {
      const { selected, value, displayStr, source } = getColorDetails(
        colorAsset
      );

      return `<option ${selected} value='${value}'>${source}${displayStr}</option>`;
    })
    .join("");

  select.innerHTML = optionTags;
  select.addEventListener("change", setColorPreview);
  setColorPreview();
};

module.exports = {
  attachUI,
  attachColorList
};
