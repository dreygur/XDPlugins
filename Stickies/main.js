const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const platform = require("os").platform();
const {editDocument} = require("application");
const application = require("application");
const localFileSystem = require("uxp").storage.localFileSystem;
const commands = require("commands");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var pluginFolder;
var dataFolder;
var settingsFile;
var settingsO;

var pluginTitle = "Stickies";

var labelFontSizeMini = 9;
var labelFontSize = 10;
var textFontSize = 11;

var activeColor = "#2680EB";
var inactiveColor = "#A0A0A0";
var activeBkgColor = "#E2E2E2";
var lightBkgColor = "#FBFBFB";
var labelColor = "#666666";
var labelQuietColor = "#999";
var separatorColor = "#E4E4E4";
var errorColor = "#FF0000";

var colorsA = ["#FFFE00", "#00FE58", "#05CEFF", "#FFB124", "#FF0000", "#F227DE"];
var colorButtonsA = [];
// var selectedColorButton;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - COLORS MODULE
var colorsModule = createModule("top", "");
colorsModule.style.marginTop = 0;
container.appendChild(colorsModule);

var colorsMenu = document.createElement("div");
colorsMenu.style.display = "flex";
colorsMenu.style.flexDirection = "row";
// colorsMenu.style.alignItems = "center";
colorsMenu.style.justifyContent = "space-between";
colorsMenu.style.marginTop = 10;
// colorsMenu.style.background = "#CCCCCC";
colorsModule.appendChild(colorsMenu);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SETTINGS MODULE
var settingsModule = createModule("internal", "");
container.appendChild(settingsModule);

/* var translucentCB = createCheckBox("Translucent", 100, false);
noteTF.setAttribute("title", "Translucent sticky background");
translucentCB.firstChild.onchange = (e) => switchTranslucent();
settingsModule.appendChild(translucentCB); */

var fullscreenCB = createCheckBox("Fullscreen", 100, false);
fullscreenCB.setAttribute("title", "Fullscreen sticky or external tag");
fullscreenCB.firstChild.onchange = (e) => switchFullscreen();
settingsModule.appendChild(fullscreenCB);

var noteTF = createTextInput("", "", false);
noteTF.style.width = "100%";
noteTF.setAttribute("title", "Insert a text note into the sticky");
noteTF.oninput = (e) => setNote();
noteTF.placeholder = "Add a note";
settingsModule.appendChild(noteTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var bottomSeparator = createSeparator();
bottomSeparator.style.marginTop = 14;
container.appendChild(bottomSeparator);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FOOTER
var footer = document.createElement("footer");
container.appendChild(footer);

var okB = createButton("Apply", "cta");
okB.id = "mainAction";
okB.onclick = (e) => validatePanel(e);
footer.appendChild(okB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
function show(_e)
{
	// console.log("show()");
	// console.log(_e.node.nodeName);
	init();
	_e.node.appendChild(container);
}

async function hide(_e)
{
	// console.log("hide()");
    
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
	// resetValues();
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
    
    buildColorsMenu();

    // translucentCB.firstChild.checked = settingsO["translucent"];
    fullscreenCB.firstChild.checked = settingsO["fullscreen"];
    noteTF.value = settingsO["note"];
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{
	// console.log("checkSelection()");
    if(selection.items.length == 0 || selection.items[0].constructor.name != "Artboard")
    // if(selection.items.length == 0)
	{
		try
		{
            await openAlertDialog(pluginTitle, "Select one or more Artboards.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
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
		
	editDocument({editLabel: "Apply Sticky"}, async() =>
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
				try
				{
					await mainFunctionOK();
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
	});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DATA CHECK


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

function createColorButton(_color)
{
    // console.log("createColorButton()");
    let newColorButton = document.createElement("div");
    newColorButton.style.display = "flex";
    newColorButton.style.alignItems = "center";
    newColorButton.style.justifyContent = "center";
    newColorButton.style.width = 20;
    newColorButton.style.height = 20;
    newColorButton.style.border = "1px solid #999999";
    newColorButton.style.borderRadius = 10;
    newColorButton.style.background = "#FFFFFF";

    let colorCircle = document.createElement("div");
    colorCircle.style.width = 16;
    colorCircle.style.height = 16;
    colorCircle.style.borderRadius = 8;
    colorCircle.style.background = _color;
    newColorButton.appendChild(colorCircle);

    return newColorButton;
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

                    defaultSettingsO["colorId"] = 0;
                    // defaultSettingsO["translucent"] = false;
                    defaultSettingsO["fullscreen"] = false;
                    defaultSettingsO["note"] = "";

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
		// console.log("\twrite settings");
		await settingsFile.write(JSON.stringify(settingsO), {append: false});
	}
	catch (_error)
	{
		console.log(_error);
	}	
}

function buildColorsMenu()
{
    // console.log("buildColorsMenu()");
    colorsMenu.innerHTML = "";
    colorButtonsA = [];

    for(let i = 0; i < colorsA.length; i++)
    {
        let colorB = createColorButton(colorsA[i]);

        colorB.style.border = "none";
        colorB.style.background = "none";

        colorB.onclick = (e) => setColor(i);
        colorsMenu.appendChild(colorB);

        colorButtonsA.push(colorB);
    }

    setColor(settingsO["colorId"]);
}

function setColor(_index)
{
    // console.log("setColor() " + _index);
    let selectedColorButton = colorButtonsA[settingsO["colorId"]]
    selectedColorButton.style.border = "none";
    selectedColorButton.style.background = "none";

    selectedColorButton.firstChild.style.width = 16;
    selectedColorButton.firstChild.style.height = 16;

    settingsO["colorId"] = _index;
    selectedColorButton = colorButtonsA[settingsO["colorId"]];
    selectedColorButton.style.border = "1px solid #999999";
    selectedColorButton.style.background = "#FFFFFF";

    selectedColorButton.firstChild.style.width = 12;
    selectedColorButton.firstChild.style.height = 12;
}

/* function switchTranslucent()
{
	// console.log("switchTranslucent()");
	settingsO["translucent"] = !settingsO["translucent"];
} */

function switchFullscreen()
{
	// console.log("switchFullscreen()");
	settingsO["fullscreen"] = !settingsO["fullscreen"];
}

function setNote()
{
	settingsO["note"] = noteTF.value;
	// * * * saveSettings();
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK ACTIONS
async function mainFunctionOK()
{
    // console.log("mainFunctionOK()");
    // console.log(selection.items.length);

    let _sticky;

    selection.items.forEach(function (artboard, i)
    {
        // console.log(artboard);

        selection.items = [artboard];
        // console.log(artboardsA[i]);
        _sticky = new Rectangle();
        
        _sticky.width = artboard.width;
        // _sticky.width = artboardBounds.width;
        // _sticky.height = 100;
        _sticky.fill = new Color(colorsA[settingsO["colorId"]]);
        // _sticky.fill = new Color("#000000");
        _sticky.stroke = new Color("#000000", 1);
        _sticky.strokeEnabled = false;
        selection.insertionParent.addChild(_sticky);

        if(settingsO["fullscreen"])
        {
            _sticky.height = artboard.height;
            _sticky.opacity = .8;
        }
        else
        {
            _sticky.height = 100;
        }

        // check if noteTF contains useful text - it cannot contain just whitespaces
        if (/\S/.test(settingsO["note"]))
        {
            let note = new Text();
            note.text = settingsO["note"];
            note.textAlign = "center";
            note.fill = new Color("#000000");
            note.fontSize = 17;
            selection.insertionParent.addChild(note);

            let stickyCenterX = _sticky.localBounds.width / 2;
            let stickyCenterY = _sticky.localBounds.height / 2;
            note.placeInParentCoordinates({x: 0, y: 0}, {x: stickyCenterX, y: stickyCenterY});
            selection.items = [_sticky, note];
            commands.alignHorizontalCenter();
            commands.alignVerticalCenter();
            commands.group();
        }
        else
        {
            // reset note
            noteTF.value = "";
            settingsO["note"] = "";
            selection.items = [_sticky];
        }

        if(!settingsO["fullscreen"])
        {
            selection.items[0].moveInParentCoordinates(0, -100);
        }
        selection.items = [];
    });




    /* let artboard = selection.items[0];
    let artboardBounds = artboard.globalBounds;
    let artboardX = artboardBounds.x;
    let artboardY = artboardBounds.y;
    // console.log("artboardBounds: ", artboardBounds);

    let sticky;
    sticky = new Rectangle();
    
    sticky.width = artboard.width;
    // sticky.width = artboardBounds.width;
    sticky.height = 100;
    sticky.fill = new Color(colorsA[settingsO["colorId"]]);
    sticky.stroke = new Color("#000000", 1);
    sticky.strokeEnabled = false;
    selection.insertionParent.addChild(sticky);

    if(settingsO["fullscreen"])
    {
        sticky.height = artboard.height;
        sticky.opacity = .8;
    }
    else
    {
        sticky.height = 100;
    }

    // check if noteTF contains useful text - it cannot contains whitespaces only
    if (/\S/.test(settingsO["note"]))
    {
        // console.log("add note");

        let note = new Text();
	    note.text = settingsO["note"];
        note.textAlign = "center";
        note.fill = new Color("#000000");
        note.fontSize = 17;
        selection.insertionParent.addChild(note);

        let stickyCenterX = sticky.localBounds.width / 2;
        let stickyCenterY = sticky.localBounds.height / 2;
        note.placeInParentCoordinates({x: 0, y: 0}, {x: stickyCenterX, y: stickyCenterY});
        selection.items = [sticky, note];
        commands.alignHorizontalCenter();
        commands.alignVerticalCenter();
        commands.group();
    }
    else
    {
        // reset note
        noteTF.value = "";
        settingsO["note"] = "";
        selection.items = [sticky];
    }

    if(!settingsO["fullscreen"])
    {
        selection.items[0].moveInParentCoordinates(0, -100);
    } */
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels: {
		Stickies: {show, hide, update}
	}
};









