const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, ImageFill, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const application = require("application");
const commands = require("commands");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var pluginTitle = "Mask Fit";

var labelFontSizeMini = 9;
var labelFontSize = 10;
var textFontSize = 11;

var activeColor = "#2680EB";
var inactiveColor = "#A0A0A0";
var activeBkgColor = "#E2E2E2";
var lightBkgColor = "#FBFBFB";
var separatorColor = "#E4E4E4";

var selectedObject;

var mask;
var maskBounds;
var maskWidth;
var maskHeight;
var maskX;
var maskY;
var maskCenterX;
var maskCenterY;

var image;
var imageBounds;
var imageWidth;
var imageHeight;
var imageX;
var imageY;
var imageCenterX;
var imageCenterY;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
async function fillMaskProportionally()
{
	// console.log("fillMaskProportionally()");

	try
	{
		let s = await checkSelection();
		if(s)
		{			
			if(maskWidth > maskHeight)
			{
				// console.log("horizontal mask - fit width");
				fillFrameProportionallyW();
			}

			if(maskHeight > maskWidth)
			{
				// console.log("vertical mask - fit height");
				fillFrameProportionallyH();
			}

			if(maskWidth == maskHeight)
			{
				// console.log("square mask - fit width or height (they both work)");
				fillFrameProportionallyW();
			}

			centerToMask();
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

function fillFrameProportionallyW()
{
	// console.log("fillFrameProportionallyW()");
	// formula
	// imageWidth:maskWidth=imageHeight:x
	let scaledHeight = (maskWidth * imageHeight) / imageWidth;
	// console.log("scaledHeight: " + scaledHeight);
	image.resize(maskWidth, scaledHeight);

	if(scaledHeight < maskHeight)
	{
		fillFrameProportionallyH()
	}
}

function fillFrameProportionallyH()
{
	// console.log("fillFrameProportionallyH()");
	// formula
	// imageHeight:maskHeight=imageWidth:x
	let scaledWidth = (maskHeight * imageWidth) / imageHeight;
	// console.log("scaledWidth: " + scaledWidth);
	image.resize(scaledWidth, maskHeight);

	if(scaledWidth < maskWidth)
	{
		fillFrameProportionallyW()
	}
}

function centerToMask()
{
	// console.log("centerToMask()");

	let imageScaledBounds = image.globalDrawBounds;
	let imageScaledWidth = imageScaledBounds.width;
	let imageScaledHeight = imageScaledBounds.height;
	let imageScaledCenterX = imageScaledBounds.x + (imageScaledBounds.width / 2);
	let imageScaledCenterY = imageScaledBounds.y + (imageScaledBounds.height / 2);

	let deltaX;
	let deltaY;

	if(imageScaledWidth > maskWidth)
	{
		deltaX = -(imageScaledCenterX - maskCenterX);
		deltaY = maskY - imageY;
	}

	if(imageScaledHeight > maskHeight)
	{
		deltaX = maskX - imageX;
		deltaY = -(imageScaledCenterY - maskCenterY);
		
	}

	/* console.log("deltaX: " + deltaX);
	console.log("deltaY: " + deltaY); */
	image.moveInParentCoordinates(deltaX, deltaY);
}

async function centerImage()
{
	// console.log("centerImage()");
	
	try
	{
		let s = await checkSelection();
		if(s)
		{			
			let deltaX;
			let deltaY;

			deltaX = -(imageCenterX - maskCenterX);
			deltaY = -(imageCenterY - maskCenterY);

			image.moveInParentCoordinates(deltaX, deltaY);
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
	let alertMessage = "Select just one mask or image inside a masked group.";

	if(selection.items.length == 0 || selection.items.length > 1)
	{
		try
		{
			await openAlertDialog(pluginTitle, alertMessage);
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	selectedObject = selection.items[0];

	// check if selected object is inside a masked group
	if(!selectedObject.parent.mask)
	{
		try
		{
			await openAlertDialog(pluginTitle, alertMessage);
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// check if there are more than 2 elements inside the group
	if(selectedObject.parent.children.length > 2)
	{
		try
		{
			await openAlertDialog(pluginTitle, "Make sure the masked group contains just one image.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	

	// the optimal masked group contains just 2 elements: the mask and the masked content
	let fillType0 = selectedObject.parent.children.at(0).fill.constructor.name;
	let fillType1 = selectedObject.parent.children.at(1).fill.constructor.name;
	// check if there are images
	if(fillType0 != "ImageFill" && fillType1 != "ImageFill")
	{
		try
		{
			await openAlertDialog(pluginTitle, "Mask Fit works with images only. The selected mask group has no image content.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// check the fill's class
	if(selectedObject.fill.constructor.name == "ImageFill")
	{
		// console.log("selectedObject is the image");
		mask = selectedObject.parent.children.at(1);
		image = selectedObject;
		/* console.log("\tmask name: " + mask.name);
		console.log("\timage name: " + image.name);
		console.log("\timage fill: " + image.fill.constructor.name); */
	}

	// if(selectedObject.constructor.name == "Rectangle")
	else
	{
		// console.log("selectedObject is the mask");
		mask = selectedObject;
		image = mask.parent.children.at(0);
		/* console.log("\tmask name: " + mask.name);
		console.log("\timage name: " + image.name);
		console.log("\timage fill: " + image.fill.constructor.name); */
	}

	// check if mask, image or the masked group itself are rotated
	if(mask.rotation != 0 || image.rotation != 0 || mask.parent.rotation != 0)
	{
		try
		{
			await openAlertDialog(pluginTitle, "Mask Fit doesn't support rotated objects. Set their rotation to 0°.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}	

	maskBounds = mask.globalDrawBounds;
	maskWidth = maskBounds.width;
	maskHeight = maskBounds.height;
	maskX = maskBounds.x;
	maskY = maskBounds.y;
	maskCenterX = maskX + (maskWidth / 2);
	maskCenterY = maskY + (maskHeight / 2);

	/* console.log("mask name: ", mask.name);
	console.log("maskWidth: " + maskWidth);
	console.log("maskHeight: " + maskHeight);
	console.log("maskX: " + maskX);
	console.log("maskY: " + maskY);
	console.log("maskCenterX: " + maskCenterX);
	console.log("maskCenterY: " + maskCenterY); */
	
	imageBounds = image.globalDrawBounds;
	imageWidth = imageBounds.width;
	imageHeight = imageBounds.height;
	imageX = imageBounds.x;
	imageY = imageBounds.y;
	imageCenterX = imageX + (imageWidth / 2);
	imageCenterY = imageY + (imageHeight / 2);

	/* console.log("\nimage name: ", image.name);
	console.log("imageWidth: " + imageWidth);
	console.log("imageHeight: " + imageHeight);
	console.log("imageX: " + imageX);
	console.log("imageY: " + imageY); */
	
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	commands: {
        fillMaskProportionally,
        centerImage
    }
}









