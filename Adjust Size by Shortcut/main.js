const {getNudgeValue, openSettingDialog, createAlert} = require('./modules/helper');

async function shrinkWidth(selection) {
	objectResize(selection.items, 'width', -await getNudgeValue('normal'));
}
async function extendWidth(selection) {
	objectResize(selection.items, 'width', await getNudgeValue('normal'));
}
async function shrinkHeight(selection) {
	objectResize(selection.items, 'height', -await getNudgeValue('normal'));
}
async function extendHeight(selection) {
	objectResize(selection.items, 'height', await getNudgeValue('normal'));
}

async function shrinkGWidth(selection) {
	objectResize(selection.items, 'width', -await getNudgeValue('larger'));
}
async function extendGWidth(selection) {
	objectResize(selection.items, 'width', await getNudgeValue('larger'));
}
async function shrinkGHeight(selection) {
	objectResize(selection.items, 'height', -await getNudgeValue('larger'));
}
async function extendGHeight(selection) {
	objectResize(selection.items, 'height', await getNudgeValue('larger'));
}

// main
function objectResize(sel, side, shift) {
	if (0 === sel.length) {
		const dialog = createAlert('ALERT_TITLE', 'ALERT_MESSAGE');
		dialog.showModal();
		return false;
	}

	switch (side) {
		case 'width':
			sel.forEach(function (obj) {
				let bounds = obj.boundsInParent;
				let width  = bounds.width + shift;
				if (0 > width) width = 1;
				obj.resize(width, bounds.height);
			});
			break;
		case 'height':
			sel.forEach(function (obj) {
				let bounds = obj.boundsInParent;
				let height  = bounds.height + shift;
				if (0 > height) height = 1;
				obj.resize(bounds.width, height);
			});
			break;
	}
}

module.exports = {
	commands: {
		"ShrinkW": shrinkWidth,
		"ExtendW": extendWidth,
		"ShrinkH": shrinkHeight,
		"ExtendH": extendHeight,
		"ShrinkGW": shrinkGWidth,
		"ExtendGW": extendGWidth,
		"ShrinkGH": shrinkGHeight,
		"ExtendGH": extendGHeight,
		"Settings": openSettingDialog
	}
};
