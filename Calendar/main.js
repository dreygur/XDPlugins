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

var pluginTitle = "Calendar";

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

var languagesA;

var todayYear;
var todayMonthId;
var currentYear;
var currentMonthId;
var currentMonth;

var calendarMonthCellBkgColor = "#E6E6E6";
var calendarWeekdayCellBkgColor = "#EBEBEB";
var calendarDayCellBkgColor = "#F2F2F2";

var calendarCellTextColor = "#000000";
var calendarCellLightTextColor = "#AAAAAA";

var weekdaysA; // used to reorder the main array according to the week start options

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LANGUAGE MODULE
var languageModule = createModule("top", "LANGUAGE");
languageModule.style.marginTop = 0;
container.appendChild(languageModule);

// - - - - - - - - - - - - - - - - - - - - LANGUAGE MENU
var languageMenu = document.createElement("select");
languageMenu.style.width = "100%";
languageMenu.onchange = (e) => setLanguage();
languageModule.appendChild(languageMenu);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CELL SIZE MODULE
var cellSizeModule = createModule("internal", "CELL SIZE");
container.appendChild(cellSizeModule);

var cellSizeSettings = document.createElement("div");
cellSizeSettings.style.display = "flex";
cellSizeModule.appendChild(cellSizeSettings);

var cellWidthGroup = document.createElement("div");
cellWidthGroup.style.marginRight = 16;
cellWidthGroup.style.display = "flex";
cellWidthGroup.style.flexDirection = "row";
cellWidthGroup.style.alignItems = "center";
cellSizeSettings.appendChild(cellWidthGroup);

var cellWidthL = createLabelMini("W");
cellWidthL.style.color = labelQuietColor;
cellWidthGroup.appendChild(cellWidthL);

var cellWidthTF = createTextInput("", 40, true);
cellWidthTF.type = "number";
cellWidthTF.min = 10;
cellWidthTF.setAttribute("title", "Cell Width");
cellWidthTF.oninput = (e) => setCellWidth();
cellWidthGroup.appendChild(cellWidthTF);

var cellHeightGroup = document.createElement("div");
cellHeightGroup.style.display = "flex";
cellHeightGroup.style.flexDirection = "row";
cellHeightGroup.style.alignItems = "center";
cellSizeSettings.appendChild(cellHeightGroup);

var cellHeightL = createLabelMini("H");
cellHeightL.style.color = labelQuietColor;
cellHeightGroup.appendChild(cellHeightL);

var cellHeightTF = createTextInput("", 40, true);
cellHeightTF.type = "number";
cellHeightTF.min = 10;
cellHeightTF.setAttribute("title", "Cell Height");
cellHeightTF.oninput = (e) => setCellHeight();
cellHeightGroup.appendChild(cellHeightTF);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MONTH MODULE
var monthModule = createModule("internal", "MONTH");
container.appendChild(monthModule);

// - - - - - - - - - - - - - - - - - - - - MONTH SLIDER
var monthSlider = document.createElement("div");
monthSlider.style.display = "flex";
monthSlider.style.flexDirection = "row";
monthSlider.style.alignItems = "center";
monthSlider.style.justifyContent = "space-between";
monthSlider.style.margin = 0;
monthModule.appendChild(monthSlider);

var previousMonthB = createButton("", "action", true);
previousMonthB.setAttribute("title", "Previous month");
previousMonthB.onclick = (e) => previousMonth();
monthSlider.appendChild(previousMonthB);

var prevIcon = document.createElement("img");
prevIcon.src = "img/left.png";
previousMonthB.appendChild(prevIcon);

var monthBox = document.createElement("div");
monthBox.style.display = "flex";
monthBox.style.alignItems = "center";
monthBox.style.justifyContent = "center";
monthBox.style.height = 40;
monthBox.style.color = activeColor;
monthBox.style.fontSize = textFontSize;
monthBox.style.textAlign = "center";
monthSlider.appendChild(monthBox);

var nextMonthB = createButton("", "action", true);
nextMonthB.setAttribute("title", "Next month");
nextMonthB.onclick = (e) => nextMonth();
monthSlider.appendChild(nextMonthB);

var nextIcon = document.createElement("img");
nextIcon.src = "img/right.png";
nextMonthB.appendChild(nextIcon);

var todayRow = document.createElement("div");
todayRow.style.display = "flex";
todayRow.style.alignItems = "center";
todayRow.style.justifyContent = "center";
monthModule.appendChild(todayRow);

var todayB = createButton("Today", "action", false);
todayB.setAttribute("title", "Current month");
todayB.onclick = (e) => setToday();
todayB.disabled = true;
todayRow.appendChild(todayB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - WEEK MODULE
var weekModule = createModule("internal", "WEEK");
container.appendChild(weekModule);

// - - - - - - - - - - - - - - - - - - - - WEEK START LABEL
var weekStartL = createLabel("Week starts on:");
weekStartL.style.marginBottom = 12;
weekModule.appendChild(weekStartL);

// - - - - - - - - - - - - - - - - - - - - WEEK START RADIO BUTTONS
var weekStartRBGroup = document.createElement("div");
weekStartRBGroup.style.display = "flex";
weekStartRBGroup.style.flexDirection = "column";
// weekStartRBGroup.style.flexWrap = "wrap";
weekModule.appendChild(weekStartRBGroup);

var weekStartMondayRB = createRadioButton("weekStart", "Monday", "", true);
// weekStartMondayRB.style.marginRight = 50;
weekStartMondayRB.firstChild.value = "monday";
weekStartMondayRB.setAttribute("title", "Week starts on Monday");
weekStartMondayRB.firstChild.onchange = (e) => setWeekStart(weekStartMondayRB.firstChild.value);
weekStartRBGroup.appendChild(weekStartMondayRB);

var weekStartSundayRB = createRadioButton("weekStart", "Sunday", "", false);
weekStartSundayRB.firstChild.value = "sunday";
weekStartSundayRB.setAttribute("title", "Week starts on Sunday");
weekStartSundayRB.firstChild.onchange = (e) => setWeekStart(weekStartSundayRB.firstChild.value);
weekStartRBGroup.appendChild(weekStartSundayRB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - WEEKDAYS MODULE
var weekdaysModule = createModule("internal", "WEEKDAYS");
container.appendChild(weekdaysModule);

// - - - - - - - - - - - - - - - - - - - - NAME LETTERS RADIO BUTTONS
var weekdaysRBGroup = document.createElement("div");
weekdaysRBGroup.style.display = "flex";
weekdaysRBGroup.style.flexDirection = "column";
// weekdaysRBGroup.style.flexWrap = "wrap";
weekdaysModule.appendChild(weekdaysRBGroup);

var weekday1LetterRB = createRadioButton("weekdayLetters", "", "", true);
// weekday1LetterRB.style.marginRight = 50;
weekday1LetterRB.firstChild.value = "1";
weekday1LetterRB.setAttribute("title", "Use 1 letter for weekdays' name");
weekday1LetterRB.firstChild.onchange = (e) => setWeekdayLetters(weekday1LetterRB.firstChild.value);
weekdaysRBGroup.appendChild(weekday1LetterRB);

var weekday2LettersRB = createRadioButton("weekdayLetters", "", "", false);
// weekday2LettersRB.style.marginRight = 50;
weekday2LettersRB.firstChild.value = "2";
weekday2LettersRB.setAttribute("title", "Use 2 letters for weekdays' name");
weekday2LettersRB.firstChild.onchange = (e) => setWeekdayLetters(weekday2LettersRB.firstChild.value);
weekdaysRBGroup.appendChild(weekday2LettersRB);

var weekday3LettersRB = createRadioButton("weekdayLetters", "", "", false);
weekday3LettersRB.firstChild.value = "3";
weekday3LettersRB.setAttribute("title", "Use 3 letters for weekdays' name");
weekday3LettersRB.firstChild.onchange = (e) => setWeekdayLetters(weekday3LettersRB.firstChild.value);
weekdaysRBGroup.appendChild(weekday3LettersRB);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BOTTOM SEPARATOR
var bottomSeparator = createSeparator();
bottomSeparator.style.marginTop = 20;
container.appendChild(bottomSeparator);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FOOTER
var footer = document.createElement("footer");
// footer.style.marginTop = 100;
container.appendChild(footer);

var okB = createButton("Make Calendar", "cta");
okB.id = "makeCalendar";
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

	// set the actual year and actual month
	let d = new Date();
	todayYear = d.getFullYear();
	todayMonthId = d.getMonth();
	// console.log("todayYear: " + todayYear);
	// console.log("todayMonthId: " + todayMonthId);
	
	if(currentYear == null)
	{
		currentYear = todayYear;
	}
	// console.log("currentYear: " + currentYear);

	if(currentMonthId == null)
	{
		currentMonthId = todayMonthId;
	}
	// console.log("currentMonthId: " + currentMonthId);

	// get db
	try
	{
		await getDB();
	}
	catch(_error)
	{
		console.log(_error);
	}

	getLanguages();

	cellWidthTF.value = settingsO["cellWidth"];
	cellHeightTF.value = settingsO["cellHeight"];
	
	setWeekdaysOrder(settingsO["weekStart"]);

	setWeekdayLetters(settingsO["weekdayLetters"]);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{	
	// console.log("checkSelection()");
	let alertDialogMessage = "Select an Artboard or an object that is directly in the Artboard, excluding objects inside Repeat Grids or groups.";
	
	if(selection.focusedArtboard == null)
	{
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
	if(selection.items.length > 0)
	{
		if(selection.items[0].parent.constructor.name == "Group")
		{
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

	editDocument({editLabel: "Make Calendar"}, async() =>
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
					let c = await checkCellSize();
					if(c == false)
					{
						return;
					}
					buildCalendarOK();
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

async function checkCellSize()
{
	// console.log("checkCellSize()");

	if(cellWidthTF.value === "")
	{
		try
		{
			cellWidthTF.focus();
			await openAlertDialog(pluginTitle, "Insert cell width.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	if(cellHeightTF.value === "")
	{
		try
		{
			cellHeightTF.focus();
			await openAlertDialog(pluginTitle, "Insert cell height.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if width or height contain numbers
	if(!checkTextFieldNumber(cellWidthTF.value.toString()))
	{
		try
		{
			cellWidthTF.focus();
			await openAlertDialog(pluginTitle, "Cell width must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	if(!checkTextFieldNumber(cellHeightTF.value.toString()))
	{
		try
		{
			cellHeightTF.focus();
			await openAlertDialog(pluginTitle, "Cell height must be a positive integer number.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	// check if calendar cell is at least 10 x 10
	if(settingsO["cellWidth"] < 10)
	{
		try
		{
			cellWidthTF.focus();
			await openAlertDialog(pluginTitle, "Cell width must be at least 10 px.");
			// return false;
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	if(settingsO["cellHeight"] < 10)
	{
		try
		{
			cellHeightTF.focus();
			await openAlertDialog(pluginTitle, "Cell height must be at least 10 px.");
			// return false;
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	return true;
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

function createRadioButton(_group, _text, _width, _checked)
{
    let newRadioButton = document.createElement("label");
	newRadioButton.style.display = "flex";
	newRadioButton.style.flexDirection = "row";
	newRadioButton.style.alignItems = "center";
	
	let radioButton = document.createElement("input");
	radioButton.name = _group;
	radioButton.type = "radio";
	if (_checked)
	{
        radioButton.checked = true;
    }
	newRadioButton.appendChild(radioButton);
	
	let radioButtonLabel = createLabel(_text);
	radioButtonLabel.style.marginLeft = 6;
	radioButtonLabel.style.width = _width;
    newRadioButton.appendChild(radioButtonLabel);
	
    return newRadioButton;
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

// - - - - - - - - - - - - - - - - - - - - SCENEGRAPH
function createCell(_text, _textColor, _fontSize, _bkgColor)
{
	// console.log(daysEngA[i]);
	
	let cellBkg = new Rectangle();
	cellBkg.width = settingsO["cellWidth"];
	cellBkg.height = settingsO["cellHeight"];
	cellBkg.fill = new Color(_bkgColor);
	selection.insertionParent.addChild(cellBkg);

	let cellTxt = new Text();
	cellTxt.text = _text;
	cellTxt.textAlign = "center";
	cellTxt.fill = new Color(_textColor);
	cellTxt.fontSize = _fontSize;
	
	selection.insertionParent.addChild(cellTxt);

	let cellBkgCenter = cellBkg.localCenterPoint;
	let cellTxtTopLeft = {x: 0, y: 0};
	let cellTxtX = cellBkgCenter.x;
	let cellTxtY = cellBkgCenter.y;
	cellTxt.placeInParentCoordinates(cellTxtTopLeft, {x: cellTxtX, y: cellTxtY});

	selection.items = [cellBkg, cellTxt];
	commands.alignVerticalCenter();
	commands.group();
	return selection.items[0];
}

function drawPath(_pathData, _fillColor, _fillEnabled, _strokeColor, _strokeWidth, _strokeEnabled)
{
	// console.log("drawPath()");

	let path = new Path();
	path.pathData = _pathData;
	path.fill = new Color(_fillColor);
	path.fillEnabled = _fillEnabled;
	path.stroke = new Color(_strokeColor);
	path.strokeWidth = _strokeWidth;
	path.strokeEnabled = _strokeEnabled;
	return path;
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

async function getDB()
{
	// console.log("getDB()");

	try
	{
		// console.log("get plugin folder");
		pluginFolder = await localFileSystem.getPluginFolder();
		try
		{
			// console.log("get languages file");
			let dbFile = await pluginFolder.getEntry("languagesDB.json");
			try
			{
				// console.log("read languages file");
				let jsonLanguages = await dbFile.read();
				languagesA = JSON.parse(jsonLanguages);
				// console.log(languagesA);
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

function getLanguages()
{
	// console.log("getLanguages()");
	
	languageMenu.innerHTML = "";
	for (let i = 0; i < languagesA.length; i++)
	{
		let option = document.createElement("option");
		option.value = languagesA[i]["language"];
		option.textContent = option.value;
		languageMenu.appendChild(option);
	}
	languageMenu.selectedIndex = settingsO["languageId"];

	setLanguage();
}

async function setDefaultSettings()
{
	// console.log("setDefaultSettings()");
	// console.log("renditionsA: ", renditionsA);
	try
	{
		// console.log("get data folder");
		dataFolder = await localFileSystem.getDataFolder();
		
		try
		{
			// console.log("get settings file");
			settingsFile = await dataFolder.getEntry("settings.json");
		}
		catch(_error)
		{
			// console.log(_error);
			// console.log("settings file not found");
			try
			{
				settingsFile = await dataFolder.createFile("settings.json", {overwrite: true});

				try
				{
					let defaultSettingsO = {};

					defaultSettingsO["languageId"] = 3; // English as default
					defaultSettingsO["cellWidth"] = 30;
					defaultSettingsO["cellHeight"] = 30;
					// defaultSettingsO["month"] = ""; // * * * TO BE SAVED?
					defaultSettingsO["weekStart"] = "monday";
					defaultSettingsO["weekdayLetters"] = "1"; // * * * CHANGE TO "weekdayLetters"

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
	// console.log("settingsO: " + settingsO);	
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

function setLanguage()
{
	// console.log("setLanguage()");

	currentMonth = languagesA[settingsO["languageId"]]["months"][currentMonthId];
	// monthBox.textContent = currentMonth + "\n" + currentYear;
	monthBox.textContent = currentMonth + " " + currentYear;

	settingsO["languageId"] = languageMenu.selectedIndex;

	setMonthLanguage();
	setWeekStartDaysLanguage();
	
	setWeekStart(settingsO["weekStart"]);

	setWeekdaysLanguage();
}

function setCellWidth()
{
	// console.log("setCellWidth()");

	if(checkTextFieldNumber(cellWidthTF.value.toString()) && cellWidthTF.value >= 0)
	{
		settingsO["cellWidth"] = Number(cellWidthTF.value);
	}
}

function setCellHeight()
{
	// console.log("setCellHeight()");

	if(checkTextFieldNumber(cellHeightTF.value.toString()) && cellHeightTF.value >= 0)
	{
		settingsO["cellHeight"] = Number(cellHeightTF.value);
	}
}

function setMonthLanguage()
{
	// console.log("setMonthLanguage()");

	let languageId = settingsO["languageId"];

	currentMonth = languagesA[languageId]["months"][currentMonthId];
	monthBox.textContent = currentMonth + " " + currentYear;
}

function previousMonth()
{
	// console.log("previousMonth()");
	
	if (currentMonthId == 0)
	{
		currentMonthId = 11;
		currentYear -= 1;
	}
	else
	{
		currentMonthId -= 1;
	}
	
	currentMonth = languagesA[settingsO["languageId"]]["months"][currentMonthId];
	monthBox.textContent = currentMonth + " " + currentYear;

	// if it's today month disable button
	if(currentYear == todayYear && currentMonthId == todayMonthId)
	{
		// console.log("it's today: disable today button");
		todayB.disabled = true;
	}
	else
	{
		todayB.disabled = false;
	}
}

function nextMonth()
{
	// console.log("nextMonth()");

	if (currentMonthId == 11)
	{
		currentMonthId = 0;
		currentYear += 1;
	}
	else
	{
		currentMonthId += 1;
	}
	
	currentMonth = languagesA[settingsO["languageId"]]["months"][currentMonthId];
	monthBox.textContent = currentMonth + " " + currentYear;

	// if it's today month disable button
	if(currentYear == todayYear && currentMonthId == todayMonthId)
	{
		// console.log("it's today: disable today button");
		todayB.disabled = true;
	}
	else
	{
		todayB.disabled = false;
	}
}

function setToday()
{
	// console.log("setToday()");

	currentYear = todayYear;
	currentMonthId = todayMonthId;
	currentMonth = languagesA[settingsO["languageId"]]["months"][currentMonthId];

	// console.log("todayYear: " + todayYear);
	// console.log("todayMonthId: " + todayMonthId);
	// console.log("currentMonth: " + currentMonth);

	monthBox.textContent = currentMonth + "\n" + currentYear;
	todayB.disabled = true;
}

function setWeekStartDaysLanguage()
{
	// console.log("setWeekStartDaysLanguage()");
	
	let weekdaysReferenceA = languagesA[settingsO["languageId"]]["weekdays"];
	weekStartMondayRB.firstChild.nextSibling.textContent = weekdaysReferenceA[0];
	weekStartSundayRB.firstChild.nextSibling.textContent = weekdaysReferenceA[6];
}

function setWeekdaysLanguage()
{
	// console.log("setWeekdaysLanguage()");
	
	let initialsLabel = weekday1LetterRB.firstChild.nextSibling;
    initialsLabel.textContent = "";
    
    let weekday2LettersLabel = weekday2LettersRB.firstChild.nextSibling;
    weekday2LettersLabel.textContent = "";

	let wordsLabel = weekday3LettersRB.firstChild.nextSibling;
	wordsLabel.textContent = "";

	for(let i = 0; i < 3; i++)
	{
		let weekday = weekdaysA[i];
        let weekdayInitial = weekday.substring(0, 1);
        let weekday2letters = weekday.substring(0, 2);
		let weekdayWord = weekday.substring(0, 3);

        initialsLabel.textContent += weekdayInitial;
        weekday2LettersLabel.textContent += weekday2letters;
		wordsLabel.textContent += weekdayWord;

		if(i < 2)
		{
            initialsLabel.textContent += " ";
            weekday2LettersLabel.textContent += " ";
			wordsLabel.textContent += " ";
		}
	}
    initialsLabel.textContent += " ...";
    weekday2LettersLabel.textContent += " ...";
	wordsLabel.textContent += " ...";
}

function getWeekdayString(_weekdayId)
{
    // console.log("getWeekdayString()");

    let weekdayString = "";
	let weekday = weekdaysA[_weekdayId];
    // console.log("weekday: " + weekday);
    
    weekdayString = weekday.substring(0, settingsO["weekdayLetters"]);

	/* switch (settingsO["weekdayLetters"])
	{
		case "1":
			weekdayString = weekday.substring(0, 1);
            break;
            
        case "2":
			weekdayString = weekday.substring(0, 2);
			break;

		case "3":
			weekdayString = weekday.substring(0, 3);
			break;
	} */

	return weekdayString;
}

function setWeekStart(_day)
{
	// console.log("setWeekStart(): " + _day);

	switch(_day)
	{
		case "monday":			
			weekStartMondayRB.firstChild.checked = true;
			weekStartSundayRB.firstChild.checked = false;
			break;
			
		case "sunday":
			weekStartMondayRB.firstChild.checked = false;	
			weekStartSundayRB.firstChild.checked = true;
			break;
	}

	setWeekdaysOrder(_day);
	setWeekdaysLanguage();

	settingsO["weekStart"] = _day;
}

function setWeekdaysOrder(_day)
{
	// console.log("setWeekdaysOrder()");

	// get reference to weekdays array into languages array
	let weekdaysReferenceA = languagesA[settingsO["languageId"]]["weekdays"];
	// console.log(weekdaysReferenceA);
	switch(_day)
	{
		case "monday":			
			// leave weekdays array unchanged
			weekdaysA = weekdaysReferenceA;
			// console.log(weekdaysA);
			break;
			
		case "sunday":
			// reorder weekdays array
			weekdaysA = [weekdaysReferenceA[6], weekdaysReferenceA[0], weekdaysReferenceA[1], weekdaysReferenceA[2], weekdaysReferenceA[3], weekdaysReferenceA[4], weekdaysReferenceA[5]];
			// console.log(weekdaysA);
			break;
	}
}

function setWeekdayLetters(_letters)
{
	// console.log("setWeekdayLetters()");

	/* switch(_letters)
	{
		case "1":
			weekdayInitialsRB.firstChild.checked = true;
			weekdayWordsRB.firstChild.checked = false;
            break;
            
        case "2":
			weekdayInitialsRB.firstChild.checked = true;
			weekdayWordsRB.firstChild.checked = false;
			break;
			
		case "3":
			weekdayInitialsRB.firstChild.checked = false;	
			weekdayWordsRB.firstChild.checked = true;
			break;
	} */

	settingsO["weekdayLetters"] = _letters;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK ACTIONS
function buildCalendarOK()
{
	// console.log("buildCalendarOK()");

	// console.log("cellWidth: " + cellWidth);
	// console.log("cellHeight: " + cellHeight);

	// check minimum cell size value between width and height
	let minCellSizeValue = Math.min(settingsO["cellWidth"], settingsO["cellHeight"]);
	// console.log("minCellSizeValue: " + minCellSizeValue);

	// console.log("currentYear: " + currentYear);
	// console.log("currentMonthId: " + currentMonthId);
	// console.log("currentMonth: " + currentMonth);

	// first day of the week in the selected month
	let firstDayOfMonthId = new Date(currentYear, currentMonthId, 1).getDay();
	// console.log("firstDayOfMonthId: " + firstDayOfMonthId);
	// console.log("firstDayOfMonth: " + languagesA[currentLanguageId]["weekdays"][firstDayOfMonthId]);

	let firstWeekdayId;
			
	if(firstDayOfMonthId == 0)
	{
		// console.log("firstDayOfMonth is Sunday");
		switch(settingsO["weekStart"])
		{
			case "monday":			
				// set first day as the last day of the week
				firstWeekdayId = 7;
				break;
				
			case "sunday":
				firstWeekdayId = 0;
				break;
		}
	}
	else
	{
		firstWeekdayId = firstDayOfMonthId;
	}
	
	// console.log("firstWeekdayId: " + firstWeekdayId);
	// console.log("firstWeekday: " + languagesA[currentLanguageId]["weekdays"][firstWeekdayId]);

	// number of days in current month
	var currentMonthDays = new Date(currentYear, currentMonthId + 1, 0).getDate();
	// console.log("currentMonthDays: " + currentMonthDays);

	// number of days in previous month
	var previousMonthDays = new Date(currentYear, currentMonthId, 0).getDate();
	// console.log("previousMonthDays: " + previousMonthDays);

	// - - - - - - - - - - - - - - - - - - - CALENDAR ELEMENTS ARRAY
	// store all calendar elements for grouping all at once later
	let calendarElementsA = [];

	// - - - - - - - - - - - - - - - - - - - MONTH
	let monthBkg = new Rectangle();
	monthBkg.width = settingsO["cellWidth"] * 7;
	monthBkg.height = settingsO["cellHeight"];
	monthBkg.fill = new Color(calendarMonthCellBkgColor);
	selection.insertionParent.addChild(monthBkg);

	let monthTxt = new Text();
	monthTxt.text = currentMonth + " " + currentYear;
	monthTxt.textAlign = "center";
	monthTxt.fill = new Color(calendarCellTextColor);
	monthTxt.fontSize = minCellSizeValue / 2.5 + 1;
	selection.insertionParent.addChild(monthTxt);

	let monthBkgCenter = monthBkg.localCenterPoint;
	let monthTxtTopLeft = {x: 0, y: 0};
	let monthTxtX = monthBkgCenter.x;
	let monthTxtY = monthBkgCenter.y;
	monthTxt.placeInParentCoordinates(monthTxtTopLeft, {x: monthTxtX, y: monthTxtY});

	// - - - - - - - - - - - - - - - - - - - CHEVRONS
	let chevronSize = Math.round(minCellSizeValue / 6);
	// console.log("chevronSize: " + chevronSize);
	let chevronStrokeWidth = minCellSizeValue / 25;
	// console.log("chevronStrokeWidth: " + chevronStrokeWidth);

	let chevronLeftPathData =
	`
		l${-chevronSize},${chevronSize}
		l${chevronSize},${chevronSize}
	`;
	let leftChevron = drawPath(chevronLeftPathData, "#000000", false, "#000000", chevronStrokeWidth, true);
	selection.insertionParent.addChild(leftChevron);

	let leftChevronX = (settingsO["cellWidth"] / 2) + (chevronSize / 2);
	let leftChevronY = monthBkg.localBounds.y;
	leftChevron.placeInParentCoordinates({x: 0, y: 0}, {x: leftChevronX, y: leftChevronY});

	let chevronRightPathData =
	`
		l${chevronSize},${chevronSize}
		l${-chevronSize},${chevronSize}
	`;
	let rightChevron = drawPath(chevronRightPathData, "#000000", false, "#000000", chevronStrokeWidth, true);
	selection.insertionParent.addChild(rightChevron);

	let rightChevronX = monthBkg.localBounds.width - (settingsO["cellWidth"] / 2) - (chevronSize / 2);
	let rightChevronY = monthBkg.localBounds.y;
	rightChevron.placeInParentCoordinates({x: 0, y: 0}, {x: rightChevronX, y: rightChevronY});

	selection.items = [monthBkg, monthTxt, leftChevron, rightChevron];
	commands.alignVerticalCenter();
	commands.group();
	// add month header to calendar elements array
	calendarElementsA.push(selection.items[0]);

	// - - - - - - - - - - - - - - - - - - - WEEKDAYS
	for(let i = 0; i < 7; i++)
	{
		let weekdayCell = createCell(getWeekdayString(i), calendarCellTextColor, (minCellSizeValue / 2.5 - 1), calendarWeekdayCellBkgColor);
		
		let weekdayCellTopLeft = {x: 0, y: 0};
		let weekdayCellX = settingsO["cellWidth"] * i;
		let weekdayCellY = settingsO["cellHeight"];
		
		weekdayCell.placeInParentCoordinates(weekdayCellTopLeft, {x: weekdayCellX, y: weekdayCellY});
		// add weekday cells to calendar elements array
		calendarElementsA.push(weekdayCell);
	}
	
	
	// - - - - - - - - - - - - - - - - - - - DAYS
	// default day variables
	let currentMonthDayNumber = 1; // current month days
	let previousMonthDayNumber = 1; // previous month days
	let nextMonthDayNumber = 1; // next month days

	// weeks loop
	for(var i = 0; i < 9; i++)
	{
		// console.log("week: " + i);
		
		// weekdays loop
		let startId;
		let endId;

		switch(settingsO["weekStart"])
		{
			case "monday":
				startId = 1;	
				endId = 7;
				break;
			
			case "sunday":
				startId = 0;	
				endId = 6;
				break;
		}

		for(var j = startId; j <= endId; j++)
		{
			let dayCellX;
			switch(settingsO["weekStart"])
			{
				case "monday":
					dayCellX = settingsO["cellWidth"] * (j - 1);
					break;
				
				case "sunday":
					dayCellX = settingsO["cellWidth"] * j;
					break;
			}
			let dayCellY = (settingsO["cellHeight"] * 2) + settingsO["cellHeight"] * i;
			
			if (currentMonthDayNumber <= currentMonthDays && (i > 0 || j >= firstWeekdayId))
			{
				// current month
				// console.log(currentMonthDayNumber);

				let dayCell = createCell(currentMonthDayNumber.toString(), calendarCellTextColor, minCellSizeValue / 2.5, calendarDayCellBkgColor);
				let dayCellTopLeft = {x: 0, y: 0};
				
				dayCell.placeInParentCoordinates(dayCellTopLeft, {x: dayCellX, y: dayCellY});
				// add day cells to calendar elements array
				calendarElementsA.push(dayCell);
				currentMonthDayNumber++;
			}
			else
			{
				if (currentMonthDayNumber <= currentMonthDays)
				{
					// previous month
					// console.log("previous month");
					let dayNumber;
					switch(settingsO["weekStart"])
					{
						case "monday":
							dayNumber = previousMonthDays - firstWeekdayId + previousMonthDayNumber + 1;	
							break;
						
						case "sunday":
							dayNumber = previousMonthDays - firstWeekdayId + previousMonthDayNumber;	
							break;
					}

					let dayCell = createCell(dayNumber.toString(), calendarCellLightTextColor, minCellSizeValue / 2.5, calendarDayCellBkgColor);
					let dayCellTopLeft = {x: 0, y: 0};
					
					dayCell.placeInParentCoordinates(dayCellTopLeft, {x: dayCellX, y: dayCellY});
					// add day cells to calendar elements array
					calendarElementsA.push(dayCell);
					previousMonthDayNumber++;
				}
				else
				{
					// next month
					let dayCell = createCell(nextMonthDayNumber.toString(), calendarCellLightTextColor, minCellSizeValue / 2.5, calendarDayCellBkgColor);
					let dayCellTopLeft = {x: 0, y: 0};
					
					dayCell.placeInParentCoordinates(dayCellTopLeft, {x: dayCellX, y: dayCellY});
					// add day cells to calendar elements array
					calendarElementsA.push(dayCell);
					nextMonthDayNumber++;
				}
			}
		}		

		// if it's the end of month stop making rows 
		if (currentMonthDayNumber > currentMonthDays)
		{
			// console.log("grid end");
			break;
		}
	}
	// add all calendar elements to  selection items
	selection.items = calendarElementsA;
	commands.ungroup();
	commands.group();

	// center calendar to artboard
	let calendar = selection.items[0];
	let artboardCenter = calendar.parent.localCenterPoint;
	let calendarTopLeft = {x: 0, y: 0};
	let calendarBounds = calendar.localBounds;
	let calendarX = artboardCenter.x - (calendarBounds.width / 2);
	let calendarY = artboardCenter.y - (calendarBounds.height / 2);
	
	calendar.placeInParentCoordinates(calendarTopLeft, {x: calendarX, y: calendarY});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels: {
		Calendar: {show, hide, update}
	}
};









