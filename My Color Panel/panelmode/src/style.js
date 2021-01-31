"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function datareader() {
    return new Promise(async (resolve, reject) => {
        const fs = require("uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestFile = await dataFolder.getEntry("./theme/panel-style.zip");
        if (manifestFile) {
            let styleofmdp = await manifestFile.read();
            resolve(styleofmdp);
        }
        resolve("");
    });
}
exports.datareader = datareader;
