const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Polygon, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const application = require("application");
const commands = require("commands");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var pluginTitle = "Polygons";

var labelFontSizeMini = 10;
var labelFontSize = 11;
var textFontSize = 12;

var separatorColor = "#E4E4E4";

var artboardCenterX;
var artboardCenterY;
var pathData;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
async function drawTriangleRight(selection)
{
	// console.log("drawTriangleRight()");
	// use Path

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			let triangleWidth = 100;
			let triangleHeight = 100;
			
			pathData =
			`
				M${artboardCenterX - (triangleWidth / 2)},${artboardCenterY - (triangleHeight / 2)}
				l${triangleWidth},${triangleHeight}
				l${-triangleWidth},0
				Z
			`;

			drawPath();
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawTriangleIsosceles(selection)
{
	// console.log("drawTriangleIsosceles()");
	// use Polygon

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			let triangleWidth = 120;
			let triangleHeight = 120; // Math.round(Math.sqrt(3)/2 * squareWidth);

			drawPolygon(3, triangleWidth, triangleHeight);
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawTriangleEquilateral(selection)
{
	// console.log("drawTriangleEquilateral()");
	// use Polygon

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			let triangleWidth = 120;
			let triangleHeight = Math.round(Math.sqrt(3)/2 * triangleWidth);

			drawPolygon(3, triangleWidth, triangleHeight);
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawSquare()
{
	// console.log("drawSquare()");
	// use Rectangle

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			let squareSize = 100;
			// let squareHeight = 100;

			let square = new Rectangle();
			square.width = squareSize;
			square.height = squareSize;
			square.fill = new Color("#000000");
			square.fillEnabled = true;
			square.stroke = new Color("#000000");
			square.strokeEnabled = false;
			selection.insertionParent.addChild(square);
			selection.items = [square];

			let squareX = artboardCenterX - (squareSize / 2);
			let squareY = artboardCenterY - (squareSize / 2);
			square.placeInParentCoordinates({x: 0, y: 0}, {x: squareX, y: squareY});
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawRhombus(selection)
{
	// console.log("drawRhombus( )");
	// use Polygon

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			let rhombusWidth = 100;
			let rhombusHeight = 140;

			drawPolygon(4, rhombusWidth, rhombusHeight);
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawPentagon(selection)
{
	// console.log("drawPentagon()");
	// use Polygon

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			let pentagonWidth = 126;
			let pentagonHeight = 120;

			drawPolygon(5, pentagonWidth, pentagonHeight);
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawHexagon(selection)
{
	// console.log("drawHexagon()");
	// use Polygon

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{			
			let hexagonWidth = 124;
			let hexagonHeight = 108;

			drawPolygon(6, hexagonWidth, hexagonHeight);
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawStar(selection)
{
	// console.log("drawStar()");
	// use Polygon

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{
			
			let starWidth = 132;
			let starHeight = 126;
			let starCornerCount = 5;
			let starRatio = 52;

			drawPolygon(starCornerCount, starWidth, starHeight, starRatio);
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function drawCircle()
{
	// console.log("drawCircle()");
	// use Ellipse

	try
	{
		let s = await checkSelection(selection);
		if(s)
		{			
			let circleRadius = 60;

			let circle = new Ellipse();
			circle.radiusX = circleRadius;
			circle.radiusY = circleRadius;
			circle.fill = new Color("#000000");
			circle.fillEnabled = true;
			circle.stroke = new Color("#000000");
			circle.strokeEnabled = false;
			selection.insertionParent.addChild(circle);

			let circleX = artboardCenterX - circleRadius;
			let circleY = artboardCenterY - circleRadius;
			circle.placeInParentCoordinates({x: 0, y: 0}, {x: circleX, y: circleY});
			selection.items = [circle];
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{
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
			// console.log("selection inside a Group - OPEN ALERT!!!");
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
	artboardCenterX = selection.focusedArtboard.width / 2;
	artboardCenterY = selection.focusedArtboard.height / 2;

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
function drawPath()
{
	// console.log("drawPath()");

	let path = new Path();
	path.pathData = pathData;
	path.fill = new Color("#000000");
	path.fillEnabled = true;
	path.stroke = new Color("#000000");
	path.strokeEnabled = false;
	selection.insertionParent.addChild(path);
	selection.items = [path];
}

function drawPolygon(_corners, _width, _height, _starRatio)
{
	// console.log("drawPolygon()");

	let polygon = new Polygon();
	polygon.cornerCount = _corners;
	polygon.width = _width;
	polygon.height = _height;

	// manage stars, if _starRatio is received
	if(_starRatio)
	{
		// console.log("star");
		polygon.starRatio = _starRatio;
	}

	polygon.fill = new Color("#000000");
	selection.insertionParent.addChild(polygon);
	selection.items = [polygon];

	// center polygon to artboard
	let polygonX = artboardCenterX - (_width / 2);
	let polygonY = artboardCenterY - (_height / 2);
	polygon.placeInParentCoordinates({x: 0, y: 0}, {x: polygonX, y: polygonY});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports =
{
	commands:
	{
		drawTriangleRight,
		drawTriangleIsosceles,
		drawTriangleEquilateral,
		drawSquare,
		drawRhombus,
		drawPentagon,
		drawHexagon,
		drawStar,
		drawCircle
	}
};