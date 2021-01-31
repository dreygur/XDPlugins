const {Rectangle, Color} = require("scenegraph"); 
const {alert} = require("./lib/dialogs.js");
const storageHelper = require('./lib/storage-helper.js');
let panel;

async function defaultFill(selection) {
	const dColor = await storageHelper.get('dColor','#FF0000');
    console.log(dColor)
	if (selection.hasArtwork) {
		for(var i=0;i<selection.items.length;i++){
			selection.items[i].fill = new Color(dColor,1);
			selection.items[i].stroke = undefined;
		}
	}else{
		alert("至少需要选中一个对象")
	}
}
function create() {
    const HTML =
        `<style>
        </style>
        <form method="dialog" id="main">
            <h1>设置默认填充颜色（Hex）：</h1>
            <input type="text" uxp-quiet="true" id="txtColor" value="#0000FF" placeholder="CSS Color" />
            <footer><button id="ok" type="submit" uxp-variant="cta">设置</button></footer>
        </form>
        <div id="ts"></div>
        `
    async function wen(){
        var reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        var txtColor = document.getElementById('txtColor').value;
        if((txtColor.match(reg)==null)){
            alert("请输入正确的颜色值")
        }else{
            const newColor = await storageHelper.set('dColor',txtColor);
            document.getElementById('ts').innerHTML = "默认填充颜色已更改为。" + txtColor ;
        }
    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("form").addEventListener("submit", wen);

    return panel;
}

 async function show(event) {
    if (!panel) event.node.appendChild(create());
    const dColor = await storageHelper.get('dColor','#FF0000');
    document.getElementById('txtColor').value = dColor;
}

function hide(event) {
}

async function update() {
}
async function showAbout() {
    alert("关于 DColor",
        "取消描边，设置填充为默认颜色，快捷键：",
        "* MAC：Cmd+Alt+Shift+D",
        "* WIN：Ctrl+Alt+Shift+D",
        "支持自定义默认填充颜色",
        "----",
        "[XD中文网](https://xd.94xy.com)"
    );
}
module.exports = {
    panels: {
        panel: {
            show,
            hide,
            update
        }
    },
    commands: {
        defaultFill:defaultFill,
        showAbout: showAbout
    }
};
