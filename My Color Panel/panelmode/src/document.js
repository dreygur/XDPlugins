"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function readHtml() {
    return new Promise(async (resolve, reject) => {
        const fs = require("uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestFile = await dataFolder.getEntry("./theme/index.zip");
        if (manifestFile) {
            let styleofmdp = await manifestFile.read();
            resolve(styleofmdp);
        }
        resolve("");
    });
}
exports.readHtml = readHtml;
