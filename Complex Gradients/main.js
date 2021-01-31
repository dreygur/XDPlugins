'use strict';

const { Color, LinearGradient, Rectangle, Ellipse, Artboard, Group } = require('scenegraph');
const { alert: showAlert, error: showError } = require('./lib/dialogs.js');
const { randomColor } = require('./lib/randomColor.js');
const fs = require('uxp').storage.localFileSystem;

async function getHtmlLayout(filename) {
	const folder = await fs.getPluginFolder();
	const entries = await folder.getEntries();
	const file = entries.find(entry => entry.name == filename);

	if (!file) {
		throw new Error(
			`Layout file "${filename}" not found. ` + 
			'Please reinstall the plugin.'
		);
	}

	return await file.read();
}

async function showDialog(filename) {
	let dialog = document.createElement('dialog');

	// Get layout from a file and insert it to dialog
	dialog.innerHTML = await getHtmlLayout(filename);

	const form = dialog.querySelector('form');
	const reset = form.querySelector('button[type="reset"]');

	form.onsubmit = (e) => {
		e.preventDefault();

		let settings = {};

		// Find all fileds
		const fields = e.target.querySelectorAll('input, select');

		// Collect settings to object
		Array.from(fields).forEach(field => {
			// Precaution to avoid intersection of ids
			let key = field.id.replace('cg_', '');

			if (field.type == 'checkbox') {
				settings[key] = field.checked;

			} else {
				settings[key] = field.value;
			}
		});

		// Close dialog and return settings
		dialog.close(settings);
	}

	reset.onclick = (e) => {
		e.preventDefault();
		dialog.close('reasonCanceled');
	}

	// Update counter when input[type="range"] have been changed
	form.addEventListener('input', (e) => {
		if (e.target.type === 'range') {
			let counter = e.target.parentNode.querySelector('.counter');
			counter.textContent = e.target.value;
		}
	});

	try {
		document.appendChild(dialog);
		return await dialog.showModal();

	} finally {
		dialog.remove();	
	}
}

async function invert(selection) {
	// Get only correct items
	const passedItems = selection.items.filter(item => {
		const group = item instanceof Group;
		const gradient = item.fill instanceof LinearGradient;

		return !group && item.fillEnabled && gradient;
	});

	if (passedItems.length < 1) {
		throw new Error(
			'Need at least 1 element with enabled ' + 
			'linear gradient fill to be selected.'
		);
	}

	return new Promise(resolve => {
		passedItems.forEach(item => {

			// Copy current gradient
			const gradient = item.fill.clone();
			const colorStops = gradient.colorStops;

			// Reverse positions
			colorStops.forEach(item => {
				item.stop = 1 - item.stop;
			});

			// Sorting by position
			colorStops.reverse();

			// Apply new gradient to item
			gradient.colorStops = colorStops;
			item.fill = gradient;

		});

		resolve();
	});
}

async function random(selection) {
	// Get only correct items
	const passedItems = selection.items.filter(item => {
		const group     = item instanceof Group;
		const rectangle = item instanceof Rectangle;
		const ellipse   = item instanceof Ellipse;
		const artboard  = item instanceof Artboard;

		return !group && (rectangle || ellipse || artboard);
	});

	if (passedItems.length < 1) {
		throw new Error(
			'Need at least 1 valid element to be selected. ' + 
			'Elements can be Rectangle, Ellipse or Artboard.'
		);
	}

	// Show dialog with settings
	const dialogData = await showDialog('random.html');

	// Do nothing if dialog canceled
	if (dialogData === 'reasonCanceled') return;

	return new Promise(resolve => {
		passedItems.forEach(item => {

			const colorStops = [];
			const gradient = new LinearGradient();

			// Set output color format and reverse alpha
			dialogData.format = 'rgba';
			dialogData.alpha = 1 - dialogData.alpha;

			const randomColors = randomColor(dialogData);

			randomColors.forEach((color, idx) => {
				colorStops.push({
					color: new Color(color),
					stop: Math.floor(idx / (dialogData.count - 1) * 100) / 100
				});
			});

			// Setting gradient coordinates
			gradient.setEndPoints(0.5, 0, 0.5, 1);

			// Apply new gradient to item
			gradient.colorStops = colorStops;
			item.fill = gradient;
			item.fillEnabled = true;

		});

		resolve();
	});
}

async function simplify(selection) {
	// Get only correct items
	const passedItems = selection.items.filter(item => {
		const group = item instanceof Group;
		const gradient = item.fill instanceof LinearGradient;

		return !group && item.fillEnabled && gradient;
	});

	if (passedItems.length < 1) {
		throw new Error(
			'Need at least 1 element with enabled ' + 
			'linear gradient fill to be selected.'
		);
	}

	return new Promise(resolve => {
		passedItems.forEach(item => {
			
			// Copy current gradient
			const gradient   = item.fill.clone();
			const colorStops = gradient.colorStops;

			const numStops = colorStops.length;
			const newStops = [];

			// Build new gradient color stops
			colorStops.forEach((item, idx, obj) => {
				// Break on last color stop
				if (idx == numStops - 1) return;

				// Find correct position for stop pair
				let stop = (idx + 1) / numStops;

				// Round stop value
				stop = Math.floor(stop * 100) / 100;

				// Collect stop pair
				newStops.push(
					{ color: item.color, stop: stop },
					{ color: obj[idx + 1].color, stop: stop }
				);
			});

			// Add start and end stops
			newStops.unshift(colorStops[0]);
			newStops.push(colorStops[numStops - 1]);

			// Apply new gradient to item
			gradient.colorStops = newStops;
			item.fill = gradient;
		});

		resolve();
	});
}

async function repeating(selection) {
	// Get only correct items
	const passedItems = selection.items.filter(item => {
		const group = item instanceof Group;
		const gradient = item.fill instanceof LinearGradient;

		return !group && item.fillEnabled && gradient;
	});

	if (passedItems.length < 1) {
		throw new Error(
			'Need at least 1 element with enabled ' + 
			'linear gradient fill to be selected.'
		);
	}

	// Show dialog with settings
	const dialogData = await showDialog('repeating.html');

	// Do nothing if dialog canceled
	if (dialogData === 'reasonCanceled') return;

	return new Promise(resolve => {
		passedItems.forEach(item => {

			// Copy current gradient
			const gradient   = item.fill.clone();
			const colorStops = gradient.colorStops;
			const newStops   = [];

			// Loop for desired number of times
			for (let idx = 0; idx < dialogData.count; idx++) {
				colorStops.forEach(item => {

					// Find correct position
					const stop = (item.stop + idx) / dialogData.count;

					// Add object with new properties
					newStops.push({
						color: { value: item.color.value },
						stop: Math.floor(stop * 100) / 100
					});

				});
			}

			// Apply new gradient to item
			gradient.colorStops = newStops;
			item.fill = gradient;
		});

		resolve();
	});
}

async function fromFill(selection) {
	// Get only correct items
	const passedItems = selection.items.filter(item => {
		const group = item instanceof Group;
		const color = item.fill instanceof Color;

		return !group && item.fillEnabled && color;
	});

	if (passedItems.length < 2) {
		throw new Error(
			'Need at least 2 elements with enabled ' + 
			'solid color fill to be selected.'
		);
	}

	return new Promise(resolve => {

		let colorStops = [];

		// Collect all colors and build color stops
		passedItems.forEach((item, idx) => {
			colorStops.push({
				color: item.fill.clone(),
				stop: Math.floor(idx / (passedItems.length - 1) * 100) / 100
			});
		});

		// Build new gradient
		const gradient = new LinearGradient();
		gradient.colorStops = colorStops;

		// Setting gradient coordinates
		gradient.setEndPoints(0.5, 0, 0.5, 1);

		const parent = selection.insertionParent;
		const node = new Rectangle();

		node.width = 100;
		node.height = 200;
		
		// Apply new gradient
		node.fill = gradient;

		// Get position to insert node at center
		const posX = (parent.width - node.width) / 2;
		const posY = (parent.height - node.height) / 2;
	
		// Insert the node
		parent.addChild(node);
		node.moveInParentCoordinates(posX, posY);

		resolve();
	});
}

async function invoke(method, selection) {
	let noErrors;

	// Get groups (if any)
	const groups = selection.items.filter(item => {
		return item instanceof Group;
	});

	try {
		// Show error if only groups are selected
		if (selection.items.length) {
			if (selection.items.length == groups.length) {
				throw new Error(
					'Groups are not supported. ' + 
					'Please ungroup or select elements one by one ' + 
					'with pressed Shift key before using this option.'
				);
			}
		}

		// Call method
		await method(selection);
		noErrors = true;

		// Show warning if in addition to leaves groups were selected
		if (groups.length) {
			showAlert(
				'Almost succeed',
				'Valid items processed, but some groups was omitted.' + 
				'\n\n' + 
				'Please ungroup or select elements one by one ' + 
				'with pressed Shift key before using this option.' + 
				'\n\n' + 
				`<b>Number of omitted groups:</b> ${groups.length}`
			);
		}

	} catch (err) {
		await showError('Something went wrong', err.message);
	}

	return new Promise((resolve, reject) => {
		noErrors ? resolve() : reject();
	});
}

module.exports = {
	commands: {
		repeating: async selection => await invoke(repeating, selection),
		simplify:  async selection => await invoke(simplify, selection),
		random:    async selection => await invoke(random, selection),
		fromFill:  async selection => await invoke(fromFill, selection),
		invert:    async selection => await invoke(invert, selection),
		about:     async selection => await showDialog('about.html')
	}
};