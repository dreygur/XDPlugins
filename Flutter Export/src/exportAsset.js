const React = require('react');
const {error, alert} = require('@adobe/xd-plugin-toolkit/lib/dialogs');
const application = require('application');
const fs = require('uxp').storage.localFileSystem;
const {getManifest} = require('@adobe/xd-plugin-toolkit/lib/manifest.js');

const flutterSupportedScales = [
  {
    scale: 1,
  },
  {
    scale: 2,
    folder: '2.0x',
  },
  {
    scale: 3,
    folder: '3.0x',
  },
];

const formatOptions = {
  'png': {
    type: application.RenditionType.PNG,
    supportedScales: flutterSupportedScales,
  },
  'jpg': {
    type: application.RenditionType.JPG,
    quality: 100,
    supportedScales: flutterSupportedScales,
  },
  'svg': {
    type: application.RenditionType.SVG,
    minify: true,
    embedImages: true,
    supportedScales: [flutterSupportedScales[0]],
  },
};

const formatName = fileName => fileName.replace(/[^a-z0-9_-]/gi, '_');

const createFile = async (folder, name, format) => {
  return await folder.createFile(`${name}.${format}`, {overwrite: true});
};

const getFolder = async (folder, folderName) => {
  try {
    return await folder.getEntry(folderName);
  } catch (e) {
    return await folder.createFolder(folderName);
  }
};

const exportAsset = async (item, {fileName, fileFormat}) => {
  const manifest = await getManifest();
  const cleanedName = formatName(fileName);
  const options = formatOptions[fileFormat];
  const renditions = [];

  const selectedFolder = await fs.getFolder();
  if (!selectedFolder) return;

  for (const supportedScale of options.supportedScales) {
    renditions.push({
      node: item,
      outputFile: await createFile(supportedScale.folder
        ? await getFolder(selectedFolder, supportedScale.folder)
        : selectedFolder, cleanedName, fileFormat),
      ...options,
      scale: supportedScale.scale,
    })
  }

  try {
    const results = await application.createRenditions(renditions);
    const renditionLinks = results.map((value, index) => `<a href="file://${value.outputFile.nativePath.replace(value.outputFile.name, '')}">${index + 1}x - ${value.outputFile.name}</a>`);
    await alert('<p class="color-green">Export successful</p>', ['Files can be found here:', ...renditionLinks]);
  } catch (e) {
    console.log(e);
    await error('Oops!', [
      `<p class="color-red">Exporting failed, check console and submit an issue <a href=${manifest.helpUrl}>here</a></p>`,
      ' ',
      e
    ]);
  }
};

module.exports = {
  exportAsset,
  formatOptions,
};
