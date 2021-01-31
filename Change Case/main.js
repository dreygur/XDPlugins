const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const application = require("application");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var pluginTitle = "Change Case";

var labelFontSizeMini = 10;
var labelFontSize = 11;
var textFontSize = 12;

var separatorColor = "#E4E4E4";

var convertMode;
var stringsA = [];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
async function makeLowerCase()
{
	// console.log("makeLowerCase()");

	// console.log("Artboard name: " + selection.focusedArtboard.name);

	convertMode = "lowerCase";

	try
	{
		let s = await checkSelection();
		if(s)
		{			
			try
			{
				await changeCase();
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

async function makeUpperCase()
{
	// console.log("makeUpperCase()");

	convertMode = "upperCase";

	try
	{
		let s = await checkSelection();
		if(s)
		{			
			try
			{
				await changeCase();
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

async function makeTitleCase()
{
	// console.log("makeTitleCase()");
	
	convertMode = "titleCase";

	try
	{
		let s = await checkSelection();
		if(s)
		{			
			try
			{
				await changeCase();
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

async function makeSentenceCase()
{
	// console.log("makeSentenceCase()");
	
	convertMode = "sentenceCase";

	try
	{
		let s = await checkSelection();
		if(s)
		{			
			try
			{
				await changeCase();
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SELECTION CHECK
async function checkSelection()
{
	// console.log("checkSelection()");

	if(selection.items.length == 0)
	{
		try
		{
			await openAlertDialog(pluginTitle, "Select at least one Text element or Artboard.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	for(let i = 0; i < selection.items.length; i++)
	{
		// check if any selected object is not a Text instance
		if(selection.items[i].constructor.name != "Text")
		{
			// console.log("selected object is not Text");

			// check if any selected object is not an Artboard instance
			if(selection.items[i].constructor.name != "Artboard")
			{
				// console.log("selected object is neither Text nor Artboard");
				try
				{
					openAlertDialog(pluginTitle, "Select only Text elements or Artboards.");
				}
				catch(_error)
				{
					console.log(_error);
				}
				return false;
			}
		}
	}
	return true;
}

async function checkRepeatGrid()
{
	// console.log("");
	// console.log("checkRepeatGrid()");

	if(selection.items[0].parent.parent != null)
	{
		// console.log("text not in the RootNode");

		if(selection.items[0].parent.parent.constructor.name == "RepeatGrid")
		{
			// console.log("* text inside Repeat Grid - direct children of cell - OK *");

			// check if there is a multiple selection
			if(selection.items.length > 1)
			{
				// console.log("* multiple selection inside Repeat Grid cell - ALERT *");
				try
				{
					await openAlertDialog(pluginTitle, "Select one Text element at a time.");
				}
				catch(_error)
				{
					console.log(_error);
				}
				return true;
			}

			
			
			// console.log("* text inside Repeat Grid *");
			
			let repeatGrid = selection.items[0].parent.parent;
			let selectedText = selection.items[0];
			
			// reset layer's name to avoid content issues
			selection.items[0].name = selection.items[0].text;
			let selectedTextName = selection.items[0].name;

			getRepeatGridData(repeatGrid, selectedTextName);

			repeatGrid.attachTextDataSeries(selectedText, stringsA);

			return true;
		}

		// traverse the node tree upwards and check if selected text is inside a Group into a Repeat Grid cell
		let nodeParent = selection.items[0].parent;
		for(let j = 0; j < 20; j++)
		{
			// console.log(nodeParent.constructor.name);
			if(nodeParent.constructor.name == "RepeatGrid")
			{
				// console.log("Selected Text is inside a Repeat Grid!!!");
				try
				{
					await openAlertDialog(pluginTitle, "Groups inside Repeat Grids are not supported yet. Text elements must be direct children of cells.");

					// await openAlertDialog(pluginTitle, "This plugin doesn't support Groups inside Repeat Grids. Text elements must be direct children of cells.");

					// await openAlertDialog(pluginTitle, "It looks like the selected Text element is part of a Group. Text elements inside Repeat Grids must be direct children of cells.");
				}
				catch(_error)
				{
					console.log(_error);
				}
				return true;
			}
			if(nodeParent.constructor.name == "RootNode")
			{
				break;
			}

			nodeParent = nodeParent.parent;
		}
		return false;
	}
	else
	{
		// console.log("text in the RootNode");
		return false;
	}
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
function getRepeatGridData(_repeatGrid, _textName)
{
	// console.log("");
	// console.log("getRepeatGridData()");

	stringsA = [];

	_repeatGrid.children.forEach(function (cell, i)
	{
		cell.children.forEach(function (cellElement, j)
		{
			if(cellElement.name == _textName)
			{
				stringsA.push(convertString(cellElement.text));	
			}
		});
	});
}

async function changeCase()
{
	try
	{
		let r = await checkRepeatGrid(selection);
		if(!r)
		{
			// console.log("text outside Repeat Grid");
			for(let i = 0; i < selection.items.length; i++)
			{
				if(selection.items[i].constructor.name == "Text")
				{
					selection.items[i].text = convertString(selection.items[i].text)
				}
				else if(selection.items[i].constructor.name == "Artboard")
				{
					selection.items[i].name = convertString(selection.items[i].name)
				}
				// selection.items[i].text = convertString(selection.items[i].text);
				// selection.items[i].name = convertString(selection.items[i].name);
			}
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

function convertString(_string)
{
	let convertedString;

	switch(convertMode)
	{
		case "lowerCase":
			convertedString = _string.toLowerCase();
			break;

		case "upperCase":
			convertedString = _string.toUpperCase();
			
			break;
		
		case "titleCase":
			let wordsA = _string.toLowerCase().split(" ");
			for (var j = 0; j < wordsA.length; j++)
			{
				wordsA[j] = wordsA[j].charAt(0).toUpperCase() + wordsA[j].slice(1); 
			}
			convertedString = wordsA.join(" ");
			break;

		case "sentenceCase":
			convertedString = _string.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g,function(c){return c.toUpperCase()});
			break;
	}
	return convertedString;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	commands: {
        makeLowerCase,
        makeUpperCase,
		makeTitleCase,
		makeSentenceCase
    }
}