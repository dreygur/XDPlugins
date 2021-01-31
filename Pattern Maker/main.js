const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const platform = require("os").platform();
const {editDocument} = require("application");
const application = require("application");
const localFileSystem = require("uxp").storage.localFileSystem;
const commands = require("commands");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var dataFolder;
var settingsFile;
var settingsO;

var pluginTitle = "Pattern Maker";

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

var artboard;
var artboardWidth;
var artboardHeight;

var selectedObject;
var selectedObjectBounds;
var selectedObjectWidth;
var selectedObjectHeight;

var multipleSelection = false;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PATTERN MODE MODULE
var patternModeModule = createModule("top", "PATTERN MODE");
patternModeModule.style.marginTop = 0;
container.appendChild(patternModeModule);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PATTERN MODE MENU
var patternModeMenu = document.createElement("div");
patternModeMenu.style.display = "flex";
patternModeMenu.style.flexDirection = "row";
// patternModeMenu.style.margin = "0px auto 20px auto";
// patternModeMenu.style.width = 132; // 40;
patternModeMenu.style.flexGrow = 1;
patternModeMenu.style.height = 24; // 30; // 40;
patternModeMenu.style.background = lightBkgColor;
patternModeMenu.style.border = "1px solid";
patternModeMenu.style.borderColor = separatorColor;
patternModeMenu.style.borderRadius = 4;
patternModeModule.appendChild(patternModeMenu);

// - - - - - - - - - - - - - - - - - - - - SEAMLESS BUTTON
var seamlessB = document.createElement("div");
seamlessB.style.display = "flex";
seamlessB.style.alignItems = "center";
seamlessB.style.justifyContent = "center";
// seamlessB.style.width = 66; // 143;
seamlessB.style.flexGrow = 1;
seamlessB.style.background = activeBkgColor;
seamlessB.style.borderRadius = "4px 0px 0px 4px";
seamlessB.setAttribute("title", "Seamless");
patternModeMenu.appendChild(seamlessB);

var seamlessIcon = document.createElement("img");
seamlessIcon.src = "img/seamless.png";
seamlessB.appendChild(seamlessIcon);

// - - - - - - - - - - - - - - - - - - - - GRID BUTTON
var gridB = document.createElement("div");
gridB.style.display = "flex";
gridB.style.alignItems = "center";
gridB.style.justifyContent = "center";
// gridB.style.width = 66; // 143;
gridB.style.flexGrow = 1;
gridB.style.borderRadius = "0px 4px 4px 0px";
gridB.setAttribute("title", "Grid");
patternModeMenu.appendChild(gridB);

var gridIcon = document.createElement("img");
gridIcon.src = "img/grid.png";
gridB.appendChild(gridIcon);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OPTIONS MODULE
var optionsModule = createModule("internal", "OPTIONS");
container.appendChild(optionsModule);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SEAMLESS SETTINGS
var seamlessSettings = document.createElement("div");
seamlessSettings.style.display = "flex";
seamlessSettings.style.flexWrap = "wrap";
optionsModule.appendChild(seamlessSettings);

var seamlessColumnsGroup = document.createElement("div");
seamlessColumnsGroup.style.marginRight = 16;
seamlessColumnsGroup.style.display = "flex";
seamlessColumnsGroup.style.flexDirection = "row";
seamlessColumnsGroup.style.alignItems = "center";
seamlessSettings.appendChild(seamlessColumnsGroup);

var seamlessColumnsL = createLabel("Columns");
seamlessColumnsL.style.color = labelQuietColor;
seamlessColumnsGroup.appendChild(seamlessColumnsL);

var seamlessColumnsTF = createTextInput("", 36, true);
seamlessColumnsTF.type = "number";
seamlessColumnsTF.min = 3;
seamlessColumnsTF.oninput = (e) => setSeamlessColumns();
seamlessColumnsGroup.appendChild(seamlessColumnsTF);

var seamlessRowsGroup = document.createElement("div");
seamlessRowsGroup.style.display = "flex";
seamlessRowsGroup.style.flexDirection = "row";
seamlessRowsGroup.style.alignItems = "center";
seamlessSettings.appendChild(seamlessRowsGroup);

var seamlessRowsL = createLabel("Rows");
seamlessRowsL.style.color = labelQuietColor;
seamlessRowsGroup.appendChild(seamlessRowsL);

var seamlessRowsTF = createTextInput("", 36, true);
seamlessRowsTF.type = "number";
seamlessRowsTF.min = 3;
seamlessRowsTF.oninput = (e) => setSeamlessRows();
seamlessRowsGroup.appendChild(seamlessRowsTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GRID SETTINGS
var gridSettings = document.createElement("div");
gridSettings.style.display = "flex";
gridSettings.style.flexWrap = "wrap";
gridSettings.style.display = "none";
optionsModule.appendChild(gridSettings);

var gridColumnsGroup = document.createElement("div");
gridColumnsGroup.style.marginRight = 16;
gridColumnsGroup.style.display = "flex";
gridColumnsGroup.style.flexDirection = "row";
gridColumnsGroup.style.alignItems = "center";
gridSettings.appendChild(gridColumnsGroup);

var gridColumnsL = createLabel("Columns");
gridColumnsL.style.color = labelQuietColor;
gridColumnsGroup.appendChild(gridColumnsL);

var gridColumnsTF = createTextInput("", 36, true);
gridColumnsTF.type = "number";
gridColumnsTF.min = 1;
gridColumnsTF.oninput = (e) => setGridColumns();
gridColumnsGroup.appendChild(gridColumnsTF);

var gridRowsGroup = document.createElement("div");
gridRowsGroup.style.marginRight = 16;
gridRowsGroup.style.display = "flex";
gridRowsGroup.style.flexDirection = "row";
gridRowsGroup.style.alignItems = "center";
gridSettings.appendChild(gridRowsGroup);

var gridRowsL = createLabel("Rows");
gridRowsL.style.color = labelQuietColor;
gridRowsGroup.appendChild(gridRowsL);

var gridRowsTF = createTextInput("", 36, true);
gridRowsTF.type = "number";
gridRowsTF.min = 1;
gridRowsTF.oninput = (e) => setGridRows();
gridRowsGroup.appendChild(gridRowsTF);

var gridPaddingGroup = document.createElement("div");
gridPaddingGroup.style.display = "flex";
gridPaddingGroup.style.flexDirection = "row";
gridPaddingGroup.style.alignItems = "center";
gridSettings.appendChild(gridPaddingGroup);

var gridPaddingL = createLabel("Padding");
gridPaddingL.style.color = labelQuietColor;
gridPaddingGroup.appendChild(gridPaddingL);

var gridPaddingTF = createTextInput("", 36, true);
gridPaddingTF.type = "number";
gridPaddingTF.min = 0;
gridPaddingTF.oninput = (e) => setGridPadding();
gridPaddingGroup.appendChild(gridPaddingTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var bottomSeparator = createSeparator();
bottomSeparator.style.marginTop = 14;
container.appendChild(bottomSeparator);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FOOTER
var footer = document.createElement("footer");
// footer.style.justifyContent = "center";
// footer.style.marginTop = 30;
container.appendChild(footer);

var okB = createButton("Make Pattern", "cta");
okB.id = "makePattern";
okB.onclick = (e) => validatePanel(e);
footer.appendChild(okB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - WARNING
var warningBox = document.createElement("div");
warningBox.style.marginTop = 10;
warningBox.style.display = "flex";
warningBox.style.justifyContent = "center";
container.appendChild(warningBox);

var warningMessage = document.createElement("div");
warningMessage.style.color = errorColor;
warningMessage.style.visibility = "hidden";
warningMessage.style.fontSize = labelFontSize;
warningMessage.style.lineHeight = "15px";
warningMessage.textContent = "Warning Message";
warningBox.appendChild(warningMessage);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
async function show(_e)
{
	console.log("show()");
	// console.log(_e.node.nodeName);

	try
	{
		await init();
	}
	catch(_error)
	{
		console.log(_error);
	}
	
	_e.node.appendChild(container);
}

async function hide(_e)
{
	console.log("hide()");
	// console.log(_e.node.nodeName);

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

	setPatternMode(settingsO["patternMode"]);

	seamlessColumnsTF.value = settingsO["seamlessColumns"];
	seamlessRowsTF.value = settingsO["seamlessRows"];

	gridColumnsTF.value = settingsO["gridColumns"];
	gridRowsTF.value = settingsO["gridRows"];
	gridPaddingTF.value = settingsO["gridPadding"];
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{	
	console.log("checkSelection()");
	
	let alertDialogMessage = "Select an object inside an Artboard, excluding objects inside Repeat Grids, Symbols, groups or Pasteboard.";

	// if there is no selection OR selection is an artboard
	if(selection.items.length == 0 || selection.items[0].constructor.name == "Artboard")
	{
		// displayWarning(alertDialogMessage);
		try
		{
			await openAlertDialog(pluginTitle, alertDialogMessage);
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// if selected object is not inside an artboard
	if(selection.items[0].parent.constructor.name != "Artboard")
	{
		// displayWarning(alertDialogMessage);
		try
		{
			await openAlertDialog(pluginTitle, alertDialogMessage);
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// if there is a selection
	if(selection.items.length > 0)
	{
		// if selected object is inside a group
		if(selection.items[0].parent.constructor.name == "Group")
		{
			// displayWarning(alertDialogMessage);
			try
			{
				await openAlertDialog(pluginTitle, alertDialogMessage);
			}
			catch(_error)
			{
				console.log(_error);
			}
			return false;
		}
	}

	// if there are 2 or more selected objects
	if(selection.items.length > 1)
	{
		multipleSelection = true;
	}

	// get the first selected object's container
	let firstObjectParent = selection.items[0].parent;
	// console.log("firstSelectedObjectParentName: " + firstObjectParent);

	for(let i = 0; i < selection.items.length; i++)
	{
		// check if other selected objects are inside different artboards
		if(selection.items[i].parent != firstObjectParent)
		{
			// displayWarning("Make sure selected objects are all in the same Artboard.");
			try
			{
				await openAlertDialog(pluginTitle, "Make sure selected objects are all in the same Artboard.");
			}
			catch(_error)
			{
				console.log(_error);
			}
			return false;
		}
	}

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
	
	// _e.preventDefault();

	editDocument({editLabel: "Make Pattern"}, async() =>
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
				// switch(patternMode)
				switch(settingsO["patternMode"])
				{
					case "seamless":
						try
						{
							let s = await checkSeamlessSettings();
							// alertDialog.close("Replace");
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

					case "grid":
						try
						{
							let s = await checkGridSettings();
							// alertDialog.close("Replace");
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
				}
			}
			makePatternOK();
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

async function checkSeamlessSettings()
{
	console.log("checkSeamlessSettings()");
	
	// check if columns or rows are empty
	if(seamlessColumnsTF.value === "")
	{
		// displayWarning("Insert columns.");
		try
		{
			seamlessColumnsTF.focus();
			await openAlertDialog(pluginTitle, "Insert columns.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(seamlessRowsTF.value === "")
	{
		// displayWarning("Insert rows.");
		try
		{
			seamlessRowsTF.focus();
			await openAlertDialog(pluginTitle, "Insert rows.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// check if columns or rows are less than 3
	if(seamlessColumnsTF.value < 3)
	{
		// displayWarning("Columns must be at least 3.");
		try
		{
			seamlessColumnsTF.focus();
			await openAlertDialog(pluginTitle, "Columns must be at least 3.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(seamlessRowsTF.value < 3)
	{
		// displayWarning("Rows must be at least 3.");
		try
		{
			seamlessRowsTF.focus();
			await openAlertDialog(pluginTitle, "Rows must be at least 3.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// check if rows is an even number
	if(seamlessRowsTF.value % 2 == 0)
	{
		// displayWarning("Rows must be an odd number.");
		try
		{
			seamlessRowsTF.focus();
			await openAlertDialog(pluginTitle, "Rows must be an odd number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if columns or rows contain numbers
	if(!checkTextFieldNumber(seamlessColumnsTF.value.toString()))
	{
		try
		{
			seamlessColumnsTF.focus();
			await openAlertDialog(pluginTitle, "Columns must be an integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(!checkTextFieldNumber(seamlessRowsTF.value.toString()))
	{
		try
		{
			seamlessRowsTF.focus();
			await openAlertDialog(pluginTitle, "Rows must be an integer number.");
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

async function checkGridSettings()
{
	console.log("checkGridSettings()");

	/* gridColumns = Number(gridColumnsTF.value);
	gridRows = Number(gridRowsTF.value);
	gridPadding = Number(gridPaddingTF.value); */
	
	// check if columns or rows are empty
	if(gridColumnsTF.value === "")
	{
		try
		{
			gridColumnsTF.focus();
			await openAlertDialog(pluginTitle, "Insert columns.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(gridRowsTF.value === "")
	{
		try
		{
			gridRowsTF.focus();
			await openAlertDialog(pluginTitle, "Insert rows.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(gridPaddingTF.value === "")
	{
		try
		{
			gridPaddingTF.focus();
			await openAlertDialog(pluginTitle, "Insert padding.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// check if columns or rows are 0
	if(gridColumnsTF.value == 0)
	{
		try
		{
			gridColumnsTF.focus();
			await openAlertDialog(pluginTitle, "Columns must be at least 1.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(gridRowsTF.value == 0)
	{
		try
		{
			gridRowsTF.focus();
			await openAlertDialog(pluginTitle, "Rows must be at least 1.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(gridColumnsTF.value == 1 && gridRowsTF.value == 1)
	{
		// displayWarning("1x1 grids are not allowed.");
		try
		{
			gridColumnsTF.focus();
			await openAlertDialog(pluginTitle, "1x1 grids are not allowed.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if columns or rows contain numbers
	if(!checkTextFieldNumber(gridColumnsTF.value.toString()))
	{
		// displayWarning("Columns must be an integer number.");
		try
		{
			gridColumnsTF.focus();
			await openAlertDialog(pluginTitle, "Columns must be an integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(!checkTextFieldNumber(gridRowsTF.value.toString()))
	{
		// displayWarning("Rows must be an integer number.");
		try
		{
			gridRowsTF.focus();
			await openAlertDialog(pluginTitle, "Rows must be an integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	if(!checkTextFieldNumber(gridPaddingTF.value.toString()))
	{
		// displayWarning("Padding must be an integer number.");
		try
		{
			gridPaddingTF.focus();
			await openAlertDialog(pluginTitle, "Padding must be an integer number.");
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS
function platformIsMac()
{
	if(platform == "darwin")
	{
		return true;
	}
	else
	{
		return false;
	}
}

async function setDefaultSettings()
{
	console.log("setDefaultSettings()");
	// console.log("renditionsA: ", renditionsA);
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

					defaultSettingsO["patternMode"] = "seamless";
					defaultSettingsO["seamlessColumns"] = 3;
					defaultSettingsO["seamlessRows"] = 3;

					defaultSettingsO["gridColumns"] = 3;
					defaultSettingsO["gridRows"] = 3;
					defaultSettingsO["gridPadding"] = 10;

					// set default settings
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
	console.log("getSettings()");
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
	console.log("saveSettings()");
	// console.log(JSON.stringify(settingsO));

	try
	{
		// console.log("\twrite settings");
		await settingsFile.write(JSON.stringify(settingsO), {append: false});
	}
	catch (_error)
	{
		
	}	
}

function setPatternMode(_patternMode)
{
	// console.log("setPatternMode(): " + _patternMode);

	warningMessage.style.visibility = "hidden";
	
	switch(_patternMode)
	{
		case "seamless":
			seamlessB.onclick = (e) => "";
			gridB.onclick = (e) => setPatternMode("grid");
			seamlessB.style.background = activeBkgColor;
			gridB.style.background = lightBkgColor;
			/* seamlessIcon.src = "img/seamless_on.png";
			gridIcon.src = "img/grid_off.png"; */
			// seamlessB.style.color = activeColor;
			// gridB.style.color = inactiveColor;

			seamlessSettings.style.display = "flex";
			gridSettings.style.display = "none";
			
			// patternMode = "seamless";
			break;
			
		case "grid":
			seamlessB.onclick = (e) => setPatternMode("seamless");
			gridB.onclick = (e) => "";
			seamlessB.style.background = lightBkgColor;
			gridB.style.background = activeBkgColor;
			/* seamlessIcon.src = "img/seamless_off.png";
			gridIcon.src = "img/grid_on.png"; */
			// seamlessB.style.color = inactiveColor;
			// gridB.style.color = activeColor;
		
			seamlessSettings.style.display = "none";
			gridSettings.style.display = "flex";
			
			// patternMode = "grid";	
			break;
	}

	settingsO["patternMode"] = _patternMode;
	// * * * saveSettings();
}

function setSeamlessColumns()
{
	if(checkTextFieldNumber(seamlessColumnsTF.value.toString()) && seamlessColumnsTF.value >= 0)
	{
		settingsO["seamlessColumns"] = Number(seamlessColumnsTF.value);
		// * * * saveSettings();
	}
}

function setSeamlessRows()
{
	if(checkTextFieldNumber(seamlessRowsTF.value.toString()) && seamlessRowsTF.value >= 0)
	{
		settingsO["seamlessRows"] = Number(seamlessRowsTF.value);
		// * * * saveSettings();
	}
}

function setGridColumns()
{
	if(checkTextFieldNumber(gridColumnsTF.value.toString()) && gridColumnsTF.value >= 0)
	{
		settingsO["gridColumns"] = Number(gridColumnsTF.value);
		// * * * saveSettings();
	}
}

function setGridRows()
{
	if(checkTextFieldNumber(gridRowsTF.value.toString()) && gridRowsTF.value >= 0)
	{
		settingsO["gridRows"] = Number(gridRowsTF.value);
		// * * * saveSettings();
	}
}

function setGridPadding()
{
	if(checkTextFieldNumber(gridPaddingTF.value.toString()) && gridPaddingTF.value >= 0)
	{
		settingsO["gridPadding"] = Number(gridPaddingTF.value);
		// * * * saveSettings();
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK ACTIONS
function makePatternOK()
{
	console.log("makePatternOK()");
	warningMessage.style.visibility = "hidden";

	if (multipleSelection)
	{
		commands.group();
	}
	
	artboard = selection.focusedArtboard;
	artboardWidth = artboard.width;
	artboardHeight = artboard.height;

	selectedObject = selection.items[0];
	selectedObjectBounds = selectedObject.localBounds;
	selectedObjectWidth = selectedObjectBounds.width;
	selectedObjectHeight = selectedObjectBounds.height;

	/* console.log("globalBounds: ", selectedObject.globalBounds);
	console.log("localBounds: ", selectedObject.localBounds);
	console.log("boundsInParent: ", selectedObject.boundsInParent);
	console.log("topLeftInParent: ", selectedObject.topLeftInParent);
	console.log("localCenterPoint: ", selectedObject.localCenterPoint);
	console.log("globalDrawBounds: ", selectedObject.globalDrawBounds); */

	// switch(patternMode)
	switch(settingsO["patternMode"])
	{
		case "seamless":
			makeSeamlessPattern();
			break;
			
		case "grid":
			makeGridPattern();
			break;
	}
}

function makeSeamlessPattern()
{
	// console.log("makeSeamlessPattern()");

	// store all pattern positions
	let patternPositionsA = [];

	/* console.log("artboardWidth: " + artboardWidth);
	console.log("artboardHeight: " + artboardHeight);
	console.log("seamlessColumns: " + settingsO["seamlessColumns"]);
	console.log("seamlessRows: " + settingsO["seamlessRows"]); */

	let stepX = artboardWidth / (settingsO["seamlessColumns"] - 1);
	let stepY = artboardHeight / (settingsO["seamlessRows"] - 1);
	/* console.log("stepX " + stepX);
	console.log("stepY " + stepY); */

	let columns;
	let objectX;
	let objectY;

	for(let i = 0; i < settingsO["seamlessRows"]; i++)
	{
		// console.log("row " + i);

		objectY = i * stepY;
		
		// even row
		if (i % 2 == 0)
		{
			columns = settingsO["seamlessColumns"];
			// console.log("even row: " + columns + " elements");
		}
		// odd row
		else
		{
			columns = settingsO["seamlessColumns"] - 1;
			// console.log("odd row: " + columns + " elements");
		}

		for (let j = 0; j < columns; j++)
		{
			// console.log("\tcolumn " + j);

			// even row
			if(i % 2 == 0)
			{
				objectX = j * stepX;
			}
			// odd row
			else
			{
				objectX = (stepX / 2) + (stepX * j);
			}
			let patternPositionObj =
			{
				"x": objectX,
				"y": objectY
			}
			patternPositionsA.push(patternPositionObj);
		}
	}
	
	let selectedObjectTopLeft = {x: selectedObject.localBounds.x, y: selectedObject.localBounds.y};
	
	// console.log("selectedObjectTopLeft: ", selectedObjectTopLeft);
	
	// calculate first selected object position
	objectX = patternPositionsA[0]["x"] - (selectedObjectWidth / 2);
	objectY = patternPositionsA[0]["y"] - (selectedObjectHeight / 2);
	
	// center first selected object to 0,0
	selectedObject.placeInParentCoordinates(selectedObjectTopLeft, {x: objectX, y: objectY});

	let seamlessObjectsA = [];
	// push the first selected object into tha array
	seamlessObjectsA.push(selectedObject);

	// create all other objects and place them according to array positions
	for(let i = 1; i < patternPositionsA.length; i++)
	{
		commands.duplicate();
		selectedObject = selection.items[0];
		
		objectX = patternPositionsA[i]["x"] - (selectedObjectWidth / 2);
		
		objectY = patternPositionsA[i]["y"] - (selectedObjectHeight / 2);
		
		selectedObject.placeInParentCoordinates(selectedObjectTopLeft, {x: objectX, y: objectY});
		
		// push each new object into the array
		seamlessObjectsA.push(selectedObject);
	}

	// mask the entire artboard for using as pattern tile
	// create mask
	let mask = new Rectangle();
	mask.width = artboardWidth;
	mask.height = artboardHeight;
	mask.fill = new Color("#FF0000");
	selection.insertionParent.addChild(mask);
	// push also the mask into the array
	seamlessObjectsA.push(mask);

	// select all objects and the mask
	selection.items = seamlessObjectsA;
	commands.createMaskGroup();
}

function makeGridPattern()
{
	// console.log("makeGridPattern()");

	// store all pattern positions into array
	let gridPositionsA = [];

	let stepX = (selectedObjectWidth + settingsO["gridPadding"]);
	let stepY = (selectedObjectHeight + settingsO["gridPadding"]);
	/* console.log("stepX: " + stepX);
	console.log("stepY: " + stepY); */

	let objectX;
	let objectY;

	// for(let i = 0; i < gridRows; i++)
	for(let i = 0; i < settingsO["gridRows"]; i++)
	{
		// console.log("row " + i);

		objectY = selectedObject.boundsInParent.y + (stepY * i);
		
		// for (let j = 0; j < gridColumns; j++)
		for (let j = 0; j < settingsO["gridColumns"]; j++)
		{
			objectX = selectedObject.boundsInParent.x + (stepX * j);

			/* console.log("\tcolumn " + j);
			console.log("\t\t" + "x: " + objectX + ", y: " + objectY); */
			
			let gridPositionO =
			{
				"x": objectX,
				"y": objectY
			}
			gridPositionsA.push(gridPositionO);
		}
	}
	
	let gridObjectsA = [];
	// push the first selected object into the array
	gridObjectsA.push(selectedObject);

	let selectedObjectTopLeft = {x: selectedObject.localBounds.x, y: selectedObject.localBounds.y};
	// let selectedObjectTopLeft = {x: 0, y: 0};

	for(let i = 1; i < gridPositionsA.length; i++)
	{
		commands.duplicate();
		selectedObject = selection.items[0];

		objectX = gridPositionsA[i]["x"];
		objectY = gridPositionsA[i]["y"];

		selectedObject.placeInParentCoordinates(selectedObjectTopLeft, {x: objectX, y: objectY});

		gridObjectsA.push(selectedObject);
	}

	selection.items = gridObjectsA;
	commands.group();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels: {
		panel: {show, hide, update}
	}
};









