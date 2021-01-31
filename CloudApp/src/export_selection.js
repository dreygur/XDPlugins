const application = require("application");
const fs = require("uxp").storage.localFileSystem;

async function exportSelection(selection) {
  const dataFolder = await fs.getDataFolder();
  const file = await dataFolder.createEntry('image.png', { overwrite: true });
  const renditions = [{
	node: selection.items[0],
	outputFile: file,
	type: "png",
	scale: 2
  }];
  try{
    await application.createRenditions(renditions);
    return file;
  }catch (e){
    console.log(`Error creating renditions ${e}`);
  }

}

module.exports = {
  exportSelection
};
