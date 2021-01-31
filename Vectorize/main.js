///////////////////////////////////////////////////////////////////////////
// Vectorize
// Version 1.0.0
///////////////////////////////////////////////////////////////////////////

/**
 * Convert raster image or whatever is selected into a vector
 **/

const {Artboard, BooleanGroup, Blur, Matrix, Color, ImageFill, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, SymbolInstance, Text, Polygon} = require("scenegraph");
const scenegraph = require("scenegraph");
const {Form, MainForm, SupportForm, ElementForm, SettingsForm, AlertForm, GlobalModel, HTMLConstants, Styles } = require("./library.js");
const {log, getTime, getBase64FromSceneNode, getArrayBufferFromSceneNode, getIsArtboard, getAllArtboards, sleep, getTempImageFromSceneNode, getIsGraphicNode, getIsGraphicNodeWithImageFill, isInEditContext, isDescendantNode, getIsPasteboardItem, isPortrait, isLandscape, isSiblingNode, isChildNode, getChildNodes, object, trim, getPx, getArtboard, addString, addStrings, getShortNumber, getShortString, getClassName, getFunctionName, getStackTrace, logStackTrace, getBoundsInParent, getChangedProperties, deleteProperties, DebugSettings, indentMultiline, getIsInGroup, replicatePosition} = require("./log");
const h = require("./h");
const shell = require("uxp").shell;
const platform = require("os").platform();
const clipboard = require("clipboard");
const interactions = require("interactions");
const ImageTracer = require("./imagetracer_v1.2.5");
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

var mainForm = new MainForm();
var elementForm = new ElementForm();
var settingsForm = new SettingsForm();
var alertForm = new AlertForm();
var supportForm = new SupportForm();
var form = new Form();
var elementDialog = null;
var panelNode = null;
var lastVector = "M 0 0 L 0 100 Z";
var traceData = null;
var lastMergedLayerFile = null;
var mouseDownElement = null;
var lastVectorElement = null;
var lastGroup = null;
var originalSelectedItem = null;
var originalSelectedItemOpacity = 1;
var hideByOpacity = true;
var originalItemIndex = 0;
var autoExport = false;
var imageData = null;
var rgba = null;
var cancelRunningProcess = false;
var converting = false;
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
	var labelBeforeCheckboxesWidth = isPanel ? elementForm.panelLabelWidth : elementForm.labelBeforeCheckboxWidth;
	var labelBeforeCheckboxesMargin = isPanel ? 8 : 0;
	var checkboxLabelWidth = isPanel ? 95 : elementForm.labelBeforeCheckboxWidth;
	var spacerWidth = isPanel ? elementForm.panelCheckboxesSpacerWidth : elementForm.elementCheckboxesSpacerWidth;
	var margin = isPanel ? 0 : 0;
	var displayed = isPanel ? "none" : "flex";
	var formName = isPanel ? "Element Panel" : "Element options";
	var panelFooterDisplay = isPanel ? "flex" : "none";
	var inputWidth = 20;
	var dropdownIconWidth = 12;
	var dialogPadding = isPanel ? form.elementPanelPadding : form.dialogPadding;
	var checkboxSpacerStyles = isPanel ? {flex: "1", width: getPx(spacerWidth) } : {width: getPx(spacerWidth)};
	var elementType = isPanel ? "form" : "form";
	var showLabelsInPanel = true;

	if (isPanel) {
		if (showLabelsInPanel==false) {
			labelBeforeCheckboxesWidth = 0;
			labelWidth = 0;
		}
	}

var elementDialog = h("dialog", {name:"Element", style: { padding: getPx(dialogPadding), margin: getPx(0), display: "block", width: dialogWidthNoPx } },
		elementForm.mainForm = h(elementType, { id:"formUpdate", name: formName, method: "dialog",
			style: { fontSize: getPx(form.formFontSize), width: formWidthNoPx, minWidth: getPx(100), 
				overflowX: "hidden", overflowY:"auto", padding: getPx(0), margin: getPx(margin) }, 
			async onsubmit(e) { await handleFormSubmit(e)  } },
		elementForm.mainFormFieldset = h("fieldset", 
		  h("div", { class: elementForm.flexDirection, style: { alignItems: "center", height: getPx(26) } },
			 h("h2", { style: { paddingLeft: getPx(0), marginLeft: getPx(0), textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" },
			 onclick(e) {  } },
			 "Vectorize"),
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
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 	"Presets:"),
	
			elementForm.presetsList = h(HTMLConstants.SELECT, {
				id:"optionsList", uxpEditLabel:"", uxpQuiet: true, 
				title: "Preconfigured Format", 
				style: { paddingTop: getPx(0), border:form.borderWeight + "px solid blue", opacity: .75,
				minWidth: getPx(0), cursor: form.cursor},
				
				async onchange(e) { await optionsListChange(e) } },
					h(HTMLConstants.OPTION, { selected: true, value: "default" }, "Default"),
					h(HTMLConstants.OPTION, { value: "posterized1" }, "Posterized 1"),
					h(HTMLConstants.OPTION, { value: "posterized2" }, "Posterized 2"),
					h(HTMLConstants.OPTION, { value: "posterized3" }, "Posterized 3"),
					h(HTMLConstants.OPTION, { value: "curvy" }, "Curvy"),
					h(HTMLConstants.OPTION, { value: "sharp" }, "Sharp"),
					h(HTMLConstants.OPTION, { value: "detailed" }, "Detailed"),
					h(HTMLConstants.OPTION, { value: "smoothed" }, "Smoothed"),
					h(HTMLConstants.OPTION, { value: "grayscale" }, "Grayscale"),
					h(HTMLConstants.OPTION, { value: "fixedpalette" }, "Fixed Palette"),
					h(HTMLConstants.OPTION, { value: "randomsampling1" }, "Randomsampling 1"),
					h(HTMLConstants.OPTION, { value: "randomsampling2" }, "Randomsampling 2"),
					h(HTMLConstants.OPTION, { value: "artistic1" }, "Artistic 1"),
					h(HTMLConstants.OPTION, { value: "artistic2" }, "Artistic 2"),
					h(HTMLConstants.OPTION, { value: "artistic3" }, "Artistic 3"),
					h(HTMLConstants.OPTION, { value: "artistic4" }, "Artistic 4")
			),

			elementForm.additionalStylesInput = h("input", { id:"messagesTextarea", uxpEditLabel:"Edit value", 
				placeholder: "Input for form enter key to work", 
				style: { width: getPx(10), opacity: 0}, 
				onkeydown(e) {  } } ),

			h("span", { style: { flex: ".25" } }, ""),
			
			elementForm.messageLabel = h("span", { style: { textAlign:"center", width: getPx(labelWidth), flex: "1" } }, ""),
			
			h("span", { style: { flex: ".25" } }, ""),
			
			elementForm.cancelVectorizeButton = h("a", { id:"okButton", uxpEditLabel:"Edit value", uxpVariant: "primary", 
				style: {cursor: "pointer", marginRight: getPx(8), display: "none" },
				onclick(e) { cancelConversion(e) } }, "Cancel"),

			elementForm.vectorizeButton = h("div", { id:"okButton", uxpEditLabel:"Edit value", uxpVariant: "primary", 
				style: {cursor: "pointer" },
				async onclick(e) { await vectorize(e) } }, "Convert"),
			/*
			 elementForm.vectorizeButton = h("img", { src: form.interactionButtonPath, width: getPx(form.iconWidth), 
				title: "Vectorize", 
				style: { marginRight: getPx(3), cursor: "pointer", opacity: .75 },
				async onclick(e) { /* await addLastVector(e) }, 
				async onmousedown(e) { await createVectors(e) } }, ""),
				*/
		  ),
		  
		  h("hr", { style: { display: displayed, height: getPx(1), paddingLeft: getPx(6), marginLeft: getPx(0) } }, ""),

		  /**  ELEMENT OPTIONS FOOTER  ***********************/
		  h("footer", { class: elementForm.flexDirection, style: { display: displayed, height: getPx(18) },  },
		  	 elementForm.helpButton = h("a", { style: form.footerButtonStyle, title: "Open the help documentation", 
				onclick(e) { openDocumentation() } }, "Support"),

			 elementForm.pathLabel = h("span", { 
				style: { color: "#A8A8A8" },
			  onclick(e) {  } }, ""),

			elementForm.completeIcon = h("img", { src: form.completeIconPath, height: getPx(form.iconWidth), 
				  title: "Conversion complete", 
				  style: { marginLeft: getPx(12), marginRight: getPx(12), cursor: "pointer", opacity: 1, display: "none"} }, ""),

			h("span", { style: { flex: 1 } }, ""),

			 elementForm.cancelButton = h("div", { id:"cancelButton", uxpEditLabel:"Cancel Form", uxpVariant: "primary", 
				style: {cursor: "pointer", marginRight: getPx(8) },
			 	onclick(e) { cancelElementForm(e) } }, "Cancel"),
			 elementForm.closeButton = h("div", { id:"submitButton", uxpEditLabel:"Commit Form", uxpVariant: "primary", 
			 	style: {cursor: "pointer" },
			 	onclick(e){ closeWindow(e); } }, "Close")
		  ),


		  /**  PANEL OPTIONS FOOTER  ***********************/
		  
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { marginTop: getPx(4), marginBottom: getPx(6), height:getPx(4), display: panelFooterDisplay } },
		  	h(HTMLConstants.HR, { style: { padding: getPx(0), margin: getPx(0), height:getPx(2), width: "100%"} },"")
		  ),

		  h(HTMLConstants.FOOTER, { class: elementForm.flexDirection, style: { display: panelFooterDisplay, margin:getPx(4), padding:getPx(0) }  },
			h("span", { style: { minWidth:getPx(0), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }, title:"Export on changes" }, 
			"Auto export"),
			elementForm.exportOnUpdateToggle = h("img", { id:"exportOnUpdateToggle", uxpEditLabel: "Export on Update", 
				src: form.toggleOff, height: getPx(form.iconWidth), title: "Export on any changes", 
				style: { marginLeft:getPx(12), cursor: "pointer"},
				onclick(e) { } }, ""),
			h("span", { style: { flex: "1" } }, ""),
			elementForm.exportingIcon = h("img", { id:"exportingIcon", uxpEditLabel: "Exporting Icon", 
				src: form.exportIconPath, height: getPx(form.iconWidth-4), title: "Exporting Icon", 
				style: { display: Styles.NONE, smarginLeft:getPx(12) }}, ""),
			elementForm.beforeExportLabel = h("span", { style: { flex: "1", marginRight: getPx(8) } }, ""),
			elementForm.exportLabel = h("a", { id:"exportLabel", uxpEditLabel:"Export", uxpVariant: "primary",
				title: "Export artboard", 
				style: {cursor: "pointer", color: "#585858", title: "Export artboard",},
				async onclick(e){ } }, 
			"Export")
		  ),
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
			let alert = await showAlertDialog("Select an element to continue", "Vectorize");
			return alert;
		}
		else {
			//log("has selections")
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
	cancelRunningProcess = false;
	setName(getShortString(originalSelectedItem.name, 200))

	return dialog;
}

async function cancelElementForm(event) {
	const {selection} = require("scenegraph");

	try {
		removeVectorGroup();
		clearImageData();
		showImage();
		clearPathInfo();
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
		clearPathInfo();
		
		closeDialog(elementForm.mainDialog);
	}
	catch (error) {
		log(error.stack);
	}
}

async function getImageData(item) {
	var buffer = await getArrayBufferFromSceneNode(item);
	var bitmapData = UPNG.decode(buffer);
	rgba = UPNG.toRGBA8(bitmapData)[0];
	bitmapData.data = getArrayFromObject(bitmapData.data);

	return bitmapData;
}

function clearImageData() {
	imageData = null;
}

/**
 * Cancel conversion and restore image. May not need await
 */
async function cancelConvertProcess() {
	const {selection} = require("scenegraph");
	await removeVectorGroup();
	await showImage();
	await showExportButtons();
	showExportingLabel("")
	selectOriginalItem();
}

async function removeVectorGroup() {
	
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

function clearPathInfo() {
	elementForm.pathLabel.innerHTML = "";
}

function setPathInfo(value) {
	elementForm.pathLabel.innerHTML = value;
}

function setName(value) {
	elementForm.nameLabel.innerHTML = value;
}

function showExportButtons() {
	elementForm.vectorizeButton.style.display = "block";
	elementForm.cancelVectorizeButton.style.display = "none";
	elementForm.cancelButton.style.display = Styles.BLOCK;
	elementForm.closeButton.style.display = Styles.BLOCK;
}

function showCancelButtons() {
	elementForm.vectorizeButton.style.display = "none";
	elementForm.cancelVectorizeButton.style.display = "block";
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
			await vectorize(event);
		}
		lastSelectedPreset = item;
	}
}

/**
 * Handle form submit
 * @param {Event} event 
 **/
async function handleFormSubmit(event) {
	event.preventDefault();
	
	await vectorize(event);
}

/**
 * Get options list values
 * @return {String} 
 **/
function getOptionsList() {
	var item = elementForm.presetsList.value;
	
	if (item) {
		return item;
	}

	return "default";
}

async function vectorize(event) {
	const {selection} = require("scenegraph");
	const { editDocument } = require("application");
	var item = null;

	try {
		showCancelButtons();
		showImage();

		// remove last export group
		removeVectorGroup();
		item = selectOriginalItem();
	
		// if last export completed enable auto export
		if (lastGroup!=null) {
			autoExport = true;
		}

		var showPathData = false;
		var isPanel = false;
		
		if (imageData==null) {
			imageData = await getImageData(item);
		}

		var traceoptions = getOptionsList();
		//log("options:" + traceoptions)
		clearPathInfo();
		await showExportingLabel("Converting. Please wait...");
		await sleep(globalModel.runPauseDuration);
		// todo - store trace data if options are the same
		traceData = await ImageTracer.imagedataToTracedata(imageData, traceoptions);
		await sleep(5);
		
		if (showPathData) {
			var result = ImageTracer.imagedataToSVG(imageData, traceoptions);
			//log("imagedataToSVG result:" + result)
			var pathData = result.match(/d="(.+?)"/)[1];
			//log("pathData:" + pathData)
		}

		lastVector = pathData;
		mouseDownElement = item;

		if (isPanel==false) {
			hideImage();
			await addLastVector();
		}

		if (cancelRunningProcess) {
			cancelRunningProcess = false;
			selection.items = [];
			selection.items = [originalSelectedItem];
			//await cancelConvertProcess();
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

async function addLastVector(event) {
	//log("Creating paths")
	const {editDocument} = require("application");

	var inPanel = false;

	try {

		if(inPanel) {
			editDocument( async () => {
				await convertToPaths();
			});
		}
		else {
			await convertToPaths();
		}
	}
	catch(error) {
		log(error)
	}
}

/**
 * Converts the path data into path elements
 */
async function convertToPaths() {
	const {selection} = require("scenegraph");
	const {editDocument} = require("application");

	try {

		var group = null;
		var bounds = getBoundsInParent(mouseDownElement);
		var isInGroup = getIsInGroup(originalSelectedItem);

		var x = bounds.xInArtboard;
		var y = bounds.yInArtboard;
		
		// background and sizing for group
		backgroundRectangle = new Rectangle();
		backgroundRectangle.fill = new Color("#000000", 0);
		backgroundRectangle.width = bounds.width;
		backgroundRectangle.height = bounds.height;
		//backgroundRectangle.placeInParentCoordinates({x:0,y:0}, {x:x, y:y});
		//backgroundRectangle.moveInParentCoordinates(bounds.xInArtboard, bounds.yInArtboard);
		backgroundRectangle.name = "Sizing Rectangle";
		
		if (getIsArtboard(originalSelectedItem)==false) {
			selection.insertionParent.addChild(backgroundRectangle);
		}
		else {
			originalSelectedItem.addChild(backgroundRectangle);
		}

		// send rectangle to back
		selection.items = [backgroundRectangle];
		//commands.sendToBack();

		// select all paths and group
		//paths.push(backgroundRectangle);
		commands.group();
		group = selection.items[0];
		lastGroup = group;

		// move and set z index
		if (getIsArtboard(originalSelectedItem)==false) {
			//group.moveInParentCoordinates(bounds.x, bounds.y);
			//group.placeInParentCoordinates(originalSelectedItem.bounds.x, originalSelectedItem.bounds.y);
			
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

		selection.items = [];
		selection.items = [group];

		var paths = await createPathsFromTraceData(traceData, traceData.options)
		setPathInfo("Paths: " + paths.length + " Colors: " + traceData.palette.length);
		await sleep(5)
		var backgroundRectangle;
		
		if (paths.length) {
			selection.items = [];
			selection.items = [group];
		}
	}
	catch(error) {
		
	}
}

// Rounding to given decimals https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
function roundtodec(val,places) { 
	return +val.toFixed(places); 
}

function tosvgcolorstr(c, options){
	return 'fill="rgb('+c.r+','+c.g+','+c.b+')" stroke="rgb('+c.r+','+c.g+','+c.b+')" stroke-width="'+options.strokewidth+'" opacity="'+c.a/255.0+'" ';
}
	
// Getting SVG path element string from a traced path
function createPaths( tracedata, lnum, pathnum, options, color) {
	const {selection} = require("scenegraph");
	var layer = tracedata.layers[lnum];
	var smp = layer[pathnum];
	var svg = "";
	var pcnt;
	var pathData = "";
	var paths = [];
	
	// Line filter
	if (options.linefilter && smp.segments.length < 3) {
		return [];
	}
	
	// Starting path element, desc contains layer and path number
	svg = '<path '+
		( options.desc ? ('desc="l '+lnum+' p '+pathnum+'" ') : '' ) +
		tosvgcolorstr(tracedata.palette[lnum], options) +
		'd="';

	const rgba = tracedata.palette[lnum];
	var color = new Color(rgba);
	//log("adding " + color.toHex(true) + " layer")
	
	// Creating non-hole path string
	if ( options.roundcoords === -1 ) {
		pathData += 'M '+ smp.segments[0].x1 * options.scale +' '+ smp.segments[0].y1 * options.scale +' ';

		for(pcnt=0; pcnt<smp.segments.length; pcnt++){
			pathData += smp.segments[pcnt].type +' '+ smp.segments[pcnt].x2 * options.scale +' '+ smp.segments[pcnt].y2 * options.scale +' ';
			if(smp.segments[pcnt].hasOwnProperty('x3')){
				pathData += smp.segments[pcnt].x3 * options.scale +' '+ smp.segments[pcnt].y3 * options.scale +' ';
			}
		}

		pathData += 'Z ';
	}
	else {
		pathData += 'M '+ roundtodec( smp.segments[0].x1 * options.scale, options.roundcoords ) +' '+ roundtodec( smp.segments[0].y1 * options.scale, options.roundcoords ) +' ';

		for(pcnt=0; pcnt<smp.segments.length; pcnt++){
			pathData += smp.segments[pcnt].type +' '+ roundtodec( smp.segments[pcnt].x2 * options.scale, options.roundcoords ) +' '+ roundtodec( smp.segments[pcnt].y2 * options.scale, options.roundcoords ) +' ';

			if(smp.segments[pcnt].hasOwnProperty('x3')){
				pathData += roundtodec( smp.segments[pcnt].x3 * options.scale, options.roundcoords ) +' '+ roundtodec( smp.segments[pcnt].y3 * options.scale, options.roundcoords ) +' ';
			}
		}

		pathData += 'Z ';
	}// End of creating non-hole path string

	
	// Hole children
	for( var hcnt=0; hcnt < smp.holechildren.length; hcnt++){
		var hsmp = layer[ smp.holechildren[hcnt] ];
		// Creating hole path string
		if( options.roundcoords === -1 ){
			
			if(hsmp.segments[ hsmp.segments.length-1 ].hasOwnProperty('x3')){
				pathData += 'M '+ hsmp.segments[ hsmp.segments.length-1 ].x3 * options.scale +' '+ hsmp.segments[ hsmp.segments.length-1 ].y3 * options.scale +' ';
			}else{
				pathData += 'M '+ hsmp.segments[ hsmp.segments.length-1 ].x2 * options.scale +' '+ hsmp.segments[ hsmp.segments.length-1 ].y2 * options.scale +' ';
			}
			
			for(pcnt = hsmp.segments.length-1; pcnt >= 0; pcnt--){
				pathData += hsmp.segments[pcnt].type +' ';
				if(hsmp.segments[pcnt].hasOwnProperty('x3')){
					pathData += hsmp.segments[pcnt].x2 * options.scale +' '+ hsmp.segments[pcnt].y2 * options.scale +' ';
				}
				
				pathData += hsmp.segments[pcnt].x1 * options.scale +' '+ hsmp.segments[pcnt].y1 * options.scale +' ';
			}
			
		}
		else {
			
			if(hsmp.segments[ hsmp.segments.length-1 ].hasOwnProperty('x3')){
				pathData += 'M '+ roundtodec( hsmp.segments[ hsmp.segments.length-1 ].x3 * options.scale ) +' '+ roundtodec( hsmp.segments[ hsmp.segments.length-1 ].y3 * options.scale ) +' ';
			}else{
				pathData += 'M '+ roundtodec( hsmp.segments[ hsmp.segments.length-1 ].x2 * options.scale ) +' '+ roundtodec( hsmp.segments[ hsmp.segments.length-1 ].y2 * options.scale ) +' ';
			}
			
			for(pcnt = hsmp.segments.length-1; pcnt >= 0; pcnt--){
				pathData += hsmp.segments[pcnt].type +' ';
				if(hsmp.segments[pcnt].hasOwnProperty('x3')){
					pathData += roundtodec( hsmp.segments[pcnt].x2 * options.scale ) +' '+ roundtodec( hsmp.segments[pcnt].y2 * options.scale ) +' ';
				}
				pathData += roundtodec( hsmp.segments[pcnt].x1 * options.scale ) +' '+ roundtodec( hsmp.segments[pcnt].y1 * options.scale ) +' ';
			}
			
			
		}// End of creating hole path string
		
		pathData += 'Z '; // Close path
		
	}// End of holepath check

	// Closing path element
	svg += pathData + '" />';

	// add path scenenode
	var path = new Path();
	path.pathData = pathData;
	path.fill = color;

	if (lastGroup) {
		lastGroup.addChild(path);
	}
	else {
		selection.insertionParent.addChild(path);
	}
	var colorValue = getRgbFromObject(color);

	path.name = colorValue;

	paths.push(path);
	//var boundingBox = layer.boundingbox;
	//var x = boundingBox[0];
	//var y = boundingBox[1];
	//newElement.moveInParentCoordinates(x, y);
	
	// Rendering control points
	if(options.lcpr || options.qcpr){
		for(pcnt=0; pcnt<smp.segments.length; pcnt++){
			if( smp.segments[pcnt].hasOwnProperty('x3') && options.qcpr ){
				svg += '<circle cx="'+ smp.segments[pcnt].x2 * options.scale +'" cy="'+ smp.segments[pcnt].y2 * options.scale +'" r="'+ options.qcpr +'" fill="cyan" stroke-width="'+ options.qcpr * 0.2 +'" stroke="black" />';
				svg += '<circle cx="'+ smp.segments[pcnt].x3 * options.scale +'" cy="'+ smp.segments[pcnt].y3 * options.scale +'" r="'+ options.qcpr +'" fill="white" stroke-width="'+ options.qcpr * 0.2 +'" stroke="black" />';
				svg += '<line x1="'+ smp.segments[pcnt].x1 * options.scale +'" y1="'+ smp.segments[pcnt].y1 * options.scale +'" x2="'+ smp.segments[pcnt].x2 * options.scale +'" y2="'+ smp.segments[pcnt].y2 * options.scale +'" stroke-width="'+ options.qcpr * 0.2 +'" stroke="cyan" />';
				svg += '<line x1="'+ smp.segments[pcnt].x2 * options.scale +'" y1="'+ smp.segments[pcnt].y2 * options.scale +'" x2="'+ smp.segments[pcnt].x3 * options.scale +'" y2="'+ smp.segments[pcnt].y3 * options.scale +'" stroke-width="'+ options.qcpr * 0.2 +'" stroke="cyan" />';
			}
			if( (!smp.segments[pcnt].hasOwnProperty('x3')) && options.lcpr){
				svg += '<circle cx="'+ smp.segments[pcnt].x2 * options.scale +'" cy="'+ smp.segments[pcnt].y2 * options.scale +'" r="'+ options.lcpr +'" fill="white" stroke-width="'+ options.lcpr * 0.2 +'" stroke="black" />';
			}
		}
		
		// Hole children control points
		for( var hcnt=0; hcnt < smp.holechildren.length; hcnt++){
			var hsmp = layer[ smp.holechildren[hcnt] ];
			for(pcnt=0; pcnt<hsmp.segments.length; pcnt++){
				if( hsmp.segments[pcnt].hasOwnProperty('x3') && options.qcpr ){
					svg += '<circle cx="'+ hsmp.segments[pcnt].x2 * options.scale +'" cy="'+ hsmp.segments[pcnt].y2 * options.scale +'" r="'+ options.qcpr +'" fill="cyan" stroke-width="'+ options.qcpr * 0.2 +'" stroke="black" />';
					svg += '<circle cx="'+ hsmp.segments[pcnt].x3 * options.scale +'" cy="'+ hsmp.segments[pcnt].y3 * options.scale +'" r="'+ options.qcpr +'" fill="white" stroke-width="'+ options.qcpr * 0.2 +'" stroke="black" />';
					svg += '<line x1="'+ hsmp.segments[pcnt].x1 * options.scale +'" y1="'+ hsmp.segments[pcnt].y1 * options.scale +'" x2="'+ hsmp.segments[pcnt].x2 * options.scale +'" y2="'+ hsmp.segments[pcnt].y2 * options.scale +'" stroke-width="'+ options.qcpr * 0.2 +'" stroke="cyan" />';
					svg += '<line x1="'+ hsmp.segments[pcnt].x2 * options.scale +'" y1="'+ hsmp.segments[pcnt].y2 * options.scale +'" x2="'+ hsmp.segments[pcnt].x3 * options.scale +'" y2="'+ hsmp.segments[pcnt].y3 * options.scale +'" stroke-width="'+ options.qcpr * 0.2 +'" stroke="cyan" />';
				}
				if( (!hsmp.segments[pcnt].hasOwnProperty('x3')) && options.lcpr){
					svg += '<circle cx="'+ hsmp.segments[pcnt].x2 * options.scale +'" cy="'+ hsmp.segments[pcnt].y2 * options.scale +'" r="'+ options.lcpr +'" fill="white" stroke-width="'+ options.lcpr * 0.2 +'" stroke="black" />';
				}
			}
		}
	} // End of Rendering control points
		
	return paths;
	
}// End of svgpathstring()
	
// Converting tracedata to an SVG string
async function createPathsFromTraceData( tracedata, options) {
	let commands = require("commands");
	let {selection} = require("scenegraph");
	
	options = ImageTracer.checkoptions(options);
	
	var w = tracedata.width * options.scale;
	var h = tracedata.height * options.scale;
	var paths = [];
	var currentPaths = [];
	var color = null;

	// layers
	for(var layerIndex=0; layerIndex < tracedata.layers.length; layerIndex++) {
		color = tracedata.palette[layerIndex];
		
		// paths
		for(var pathIndex=0; pathIndex < tracedata.layers[layerIndex].length; pathIndex++) {
			
			// Adding SVG <path> string
			if( !tracedata.layers[layerIndex][pathIndex].isholepath ) {
				await sleep(2);
				currentPaths = createPaths( tracedata, layerIndex, pathIndex, options, color);
				paths = paths.concat(currentPaths);
				elementForm.pathLabel.innerHTML = "Path: " + paths.length;
			}

			if (cancelRunningProcess) {
				break;
			}
		}

		if (cancelRunningProcess) {
			break;
		}
	}

	//log("paths length:" + paths.length);
	return paths;
}

function getRgbFromObject(object) {
	return "rgba(" + object.r + "," + object.g + "," + object.b + "," + getShortNumber(object.a/255, 2) + ")";
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
 * Open documentation URL
 */
function openDocumentation() {
	shell.openExternal(GlobalModel.documentationURL);
}

module.exports = {
	commands: {
		vectorize: showDialog, 
		openSupportDialog: openSupportDialog
	}
}
