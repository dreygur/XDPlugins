const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Polygon, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const application = require("application");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var pluginTitle = "Convert Shape";

var labelFontSizeMini = 10;
var labelFontSize = 11;
var textFontSize = 12;

var separatorColor = "#E4E4E4";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
async function convertToTriangle()
{	
	try
	{
		let s = await checkSelection();
		if(s)
		{
			// console.log("convert to Triangle");
			convertToShape("triangle");
		}
	}
	catch(_error)
	{
		// cancelled
		console.log(_error);
	}
}

async function convertToRectangle()
{	
	try
	{
		let s = await checkSelection();
		if(s)
		{
			// console.log("convert to Rectangle");
			convertToShape("rectangle");
		}
	}
	catch(_error)
	{
		// cancelled
		console.log(_error);
	}
}

async function convertToEllipse()
{	
	try
	{
		let s = await checkSelection();
		if(s)
		{
			// console.log("convert to Ellipse");
			convertToShape("ellipse");
		}
	}
	catch(_error)
	{
		// cancelled
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{	

	if(selection.items.length == 0)
	{
		try
		{
			await openAlertDialog(pluginTitle, "Select at least one object, excluding Artboards, Repeat Grids, Symbols or groups.");
			// return;
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	for(let i = 0; i < selection.items.length; i++)
	{
		if(selection.items[i].constructor.name == "Artboard" || selection.items[i].constructor.name == "RepeatGrid" || selection.items[i].constructor.name == "SymbolInstance" || selection.items[i].constructor.name == "Group")
		{
			try
			{
				await openAlertDialog(pluginTitle, "Select at least one object, excluding Artboards, Repeat Grids, Symbols or groups.");
				// return;
			}
			catch(_error)
			{
				console.log(_error);
			}
			return false;
		}
	}

	for(let i = 0; i < selection.items.length; i++)
	{
		if(selection.items[i].fill != null)
		{
			if(selection.items[i].fill.colorStops != null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Gradient fills are not supported yet.");
					// return;
				}
				catch(_error)
				{
					console.log(_error);
				}
				return false;
			}
		}
	}

	let firstObjectParentType = selection.items[0].parent.constructor.name;
	// get the first selected object's container
	let firstObjectParent = selection.items[0].parent;

	for(let i = 0; i < selection.items.length; i++)
	{
		// check if other objects are inside a different container OR if they are in different artboards
		if(selection.items[i].parent.constructor.name != firstObjectParentType || selection.items[i].parent != firstObjectParent)
		{
			try
			{
				await openAlertDialog(pluginTitle, "Make sure selected objects are all in the same Artboard or in the Pasteboard.");
				// return;
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - HELPERS
function createButton(_text, _variant, _quiet)
{
    let newButton = document.createElement("button");
    newButton.textContent = _text;
    newButton.setAttribute("uxp-variant", _variant);
	newButton.setAttribute("uxp-quiet", _quiet);
    return newButton;
}

function createSeparator()
{
    let newSeparator = document.createElement("div");
    newSeparator.style.height = 1;
	newSeparator.style.background = separatorColor;
    return newSeparator;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UTILITIES
function getSelectedObjectProperties(_selectedObject)
{
	console.log("getSelectedObjectProperties()");
	
	console.log("type: " + _selectedObject.constructor.name);
	console.log("fillEnabled: " + _selectedObject.fillEnabled);
	console.log("fill: " + _selectedObject.fill);
	console.log("strokeEnabled: " + _selectedObject.strokeEnabled);
	console.log("stroke: " + _selectedObject.stroke);
	console.log("strokeWidth: " + _selectedObject.strokeWidth);
	console.log("strokePosition: " + _selectedObject.strokePosition);
	console.log("strokeEndCaps: " + _selectedObject.strokeEndCaps);
	console.log("strokeJoins: " + _selectedObject.strokeJoins);
	console.log("strokeMiterLimit: " + _selectedObject.strokeMiterLimit);
	console.log("strokeDashArray: " + _selectedObject.strokeDashArray);
	console.log("strokeDashOffset: " + _selectedObject.strokeDashOffset);
	console.log("blendMode: " + _selectedObject.blendMode);
	console.log("shadow: " + _selectedObject.shadow);
	console.log("blur: " + _selectedObject.blur);
	console.log("hasLinkedGraphicFill: " + _selectedObject.hasLinkedGraphicFill);
	console.log("opacity: " + _selectedObject.opacity);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DRAWING FUNCTION
function convertToShape(_shape)
{
    let selectedObjectsA = [];
    
    let shapesA = [];

	for(let i = 0; i < selection.items.length; i++)
	{
		// console.log("object " + i);
		let selectedObject = selection.items[i];

		// * * * getSelectedObjectProperties(selectedObject);

		let selectedObjectWidth = selectedObject.localBounds.width;
		let selectedObjectHeight = selectedObject.localBounds.height;
		let selectedObjectX = selectedObject.boundsInParent.x;
		let selectedObjectY = selectedObject.boundsInParent.y;

		let shape;

		switch(_shape)
		{
			case "triangle":
				// console.log("\tconvert to triangle");
                shape = new Polygon();
                shape.cornerCount = 3;
                shape.width = selectedObjectWidth;
                shape.height = selectedObjectHeight;
                
                /* var pathData =
				`
					M${selectedObjectWidth / 2},0
					l${selectedObjectWidth / 2},${selectedObjectHeight}
					l${-selectedObjectWidth},0
					Z
				`;
				shape = new Path();
				shape.pathData = pathData; */
				break;

			case "rectangle":
				// console.log("\tconvert to rectangle");
				shape = new Rectangle();
				shape.width = selectedObjectWidth;
				shape.height = selectedObjectHeight;
				break;

			case "ellipse":
				// console.log("\tconvert to ellipse");
				shape = new Ellipse();
				shape.radiusX = selectedObjectWidth / 2;
				shape.radiusY = selectedObjectHeight / 2;
			break;
		}

		shape.fillEnabled = selectedObject.fillEnabled;
		shape.fill = selectedObject.fill;
		
		shape.strokeEnabled = selectedObject.strokeEnabled;
		shape.stroke = selectedObject.stroke;
		shape.strokeWidth = selectedObject.strokeWidth;
		shape.strokePosition = selectedObject.strokePosition;
		shape.strokeEndCaps = selectedObject.strokeEndCaps;
		shape.strokeJoins = selectedObject.strokeJoins;
		shape.strokeMiterLimit = selectedObject.strokeMiterLimit;
		shape.strokeDashArray = selectedObject.strokeDashArray;
		shape.strokeDashOffset = selectedObject.strokeDashOffset;

		shape.blendMode = selectedObject.blendMode;

		shape.shadow = selectedObject.shadow;

		shape.blur = selectedObject.blur;
		shape.opacity = selectedObject.opacity;

        selection.insertionParent.addChildBefore(shape, selectedObject);
        shapesA.push(shape);
		
		let shapeTopLeft = {x: 0, y: 0};
		let shapeX = selectedObjectX;
		let shapeY = selectedObjectY;
		shape.placeInParentCoordinates(shapeTopLeft, {x: shapeX, y: shapeY});

		if(selectedObject.rotation != 0)
		{
			// console.log("selected object is rotated");
			shape.rotateAround(selectedObject.rotation, shape.localCenterPoint);
			
			let shapeOffsetX = selectedObject.globalDrawBounds.x - shape.globalDrawBounds.x;
			let shapeOffsetY = selectedObject.globalDrawBounds.y - shape.globalDrawBounds.y;
			shape.moveInParentCoordinates(shapeOffsetX, shapeOffsetY);
		}
		selectedObjectsA.push(selectedObject);
	}
	
	for(let i = 0; i < selectedObjectsA.length; i++)
	{
		// remove all original objects
		selectedObjectsA[i].removeFromParent();
    }

    // select all shapes
    selection.items = shapesA;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports =
{
	commands:
	{
		convertToTriangle,
		convertToRectangle,
		convertToEllipse
	}
};