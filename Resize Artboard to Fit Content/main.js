const Artboard = require("scenegraph").Artboard;
const {validateNum, createDialog, readConfig, writeConfig, createAlert} = require('./modules/helper');

async function resizeToFit(selection) {
	let sel = selection.items;
	const selCount = sel.length;
	if (!selCount) {
		const dialog = createAlert('ALERT_NO_SELECTION_ARTBOARD_TITLE', 'ALERT_NO_SELECTION_ARTBOARD_BODY');
		dialog.showModal();
		return false;
	}
	let config = await readConfig();

	for (let node of sel) {
		if (0 === node.children.length) continue;
		let minX = node.boundsInParent.width;
		let minY = node.boundsInParent.height;
		let maxX = 0;
		let maxY = 0;

		if (node instanceof Artboard) {
			// Get objects bounding in Artboard
			node.children.forEach(function (childNode) {
				let bounds = childNode.boundsInParent;
				if (minX > bounds.x) minX = bounds.x;
				if (maxX < bounds.x + bounds.width) maxX = bounds.x + bounds.width;
				if (minY > bounds.y) minY = bounds.y;
				if (maxY < bounds.y + bounds.height) maxY = bounds.y + bounds.height;
			});

			// Move objects in Artboard
			node.children.forEach(function (childNode) {
				let objX = -minX;
				let objY = -minY;
				if (config.keepCurrent || 0 < config.width) objX = 0;
				if (0 < config.height) objY = 0;
				// console.log(objX + ' / ' + objY + '  |  ' + minX + ' / ' + minY + '  |  ' + maxX + ' / ' + maxY);
				childNode.moveInParentCoordinates(objX, objY);
			});

			// Set Artboard bounding
			let width = maxX - minX;
			let height = maxY - minY;

			if (config.keepCurrent) {
				width = node.boundsInParent.width;
				minX = 0;
				minY = 0;
			}
			else if (0 < config.width) {
				width = config.width;
				minX = 0;
				minY = 0;
			}

			if (!config.keepCurrent && 0 < config.height) {
				height = config.height;
				minX = 0;
				minY = 0;
			}

			// Resize and move Artboard
			node.resize(width, height + config.offsetBottom);
			node.moveInParentCoordinates(minX, minY);
		}
		else {
			const dialog = createAlert('ALERT_NO_ARTBOARD_TITLE', 'ALERT_NO_ARTBOARD_BODY');
			dialog.showModal();
			break;
		}
	}
}

async function resizeToFitPluginSettings() {
	const defaultVal = await readConfig();
	const dialog = createDialog(defaultVal);

	try {
		const result = await dialog.showModal();
		// console.log(result);
		if ('reasonCanceled' !== result) {
			let config = {};
			// Verify return value
			config.width = (validateNum(result.width)) ? Math.abs(result.width - 0) : defaultVal.width;
			config.height = (validateNum(result.height)) ? Math.abs(result.height - 0) : defaultVal.height;
			config.offsetBottom = (validateNum(result.offsetBottom)) ? result.offsetBottom - 0 : defaultVal.offsetBottom;
			config.keepCurrent = result.keepCurrent;
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
		"ResizeToFit": resizeToFit,
		"ResizeToFitSettings": resizeToFitPluginSettings
	}
};
