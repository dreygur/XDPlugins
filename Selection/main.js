const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text, selection} = require("scenegraph");

const application = require("application");
const commands = require("commands");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REFERENCES
// - - - - - - - - - - - - - - - - - - - - UI
var pluginTitle = "Selection";

var labelFontSizeMini = 10;
var labelFontSize = 11;
var textFontSize = 12;

var separatorColor = "#E4E4E4";

var selectedObject;
var selectedObjectsA;
var container;
var global;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN FUNCTIONS
// - - - - - - - - - - - - - - - - - - - - - - - - - - - FILL
async function selectSameFill()
{
	try
	{
		await selectSameFillOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillGlobally()
{
	try
	{
		await selectSameFillOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillOk(_global)
{
	// console.log("selectSameFillOk()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.fill == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with a fill.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}

			if(selectedObject.fill.colorStops != null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Gradient fills are not yet supported.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
            }

            if(selectedObject.constructor.name == "Artboard")
            {
                // console.log("global selection by Artboard's fill");
                container.children.forEach(function(child, i)
                {
                    // console.log(child.constructor.name);
                    if(child.constructor.name == "Artboard")
					{
                        // console.log(child.constructor.name);
                        if(child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b)
                        {
                            // logObjectProperties(child);
                            selectedObjectsA.push(child);
                        }
					}
                });
                selection.items = selectedObjectsA;
                checkFinalSelection("fill");
                return;
            }
            
            /* if(global == true && selectedObject.constructor.name == "Artboard")
            {
                // console.log("global selection by Artboard's fill");
                container.children.forEach(function(child, i)
                {
                    // console.log(child.constructor.name);
                    if(child.constructor.name == "Artboard")
					{
                        // console.log(child.constructor.name);
                        if(child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b)
                        {
                            // logObjectProperties(child);
                            selectedObjectsA.push(child);
                        }
					}
                });
                selection.items = selectedObjectsA;
                checkFinalSelection("fill");
                return;
            } */

			container.children.forEach(function(child, i)
			{
                if(child.fill != null && child.constructor.name != "Artboard")
                // if(child.fill != null)
				{
					// logObjectProperties(child);
					if(child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b)
					{
						// logObjectProperties(child);
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.fill != null)
							{
								// logObjectProperties(child);
								if(childInArtboard.fill.r == selectedObject.fill.r && childInArtboard.fill.g == selectedObject.fill.g && childInArtboard.fill.b == selectedObject.fill.b)
								{
									// logObjectProperties(child);
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("fill");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - STROKE
async function selectSameStroke()
{
	try
	{
		await selectSameStrokeOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameStrokeGlobally()
{
	try
	{
		await selectSameStrokeOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameStrokeOk(_global)
{
	// console.log("selectSameStrokeOk()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.stroke == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with a border.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			
			container.children.forEach(function(child, i)
			{
				if(child.stroke != null && child.constructor.name != "Artboard")
				{
					// logObjectProperties(child);
					if(child.stroke.r == selectedObject.stroke.r && child.stroke.g == selectedObject.stroke.g && child.stroke.b == selectedObject.stroke.b && child.strokeWidth == selectedObject.strokeWidth)
					{
						// logObjectProperties(child);
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.stroke != null)
							{
								// logObjectProperties(child);
								if(childInArtboard.stroke.r == selectedObject.stroke.r && childInArtboard.stroke.g == selectedObject.stroke.g && childInArtboard.stroke.b == selectedObject.stroke.b && childInArtboard.strokeWidth == selectedObject.strokeWidth)
								{
									// logObjectProperties(child);
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("border");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - STROKE COLOR
async function selectSameStrokeColor()
{
	try
	{
		await selectSameStrokeColorOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameStrokeColorGlobally()
{
	try
	{
		await selectSameStrokeColorOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameStrokeColorOk(_global)
{
	// console.log("selectSameStrokeColorOk()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.stroke == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with a border.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			
			container.children.forEach(function(child, i)
			{
				if(child.stroke != null && child.constructor.name != "Artboard")
				{
					// logObjectProperties(child);
					if(child.stroke.r == selectedObject.stroke.r && child.stroke.g == selectedObject.stroke.g && child.stroke.b == selectedObject.stroke.b)
					{
						// logObjectProperties(child);
						selectedObjectsA.push(child);
					}
				}
				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.stroke != null)
							{
								// logObjectProperties(child);
								if(childInArtboard.stroke.r == selectedObject.stroke.r && childInArtboard.stroke.g == selectedObject.stroke.g && childInArtboard.stroke.b == selectedObject.stroke.b)
								{
									// logObjectProperties(child);
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("border color");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - STROKE WIDTH
async function selectSameStrokeWidth()
{
	try
	{
		await selectSameStrokeWidthOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameStrokeWidthGlobally()
{
	try
	{
		await selectSameStrokeWidthOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameStrokeWidthOk(_global)
{
	// console.log("selectSameStrokeWidth()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.stroke == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with a border.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			
			container.children.forEach(function(child, i)
			{
				if(child.stroke != null && child.constructor.name != "Artboard")
				{
					// logObjectProperties(child);
					if(child.strokeWidth == selectedObject.strokeWidth)
					{
						// logObjectProperties(child);
						selectedObjectsA.push(child);
					}
				}
				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.stroke != null)
							{
								// logObjectProperties(child);
								if(childInArtboard.strokeWidth == selectedObject.strokeWidth)
								{
									// logObjectProperties(childInArtboard);
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("border size");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FILL & STROKE
async function selectSameFillAndStroke()
{
	try
	{
		await selectSameFillAndStrokeOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillAndStrokeGlobally()
{
	try
	{
		await selectSameFillAndStrokeOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillAndStrokeOk(_global)
{
	// console.log("selectSameFillAndStroke()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.fill == null || selectedObject.stroke == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with both a fill and a border.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			
			if(selectedObject.fill.colorStops != null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Gradient fills are not yet supported.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}	
			
			container.children.forEach(function(child, i)
			{
				if(child.fill != null && child.stroke != null && child.constructor.name != "Artboard")
				{
					if(child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b && child.stroke.r == selectedObject.stroke.r && child.stroke.g == selectedObject.stroke.g && child.stroke.b == selectedObject.stroke.b && child.strokeWidth == selectedObject.strokeWidth)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.fill != null && childInArtboard.stroke != null)
							{
								// logObjectProperties(child);
								if(childInArtboard.fill.r == selectedObject.fill.r && childInArtboard.fill.g == selectedObject.fill.g && childInArtboard.fill.b == selectedObject.fill.b && childInArtboard.stroke.r == selectedObject.stroke.r && childInArtboard.stroke.g == selectedObject.stroke.g && childInArtboard.stroke.b == selectedObject.stroke.b && childInArtboard.strokeWidth == selectedObject.strokeWidth)
								{
									// logObjectProperties(child);
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("fill and border");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FILL & STROKE COLOR
async function selectSameFillAndStrokeColor()
{
	try
	{
		await selectSameFillAndStrokeColorOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillAndStrokeColorGlobally()
{
	try
	{
		await selectSameFillAndStrokeColorOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillAndStrokeColorOk(_global)
{
	// console.log("selectSameFillAndStrokeColor()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.fill == null || selectedObject.stroke == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with both a fill and a border.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			
			if(selectedObject.fill.colorStops != null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Gradient fills are not yet supported.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}	
			
			container.children.forEach(function(child, i)
			{
				if(child.fill != null && child.stroke != null && child.constructor.name != "Artboard")
				{
					if(child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b && child.stroke.r == selectedObject.stroke.r && child.stroke.g == selectedObject.stroke.g && child.stroke.b == selectedObject.stroke.b)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.fill != null && childInArtboard.stroke != null)
							{
								if(childInArtboard.fill.r == selectedObject.fill.r && childInArtboard.fill.g == selectedObject.fill.g && childInArtboard.fill.b == selectedObject.fill.b && childInArtboard.stroke.r == selectedObject.stroke.r && childInArtboard.stroke.g == selectedObject.stroke.g && childInArtboard.stroke.b == selectedObject.stroke.b)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("fill and border color");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FILL AND STROKE WIDTH
async function selectSameFillAndStrokeWidth()
{
	try
	{
		await selectSameFillAndStrokeWidthOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillAndStrokeWidthGlobally()
{
	try
	{
		await selectSameFillAndStrokeWidthOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFillAndStrokeWidthOk(_global)
{
	// console.log("selectSameFillAndStrokeWidth()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.fill == null || selectedObject.stroke == null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select an object with both a fill and a border.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}
			
			if(selectedObject.fill.colorStops != null)
			{
				try
				{
					await openAlertDialog(pluginTitle, "Gradient fills are not yet supported.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}	
			
			container.children.forEach(function(child, i)
			{
				if(child.fill != null && child.stroke != null && child.constructor.name != "Artboard")
				{
					if(child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b && child.strokeWidth == selectedObject.strokeWidth)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.fill != null && childInArtboard.stroke != null)
							{
								if(childInArtboard.fill.r == selectedObject.fill.r && childInArtboard.fill.g == selectedObject.fill.g && childInArtboard.fill.b == selectedObject.fill.b && childInArtboard.strokeWidth == selectedObject.strokeWidth)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("fill and border size");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - OPACITY
async function selectSameOpacity()
{
	try
	{
		await selectSameOpacityOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameOpacityGlobally()
{
	try
	{
		await selectSameOpacityOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameOpacityOk(_global)
{
	// console.log("selectSameOpacity()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.opacity == null)
			{
                try
				{
					await openAlertDialog(pluginTitle, "Select an object with an opacity.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
            }
            
            if(selectedObject.constructor.name == "Artboard")
            {
                try
                {
                    await openAlertDialog(pluginTitle, "Artbards don't have opacity. They can be selected only by the same fill.");
                    return;
                }
                catch(_error)
                {
                    console.log(_error);
                }
            }
			
			container.children.forEach(function(child, i)
			{
				if(child.opacity != null && child.constructor.name != "Artboard")
				{
					if(child.opacity == selectedObject.opacity)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.opacity != null)
							{
								if(childInArtboard.opacity == selectedObject.opacity)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("opacity");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FONT
async function selectSameFont()
{
	try
	{
		await selectSameFontOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontGlobally()
{
	try
	{
		await selectSameFontOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontOk(_global)
{
	// console.log("selectSameFontOk()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.constructor.name != "Text")
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select a Text object.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}		
			
			container.children.forEach(function(child, i)
			{
				if(child.constructor.name == "Text") //  && child.constructor.name != "Artboard")
				{
					if(child.fontFamily == selectedObject.fontFamily && child.fontStyle == selectedObject.fontStyle)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.constructor.name == "Text")
							{
								if(childInArtboard.fontFamily == selectedObject.fontFamily && childInArtboard.fontStyle == selectedObject.fontStyle)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("font");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FONT SIZE
async function selectSameFontSize()
{
	try
	{
		await selectSameFontSizeOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontSizeGlobally()
{
	try
	{
		await selectSameFontSizeOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontSizeOk(_global)
{
	// console.log("selectSameFontSize()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.constructor.name != "Text")
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select a Text object.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}		
			
			container.children.forEach(function (child, i)
			{
				if(child.constructor.name == "Text")
				{
					if(child.fontSize == selectedObject.fontSize)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.constructor.name == "Text")
							{
								if(childInArtboard.fontSize == selectedObject.fontSize)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("font size");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FONT & FONT SIZE
async function selectSameFontAndFontSize()
{
	try
	{
		await selectSameFontAndFontSizeOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontAndFontSizeGlobally()
{
	try
	{
		await selectSameFontAndFontSizeOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontAndFontSizeOk(_global)
{
	// console.log("selectSameFontAndFontSize()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.constructor.name != "Text")
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select a Text object.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}		
			
			container.children.forEach(function (child, i)
			{
				if(child.constructor.name == "Text")
				{
					if(child.fontFamily == selectedObject.fontFamily && child.fontStyle == selectedObject.fontStyle && child.fontSize == selectedObject.fontSize)
					{
						selectedObjectsA.push(child);
					}
				}
				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.constructor.name == "Text")
							{
								if(childInArtboard.fontFamily == selectedObject.fontFamily && childInArtboard.fontStyle == selectedObject.fontStyle && childInArtboard.fontSize == selectedObject.fontSize)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("font and font size");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FONT & COLOR
async function selectSameFontAndColor()
{
	try
	{
		await selectSameFontAndColorOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontAndColorGlobally()
{
	try
	{
		await selectSameFontAndColorOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontAndColorOk(_global)
{
	// console.log("selectSameFontAndColor()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.constructor.name != "Text")
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select a Text object.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}		
			
			container.children.forEach(function (child, i)
			{
				if(child.constructor.name == "Text")
				{
					if(child.fontFamily == selectedObject.fontFamily && child.fontStyle == selectedObject.fontStyle && child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.constructor.name == "Text")
							{
								if(childInArtboard.fontFamily == selectedObject.fontFamily && childInArtboard.fontStyle == selectedObject.fontStyle && childInArtboard.fill.r == selectedObject.fill.r && childInArtboard.fill.g == selectedObject.fill.g && childInArtboard.fill.b == selectedObject.fill.b)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("font and color");
		}
	}
	catch(_error)
	{
		console.log(_error);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - FONT & FONT SIZE & COLOR
async function selectSameFontAndFontSizeAndColor()
{
	try
	{
		await selectSameFontAndFontSizeAndColorOk(false);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontAndFontSizeAndColorGlobally()
{
	try
	{
		await selectSameFontAndFontSizeAndColorOk(true);
	}
	catch(_error)
	{
		console.log(_error);
	}
}

async function selectSameFontAndFontSizeAndColorOk(_global)
{
	// console.log("selectSameFontAndFontSizeAndColor()");

	global = _global;
	selectedObjectsA = [];

	try
	{
		let s = await checkSelection();
		if(s)
		{
			if(selectedObject.constructor.name != "Text")
			{
				try
				{
					await openAlertDialog(pluginTitle, "Select a Text object.");
					return;
				}
				catch(_error)
				{
					console.log(_error);
				}
			}		
			
			container.children.forEach(function (child, i)
			{
				if(child.constructor.name == "Text")
				{
					if(child.fontFamily == selectedObject.fontFamily && child.fontStyle == selectedObject.fontStyle && child.fontSize == selectedObject.fontSize && child.fill.r == selectedObject.fill.r && child.fill.g == selectedObject.fill.g && child.fill.b == selectedObject.fill.b)
					{
						selectedObjectsA.push(child);
					}
				}

				if(global == true)
				{
					if(child.constructor.name == "Artboard")
					{
						// console.log("Artboard: " + i);
						child.children.forEach(function(childInArtboard, i)
						{
							if(childInArtboard.constructor.name == "Text")
							{
								if(childInArtboard.fontFamily == selectedObject.fontFamily && childInArtboard.fontStyle == selectedObject.fontStyle && childInArtboard.fontSize == selectedObject.fontSize && childInArtboard.fill.r == selectedObject.fill.r && childInArtboard.fill.g == selectedObject.fill.g && childInArtboard.fill.b == selectedObject.fill.b)
								{
									selectedObjectsA.push(childInArtboard);
								}
							}
						});
					}
				}
			});
			selection.items = selectedObjectsA;
			checkFinalSelection("font, font size and color");
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
	if(selection.items.length == 0)
	{
		try
		{
            await openAlertDialog(pluginTitle, "Select an object excluding Repeat Grids and groups.");
            // await openAlertDialog(pluginTitle, "Select an object excluding Artboards, Repeat Grids and groups.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	if(selection.items.length > 1)
	{
		try
		{
			await openAlertDialog(pluginTitle, "Select just one object.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}
	
	selectedObject = selection.items[0];
	container = selectedObject.parent;

	// if selection is global and selected object is inside an Artboard, switch container to RootNode
	if(global == true && container.constructor.name == "Artboard")  
	{
		// console.log(container.constructor.name); // container is an "Artboard"
		container = container.parent;
		// console.log(container.constructor.name); // container is the "RootNode"
	}

	if(global == true && container.constructor.name == "Group")
	{
		try
		{
			await openAlertDialog(pluginTitle, "To use global selections, select an object outside RepeatGrids or groups.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

    // if(selectedObject.constructor.name == "Artboard" || selectedObject.constructor.name == "RepeatGrid" || selectedObject.constructor.name == "Group")
    if(selectedObject.constructor.name == "RepeatGrid" || selectedObject.constructor.name == "Group")
	{
		try
		{
            await openAlertDialog(pluginTitle, "Select an object excluding Repeat Grids and groups.");
            // await openAlertDialog(pluginTitle, "Select an object excluding Artboards, Repeat Grids and groups.");
		}
		catch(_error)
		{
			console.log(_error);
		}
		return false;
	}

	// * * * getSelectedObjectProperties(selectedObject);
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
/* function logObjectProperties(_object)
{
	console.log("logObjectProperties()");
	
	console.log(_object.constructor.name);
} */

/* function getSelectedObjectProperties()
{
	console.log("getSelectedObjectProperties()");

	console.log("fill: " + selectedObject.fill);
	console.log("fillenabled: " + selectedObject.fillenabled);
	console.log("stroke: " + selectedObject.stroke);
	console.log("strokeEnabled: " + selectedObject.strokeEnabled);
	console.log("strokeWidth: " + selectedObject.strokeWidth);
	console.log("strokePosition: " + selectedObject.strokePosition);
	console.log("strokeEndCaps: " + selectedObject.strokeEndCaps);
	console.log("strokeJoins: " + selectedObject.strokeJoins);
	console.log("strokeMiterLimit: " + selectedObject.strokeMiterLimit);
	console.log("strokeDashArray: " + selectedObject.strokeDashArray);
	console.log("strokeDashOffset: " + selectedObject.strokeDashOffset);
	console.log("shadow: " + selectedObject.shadow);
	console.log("blur: " + selectedObject.blur);
	console.log("hasLinkedGraphicFill: " + selectedObject.hasLinkedGraphicFill);
	console.log("opacity: " + selectedObject.opacity);

	if(selectedObject.constructor.name == "Text")
	{
		console.log("fontFamily: " + selectedObject.fontFamily);
		console.log("fontStyle: " + selectedObject.fontStyle);
		console.log("fontSize: " + selectedObject.fontSize);
	}
} */

async function checkFinalSelection(_mode)
{
	if(selection.items.length == 1)
	{
		try
		{
            let message;
            let type = selectedObject.constructor.name == "Artboard" ? "Artboards" : "objects";
			if(global == true)
			{
                message = "No global " + type + " with the same ";
                // message = "No global objects with the same ";
			}
			else
			{
                message = "No local " + type + " with the same ";
                // message = "No local objects with the same ";
			}

			await openAlertDialog(pluginTitle, message + _mode + ".");
		}
		catch(_error)
		{
			console.log(_error);
		}
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORT
module.exports = {
	commands: {
		selectSameFill,
		selectSameStroke,
		selectSameStrokeColor,
		selectSameStrokeWidth,
		selectSameFillAndStroke,
		selectSameFillAndStrokeColor,
		selectSameFillAndStrokeWidth,
		selectSameOpacity,
		selectSameFont,
		selectSameFontSize,
		selectSameFontAndFontSize,
		selectSameFontAndColor,
		selectSameFontAndFontSizeAndColor,

		selectSameFillGlobally,
		selectSameStrokeGlobally,
		selectSameStrokeColorGlobally,
		selectSameStrokeWidthGlobally,
		selectSameFillAndStrokeGlobally,
		selectSameFillAndStrokeColorGlobally,
		selectSameFillAndStrokeWidthGlobally,
		selectSameOpacityGlobally,
		selectSameFontGlobally,
		selectSameFontSizeGlobally,
		selectSameFontAndFontSizeGlobally,
		selectSameFontAndColorGlobally,
		selectSameFontAndFontSizeAndColorGlobally
    }
}









