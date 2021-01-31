const dom = function(p){
    return document.querySelector(p);
}
let commands = require("commands");

function createDialog() {
	document.body.innerHTML = layout();
	const obj = {};
    const dialog = dom("dialog");
    const form   = dom("form");
    const cancel = dom("#cancel");
    const copy   = dom("#copy");
    const ok     = dom("#ok");
    const posX   = dom("#posX");
    const posY   = dom("#posY");
    cancel.onclick = function() {
         dialog.close();
    };
    copy.onclick = form.onsubmit = function(e) {
	    const obj = {};
	    obj.x = posX.value;
	    obj.y = posY.value;
	    obj.x = posX.value;
	    obj.copy = true;
		dialog.close(obj);
		e.preventDefault();
    };
    ok.onclick = form.onsubmit = function(e) {
	    const obj = {};
	    obj.x = posX.value;
	    obj.y = posY.value;
	    obj.x = posX.value;
	    obj.copy = false;
		dialog.close(obj);
		e.preventDefault();
    };
    return dialog;
}

function moveItems(arr, x, y){
	for (var i = 0; i < arr.length; i++){
		arr[i].moveInParentCoordinates(Number(x), Number(y));
	}
}

async function menuCommand(selection) {
	if (selection.items.length > 0){
		const window = createDialog();
		const res = await window.showModal();
		if (isNaN(res.x) === false && isNaN(res.x) === false){
			if (res.copy === true){
				commands.duplicate();
			}
			moveItems(selection.items, res.x, res.y);
		}
	}
}

function layout(){
	const str = `
<style>
	form {
		width: 280px;
		
	}
	.container {
		display: flex;
	}	
	input {
		width: 140px;
	}
	footer {
		display: table;
	}
	button {
		width: 30%;
	}
</style>
<dialog>
	<form id="oomoto" method="dialog">
		<h1>Move Items Dialog</h1>
		<div class="container">
			<input id="posX" type="text" placeholder="X" />
			<input id="posY" type="text" placeholder="Y" />
		</div>
		<footer>
			<button id="cancel">Cancel</button>
			<button id="copy" uxp-variant="primary">Copy</button>
			<button id="ok" type="submit" uxp-variant="cta">OK</button>
		</footer>
	</form>
</dialog>
`;
	return str;
}


module.exports = {
    commands: {
        menuCommand
    }
};

