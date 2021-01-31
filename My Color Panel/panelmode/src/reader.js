"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function datareader(url) {
    return new Promise(async (resolve, reject) => {
        const fs = require("uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestFile = await dataFolder.getEntry(url);
        if (manifestFile) {
            let styleofmdp = await manifestFile.read();
            resolve(styleofmdp);
        }
        resolve("");
    });
}
exports.datareader = datareader;
function dataDir(url) {
    return new Promise(async (resolve, reject) => {
        const fs = require("uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestDir = await dataFolder.getEntry(url);
        if (manifestDir) {
            const entries = await manifestDir.getEntries();
            entries.forEach(entry => console.log(entry.name));
            resolve(entries);
        }
        resolve("");
    });
}
exports.dataDir = dataDir;
