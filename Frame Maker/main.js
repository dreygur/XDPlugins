const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const platform = require("os").platform();
const {editDocument} = require("application");
const application = require("application");
const localFileSystem = require("uxp").storage.localFileSystem;
const commands = require("commands");
const assets = require("assets");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
// var pluginFolder;
var dataFolder;
var settingsFile;
var settingsO;

var pluginTitle = "Frame Maker";

var labelFontSizeMini = 9;
var labelFontSize = 10;
var textFontSize = 11;

var activeColor = "#2680EB";
var inactiveColor = "#A0A0A0";
var activeBkgColor = "#E2E2E2";
var lightBkgColor = "#FBFBFB";
var labelColor = "#666666";
var labelQuietColor = "#999999";
var separatorColor = "#E4E4E4";
var errorColor = "#FF0000";

var minWidth;
var minHeight;
var selectionWidth;
var selectionHeight;
var selectionX;
var selectionY;

var multipleSelection = false;

var frameMode = "size";
var paddingMode = "padding";

var defaultColorsA = ["#FFFFFF", "#CCCCCC", "#999999", "#666666", "#333333", "#000000", "#FF0000"];
var assetsColorsA;
var selectedColorButton;
var colorPickerOpen = false;

var individualFrame = false;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SHAPE MODE MODULE
var shapeModeModule = createModule("top", "SHAPE");
shapeModeModule.style.marginTop = 0;
container.appendChild(shapeModeModule);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FRAME SHAPE MENU
var shapeModeMenu = document.createElement("div");
shapeModeMenu.style.display = "flex";
shapeModeMenu.style.flexDirection = "row";
shapeModeMenu.style.flexGrow = 1;
shapeModeMenu.style.height = 24; // 30; // 40;
shapeModeMenu.style.background = lightBkgColor;
shapeModeMenu.style.border = "1px solid";
shapeModeMenu.style.borderColor = separatorColor;
shapeModeMenu.style.borderRadius = 4;
shapeModeModule.appendChild(shapeModeMenu);

// - - - - - - - - - - - - - - - - - - - - RECTANGLE BUTTON
var rectangleB = document.createElement("div");
rectangleB.style.display = "flex";
rectangleB.style.alignItems = "center";
rectangleB.style.justifyContent = "center";
// rectangleB.style.width = 66; // 143;
rectangleB.style.flexGrow = 1;
rectangleB.style.background = activeBkgColor;
rectangleB.style.borderRadius = "4px 0px 0px 4px";
rectangleB.setAttribute("title", "Rectangular frame");
shapeModeMenu.appendChild(rectangleB);

var rectangleIcon = document.createElement("img");
rectangleIcon.src = "img/rectangle.png";
rectangleB.appendChild(rectangleIcon);

// - - - - - - - - - - - - - - - - - - - - CIRCLE BUTTON
var circleB = document.createElement("div");
circleB.style.display = "flex";
circleB.style.alignItems = "center";
circleB.style.justifyContent = "center";
// circleB.style.width = 66; // 143;
circleB.style.flexGrow = 1;
circleB.style.borderRadius = "0px 4px 4px 0px";
circleB.setAttribute("title", "Elliptic frame");
shapeModeMenu.appendChild(circleB);

var circleIcon = document.createElement("img");
circleIcon.src = "img/circle.png";
circleB.appendChild(circleIcon);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FRAME MODE MODULE
var frameModeModule = createModule("internal", "FRAME");
container.appendChild(frameModeModule);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FRAME MODE MENU
var frameModeMenu = document.createElement("div");
frameModeMenu.style.display = "flex";
frameModeMenu.style.flexDirection = "row";
frameModeMenu.style.flexGrow = 1;
frameModeMenu.style.height = 24; // 30; // 40;
frameModeMenu.style.background = lightBkgColor;
frameModeMenu.style.border = "1px solid";
frameModeMenu.style.borderColor = separatorColor;
frameModeMenu.style.borderRadius = 4;
frameModeModule.appendChild(frameModeMenu);

// - - - - - - - - - - - - - - - - - - - - SIZE BUTTON
var sizeModeB = document.createElement("div");
sizeModeB.style.display = "flex";
sizeModeB.style.alignItems = "center";
sizeModeB.style.justifyContent = "center";
sizeModeB.style.width = "50%";
sizeModeB.style.background = activeBkgColor;
sizeModeB.style.borderRadius = "4px 0px 0px 4px";
sizeModeB.style.fontSize = labelFontSize;
sizeModeB.textContent = "Size";
frameModeMenu.appendChild(sizeModeB);

// - - - - - - - - - - - - - - - - - - - - PADDING BUTTON
var paddingModeB = document.createElement("div");
paddingModeB.style.display = "flex";
paddingModeB.style.alignItems = "center";
paddingModeB.style.justifyContent = "center";
paddingModeB.style.width = "50%";
paddingModeB.style.borderRadius = "0px 4px 4px 0px";
paddingModeB.style.fontSize = labelFontSize;
paddingModeB.textContent = "Padding";
frameModeMenu.appendChild(paddingModeB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SIZE SETTINGS
var sizeSettings = document.createElement("div");
sizeSettings.style.display = "flex";
sizeSettings.style.flexDirection = "row";
sizeSettings.style.alignItems = "center";
sizeSettings.style.margin = "10px auto 20px auto";
container.appendChild(sizeSettings);

var sizeWidthL = createLabelMini("W");
sizeWidthL.style.color = labelQuietColor;
sizeSettings.appendChild(sizeWidthL);

var sizeWidthTF = createTextInput("", 40, true);
sizeWidthTF.type = "number";
sizeWidthTF.min = 0;
sizeWidthTF.setAttribute("title", "Frame Width");
sizeWidthTF.oninput = (e) => setFrameWidth();
sizeSettings.appendChild(sizeWidthTF);

var sizeHeightL = createLabelMini("H");
sizeHeightL.style.color = labelQuietColor;
sizeSettings.appendChild(sizeHeightL);

var sizeHeightTF = createTextInput("", 40, true);
sizeHeightTF.type = "number";
sizeHeightTF.min = 0;
sizeHeightTF.setAttribute("title", "Frame Height");
sizeHeightTF.oninput = (e) => setFrameHeight();
sizeSettings.appendChild(sizeHeightTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PADDING SETTINGS
var paddingSettings = document.createElement("div");
paddingSettings.style.display = "flex";
paddingSettings.style.flexDirection = "column";
paddingSettings.style.display = "none";
paddingSettings.style.margin = "16px auto 20px auto";
container.appendChild(paddingSettings);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PADDING MODE MENU
var paddingModeMenu = document.createElement("div");
paddingModeMenu.style.display = "flex";
paddingModeMenu.style.flexDirection = "row";
paddingModeMenu.style.marginBottom = 10;
paddingModeMenu.style.width = 60;
paddingModeMenu.style.height = 24;
paddingModeMenu.style.background = lightBkgColor;
paddingModeMenu.style.border = "1px solid";
paddingModeMenu.style.borderColor = separatorColor;
paddingModeMenu.style.borderRadius = 4;
paddingSettings.appendChild(paddingModeMenu);

// - - - - - - - - - - - - - - - - - - - - PADDING BUTTON
var paddingB = document.createElement("div");
paddingB.style.display = "flex";
paddingB.style.alignItems = "center";
paddingB.style.justifyContent = "center";
paddingB.style.width = 30;
paddingB.style.background = activeBkgColor;
paddingB.style.borderRadius = "4px 0px 0px 4px";
paddingB.setAttribute("title", "Same padding on each side");
paddingModeMenu.appendChild(paddingB);

var paddingIcon = document.createElement("img");
paddingIcon.src = "img/padding.png";
paddingB.appendChild(paddingIcon);

// - - - - - - - - - - - - - - - - - - - - PADDINGS BUTTON
var paddingsB = document.createElement("div");
paddingsB.style.display = "flex";
paddingsB.style.alignItems = "center";
paddingsB.style.justifyContent = "center";
paddingsB.style.width = 30;
paddingsB.style.borderRadius = "0px 4px 4px 0px";
paddingsB.setAttribute("title", "Different padding on each side");
paddingModeMenu.appendChild(paddingsB);

var paddingsIcon = document.createElement("img");
paddingsIcon.src = "img/paddings.png";
paddingsB.appendChild(paddingsIcon);

// - - - - - - - - - - - - - - - - - - - - PADDING INPUT
var paddingInput = document.createElement("div");
paddingInput.style.display = "flex";
paddingSettings.appendChild(paddingInput);

var paddingTF = createTextInput("", 36, true);
paddingTF.type = "number";
paddingTF.min = 0;
paddingTF.setAttribute("title", "Padding");
paddingTF.oninput = (e) => setPadding();
paddingInput.appendChild(paddingTF);

// - - - - - - - - - - - - - - - - - - - - PADDINGS INPUT
var paddingsInput = document.createElement("div");
paddingsInput.style.display = "none";
paddingSettings.appendChild(paddingsInput);

var paddingTopTF = createTextInput("", 30, true);
paddingTopTF.type = "number";
paddingTopTF.min = 0;
paddingTopTF.value = 0;
paddingTopTF.setAttribute("title", "Top padding");
paddingTopTF.onfocus = (e) => paddingsIcon.src = "img/padding_top.png";
paddingTopTF.oninput = (e) => setPaddingTop();
paddingsInput.appendChild(paddingTopTF);

var paddingRightTF = createTextInput("", 30, true);
paddingRightTF.type = "number";
paddingRightTF.min = 0;
paddingRightTF.value = 0;
paddingRightTF.setAttribute("title", "Right padding");
paddingRightTF.onfocus = (e) => paddingsIcon.src = "img/padding_right.png";
paddingRightTF.oninput = (e) => setPaddingRight();
paddingsInput.appendChild(paddingRightTF);

var paddingBottomTF = createTextInput("", 30, true);
paddingBottomTF.type = "number";
paddingBottomTF.min = 0;
paddingBottomTF.value = 0;
// paddingBottomTF.style.title = "Bottom padding";
paddingBottomTF.setAttribute("title", "Bottom padding");
paddingBottomTF.onfocus = (e) => paddingsIcon.src = "img/padding_bottom.png";
paddingBottomTF.oninput = (e) => setPaddingBottom();
paddingsInput.appendChild(paddingBottomTF);

var paddingLeftTF = createTextInput("", 30, true);
paddingLeftTF.type = "number";
paddingLeftTF.min = 0;
paddingLeftTF.value = 0;
paddingLeftTF.setAttribute("title", "Left padding");
paddingLeftTF.onfocus = (e) => paddingsIcon.src = "img/padding_left.png";
paddingLeftTF.oninput = (e) => setPaddingLeft();
paddingsInput.appendChild(paddingLeftTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INDIVIDUAL FRAME MODULE
var individualFrameModule = createModule("internal", "");
container.appendChild(individualFrameModule);

var individualFrameCB = createCheckBox("Individual Frame", 100, false);
individualFrameCB.firstChild.onchange = (e) => switchIndividualFrame();
individualFrameCB.firstChild.disabled = true;
individualFrameCB.firstChild.nextSibling.style.opacity = .3;
individualFrameModule.appendChild(individualFrameCB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FILL FRAME MODULE
var fillFrameModule = createModule("internal", "");
container.appendChild(fillFrameModule);

var fillFrameCB = createColorCheckBox("Fill Frame", 60, true);
fillFrameCB.firstChild.onchange = (e) => switchFillFrame();
fillFrameModule.appendChild(fillFrameCB);

// - - - - - - - - - - - - - - - - - - - - COLOR PICKER
var colorPickerContainer = document.createElement("div");
container.appendChild(colorPickerContainer);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var bottomSeparator = createSeparator();
bottomSeparator.style.marginTop = 10;
container.appendChild(bottomSeparator);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FOOTER
var footer = document.createElement("footer");
container.appendChild(footer);

var okB = createButton("Make Frame", "cta");
okB.id = "makeFrame";
okB.onclick = (e) => validatePanel(e);
footer.appendChild(okB);


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
async function show(_e)
{
	// console.log("show()");
	// console.log(_e.node.nodeName);
	
	try
	{
		await init();
	}
	catch(_error)
	{
		console.log(_error);
	}

	setIndividualFrame();
	_e.node.appendChild(container);
}

async function hide(_e)
{
	// console.log("hide()");
	// console.log(_e.node.nodeName);

	if(colorPickerOpen == true)
	{
		closeColorPicker();
	}

	try
	{
		await saveSettings();
	}
	catch(_error)
	{
		console.log(_error);
	}

	_e.node.firstChild.remove();
}

function update()
{
	// console.log("update()");

	setIndividualFrame();
}

async function init()
{
	// set default settings
	try
	{
		await setDefaultSettings();
	}
	catch(_error)
	{
		console.log(_error);
	}

	// get settings
	try
	{
		await getSettings();
	}
	catch(_error)
	{
		console.log(_error);
	}

	setShapeMode(settingsO["shapeMode"]);
	setFrameMode(settingsO["frameMode"]);
	setPaddingMode(settingsO["paddingMode"]);

	sizeWidthTF.value = settingsO["frameWidth"];
	sizeHeightTF.value = settingsO["frameHeight"];
	paddingTF.value = settingsO["padding"];
	paddingTopTF.value = settingsO["paddingTop"];
	paddingRightTF.value = settingsO["paddingRight"];
	paddingBottomTF.value = settingsO["paddingBottom"];
	paddingLeftTF.value = settingsO["paddingLeft"];

	fillFrameCB.firstChild.checked = settingsO["fillFrame"];
	fillFrameCB.firstChild.nextSibling.style.background = settingsO["frameColor"];

	if(colorIsLight(settingsO["frameColor"]))
	{
		// console.log("color is light");
		fillFrameCB.firstChild.nextSibling.style.border = "1px solid #DDDDDD";
	}
	else
	{
		fillFrameCB.firstChild.nextSibling.style.border = "none";
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{
	// console.log("checkSelection()");

	if(selection.items.length == 0 || selection.items[0].constructor.name == "Artboard")
	{
		try
		{
			await openAlertDialog(pluginTitle, "Select at least one object, excluding Artboards.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(selection.items.length > 1)
	{
		multipleSelection = true;
	}

	let firstObjectParentType = selection.items[0].parent.constructor.name;
	// console.log("firstObjectParentType: " + firstObjectParentType);
	// get the first selected object's container
	let firstObjectParent = selection.items[0].parent;
	// console.log("firstSelectedObjectParentName: " + firstObjectParent);

	for(let i = 0; i < selection.items.length; i++)
	{
		// check if other selected objects are inside a different container OR if they are in different artboards
		if(selection.items[i].parent.constructor.name != firstObjectParentType || selection.items[i].parent != firstObjectParent)
		{
			try
			{
				await openAlertDialog(pluginTitle, "Make sure selected objects are all in the same Artboard or in the Pasteboard.");
			}
			catch(_error)
			{
				console.log(_error);
			}
			return false;
		}
	}

	minWidth = selection.items.reduce((max, o) => o.boundsInParent.width > max ? o.boundsInParent.width : max, selection.items[0].boundsInParent.width);

	minHeight = selection.items.reduce((max, o) => o.boundsInParent.height > max ? o.boundsInParent.height : max, selection.items[0].boundsInParent.height);
	// console.log("minWidth: " + minWidth);
	// console.log("minHeight: " + minHeight);
	
	selectionX = selection.items.reduce((min, o) => o.boundsInParent.x < min ? o.boundsInParent.x : min, selection.items[0].boundsInParent.x);
	selectionY = selection.items.reduce((min, o) => o.boundsInParent.y < min ? o.boundsInParent.y : min, selection.items[0].boundsInParent.y);
	// console.log("selectionX: " + selectionX);
	// console.log("selectionY: " + selectionY);
	
	let maxExtremeX = selection.items.reduce((max, o) => (o.boundsInParent.x + o.boundsInParent.width) > max ? (o.boundsInParent.x + o.boundsInParent.width) : max, (selection.items[0].boundsInParent.x + selection.items[0].boundsInParent.width));
	let maxExtremeY = selection.items.reduce((max, o) => (o.boundsInParent.y + o.boundsInParent.height) > max ? (o.boundsInParent.y + o.boundsInParent.height) : max, (selection.items[0].boundsInParent.y + selection.items[0].boundsInParent.height));
	// console.log("maxExtremeX: " + maxExtremeX);
	// console.log("maxExtremeY: " + maxExtremeY);
	
	selectionWidth = maxExtremeX - selectionX;
	selectionHeight = maxExtremeY - selectionY;
	// console.log("selectionWidth: " + selectionWidth);
	// console.log("selectionHeight: " + selectionHeight);

	return true;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ALERT DIALOG
async function openAlertDialog(_title, _message)
{
	let alertDialog = document.createElement("dialog");
	
	// CONTAINER
	let alertContainer = document.createElement("form");
	alertContainer.style.width = 300;
	alertContainer.onsubmit = (e) => alertDialog.close();
	alertDialog.appendChild(alertContainer);
	
	// TITLE
	let alertTitle = document.createElement("h1");
	alertTitle.textContent = _title;
	alertTitle.style.marginBottom = 10;
	alertContainer.appendChild(alertTitle);
	
	// SEPARATOR
	let separator = createSeparator();
	separator.style.marginBottom = 30;
	alertContainer.appendChild(separator);
	
	// MESSAGE
	let alertMessage = document.createElement("div");
	alertMessage.style.padding = "0px 6px";
    alertMessage.style.fontSize = textFontSize;
    alertMessage.style.lineHeight = 1.5;
	alertMessage.innerHTML = _message;
	alertContainer.appendChild(alertMessage);
	
	// FOOTER
	let alertFooter = document.createElement("footer");
	alertFooter.style.marginTop = 30;
	alertContainer.appendChild(alertFooter);
	
	let alertOkB = createButton("OK", "cta");
	alertOkB.setAttribute("type", "submit");
	alertOkB.onclick = (e) => alertDialog.close();
	alertFooter.appendChild(alertOkB);
	
	document.body.appendChild(alertDialog);
	
	try
	{
		await alertDialog.showModal();
	}
	catch(_error)
	{
		console.log(_error)
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PANEL VALIDATION
async function validatePanel(_e)
{
	// console.log("validatePanel()");

	editDocument({editLabel: "Make Frame"}, async() =>
	{
		try
		{
			let s = await checkSelection();
			
			if(s == false)
			{
				return;
			}
			else
			{
				switch(settingsO["frameMode"])
				{
					case "size":
						try
						{
							let s = await checkSize();
							if(s == false)
							{
								return;
							}
						}
						catch(_error)
						{
							console.log(_error);
						}
						break;

					case "padding":
						switch(settingsO["paddingMode"])
						{
							case "padding":
								try
								{
									let p = await checkPadding();
									if(p == false)
									{
										return;
									}
								}
								catch(_error)
								{
									console.log(_error);
								}
								break;
							case "paddings":
								try
								{
									let p = await checkPaddings();
									if(p == false)
									{
										return;
									}
								}
								catch(_error)
								{
									console.log(_error);
								}
								break;
						}
						break;
				}
			}
			makeFrameOK();
		}
		catch(_error)
		{
			console.log(_error);
		}
	});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DATA CHECK
function checkTextFieldNumber(_textFieldValue)
{
	let numbers = /^[0-9]+$/;
	if(!_textFieldValue.match(numbers))
	{
		return false;
	}
	else
	{
		return true;
	}
}

async function checkSize()
{
	// console.log("checkSize()");
	
	// check if width or height are empty
	if(sizeWidthTF.value === "")
	{
		try
		{
			sizeWidthTF.focus();
			await openAlertDialog(pluginTitle, "Insert width.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(sizeHeightTF.value === "")
	{
		try
		{
			sizeHeightTF.focus();
			await openAlertDialog(pluginTitle, "Insert height.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if width or height contain numbers
	if(!checkTextFieldNumber(sizeWidthTF.value.toString()))
	{
		try
		{
			sizeWidthTF.focus();
			await openAlertDialog(pluginTitle, "Width must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(!checkTextFieldNumber(sizeHeightTF.value.toString()))
	{
		try
		{
			sizeHeightTF.focus();
			await openAlertDialog(pluginTitle, "Height must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if individual frame checkbox is unselected & compare frameWidth/frameHeight with selectionWidth/selectionHeight
	if(!individualFrame && settingsO["frameWidth"] < selectionWidth)
	{
		try
		{
			sizeWidthTF.focus();
			await openAlertDialog(pluginTitle, "Width must be at least " + Math.ceil(selectionWidth) + ".");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	// if(!individualFrame && frameHeight < selectionHeight)
	if(!individualFrame && settingsO["frameHeight"] < selectionHeight)
	{
		try
		{
			sizeHeightTF.focus();
			await openAlertDialog(pluginTitle, "Height must be at least " + Math.ceil(selectionHeight) + ".");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if individual frame checkbox is selected & compare frameWidth/frameHeight with minWidth/minHeight
	if(individualFrame && settingsO["frameWidth"] < minWidth)
	{
		try
		{
			sizeWidthTF.focus();
			await openAlertDialog(pluginTitle, "Width must be at least " + Math.ceil(minWidth) + ".");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	// if(individualFrame && frameHeight < minHeight)
	if(individualFrame && settingsO["frameHeight"] < minHeight)
	{
		try
		{
			sizeHeightTF.focus();
			await openAlertDialog(pluginTitle, "Height must be at least " + Math.ceil(minHeight) + ".");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	else
	{
		return true;
	}
}

async function checkPadding()
{
	// console.log("checkPadding()");
	
	// framePadding = Number(paddingTF.value);
	// console.log("paddingTF.value: " + paddingTF.value);
	// check if padding is empty
	if(paddingTF.value === "")
	{
		try
		{
			paddingTF.focus();
			await openAlertDialog(pluginTitle, "Insert padding.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if padding contains numbers
	if(!checkTextFieldNumber(paddingTF.value.toString()))
	{
		try
		{
			paddingTF.focus();
			await openAlertDialog(pluginTitle, "Padding must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	else
	{
		return true;
	}
}

async function checkPaddings()
{
	// console.log("checkPaddings()");
	
	// check if paddings are empty
	if(paddingTopTF.value === "")
	{
		try
		{
			paddingTopTF.focus();
			await openAlertDialog(pluginTitle, "Insert top padding.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(paddingRightTF.value === "")
	{
		try
		{
			paddingRightTF.focus();
			await openAlertDialog(pluginTitle, "Insert right padding.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(paddingBottomTF.value === "")
	{
		try
		{
			paddingBottomTF.focus();
			await openAlertDialog(pluginTitle, "Insert bottom padding.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(paddingLeftTF.value === "")
	{
		try
		{
			paddingLeftTF.focus();
			await openAlertDialog(pluginTitle, "Insert left padding.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// check if paddings contain numbers
	if(!checkTextFieldNumber(paddingTopTF.value.toString()))
	{
		try
		{
			await openAlertDialog(pluginTitle, "Top padding must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(!checkTextFieldNumber(paddingRightTF.value.toString()))
	{
		try
		{
			await openAlertDialog(pluginTitle, "Right padding must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(!checkTextFieldNumber(paddingBottomTF.value.toString()))
	{
		try
		{
			await openAlertDialog(pluginTitle, "Bottom padding must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(!checkTextFieldNumber(paddingLeftTF.value.toString()))
	{
		try
		{
			await openAlertDialog(pluginTitle, "Left padding must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	else
	{
		return true;
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - HELPERS
// - - - - - - - - - - - - - - - - - - - - UI
function createModule(_position, _title)
{
	let newModule = document.createElement("div");
	newModule.style.marginTop = 20;

	let separator = createSeparator();

	if(_position != "top")
	{
		newModule.appendChild(separator);
	}

	if(_title != "")
	{
		separator.style.marginBottom = 12;

		let titleLabel = createLabelMini(_title);
		titleLabel.style.marginBottom = 20;
		titleLabel.style.color = labelQuietColor;
		// titleLabel.style.letterSpacing = 1.3;
		newModule.appendChild(titleLabel);
	}
	else
	{
		separator.style.marginBottom = 16;
	}
	return newModule;
}

function createButton(_text, _variant, _quiet)
{
    let newButton = document.createElement("button");
    newButton.textContent = _text;
    newButton.setAttribute("uxp-variant", _variant);
	newButton.setAttribute("uxp-quiet", _quiet);
    return newButton;
}

function createTextInput(_placeholder, _width, _quiet)
{
    let newTextInput = document.createElement("input");
	newTextInput.style.width = _width;
	newTextInput.setAttribute("placeholder", _placeholder);
	newTextInput.setAttribute("uxp-quiet", _quiet);
    return newTextInput;
}

function createCheckBox(_text, _width, _checked)
{
    let newCheckBox = document.createElement("label");
	newCheckBox.style.display = "flex";
	newCheckBox.style.flexDirection = "row";
	newCheckBox.style.alignItems = "center";
	
	let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
	if (_checked)
	{
        checkBox.checked = true;
    }
	newCheckBox.appendChild(checkBox);
	
	let checkBoxLabel = createLabel(_text);
	checkBoxLabel.style.marginLeft = 6;
	checkBoxLabel.style.width = _width;
    newCheckBox.appendChild(checkBoxLabel);
	
    return newCheckBox;
}

function createLabel(_text)
{
	let newLabel = document.createElement("div");
	newLabel.style.textAlign = "left";
	newLabel.style.fontSize = labelFontSize;
	newLabel.style.color = labelColor;
	newLabel.textContent = _text;
	return newLabel;
}

function createLabelMini(_text)
{
	let newLabel = document.createElement("div");
	newLabel.style.textAlign = "left";
	newLabel.style.fontSize = labelFontSizeMini;
	newLabel.style.color = labelColor;
	newLabel.textContent = _text;
	return newLabel;
}

function createSeparator()
{
    let newSeparator = document.createElement("div");
    newSeparator.style.height = 1;
	newSeparator.style.background = separatorColor;
    return newSeparator;
}

function createColorCheckBox(_labelText, _width, _checked)
{
    let newColorCheckBox = document.createElement("div");
	newColorCheckBox.style.display = "flex";
	newColorCheckBox.style.flexDirection = "row";
	newColorCheckBox.style.alignItems = "center";
	
	let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
	if (_checked)
	{
        checkBox.checked = true;
    }
	newColorCheckBox.appendChild(checkBox);

	let colorB = document.createElement("div");
	colorB.style.width = 25;
	colorB.style.height = 13;
	colorB.style.marginLeft = 8;
	colorB.style.background = "#FF0000";
	colorB.style.borderRadius = 2;
	colorB.onclick = (e) => openColorPicker();
	newColorCheckBox.appendChild(colorB);

	let label = document.createElement("div");
	label.style.marginLeft = 9;
	label.style.width = _width;
	label.style.fontSize = labelFontSize;
	label.textContent = _labelText;
	label.onclick = (e) => openColorPicker();
    newColorCheckBox.appendChild(label);
	
    return newColorCheckBox;
}

function createColorButton(_color)
{
	let newColorB = document.createElement("div");
	newColorB.style.margin = 1;
	newColorB.style.display = "flex";
	newColorB.style.alignItems = "center";
	newColorB.style.justifyContent = "center";
	newColorB.style.width = 17; // 19; // 29;
	newColorB.style.height = 17; // 19; // 29;
	newColorB.style.border = "1px solid #F7F7F7";
	newColorB.style.borderRadius = 2;

	let colorSwatch = document.createElement("div");
	colorSwatch.style.width = 15; // 17; // 27;
	colorSwatch.style.height = 15; // 17; // 27;
	colorSwatch.style.borderRadius = 2;
	colorSwatch.style.background = _color;
	colorSwatch.setAttribute("title", _color);
	newColorB.appendChild(colorSwatch);

	if(colorIsLight(_color))
	{
		// console.log(_color + " is light - add border");
		colorSwatch.style.border = "1px solid #DDDDDD";
	}

	return newColorB;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS
async function setDefaultSettings()
{
	// console.log("setDefaultSettings()");

	try
	{
		// console.log("\tget data folder");
		dataFolder = await localFileSystem.getDataFolder();
		
		try
		{
			// console.log("\tget settings file");
			settingsFile = await dataFolder.getEntry("settings.json");
		}
		catch(_error)
		{
			// console.log(_error);
			// console.log("\t\tsettings file not found");
			try
			{
				// console.log("\t\tcreate settings.json");
				settingsFile = await dataFolder.createFile("settings.json", {overwrite: true});

				try
				{
					let defaultSettingsO = {};

					defaultSettingsO["shapeMode"] = "rectangle";
					defaultSettingsO["frameMode"] = "size";
					defaultSettingsO["paddingMode"] = "padding";
					defaultSettingsO["frameWidth"] = 100;
					defaultSettingsO["frameHeight"] = 100;
					defaultSettingsO["padding"] = 10;
					defaultSettingsO["paddingTop"] = 10;
					defaultSettingsO["paddingRight"] = 10;
					defaultSettingsO["paddingBottom"] = 10;
					defaultSettingsO["paddingRight"] = 10;
					defaultSettingsO["paddingLeft"] = 10;
					// defaultSettingsO["individualFrame"] = false;
					defaultSettingsO["fillFrame"] = true;
					defaultSettingsO["frameColor"] = "#FF0000";

					// set default settings
					// await settingsFile.write("{}", {append: false});
					await settingsFile.write(JSON.stringify(defaultSettingsO), {append: false});
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			catch(_error)
			{
				console.log(_error);
			}
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function getSettings()
{
	// console.log("getSettings()");

	let jsonSettings;
	try
	{
		// console.log("read settings file");
		jsonSettings = await settingsFile.read();
	}
	catch (_error)
	{
		console.log(_error);
	}
	settingsO = JSON.parse(jsonSettings);
	// console.log("settingsO:");
	// console.log(settingsO);	
}

async function saveSettings()
{
	// console.log("saveSettings()");

	// console.log(JSON.stringify(settingsO));

	try
	{
		await settingsFile.write(JSON.stringify(settingsO), {append: false});
	}
	catch (_error)
	{
		
	}	
}

function setShapeMode(_shapeMode)
{
	// console.log("setShapeMode(): " + _shapeMode);

	// warningMessage.style.visibility = "hidden";
	
	switch(_shapeMode)
	{
		case "rectangle":	
			rectangleB.onclick = (e) => "";
			circleB.onclick = (e) => setShapeMode("circle");
			rectangleB.style.background = activeBkgColor;
			circleB.style.background = lightBkgColor;

			paddingB.onclick = (e) => "";
			paddingsB.onclick = (e) => setPaddingMode("paddings");
			
			paddingIcon.src = "img/padding.png";
			paddingsIcon.src = "img/paddings.png";
			paddingsIcon.style.opacity = 1;
			
			paddingInput.style.display = "flex";
			paddingsInput.style.display = "none";

			break;
			
		case "circle":
			rectangleB.onclick = (e) => setShapeMode("rectangle");
			circleB.onclick = (e) => "";
			rectangleB.style.background = lightBkgColor;
			circleB.style.background = activeBkgColor;

			paddingB.onclick = (e) => "";
			paddingsB.onclick = (e) => "";
			paddingB.style.background = activeBkgColor;
			paddingsB.style.background = "transparent";
			paddingIcon.src = "img/padding.png";
			paddingsIcon.src = "img/paddings.png";
			paddingsIcon.style.opacity = .2;

			paddingInput.style.display = "flex";
			paddingsInput.style.display = "none";
			
			settingsO["paddingMode"] = "padding";
			break;
	}
	
	settingsO["shapeMode"] = _shapeMode;
}

function setFrameMode(_frameMode)
{
	// console.log("setFrameMode(): " + _frameMode);

	switch(_frameMode)
	{
		case "size":
			sizeModeB.onclick = (e) => "";
			paddingModeB.onclick = (e) => setFrameMode("padding");
			sizeModeB.style.background = activeBkgColor;
			paddingModeB.style.background = "transparent";

			sizeSettings.style.display = "flex";
			paddingSettings.style.display = "none";
			
			break;
			
		case "padding":
			sizeModeB.onclick = (e) => setFrameMode("size");
			paddingModeB.onclick = (e) => "";	
			sizeModeB.style.background = "transparent";
			paddingModeB.style.background = activeBkgColor;
		
			sizeSettings.style.display = "none";
			paddingSettings.style.display = "flex";
			
			break;
	}
	
	settingsO["frameMode"] = _frameMode;
}

function setPaddingMode(_paddingMode)
{
	// console.log("setPaddingMode(): " + _paddingMode);
	
	switch(_paddingMode)
	{
		case "padding":
			// console.log("* * * padding");
			paddingB.onclick = (e) => "";
			paddingsB.onclick = (e) => setPaddingMode("paddings");
			paddingB.style.background = activeBkgColor;
			paddingsB.style.background = "transparent";
			paddingsIcon.src = "img/paddings.png";

			paddingInput.style.display = "flex";
			paddingsInput.style.display = "none";
			break;
			
		case "paddings":
			// console.log("* * * paddings");
			paddingB.onclick = (e) => setPaddingMode("padding");
			paddingsB.onclick = (e) => "";
			paddingB.style.background = "transparent";
			paddingsB.style.background = activeBkgColor;

			paddingInput.style.display = "none";
			paddingsInput.style.display = "flex";
			break;
	}

	settingsO["paddingMode"] = _paddingMode;
}

function setFrameWidth()
{
	// if(checkTextFieldNumber(sizeWidthTF.value.toString()) || sizeWidthTF.value !== "")
	if(checkTextFieldNumber(sizeWidthTF.value.toString()) && sizeWidthTF.value >= 0)
	{
		settingsO["frameWidth"] = Number(sizeWidthTF.value);
	}
}

function setFrameHeight()
{
	// if(checkTextFieldNumber(sizeHeightTF.value.toString()) || sizeHeightTF.value !== "")
	if(checkTextFieldNumber(sizeHeightTF.value.toString()) && sizeHeightTF.value >= 0)
	{
		settingsO["frameHeight"] = Number(sizeHeightTF.value);
	}
}

function setPadding()
{
	// if(checkTextFieldNumber(paddingTF.value.toString()) || paddingTF.value !== "")
	if(checkTextFieldNumber(paddingTF.value.toString()) && paddingTF.value >= 0)
	{
		settingsO["padding"] = Number(paddingTF.value);
	}
}

function setPaddingTop()
{
	// if(checkTextFieldNumber(paddingTopTF.value.toString()) || paddingTopTF.value !== "")
	if(checkTextFieldNumber(paddingTopTF.value.toString()) && paddingTopTF.value >= 0)
	{
		settingsO["paddingTop"] = Number(paddingTopTF.value);
	}
}

function setPaddingRight()
{
	// if(checkTextFieldNumber(paddingRightTF.value.toString()) || paddingRightTF.value !== "")
	if(checkTextFieldNumber(paddingRightTF.value.toString()) && paddingRightTF.value >= 0)
	{
		settingsO["paddingRight"] = Number(paddingRightTF.value);
	}
}

function setPaddingBottom()
{
	// if(checkTextFieldNumber(paddingBottomTF.value.toString()) || paddingBottomTF.value !== "")
	if(checkTextFieldNumber(paddingBottomTF.value.toString()) && paddingBottomTF.value >= 0)
	{
		settingsO["paddingBottom"] = Number(paddingBottomTF.value);
	}
}

function setPaddingLeft()
{
	// if(checkTextFieldNumber(paddingLeftTF.value.toString()) || paddingLeftTF.value !== "")
	if(checkTextFieldNumber(paddingLeftTF.value.toString()) && paddingLeftTF.value >= 0)
	{
		settingsO["paddingLeft"] = Number(paddingLeftTF.value);
	}
}

function setIndividualFrame()
{
	if(selection.items.length > 1)
	{
		individualFrameCB.firstChild.disabled = false;
		individualFrameCB.firstChild.nextSibling.style.opacity = 1;
		multipleSelection = true;
	}
	else
	{
		individualFrameCB.firstChild.disabled = true;
		individualFrameCB.firstChild.nextSibling.style.opacity = .3;
		multipleSelection = false;
	}
}

function switchIndividualFrame()
{
	// console.log("switchIndividualFrame()");
	individualFrame = !individualFrame;
}

function switchFillFrame()
{
	// console.log("switchFillFrame()");
	settingsO["fillFrame"] = !settingsO["fillFrame"];
	// * * * saveSettings();
}

function openColorPicker()
{
	// console.log("createColorPicker()");

	if(colorPickerOpen == true)
	{
		closeColorPicker();
		return;
	}

	let colorPicker = document.createElement("div");
	colorPicker.style.margin = "16px auto 20px auto";

	assetsColorsA = assets.colors.get();

	// default colors
	let defaultColorsL = createLabel("Default Colors");
	defaultColorsL.style.marginBottom = 10;
	defaultColorsL.style.color = labelQuietColor;
	colorPicker.appendChild(defaultColorsL);

	let defaultColorsGroup = document.createElement("div");
	defaultColorsGroup.style.display = "flex";
	defaultColorsGroup.style.flexWrap = "wrap";
	defaultColorsGroup.style.flexDirection = "row";
	colorPicker.appendChild(defaultColorsGroup);

	for(let i = 0; i < defaultColorsA.length; i++)
	{
		let defaultColor = defaultColorsA[i];
		// console.log("default color " + i + ": ", defaultColor);

		let defaultColorB = createColorButton(defaultColor);
		defaultColorB.onclick = (e) => selectColor(defaultColor, defaultColorB);
		defaultColorsGroup.appendChild(defaultColorB);

		if(settingsO["frameColor"] == defaultColor)
		{
			// console.log("found current color in default colors");
			selectColor(settingsO["frameColor"], defaultColorB);
		}
	}

	// assets colors
	let assetsColorsL = createLabel("Assets Colors");
	assetsColorsL.style.margin = "20 0 10 0";
	assetsColorsL.style.color = labelQuietColor;
	colorPicker.appendChild(assetsColorsL);

	let assetsColorsGroup = document.createElement("div");
	assetsColorsGroup.style.display = "flex";
	assetsColorsGroup.style.flexWrap = "wrap";
	assetsColorsGroup.style.alignItems = "top";
	assetsColorsGroup.style.alignContent = "flex-start";
	colorPicker.appendChild(assetsColorsGroup);

	if(assetsColorsA.length == 0)
	{
		let noAssetsColorsL = createLabel("Add solid colors to the Assets Panel to show them here.");
		assetsColorsGroup.appendChild(noAssetsColorsL);
	}

	for(let i = 0; i < assetsColorsA.length; i++)
	{
		// exclude gradients... for now
		if(assetsColorsA[i].gradientType == undefined)
		{
			let assetsColor = assetsColorsA[i].color.toHex().toUpperCase();
			// console.log("assets color " + i + ": ", assetsColor);

			// if hex is a shorthand
			if(assetsColor.length < 7)
			{
				// console.log("found shorthand");
				assetsColor = getHexFromShorthand(assetsColor);
				// console.log("shorthand color: " + assetsColor);
			}

			let assetsColorB = createColorButton(assetsColor);
			assetsColorB.onclick = (e) => selectColor(assetsColor, assetsColorB);
			assetsColorsGroup.appendChild(assetsColorB);
			
			if(settingsO["frameColor"] == assetsColor)
			{
				// console.log("found current color in assets colors");
				selectColor(settingsO["frameColor"], assetsColorB);
			}
		}
	}

	colorPickerContainer.appendChild(colorPicker);
	colorPickerOpen = true;
}

function closeColorPicker()
{
	// console.log("closeColorPicker()");

	colorPickerContainer.firstChild.remove();
	colorPickerOpen = false;
}

function colorIsLight(_color)
{
	// console.log("colorIsLight()");

	// start from 1 to trim octothorpe
	let red = parseInt(_color.substr(1, 2), 16);
	let green = parseInt(_color.substr(3, 2), 16);
	let blue = parseInt(_color.substr(5, 2), 16);
	let brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;	
	return brightness > 200;
}

function getHexFromShorthand(_hexShorthand)
{
	// console.log("getHexFromShorthand()");

	let stringA = _hexShorthand.split("");
	let hexString = "#";
	// start from 1 to trim octothorpe
	for(let i = 1; i < stringA.length; i++)
	{
		hexString += stringA[i] + stringA[i]
	}
	// console.log("hexString: " + hexString);
	return hexString;
}

function selectColor(_color, _colorButton)
{
	// console.log("selectColor()");
	// console.log(_color);

	if(selectedColorButton != undefined)
	{
		selectedColorButton.style.borderColor = "#F7F7F7";
		selectedColorButton.firstChild.style.width = 15; // 27;
		selectedColorButton.firstChild.style.height = 15; // 27;
	}

	_colorButton.style.borderColor = activeColor;
	_colorButton.firstChild.style.width = 11; // 13; // 21;
	_colorButton.firstChild.style.height = 11; // 13; // 21;
	selectedColorButton = _colorButton;
	// selectedColor = _color;
	
	if(colorPickerOpen == true)
	{
		closeColorPicker();
	}

	fillFrameCB.firstChild.nextSibling.style.background = _color;
	if(colorIsLight(_color))
	{
		// console.log("color is light");
		fillFrameCB.firstChild.nextSibling.style.border = "1px solid #DDDDDD";
	}
	else
	{
		fillFrameCB.firstChild.nextSibling.style.border = "none";
	}

	settingsO["frameColor"] = _color;
}

function setFrameColor(_frame)
{
	// console.log("setFrameColor()");

	_frame.fill = new Color(settingsO["frameColor"]);
	
	if(settingsO["fillFrame"] == false)
	{
		_frame.fillEnabled = false;
	}
	_frame.stroke = new Color("#000000", 1);
	_frame.strokeEnabled = false;
}

function roundGroupCoordinates()
{
	// console.log("roundGroupCoordinates()");

	// move group to rounded coordinates
	let groupTopLeft = selection.items[0].topLeftInParent;
	let groupX = groupTopLeft.x;
	let groupY = groupTopLeft.y;	
	selection.items[0].placeInParentCoordinates(groupTopLeft, {x: Math.round(groupX), y: Math.round(groupY)});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK FUNCTIONS
function makeFrameOK()
{
	// console.log("makeFrameOK()");
		
	switch(settingsO["frameMode"])
	{
		case "size":
			if(!individualFrame)
			{
				makeFrameBySizeOnce();
			}
			else
			{
				makeFrameBySizeIndividually();
			}
			break;
		
		case "padding":
			// switch(paddingMode)
			switch(settingsO["paddingMode"])
			{
				case "padding":
					if(!individualFrame)
					{
						makeFrameByPaddingOnce();
					}
					else
					{
						makeFrameByPaddingIndividually();
					}
					break;
					
				case "paddings":
					if(!individualFrame)
					{
						makeFrameByPaddingsOnce();
					}
					else
					{
						makeFrameByPaddingsIndividually();
					}
					break;
			}
			break;
	}
}

function makeFrameBySizeOnce()
{
	// console.log("makeFrameBySizeOnce()");

	if (multipleSelection)
	{
		commands.group();
	}
	
	let selectedObjects = selection.items[0];
	
	let frame;
	
	if(settingsO["shapeMode"] == "rectangle")
	{
		frame = new Rectangle();
		frame.width = settingsO["frameWidth"];
		frame.height = settingsO["frameHeight"];
	}
	if(settingsO["shapeMode"] == "circle")
	{
		frame = new Ellipse();
		frame.radiusX = settingsO["frameWidth"] / 2;
		frame.radiusY = settingsO["frameHeight"] / 2;
	}
	
	setFrameColor(frame);
	
	selection.insertionParent.addChild(frame);
	
	// select frame and send to back
	selection.items = [frame];
	commands.sendToBack();

	// frame local registration point
	let frameTopLeft = {x: 0, y: 0};
	// frame offsets for centering frame around object
	let frameOffsetX = (settingsO["frameWidth"] - selectionWidth) / 2;
	let frameOffsetY = (settingsO["frameHeight"] - selectionHeight) / 2;
	/* let frameOffsetX = (frameWidth - selectionWidth) / 2;
	let frameOffsetY = (frameHeight - selectionHeight) / 2; */
	// frame coordinates
	let frameX = selectionX - frameOffsetX;
	let frameY = selectionY - frameOffsetY;
	
	// center frame to selected object
	frame.placeInParentCoordinates(frameTopLeft, {x: frameX, y: frameY});
	
	// select both frame and objects then group them
	selection.items = [frame, selectedObjects];
	
	commands.group();
	
	// round X/Y (in case of decimals)
	roundGroupCoordinates();
}

function makeFrameBySizeIndividually()
{
	// console.log("\nmakeFrameBySizeIndividually()");
	
	selection.items.forEach(function (childNode, i)
	{
		let childNodeBounds = childNode.boundsInParent;
		let childNodeWidth = childNodeBounds.width;
		let childNodeHeight = childNodeBounds.height;
		let childNodeX = childNodeBounds.x;
		let childNodeY = childNodeBounds.y;
		
		let frame;
	
		if(settingsO["shapeMode"] == "rectangle")
		{
			frame = new Rectangle();
			frame.width = settingsO["frameWidth"];
			frame.height = settingsO["frameHeight"];
		}
		if(settingsO["shapeMode"] == "circle")
		{
			frame = new Ellipse();
			frame.radiusX = settingsO["frameWidth"] / 2;
			frame.radiusY = settingsO["frameHeight"] / 2;
		}

		setFrameColor(frame);

		selection.insertionParent.addChild(frame);

		// select frame and send to back
		selection.items = [frame];
		commands.sendToBack();

		// frame local registration point
		let frameTopLeft = {x: 0, y: 0};
		// frame offsets for centering frame around object
		let frameOffsetX = (settingsO["frameWidth"] - childNodeWidth) / 2;
		let frameOffsetY = (settingsO["frameHeight"] - childNodeHeight) / 2;
		// frame coordinates
		let frameX = childNodeX - frameOffsetX;
		let frameY = childNodeY - frameOffsetY;

		// center frame to selected object
		frame.placeInParentCoordinates(frameTopLeft, {x: frameX, y: frameY});

		// select both frame and object then group them
		selection.items = [frame, childNode];
		commands.group();

		// round X/Y
		roundGroupCoordinates();
	});
}

function makeFrameByPaddingOnce()
{
	// console.log("\nmakeFrameByPaddingOnce()");
	
	if (multipleSelection)
	{
		commands.group();
	}
	
	let selectedObjects = selection.items[0];
	
	let frame;
	
	if(settingsO["shapeMode"] == "rectangle")
	{
		frame = new Rectangle();
		frame.width = selectionWidth + (settingsO["padding"] * 2);
		frame.height = selectionHeight + (settingsO["padding"] * 2);
	}
	if(settingsO["shapeMode"] == "circle")
	{
		let maxSize = Math.max(selectionWidth, selectionHeight);
		frame = new Ellipse();
		frame.radiusX = (maxSize + (settingsO["padding"] * 2)) / 2;
		frame.radiusY = frame.radiusX;
	}

	setFrameColor(frame);

	selection.insertionParent.addChild(frame);
	
	// select frame and send to back
	selection.items = [frame];
	commands.sendToBack();
	
	// frame local registration point
	let frameTopLeft = {x: 0, y: 0};
	let frameX;
	let frameY; 
	
	if(settingsO["shapeMode"] == "rectangle")
	{
		// frame coordinates
		frameX = selectionX - settingsO["padding"];
		frameY = selectionY - settingsO["padding"];
	}
	
	if(settingsO["shapeMode"] == "circle")
	{
		frameX = (selectionX + (selectionWidth / 2)) - frame.radiusX;
		frameY = (selectionY + (selectionHeight / 2)) - frame.radiusY;
	}
	
	frame.placeInParentCoordinates(frameTopLeft, {x: frameX, y: frameY});
	
	// select both frame and objects then group them
	selection.items = [frame, selectedObjects];
	commands.group();
	
	roundGroupCoordinates();
}

function makeFrameByPaddingIndividually()
{
	// console.log("\nmakeFrameByPaddingIndividually()");
	
	selection.items.forEach(function (childNode, i)
	{
		let childNodeBounds = childNode.boundsInParent;
		let childNodeWidth = childNodeBounds.width;
		let childNodeHeight = childNodeBounds.height;
		let childNodeX = childNodeBounds.x;
		let childNodeY = childNodeBounds.y;
		
		let frame;
		
		if(settingsO["shapeMode"] == "rectangle")
		{
			frame = new Rectangle();
			frame.width = childNodeWidth + (settingsO["padding"] * 2);
			frame.height = childNodeHeight + (settingsO["padding"] * 2);
		}
		if(settingsO["shapeMode"] == "circle")
		{
			let maxSize = Math.max(childNodeWidth, childNodeHeight);
			frame = new Ellipse();
			frame.radiusX = (maxSize + (settingsO["padding"] * 2)) / 2;
			frame.radiusY = frame.radiusX;
		}

		setFrameColor(frame);

		selection.insertionParent.addChild(frame);
		
		// select frame and send to back
		selection.items = [frame];
		commands.sendToBack();

		// frame local registration point
		let frameTopLeft = {x: 0, y: 0};
		let frameX;
		let frameY; 

		if(settingsO["shapeMode"] == "rectangle")
		{
			// frame coordinates
			frameX = childNodeX - settingsO["padding"];
			frameY = childNodeY - settingsO["padding"];
		}

		if(settingsO["shapeMode"] == "circle")
		{
			frameX = (childNodeX + (childNodeWidth / 2)) - frame.radiusX;
			frameY = (childNodeY + (childNodeHeight / 2)) - frame.radiusY;
		}

		frame.placeInParentCoordinates(frameTopLeft, {x: frameX, y: frameY});

		// select both frame and objects then group them
		selection.items = [frame, childNode];
		
		commands.group();

		roundGroupCoordinates();
	});
}

function makeFrameByPaddingsOnce()
{
	// console.log("\nmakeFrameByPaddingsOnce()");
	
	if (multipleSelection)
	{
		commands.group();
	}
	
	let selectedObjects = selection.items[0];
	
	let frame = new Rectangle();
	frame.width = selectionWidth + settingsO["paddingLeft"] + settingsO["paddingRight"];
	frame.height = selectionHeight + settingsO["paddingTop"] + settingsO["paddingBottom"];

	setFrameColor(frame);

	selection.insertionParent.addChild(frame);
	
	// select frame and send to back
	selection.items = [frame];
	commands.sendToBack();
	
	// frame local registration point
	let frameTopLeft = {x: 0, y: 0};
	
	// frame coordinates
	let frameX = selectionX - settingsO["paddingLeft"];
	let frameY = selectionY - settingsO["paddingTop"];
	
	frame.placeInParentCoordinates(frameTopLeft, {x: frameX, y: frameY});
	
	// select both frame and object then group them
	selection.items = [frame, selectedObjects];
	commands.group();
	
	roundGroupCoordinates();
}

function makeFrameByPaddingsIndividually()
{
	// console.log("\nmakeFrameByPaddingsIndividually()");
	
	selection.items.forEach(function (childNode, i)
	{
		let childNodeBounds = childNode.boundsInParent;
		let childNodeWidth = childNodeBounds.width;
		let childNodeHeight = childNodeBounds.height;
		let childNodeX = childNodeBounds.x;
		let childNodeY = childNodeBounds.y;
	
		let frame = new Rectangle();
		frame.width = childNodeWidth + settingsO["paddingLeft"] + settingsO["paddingRight"];
		frame.height = childNodeHeight + settingsO["paddingTop"] + settingsO["paddingBottom"];

		setFrameColor(frame);

		selection.insertionParent.addChild(frame);

		// select frame and send to back
		selection.items = [frame];
		commands.sendToBack();

		// frame local registration point
		let frameTopLeft = {x: 0, y: 0};

		// frame coordinates
		let frameX = childNodeX - settingsO["paddingLeft"];
		let frameY = childNodeY - settingsO["paddingTop"];

		frame.placeInParentCoordinates(frameTopLeft, {x: frameX, y: frameY});

		// select both frame and object then group them
		selection.items = [frame, childNode];
		commands.group();

		roundGroupCoordinates();
	});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels:
	{
		FrameMaker: {show, hide, update}
	}
};







