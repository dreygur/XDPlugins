const Dialog = require('./src/views/integrate-dialog');
const ResultDialog = require('./src/views/result-dialog');
const ChangeDialog = require('./src/views/change-dialog');
const NodeUtils = require('./src/utils/node-utils');
const IOUtils = require('./src/utils/io-utils');
const Network = require('./src/network/network');
const ConfigDialog = require('./src/views/config-dialog');
const Export = require('./src/export');

const configDialog = new ConfigDialog();

var resources;
var settings;
var interestedResources;

const network = new Network();
const resExport = new Export();
const ioUtil = new IOUtils();

async function doIntegrate(selection, root) {

  // 1. Show dialog and get settings
  settings = await new Dialog().show();
  if (!settings.serverAddress) return;
  interestedResources = { color: settings.color, localization: settings.localization, image: settings.image, appicon: settings.appicon };

  // 2. Collect resources based on settings
  const nodeUtil = new NodeUtils(selection, root);
  resources = nodeUtil.getProperties(settings.export == "root", interestedResources);

  // 3. Write images into temporary directory and read them back
  const images = await ioUtil.write(resources.image);
  resources.image.length = 0;

  if (images !== undefined)
    images.forEach(image => {
      if (image.name !== "App icon single" && image.name !== "App icon background" && image.name !== "App icon foreground") resources.image.push(image);
      else if (interestedResources.appicon) resources.appicon.push(image);
    });

  // 4. Get available resources
  await network.info(settings.projectToken, settings.serverAddress, projectInfo);
}

async function doExport(versions) {
  const preview = resExport.preview(resources, versions);
  network.preview(settings.projectToken, settings.serverAddress, preview, previewListener, versions);
}

var projectInfo = {
  onSuccess: async function (info) {
    const versions = await configDialog.show(info, loadVersion, interestedResources);
    if (versions === undefined) return;
    doExport(versions)
  },

  onError: async function (error) {
    await new ResultDialog().show("error", error);
  }
}

var loadVersion = {
  version: async function (version) {
    network.config(settings.projectToken, settings.serverAddress, version, versionListener);
  }
}

var versionListener = {
  onSuccess: async function (languages) {
    if(interestedResources.localization)
      configDialog.updateLanguages(languages)
  },

  onError: async function (error) {
    await new ResultDialog().show("error", error);
  }
}

var previewListener = {
  onSuccess: async function (previewConfig) {
    const status = resExport.parsePreviewResponse(previewConfig.data)
    const stateDialog = await new ChangeDialog().show(status, interestedResources);

    if (stateDialog !== "OK") return;
    const exportable = resExport.export(resources, previewConfig.extras, status);
    network.export(settings.projectToken, settings.serverAddress, exportable, exportListener);
  },

  onError: async function (error) {
    await new ResultDialog().show("error", error);
  }
}

var exportListener = {
  onSuccess: async function (response) {
    console.log("itt1")
    await new ResultDialog().show(response);
  },

  onError: async function (error) {
    await new ResultDialog().show("error", error);
  }
}

module.exports = {
  commands: {
    respresso: doIntegrate,
  }
};