const presetJsonData = require("./presets.json");
const dataManager = require("./dataManager");
let panel;
let customJsonData;

async function create() {
	/**
	 * Attaches listeners to a set of presets that will create the specified artboard in the Scenegraph when clicked
	 * @param {string} cssSelector - Selector to target all presets, or only custom ones
	 */
	function attachCreateListeners(cssSelector){
		let application = require("application");
		let viewport = require("viewport");
		const {Artboard} = require("scenegraph");

		const options = panel.querySelectorAll(cssSelector);
		for (const option of options) {
			option.addEventListener("click", event => {
				const name = option.querySelector(".presetName").textContent;
				const w = parseInt(option.querySelector(".w").textContent);
				const h = parseInt(option.querySelector(".h").textContent);

				application.editDocument((selection, root) => {
					//find the most top-right artboard coordinate to place new artboard
					var rightmostX = null;
					var topmostY = null;
					root.children.forEach(node => {
						if (node instanceof Artboard){
							let artboard = node;
							const rightX = artboard.globalBounds.x + artboard.globalBounds.width;
							const topY = artboard.globalBounds.y;
							if (rightmostX === null || (rightX > rightmostX)) {
								rightmostX = rightX;
							}
							if(topmostY === null || (topY < topmostY)) {
								topmostY = topY;
							}
						}
					});

					const newArtboard = createArtboard(name, w, h);
					root.addChild(newArtboard);
					newArtboard.moveInParentCoordinates(rightmostX + 70, topmostY);
					viewport.scrollIntoView(newArtboard);
				});
			});
		}
	}

	/**
	 * Adds 'create artboard' and 'delete preset' listeners to the custom preset HTML items
	 * Upon first initialization of the plugin, expect that create listeners are already attached. 
	 * If not, reattach listeners to the new generated HTML.
	 * @param {boolean} firstInit - Is it the first time calling this function?
	 */
	function setupCustomPresets(firstInit){
		if(!firstInit) {
			attachCreateListeners("#customListContainer .presetOption");
		};

		//add event listeners to delete custom presets on right click
		const customOptions = panel.querySelectorAll("#customListContainer .presetOption");
		const customMenu = panel.querySelector("#customPresetMenu");
		for (const option of customOptions) {
			option.addEventListener("contextmenu", event => {
				customMenu.popupAt(event.clientX, event.clientY);
				customMenu.querySelector("#deleteButton").addEventListener("click", async() => {
					await deleteCustomPreset(option);
				});
			});
		}
	}

	/**
	 * Submits the form to add a new custom preset, with input validation
	 */
	const addNewPreset = async() => {
		clearErrorMessages();
		const name = panel.querySelector("#nameText").value;
		const width = panel.querySelector("#widthText").value;
		const height = panel.querySelector("#heightText").value;

		if(name.length==0 || width.length==0 || height.length==0){
			panel.querySelector("#nullCheckError").classList.remove("hideMe");
		} else if (customJsonData.values.findIndex(x => x.name === name) !== -1) {
			panel.querySelector("#uniqueCheckError").classList.remove("hideMe");
		} else if (parseInt(width) < 1 || parseInt(height) < 1 || ("" + width + height).indexOf(".") !== -1){
			panel.querySelector("#numCheckError").classList.remove("hideMe");
		} else {
			const newObj = {
				name: name,
				width: width,
				height: height
			};

			customJsonData.values.push(newObj);
			const newData = JSON.stringify(customJsonData, null, 4);

			updateCustomList(newData);
			clearAndHideForm();
		}
	}

	/**
	 * Saves updated data after creating or deleting a preset and refreshes the UI
	 * @param {string} newData - stringified JSON object with new data
	 */
	async function updateCustomList(newData) {
		await customJsonFile.write(newData);
		customJsonData = await dataManager.getJsonFromFile(customJsonFile);
		panel.querySelector("#customListContainer").innerHTML = createCustomListHTML();

		//reinitialize custom presets
		setupCustomPresets(false);
	}

	/**
	 * Deletes a custom preset, accessed from the right click menu of a preset 
	 * @param {object} option - li object containing name, width, and height of preset
	 */
	const deleteCustomPreset = async(option) => {
		//search options json by name, find first one and delete
		const deletedName = option.querySelector(".presetName").innerHTML;
		const index = customJsonData.values.findIndex(x => x.name === deletedName);

		if (index !== -1) customJsonData.values.splice(index, 1);

		const newData = JSON.stringify(customJsonData, null, 4);
		console.log("After removal:", newData);
		
		updateCustomList(newData);
	}

	const toggleAddPresetForm = () => {
		if(panel.querySelector("#customFormContainer").classList.contains('hideMe')){
			panel.querySelector("#customFormContainer").classList.remove('hideMe');

			//switch icon to 'x'
			//'x' visually looks bigger than '+' even though both are 10x10, add padding to make it appear smaller while keeping same dimensions
			panel.querySelector("#addCustomButton img").src = "/images/ionic-ios-close.png";
			panel.querySelector("#addCustomButton img").style.padding = "1px"; 
			panel.querySelector("#addCustomButton").setAttribute("title", "Cancel");
		}
		else {
			clearAndHideForm();
		}
	}

	function clearErrorMessages() {
		if (!panel.querySelector("#nullCheckError").classList.contains("hideMe")){
			panel.querySelector("#nullCheckError").classList.add("hideMe");
		};
		if (!panel.querySelector("#uniqueCheckError").classList.contains("hideMe")){
			panel.querySelector("#uniqueCheckError").classList.add("hideMe");
		};
		if (!panel.querySelector("#numCheckError").classList.contains("hideMe")){
			panel.querySelector("#numCheckError").classList.add("hideMe");
		}
	}

	function clearAndHideForm() {
		clearErrorMessages();
		
		panel.querySelector("#nameText").value = "";
		panel.querySelector("#widthText").value = "";
		panel.querySelector("#heightText").value = "";
		panel.querySelector("#customFormContainer").classList.add('hideMe');

		//reset icon to '+'
		panel.querySelector("#addCustomButton img").src = "/images/feather-plus.png";
		panel.querySelector("#addCustomButton img").style.padding = "0px";
		panel.querySelector("#addCustomButton").setAttribute("title", "Add Custom Artboard");
	}


	//--------Main functionality---------//
	const customJsonFile = await dataManager.getCustomDataFile();
	customJsonData = await dataManager.getJsonFromFile(customJsonFile);

	//get UI markup and append list of presets
	const html = await dataManager.getFileContents("ui.html");
	panel = document.createElement("div");
	panel.innerHTML = html;
	panel.querySelector("#presetContainer").innerHTML += createPresetListHTML();

	attachCreateListeners(".presetOption");
	//initialize custom presets for the first time
	setupCustomPresets(true);

	panel.querySelector("#addCustomButton").addEventListener("click", toggleAddPresetForm);

	panel.querySelector("#addPresetButton").addEventListener("click", addNewPreset);

	return panel;
}

function createArtboard(name, w, h){
	console.log("createArtboard()");
	let {Artboard, Color} = require("scenegraph");
	const artboard = new Artboard();
	artboard.name = name;
	artboard.width = w;
	artboard.height = h;
	artboard.fill = new Color("white");
	console.log(`Created artboard -- ${artboard.name}  w: ${artboard.width} h: ${artboard.height}`);
	return artboard;
}

function createPresetListHTML(){
	var html = "";

	//add customs
	html += `<div id="customPresetList">
				<div class="flexContainer">
					<h1 class="sectionTitle" id="customSection"><span><img src="images/awesome-star.png"></img></span> CUSTOM</h1>
					<a id="addCustomButton" title="Add Custom Artboard"><span><img src="images/feather-plus.png" width="10px" height="10px"></img></span></a>
				</div>
				<hr/>
				<div id="customFormContainer" class="hideMe">
					<form id="customPresetForm">
						<div id="nameInput" class="flexContainer">
							<label>Name</label>
							<input type="text" uxp-quiet="true" id="nameText">
						</div>
						<div id="dimensionInput" class="flexContainer">
							<label>W</label>
							<input type="number" uxp-quiet="true" id="widthText">
							<label>H</label>
							<input type="number" uxp-quiet="true" id="heightText">
						</div>
						<footer>
							<div class="flexContainer">
								<span class="error hideMe" id="nullCheckError">Please fill in all fields</span>
								<span class="error hideMe" id="uniqueCheckError">Give your presets unique names</span>
								<span class="error hideMe" id="numCheckError">Please enter positive whole numbers</span>
								<button id="addPresetButton" type="submit" uxp-variant="primary">Add Preset</button>
							</div>
						</footer>
					</form>
					<hr/>
				</div>
			</div>
			<div id="customListContainer" class="section">`;

	html += createCustomListHTML();

	//add presets
	for(const section of presetJsonData){
		html += 
		`<div class="section">
			<h1 class="sectionTitle"><span><img src="${section.icon}"></img></span> ${section.sectionName}</h1>
			<hr/>
			<ul class="optionList">`;
		for(const value of section.values){
			var item = 
				`<li class="presetOption">
						<a class="flexContainer">
						<div class="presetName">${value.name}</div>
						<div class="presetDimensions">
							<span class="w">${value.width}</span> x <span class="h">${value.height}</span>
						</div>
					</a>
				</li>`;
			html += item;
		}
		html += `</ul>
			</div>`
	};
	   
	return html;
}

function createCustomListHTML(){
	var html = "";

	if(customJsonData.values.length === 0){
		html += `<p class="placeholder">No custom artboards saved</p>`;
	} else {
		html +=  `<menu id="customPresetMenu" type="context">
					<menuitem id="deleteButton" label="Delete"></menuitem>
				</menu>
		<ul class="optionList">`;
		for(const value of customJsonData.values){
			var item = 
					`<li class="presetOption">
						<a class="flexContainer">
							<div class="presetName">${value.name}</div>
							<div class="presetDimensions">
								<span class="w">${value.width}</span> x <span class="h">${value.height}</span>
							</div>
						</a>
					</li>`;
			html += item;
		}
		html += `</ul>`;
	};
	html += `</div></div>`;
	return html;
}

async function show(event) {
  // create panel the first time it's shown
  if (!panel) {
	panel = await create();
	event.node.appendChild(panel);
  }
}

function hide(event) {}

function update(selection, root) {
  console.log(selection.items);
}

module.exports = {
  panels: {
	createArtboardPanel: {
	  show,
	  hide,
	  update
	}
  }
}