const { Artboard, Group, RepeatGrid, Rectangle, Ellipse, Text, Color, getNodeByGUID } = require("scenegraph");
const { alert, error, confirm } = require("./lib/dialogs.js");
const tagsIssueDialog = require("./tagsIssueDialog.js");
const editTagDialog = require("./EditTag.js")
const tagsManager = require("./TagsManager.js");

let panel;
let tagsLoaded = false;

let addDocumentTagState = false;


async function showAlert(title, ...msgs) {
    // await alert("Connect to the Internet", //[1]
    // "In order to function correctly, this plugin requires access to the Internet. Please connect to a network that has Internet access."); //[2]

    await alert(title, ...msgs);
}

async function showError(title, ...msgs) {
    /* we'll display a dialog here */
    // await error("Synchronization Failed", //[1]
    // "Failed to synchronize all your changes with our server. Some changes may have been lost.",
    // "Steps you can take:",
    // "* Save your document",
    // "* Check your network connection",
    // "* Try again in a few minutes"); //[2]
    await error(title, ...msgs);
}


async function showConfirm(title, msg, buttons) {
    /* we'll display a dialog here */
    await confirm(title, msg, buttons);
}

function log(...strs) {
    console.log("Main----", strs);
}

function printMap(name, map) {
    
    if(!map) {
        return;
    }
    log("Printing map - ", name);
    for (const [key, value] of map.entries()) {
        log("key:", key, " value:", value);
    }
}

const styling = 
`<style>

    .padding-bottom-32 {
        padding-bottom: 32px;
    }

    .padding-right-4 {
        padding-right: 4px;
    }
    .padding-top-32 {
        padding-top: 32px;
    }

    .padding-top-16 {
        padding-top: 16px;
    }

    .header {
        color: #000000;
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
    }

    .sub-header {
        color: #000000;
        width: 100%;
        text-align: left;
        font-size: 12px;
    }

    .padding-bottom-16 {
        padding-bottom: 16px;
    }

    .title {
        color: #000000;
        width: 100%;
        text-align: left;
        font-size: 12px;
    }
    .checkboxlabel {
        font-size: 10px;
    }
    .break {
        flex-wrap: wrap;
    }
    label.row > span {
        
    }
    label.row input {
        flex: 1 1 auto;
    }
    .show {
        display: block;
    }
    .hide {
        display: none;
    }

    .CurrentTag {
        background-color: #000000;
    }

    .white-text {
        color: #FFFFFF;
    }

    .light {
        background-color: #FFFFFF;
        border: 0.5px solid #ccc !important;
        border-style: solid none none none;
    }
    .default {
        border: 0.5px solid #ccc !important;
        border-style: solid none none none;
    }

    .button {
        display:inline-block;
        font-size:12px;
        border-radius:15px;
        min-height: 24px;
    }

    .TagButton {
        
        background-color: white;
        border: 0.2px solid #333333;
        font-weight: bold;
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;

        width: max-content;
        margin-right:4px;
        margin-bottom:4px;
        padding-left:8px;
        padding-right:8px;
    }

    .CurrentTagButton {
        
        color: green;
        background-color: white;
        

        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;

        width: max-content;
        margin-right:2px;
        margin-bottom:2px;
        padding-left:1px;
        padding-right:1px;
    }

    .MissingTagButton {
        font-size: 12px;
        
        background-color: white;
        

        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;

        width: max-content;
        margin-right:2px;
        margin-bottom:2px;
        padding-left:4px;
        padding-right:4px;
    }

    .TagButton:focus {
        background-color: blue;
    }

    .CurrentTagButton:hover {
        background-color: black;
        color: white;
    }

    .TagButton:hover {
        background-color: black;
        color: white;
    }

    .MissingTagButton:hover {
        background-color: black;
        color: white;
    }

    .AllTagsContainer {
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        max-height: 250px;
        overflow-y: scroll;
    }

    .titleContainer {
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-content: flex-start;
    }

    .gap {
        flex-grow: 2;
    }

    .flex-container {
        display: flex;
        flex-direction: row;
      }
      
    .flex-container > .flex-item {
    flex: auto;
    }
    
    .flex-container > .raw-item-icon {
        width: 24px;
    }

    .flex-container > .raw-item {
        width: 5rem;
    }

    .addDocumentTagContainer {
        padding-top: 8px;
        padding-bottom: 8px;
        margin-bottom: 32px;
        background-color: #FFFFFF;
    }

    .subtext {
        font-size: 10px;
        font-style: italic;
    }
</style>`;


function getTagsView (type, tagsMap, selectionTags) {
    //printMap("tagsMap", tagsMap);
    //printMap("selectionTags", selectionTags);
    let tagsPrint = [];
    if(tagsMap) {
        for (const [key, value] of tagsMap.entries()) {

            var isCurrent = false;
            
            if(selectionTags && selectionTags.get(key)) {
                isCurrent = true;
            }
            
            // var buttonClass = (isCurrent) ? 'CurrentTag' : '';
            // var textClass = (isCurrent) ? 'white-text' : '';
            var buttonClass = '';
            var textClass = '';
            var tagTypeClass = (type == "document")? 'TagButton': (type == 'missing')?'MissingTagButton':'CurrentTagButton';
            tagsPrint.push(`<div key="${type}_Tag_${key}" class="button ${tagTypeClass} ${buttonClass}"><p class="${textClass}">${key}</p></div>`);
        }
    }
    
    
    let tagsView = tagsPrint.join('');
    let ret = `<div class="AllTagsContainer">${tagsView}</div>`;

    return ret;
}

function initPanel() {
    const HTML = styling +
    `
    <p class="title padding-right-4">Start by selecting objects and assigning tags to them. Use Tag Cloud for selecting all objects with a tag.</p>
    <div id="documentTagsPanel" class="show light">
        <div id="titleContainer" class="flex-container">
            <p class="header flex-item">Tag Cloud</p>
            <a href="#" data-action="addDocumentTag" class="actionButton raw-item-icon">
                <img id="addDocumentTagIcon" src="images/plus.png" />
            </a>
        </div>
        <div id="updateDocumentCloud" class="flex-container hide">
            <p class="header flex-item">Cloud refresh required</p>
            <button class="raw-item" id="refreshTagCloud" uxp-variant="cta">Refresh</button>
        </div>
        <p class="title">Click a tag to <b>select objects</b>, double click to <b>edit/remove</b> a tag</p>
        <div id="addDocumentTagsContainer" class="hide">
            <div class="addDocumentTagContainer">
                <p class="title">Add a new document tag</p>
                <div class="flex-container">
                    <input class="flex-item" type="string" uxp-quiet="true" id="newDocumentTag" value="" placeholder="Add New"/>
                    <button class="raw-item" id="addDocumentTags" uxp-variant="secondary">Add</button>
                </div>
            </div>
        </div>
        <div class="flex-container">
            <input type="string" uxp-quiet="true" id="searchTags" value="" placeholder="Search tags" class="flex-item"/>
        </div>
        <div id="documentTags" class="AllTagsContainer show">
        </div>
    </div>
    <div id="currentTagsPanel" class="show padding-top-16">
        <p id="currentSelectionText" class="header">Current Selection</p>
        <p class="sub-header" id="existingTagsTitle">Click to <b>remove</b> an existing tag</p>
        <div id="currentSelectionTagsList">
        </div>

        <p class="sub-header" id="missingTagsTitle">Click to <b>add</b> a tag</p>
        <div id="missingTags" class="AllTagsContainer show">
            
        </div>
        <div id="addSelectionTagsContainer" class="show">
            
            <div class="addSelectionTagContainer">
                <p class="title padding-top-16">Create <b>new</b> tag</p>
                <div class="flex-container">
                    <input class="flex-item" type="string" uxp-quiet="true" id="newSelectionTag" value="" placeholder="Add New"/>
                    <button class="raw-item" id="addSelectionTags" uxp-variant="secondary">Add</button>
                </div>
            </div>
        </div>
    </div>
    `;

    const debug = `<div id="Debugs" class="show">
                        <p class="title">Clear tags</p>
                        <footer>
                            <button id="clearSelectionTags" uxp-variant="primary">Selection</button>
                            <button id="clearDocumentTags" uxp-variant="primary">Document</button>
                            <button id="printPanel" uxp-variant="primary">Panel</button>
                        </footer>
                    
                    </div>`;
    panel = document.createElement("div");
    panel.innerHTML = HTML;
}


function setAddDocumentTagAction() {
    const addTags = panel.querySelector("#addDocumentTags");
    addTags.addEventListener("click", _onAddDocumentTags);

    function _onAddDocumentTags(e) {
        const newDocumentTag = panel.querySelector("#newDocumentTag").value;
        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            if(newDocumentTag && newDocumentTag.length > 0) 
                tagsManager.setApplicationTag(newDocumentTag, documentRoot);
                updateTagsPanel(selection, documentRoot);
        });
    }
}

function setAddSelectionTagAction () {
    const addSelectionTags = panel.querySelector("#addSelectionTags");
    addSelectionTags.addEventListener("click", _onAddSelectionTags);

    function _onAddSelectionTags(e) {
        const newSelectionTag = panel.querySelector("#newSelectionTag").value;
        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            if(newSelectionTag && newSelectionTag.length > 0) 
                tagsManager.setSelectionTag(newSelectionTag, selection, documentRoot);
                updateTagsPanel(selection, documentRoot);
        });
    }

}

function setSearchAction() {

    const searchTags = panel.querySelector("#searchTags");
    searchTags.addEventListener("input", _onSearchTags);

    function _onSearchTags(e) {
        const { editDocument } = require("application");
        tagsManager.setFilterString(e.currentTarget.value);
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            updateTagsPanel(selection, documentRoot);
        });
    }
}

function setClearSelectionAction() {
    const clearSelectionTags = panel.querySelector("#clearSelectionTags");
    clearSelectionTags.addEventListener("click", _onClearSelectionTags);

    function _onClearSelectionTags(e) {
        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            tagsManager.clearSelectionTags(selection);
            updateTagsPanel(selection, documentRoot);
        });
    }
}

function setClearDocumentAction() {
    const clearDocumentTags = panel.querySelector("#clearDocumentTags");
    clearDocumentTags.addEventListener("click", _onClearDocumentTags);


    function _onClearDocumentTags(e) {
        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            tagsManager.clearApplicationTags(documentRoot);
            updateTagsPanel(selection, documentRoot);
        });
    }
}

function setPrintPanelAction() {
    const printPanel = panel.querySelector("#printPanel");
    printPanel.addEventListener("click", _onPrintPanel);

    
    function _onPrintPanel(e) {
        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            // console.log(panel.innerHTML);
        });
    }
}

function setActionButtonEvents() {
    const buttons = panel.querySelectorAll(".actionButton");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", _onActionButton);
    }

    function _onActionButton(e){
        const actionName = e.currentTarget.getAttribute('data-action');
        
        if(actionName == "addDocumentTag") {
            addDocumentTagState = !addDocumentTagState;
            const { editDocument } = require("application");
        
            editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
                updateTagsPanel(selection, documentRoot);
            });
        }
    }
}

function setRefreshTagCloudEvent() {
    const refreshTagCloud = panel.querySelector("#refreshTagCloud");
    refreshTagCloud.addEventListener("click", _onRefreshTagCloud);

    
    function _onRefreshTagCloud(e) {
        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            log("_onRefreshTagCloud");
            tagsManager.updateApplicationTags(documentRoot);
            tagsManager.setApplicationTagsUpdateRequired(false);
            updateTagsPanel(selection, documentRoot);
        });
    }
    
}

function applicationTags() {
   
    if(!panel) initPanel();

    setAddDocumentTagAction();

    setAddSelectionTagAction();

    setSearchAction();

    // setClearSelectionAction();

    // setClearDocumentAction();

    // setPrintPanelAction();

    setActionButtonEvents();

    setRefreshTagCloudEvent();

    return panel;
}

function updateTagsPanel(selection, documentRoot) {
    let tags;
    if(!panel) initPanel();

    let selectionTagsPanel = panel.querySelector("#currentSelectionTagsList");
    let selectionTags = tagsManager.getSelectionTags(selection);
    selectionTagsPanel.innerHTML = getTagsView("selection", selectionTags, null);

    let documentTagsPanel = panel.querySelector("#documentTags");
    tags = tagsManager.getApplicationTags();
    documentTagsPanel.innerHTML = getTagsView("document", tags, selectionTags);

    const existingTagsTitle = panel.querySelector("#existingTagsTitle");
    if(tags.size > 0) {
        existingTagsTitle.className = "show sub-header";
    }
    else {
        existingTagsTitle.className = "hide sub-header";
    }

    let missingTagsPanel = panel.querySelector("#missingTags");
    tags = tagsManager.getMissingSelectionTags(selection);
    missingTagsPanel.innerHTML = getTagsView("missing", tags, null);

    const missingTagsTitle = panel.querySelector("#missingTagsTitle");
    if(tags.size > 0) {
        missingTagsTitle.className = "show sub-header";
    }
    else {
        missingTagsTitle.className = "hide sub-header";
    }

    const newSelectionTag = panel.querySelector("#newSelectionTag");
    //newSelectionTag.value = tagsManager.getTagsMapAsString(tagsManager.getSelectionTags(selection));

    const addDocumentTagsContainer = panel.querySelector("#addDocumentTagsContainer");
    const addDocumentTagIcon = panel.querySelector("#addDocumentTagIcon");
    if(addDocumentTagState) {
        addDocumentTagsContainer.className = "show";
        addDocumentTagIcon.src = 'images/minus.png';
    }
    else {
        addDocumentTagsContainer.className = "hide";
        addDocumentTagIcon.src = 'images/plus.png';
    }

    const updateDocumentCloud = panel.querySelector("#updateDocumentCloud");
    if(tagsManager.getApplicationTagsUpdateRequired()) {
        updateDocumentCloud.className = 'show';
    }
    else {
        updateDocumentCloud.className = 'hide';
    }

    // const newDocumentTag = panel.querySelector("#newDocumentTag");
    // newDocumentTag.value = tagsManager.getApplicationTagsString();

    addTagButtonEvents(selection, documentRoot);
    addMissingTagButtonEvents(selection, documentRoot);
    addExistingTagButtonEvents(selection, documentRoot);
}

function addExistingTagButtonEvents(selection, documentRoot) {
    
    const buttons = panel.querySelectorAll(".CurrentTagButton");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", _onActionButton);
    }

    function _onActionButton(e) {
        const key = e.currentTarget.getAttribute('key');
        const { editDocument } = require("application");
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            if(key.indexOf("selection") == 0) {
                let tag = key.substring("selection_Tag_".length);
                
                // console.log("To remove: ", tag);
                tagsManager.removeSelectionTag(tag, selection, documentRoot);
                updateTagsPanel(selection, documentRoot);
            }
        });
    }
}

function addMissingTagButtonEvents(selection, documentRoot) {
    
    const buttons = panel.querySelectorAll(".MissingTagButton");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", _onActionButton);
    }

    function _onActionButton(e){
        const key = e.currentTarget.getAttribute('key');
        const { editDocument } = require("application");
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
            if(key.indexOf("missing") == 0) {
                let tag = key.substring("missing_Tag_".length);
                
                tagsManager.setSelectionTag(tag, selection, documentRoot);
                updateTagsPanel(selection, documentRoot);
            }
        });
    }
}

function addTagButtonEvents(selection, documentRoot) {
    const buttons = panel.querySelectorAll(".TagButton");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", _onActionButton);
        buttons[i].addEventListener("dblclick", _onDoubleClickActionButton);
    }


    function _onDoubleClickActionButton(e){
        const key = e.currentTarget.getAttribute('key');
        let tagName = key.substring("document_Tag_".length);

        function cancelFunction() {

        }

        function okFunction(newVal) {
            const { editDocument } = require("application");
            editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
                tagsManager.editTag(tagName, newVal, documentRoot);
                updateTagsPanel(selection, documentRoot);
            });
        }

        function removeFunction() {
            const { editDocument } = require("application");
            editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
                console.log("here");
                tagsManager.removeTag(tagName, selection, documentRoot);
                updateTagsPanel(selection, documentRoot);
            });
        }

        editTagDialog.showEditTagDialog(tagName, cancelFunction, okFunction, removeFunction);

        // const { editDocument } = require("application");
        // editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
        //     let selectionCount = (selection && selection.items)?selection.items.length:0;
            
        // });
    }
    

    function _onActionButton(e){
        const key = e.currentTarget.getAttribute('key');

        const { editDocument } = require("application");
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {

            let newSelection = [];
            let artboards = [];

            let tag = '';let tagName = '';

            if(key.indexOf("document") == 0) {
                tagName = key.substring("document_Tag_".length);
                tag     = tagsManager.getTagIdFromName(tagName);
                
                documentRoot.children.forEach(node => {   
                    if (node instanceof Artboard) { 
                        node.children.forEach(artboardChild => {
                            updateSelectionFromItem(tag, artboardChild, newSelection);
                        });
                    }
                    if (node.pluginData && node.pluginData.name == tagsManager.TAG_MANAGER_PLUGIN) {     
                        if(node.pluginData.tags.indexOf(tag) >= 0) {
                            newSelection.push(node);
                            if(node instanceof Artboard)
                                artboards.push(node);
                        }
                    }
                });

                //console.log("Check the objects", objectIds);
            }

            if(artboards.length > 0 && artboards.length != newSelection.length) {
                let artboardsList = artboards.map(artboard => artboard.name).join(', ');
                let componentCount = newSelection.length - artboards.length;

                function cancelFunction() {
                    
                }

                function okFunction(inputVal) {
                    const { editDocument } = require("application");
                    editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
                        
                        if(inputVal == "artboard") {
                            artboards.forEach(artboard => {
                                tagsManager.removeItemTag(tagName, artboard);
                            })
                        }
                        else {
                            
                            newSelection.forEach(item => {
                                if(artboards.indexOf(item) < 0) {
                                    tagsManager.removeItemTag(tagName, item);
                                }
                            })
                        }
                    });
                }

                tagsIssueDialog.showOurDialog(tag, artboardsList, componentCount, cancelFunction, okFunction);

                // showAlert("Failed to select", "A tag can only be assigned to either artboards or other objects. ",
                // "The tag '" + tag + "' is currently assigned to artboards: '" + artboardsList + "' and '" + componentCount.toString() + "' other objects. ", "Please remove the tag from either all artboards or all other objects for the plugin to work correctly.");
            }
            else {
                //console.log(newSelection);
                try {
                    selection.items = newSelection;
                }
                catch (e) {
                    showError("Couldn't select option", "Please ensure that you're not inside a group or grid", "You can also contact the developer with the below message: ", e.message);
                }
            }
        });
      }
}

function updateSelectionFromItem(tag, item, newSelection) {
    if(item instanceof Group) {
        item.children.forEach(child => {
            updateSelectionFromItem(tag, child, newSelection);
        });
    }

    if(item instanceof RepeatGrid) {
        item.children.forEach(child => {
            //updateSelectionFromItem(tag, child, newSelection);
        });
    }

    if (item.pluginData && item.pluginData.name == tagsManager.TAG_MANAGER_PLUGIN) {     
        if(item.pluginData.tags.indexOf(tag) >= 0) {
            newSelection.push(item);
        }
    }
}

function showCurrentTags(selection, documentRoot) {
    updateTagsPanel(selection, documentRoot);
}

function showAddTagsOption(selection, documentRoot) {
    updateTagsPanel(selection, documentRoot);
}

function setCurrentTagsPanelView(selection, documentRoot) {
    let currentTagsPanel = panel.querySelector("#currentTagsPanel");
    let currentSelectionText = panel.querySelector("#currentSelectionText");
    
    if(selection && selection.items && selection.items.length > 0) {
        currentTagsPanel.className = "show padding-top-32";
        let endsWith = "";
        if(selection.items.length > 1) endsWith = "s";
        currentSelectionText.innerHTML = "Current Selection: <span style='color:green'>" + selection.items.length + " object" + endsWith + "</span"; 
    }
    else {
        currentTagsPanel.className = "hide padding-top-32";
    }
}

function loadTags(selection, documentRoot) {
    
    tagsManager.initApplicationTags(documentRoot);
    updateTagsPanel(selection, documentRoot);
    tagsLoaded = true;
}

function update(selection, documentRoot) {

    // console.log(selection.items);
    if(!tagsLoaded) loadTags(selection, documentRoot);
    setCurrentTagsPanelView(selection, documentRoot);
    // if(selection && selection.items) {
    //     tagsManager.checkAndAddToApplicationTagsMap(selection);
    // }

    if(selection.items[0] && selection.items[0].pluginData && selection.items[0].pluginData.name == "TagManager") {
      showCurrentTags(selection);
    } else if(selection && selection.items &&  selection.items.length > 0) {
      showAddTagsOption(selection);
    }    
    else {

    }
}


function show(event) {
    if (!panel) 
        event.node.appendChild(applicationTags());
}


module.exports = {
    panels: {
        tagsManager: {
            show,
            update
        }
    }
};