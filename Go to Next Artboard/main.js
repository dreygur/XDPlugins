/*
 * Adobe XD Plugin to visually move back and forth through the artboard stack, zooming each to fill screen
 */

const Artboard = require("scenegraph").Artboard;
const viewport = require("viewport");
const commands = require("commands");
const { alert, error } = require("./lib/dialogs.js");
var currentArtboard, currentIndex, targetBoard, allArtboards;
var cachedArtboard = [];

async function showAlert(targ) {
    /* we'll display a dialog here */
    await alert('No Artboards Found...', '"Go to '+targ+' artboard," you say?  \n\nThere are no artboards here.  \n\nThank you for your attempt, though. Please do this again when you have artboards.');
}

function init(selection,root) {
    allArtboards = root.children.filter(node=>{
        if (node instanceof Artboard) {
            return node;
        }
    });

    // Start from selected artboard, if available:
    let selectedArtboard = selection.focusedArtboard;
    if (selectedArtboard && cachedArtboard && cachedArtboard.toString() != selection.focusedArtboard.toString() ) {
        currentArtboard = selectedArtboard;
    }

    // Allow currentArtboard to fall back to the first artboard in project if still undefined:
    currentArtboard = currentArtboard || allArtboards[0];

    // store current selection so we don't use it to refocus Artboard if user is going through several boards.
    cachedArtboard = selection.focusedArtboard;

    // update currentArtboard and currentIndex to last set
    allArtboards.forEach((node,idx)=>{
        if (currentArtboard == node) {
            currentIndex = idx;
        }

    });
}

function prevArtboard(selection,root) {
    init(selection,root);

    // end early when no artboards found
    if (!allArtboards.length) {
        showAlert('next');
        return;
    }

    if (currentIndex + 1 >= allArtboards.length) {
        targetBoard = allArtboards[0];
    }
    else {
        targetBoard = allArtboards[currentIndex + 1];
    }

    viewport.zoomToRect(targetBoard);
    currentArtboard = targetBoard;
}

function nextArtboard(selection,root) {
    init(selection,root);

    // end early when no artboards found
    if (!allArtboards.length) {
        showAlert('previous');
        return;
    }

    if (currentIndex - 1 < 0) {
        targetBoard = allArtboards[allArtboards.length - 1];
    }
    else {
        targetBoard = allArtboards[currentIndex - 1];
    }

    viewport.zoomToRect(targetBoard);
    currentArtboard = targetBoard;
}

module.exports = {
    commands: {
        nextArtboard,
        prevArtboard
    }
};
