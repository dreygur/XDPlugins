/*
 * Automatically insert page numbers 
 *
 */

const { Artboard, Rectangle, Ellipse, Text, Color } = require("scenegraph");
const { alert } = require("./lib/dialogs.js");

function defineDialogue() {
	let dialog = document.createElement("dialog");
	let application = require("application");

	// Set page caption
	let pageNumberCaption = "Page";
	if (application.systemLocale === "de_DE") {
		pageNumberCaption = "Seite";
	}

	// Set font size
	let pageNumberFontSize = 20;

	dialog.innerHTML = `
	<style>
		form {
			width: 360px;
		}
		.h1 {
			align-items: center;
			justify-content: space-between;
			display: flex;
			flex-direction: row;
		}
		.icon {
			border-radius: 4px;
			width: 24px;
			height: 24px;
			overflow: hidden;
		}
		.row { 
			align-items: center; 
		}
	</style>
	<form method="dialog">
		<h1 class="h1">
			<span>Insert Page Numbers</span>
			<img class="icon" src="./assets/icon.png" />
		</h1>
		<hr />
		<p>You can change the default settings such as the caption and it's font-size before inserting the page numbers.</p>
		<label>
			<span>Caption</span>
			<input type="text" placeholder="e.g., Page" value="${pageNumberCaption}" id="pageCaption"/>
		</label>
		<label>
			<span>Font Size</span>
			<input type="number" value="${pageNumberFontSize}" id="fontSize"/>
		</label>
		<label class="row">
			<input type="checkbox" id="onFirstPage"/>
			<span>Print Number on First Page</span>
		</label>
		<footer>
			<button uxp-variant="primary" id="cancel">Cancel</button>
			<button type="submit" uxp-variant="cta" uxp-selected="true">Insert Numbers</button>
		</footer>
	</form>
	`;

	// Append to body
	document.body.appendChild(dialog);

	// Register cancel callback
	const cancelButton = document.querySelector("#cancel");
	cancelButton.addEventListener("click", () => dialog.close("reasonCanceled"));

	return dialog;
}

async function insertPageNoCommand(selection, root) {

	// Check if there are any artboards in the present document	
	if (root.children.filter(node => node instanceof Artboard).length === 0) {
		await alert("Insert Page Numbers",
		"There are no artboards present in your current document. Please insert at least one, so this plugin can work correctly.");
		return;
	}

	// Dialogue definition
	let settingsDialogue = defineDialogue();

	// Register additional callbacks
	const onFirstPageCheckbox = document.querySelector("#onFirstPage");
	let onFirstPage = false;
	onFirstPageCheckbox.addEventListener("change", () => onFirstPage = onFirstPageCheckbox.checked);

	// Show dialogue
	let dialogueResult = await settingsDialogue.showModal();

	// Check if dialogue was cancelled 
	if (dialogueResult === "reasonCanceled") return;

	// Get dialogue values
	const fontSize = Number(document.querySelector("#fontSize").value);
	let numberCaption = document.querySelector("#pageCaption").value;

	// Add a space after the caption if there is one
	if (numberCaption.trim().length > 0) {
		numberCaption += " ";
	}

	// Get artboards
	let sortedList = root.children.filter(node => node instanceof Artboard);
	
	// Sort list
	sortedList = sortedList.sort((a, b) => {

		if (a.translation.y < b.translation.y) {
			return -1;
			
		} else if (a.translation.y > b.translation.y) {
			return 1
			
		} else if (a.translation.y === b.translation.y) {
			
			if (a.translation.x < b.translation.x) {
				return -1;
				
			} else {
				return 1;
			}
			
		}
	});
    
	// Loop through sorted list
    sortedList.forEach((node, index) => {
		if (node instanceof Artboard) {

			// Make sure we only print the page number on the first page, if we're allowed to
			if (index === 0 && onFirstPage || index > 0) {
				let artboard = node;
			
				const textNode = new Text();
				textNode.textAlign = "right";
				textNode.text = numberCaption + (index + 1).toString();
				textNode.fontSize = fontSize;
				textNode.fill = new Color("black");
				artboard.addChild(textNode);
				textNode.moveInParentCoordinates(artboard.globalBounds.width - 30, artboard.globalBounds.height - 30);
			}

		}
	})
}

module.exports = {
    commands: {
        insertPageNoCommand: insertPageNoCommand
    }
};
