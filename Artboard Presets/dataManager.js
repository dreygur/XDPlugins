const fs = require("uxp").storage.localFileSystem;

let customDataPath = "customData.json";
let initJson = `{
			"sectionName": "CUSTOM",
			"values": []
		}`;

//Adapted from xd-storage-helper
async function getCustomDataFile() {
	const dataFolder = await fs.getDataFolder();
	try {
		let returnFile = await dataFolder.getEntry(customDataPath);
		console.log("data folder is at: " + fs.getNativePath(returnFile));
		return returnFile;
	} catch (e) {
		const file = await dataFolder.createFile(customDataPath);
		if(file.isFile) {
			await file.write(initJson);
			return file;
		}
		else {
			throw new Error('Storage file customData.json was not a file.');
		}
	}
};

async function getJsonFromFile(file) {
	console.log("getJsonFromFile()");
	try {
		let jsonData = JSON.parse((await file.read()).toString());
		return jsonData;
	} catch (e){
		throw new Error('Could not get JSON from file');
	}
}

async function getFileContents(path){
	console.log(`getFileContents(${path})`);
	const pluginFolder = await fs.getPluginFolder();
	const file = await pluginFolder.getEntry(path);
	const fileContent = await file.read();
	return fileContent;
};

module.exports = {
	getCustomDataFile,
	getJsonFromFile,
	getFileContents
}