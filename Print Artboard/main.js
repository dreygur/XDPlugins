const {Artboard, Color} = require("scenegraph");
const {validateNum, createDialog, readConfig, writeConfig, createAlert} = require('./modules/helper');
const viewport = require("viewport");



function getNewArtboardPosition(documentRoot, config){
  let result = {x:0, y:0};
	// let break_n = 5;
	let break_n = Math.floor(20000/config.width_px);
	const kArtboardMargin = config.resolution;
	let artboard_n = documentRoot.children.length;
	let row_n = Math.floor(artboard_n / break_n);
	let collum_n = artboard_n - (row_n * break_n);

  documentRoot.children.forEach(function(child,i){
		if(i == 0){
			result.x = child.globalBounds.x;
			result.y = child.globalBounds.y;
		}else{
			let __y;
			let __x;

			if (collum_n===0){
				 __y = child.globalBounds.y + child.height + kArtboardMargin;
					if(result.y < __y){
						result.y = __y;
					}
			}else if (row_n>0) {
				result.y = 0;
				result.x = 0;
				__y = (child.globalBounds.y + child.height + kArtboardMargin) * row_n;
				 if(result.y < __y){
					 result.y = __y;
				 }
				 __x = (child.globalBounds.x + child.width + kArtboardMargin) * collum_n;
				if(result.x < __x){
					result.x = __x;
				}
			}else{
				 __x = child.globalBounds.x + child.width + kArtboardMargin;
				if(result.x < __x){
					result.x = __x;
				}
			}
		}
  });

  return result;
}


async function makePrintArtboard(selection, documentRoot) {
	let sel = selection.items;
	const selCount = sel.length;

	let config = await readConfig();
	if (!selCount) {
		let artboards = documentRoot.children;
		let artboard_n = documentRoot.children.length;


		const artboard = new Artboard();
		artboard.width = config.width_px;
		artboard.height = config.height_px;
		artboard.name = `${config.size}-${Math.abs(artboard_n + 1)}`;
		artboard.fill = new Color('#FFFFFF');
		documentRoot.addChild(artboard);

		let x = artboard_n * (config.resolution + config.width_px);
		let y = 0;

		let break_n = Math.floor(20000/config.width_px);

		if (artboard_n >= break_n){
			let row_n = Math.floor(artboard_n / break_n);
			let collum_n = artboard_n - (row_n * break_n);
			y = row_n * (config.resolution + config.height_px);
			x = collum_n * (config.resolution + config.width_px);
		};

		let position = getNewArtboardPosition(documentRoot, config);
		artboard.placeInParentCoordinates({x:0, y:0}, {x:position.x, y:position.y});
		viewport.scrollIntoView(artboard);
	}
	for (let node of sel) {
		if (node instanceof Artboard) {
			node.resize(config.width_px, config.height_px);
			// node.moveInParentCoordinates(0, 0)
		}
		else {
			const dialog = createAlert('ALERT_NO_ARTBOARD_TITLE', 'ALERT_NO_ARTBOARD_BODY');
			dialog.showModal();
			break;
		}
	}
}

async function printArtboardSettings(selection, documentRoot) {
	const defaultVal = await readConfig();
	const dialog = createDialog(defaultVal);
	try {
		const result = await dialog.showModal();
		// console.log(result);
		if ('reasonCanceled' !== result) {
			let config = {};
			// Verify return value
			config.resolution = (validateNum(result.resolution)) ? result.resolution - 0 : defaultVal.resolution;
			config.unite = result.unite;
			config.size = result.size;
			config.width = (validateNum(result.width)) ? Math.abs(result.width - 0) : defaultVal.width;
			config.height = (validateNum(result.height)) ? Math.abs(result.height - 0) : defaultVal.height;
			config.width_px = (validateNum(result.width_px)) ? Math.abs(result.width_px - 0) : defaultVal.width_px;
			config.height_px = (validateNum(result.height_px)) ? Math.abs(result.height_px - 0) : defaultVal.height_px;

			await writeConfig(config);
		}
		else {
			// console.log('Canceled');
		}
	}
	catch (e) {
		console.log(e);
	}
}

module.exports = {
	commands: {
		"makePrintArtboard": makePrintArtboard,
		"printArtboardSettings": printArtboardSettings
	}
};
