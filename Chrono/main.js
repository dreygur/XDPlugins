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

var pluginTitle = "Chrono";

var labelFontSizeMini = 9;
var labelFontSize = 10;
var textFontSize = 11;

var activeColor = "#2680EB";
var inactiveColor = "#A0A0A0";
var activeBkgColor = "#E2E2E2";
var lightBkgColor = "#FBFBFB";
var labelQuietColor = "#999999";
var separatorColor = "#E4E4E4";
var errorColor = "#FF0000";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONTAINER
var container = document.createElement("div");

var timerStartDate;

var updateInterval;


var pluginDataO = {};
pluginDataO["seconds"] = 0;
pluginDataO["taskId"] = 0; // primary key counter
pluginDataO["tasks"] = [];

var currentTaskO = {};

var timerRunning;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PROJECT CONTAINER
var project = document.createElement("div");
container.appendChild(project);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PROJECT MODULE
var projectModule = createModule("top", "PROJECT");
projectModule.style.marginTop = 0;
project.appendChild(projectModule);

var projectNameL = createLabel(application.activeDocument.name);
projectNameL.style.fontWeight = "bold";
projectModule.appendChild(projectNameL);

var projectTimerL = createLabel("0h 0m 0s");
projectTimerL.style.marginTop = 6;
projectTimerL.style.fontWeight = "bold";
// projectTimerL.style.color = labelQuietColor;
projectModule.appendChild(projectTimerL);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - TASK MODULE
var taskModule = createModule("internal", "TASKS");
project.appendChild(taskModule);

var taskBar = document.createElement("div");
taskBar.style.display = "flex";
// taskBar.style.flexDirection = "row";
taskBar.style.justifyContent = "space-between";
taskBar.style.alignItems = "center";
// taskBar.style.marginTop = -10;
taskBar.style.marginBottom = 6;
// taskBar.style.background = "#CCCCCC";
taskModule.appendChild(taskBar);

var newTaskB = createButton("New Task", "action", false);
newTaskB.style.margin = 0;
// newTaskB.style.margin = "-10px auto 0px auto";
newTaskB.setAttribute("title", "Create a New Task");
newTaskB.onclick = (e) => newTask();
// newTaskB.onclick = (e) => editTask();
// newTaskB.addEventListener("click", newTask);
taskBar.appendChild(newTaskB);

var exportCsvB = createButton("", "action", true);
exportCsvB.style.margin = 0;
// exportCsvB.style.margin = "-10px auto 0px auto";
exportCsvB.setAttribute("title", "Export Tasks as CSV");
exportCsvB.onclick = (e) => exportCsv();
// newTaskB.addEventListener("click", newTask);
taskBar.appendChild(exportCsvB);

var exportCsvIcon = document.createElement("img");
exportCsvIcon.src = "img/export.png";
exportCsvB.appendChild(exportCsvIcon);

/* var newTaskB = createButton("", "action", true);
newTaskB.style.margin = "-10px auto 0px auto";
newTaskB.setAttribute("title", "Add Task");
newTaskB.onclick = (e) => newTask();
// newTaskB.addEventListener("click", newTask);
taskBar.appendChild(newTaskB);

var newTaskIcon = document.createElement("img");
newTaskIcon.src = "img/plus.png";
newTaskB.appendChild(newTaskIcon); */

/* var newTaskB = createButton("", "action", true);
newTaskB.style.margin = "-10px auto 0px auto";
newTaskB.setAttribute("title", "Add Task");
newTaskB.onclick = (e) => newTask();
// newTaskB.addEventListener("click", newTask);
taskBar.appendChild(newTaskB);

var newTaskIcon = document.createElement("img");
newTaskIcon.src = "img/plus.png";
newTaskB.appendChild(newTaskIcon); */

var taskList = document.createElement("div");
taskModule.appendChild(taskList);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - TASK EDITOR
var taskEditor = document.createElement("div");
taskEditor.style.display = "none";
container.appendChild(taskEditor);

var taskEditorHeader = document.createElement("div");
taskEditorHeader.style.display = "flex";
taskEditorHeader.style.flexDirection = "row";
taskEditorHeader.style.justifyContent = "flex-end";
// taskEditorHeader.style.justifyContent = "center";
taskEditorHeader.style.alignItems = "center";
// taskEditorHeader.style.marginBottom = 10;
// taskEditorHeader.setAttribute("title", "Back to Project");
// taskEditorHeader.onclick = (e) => closeTask();
taskEditor.appendChild(taskEditorHeader);

/* var taskEditorTitleL = createLabelMini("TASK");
// taskEditorTitleL.style.marginBottom = 20;
taskEditorTitleL.style.color = labelQuietColor;
// taskEditorTitleL.style.letterSpacing = 1.3;
taskEditorHeader.appendChild(taskEditorTitleL); */

var closeTaskB = createButton("", "action", true);
// closeTaskB.style.marginTop = -4;
// closeTaskB.style.marginTop = -6;
// closeTaskB.style.marginRight = -1;
// closeTaskB.style.margin = "-10px auto 14px auto";
closeTaskB.setAttribute("title", "Close Task");
// closeTaskB.setAttribute("title", "Back to Project");

closeTaskB.onclick = (e) =>
{
    // setTaskName();
    // taskNameTF.blur();

    if(timerRunning)
    {
        // console.log("timer is running - open alert dialog");
        taskNameTF.blur();
        
        openAlertDialog("closeTask", pluginTitle, "Timer is running for this task: it will be paused.<br>Are you sure to close this task?");
    }
    else
    {
        // console.log("timer is not running - close task");
        
        currentTaskO["name"] = taskNameTF.value;
        editDocument({editLabel: "Save Task Name"}, async() =>
        {
            // root.pluginData["tasks"].push(taskO);
            root.pluginData = pluginDataO;
        });
        closeTask();
    }
}

/* closeTaskB.addEventListener("click", function()
{
    if(timerRunning)
    {
        console.log("timer is running - open alert dialog");
        openAlertDialog("closeTask", pluginTitle, "Timer is running for this task: it will be paused.<br>Are you sure to close this task?");
    }
    else
    {
        console.log("timer is not running - close task");
        closeTask();
    }
}); */

taskEditorHeader.appendChild(closeTaskB);

var closeTaskIcon = document.createElement("img");
// closeTaskIcon.style.marginRight = 5;
closeTaskIcon.src = "img/x.png";
closeTaskB.appendChild(closeTaskIcon);

var taskNameTF = createTextInput("", "100%", true);
taskNameTF.style.margin = "-6px 0px 0px 0px";
/* taskNameTF.style.marginTop = -20;
taskNameTF.style.marginLeft = 0; */
// * * * taskNameTF.oninput = (e) => setTaskName();

taskNameTF.onchange = (e) =>
{
    // console.log("onchange()");

    if(taskNameTF.value == "")
    {
        // console.log("restore task name: " + currentTaskO["name"]);
        // console.log(currentTaskO["name"]);
        taskNameTF.value = currentTaskO["name"];
    }
    else
    {
        // console.log("save task name: " + taskNameTF.value);

        currentTaskO["name"] = taskNameTF.value;
        editDocument({editLabel: "Save Task Name"}, async() =>
        {
            // root.pluginData["tasks"].push(taskO);
            root.pluginData = pluginDataO;
        });
    }
}
// taskNameTF.onfocus = (e) => console.log("onfocus"); // supported
// taskNameTF.onfocusout = (e) => console.log("onfocusout"); // not supported yet
// taskNameTF.onblur = (e) => console.log("onblur"); // not supported yet

taskEditor.appendChild(taskNameTF);

var taskConsole = document.createElement("div");
taskConsole.style.display = "flex";
taskConsole.style.flexDirection = "row";
taskConsole.style.justifyContent = "space-between";
taskConsole.style.alignItems = "center";
taskConsole.style.marginTop = 6;
taskEditor.appendChild(taskConsole);

var taskTimerL = createLabel("0h 0m 0s");
// taskTimerL.style.marginTop = 6;
// projectTimerL.style.fontWeight = "bold";
taskConsole.appendChild(taskTimerL);

var taskControls = document.createElement("div");
taskControls.style.display = "flex";
taskControls.style.flexDirection = "row";
// taskControls.style.marginRight = -6;
taskConsole.appendChild(taskControls);

var startTaskB = createButton("", "action", true);
startTaskB.setAttribute("title", "Start Timer");
startTaskB.style.marginRight = -6;
startTaskB.onclick = (e) => startTimer();
taskControls.appendChild(startTaskB);

var startTaskIcon = document.createElement("img");
startTaskIcon.src = "img/play.png";
startTaskB.appendChild(startTaskIcon);

var stopTaskB = createButton("", "action", true);
stopTaskB.setAttribute("title", "Stop and Reset Timer");
// stopTaskB.onclick = (e) => openAlertDialog("stopTimer", pluginTitle, "Stopping this timer will reset it.<br>Are you sure?");

stopTaskB.onclick = (e) =>
{
    taskNameTF.blur();
    openAlertDialog("stopTimer", pluginTitle, "Stopping this timer will reset it.<br>Are you sure?");
}

stopTaskB.style.opacity = .4; // Windows fix (disabling buttons doesn't dim icon)
stopTaskB.disabled = true;
taskControls.appendChild(stopTaskB);

var stopTaskIcon = document.createElement("img");
stopTaskIcon.src = "img/stop.png";
stopTaskB.appendChild(stopTaskIcon);

var taskInfo = document.createElement("div");
taskInfo.style.marginTop = 10;
taskInfo.style.padding = "10px 0px";
taskInfo.style.borderTop = "1px solid";
taskInfo.style.borderColor = separatorColor;
taskEditor.appendChild(taskInfo);

var taskStartedLabelL = createLabelMini("Started");
taskStartedLabelL.style.marginBottom = 8;
taskStartedLabelL.style.color = labelQuietColor;
taskEditor.appendChild(taskStartedLabelL);

var taskStartedValueL = createLabel("—");
taskEditor.appendChild(taskStartedValueL);

var taskEditorFooter = document.createElement("div");
taskEditorFooter.style.display = "flex";
taskEditorFooter.style.justifyContent = "flex-end";
// taskEditorFooter.style.justifyContent = "center";
taskEditorFooter.style.marginTop = 20;
taskEditorFooter.style.borderTop = "1px solid";
taskEditorFooter.style.borderColor = separatorColor;
taskEditor.appendChild(taskEditorFooter);

var deleteTaskB = createButton("", "action", true);
deleteTaskB.setAttribute("title", "Delete Task");
// deleteTaskB.onclick = (e) => openAlertDialog("deleteTask", pluginTitle, "Are you sure to delete the '" + currentTaskO["name"] + "' task?");

deleteTaskB.onclick = (e) =>
{
    taskNameTF.blur();
    if(taskNameTF.value == "")
    {
        taskNameTF.value = currentTaskO["name"];
        // taskNameTF.blur();
    }

    openAlertDialog("deleteTask", pluginTitle, "Are you sure to delete the '" + taskNameTF.value + "' task?");
    // openAlertDialog("deleteTask", pluginTitle, "Are you sure to delete the '" + currentTaskO["name"] + "' task?");
}

taskEditorFooter.appendChild(deleteTaskB);

var deleteIcon = document.createElement("img");
deleteIcon.src = "img/trash.png";
deleteTaskB.appendChild(deleteIcon);

var warningMessage = createLabel("IMPORTANT: remember to pause the running timer before closing this document or quitting XD. Otherwise, the current progress will be lost.");
warningMessage.style.marginTop = 4;
warningMessage.style.paddingTop = 10;
warningMessage.style.borderTop = "1px solid";
warningMessage.style.borderColor = separatorColor;
warningMessage.style.color = activeColor;
warningMessage.style.lineHeight = 1.5;
warningMessage.style.display = "none";
taskEditor.appendChild(warningMessage);

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

function hide(_e)
{
    // console.log("hide()");
    
    /* console.log(root.pluginData);
    console.log(currentTaskO); */
    
    if(updateInterval)
    {
        // console.log("timer is running -> pause updating timer)");
        // console.log("update paused at: " + taskTimerL.textContent);
        clearInterval(updateInterval);
        updateInterval = null;
        // panelHidden = true;
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
    if(root.pluginData)
    {
        // console.log("pluginData already set");
        // console.log("pluginData:", root.pluginData);

        // if no task is being edited
        if(JSON.stringify(currentTaskO) === '{}')
        {
            pluginDataO = root.pluginData;
            projectTimerL.textContent = getTimerString(pluginDataO["seconds"]);
            getTasks();
        }
        else
        {
            // console.log("task open");
            // check if updating time display
            if(updateInterval == null)
            {
                // console.log("plugins panel was closed by hide()");
                // check if timer is running
                if(timerRunning)
                {
                    // console.log("timer is running -> resume updating time display");
                    updateTimer();
                    updateInterval = setInterval(updateTimer, 1000);
                }
                else
                {
                    // console.log("timer has been paused -> get totalSeconds from pluginData");
                }
            }
        }
    }
    else
    {
        // console.log("no pluginData");
        exportCsvB.style.opacity = .4; // Windows fix (disabling buttons doesn't dim icon)
        exportCsvB.disabled = true;
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK

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
	separator.style.marginBottom = 20;
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
    let alertCancelB;

	switch(_type)
	{
		case "alert":
			alertOkB = createButton("OK", "cta", false);
			alertOkB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertOkB);
            break;
        
        case "stopTimer":
			alertCancelB = createButton("Cancel");
			alertCancelB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertCancelB);

			alertOkB = createButton("Stop Timer", "warning", false);
            alertOkB.setAttribute("type", "submit");
            alertOkB.onclick = (e) => stopTimer();
			alertFooter.appendChild(alertOkB);
            break;
            
        case "closeTask":
			alertCancelB = createButton("Cancel");
			alertCancelB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertCancelB);

			alertOkB = createButton("Close Task", "warning", false);
            alertOkB.onclick = (e) => closeTask();
            alertOkB.setAttribute("type", "submit");
			alertFooter.appendChild(alertOkB);
			break;
            
        case "deleteTask":
			alertCancelB = createButton("Cancel");
			alertCancelB.onclick = (e) => alertDialog.close();
			alertFooter.appendChild(alertCancelB);

			alertOkB = createButton("Delete Task", "warning", false);
            alertOkB.id = "deleteTask";
            alertOkB.setAttribute("type", "submit");
            alertOkB.onclick = (e) => deleteTask(currentTaskO["id"]);
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
        // separator.style.marginBottom = 6;

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
	newLabel.textContent = _text;
	return newLabel;
}

function createLabelMini(_text)
{
	let newLabel = document.createElement("div");
	newLabel.style.textAlign = "left";
	newLabel.style.fontSize = labelFontSizeMini;
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
function createTaskCell(_taskO, _newTask)
{
    let taskCell = document.createElement("div");
    // taskCell.id = _taskId;
    // console.log("_taskId:", _taskId);
    taskCell.style.display = "flex";
    taskCell.style.flexDirection = "row"; 
    taskCell.style.justifyContent = "space-between";
    taskCell.style.alignItems = "center";
    // taskCell.style.marginBottom = 20;
    taskCell.style.padding = "20px 0px";
    taskCell.style.borderBottom = "1px solid";
    taskCell.style.borderColor = separatorColor;
    // task.textContent = "Task " + (taskId + 1);
    taskCell.onclick = (e) => editTask(_taskO["id"]);
    // taskList.appendChild(taskCell);
    // taskList.insertBefore(taskCell, taskList.firstChild);

    let taskInfo = document.createElement("div");
    taskCell.appendChild(taskInfo);

    // console.log("task name:", root.pluginData["tasks"][_taskId]["name"]);
    // let taskName = _newTask ? "Task " + (_taskId + 1) : root.pluginData["tasks"][_taskId]["name"];

    let taskName;
    if(_newTask)
    {
        taskName = "Task " + (_taskO["id"] + 1);
    }
    else
    {
        taskName = _taskO["name"];
        // taskName = root.pluginData["tasks"][_taskId]["name"];
    }

    let taskNameL = createLabel(taskName);
    // taskNameL.style.fontWeight = "bold";
    taskInfo.appendChild(taskNameL);

    // let taskTimerL = createLabel("0h 0m 0s");
    let taskTimerL = createLabel(getTimerString(_taskO["seconds"]));
    taskTimerL.style.marginTop = 6;
    // projectTimerL.style.fontWeight = "bold";
    taskTimerL.style.color = labelQuietColor;
    taskInfo.appendChild(taskTimerL);

    var chevronIcon = document.createElement("img");
    chevronIcon.src = "img/right.png";
    taskCell.appendChild(chevronIcon);

    return taskCell;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS

function getTasks()
{
    // console.log("getTasks()");
    
    taskList.innerHTML = "";

    // console.log(pluginDataO["tasks"]);
    // console.log("");
    // console.log(root.pluginData["tasks"]);

    if(pluginDataO["tasks"].length == 0)
    {
        // console.log("no task");
        exportCsvB.style.opacity = .4; // Windows fix (disabling buttons doesn't dim icon)
        exportCsvB.disabled = true;
    }

    for(let i = 0; i < pluginDataO["tasks"].length; i++)
    {
        // console.log("task:", pluginDataO["tasks"][i]["id"] + " - " + pluginDataO["tasks"][i]["name"]);
        
        // console.log("task:", root.pluginData["tasks"][i]["name"]);
        // console.log("task:", root.pluginData["tasks"][i]);
        
        // let id = root.pluginData["tasks"][i]["id"];
        let taskO = pluginDataO["tasks"][i];
        taskList.insertBefore(createTaskCell(taskO, false), taskList.firstChild);
    }
}

function newTask()
{
    // console.log("newTask()");
    // taskList.insertBefore(createTaskCell(taskId, true, taskO), taskList.firstChild)

    let taskO = {};
    taskO["id"] = pluginDataO["taskId"]; // taskId;
    taskO["name"] = "Task " + (pluginDataO["taskId"] + 1); // "Task " + (taskId + 1);
    // taskO["name"] = taskNameL.textContent;
    // taskO["name"] = taskNameTF.value;
    taskO["seconds"] = 0;
    taskO["startedDate"] = "";
    // taskO["startDate"] = ""; // dateString
    // taskO["startTime"] = ""; // timeString
    pluginDataO["tasks"].push(taskO);
    pluginDataO["taskId"]++;
    // console.log(pluginDataO);
    editDocument({editLabel: "New Task"}, async() =>
    {
        // root.pluginData["tasks"].push(taskO);
        root.pluginData = pluginDataO;
    });
    taskList.insertBefore(createTaskCell(taskO, true), taskList.firstChild);
    
    exportCsvB.style.opacity = 1; // Windows fix (disabling buttons doesn't dim icon)
    exportCsvB.disabled = false;

    /* project.style.display = "none";
    taskEditor.style.display = "block";
    taskNameTF.value = taskO["name"]; */
}

function editTask(_taskId)
{
    // console.log("editTask()");
    // console.log("edit task: " + _taskId);

    project.style.display = "none";
    taskEditor.style.display = "block";

    for(let i = 0; i < pluginDataO["tasks"].length; i++)
    {
        // console.log(pluginDataO["tasks"][i]);
        if(pluginDataO["tasks"][i]["id"] === _taskId)
        {
            // console.log(pluginDataO["tasks"][i]);
            currentTaskO = pluginDataO["tasks"][i];
            // console.log("currentTaskO:", currentTaskO);
        }
    }

    // console.log(root.pluginData["tasks"][currentTaskId]);
    // console.log(currentTaskO["name"]);
    
    taskNameTF.value = currentTaskO["name"];
    taskTimerL.textContent = getTimerString(currentTaskO["seconds"]);
    // console.log(typeof currentTaskO["seconds"]);

    // stopTaskB.disabled = currentTaskO["seconds"] != 0 ? false : true;
    
    if(currentTaskO["seconds"] != 0)
    {
        stopTaskB.style.opacity = 1; // Windows fix (disabling buttons doesn't dim icon)
        stopTaskB.disabled = false;
    }
    else
    {
        stopTaskB.style.opacity = .4; // Windows fix (disabling buttons doesn't dim icon)
        stopTaskB.disabled = true;
    }


    // taskStartedValueL.textContent = currentTaskO["startedDate"];
    if(currentTaskO["startedDate"] == "")
    {
        taskStartedValueL.textContent = "—";
    }
    else
    {
        taskStartedValueL.textContent = currentTaskO["startedDate"];
    }

    // taskNameTF.value = root.pluginData["tasks"][currentTaskId]["name"];
    // taskNameTF.value = currentTaskO["name"];

}

/* function setTaskName()
{
    console.log("setTaskName()");
    // currentTaskO["name"] = taskNameTF.value;
    // console.log(currentTaskO["name"]);

    // console.log(pluginDataO);

    currentTaskO["name"] = taskNameTF.value;
    console.log(currentTaskO["name"]);
    // pluginDataO["tasks"][currentTaskId]["name"] = taskNameTF.value;

    editDocument({editLabel: "Edit Task Name"}, async() =>
    {
        root.pluginData = pluginDataO;
        // console.log(root.pluginData);
    });
} */

function closeTask()
{
    // console.log("closeTask()");
    // container.innerHTML = "";

    // taskNameTF.blur();

    taskEditor.style.display = "none";
    project.style.display = "block";

    if(timerRunning)
    {
        pauseTimer();
    }
    // pauseTimer();

    projectTimerL.textContent = getTimerString(pluginDataO["seconds"]);

    // clear currentTaskO
    currentTaskO = {};
    // * * * currentTaskId = null;
    // console.log("currentTaskO: ", currentTaskO);
    // console.log("currentTaskO length: ", currentTaskO.length);
    getTasks();
}

function deleteTask(_taskId)
{
    // console.log("deleteTask()");
    // console.log("delete task: " + _taskId);

    // let _tasksA = root.pluginData["tasks"];
    // console.log(_tasksA);
    // console.log(root.pluginData["tasks"][_taskId]);
    // console.log(root.pluginData["tasks"]);

    pluginDataO["seconds"] -= currentTaskO["seconds"];

    for(let i = 0; i < pluginDataO["tasks"].length; i++)
    {
        if(pluginDataO["tasks"][i]["id"] === _taskId)
        {
            // taskList.removeChild(root.pluginData["tasks"][i]);
            pluginDataO["tasks"].splice(i, 1);
            editDocument({editLabel: "Delete Task"}, async() =>
            {
                root.pluginData = pluginDataO;
            });
        }
    }
    
    if(updateInterval)
    {
        clearInterval(updateInterval);
        updateInterval = null;
        timerRunning = false;
        // panelHidden = true;

        taskTimerL.style.color = "#505050";
        startTaskIcon.src = "img/play.png";
        startTaskB.setAttribute("title", "Start Timer");
        startTaskB.onclick = (e) => startTimer();
        warningMessage.style.display = "none";
    }

    closeTask();
}

function startTimer()
{
    // console.log(tasksA[_taskId].firstChild.nextSibling.firstChild.textContent);
    
    // console.log("");
    // console.log("startTimer()");
    
    timerStartDate = new Date();
    // console.log("timerStartDate: " + timerStartDate);

    taskNameTF.blur();

    taskTimerL.style.color = "#4B91ED";
    startTaskIcon.src = "img/pause.png";
    startTaskB.setAttribute("title", "Pause Timer");
    startTaskB.onclick = (e) => pauseTimer();

    stopTaskB.style.opacity = 1; // Windows fix (disabling buttons doesn't dim icon)
    stopTaskB.disabled = false;

    // console.log("currentTaskO", currentTaskO);

    updateInterval = setInterval(updateTimer, 1000);
    timerRunning = true;

    if(currentTaskO["startedDate"] == "")
    {
        currentTaskO["startedDate"] = getDateString(timerStartDate);
        taskStartedValueL.textContent = currentTaskO["startedDate"];
        
        editDocument({editLabel: "Start Task"}, async() =>
        {
            // root.pluginData["tasks"].push(taskO);
            root.pluginData = pluginDataO;
        });
    }

    warningMessage.style.display = "block";
}

function updateTimer()
// function updateTimer(_taskId)
{
    // console.log("_taskId: " + _taskId);
    // console.log("updateTimer()");
    // pluginDataO["totalSeconds"]++;
   
    // console.log(Date.now().toTimeString());

    let updateTime = new Date();
    // console.log("updateTime: " + updateTime);
    let timeDifference = updateTime - timerStartDate; // in ms
    // get value in seconds
    timeDifference /= 1000;
  
    // get elapsed seconds
    let elapsedSeconds = Math.round(timeDifference);
    // console.log("seconds: " + elapsedSeconds);
    // console.log(elapsedSeconds + currentTaskO["seconds"]);

    // let taskTimerL = tasksA[_taskId].firstChild.nextSibling.firstChild;
    // taskTimerL.textContent = "xxx";
    taskTimerL.textContent = getTimerString(elapsedSeconds + currentTaskO["seconds"]);
}

function pauseTimer()
{
    // console.log("");
    // console.log("pauseTimer()");

    clearInterval(updateInterval);
    updateInterval = null;

    let timerPauseDate = new Date();
    // console.log("timerPauseDate: " + timerPauseDate);
    let timeDifference = timerPauseDate - timerStartDate; // in ms
    // strip the ms
    timeDifference /= 1000;
  
    // get elapsed seconds
    let elapsedSeconds = Math.round(timeDifference);
    // console.log("elapsedSeconds: " + elapsedSeconds);
   
    taskNameTF.blur();
    taskTimerL.style.color = "#505050";
    startTaskIcon.src = "img/play.png";
    startTaskB.setAttribute("title", "Start Timer");
    startTaskB.onclick = (e) => startTimer();

    // console.log(currentTaskO["seconds"] + elapsedSeconds);
    
    currentTaskO["seconds"] += elapsedSeconds;
    // pluginDataO["tasks"][currentTaskId]["name"] = taskNameTF.value;
    pluginDataO["seconds"] += elapsedSeconds;

    editDocument({editLabel: "Pause Timer"}, async() =>
    {
        root.pluginData = pluginDataO;
        // console.log("root.pluginData:", root.pluginData);
        // console.log("currentTaskO:", currentTaskO);
    });

    taskTimerL.textContent = getTimerString(currentTaskO["seconds"]);
    timerRunning = false;
    warningMessage.style.display = "none";
}

function stopTimer()
{
    // console.log("stopTimer()");

    stopTaskB.style.opacity = .4; // Windows fix (disabling buttons doesn't dim icon)
    stopTaskB.disabled = true;
    taskTimerL.style.color = "#505050";
    startTaskIcon.src = "img/play.png";
    startTaskB.setAttribute("title", "Start Timer");
    startTaskB.onclick = (e) => startTimer();

    taskTimerL.textContent = getTimerString(0);

    pluginDataO["seconds"] -= currentTaskO["seconds"];
    currentTaskO["seconds"] = 0;
    currentTaskO["startedDate"] = "";
    taskStartedValueL.textContent = "—";

    editDocument({editLabel: "Stop and Reset Timer"}, async() =>
	{
		root.pluginData = pluginDataO;
    });

    clearInterval(updateInterval);
    updateInterval = null;
    timerRunning = false;
    warningMessage.style.display = "none";
}

function getTimerString(_seconds)
{
    let h = parseInt(_seconds / 3600);
    _seconds = _seconds % (3600);

    let m = parseInt(_seconds / 60);
    _seconds = _seconds % (60);

    let s = parseInt(_seconds);

    /* if (s < 10)
    {
        s = "0" + s;
    }
    if (m < 10)
    {
        m = "0" + m;
    }
    return h + ":" + m + ":" + s; */

    return h + "h " + m + "m " + s + "s";
}

function getDateString(_date)
{
    // let date = new Date();
    // console.log("date: " + _date.toDateString());
    // console.log("date: " + _date.toISOString());

    let day = _date.getDate();
    let month = _date.getMonth() + 1;
    let year = _date.getFullYear();
    if(day.toString().length == 1)
    {
        day = "0" + day;
    }
    if(month.toString().length == 1)
    {
        month = "0" + month;
    }
    
    let dateString = day + "/" + month + "/" + year;

    let hours = _date.getHours();
    let minutes = _date.getMinutes();
    let seconds = _date.getSeconds();
    
    if(hours.toString().length == 1)
    {
        hours = "0" + hours;
    }
    if(minutes.toString().length == 1)
    {
        minutes = "0" + minutes;
    }
    if(seconds.toString().length == 1)
    {
        seconds = "0" + seconds;
    }
    
    let timeString = hours + ":" + minutes + ":" + seconds;
    
    // console.log("date: " + dateString);
    // console.log("timeString: " + timeString);

    let startedString = dateString + " - " + timeString
    // console.log("startedString: " + startedString);

    return startedString;
}

async function exportCsv()
{
    // console.log("exportCSV()");
    // console.log(pluginDataO["tasks"][0]);
    let csvString = "";

    // build headers
    csvString += "id, name,started,time" + "\n";
    
    for(let i = pluginDataO["tasks"].length - 1; i >= 0; i--)
    // for(let i = 0; i < pluginDataO["tasks"].length; i++)
    {
        let task = pluginDataO["tasks"][i];
        let startedDate = task["startedDate"] == "" ? "–" : task["startedDate"];
        // console.log("startedDate: " + startedDate);
        csvString += task["id"] + "," + task["name"] + "," + startedDate + "," + getTimerString(task["seconds"]) + "\n";
        // csvString += task["id"] + "," + task["name"] + "," + task["startedDate"] + "," + getTimerString(task["seconds"]) + "\n";
        // csvString += "\t" + task["name"] + "\t" + task["startedDate"] + "\t" + task["seconds"] + "\n";
        // csvString += "\t" + task["name"] + "\t" + task["startedDate"] + "\t" + task["seconds"] + "\n";
        // csvString += task["name"] + "\t" + "started: " + task["startedDate"] + "\t" + "time: " + task["seconds"] + "\n";        
    }
    // console.log("\ncsvString:\n" + csvString);
    // csvString += "\n";

    let csvFile = await localFileSystem.getFileForSaving(projectNameL.textContent + ".csv", {types: ["csv"]});
	if (!csvFile)
	{
		return;
	}
	await csvFile.write(csvString);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - OK ACTIONS

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	panels: {
		Chrono: {show, hide, update}
	}
};









