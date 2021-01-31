const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const { exportWindowContent } = require("./pages/exportWindow.js");
const { errorPopupContent } = require("./pages/errorPopup.js");
const { createOrOverrideFile, clamp } = require("./lib/myTools.js");

var exportedOnceAlready = false;
var settingsRetrived = false;
var currentExportFolder = null;
var exportSettings = {
    createSubdirectories: true,
    type: "PNG",
    scale: 3,
    exportMode: "selection"
}

function isExportFolderValid() {
    return currentExportFolder && `${currentExportFolder.nativePath}` !== "undefined";
}

async function getRenditionSettingsForNode(node) {
    const format = exportSettings.type || "PNG";
    const file = await createOrOverrideFile(currentExportFolder, node.name, exportSettings.createSubdirectories, format)
    return {
        node: node,
        outputFile: file,
        quality: 75,
        type: application.RenditionType[format],
        scale: parseInt(exportSettings.scale),
    };
}

async function addToRenditionSettings(node, renditionSettings) {

    try {
        const rs = await getRenditionSettingsForNode(node);
        renditionSettings.push(rs);
    }
    catch (e) {
        console.log(e);
    }
}

async function exportMarkedRecursive(node, renditionSettings) {

    if (node.children && node.children.length > 0)
    {
        for (var i = 0; i < node.children.length; i++)
        {
            await exportMarkedRecursive(node.children.at(i), renditionSettings);
        }
    }

    if (!node.markedForExport)
        return;

    await addToRenditionSettings(node, renditionSettings);
}

async function exportMarkedFromSelection(selection, renditionSettings) {

    if (selection.items.length == 0)
        return console.log("No selection.");

    for (const node of selection.items)
    {
        await exportMarkedRecursive(node, renditionSettings);
    }
}

async function exportSelection(selection, renditionSettings) {

    if (selection.items.length == 0)
        return console.log("No selection.");

    for (const node of selection.items)
    {
        await addToRenditionSettings(node, renditionSettings);
    }
}

async function exportHandler(selection, root)
{
    if (!isExportFolderValid())
        currentExportFolder = await fs.getFolder();
    if (!isExportFolderValid())
        return;

    const renditionSettings = [];

    console.log(`Exporting with mode: ${exportSettings.exportMode}.`);

    switch (exportSettings.exportMode) {
        case "selection":
            await exportSelection(selection, renditionSettings);
            break;
        case "markedFromSelection":
            await exportMarkedFromSelection(selection, renditionSettings);
            break;
        case "markedFromRoot":
            await exportMarkedRecursive(root, renditionSettings);
            break;
    }

    if (renditionSettings && renditionSettings.length > 0)
    {
        application.createRenditions(renditionSettings)
        .catch((error) => {
            console.log(error)
        })
    }
    else
    {
        await showErrorMessage("Nothing to export!", "Please select an item or mark items for export.");
    }
}

async function exportWithLastSettingsHandler(selection, root) {

    if (!exportedOnceAlready || !settingsRetrived)
        showPopupHandler(selection, root);
    else
        await exportHandler(selection, root);
}

function exportFolderChanged(changeExportPath) {

    if (isExportFolderValid())
        changeExportPath.innerHTML = `${currentExportFolder.nativePath}`;
}

async function showErrorMessage(title, message) {

    const dialog = document.createElement("dialog");
    dialog.innerHTML = errorPopupContent(title, message);

    const   [form, cancel] =
            ["form", "#cancel"]
            .map(s => dialog.querySelector(s));

    form.addEventListener('submit', () => {
        dialog.close();
    });

    cancel.addEventListener('click', () => {
        dialog.close('reasonCanceled');
    });

    document.appendChild(dialog)
    return await dialog.showModal();
}

async function showPopupHandler(selection, root) {

    if (root.pluginData && !settingsRetrived)
    {
        settingsRetrived = true;
        exportSettings = root.pluginData;
    }

    const dialog = document.createElement("dialog")

    dialog.innerHTML = exportWindowContent;
    const   [form, cancel, exp, changeExportPath, createSubDirectoriesCheckbox, scaleInput, modeSelection, typeSelection] =
            [`form`, "#cancel", "#export", "#changeExportPath", "#createSubDirectories", "#scaleInput", "#modeSelection", "#typeSelection"]
            .map(s => dialog.querySelector(s));
    
    var exportRequested = false;

    createSubDirectoriesCheckbox.checked = exportSettings.createSubdirectories;
    createSubDirectoriesCheckbox.addEventListener('change', () => {
        exportSettings.createSubdirectories = createSubDirectoriesCheckbox.checked;
    });

    scaleInput.value = exportSettings.scale;
    scaleInput.addEventListener('input', () => {
        exportSettings.scale = clamp(scaleInput.value, 1, 10);
        scaleInput.value = exportSettings.scale;
    })

    exportFolderChanged(changeExportPath);
    changeExportPath.addEventListener('click', async () => {
        currentExportFolder = await fs.getFolder();
        exportFolderChanged(changeExportPath);
    });

    modeSelection.value = exportSettings.exportMode;
    modeSelection.addEventListener('change', () => {
        exportSettings.exportMode = modeSelection.value;
    });

    typeSelection.value = exportSettings.type || "PNG";
    typeSelection.addEventListener('change', () => {
        exportSettings.type = typeSelection.value;
    });

    exp.addEventListener('click', () => {
        exportRequested = true;
        dialog.close('export');
    });

    cancel.addEventListener('click', () => {
        dialog.close('reasonCanceled');
    });

    form.addEventListener('submit', () => {
        exportRequested = true;
        dialog.close('export');
    });

    document.appendChild(dialog)
    const res = await dialog.showModal();

    if (exportRequested)
    {
        await exportHandler(selection, root);
        exportedOnceAlready = true;
        root.pluginData = exportSettings;
    }
}

module.exports = {
  commands: {
    exportSelection: showPopupHandler,
    exportWithLastSettings: exportWithLastSettingsHandler
  }
};
