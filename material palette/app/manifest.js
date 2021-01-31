"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getManifest() {
    if (!exports.manifest) {
        const fs = require("uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestFile = await dataFolder.getEntry("manifest.json");
        if (manifestFile) {
            const json = await manifestFile.read();
            exports.manifest = JSON.parse(json);
        }
    }
    return exports.manifest;
}
exports.getManifest = getManifest;
async function fixManifest() {
    try {
        exports.manifest = await getManifest();
    }
    catch (err) {
    }
}
exports.fixManifest = fixManifest;
function getNearestIcon(manifest, size) {
    if (!manifest) {
        return;
    }
    if (manifest.icons) {
        const sortedIcons = manifest.icons.sort((a, b) => {
            const iconAWidth = a.width;
            const iconBWidth = b.width;
            return iconAWidth < iconBWidth ? 1 : iconAWidth > iconBWidth ? -1 : 0;
        });
        const icon = sortedIcons.reduce((last, cur) => {
            if (!last) {
                last = cur;
            }
            else {
                if (cur.width >= size) {
                    last = cur;
                }
            }
            return last;
        });
        return icon.path;
    }
}
exports.getNearestIcon = getNearestIcon;
