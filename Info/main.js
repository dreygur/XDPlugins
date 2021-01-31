const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection, root} = require("scenegraph");

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

var pluginTitle = "Info";

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

var selectedObject;
var selectedObjectBounds;
var selectedObjectWidth;
var selectedObjectHeight;
var multipleSelection;

var artboardsCount;
var componentsCount;
var repeatGridsCount;
var scrollableGroupsCount;
var groupsCount;
var booleanGroupsCount;
var linkedGraphicsCount;
var rectanglesCount;
var ellipsesCount;
var polygonsCount;
var pathsCount;
var linesCount;
// var textsCount;
var areaTextsCount;
var pointTextsCount;
var charactersCount;
var wordsCount;
var paragraphsCount;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

var selectionNameL = createLabel("");
selectionNameL.style.width = "100%";
selectionNameL.style.marginTop = 6;
selectionNameL.style.fontWeight = "bold";
selectionNameL.style.fontSize = 11;
// selectionName.textContent = "name";
container.appendChild(selectionNameL);

var selectionTypeL = createLabel("");
selectionTypeL.style.marginTop = 8;
// selectionTypeL.textContent = "type";
container.appendChild(selectionTypeL);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PROPERTIES MODULE
var propertiesModule = createModule("internal", "");
propertiesModule.style.marginTop = 15;
container.appendChild(propertiesModule);

var propertiesBox = document.createElement("div");
propertiesModule.appendChild(propertiesBox);

// - - - - - - - - - - - - - - - - - - - - CHARACTERS
var charactersRow = document.createElement("div");
charactersRow.style.display = "flex";
charactersRow.flexDirection = "row";
propertiesBox.appendChild(charactersRow);

var charactersL = createLabel("Characters");
charactersL.style.color = labelQuietColor;
charactersRow.appendChild(charactersL);

var charactersCountL = document.createElement("div");
charactersCountL.style.marginLeft = 10;
charactersCountL.style.fontWeight = "bold";
charactersRow.appendChild(charactersCountL);

// - - - - - - - - - - - - - - - - - - - - WORDS
var wordsRow = document.createElement("div");
wordsRow.style.display = "flex";
wordsRow.flexDirection = "row";
wordsRow.style.marginTop = 14;
propertiesBox.appendChild(wordsRow);

var wordsL = createLabel("Words");
wordsL.style.color = labelQuietColor;
wordsRow.appendChild(wordsL);

var wordsCountL = document.createElement("div");
// var wordsCountL = createLabel("–");
wordsCountL.style.marginLeft = 10;
wordsCountL.style.fontWeight = "bold";
wordsRow.appendChild(wordsCountL);

// - - - - - - - - - - - - - - - - - - - - PARAGRAPHS
var paragraphsRow = document.createElement("div");
paragraphsRow.style.display = "flex";
paragraphsRow.flexDirection = "row";
paragraphsRow.style.marginTop = 14;
propertiesBox.appendChild(paragraphsRow);

var paragraphsL = createLabel("Paragraphs");
paragraphsL.style.color = labelQuietColor;
paragraphsRow.appendChild(paragraphsL);

var paragraphsCountL = document.createElement("div");
// var wordsCountL = createLabel("–");
paragraphsCountL.style.marginLeft = 10;
paragraphsCountL.style.fontWeight = "bold";
paragraphsRow.appendChild(paragraphsCountL);

/* // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INTERNAL MODULE
var internalModule = createModule("internal", "INTERNAL MODULE");
container.appendChild(internalModule); */

/* // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var fitSeparator = createSeparator();
fitSeparator.style.marginTop = 20;
container.appendChild(fitSeparator);

// - - - - - - - - - - - - - - - - - - - - FIT FRAME
var fitRow = document.createElement("div");
fitRow.style.display = "flex";
fitRow.style.flexDirection = "row";
// fitRow.style.alignItems = "center";
fitRow.style.justifyContent = "center";
// typeRow.style.marginBottom = 10;
container.appendChild(fitRow);

var fitB = createButton("", "action", true);
fitB.setAttribute("title", "Fit frame to text");
fitB.onclick = (e) => fitFrameToText();
fitRow.appendChild(fitB);

var fitIcon = document.createElement("img");
fitIcon.src = "img/fit.png";
fitB.appendChild(fitIcon); */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var bottomSeparator = createSeparator();
bottomSeparator.style.marginTop = 20;
container.appendChild(bottomSeparator);

/* // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INFO MESSAGE
var infoMessage = document.createElement("div");
infoMessage.style.marginTop = "16px";
infoMessage.style.textAlign = "center";
infoMessage.textContent = "Select a text frame";
// var wordsCountL = createLabel("–");
// paragraphsCountL.style.marginLeft = 10;
// paragraphsCountL.style.fontWeight = "bold";
container.appendChild(infoMessage); */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
function show(_e)
{
	// console.log("show()");
	// console.log(_e.node.nodeName);
	init();
	_e.node.appendChild(container);
}

function hide(_e)
{
	// console.log("hide()");
	_e.node.firstChild.remove();
}

function update()
{
	// console.log("update()");
	
	showInfo();
}

async function init()
{
	resetCounters();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ALERT DIALOG

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PANEL VALIDATION

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

function createInfoRow(_labelText, _valueText)
{
    let newRow = document.createElement("div");
	newRow.style.display = "flex";
	newRow.flexDirection = "row";
    newRow.style.marginBottom = 10;
    // newRow.style.paddingRight = 20;
	
    let infoLabelL = createLabel(_labelText);
    // infoLabelL.style.width = "50%";
    // infoLabelL.style.flexGrow = 1;
	infoLabelL.style.lineHeight = 1.4;
	infoLabelL.style.color = labelQuietColor;
	newRow.appendChild(infoLabelL);

    let infoValueL = document.createElement("div");
    // infoValueL.style.flexGrow = 1;
    // infoValueL.style.width = "100%";
	infoValueL.style.marginLeft = 10;
	infoValueL.style.fontWeight = "bold";
	infoValueL.style.lineHeight = 1.4;
	infoValueL.textContent = _valueText;
	newRow.appendChild(infoValueL);
	return newRow;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS
/* async function setDefaultSettings()
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

					defaultSettingsO["key"] = "value";

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
} */

function resetCounters()
{
	artboardsCount =
	componentsCount =
    repeatGridsCount =
    scrollableGroupsCount =
	groupsCount =
	booleanGroupsCount =
	linkedGraphicsCount =
	rectanglesCount =
	ellipsesCount =
	polygonsCount =
	pathsCount =
	linesCount =
	areaTextsCount =
	pointTextsCount =
	charactersCount =
	wordsCount =
	paragraphsCount =
	0;
}

function showInfo()
{
    // console.log("showInfo()");
    // console.log("class: " + selection.items[0].constructor.name);
	// let selectionType = typeof selection.items[0];
	propertiesBox.innerHTML = "";
	resetCounters();
	
	/* let nodesA =
	[
		{"class": "RootNode", "label": "Active Document"},
		{"class": "Artboard", "label": "Artboard"},
		{"class": "SymbolInstance", "label": "Component"},
		{"class": "RepeatGrid", "label": "Repeat Grid"},
		{"class": "Group", "label": "Group"},
		{"class": "BooleanGroup", "label": "BooleanGroup"},
		{"class": "LinkedGraphic", "label": "Linked Graphic"},
		{"class": "Rectangle", "label": "Rectangle"},
		{"class": "Ellipse", "label": "Ellipse"},
		{"class": "Polygon", "label": "Polygon"},
		{"class": "Path", "label": "Path"},
		{"class": "Line", "label": "Line"},
		{"class": "Text", "label": "Area Text"},
		{"class": "Text", "label": "Point Text"}
	]; */

	// if(selection.items[0] == undefined)
	if(selection.items.length == 0)
	{
		// container.innerHTML = "";
		updateHeader(application.activeDocument.name + ".xd", "Active Document");
		// showContainerInfo(root.children);

		if(root.children.length == 0)
		{
			propertiesBox.innerHTML = "Empty Document";
		}
		else
		{
			showContainerInfo(root.children);
		}
	}
	else
	{
		let selectedObjectChildren = selection.items[0].children;

		if(selection.items.length == 1)
		{
			switch(selection.items[0].constructor.name)
			{
				case "Artboard":
					// console.log("get Artboard info");
					updateHeader(selection.items[0].name, "Artboard");
					// showContainerInfo(selectedObjectChildren);
					if(selectedObjectChildren.length > 0)
					{
						showContainerInfo(selectedObjectChildren);
					}
					else
					{
						propertiesBox.innerHTML = "Empty Artboard";
					}
					break;
					
				case "SymbolInstance":
					// console.log("get SymbolInstance info");
					updateHeader(selection.items[0].name, "Component");
					showContainerInfo(selectedObjectChildren);
					break;

				case "RepeatGrid":
					// console.log("get RepeatGrid info");
					updateHeader(selection.items[0].name, "Repeat Grid");
					showContainerInfo(selectedObjectChildren);
                    break;
                    
                case "ScrollableGroup":
					// console.log("get ScrollableGroup info");
					updateHeader(selection.items[0].name, "Scrollable Group");
					showContainerInfo(selectedObjectChildren);
					break;

				case "Group":
					// console.log("get Group info");
					let groupType = !selection.items[0].mask ? "Plain Group" : "Mask Group";
					updateHeader(selection.items[0].name, groupType);
					// updateHeader(selection.items[0].name, "Group");
					showContainerInfo(selectedObjectChildren);
					break;

				case "BooleanGroup":
					// console.log("get BooleanGroup info");
					updateHeader(selection.items[0].name, "Boolean Group");
					showContainerInfo(selectedObjectChildren);
					break;

				case "LinkedGraphic":
					// console.log("get LinkedGraphic info");
					updateHeader(selection.items[0].name, "LinkedGraphic");
					showLinkedGraphicInfo();
					break;

				case "Rectangle":
					// console.log("get Rectangle info");
					updateHeader(selection.items[0].name, "Rectangle");
					showShapeInfo("Rectangle");
					// console.log(selection.items[0].fill);
					break;

				case "Ellipse":
					// console.log("get Ellipse info");
					updateHeader(selection.items[0].name, "Ellipse");
					showShapeInfo("Ellipse");
					break;

				case "Polygon":
					// console.log("get Polygon info");
					updateHeader(selection.items[0].name, "Polygon");
					showShapeInfo("Polygon");
					break;

				case "Path":
					// console.log("get Path info");
					updateHeader(selection.items[0].name, "Path");
					showShapeInfo("Path");
					break;

				case "Line":
					// console.log("get Line info");
					updateHeader(selection.items[0].name, "Line");
					showLineInfo();
					break;

				case "Text":
					let textType = selection.items[0].areaBox ? "Text Area" : "Point Text";
					updateHeader(selection.items[0].name, textType);
					// node.areaBox ? areaTextsCount++ : pointTextsCount++;
					showTextInfo(selection.items[0]);
					break;
			}
		}
		else
		{
			// console.log("multiple selection -> show empty info");
			updateHeader("Multiple selection", "–");
			showContainerInfo(selection.items);
			// showMultiSelectionInfo();
		}
	}

	/* if(selection.items.length == 1 && selection.items[0].constructor.name == "Text")
	{
        // console.log("show info");
        let selectedTextNode = selection.items[0];
		let selectedText = selectedTextNode.text;
		charactersCountL.innerHTML = getInfo("characters", selectedText);
		wordsCountL.textContent = getInfo("words", selectedText);
		paragraphsCountL.textContent = getInfo("paragraphs", selectedText);
		
        if(selection.items[0].clippedByArea)
		{
            charactersCountL.innerHTML += " <span style='color:#FF0000'>•</span>";
            wordsCountL.innerHTML += " <span style='color:#E21100'>•</span>";
            paragraphsCountL.innerHTML += " <span style='color:#E21100'>•</span>";
        }
        
		if(selectedText.length == 0)
		{
            charactersCountL.innerHTML = wordsCountL.innerHTML = paragraphsCountL.innerHTML = "0";
        }
        
        // console.log("selectedText.areaBox: " + selectedTextNode.areaBox);
		fitB.disabled = (selectedTextNode.areaBox)? false: true;
		infoMessage.style.visibility = "hidden";
	}
	else
	{
		charactersCountL.innerHTML = "–";
        wordsCountL.innerHTML = "–";
        paragraphsCountL.innerHTML = "–";
		fitB.disabled = true;
		infoMessage.style.visibility = "visible";
	} */
}

/* function getInfo(_type, _text)
{
    let characters = _text.length;
	let words = _text.split(/\s+/).length;
    let paragraphs = _text.split(/\r*\n/).length; 
    
    switch(_type)
	{
		case "characters":
			// console.log("characters: " + characters);
            return characters.toString();
			break;
			
		case "words":
            // console.log("words: " + words);
            return words;
            break;

        case "paragraphs":
            // console.log("paragraphs: " + paragraphs);
            return paragraphs;
			break;
	}
} */

function updateHeader(_name, _type)
{
	selectionNameL.textContent = _name;
	selectionTypeL.textContent = _type;
}

function showContainerInfo(_items)
{
	// console.log("showContainerInfo()");
	
	// updateHeader(application.activeDocument.name + ".xd", "Active Document");

	/* let artboardCount = 0;
	let itemsCount = 0; */

	// _node.children.forEach(function (node, i)
	_items.forEach(function (node, i)
	{
		switch(node.constructor.name)
		{
			case "Artboard":
				artboardsCount++;
				break;
				
			case "SymbolInstance":
				componentsCount++;
				break;

			case "RepeatGrid":
				repeatGridsCount++;
                break;
                
            case "ScrollableGroup":
				scrollableGroupsCount++;
				break;

			case "Group":
				groupsCount++;
				break;

			case "BooleanGroup":
				booleanGroupsCount++;
				break;

			case "LinkedGraphic":
				linkedGraphicsCount++;
				break;

			case "Rectangle":
				rectanglesCount++;
				break;

			case "Ellipse":
				ellipsesCount++;
				break;

			case "Polygon":
				polygonsCount++;
				break;

			case "Path":
				pathsCount++;
				break;

			case "Line":
				linesCount++;
				break;

			case "Text":
				// textsCount++;
				node.areaBox ? areaTextsCount++ : pointTextsCount++;
				// console.log(areaTextsCount);
				break;
		}
		/* if(node.constructor.name == "Artboard")
		{
			artboardsCount++;
		} */
	});

	/* let artboardsRow = createInfoRow("Artboards", artboardsCount);
	// artboardsRow.firstChild.nextSibling.textContent = artboardsCount; // root.children.length;
	propertiesBox.appendChild(artboardsRow); */

	if(artboardsCount > 0)
	{
		let artboardsRow = createInfoRow("Artboards", artboardsCount);
		propertiesBox.appendChild(artboardsRow);
	}

	if(componentsCount > 0)
	{
		let componentsRow = createInfoRow("Components", componentsCount);
		propertiesBox.appendChild(componentsRow);
	}

	if(repeatGridsCount > 0)
	{
		let repeatGridsRow = createInfoRow("Repeat Grids", repeatGridsCount);
		propertiesBox.appendChild(repeatGridsRow);
    }
    
    if(scrollableGroupsCount > 0)
	{
		let scrollableGroupsRow = createInfoRow("Scrollable Groups", scrollableGroupsCount);
		propertiesBox.appendChild(scrollableGroupsRow);
	}

	if(groupsCount > 0)
	{
        let groupString = "Groups";
        if(selection.items.length > 0)
        {
            if(selection.items[0].constructor.name == "RepeatGrid")
            {
                groupString = "Cells";
            }
        }
        
        let groupsRow = createInfoRow(groupString, groupsCount);
        propertiesBox.appendChild(groupsRow);

        /* let groupString;
        if(selection.items.length > 0)
        {

        }
        
        if(selection.items[0].constructor.name != "RepeatGrid")
        {
            groupString = "Groups";
        }
        else
        {
            groupString = "Cells";
        }
        
        let groupsRow = createInfoRow(groupString, groupsCount);
        propertiesBox.appendChild(groupsRow); */
        



        /* let groupsRow = createInfoRow("Groups", groupsCount);
		propertiesBox.appendChild(groupsRow); */
	}

	if(booleanGroupsCount > 0)
	{
		let booleanGroupsRow = createInfoRow("Boolean Groups", booleanGroupsCount);
		propertiesBox.appendChild(booleanGroupsRow);
	}

	if(linkedGraphicsCount > 0)
	{
		let linkedGraphicsRow = createInfoRow("Linked Graphics", linkedGraphicsCount);
		propertiesBox.appendChild(linkedGraphicsRow);
	}

	if(rectanglesCount > 0)
	{
		let rectanglesRow = createInfoRow("Rectangles", rectanglesCount);
		propertiesBox.appendChild(rectanglesRow);
		// console.log(_node.imageFill);
	}

	if(ellipsesCount > 0)
	{
		let ellipsesRow = createInfoRow("Ellipses", ellipsesCount);
		propertiesBox.appendChild(ellipsesRow);
	}

	if(polygonsCount > 0)
	{
		let polygonsRow = createInfoRow("Polygons", polygonsCount);
		propertiesBox.appendChild(polygonsRow);
	}

	if(pathsCount > 0)
	{
		let pathsRow = createInfoRow("Paths", pathsCount);
		propertiesBox.appendChild(pathsRow);
	}

	if(linesCount > 0)
	{
		let linesRow = createInfoRow("Lines", linesCount);
		propertiesBox.appendChild(linesRow);
	}

	/* if(textsCount > 0)
	{
		let textsRow = createInfoRow("Texts", textsCount);
		propertiesBox.appendChild(textsRow);
	} */

	if(pointTextsCount > 0)
	{
		let pointTextsRow = createInfoRow("Point Texts", pointTextsCount);
		propertiesBox.appendChild(pointTextsRow);
	}

	if(areaTextsCount > 0)
	{
		let areaTextsRow = createInfoRow("Area Texts", areaTextsCount);
		propertiesBox.appendChild(areaTextsRow);
	}
}

function showLinkedGraphicInfo()
{
	// console.log("showLinkedGraphicInfo()");
	showNoInfo();
}

function showShapeInfo(_class)
{
	switch(_class)
	{
		case "Rectangle":
			// console.log("get Rectangle info");
			/* updateHeader(selection.items[0].name, "Artboard");
			showContainerInfo(selection.items[0]); */
			// console.log(selection.items[0].fill.constructor.name == "ImageFill");
			break;
			
		case "Ellipse":
			// console.log("get Ellipse info");
			/* updateHeader(selection.items[0].name, "Component");
			showContainerInfo(selection.items[0]); */
			break;

		case "Polygon":
			// console.log("get Polygon info");
			/* updateHeader(selection.items[0].name, "Component");
			showContainerInfo(selection.items[0]); */
			break;

		case "Path":
			// console.log("get Path info");
			/* updateHeader(selection.items[0].name, "Component");
			showContainerInfo(selection.items[0]); */
			break;
	}

	if(selection.items[0].fill.constructor.name == "ImageFill")
	{
        let imageFill = selection.items[0].fill;
        // console.log("imageFill: " + imageFill);
        let imageFillString = imageFill.toString();

        let spaceIndex = imageFillString.lastIndexOf(" ");
        // console.log("spaceIndex: " + spaceIndex);

        let imageFileName = imageFillString.substring(10, spaceIndex);
        // console.log("imageFileName: " + imageFileName);

        let imageSize = imageFill.naturalWidth + " x " + imageFill.naturalHeight;

        let imageNameRow = createInfoRow("Image", imageFileName);
        propertiesBox.appendChild(imageNameRow);
        
        let imageSizeRow = createInfoRow("Size", imageSize);
		propertiesBox.appendChild(imageSizeRow);

        /* let imageFileName = imageFillString.substring(10, imageFillString.length - 1);
        console.log("imageFileName: " + imageFileName); */

        

        /* let fill = selection.items[0].fill;
        console.log("fill: " + fill);
        console.log(selection.items[0].fill.naturalWidth);
        console.log(selection.items[0].fill.naturalHeight);



        let imageFill = selection.items[0].fill.toString();
        console.log("imageFill: " + imageFill);
		let imagePath = imageFill.substring(10, imageFill.length - 1);
		console.log("imagePath: " + imagePath);
		// let imageRow = createInfoRow("Image", selection.items[0].fill);
		let imageRow = createInfoRow("Image", imagePath);
		propertiesBox.appendChild(imageRow); */
	}
	else
	{
		showNoInfo();
	}
}

function showLineInfo()
{
	showNoInfo();
}

function showTextInfo(_textNode)
{
	// console.log("showTextInfo()");
	// updateHeader(selection.items[0].name, "Text");

	// let selectedTextNode = selection.items[0];
	let selectedTextString = _textNode.text;

	charactersCount = selectedTextString.length;
	wordsCount = selectedTextString.split(/\s+/).length;
	paragraphsCount = selectedTextString.split(/\r*\n/).length;
	
	if(charactersCount > 0)
	{
		let charactersRow = createInfoRow("Characters", charactersCount);
		propertiesBox.appendChild(charactersRow);
	}

	if(wordsCount > 0)
	{
		let wordsRow = createInfoRow("Words", wordsCount);
		propertiesBox.appendChild(wordsRow);
	}

	if(paragraphsCount > 0)
	{
		let paragraphsRow = createInfoRow("Paragraphs", paragraphsCount);
		propertiesBox.appendChild(paragraphsRow);
	}
}

function showNoInfo()
{
	propertiesBox.innerHTML = "No info for this object";
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK ACTIONS
async function mainFunctionOK()
{
	// console.log("mainFunctionOK()");
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels: {
		Info: {show, hide, update}
	}
};









