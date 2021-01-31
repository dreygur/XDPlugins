const fs = require("uxp").storage.localFileSystem;
const configFile = 'config.json';
const dom = sel => document.querySelector(sel);
const {uiLabel} = require('./i18l');
const pluginIcon = '../images/icon.png';

function validateNum(val) {
	if (isNaN(val - 0) || val===0) {
		return false;
	}
	else {
		return true;
	}
}

function createDialog(defaultVal) {
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
    h2 {
        margin-top: 20px;
    }
    label {
        padding-top: 8px;
    }
    .text-numeric {
        width: 70px;
        margin-left: 5px;
    }
    .text-numeric.select {
        width: 100px;
        font-size:16px;
    }
    .formgroup {
        padding: 0 8px 8px;
    }
    .keep-current {
    		display: inline;
    }
    .keep-current__text {
    		font-size: 14px;
    }
    .note {
    		margin-top: 0;
    		margin-left: 0;
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
  .hidden-input{
    display:none !important;
  }
</style>
<dialog id="dialog">
	<form id="form" method="dialog">
		<h1 id="title">${uiLabel.SETTING_TITLE}</h1>
    <h2>${uiLabel.SETTING_LABEL_RESOLUTION}</h2>
		<div class="formgroup row">
			<div class="row">
				<label for="resolution">${uiLabel.SETTING_LABEL_OFFSET_RESOLUTION}</label>
				<input class="text-numeric" id="resolution" type="number" step="1" min="72" max="300" placeholder="0" value="${defaultVal.resolution}" />
        <label for="resolution"><span>PPI/DPI<span></label>
			</div>
    </div>
    <div class="formgroup row">
      <div class="row">
        <label for="unite">${uiLabel.SETTING_LABEL_OFFSET_UNITE}</label>
        <select class="text-numeric select" id="unite">
          <option value="mm" selected="selected">mm</option>
          <option value="in">in</option>
          <option value="points">points</option>
        </select>
      </div>
		</div>

    <h2>${uiLabel.SETTING_LABEL_SIZE_TITLE}</h2>
    <div class="formgroup row">
      <div class="row">
        <label for="size">${uiLabel.SETTING_LABEL_SIZE}</label>
        <select class="text-numeric select" id="size">
          <option value="A3">A3</option>
          <option value="A4" selected="selected">A4</option>
          <option value="A5">A5</option>
          <option value="legal">Legal</option>
          <option value="letter">Letter</option>
          <option value="tabloid">Tabloid</option>
          <option value="custom">custom</option>
        </select>
      </div>
		</div>
    <p class="note">${uiLabel.SETTING_NOTE}</p>

		<div class="formgroup">
				<div class="row">
					<label for="width">${uiLabel.SETTING_LABEL_SIZE_WIDTH}</label>
					<input class="text-numeric" id="width" type="number" step="1" placeholder="0" value="${defaultVal.width}" />
          <label for="width"><span id="unite_span_w">mm</span></label>
				</div>
        </div>
		<div class="formgroup">
				<div class="row">
					<label for="height">${uiLabel.SETTING_LABEL_SIZE_HEIGHT}</label>
					<input class="text-numeric" id="height" type="number" step="1" placeholder="0" value="${defaultVal.height}" />
          <label for="height"><span  id="unite_span_h">mm</span></label>
				</div>

		</div>

    <div class="formgroup" class="hidden-input">
      <div class="row">
        <input class="text-numeric" id="width_px" type="number" value="${defaultVal.width_px}"/>
        <input class="text-numeric" id="height_px" type="number" value="${defaultVal.height_px}" />
      </div>
    </div>

		<footer>
			<button id="cancel">Cancel</button>
			<button id="save" type="submit" uxp-variant="cta">Save</button>
		</footer>
	</form>
	<div class="plugin-icon"></div>
</dialog>
`;
	const dialog = dom('#dialog');
	const form = dom('#form');
	const width = dom('#width');
	const height = dom('#height');
	const resolution = dom('#resolution');
	const unite = dom('#unite');
	const size = dom('#size');
  const width_px = dom('#width_px');
  const height_px = dom('#height_px');
	const cancel = dom('#cancel');
	const save = dom('#save');

 width_px.style.visibility = "hidden";
 height_px.style.visibility = "hidden";

  unite.value = defaultVal.unite;
  size.value = defaultVal.size;

  dom('#unite_span_h').innerHTML = defaultVal.unite;
  dom('#unite_span_w').innerHTML = defaultVal.unite;

  let sizes = {
    'mm':{
      'A3':[297, 420],
      'A4':[210, 297],
      'A5':[148, 210],
      'legal':[216, 356],
      'letter':[216, 279],
      'tabloid':[279, 432],
    },'in':{
      'A3':[11.7, 16.5],
      'A4':[8.3, 11.7],
      'A5':[5.8, 8.3],
      'legal':[8.5, 14],
      'letter':[8.5, 11],
      'tabloid':[11, 17],
    },'points':{
      'A3':[842, 1191],
      'A4':[595, 842],
      'A5':[420, 595],
      'legal':[612, 1009],
      'letter':[612, 791],
      'tabloid':[791, 1225],
    },
  }

  function size_px(){
    let ratio = 1;
    if (unite.value==='mm'){
      ratio = 1/25.4;
    }else if (unite.value==='points') {
      ratio = 1/72;
    }

    let width_val = width.value * resolution.value * ratio;
		let height_val = height.value * resolution.value * ratio;

		if(width_val % 1 > 0.5){
			width_val = Math.ceil(width_val);
		}else{
			width_val = Math.floor(width_val);
		}

		if(height_val % 1 > 0.5){
			height_val = Math.ceil(height_val);
		}else{
			height_val = Math.floor(height_val);
		}

    width_px.value = width_val;
		height_px.value = height_val;

  }

	size.addEventListener('change', e => {
    if ('custom' !== e.target.value) {
	    let d_unite = unite.value;
	    let d_size = e.target.value;
	    let d_width = sizes[d_unite][d_size][0];
	    let d_height = sizes[d_unite][d_size][1];
	    width.value = d_width;
	    height.value = d_height;
	    size_px()
    };
	});

  unite.addEventListener('change', e => {
		let d_size = size.value;
		let d_unite = e.target.value;

		if ('custom' !== d_size) {
			let d_width = sizes[d_unite][d_size][0];
			let d_height = sizes[d_unite][d_size][1];
			width.value = d_width;
			height.value = d_height;
		};

    dom('#unite_span_h').innerHTML = d_unite;
    dom('#unite_span_w').innerHTML = d_unite;
	});

  width.addEventListener('blur', e => {
    size.value = 'custom';
    size_px()
	});

  height.addEventListener('blur', e => {
    size.value = 'custom';
    size_px();
  });

	const cancelDialog = () => dialog.close('reasonCanceled');
	cancel.addEventListener('click', cancelDialog);

	const confirmedDialog = (e) => {
		size_px();

		let config = {};
		config.width = width.value;
		config.height = height.value;
		config.resolution = resolution.value;
		config.unite = unite.value;
    config.size = size.value;
    config.width_px = width_px.value;
    config.height_px = height_px.value;

		dialog.close(config);
		e.preventDefault();
	};

	save.addEventListener('click', confirmedDialog);
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

	return dialog;
}

async function readConfig() {
	let entry = await openFile();

	if (entry) {
		return JSON.parse(await entry.read());
	}
	else {
    let defaultVal = {'resolution': 300, 'unite': 'mm', 'size': 'A4', 'width': 210, 'height': 297, 'width_px': 2480, 'height_px': 3508 };

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
	}
	else {
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

	return false;
}

module.exports = {
	validateNum,
	createDialog,
	readConfig,
	writeConfig,
  createAlert
}
