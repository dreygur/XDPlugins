const { prompt } = require("./lib/dialogs.js");
const fs = require("uxp").storage.localFileSystem;

// Set the default preferences
let prefs = {
    largeNudge: 8
}

// Read preferences
readPrefs();

// Small Resize
function shrinkWidth(selection) {
    objectResize(selection.items, 'width', -1);
}
function extendWidth(selection) {
    objectResize(selection.items, 'width', 1);
}
function shrinkHeight(selection) {
    objectResize(selection.items, 'height', -1);
}
function extendHeight(selection) {
    objectResize(selection.items, 'height', 1);
}

// Large Resize
function largeShrinkWidth(selection) {
    objectResize(selection.items, 'width', -prefs.largeNudge);
}
function largeExtendWidth(selection) {
    objectResize(selection.items, 'width', +prefs.largeNudge);
}
function largeShrinkHeight(selection) {
    objectResize(selection.items, 'height', -prefs.largeNudge);
}
function largeExtendHeight(selection) {
    objectResize(selection.items, 'height', +prefs.largeNudge);
}

//  Nudging
function largeNudgeUp(selection) {
    selection.items.forEach(function (obj) {
        obj.moveInParentCoordinates(0, -prefs.largeNudge);
    });
}
function largeNudgeRight(selection) {
    selection.items.forEach(function (obj) {
        obj.moveInParentCoordinates(+prefs.largeNudge, 0);
    });
}
function largeNudgeDown(selection) {
    selection.items.forEach(function (obj) {
        obj.moveInParentCoordinates(0, +prefs.largeNudge);
    });
}
function largeNudgeLeft(selection) {
    selection.items.forEach(function (obj) {
        obj.moveInParentCoordinates(-prefs.largeNudge, 0);
    });
}

// Resize Function
function objectResize(selection, command, shift) {
    if (0 === selection.length) {
        console.error('No element selected.')
        return false;
    }

    if('width' === command) {
        selection.forEach(function (obj) {
            const bounds = obj.boundsInParent;
            obj.resize(bounds.width + shift, bounds.height);
        });
    }

    if('height' === command) {
        selection.forEach(function (obj) {
            const bounds = obj.boundsInParent;
            obj.resize(bounds.width, bounds.height + shift);
        });
    }
}

// Safe user preferences
async function savePrefs() {
    
    // Get the plugin data folder
    const settingsFolder = await fs.getDataFolder();

    try {

        // Create or replace the settings.json file
        const settingsFile = await settingsFolder.createFile("settings.json", {overwrite: true});
        await settingsFile.write(JSON.stringify(prefs));

    } catch(err) {

        // Log the error
        console.error(err);
    }
}

// Read user preferences
async function readPrefs() {

    // Get the plugin data folder
    const settingsFolder = await fs.getDataFolder();

    try {

        // Get the settings.json file
        const settingsFile = await settingsFolder.getEntry("settings.json");

        // Read the contents of the settings.json file
        prefs = JSON.parse(await settingsFile.read());

    } catch(err) {
        // Error can ocurr if file doesn't exist yet
        // Log the error
        console.error(err);

        // Save user preferences to settings.json
        savePrefs();
    }
}

// Settings Dialog
async function showNudgeSettingsDialog() {

    // Contruct the prompt
    const feedback = await prompt(
        "Set a nudge value", //[title]
        "Set the value in pixels that you want the large nudge and large resize to use.", //[msg]
        prefs.largeNudge,  //[prompt]
        ['Cancel', 'Save']);

    // Detect user action
    switch (feedback.which) {
        case 0:
            // User canceled
            break;
        case 1:
            // User confirmed
            // Get the value the user submitted
            prefs.largeNudge = feedback.value;

            // Save user preferences to settings.json
            savePrefs();
            break;
    }
}

module.exports = {
    commands: {
        "ShrinkWidth": shrinkWidth,
        "ExtendWidth": extendWidth,
        "ShrinkHeight": shrinkHeight,
        "ExtendHeight": extendHeight,
        "LargeShrinkWidth": largeShrinkWidth,
        "LargeExtendWidth": largeExtendWidth,
        "LargeShrinkHeight": largeShrinkHeight,
        "LargeExtendHeight": largeExtendHeight,
        "LargeNudgeUp": largeNudgeUp,
        "LargeNudgeRight": largeNudgeRight,
        "LargeNudgeDown": largeNudgeDown,
        "LargeNudgeLeft": largeNudgeLeft,
        "ShowNudgeSettingsDialog": showNudgeSettingsDialog,
    }
};
