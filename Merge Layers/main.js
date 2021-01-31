///////////////////////////////////////////////////////////////////////////
// Merge Layers
// Version 1.0.0
///////////////////////////////////////////////////////////////////////////

/**
 * Converts multiple layers into a single layer
 **/

const {Artboard, BooleanGroup, Blur, Matrix, Color, ImageFill, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, SymbolInstance, Text, Polygon} = require("scenegraph");
const scenegraph = require("scenegraph");
const {Form, MainForm, SupportForm, ElementForm, SettingsForm, AlertForm, GlobalModel, HTMLConstants, Styles } = require("./library.js");
const {log, getTime, moveTo, getZeroPoint, getBase64FromSceneNode, getArrayBufferFromSceneNode, getIsArtboard, getAllArtboards, sleep, getTempImageFromSceneNode, getIsGraphicNode, getIsGraphicNodeWithImageFill, isInEditContext, isDescendantNode, getIsPasteboardItem, isPortrait, isLandscape, isSiblingNode, isChildNode, getChildNodes, object, trim, getPx, getArtboard, addString, addStrings, getShortNumber, getShortString, getClassName, getFunctionName, getStackTrace, logStackTrace, getBoundsInParent, getChangedProperties, deleteProperties, DebugSettings, indentMultiline, isDesignMode} = require("./log");
const h = require("./h");
const shell = require("uxp").shell;
const platform = require("os").platform();
const clipboard = require("clipboard");
const interactions = require("interactions");
const application = require("application");
const fileSystem = require("uxp").storage.localFileSystem;
const UXPFile = require('uxp').storage.File;
const applicationVersion = parseFloat(application.version);
const editDocument = require("application").editDocument;
const UPNG = require("./UPNG").UPNG;
const commands = require("commands");


DebugSettings.logFunctionName = true;

///////////////////////////////////////////////////////////////////////////
// DIALOGs and PANELs
///////////////////////////////////////////////////////////////////////////

var elementForm = new ElementForm();
var alertForm = new AlertForm();
var supportForm = new SupportForm();
var form = new Form();
var elementDialog = null;
var lastMergedLayerFile = null;
var lastGroup = null;
var originalSelectedItem = null;
var groupLayer = false;
var originalSelectedItemOpacity = 1;
var hideByOpacity = true;
var originalItemIndex = 0;
var autoExport = false;
var imageData = null;
var cancelRunningProcess = false;
var lastSelectedPreset = null;

let alertDialog =
	 h("dialog", {name:"Alert"},
		h("form", { method:"dialog", style: { width: getPx(380) }, },
		  alertForm.header = h("h2", "Header"),
		  h("label", { class: "row", style: {marginTop: getPx(12)} },
			 alertForm.message = h("span", { }, "Message"),
		  ),
		  h("footer",
			 h("button", { uxpVariant: "cta", type: "submit", onclick(e) { closeDialog(alertDialog) } }, "OK")
		  )
		)
	 )

let helpDialog =
	h("dialog", {name:"Alert"},
		h("form", { method:"dialog", style: { width: getPx(380) } },
			
			h("label", { class: "row", style: { alignItems: "bottom" } },
				h("h2", "Community Support"),
				h("span", { style: { flex:"1" } }, ""),
				supportForm.versionLabel = h("span", { style: { } }, "Version")
			),
			h("label", { class: "row", style: { marginTop: getPx(24), marginLeft: getPx(8) } },
				h("a", { href:"https://discuss.velara3.com", title: "https://discuss.velara3.com", 
					style: {flex:"1", backgroundColor:"transparent", fontSize: getPx(12), fontWeight:"normal", color:"#686868" } }, 
					"Get support at the forums at https://discuss.velara3.com")
			),
			h("footer",
				h("span", { style: { flex:"1" } }, ""),
				h("button", { uxpVariant: "primary", title: "Copy the forum URL to the clipboard", 
					onclick(e){ copyForumURLtoClipboard(true) } }, "Copy URL"),
				h("button", { uxpVariant: "cta", type: "submit", onclick(e) { closeDialog(helpDialog) } }, "OK")
			)
		)
	)

	var getList = function (list, id, uxpLabel, title, handler, ...options) {

		var value = h("div", { style: { 
			display: Styles.INLINE_BLOCK, 
			position: Styles.RELATIVE, 
			width: getPx(14), height: getPx(12), 
			opacity: 1,
			border: "0px solid blue"} },
	
			elementForm[list] = h(HTMLConstants.SELECT, { 
				id: id, 
				uxpEditLabel: uxpLabel, 
				uxpQuiet: false, 
				title: title, 
				style: { 
					display: Styles.INLINE_BLOCK, 
					position:Styles.ABSOLUTE, 
					width: "120%", height: "120%", 
					cursor: "pointer", 
					overflow: Styles.HIDDEN,
					paddingTop: getPx(0), 
					backgroundColor: "green", 
					border:form.borderWeight + "1px solid blue", 
					opacity: .01, 
					top: "50%", left: "50%", transform: "translate(-90%, -90%)"},
				onchange(e) { handler(e) } }, ...options),
	
				h("img", { 
					src: form.dropdownChevron, 
					title: "", 
					style: {
						height: "100%", width: "100%", 
						display: Styles.INLINE_BLOCK, 
						position:"absolute", 
						border:"0px solid green", 
						pointerEvents: "none"
				}}));
	
		return value;
	}

	var isPanel = false;
	var dialogWidthNoPx = isPanel ? elementForm.elementPanelWidth : elementForm.elementDialogWidth + "px";
	var formWidthNoPx = isPanel ? elementForm.elementPanelWidth : elementForm.elementDialogWidth-68 + "px";
	var labelWidth = isPanel ? elementForm.panelLabelWidth : elementForm.labelWidth;

	var spacerWidth = isPanel ? elementForm.panelCheckboxesSpacerWidth : elementForm.elementCheckboxesSpacerWidth;
	var margin = isPanel ? 0 : 0;
	var displayed = isPanel ? "none" : "flex";
	var formName = isPanel ? "Element Panel" : "Element options";

	var dialogPadding = isPanel ? form.elementPanelPadding : form.dialogPadding;

	var elementType = isPanel ? "form" : "form";
	var showLabelsInPanel = true;

var elementDialog = h("dialog", {name:"Element", style: { padding: getPx(dialogPadding), margin: getPx(0), display: "block", width: dialogWidthNoPx },
		async onsubmit(e) { await formSubmit(e) }  },
		elementForm.mainForm = h(elementType, { id:"formUpdate", name: formName, method: "dialog",
			style: { fontSize: getPx(form.formFontSize), width: formWidthNoPx, minWidth: getPx(100), 
				overflowX: "hidden", overflowY:"auto", padding: getPx(0), margin: getPx(margin) },
				async onsubmit(e) { await formSubmit(e) }  },
		elementForm.mainFormFieldset = h("fieldset", 
		  h("div", { class: elementForm.flexDirection, style: { alignItems: "center", height: getPx(26) } },
			 h("h2", { style: { paddingLeft: getPx(0), marginLeft: getPx(0), textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" },
			 onclick(e) {  } },
			 "Merge Layers"),
			 h("span", { style: { flex: "1", marginTop: getPx(0) } }, ""),
			 elementForm.elementIcon = h("img", { height: getPx(10), 
				style: { marginTop: getPx(0) },
				onclick(e) {  } }, ""),
			 elementForm.nameLabel = h("span", { 
				 style: { marginTop: getPx(0), marginLeft: getPx(6), marginRight: getPx(0), 
					minWidth: getPx(0), color: "#A8A8A8", marginBottom: getPx(0), fontSize: getPx(10),
					fontWeight: "normal", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"},
				onclick(e) {  } }, "")

		  ),

		  h("hr", { style: { display: displayed, height: getPx(1), paddingLeft: getPx(6), marginLeft: getPx(0) } }, ""),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			h("span", { style: { display: Styles.NONE, width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 	"Presets"),

				 elementForm.completeIcon = h("img", { src: form.completeIconPath, height: getPx(form.iconWidth), 
						title: "Conversion complete", 
						style: { marginLeft: getPx(12), marginRight: getPx(12), cursor: "pointer", opacity: 1, display: "none"} }, ""),
	
			elementForm.presetsList = h(HTMLConstants.SELECT, {
				id:"optionsList", uxpEditLabel:"", uxpQuiet: true, 
				title: "Preconfigured Format", 
				style: { display: Styles.NONE, paddingTop: getPx(0), border:form.borderWeight + "px solid blue", opacity: .75,
				minWidth: getPx(0), cursor: form.cursor},
				
				async onchange(e) { await optionsListChange(e) } },
					h(HTMLConstants.OPTION, { selected: true, value: "default" }, "Default"),
					h(HTMLConstants.OPTION, { value: "grayscale" }, "Grayscale")
			),

			h("span", { style: { flex: ".25" } }, ""),

			elementForm.additionalStylesInput = h("input", { id:"messagesTextarea", uxpEditLabel:"Edit value", 
				placeholder: "Input for form enter key to work", 
				style: { width: getPx(10), opacity: 0}, 
				onkeydown(e) {  } } ),

			elementForm.messageLabel = h("span", { style: { textAlign:"center", width: getPx(labelWidth), flex: "1" } }, ""),
			
			h("span", { style: { flex: ".25" } }, ""),
			
			elementForm.cancelMergeButton = h("a", { id:"cancelMergeButton", uxpEditLabel:"Edit value", uxpVariant: "primary", 
				style: {cursor: "pointer", marginRight: getPx(8), display: "none" },
				onclick(e) { cancelConversion(e) } }, "Cancel"),

			elementForm.mergeButton = h("div", { id:"mergeButton", uxpEditLabel:"Edit value", uxpVariant: "primary", 
				style: {cursor: "pointer" },
				async onclick(e) { await merge(e) } }, "Merge"),

		  ),
		  
		  h("hr", { style: { display: displayed, height: getPx(1), paddingLeft: getPx(6), marginLeft: getPx(0) } }, ""),

		  /**  ELEMENT OPTIONS FOOTER  ***********************/
		  h("footer", { class: elementForm.flexDirection, style: { display: displayed, height: getPx(18) },  },
		  	 elementForm.helpButton = h("a", { style: form.footerButtonStyle, title: "Open the help documentation", 
				onclick(e) { openDocumentation() } }, "Support"),

			 elementForm.pathLabel = h("span", { 
				style: { color: "#A8A8A8" },
			  onclick(e) {  } }, ""),

			h("span", { style: { flex: 1 } }, ""),

			 elementForm.cancelButton = h("div", { id:"cancelButton", uxpEditLabel:"Cancel Form", uxpVariant: "primary", 
				style: {cursor: "pointer", marginRight: getPx(8) },
			 	onclick(e) { cancelElementForm(e) } }, "Cancel"),
			 elementForm.closeButton = h("div", { id:"submitButton", uxpEditLabel:"Commit Form", uxpVariant: "primary", 
			 	style: {cursor: "pointer" },
			 	onclick(e) { closeWindow(e); } }, "Close")
		  )
		  
		)
		)
	);

DebugSettings.outlineOnClick(elementDialog);
elementForm.mainDialog = elementDialog;

/////////////////////////////////////////////
/// MAIN 
/////////////////////////////////////////////

var globalModel = new GlobalModel();

/**
 * Open dialog for support
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 */
async function openSupportDialog(selection, documentRoot) {

	let alertDialog = await showHelpDialogWindow();

	return alertDialog;
}

async function showHelpDialogWindow() {

	if (globalModel.applicationDescriptor==null) {
		await getApplicationDescriptor();
	}

	supportForm.versionLabel.innerHTML = globalModel.applicationDescriptor.version;

	document.body.appendChild(helpDialog);
	
	let dialog = helpDialog.showModal();

	return dialog;
}

/**
* Get application descriptor
**/
async function getApplicationDescriptor() {
	var filePath = "";
	var filename = "manifest.json";
 
	try {
	  const pluginFolder = await fileSystem.getPluginFolder();
	  const folder = await pluginFolder.getEntry(filePath);
	  var value;
	  var entry;
 
	  if (folder.isFolder) {
		 entry = await folder.getEntry(filename);
		 value = await entry.read();
 
		 var object = JSON.parse(value);
		 globalModel.applicationDescriptor = object;
		 globalModel.version = globalModel.applicationDescriptor.version;
	  }
	  
	}
	catch (error) {
	  log("Stack:" + error.stack);
	}
}
/**
 * Open the dialog
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 **/
async function showDialog(selection, documentRoot) {
	var alert;

	try {
		if (selection.items.length==0) {
			let alert = await showAlertDialog("Select an element or artboard to continue", "Merge Layers");
			return alert;
		}
		else if (selection.items.length>1) {
			let alert = await showAlertDialog("Group multiple items before merging", "Merge Layers");
			return alert;
		}
		else {
			originalSelectedItem = selection.items[0];
			originalItemIndex = getItemIndex(originalSelectedItem);
		}

		var dialog = null;
		
		// code after this line will not be run until window is closed
		dialog = await showElementDialogWindow();
		
	}
	catch(error) {
		log(error);
	}
	

	return dialog
}

/**
 * Show dialog window
 **/
async function showElementDialogWindow() {
	
	try {
		document.body.appendChild(elementForm.mainDialog);
	}
	catch(error) {
		log(error)
	}

	var styleTag = document.createElement("style");
	styleTag.innerHTML = `a:hover { text-decoration: underline }`;
	elementForm.mainForm.insertAdjacentElement('beforeend', styleTag);

	DebugSettings.outlineOnClick(elementForm.mainForm);

	// if not using await code after this line is run
	let dialog = elementForm.mainDialog.showModal();

	// REINITIALIZE SET DEFAULTS
	if (lastSelectedPreset) {
		elementForm.presetsList.value = lastSelectedPreset;
	}

	lastGroup = null;
	lastMergedLayerFile = null;
	cancelRunningProcess = false;

	setName(getShortString(originalSelectedItem.name, 200))

	const filesystem = require("uxp").storage;
	const folder = await filesystem.localFileSystem.getPluginFolder();
	var designMode = await isDesignMode();

	return dialog;
}

async function cancelElementForm(event) {
	const {selection} = require("scenegraph");

	try {
		removeGroup();
		clearImageData();
		showImage();
		clearInfo();
		selectOriginalItem();
 
		closeDialog(elementForm.mainDialog);
	}
	catch (error) {
		log(error.stack);
	}

}

function cancelConversion(event) {
  
	try {
		cancelRunningProcess = true;
	}
	catch (error) {
		log(error.stack);
	}

}

async function closeWindow(event) {
	const {selection} = require("scenegraph");
	const { editDocument } = require("application");

	//event.preventDefault();

	try {
		await cancelConversion();
		await sleep(100);

		if (lastGroup!=null) {

			if (getIsArtboard(originalSelectedItem)==false) {
				originalSelectedItem.removeFromParent();
			}

			selection.items = [lastGroup];
			autoExport = true;
		}
		else {
			selectOriginalItem();
			showImage();
		}

		clearImageData();
		clearInfo();
		
		closeDialog(elementForm.mainDialog);
	}
	catch (error) {
		log(error.stack);
	}
}

function clearImageData() {
	imageData = null;
}

/**
 * Cancel conversion and restore image. May not need await
 */
async function cancelConvertProcess() {
	const {selection} = require("scenegraph");
	await removeGroup();
	await showImage();
	await showExportButtons();
	showExportingLabel("")
	selectOriginalItem();
}

async function removeGroup() {
	
	if (lastGroup!=null) {
		lastGroup.removeFromParent();
		lastGroup = null;
		autoExport = false;
	}
}

function hideImage() {
	if (getIsArtboard(originalSelectedItem)==false) {

		// we do this so if the object is sizing a group the layout remains the same
		if (hideByOpacity) {
			originalSelectedItemOpacity = originalSelectedItem.opacity;
			originalSelectedItem.opacity = 0;
		}
		else {
			originalSelectedItem.visible = false;
		}
	}
}

function showImage() {
	
	if (getIsArtboard(originalSelectedItem)==false) {
		if (hideByOpacity) {
			originalSelectedItem.opacity = originalSelectedItemOpacity || 1;
		}
		else {
			originalSelectedItem.visible = true;
		}
	}
}

function selectOriginalItem() {
	const {selection} = require("scenegraph");

	try {
		selection.items = [originalSelectedItem];
	}
	catch(error) {
		log(error)
	}

	return originalSelectedItem;
}

function clearInfo() {
	elementForm.pathLabel.innerHTML = "";
}

function setName(value) {
	elementForm.nameLabel.innerHTML = value;
}

function showExportButtons() {
	elementForm.mergeButton.style.display = "block";
	elementForm.cancelMergeButton.style.display = "none";
	elementForm.cancelButton.style.display = Styles.BLOCK;
	elementForm.closeButton.style.display = Styles.BLOCK;
}

function showCancelButtons() {
	elementForm.mergeButton.style.display = "none";
	elementForm.cancelMergeButton.style.display = "block";
	elementForm.cancelButton.style.display = Styles.NONE;
	elementForm.closeButton.style.display = Styles.NONE;
}

function getItemIndex(item) {
	var items = item.parent.children;
	var numberOfItems = items.length;

	for(var i=0;i<numberOfItems;i++) {
		if (items.at(i)==item) {
			var n = parseInt(numberOfItems) - i;
			return n;
		}
	}
}

async function moveToIndex(item, destinationIndex) {
	const {selection} = require("scenegraph");
	var itemIndex = getItemIndex(item);
	var prevSelection = selection.items;
	var difference = itemIndex-destinationIndex;

	selection.items = [item];
	
	for (let index = 0; index<destinationIndex; index++) {
		commands.sendBackward();
	}

	selection.items = prevSelection;
}

async function showAlertDialog(message, header) {

  document.body.appendChild(alertDialog);
  
  // if using await then code is halted
  //var dialog = await alertDialog.showModal();

  // if not using await then the form is filled out
  let dialog = alertDialog.showModal();
  
  if (header!="" && header!=null) {
	 alertForm.header.textContent = header;
  }
  else {
	 alertForm.header.textContent = "Alert";
  }
  
  alertForm.message.textContent = message;

  return dialog;
}

/**
 * Convert without showing a dialog. 
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 **/
async function quickConvert(selection, documentRoot) {

	try {
		log("Converting...")
	}
	catch (error) {
		log(error);
	}

}

async function closeDialog(dialog, wait = false) {
	var result;
	
	if (wait) {
	  result = await dialog.close();
	}
	else {
	  result = dialog.close();
	}

}


function copyForumURLtoClipboard(updateForm = false) {
	var exportMessage = "Copied Forum URL to clipboard";
	
	try {
		clipboard.copyText(GlobalModel.forumURL);
	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Show a message in the main dialog or element dialog
 * @param {String} message message to show
 * @param {Boolean} timeout show for a specific time
 * @param {String} timeoutMessage message to show if any after a timeout
 * @param {Number} duration how long to show message
 **/
function showExportingLabel(message=null, timeout = false, timeoutMessage = null, duration = 0) {
	duration = duration!=0 ? duration : globalModel.quickExportNotificationDuration;

	if (elementForm.messageLabel) {

		if (message==null) {
			elementForm.messageLabel.textContent = "";
		}
		else {
			elementForm.messageLabel.textContent = message;

			if (timeout) {
				
				if (elementForm.panelExportMessageTimeout != null) clearTimeout(elementForm.panelExportMessageTimeout);
				
				elementForm.panelExportMessageTimeout = setTimeout(() => {
					elementForm.messageLabel.textContent = timeoutMessage ? timeoutMessage : "";
					
				}, duration);
			}
		}
	}
}

/**
 * Show a message in the main dialog or element dialog
 * @param {Object} icon icon to show
 * @param {Boolean} timeout show for a specific time
 * @param {Number} duration how long to show message
 **/
function showIcon(icon, timeout = true, duration = 0) {
	duration = duration!=0 ? duration : globalModel.quickExportNotificationDuration;

	icon.style.display = "block";

	if (timeout) {
		
		if (elementForm.iconTimeout != null) clearTimeout(elementForm.iconTimeout);
		
		elementForm.iconTimeout = setTimeout(() => {
			icon.style.display = "none";
		}, duration);
	}
}

/**
 * Options list change
 * @param {*} event 
 **/
async function optionsListChange(event) {
	var item = event.currentTarget.value;
	
	if (item) {
		//elementForm.optionsInput.value = item;
		//event.currentTarget.selectedIndex = null;
		if (autoExport) {
			await merge(event);
		}
		lastSelectedPreset = item;
	}
}


async function formSubmit(event) {
	  event.preventDefault();
	  await merge(event);
}

async function merge(event) {
	const {selection} = require("scenegraph");
	const { editDocument } = require("application");
	var item = null;

	try {
		showCancelButtons();
		showImage();

		// remove last export group
		removeGroup();
		item = selectOriginalItem();

		// if last export completed enable auto export
		if (lastGroup!=null) {
			//autoExport = true;
		}


		var isPanel = false;

		//if (lastMergedLayerFile==null) {
			lastMergedLayerFile = await getMergedLayersFile();
		//}

		clearInfo();

		await showExportingLabel("Converting. Please wait...");
		await sleep(globalModel.runPauseDuration);

		if (isPanel==false) {
			hideImage();
			await addLastMerge();
		}

		if (cancelRunningProcess) {
			cancelRunningProcess = false;
			selection.items = [];
			selection.items = [originalSelectedItem];

			cancelConvertProcess();
			return false;
		}
		else {
			showExportingLabel("", true, null, globalModel.quickExportNotificationDuration);
			showIcon(elementForm.completeIcon)
			showExportButtons();
			autoExport = true;
		}
	}
	catch(error) {
		log(error.stack);
		showExportButtons();
	}
}

async function addLastMerge(event) {
	const {editDocument} = require("application");

	var inPanel = false;

	try {

		if(inPanel) {
			editDocument( async () => {
				await convertToLayer();
			});
		}
		else {
			await convertToLayer();
		}
	}
	catch(error) {
		log(error)
	}
}


async function getMergedLayersFile(event) {
	const {selection} = require("scenegraph");
	const { editDocument } = require("application");

	try {
		var item = originalSelectedItem;
		var tempFile = await getTempImageFromSceneNode(item);
	}
	catch(error) {
		log(error)
	}

	return tempFile;
}

/**
 * Converts the image data into layer 
 */
async function convertToLayer() {
	const {selection} = require("scenegraph");
	const {editDocument} = require("application");

	try {

		var backgroundRectangle;
		var group = null;
		var bounds = getBoundsInParent(originalSelectedItem);
		var isInGroup = getIsInGroup(originalSelectedItem);

		var x = bounds.xInArtboard;
		var y = bounds.yInArtboard;

		// background and sizing for group
		backgroundRectangle = new Rectangle();
		backgroundRectangle.fill = new ImageFill(lastMergedLayerFile);
		backgroundRectangle.width = bounds.width;
		backgroundRectangle.height = bounds.height;
		backgroundRectangle.name = "Sizing Rectangle";
		
		if (getIsArtboard(originalSelectedItem)==false) {
			selection.insertionParent.addChild(backgroundRectangle);
		}
		else {
			originalSelectedItem.addChild(backgroundRectangle);
		}

		// send rectangle to back
		selection.items = [backgroundRectangle];

		if (groupLayer) {
			commands.group();
			group = selection.items[0];
			lastGroup = group;
		}
		else {
			group = backgroundRectangle;
			lastGroup = group;
		}

		// move and set z index
		if (getIsArtboard(originalSelectedItem)==false) {

			if (isInGroup) {
				replicatePosition(originalSelectedItem, group);
			}
			else {
				group.moveInParentCoordinates(bounds.x, bounds.y);
			}
			
			// reorder
			moveToIndex(group, originalItemIndex);
		}

		// name
		group.name = originalSelectedItem.name;

		await sleep(5)
		
		selection.items = [];
		selection.items = [group];
	}
	catch(error) {
		log(error)
	}
}

/**
 * Get if element is in a group
 * @param {SceneNode} item 
 * @returns {Boolean} 
 **/
function getIsInGroup(item) {
	var parent = item && item.parent;
	var isArtboard = parent && getIsArtboard(parent);

	if (parent!=null && parent.isContainer && isArtboard==false) {
		return true;
	}

	return false;
}

/**
 * 
 * @param {Object} object 
 */
function getArrayFromObject(object) {
	var array = [];

	object.forEach((value, i) => {
		array[i] = value;
	});

	// trim to multiple of 4
	array.length = array.length - (array.length % 4);

	return array;
}

/**
 * Duplicate position of an element
 * @param {SceneNode} source 
 * @param {SceneNode} target
 */
function replicatePosition(source, target, place = false) {
	var sourceBounds = source.boundsInParent;
	var registrationPoint = {x: source.localBounds.x, y: source.localBounds.y};
	var targetPoint = null;

	try {

		if (place) {
			targetPoint = {};
			targetPoint.x = sourceBounds.x;
			targetPoint.y = sourceBounds.y;
			target.placeInParentCoordinates(registrationPoint, targetPoint);
		}
		else {
			target.moveInParentCoordinates(sourceBounds.x, sourceBounds.y);
		}
	}
	catch(error) {
		log(error)
	}

}


/**
 * Open documentation URL
 */
function openDocumentation() {
	shell.openExternal(GlobalModel.documentationURL);
}

module.exports = {
	commands: {
		merge: showDialog, 
		openSupportDialog: openSupportDialog
	}
}
