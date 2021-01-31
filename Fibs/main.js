const { Artboard, Rectangle, Ellipse, Text, Color, Path } = require("scenegraph");
let commands = require("commands");

let panel;

function addClickEventListener(objectName, eventHandler) {
	const objectView = panel.querySelector("#" + objectName);
	objectView.addEventListener("click", eventHandler);	
}

function getModifiedColor(initColor, modifyR, modifyG, modifyB, modifyA, change, ratio) {
	let retColor = initColor;

	if(modifyR) if(change == 1) retColor.r = initColor.r / ratio; else if(change == -1) retColor.r = initColor.r * ratio;
	if(modifyG) if(change == 1) retColor.g = initColor.g / ratio; else if(change == -1) retColor.g = initColor.g * ratio;
	if(modifyB) if(change == 1) retColor.b = initColor.b / ratio; else if(change == -1) retColor.b = initColor.b * ratio;
	if(modifyA) if(change == 1) retColor.a = initColor.a / ratio; else if(change == -1) retColor.a = initColor.a * ratio;

	return retColor;
}

function addFrameEventHandler(e) {
	const id = e.currentTarget.getAttribute('id');
	console.log("addFrameEventHandler", id);
	const { editDocument } = require("application");
	let defaultSize = 20;
	let defaultIsRect = true;
	editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
		switch(id) {
			case "icon1": 
				startWithANewShape(defaultIsRect, defaultSize, selection, "black", false);
				addFrame(3, selection, "black", false, false, false, true, false);
				break;
			case "icon2": 
				startWithANewShape(defaultIsRect, defaultSize, selection, "black", false);
				addFrame(4, selection, "black", false, false, false, true, false);
				break;
			case "icon3": 
				startWithANewShape(defaultIsRect, defaultSize, selection, "black", false);
				addFrame(5, selection, "black", false, false, false, true, false);
				break;
			case "icon4": 
				startWithANewShape(defaultIsRect, defaultSize, selection, "red", true);
				addFrame(4, selection, "red", true, false, false, true, false);
				break;
			case "icon5": 
				startWithANewShape(defaultIsRect, defaultSize, selection, "green", true);
				addFrame(4, selection, "green", false, true, false, true, false);
				break;
			case "icon6": 
				startWithANewShape(defaultIsRect, defaultSize, selection, "blue", true);	
				addFrame(4, selection, "blue", false, false, true, true, false);
				break;
			default:
				break;
		}
	})
}

function addSpiralEventHandler(e) {
	const { editDocument } = require("application");
	editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
		const minSize = 10;
		const multiplier = 4;
		const maxSpirals = 3;
		const delim = Math.min(multiplier * maxSpirals, Number(panel.querySelector("#delim0").value) * multiplier);
		
		startWithANewShape(false, minSize, selection, "black", false);
		addFrame(delim, selection, "black", false, false, false, true, false);
	});
}

function addFibFrameEventHandler(e) { 
	const { editDocument } = require("application");
	editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
		const delim = Math.min(12, Number(panel.querySelector("#delim1").value) - 1);
		addFrame(delim, selection, "black", false, false, false, true, false);
	});
}

function addColorFibFrameEventHandler(e) { 
	const { editDocument } = require("application");
	editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
		const delim = Math.min(12, Number(panel.querySelector("#delim2").value) - 1);
		const modifyR = document.querySelector("#tsR").checked;
        const modifyG = document.querySelector("#tsG").checked;

        const modifyB = document.querySelector("#tsB").checked;
        const modifyA = document.querySelector("#tsA").checked;
		addFrame(delim, selection, "black", modifyR, modifyG, modifyB, modifyA, false);
	});
}

function addFibBoxFrameEventHandler(e) { 
	const { editDocument } = require("application");
	editDocument({ editLabel: "Increase rectangle size" }, function (selection, documentRoot) {
		const delim = Math.min(12, Number(panel.querySelector("#delim3").value) - 1);
		addFrame(delim, selection, "black", false, false, false, true, true);
	});
}

function addGoldenRatioFrame() {
    const HTML =
        `<style>
        .title {
            color: #000000;
            width: 100%;
            text-align: left;
            font-size: 12px;
		}
		.section-header {
            color: #000000;
            width: 100%;
            text-align: left;
			font-size: 10px;
			margin: 10px;
			padding: 10px;
			background-color: #EEEEEE;
		}
		.smart-section {
			color: #FFFFFF;
			background-color: #4BC7BE;
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
		img {
			object-fit: cover;
		}
		img:hover {
			cursor: pointer;
		}
        .light {
            background-color: #FFFFFF;
            
        }
        .default {
            
        }
    </style>
    <div>
		<p class="title"> <b>Fibs </b> provide an easy way to create golden ratio frames.  <a href="https://youtu.be/a8alLmdYONo">Learn more</a></p>
		<p class="">
		Also checkout the <b>Fibs Challenge</b> below. <a href="https://sl2883.wixsite.com/fibs">Learn more</a></p>
	</div>
	<div>
		<div class="row break">
			<p class="section-header"> <b>Fib basic frames</b> </p>
		</div>
		<div class="row break">
			<label class="row">
				<input type="number" uxp-quiet="true" id="delim0" value="" placeholder="Number of swings" />
				<button id="createSpiral" type="submit" uxp-variant="cta">Get Golden Spiral</button>
			</label>
		</div>
		<div class="row break">
			<p class=""> <b>Tap to get a frame below</b> </p>
		</div>
		<div class="row break">
			
			<img id="icon1" src="images/Artboard – 1.png" alt="Lamp" width="100" height="100">
			<img id="icon2" src="images/Artboard – 2.png" alt="Lamp" width="100" height="100">
			<img id="icon3" src="images/Artboard – 3.png" alt="Lamp" width="100" height="100">
		</div>
		<p class=""><br> <b>Create custom frame from selection</b> </p>
		<div class="row break">
			<label class="row">
				<input type="number" uxp-quiet="true" id="delim1" value="" placeholder="Number of fibs" />
				<button id="createFibFrame" type="submit" uxp-variant="cta">Create</button>
			</label>
		</div>
	</div>
	<div>
		<div class="row break">
			<p class="section-header"> <b>Color frames</b> </p>
			<p class=""> <b>Tap to get a frame below</b> </p>
		</div>
		
		<div class="row break">

			<img id="icon4" src="images/Artboard – 4.png" alt="Lamp" width="100" height="100">
			<img id="icon5" src="images/Artboard – 5.png" alt="Lamp" width="100" height="100">
			<img id="icon6" src="images/Artboard – 6.png" alt="Lamp" width="100" height="100">
		</div>
		<p class=""><br> <b>Create custom frame from selection</b> </p>
		<div class="row break">
		   <div class="row">
				<p class="">Properties to scale</p>
                <input type="checkbox" uxp-quiet="true" id="tsR" name="Red"/><label class="checkboxlabel" for="tsadd">Red</label>
                <input type="checkbox" uxp-quiet="true" id="tsG" name="Green"/><label class="checkboxlabel" for="tsremove">Green</label>
                <input type="checkbox" uxp-quiet="true" id="tsB" name="Blue"/><label class="checkboxlabel" for="tsbegin">Blue</label>
                <input type="checkbox" uxp-quiet="true" id="tsA" name="Alpha"/><label class="checkboxlabel" for="tsend">Alpha</label>
			</div>
			 <label class="row">
				<input type="number" uxp-quiet="true" id="delim2" value="" placeholder="Number of fibs" />
				<button id="createColorFibFrame" type="submit" uxp-variant="cta">Create</button>
            </label>
		</div>
		
        
	</div>	
	<div>
		<div class="row break">
			<p class="section-header smart-section"> <b>Fibs challenge</b> </p>
			<p class=""> Test your creative limits by taking this challenge. You can also <a href="https://twitter.com/search?q=%23fibschallenge">explore</a> what others have created to get the creative juices running. <a href="https://sl2883.wixsite.com/fibs">Learn more</a></p>
		</div>
		
		<div class="row break">

			<img src="images/Artboard – 7.png" alt="Lamp" width="100" height="100">
			<img src="images/Artboard – 8.png" alt="Lamp" width="100" height="100">
			<img src="images/Artboard – 9.png" alt="Lamp" width="100" height="100">
		</div>
		<p class=""><br> <b>Generate your creativity box</b> </p>
		<div class="row break">
		    <label class="row">
				<input type="number" uxp-quiet="true" id="delim3" value="" placeholder="Number of fibs" />
				<button id="createFibBox" type="submit" uxp-variant="cta">Create</button>
            </label>
		</div>
	</div>	
	`;

    panel = document.createElement("div");
    panel.innerHTML = HTML;
	
	addClickEventListener("icon1", addFrameEventHandler);
	addClickEventListener("icon2", addFrameEventHandler);
	addClickEventListener("icon3", addFrameEventHandler);

	addClickEventListener("icon4", addFrameEventHandler);
	addClickEventListener("icon5", addFrameEventHandler);
	addClickEventListener("icon6", addFrameEventHandler);
	
	addClickEventListener("createSpiral", addSpiralEventHandler);
	addClickEventListener("createFibFrame", addFibFrameEventHandler);
	addClickEventListener("createColorFibFrame", addColorFibFrameEventHandler);
	addClickEventListener("createFibBox", addFibBoxFrameEventHandler);
	
    return panel;
}

function startWithANewShape(isRect, size, selection, color, filled) {
	if(isRect) {
		return startWithANewRectangle(size, selection, color, filled);
	}
	else {
		return startWithANewWedge(size, selection, color, filled);
	}
}

function startWithANewRectangle(size, selection, color, filled) {

	const newElement = new Rectangle();
	newElement.width = size;
	newElement.height = size;
	if(filled) {
		newElement.fill = new Color(color);
	}
	else {
		newElement.stroke = new Color(color);
		newElement.fill = new Color({r:0, g:0, b:0, a:0});
	}

	selection.insertionParent.addChild(newElement);
	newElement.moveInParentCoordinates(100, 100);
	selection.items = newElement;

	return selection;
}

function createWedge(radius, selection, color, isFilled) { // [1]
	let c = 0.551915024494 * radius;

	//const pathData = `M0,0 C${c},0,${radius},${c},${radius}, ${radius}`; // [2]
	//const pathData = `M0,0 C0,${c},${c},${radius},${radius}, ${radius}`; // [2]
	//const pathData = `M0,${radius} C${c},${radius},${radius},${c},${radius}, 0`; // [2]
	//const pathData = `M0,${radius} C0,${c},${c},0,${radius}, 0`; // [2]
	//const pathData = `M0,${radius} C${radius},${radius},${radius},0,${radius}, 0`; // [2]
	const pathData = `M0,${radius} C0,0,${radius},0,${radius}, 0`; // [2]

	const wedge = new Path(); // [3]
	wedge.pathData = pathData; // [4]
	if(isFilled) {
		wedge.fill = new Color(color);
	}
	else {
		wedge.fill = new Color({r:0, g:0, b:0, a:0});
    	wedge.stroke = new Color(color); // [5]	
	}
	wedge.translation = {x: radius, y: radius};  // [6]
	wedge.resize(radius, radius);
	selection.insertionParent.addChild(wedge); // [7]
	wedge.moveInParentCoordinates(200, 200);
	selection.items = wedge;

	return selection;
}

function startWithANewWedge(radius, selection, color, isFilled ) {
    createWedge(radius, selection, color, isFilled);
}


function getRepeats(repeatReq, delim) {
	let repeats = [];

	repeats.push(1);
	repeats.push(1);

	for(let i = 2; i < delim + 1; i++) {
		if(repeatReq)
			repeats.push(repeats[i - 1] + repeats[i - 2]);
		else {
			repeats.push(1);
		}
	}

	repeats.reverse();

	return repeats;
}

function getColorFills(startFill, delim, modifyR, modifyG, modifyB, modifyA) {
	let colors = [];
	let currentFill = startFill;

	for(let i = 0; i < delim/2; i++) {
		currentFill = getModifiedColor(currentFill, modifyR, modifyG, modifyB, modifyA, 1, 1.618);
		colors.push(new Color({r:currentFill.r, g:currentFill.g, b:currentFill.b, a:currentFill.a}));
	}

	currentFill = startFill;

	let decreasingColors = [];
	for(let i = 0; i < delim/2; i++) {
		currentFill = getModifiedColor(currentFill, modifyR, modifyG, modifyB, modifyA, -1, 1.618);
		decreasingColors.push(new Color({r:currentFill.r, g:currentFill.g, b:currentFill.b, a:currentFill.a}));
	}

	for(let i = 0; i < decreasingColors.length; i++) {
		colors.push(decreasingColors[decreasingColors.length - 1 - i]);
	}
	
	for(let i = 0; i < colors.length; i++) {
		console.log("Color at ", i, " ", colors[i]);
	}

	return colors;
}

function addFrame(delim, selection, color, modifyR, modifyG, modifyB, modifyA, repeatReq) {

	if(!selection || !selection.items || selection.items.length <= 0) {
		let defaultSize = 20;
		selection = startWithANewShape(true, defaultSize, selection, color, true);
	}

	let startItem = selection.items[0];

	let startItemBounds = startItem.localBounds;
	let startFill = startItem.fill;

	rotateAroundCustom(startItem, true);

	let repeats = getRepeats(repeatReq, delim);

	let colors = getColorFills(startFill, delim, modifyR, modifyG, modifyB, modifyA);

	let start = 1;
	let end = 1;

	let prevItemBounds 			= startItemBounds;
	
	if(repeatReq) {
		for (let i = 0; i < repeats[0]; i++) {
			commands.duplicate();
		}	
	}
	
	for (let i = 0; i < delim; i++) {

		commands.duplicate();
		commands.sendToBack();

		let newItem = selection.items[0];

		let originalBounds = newItem.localBounds;
		let newRatio = end;

		let newWidth 	= startItemBounds.width 	* newRatio;
		let newHeight 	= startItemBounds.height 	* newRatio;

		
		newItem.resize(newWidth, newHeight);
		newItem.fill = colors[i];
		rotateAroundCustom(newItem, true);

		if(i == 0) { //right
			newItem.moveInParentCoordinates(originalBounds.width, 0);
		}
		else if(i % 4 == 0) { //right
			newItem.moveInParentCoordinates(originalBounds.width, 0);
		}
		else if(i % 4 == 1) { //top
			newItem.moveInParentCoordinates(0, -1 * originalBounds.height);
		}
		else if(i % 4 == 2) { //left
			newItem.moveInParentCoordinates(-1 * (originalBounds.width), 0);
		}
		else { //bottom
			newItem.moveInParentCoordinates(0, originalBounds.height);
		}

		prevItemBounds = originalBounds;

		if(repeatReq) {
			for(let j = 0; j < repeats[i + 1] - 1; j++) {
				commands.duplicate();
			}
		}

		let temp = start;
		start = end;
		end = start + temp;
	}

	selection.items = null;

}

function rotateAroundCustom(item, isShape) {
	if(isShape) {
		item.rotateAround(-1 * 90, item.localCenterPoint)
	}
	else {
		item.rotateAround(-1 * 270, item.localCenterPoint)
	}
}

function show(event) {
    if (!panel) 
        event.node.appendChild(addGoldenRatioFrame());
}


module.exports = {
    panels: {
        goldenratiomagic: {
            show
        }
    }
};