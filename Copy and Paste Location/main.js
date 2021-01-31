const { alert, error } = require("./lib/dialogs.js");

var pos_x;
var pos_y;
var node;
var bounds;

function copy(selection) { 
	if (selection.items.length == 0) {
		showAlertCopy()
	} else {
	bounds = selection.items[0].topLeftInParent;
	pos_x = bounds.x;
	pos_y = bounds.y;
	console.log(pos_y + " , " + pos_x);
	}
}

function paste(selection) {	
	if (pos_x == undefined) {
		showAlertPaste()
	} else if (selection.items.length == 0) {
		showAlertNoSelection()
	} else {
		let parentCenter = {x: pos_x, y: pos_y}; 
		let nodeTopLeft = {x: 0, y: 0};  
		var i;
		for (i = 0; i < selection.items.length; i++) {
		  selection.items[i].placeInParentCoordinates(nodeTopLeft, parentCenter);
		}	
	}
}

async function showAlertCopy() {
    await alert("No object selected", 
    "Select an object first before copying its location."); 
}

async function showAlertPaste() {
    await alert("No saved location", 
    "First select an object and copy its location (Cmd+Shift+Alt+O) before pasting it to another object.");
}

async function showAlertNoSelection() {
    await alert("No objects selected", 
    "Select an object first to overwrite its location. (Currently saved location: X: " + pos_x + ", Y:" + pos_y + ")");
}

module.exports = {
    commands: {
		copy: copy,
		paste: paste,
		showAlertCopy,
		showAlertPaste,
		showAlertNoSelection
    }
};
