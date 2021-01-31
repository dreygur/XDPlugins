
// async function exportImages(sel, rootNode) {
//     let exportImagesFunc = require('./src/functions/exportImages');
//     await exportImagesFunc(sel, rootNode);
// }

// async function exportTheme(sel, rootNode) {
//     let exportThemeFunc = require('./src/functions/exportTheme');
//     await exportThemeFunc(sel, rootNode);
// }

// async function exportApplicationIcons(sel, rootNode) {
//     let exportApplicationIconsFunc = require('./src/functions/exportApplicationIcons');
//     await exportApplicationIconsFunc(sel, rootNode);
// }

const exportImages = async (sel, rootNode) => {
    const exportImagesFunc = require('./src/functions/exportImages');
    await exportImagesFunc(sel, rootNode);
}

const exportTheme = async (sel, rootNode) => {
    const exportThemeFunc = require('./src/functions/exportTheme');
    await exportThemeFunc(sel, rootNode);
}

const exportAppIcons = async (sel, rootNode) => {
    const exportAppIconsFunc = require('./src/functions/exportAppIcons');
    await exportAppIconsFunc(sel, rootNode);
}

module.exports = {
    commands: {
        exportImages,
        exportTheme,
        exportAppIcons
    }
};
