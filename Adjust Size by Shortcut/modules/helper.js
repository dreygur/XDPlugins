const fs = require("uxp").storage.localFileSystem;
const configFile = 'config.json';
const dom = sel => document.querySelector(sel);
const {uiLabel} = require('./i18l');
const pluginIcon = '../images/adjust-size-by-shortcut-icon.png';

const getNudgeValue = async (size) => {
	let nudgeValues = await readConfig();

	switch (size) {
		case 'normal':
			return nudgeValues.normal;
		case 'larger':
			return nudgeValues.larger;
		default:
			return nudgeValues.normal;
	}
}

function createSettingDialog(defaultVal) {
	console.log(defaultVal);
	document.body.innerHTML = `
<style>
    dialog {
        display: flex;
        flex-direction: row-reverse;
    }
    #title {
        margin-bottom: 16px;
        padding-bottom: 7px;
        border-bottom: 1px solid #ccc;
        font-size: 16px;
    }
    label {
        padding-top: 8px;
    }
    input {
        width: 70px;
    }
    .formgroup {
        padding: 0 8px 8px;
    }
    .note {
        font-size: 12px;
    }
    .plugin-icon {
        width: 48px;
        height: 48px;
        margin-right: 16px;
        border-radius: 4px;
        background-image: url(${pluginIcon});
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>
<dialog id="dialog">
	<form id="form" method="dialog">
		<h1 id="title">${uiLabel.SETTING_TITLE}</h1>
		<div class="formgroup row">
			<div class="row">
				<label for="normalNudge">${uiLabel.SETTING_LABEL_NORMAL}</label>
				<input id="normalNudge" type="number" step="0.1" placeholder="0" value="${defaultVal.normal}" />
			</div>
			<div class="row">
				<label for="largerNudge">${uiLabel.SETTING_LABEL_LARGER}</label>
				<input id="largerNudge" type="number" step="1" placeholder="0" value="${defaultVal.larger}" />
			</div>
		</div>
		<footer>
			<button id="cancel">Cancel</button>
			<button id="ok" type="submit" uxp-variant="cta">OK</button>
		</footer>
	</form>
	<div class="plugin-icon"></div>
</dialog>
`;
	const dialog = dom('#dialog');
	const form = dom('#form');
	const normalNudge = dom('#normalNudge');
	const largerNudge = dom('#largerNudge');
	const cancel = dom('#cancel');
	const ok = dom('#ok');

	// Cancel button event
	const cancelDialog = () => dialog.close('reasonCanceled');
	cancel.addEventListener('click', cancelDialog);
	cancel.addEventListener('keypress', cancelDialog);

	// OK button event
	const confirmedDialog = (e) => {
		let config = {};
		config.normalNudge = normalNudge.value;
		config.largerNudge = largerNudge.value;
		dialog.close(config);
		e.preventDefault();
	};
	ok.addEventListener('click', confirmedDialog);
	ok.addEventListener('keypress', confirmedDialog);

	form.onsubmit = confirmedDialog;

	return dialog;
}

function createAlert(title, msg) {
	document.body.innerHTML = `
<style>
    dialog {
        display: flex;
        flex-direction: row-reverse;
    }
    #title {
        padding-bottom: 7px;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
    }
    .plugin-icon {
        width: 48px;
        height: 48px;
        margin-right: 16px;
        border-radius: 4px;
        background-image: url(${pluginIcon});
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>
<dialog id="dialog">
	<form id="form" method="dialog">
		<h1 id="title">${uiLabel[title]}</h1>
		<p>${uiLabel[msg]}</p>
		<footer>
			<button id="ok" type="submit" uxp-variant="cta">OK</button>
		</footer>
	</form>
	<div class="plugin-icon"></div>
</dialog>
`;
	const dialog = dom('#dialog');
	const ok = dom('#ok');
	const cancelDialog = () => dialog.close();
	ok.addEventListener('click', cancelDialog);
	ok.addEventListener('keypress', cancelDialog);

	return dialog;
}

async function openSettingDialog() {
	const storedValue = await readConfig();
	const dialog = createSettingDialog(storedValue);

	try {
		const result = await dialog.showModal();
		if ('reasonCanceled' !== result) {
			let config = {};
			config.normal = (validateNum(result.normalNudge)) ? Math.abs(result.normalNudge - 0) : defaultVal.normalNudge;
			config.larger = (validateNum(result.largerNudge)) ? Math.abs(result.largerNudge - 0) : defaultVal.largerNudge;
			await writeConfig(config);
		} else {
			console.log('Adjust size setting canceled.')
		}
	} catch(e) {
		console.log(e);
	}
}

async function readConfig() {
	let entry = await openFile();

	if (entry) {
		let nudgeValues = JSON.parse(await entry.read());
		if (!nudgeValues.hasOwnProperty('larger')) {
			nudgeValues.larger = nudgeValues.greatly;
			delete nudgeValues.greatly;
			await writeConfig(nudgeValues);
		}
		return nudgeValues;
	} else {
		// Set and return default values if config.json is not found
		let defaultVal = {"normal": 1, "larger": 10};
		const pluginDataFolder = await fs.getDataFolder();
		const buffer = await pluginDataFolder.createFile(configFile);
		buffer.write(JSON.stringify(defaultVal));

		return defaultVal;
	}
}

async function writeConfig(val) {
	let entry = await openFile();

	if (entry) {
		await entry.write(JSON.stringify(val));

		return true;
	} else {
		// Create file and write value if config.json is not found
		const pluginDataFolder = await fs.getDataFolder();
		const buffer = await pluginDataFolder.createFile(configFile);
		buffer.write(JSON.stringify(val));

		return true;
	}
}

async function openFile() {
	const pluginDataFolder = await fs.getDataFolder();
	const entries = await pluginDataFolder.getEntries();

	for (const entry of entries) {
		if (configFile === entry.name) {
			return entry;
		}
	}
}

function validateNum(val) {
	if (isNaN(val - 0)) {
		return false;
	} else {
		return true;
	}
}

module.exports = {
	getNudgeValue,
	openSettingDialog,
	createAlert
}