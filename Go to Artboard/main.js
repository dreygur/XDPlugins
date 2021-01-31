const viewport = require("viewport");
const { alert, error } = require("./lib/dialogs.js");

function goToSelectionArtboard(selection, documentRoot) {
	if (selection.focusedArtboard === null) {
		alert("No Artboard Found",
			"Please ensure that you have selected a layer that is inside an artboard.");
		return;
	}
	viewport.zoomToRect(selection.focusedArtboard);
}
module.exports = {
    commands: {
        goToSelectionArtboard: goToSelectionArtboard
    }
};
