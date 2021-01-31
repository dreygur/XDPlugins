///////////////////////////////////////////////////////////////////////////
// Statistics
// version 1.1.0
///////////////////////////////////////////////////////////////////////////


const {AlertForm, MainForm, Items} = require("./library");
const {Artboard, BooleanGroup, Color, Ellipse, GraphicsNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text} = require("scenegraph");
const {log, object, getClassName, getFunctionName, getStackTrace, getChangedProperties, XDConstants, DebugSettings, getPx} = require("./log");
const h = require("./h");
const platform = require("os").platform();

///////////////////////////////////////////////////////////////////////////
// DIALOGs
///////////////////////////////////////////////////////////////////////////

MainForm.debug = false;
DebugSettings.logFunctionName = true;

var mainForm = new MainForm();
var alertForm = new AlertForm();

let alertDialog =
	h("dialog", {name:"Alert"},
		h("form", { method:"dialog", style: { width: getPx(380) }, },
		alertForm.header = h("h2", "Header"),
		h("label", { class: "row", style: {paddingTop: getPx(18) } },
			alertForm.message = h("span", { }, "Message"),
		),
		h("footer",
			h("button", { uxpVariant: "cta", type: "submit", onclick(e){ closeDialog(alertDialog) } }, "OK")
		)
		)
	)

var mainDialog =
	 h("dialog", {name:"Main"},
		h("form", { method:"dialog", style: { width: getPx(mainForm.mainDialogWidth), margin: getPx(-8) }, 
			onsubmit(e) { preventClose(e)}  },
		  h("label", { class: "row", style: {alignItems:"bottom" }},
			 mainForm.headerLabel = h("h2", { style: { cursor: "pointer" }, 
			 	onclick(e) { headerLabelClicked(e) } }, "Artboard Statistics"),
			 h("span", { style: { flex: "1", marginTop:getPx(8) } }, ""),
			 mainForm.nameLabel = h("span", { 
				 style: { textAlign: "right", fontSize: getPx(10.5) , minWidth: getPx(160), marginTop:getPx(6), cursor: "pointer"}, 
				 onclick(e) { artboardLabelClicked(e) } }, ""),
			 h("img", { src: mainForm.closeIconPath, height: getPx(mainForm.iconWidth), width: getPx(mainForm.iconWidth), 
					style: { display:"none", position:"absolute", cursor: "pointer", top: getPx(10), right:getPx(10) },
					onclick(e){ closeDialog(mainDialog) } }, "")
		  ),

		  h("hr", { style: {height: getPx(1), marginTop: getPx(-2)} }, ""),

		  h("label", { class: "row" },
			h("div", { style: { flex:"1", height: getPx(mainForm.listHeight), overflow: "scroll", border: "0px solid gray", padding:getPx(0)} }, 
			 	mainForm.messageList = h("p", { textContent:"", style: {  opacity: 1, border: "0px solid #bcbcbc"} } )
			)
		  ),
		  

		  h("div", { class: "row", style: { alignItems:"center", paddingTop:getPx(0)} },
			  h("a", { style:{color: "gray", fontSize: getPx(8), marginLeft: getPx(8)}, 
			  href:"https://www.velara3.com", }, "More plugins at https://www.velara3.com"),
				h("span", { style:{ flex:"1" }}, ""),
				h("button", { uxpVariant: "primary", title: "Close", 
					style: { display:"none" },
					onclick(e){ closeDialog(mainDialog) } }, "Close"),

				h("span", { style:{color: "gray", fontSize: getPx(9), cursor: "pointer" }, 
					onclick(e){ closeDialog(mainDialog) } }, "close"),
		  )
		)
	 )
  
/**
 * Show the main dialog if an artboard or scene node is selected. 
 * If nothing is selected show an alert dialog with instructions. 
 * @param {*} selection Selection
 * @param {*} documentRoot DocumentRoot
 */
async function showMainDialog(selection, documentRoot) {
	mainForm.selection = selection;
	mainForm.documentRoot = documentRoot;
	mainForm.selectedArtboard = selection.focusedArtboard;
	mainForm.focusedArtboard = selection.focusedArtboard;
  
	mainForm.allArtboards = false;

	var artboards = documentRoot.children;
	var numberOfArtboards = artboards ? artboards.length : 0;
  
	if (platform==MainForm.MAC_PLATFORM) {
	   mainForm.isMac = true;
	}
  
	// user must select at least one artboard
	if (selection.focusedArtboard==null) {  
		var alert = await showAlertDialog("Select an artboard to continue", "Search artboard");
		return alert;
	}
	

	try {
		let dialog = await showMainDialogWindow();
	}
	catch (error) {
		log(error.stack);
	}
  
  }
  
  /**
	* Add the main dialog to the document and open the window
	*/
  async function showMainDialogWindow() {
	MainForm.debug && log("In " + getFunctionName() + "()");
  
	// show layout outline on shift + click - disable in production mode
	DebugSettings.outlineOnClick(mainDialog);

	document.body.appendChild(mainDialog);
	
	updateUILabels();
	
	// If using "await" before showing modal() 
	// then the code after that line is not run until the dialog close
	// var dialog = await openDialog(alertDialog);
	
	// If we remove "await" we can run code after this line
	// it is up to you how you want to handle it
	var dialog = mainDialog.showModal();
	 
	showStatistics();

	return dialog;
  }

	function updateUILabels() {
		if (mainForm.allArtboards) {
			mainForm.nameLabel.textContent = "All Artboards (" + mainForm.itemsDictionary.artboards + ")";
		}
		else {
			mainForm.nameLabel.textContent = mainForm.selectedArtboard.name;
		}
	}

  async function showAlertDialog(message, header) {
	MainForm.debug && log("In " + getFunctionName() + "()");
  
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
 * Show statistics
 * @param {Event} event 
 **/
async function showStatistics(event = null) {
	var elementType = MainForm.ALL_TYPES;
	
	try {
		showMessageList([]);
		clearElementsList();
		
		// prevent dialog from closing (when form submits)
		// this has to be ordered before any async calls
		if (event) event.preventDefault();

		mainForm.itemsDictionary = new Items();
		mainForm.selectItems = [];
		mainForm.nestedItems = {};
		mainForm.rows = {};

		parseSceneGraph(elementType);

		calculateResults();
		
		showMessagesTextfields();
		
		showMessageList(mainForm.selectItems);

		updateUILabels();

	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Switch between showing stats for selected artboard or all artboards
 * @param {Event} event 
 */
function artboardLabelClicked(event) {
	mainForm.allArtboards = !mainForm.allArtboards;
	showStatistics();
}

/**
 * Show or hide icons
 * @param {Event} event 
 */
function headerLabelClicked(event) {
	mainForm.showIcon = !!!mainForm.showIcon;
	showStatistics();
}

/**
 * Show the elements list
 */
function showMessageList(items, additionalMessage = "") {

	if (items.length) {
		mainForm.messageList.style.opacity = 1;
	}
	else {
		mainForm.messageList.style.opacity = 0;
	}

}

/**
 * Remove all items from the elements list
 */
function clearElementsList() {
	mainForm.messageList.textContent = "";
}

/**
 * Get count of all the element types
 * @param {String} elementType 
 */
function parseSceneGraph(elementType = null) {
	var artboards = mainForm.documentRoot.children;
	var focusedArtboard = mainForm.selection.focusedArtboard;
	var numberOfArtboards = artboards ? artboards.length : 0;
	
	clearElementsList();

	// loop through each artboard
	for (let i = 0; i < numberOfArtboards; i++) {
		/** @type {SceneNode} */
		mainForm.currentArtboard = artboards.at(i);
		
		if (focusedArtboard==mainForm.currentArtboard || mainForm.allArtboards) {

			addElement(mainForm.currentArtboard, elementType);
		}
	}
}

/**
 * Add the element to the items dictionary
 * @param {SceneNode} node Current scenenode 
 * @param {String} elementType The type of element
 * @param {Number} nestLevel The depth of the node in the artboard
 **/
function addElement(node, elementType, nestLevel = 0) {
	
	addToSearchResults(node, nestLevel);

	if (node.children!=null) {
		for (var j=0;j<node.children.length;j++) {
			var item = node.children.at(j);
			addElement(item, elementType, nestLevel+1);
		}
	}
}

/**
 * Add sceene node to count
 * @param {SceneNode} node Scene node
 * @param {Number} nestLevel Nest level 
 */
function addToSearchResults(node, nestLevel) {
	var isArtboard = node instanceof Artboard;
	
	if (mainForm.selectItems.indexOf(node)==-1) {
		mainForm.selectItems.push(node);
	}

	// [ts] Type 'SceneNode' cannot be used as an index type. [2538] ?
	mainForm.itemsDictionary[node] = nestLevel;
	mainForm.nestedItems[nestLevel] = node;

	addToTypeCount(node);
}

/**
 * Sort the types array in ascending order by 
 * @param {Array} types 
 */
function sortTypesByCount(types, ascending = true) {
	var sortArray = [];
	var sortedArray = [];
	var item;

	for (var i=0;i<types.length;i++) {
		const type = types[i];
		var value = mainForm.itemsDictionary[type];

		if (value==null || isNaN(value)) value = 0;

		item = {key: type, value: value};
		sortArray.push(item);
	}

	sortArray.sort(function(x,y) {
		return x.value - y.value;
	});

	if (ascending) {
		sortArray.reverse();
	}

	for (var i=0; i<sortArray.length;i++) {
		sortedArray.push(sortArray[i].key);
	}

	return sortedArray;
}

function getType(node) {
	var type = node && node.constructor && node.constructor.name;

	switch(type) {
	 
		case XDConstants.ELLIPSE:
		   break;
		case XDConstants.RECTANGLE:
		   break;
		case XDConstants.PATH:
		   break;
		case XDConstants.LINE:
		   break;
		case XDConstants.TEXT:
		   break;
		case XDConstants.GROUP:
		   break;
		case XDConstants.BOOLEAN_GROUP:
		   break;
		case XDConstants.REPEAT_GRID:
		   break;
		case XDConstants.SYMBOL_INSTANCE:
		   break;
		case XDConstants.ARTBOARD:
		   break;
		case MainForm.TOTAL:
		   break;
		default:
	}

	return type;
}


function getIconPath(type) {

	switch(type) {
	 
		case XDConstants.ELLIPSE:
		   break;
		case XDConstants.RECTANGLE:
		   break;
		case XDConstants.PATH:
			break;
		case XDConstants.POLYGON:
		   break;
		case XDConstants.LINE:
		   break;
		case XDConstants.TEXT:
		   break;
		case XDConstants.GROUP:
		   break;
		case XDConstants.BOOLEAN_GROUP:
		   break;
		case XDConstants.REPEAT_GRID:
		   break;
		case XDConstants.SYMBOL_INSTANCE:
		   break;
		case XDConstants.ARTBOARD:
		   break;
		case MainForm.TOTAL:
			if (mainForm.allArtboards) {
				return "icons/" + XDConstants.ARTBOARD + "s Icon." + "png"
			}
			else {
				return "icons/" + XDConstants.ARTBOARD + " Icon." + "png"
			}
			break;
		default:
	}

	return "icons/" + type + " Icon." + "png";
}

function getDisplayName(type) {
	var value;

	switch(type) {
	 	 
		case XDConstants.ELLIPSE:
			value = "Ellipses";
		   break;
		case XDConstants.RECTANGLE:
			value = "Rectangles";
		   break;
		case XDConstants.PATH:
			value = "Paths";
		   break;
		case XDConstants.POLYGON:
			value = "Polygons";
			break;
		case XDConstants.LINE:
			value = "Lines";
		   break;
		case XDConstants.TEXT:
			value = "Texts";
		   break;
		case XDConstants.GROUP:
			value = "Groups";
		   break;
		case XDConstants.BOOLEAN_GROUP:
			value = "Boolean Groups";
		   break;
		case XDConstants.REPEAT_GRID:
			value = "Repeat Grids";
		   break;
		case XDConstants.SYMBOL_INSTANCE:
			value = "Components";
		   break;
		case XDConstants.ARTBOARD:
			value = "Artboards";
		   break;
		case MainForm.TOTAL:
			value = "Total number of elements";
		   break;
		case MainForm.HEADER:
			value = "Element";
			break;
		default:
			value = type + "s";
	}

	return value;
}

function rowClickHandler(event) {
	var row = event.currentTarget;
	var node = row.node;

	event.preventDefault();
	
	try {
		mainForm.selection.item = node;
	}
	catch (error) {
		
	}
}

function selectItemHandler(event) {
	var button = event.currentTarget;
	var node = button.node;

	event.preventDefault();

	try {
		log("Selected: " + node.name);
	}
	catch (error) {
		
	}
}


function showMessage(message = "") {
	mainForm.resultsLabel.textContent = message;
}

function showExportingLabel(message=null) {
	mainForm.exportLabel.textContent = message;
	//mainForm.exportingRow.style.display = message==null ? Styles.NONE : Styles.FLEX;
}

function showMessagesTextfields() {

  if (mainForm.resultsLabel && mainForm.resultsLabel.style.opacity==0) {
	 mainForm.resultsLabel.style.opacity = 1;
  }
}

async function closeDialog(dialog, wait = false) {
	var b = false;
	b && log("Closing dialog:" + dialog.name);
	
	var result;
	
	if (wait) {
		result = await dialog.close();
	}
	else {
		result = dialog.close();
	}
	
	b && log("Close result:" + result);
}

function preventClose(event) {
	event.preventDefault();
}

function calculateResults() {
	var types = [XDConstants.BOOLEAN_GROUP, XDConstants.ELLIPSE, XDConstants.GROUP, XDConstants.LINE, XDConstants.PATH, XDConstants.POLYGON, XDConstants.RECTANGLE, XDConstants.REPEAT_GRID, XDConstants.SYMBOL_INSTANCE, XDConstants.TEXT];
	var addHeader = false;

	mainForm.sortedAscendingTypes = sortTypesByCount(types);

	if (addHeader) {
		addRow(MainForm.HEADER, false, false);
	}

	for (let index = 0; index < mainForm.sortedAscendingTypes.length; index++) {
		const type = mainForm.sortedAscendingTypes[index];
		addRow(type, index==0, false);
	}

	var row = addRow(MainForm.TOTAL, false, true);
	row.style.marginTop = getPx(5);
	row.nameLabel.style.fontWeight = "bold";
	row.countLabel.style.fontWeight = "bold";
	row.countLabel.style.fontSize = getPx(11);
	//updateRowCounts(sortedAscendingTypes);
}

function updateRowCounts(types) {
	
	for (let index = 0; index < types.length; index++) {
		const type = types[index];
		var row = mainForm.rows[type];

		for (let index = 0; index < row.count; index++) {
			(function() {
				row.countLabel.textContent = index;
				//log(index)
			})();
		}
	}
}

function addToTypeCount(node) {
	var type = getType(node);
	var items = mainForm.itemsDictionary;

	switch(type) {
	 
		case XDConstants.ELLIPSE:
			items.ellipses++;
			items[XDConstants.ELLIPSE] = items.ellipses;
		   break;
		case XDConstants.RECTANGLE:
			items.rectangles++;
			items[XDConstants.RECTANGLE] = items.rectangles;
		   break;
		case XDConstants.PATH:
			items.paths++;
			items[XDConstants.PATH] = items.paths;
		   break;
		case XDConstants.POLYGON:
			items.polygons++;
			items[XDConstants.POLYGON] = items.polygons;
			break;
		case XDConstants.LINE:
			items.lines++;
			items[XDConstants.LINE] = items.lines;
		   break;
		case XDConstants.TEXT:
			items.texts++;
			items[XDConstants.TEXT] = items.texts;

			if (node.areaBox!=null) {
				items.areaTexts++;
				items[XDConstants.AREA_TEXT] = items.areaTexts;
			}
			else {
				items.pointText++;
				items[XDConstants.POINT_TEXT] = items.pointText;
			}
		   break;
		case XDConstants.GROUP:
			items.groups++;
			items.totalGroups++;
			items[XDConstants.GROUP] = items.groups;
			items[MainForm.TOTAL_GROUPS] = items.totalGroups;
		   break;
		case XDConstants.BOOLEAN_GROUP:
			items.booleanGroups++;
			items.totalGroups++;
			items[XDConstants.BOOLEAN_GROUP] = items.booleanGroups;
			items[MainForm.TOTAL_GROUPS] = items.totalGroups;
		   break;
		case XDConstants.REPEAT_GRID:
			items.repeatGrids++;
			items[XDConstants.REPEAT_GRID] = items.repeatGrids;
		   break;
		case XDConstants.SYMBOL_INSTANCE:
			items.symbolInstances++;
			items[XDConstants.SYMBOL_INSTANCE] = items.symbolInstances;
		   break;
		case XDConstants.ARTBOARD:
			items.artboards++;
			items[XDConstants.ARTBOARD] = items.artboards;
		   break;
		default:
	}

	items.totals++;
	items[MainForm.TOTAL] = items.totals;

	return type;
}

function getTypeCount(type) {
	var value = 0;
	var items = mainForm.itemsDictionary;

	switch(type) {
	 
		case XDConstants.ARTBOARD:
			value = items.artboards;
			break;
		case XDConstants.BOOLEAN_GROUP:
			value = items.booleanGroups;
			break;
		case XDConstants.ELLIPSE:
			value = items.ellipses;
		   break;
		case XDConstants.GROUP:
			value = items.groups;
			break;
		case XDConstants.LINE:
			value = items.lines;
			break;
		case XDConstants.PATH:
			value = items.paths;
		   break;
		case XDConstants.POLYGON:
			value = items.polygons;
			break;
		case XDConstants.RECTANGLE:
			value = items.rectangles;
			break;
		case XDConstants.REPEAT_GRID:
			value = items.repeatGrids;
			break;
		case XDConstants.SYMBOL_INSTANCE:
			value = items.symbolInstances;
		   break;
		case XDConstants.TEXT:
			value = items.texts;
		   break;
		case MainForm.TOTAL_GROUPS:
			value = items.totalGroups;
			break;
		case MainForm.TOTAL:
			value = items.totals;
		   break;
		default:
		}

	return value;
}

/**
 * 
 * @param {String} type 
 */
function addRow(type, firstRow = false, lastRow = false, isHeader = false) {
	var iconPath = getIconPath(type);
	var totalCount = 0;
	var count;
	var displayName= getDisplayName(type); // set to block to show
	var borderWeight = 0;
	
	count = getTypeCount(type);
	totalCount = getTypeCount(MainForm.TOTAL);

	try {

		var countLabel;
		var nameLabel;
		var image;
		var topBorderWeight = firstRow ? 0 : 0;
		var bottomBorderWeight = lastRow ? 0 : 1;
		var textMarginTop = -2;
		var toolTip;
		var borderBottomColor = "#BCBCBC";
		var iconSize = 10;
		var rowHeight = 24;
		var marginLeftOffset = iconPath ? 0 : -4;
		var fontSize = 10.5;
		var items = mainForm.itemsDictionary;

		borderBottomColor = "rgba(0, 0, 0, .1)"

		if (type==XDConstants.GROUP || type==XDConstants.BOOLEAN_GROUP) {
			toolTip = "" + items.totalGroups + " total groups";
		}
		else if (type==XDConstants.TEXT) {
			toolTip = "" + items.pointText + " point texts " + items.areaTexts + " area texts";
		}
		else if (type==MainForm.TOTAL) {
			count = count - items.artboards;
			toolTip = "" + count + " total";
		}
		else {
			// set plurality - when count is 1 use "1 group" otherwise use "n groups"
			toolTip = count==1 ? count + " " + type : count + " " + displayName;
		}

		if (count==0 && totalCount!=0) {
			count = "";
		}

		var row =
		h("div", {
			class: "row", 
			title: toolTip,
			style: {
				display: "flex",
				height: getPx(rowHeight), 
				borderTop: topBorderWeight + "px solid " + borderBottomColor, 
				borderBottom: bottomBorderWeight + "px solid " + borderBottomColor, 
				alignItems: "center" 
			}, onclick(e) {} },
			
			h("span", { style: { display: "none", width: getPx(0), border: borderWeight + "px solid black"} } ),

			image = h("img", {
				title: type, 
				src: iconPath, 
				width: iconSize, 
				height: iconSize, 
				style: {
					display: mainForm.showIcon ? "block" : "none", 
					marginRight: getPx(5),
					border: borderWeight + "px solid green"} 
				}
			),

			nameLabel = h("span", {
				style: {
					margin: 0,
					marginLeft: marginLeftOffset,
					fontSize: getPx(fontSize),
					whiteSpace: "nowrap", 
					overflow: "hidden", 
					textOverflow: "ellipsis", 
					border: borderWeight + "px solid black"
					}
				},
				displayName
			),

			h("span", { style: { flex:"1", border: borderWeight + "px solid black"} } ),

			countLabel = h("span", {
				style: {
					textAlign: "right", 
					marginRight: getPx(-1),
					fontSize: getPx(fontSize),
					width: getPx(60),  
					whiteSpace: "nowrap",
					overflow: "hidden", 
					textOverflow: "ellipsis", 
					border: borderWeight + "px solid black"}
				}, 
				count
			)
		)
		
		//label.style.fontWeight = bold ? "bold" : "normal";
		
		mainForm.messageList.appendChild(row);
	}
	catch (error) {
		log(error.stack);
	}
   
	row.count = getTypeCount(type);
	row.countLabel = countLabel;
	row.nameLabel = nameLabel;
	mainForm.rows[type] = row;

	return row;
}

module.exports = {
  commands: {
		showMainDialog: showMainDialog
  }
};
