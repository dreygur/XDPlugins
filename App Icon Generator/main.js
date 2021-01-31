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

var pluginTitle = "App Icon Generator";

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

var exportFolder;
var projectFolder;
var existingProjectFolder;
var projectName;

var renditionsA;

var selectedObject;
var selectedObjectBounds;
var selectedObjectWidth;
var selectedObjectHeight;
var multipleSelection;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SETTINGS MODULE
var settingsModule = createModule("top", "SETTINGS");
settingsModule.style.marginTop = 0;
container.appendChild(settingsModule);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PROJECT NAME
var projectNameGroup = document.createElement("div");
projectNameGroup.style.marginBottom = 16;
settingsModule.appendChild(projectNameGroup);

var projectNameL = createLabel("Project Name");
projectNameGroup.appendChild(projectNameL);

var projectNameTF = createTextInput("", "100%", false);
projectNameTF.style.margin = "8px 0px";
projectNameTF.style.background = "#FBFBFB";
projectNameTF.oninput = (e) => setProjectName(projectNameTF.value);
projectNameGroup.appendChild(projectNameTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FILE NAME
var fileNameGroup = document.createElement("div");
settingsModule.appendChild(fileNameGroup);

var fileNameL = createLabel("File Name (optional)");
fileNameGroup.appendChild(fileNameL);

var fileNameTF = createTextInput("", "100%", false);
fileNameTF.style.margin = "8px 0px";
fileNameTF.style.background = "#FBFBFB";
fileNameTF.value = "icon_";
fileNameTF.oninput = (e) => setFileNames(fileNameTF.value);
fileNameGroup.appendChild(fileNameTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAINTAIN TRANSPARENCY
var maintainTransparencyCB = createCheckBox("Maintain Transparency", "", false);
maintainTransparencyCB.style.marginTop = 10;
maintainTransparencyCB.firstChild.onchange = (e) => switchMaintainTransparency();
maintainTransparencyCB.setAttribute("title", "Keep transparent pixels, if any");
settingsModule.appendChild(maintainTransparencyCB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PLATORMS MODULE
var platformsModule = createModule("internal", "PLATFORMS");
container.appendChild(platformsModule);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PLATFORMS LIST
var platforms = document.createElement("div");
platformsModule.appendChild(platforms);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var bottomSeparator = createSeparator();
bottomSeparator.style.marginTop = 14;
container.appendChild(bottomSeparator);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FOOTER
var footer = document.createElement("footer");
container.appendChild(footer);

var okB = createButton("Export", "cta");
okB.id = "exportAppIcons";
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

	_e.node.appendChild(container);
}

async function hide(_e)
{
	// console.log("hide()");
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
	// get db
	try
	{
		await getDB();
	}
	catch(_error)
	{
		console.log(_error);
	}

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

	// projectNameTF.value = settingsO["projectName"];
	fileNameTF.value = settingsO["fileName"];
	maintainTransparencyCB.firstChild.checked = settingsO["maintainTransparency"];

	setPlatforms();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{
	// console.log("checkSelection()");

	if(selection.items.length == 0)
	{
		try
		{
			await openAlertDialog("alert", pluginTitle, "Select a square Artboard, object or group.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(selection.items.length > 1)
	{
		// console.log("multiple selection - group objects");
		commands.group();
		multipleSelection = true;
	}

	selectedObject = selection.items[0];
	selectedObjectBounds = selectedObject.boundsInParent;
	selectedObjectWidth = selectedObjectBounds.width;
	selectedObjectHeight = selectedObjectBounds.height;

	if(selectedObjectWidth != selectedObjectHeight)
	{
		try
		{
			await openAlertDialog("alert", pluginTitle, "The selected object is not a perfect square.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		
		if(multipleSelection == true)
		{
			// console.log("multipleSelection is true - ungroup objects - checkSelection()");
			commands.ungroup();
			multipleSelection = false;
		}
		return false;
	}
	return true;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ALERT DIALOG
async function openAlertDialog(_type, _title, _message)
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

	let alertOkB;
	switch(_type)
	{
		case "alert":
            alertOkB = createButton("OK", "cta", false);
            alertOkB.setAttribute("type", "submit");
			alertOkB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertOkB);
			break;
			
		case "replaceProjectFolder":
			let alertCancelB = createButton("Cancel");
			alertCancelB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertCancelB);

			alertOkB = createButton("Replace", "warning", false);
            alertOkB.id = "exportAppIconsX";
            alertOkB.setAttribute("type", "submit");
			alertOkB.onclick = (e) => replaceExistingAssets();
			alertFooter.appendChild(alertOkB);
			break;

		case "exportOK":
			// console.log("export OK");            
            alertOkB = createButton("OK", "cta", false);
            alertOkB.setAttribute("type", "submit");
			alertOkB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertOkB);
			break;
	}
	
	alertContainer.appendChild(alertFooter);
	document.body.appendChild(alertDialog);
	
	try
	{
		await alertDialog.showModal();
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PANEL VALIDATION
async function validatePanel(_e)
// function validatePanel(e)
{
	// console.log("validatePanel()");

	editDocument({editLabel: "Export Icons"}, async() =>
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
					let p = await checkProjectName();
					if(p == false)
					{
						return;
					}
				}
				catch(_error)
				{
					console.log(_error);
				}

				try
				{
					let f = await checkFileName();
					if(f == false)
					{
						return;
					}
				}
				catch(_error)
				{
					console.log(_error);
				}
				
				try
				{
					let p = await checkPlatform();
					if(p == false)
					{
						return;
					}
				}
				catch(_error)
				{
					console.log(_error);
				}
                
                try
                {
                    exportFolder = await localFileSystem.getFolder();
                    if (exportFolder)
                    {
                        // console.log("exportFolder: " + exportFolder);

                        try
                        {
                            let projectFolderExists = await checkExistingProjectFolder();
                            if(projectFolderExists == true)
                            {
                                return;
                            }
                        }
                        catch(_error)
                        {
                            console.log(_error);
                        }
                        
                        try
                        {
                            await exportAppIconOK();
                        }
                        catch(_error)
                        {
                            console.log(_error);
                        }
                    }
                    else
                    {
                        // console.log("exportFolder: NOT SET");
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
	});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DATA CHECK
function checkTextFieldSpecialCharacters(_textFieldValue)
{
	let allowedCharacters = /[^\w\-]/;
	if(_textFieldValue.match(allowedCharacters))
	{
		return true;
	}
	else
	{
		return false;
	}
}

async function checkProjectName()
{
	// console.log("checkProjectName()");

	if(projectNameTF.value == "")
	{
		try
		{
			projectNameTF.focus();
			await openAlertDialog("alert", pluginTitle, "Insert the project name.");
			
		}
		catch(_error)
		{
			console.log(_error);
		}

		if(multipleSelection == true)
		{
			// console.log("multipleSelection is true - ungroup objects - checkProjectName()");
			commands.ungroup();
			multipleSelection = false;
		}

		return false;
	}

	if(checkTextFieldSpecialCharacters(projectNameTF.value.toString()))
	{
		try
		{
			projectNameTF.focus();
			await openAlertDialog("alert", pluginTitle, "Project Name cannot contain special characters.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	return true;
}

async function checkFileName()
{
	// console.log("checkFileName()");

	if(checkTextFieldSpecialCharacters(fileNameTF.value.toString()))
	{
		try
		{
			fileNameTF.focus();
			await openAlertDialog("alert", pluginTitle, "File Name cannot contain special characters.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	return true;
}

async function checkPlatform()
{
	// console.log("checkPlatform()");

	let platformUncheckedA = [];
	
	for(let i = 0; i < renditionsA.length; i++)
	{
		let platformCB = renditionsA[i]["checkBox"];
		if(platformCB.checked == false)
		{
			platformUncheckedA.push(platformCB);
		}
	}
	
	if(platformUncheckedA.length == renditionsA.length)
	{
		try
		{
			await openAlertDialog("alert", pluginTitle, "Select at least one platform.");
			
		}
		catch(_error)
		{
			console.log(_error);
		}

		if(multipleSelection == true)
		{
			// console.log("multipleSelection is true - ungroup objects - checkPlatform()");
			commands.ungroup();
			multipleSelection = false;
		}
		return false;
	}
	else
	{
		return true;
	}
}

async function checkExistingProjectFolder()
{
	// console.log("checkExistingProjectFolder()");

	try
	{
        // existingProjectFolder = await exportFolder.getEntry("./" + settingsO["projectName"]);
        existingProjectFolder = await exportFolder.getEntry("./" + projectName);
		if(existingProjectFolder)
		{
			try
			{
                await openAlertDialog("replaceProjectFolder", pluginTitle, "\"" + projectName + "\" folder already exists. Replacing it will overwrite its current contents.");
			}
			catch(_error)
			{
				console.log(_error);
			}
            // console.log("project folder already exists in export folder");
			return true;
		}
		else
		{
            // console.log("project folder not found in export folder");
            return false;
		}
	}
	catch(_error)
	{
		// keep commented - otherwise, if project folder doesn't exist, it displays [Error: getEntry: File with given name not found]
		// console.log(_error);
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

function createPlatform(_platformId)
{
    // console.log("createPlatform()");

    let platform = document.createElement("div");
    platform.id = _platformId;
    // platforms.appendChild(platform);

    let platformHeader = document.createElement("div");
    platformHeader.style.display = "flex";
    platformHeader.style.flexDirection = "row";
    platformHeader.style.alignItems = "center";
    platformHeader.style.justifyContent = "space-between";
    platform.appendChild(platformHeader);

    let platformChecked = settingsO["platforms"][renditionsA[_platformId]["platform"]];
    let checkBox = createCheckBox(renditionsA[_platformId]["platform"], "", platformChecked);
    renditionsA[_platformId]["checkBox"] = checkBox.firstChild;
    checkBox.firstChild.onchange = (e) => selectPlatform(_platformId, fileList);
    platformHeader.appendChild(checkBox);

    let chevronB = createButton("", "action", true);
    chevronB.style.width = (platformIsMac()) ? 20 : 40;
    chevronB.setAttribute("title", "Toggle renditions list");
    chevronB.onclick = (e) => showList(renditionsA[_platformId]["list"], chevron);
    // chevronB.style.background = "#CCCCCC";
    platformHeader.appendChild(chevronB);

    let chevron = document.createElement("img");
    renditionsA[_platformId]["chevron"] = chevron;
    chevron.src = "img/down.png";
    chevronB.appendChild(chevron);
    
    let fileList = document.createElement("div");
    fileList.style.opacity = 1;
    fileList.style.display = "none";
    renditionsA[_platformId]["list"] = fileList;

    if(platformChecked == false)
    {
        // console.log("platformChecked = false");
        dimList(fileList);
    }

    platform.appendChild(fileList);

    for(let j = 0; j < renditionsA[_platformId]["renditions"].length; j++)
    {
        let fileLabel = createLabel(settingsO["fileName"] + renditionsA[_platformId]["renditions"][j] + ".png");
        fileLabel.style.margin = "0 26";
        fileLabel.style.padding = "6 0";
        fileList.appendChild(fileLabel);
    }
    
    return platform;
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

					// defaultSettingsO["projectName"] = "";
					defaultSettingsO["fileName"] = "icon_";
					defaultSettingsO["maintainTransparency"] = false;

					let platformObj = {};

					for(let i = 0; i < renditionsA.length; i++)
					{
						// console.log("renditionsA[" + i + "]: " + renditionsA[i]["platform"]);
						platformObj[renditionsA[i]["platform"]] = true;
					}
					// console.log("platformObj");
					// console.log(platformObj);

					defaultSettingsO["platforms"] = platformObj;
					// console.log("defaultSettingsO");
					// console.log(defaultSettingsO);

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

async function getDB()
{
	// console.log("getDB()");

	try
	{
		// console.log("\tget plugin folder");
		pluginFolder = await localFileSystem.getPluginFolder();
		try
		{
			// console.log("\tget renditions file");
			let renditionsFile = await pluginFolder.getEntry("renditionsDB.json");
			try
			{
				// console.log("\tread renditions file");
				let jsonRenditions = await renditionsFile.read();
				renditionsA = JSON.parse(jsonRenditions);
				// console.log("renditionsA: ", renditionsA);						
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
	catch(_error)
	{
		console.log(_error);
	}
}

function setPlatforms()
{
	// console.log("setPlatforms()");

    platforms.innerHTML = "";
	// platforms.textContent = "";
	
	for(let i = 0; i < renditionsA.length; i++)
	{
		let platform = createPlatform(i);

		platforms.appendChild(platform);
	}
}

function setProjectName(_projectName)
{
	// console.log("setProjectName()");
	// console.log(_projectName);
    projectName = _projectName;
	// saveSettings();
}

function setFileNames(_fileNamePrefix)
{
	// console.log("setFileNames()");
	// console.log(_fileNamePrefix);

	for(let i = 0; i < renditionsA.length; i++)
	{
		for(let j = 0; j < renditionsA[i]["renditions"].length; j++)
		{
            let fileNameSuffix = renditionsA[i]["renditions"][j] + ".png";
			renditionsA[i]["list"].childNodes[j].textContent = _fileNamePrefix + fileNameSuffix;
		}
	}

	settingsO["fileName"] = _fileNamePrefix;
	// saveSettings();
}

function switchMaintainTransparency()
{
	// console.log("switchMaintainTransparency()");

	settingsO["maintainTransparency"] = !settingsO["maintainTransparency"];
	// saveSettings();
}

function selectPlatform(_index, _platform)
{
	// console.log("selectPlatform()");

    dimList(_platform);

	// console.log(renditionsA[_index]["platform"]);
	
	settingsO["platforms"][renditionsA[_index]["platform"]] = !settingsO["platforms"][renditionsA[_index]["platform"]];
	// console.log("settingsO:", settingsO);

	// saveSettings();
}

function dimList(_list)
{
	// console.log("dimList()");

	if (_list.style.opacity == 1)
	{
		_list.style.opacity = .4;
	}
	else
	{
		_list.style.opacity = 1;
	}
}

function showList(_list, _chevron)
{
	// console.log("showList()");

	if (_list.style.display == "block")
	{
		_chevron.src = "img/down.png";
		_list.style.display = "none";
	}
	else
	{
		_chevron.src = "img/minus.png";
		_list.style.display = "block";
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK ACTIONS
async function exportAppIconOK()
{
	// console.log("exportAppIconOK()");
	
	try
	{
		// create project folder
		// console.log("create project folder: " + projectName);
		// projectFolder = await exportFolder.createFolder(projectName, {overwrite: true});
        // projectFolder = await exportFolder.createFolder(settingsO["projectName"], {overwrite: true});
        projectFolder = await exportFolder.createFolder(projectName, {overwrite: true});
		if(projectFolder)
		{
			for(let i = 0; i < renditionsA.length; i ++)
			{
				if(renditionsA[i]["checkBox"].checked)
				{
					try
					{
						// create platform folder
						// console.log("\tcreate platform folder: " + renditionsA[i]["platform"]);
						let platformFolder = await projectFolder.createFolder(renditionsA[i]["platform"], {overwrite: true});
						if (platformFolder)
						{
							try
							{
								let r = await exportRenditions(renditionsA[i]["renditions"], platformFolder);
								// console.log("\t" + renditionsA[i]["platform"]);
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
			}
		}
	}
	catch(_error)
	{
		console.log(_error);
    }

    try
	{
		await openAlertDialog("exportOK", pluginTitle, "All icons have been exported successfully.<br><br>You can find them in:<br><b>" + exportFolder.nativePath + "</b>");
		// await openAlertDialog("exportOK", pluginTitle, "All icons have been exported successfully.");
		// return;
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function exportRenditions(_renditionsA, _platformFolder)
{	
	// console.log("exportRenditions()");
		
	let renditions = [];
		
	for(let i = 0; i < _renditionsA.length; i++)
	{
		// console.log(_renditionsA[i]);
		let fileName = settingsO["fileName"] + _renditionsA[i] + ".png";
		try
		{
			let file = await _platformFolder.createFile(fileName, {overwrite: true});
			
			if(file)
			{
				let scaleFactor = _renditionsA[i]/selectedObjectWidth;
				
				// console.log("target size: " + _sizesA[i] + "\nartwork size: " + selectedObjectWidth + "\nscale factor: " + scaleFactor + "\n\n");

				let rendition;
				
				if(!settingsO["maintainTransparency"])
				// if(!maintainTransparency)
				{
					rendition = {node: selection.items[0], outputFile: file, type: application.RenditionType.PNG, scale: scaleFactor, background: new Color("#FFFFFF")};
				}
				else
				{
					rendition = {node: selection.items[0], outputFile: file, type: application.RenditionType.PNG, scale: scaleFactor};
				}
				
				// let rendition = {node: selection.items[0], outputFile: file, type: application.RenditionType.PNG, scale: scaleFactor};
				renditions.push(rendition);
			}
		}
		catch(_error)
		{
			console.log(_error);
		}
	}
	
	try
	{
		await application.createRenditions(renditions);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function replaceExistingAssets()
{
	// console.log("replaceExistingAssets()");
	
	try
	{
		await deleteAll(existingProjectFolder);
	}
	catch(_error)
	{
		console.log(_error);
	}

	// console.log("remove existing project folder");
	try
	{
		await existingProjectFolder.delete();
	}
	catch(_error)
	{
		// console.log("remove project folder error");
		console.log(_error);
	}
	// console.log("export icons from scratch");
	try
	{
		await exportAppIconOK();
	}
	catch(_error)
	{
		console.log(_error);
    }
}

async function deleteAll(_folder)
{
	// console.log("deleteAll()");

	// console.log("_folder: " + _folder);

	try
	{
		let entries = await _folder.getEntries();
		// let entries = await existingProjectFolder.getEntries();
		// console.log("existing folder content:");
		
		if(entries.length > 0)
		{
			for(let i = 0; i < entries.length; i++)
			{
				if(entries[i].isFile)
				{
					// console.log("found file: " + entries[i].name);
					try
					{
						// console.log("remove file: " + entries[i].name);
						await entries[i].delete();
					}
					catch(_error)
					{
						console.log(_error);
					}
				}
				else if(entries[i].isFolder)
				{
					// console.log("found folder: " + entries[i].name);
					try
					{
						// console.log("folder: " + entries[i].name);
						let folderEntries = await entries[i].getEntries();
						if(folderEntries.length > 0)
						{
							// delete files in each platform folder
							for(let j = 0; j < folderEntries.length; j++)
							{
								try
								{
									// deleteAll();
									await deleteAll(entries[i]);
									// console.log("call itself");
								}
								catch(_error)
								{
									console.log(_error);
								}
							}
							try
							{
								// console.log("remove folder: " + entries[i].name);
								await entries[i].delete();
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
			}
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels: {
		AppIconGenerator: {show, hide, update}
	}
};