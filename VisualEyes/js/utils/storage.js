const fs = require("uxp").storage.localFileSystem;
const { formats } = require("uxp").storage;
// const { createResultLayer } = require("../startPrediction");

function createFilename(identifier) {
  return `visualeyes-${identifier}.txt`;
}

async function saveValue(key, value) {
  const filename = createFilename(key);
  const folder = await fs.getDataFolder();
  const entries = await folder.getEntries();

  const hasFile = entries.some(entry => entry.name === filename);

  let settingsFile, previousValue;
  if (hasFile) {
    // File exists already
    settingsFile = entries.find(entry => entry.name === filename);
    await settingsFile.write(value);
  } else {
    // Create file
    settingsFile = await folder.createFile(filename, {
      overwrite: true
    });
    await settingsFile.write(value);
  }
}

async function getValue(key) {
  const filename = createFilename(key);
  const folder = await fs.getDataFolder();
  const entries = await folder.getEntries();

  const hasFile = entries.some(entry => entry.name === filename);

  let settingsFile, previousValue;
  if (hasFile) {
    // File exists already
    settingsFile = entries.find(entry => entry.name === filename);
    previousValue = await settingsFile.read({ format: formats.utf8 });
    // console.log(previousValue);

    return previousValue;
  } else {
    return null;
  }
}

module.exports = {
  getValue,
  saveValue
};
