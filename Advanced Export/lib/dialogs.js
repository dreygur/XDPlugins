"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func_1 = require("../app/func");
const { getManifest, getNearestIcon } = require('./manifest.js');
const { Color } = require("scenegraph");
let manifest;
async function createDialog(selection) {
    var container;
    let ne = (n = "div") => document.createElement(n);
    let setup = (n, r) => n.className = r;
    let materialcolors = {
        "red": { "50": "#ffebee", "100": "#ffcdd2", "200": "#ef9a9a", "300": "#e57373", "400": "#ef5350", "500": "#f44336", "600": "#e53935", "700": "#d32f2f", "800": "#c62828", "900": "#b71c1c", "a100": "#ff8a80", "a200": "#ff5252", "a400": "#ff1744", "a700": "#d50000" },
        "pink": { "50": "#fce4ec", "100": "#f8bbd0", "200": "#f48fb1", "300": "#f06292", "400": "#ec407a", "500": "#e91e63", "600": "#d81b60", "700": "#c2185b", "800": "#ad1457", "900": "#880e4f", "a100": "#ff80ab", "a200": "#ff4081", "a400": "#f50057", "a700": "#c51162" },
        "purple": { "50": "#f3e5f5", "100": "#e1bee7", "200": "#ce93d8", "300": "#ba68c8", "400": "#ab47bc", "500": "#9c27b0", "600": "#8e24aa", "700": "#7b1fa2", "800": "#6a1b9a", "900": "#4a148c", "a100": "#ea80fc", "a200": "#e040fb", "a400": "#d500f9", "a700": "#aa00ff" },
        "deeppurple": { "50": "#ede7f6", "100": "#d1c4e9", "200": "#b39ddb", "300": "#9575cd", "400": "#7e57c2", "500": "#673ab7", "600": "#5e35b1", "700": "#512da8", "800": "#4527a0", "900": "#311b92", "a100": "#b388ff", "a200": "#7c4dff", "a400": "#651fff", "a700": "#6200ea" },
        "indigo": { "50": "#e8eaf6", "100": "#c5cae9", "200": "#9fa8da", "300": "#7986cb", "400": "#5c6bc0", "500": "#3f51b5", "600": "#3949ab", "700": "#303f9f", "800": "#283593", "900": "#1a237e", "a100": "#8c9eff", "a200": "#536dfe", "a400": "#3d5afe", "a700": "#304ffe" },
        "blue": { "50": "#e3f2fd", "100": "#bbdefb", "200": "#90caf9", "300": "#64b5f6", "400": "#42a5f5", "500": "#2196f3", "600": "#1e88e5", "700": "#1976d2", "800": "#1565c0", "900": "#0d47a1", "a100": "#82b1ff", "a200": "#448aff", "a400": "#2979ff", "a700": "#2962ff" },
        "lightblue": { "50": "#e1f5fe", "100": "#b3e5fc", "200": "#81d4fa", "300": "#4fc3f7", "400": "#29b6f6", "500": "#03a9f4", "600": "#039be5", "700": "#0288d1", "800": "#0277bd", "900": "#01579b", "a100": "#80d8ff", "a200": "#40c4ff", "a400": "#00b0ff", "a700": "#0091ea" },
        "cyan": { "50": "#e0f7fa", "100": "#b2ebf2", "200": "#80deea", "300": "#4dd0e1", "400": "#26c6da", "500": "#00bcd4", "600": "#00acc1", "700": "#0097a7", "800": "#00838f", "900": "#006064", "a100": "#84ffff", "a200": "#18ffff", "a400": "#00e5ff", "a700": "#00b8d4" },
        "teal": { "50": "#e0f2f1", "100": "#b2dfdb", "200": "#80cbc4", "300": "#4db6ac", "400": "#26a69a", "500": "#009688", "600": "#00897b", "700": "#00796b", "800": "#00695c", "900": "#004d40", "a100": "#a7ffeb", "a200": "#64ffda", "a400": "#1de9b6", "a700": "#00bfa5" },
        "green": { "50": "#e8f5e9", "100": "#c8e6c9", "200": "#a5d6a7", "300": "#81c784", "400": "#66bb6a", "500": "#4caf50", "600": "#43a047", "700": "#388e3c", "800": "#2e7d32", "900": "#1b5e20", "a100": "#b9f6ca", "a200": "#69f0ae", "a400": "#00e676", "a700": "#00c853" },
        "lightgreen": { "50": "#f1f8e9", "100": "#dcedc8", "200": "#c5e1a5", "300": "#aed581", "400": "#9ccc65", "500": "#8bc34a", "600": "#7cb342", "700": "#689f38", "800": "#558b2f", "900": "#33691e", "a100": "#ccff90", "a200": "#b2ff59", "a400": "#76ff03", "a700": "#64dd17" },
        "lime": { "50": "#f9fbe7", "100": "#f0f4c3", "200": "#e6ee9c", "300": "#dce775", "400": "#d4e157", "500": "#cddc39", "600": "#c0ca33", "700": "#afb42b", "800": "#9e9d24", "900": "#827717", "a100": "#f4ff81", "a200": "#eeff41", "a400": "#c6ff00", "a700": "#aeea00" },
        "yellow": { "50": "#fffde7", "100": "#fff9c4", "200": "#fff59d", "300": "#fff176", "400": "#ffee58", "500": "#ffeb3b", "600": "#fdd835", "700": "#fbc02d", "800": "#f9a825", "900": "#f57f17", "a100": "#ffff8d", "a200": "#ffff00", "a400": "#ffea00", "a700": "#ffd600" },
        "amber": { "50": "#fff8e1", "100": "#ffecb3", "200": "#ffe082", "300": "#ffd54f", "400": "#ffca28", "500": "#ffc107", "600": "#ffb300", "700": "#ffa000", "800": "#ff8f00", "900": "#ff6f00", "a100": "#ffe57f", "a200": "#ffd740", "a400": "#ffc400", "a700": "#ffab00" },
        "orange": { "50": "#fff3e0", "100": "#ffe0b2", "200": "#ffcc80", "300": "#ffb74d", "400": "#ffa726", "500": "#ff9800", "600": "#fb8c00", "700": "#f57c00", "800": "#ef6c00", "900": "#e65100", "a100": "#ffd180", "a200": "#ffab40", "a400": "#ff9100", "a700": "#ff6d00" },
        "deeporange": { "50": "#fbe9e7", "100": "#ffccbc", "200": "#ffab91", "300": "#ff8a65", "400": "#ff7043", "500": "#ff5722", "600": "#f4511e", "700": "#e64a19", "800": "#d84315", "900": "#bf360c", "a100": "#ff9e80", "a200": "#ff6e40", "a400": "#ff3d00", "a700": "#dd2c00" },
        "brown": { "50": "#efebe9", "100": "#d7ccc8", "200": "#bcaaa4", "300": "#a1887f", "400": "#8d6e63", "500": "#795548", "600": "#6d4c41", "700": "#5d4037", "800": "#4e342e", "900": "#3e2723" },
        "grey": { "50": "#fafafa", "100": "#f5f5f5", "200": "#eeeeee", "300": "#e0e0e0", "400": "#bdbdbd", "500": "#9e9e9e", "600": "#757575", "700": "#616161", "800": "#424242", "900": "#212121" },
        "bluegrey": { "50": "#eceff1", "100": "#cfd8dc", "200": "#b0bec5", "300": "#90a4ae", "400": "#78909c", "500": "#607d8b", "600": "#546e7a", "700": "#455a64", "800": "#37474f", "900": "#263238" }
    };
    function overflow(mainkey, key) {
        let mdplTN = `MD-${mainkey}-${key}`;
        let mdplCC = materialcolors[mainkey][key];
        let mdplBX = document.querySelector("#mdpl-bx");
        let mdplFP = document.querySelector("#mdpl-fp");
        let mdplSP = document.querySelector("#mdpl-sp");
        let mdplTT = document.querySelector("#mdpl-tt");
        let mdplIT = document.querySelector("#mdpl-it");
        let mdplAC = document.querySelector("#mdpl-ac");
        let mdplAF = document.querySelector("#mdpl-af");
        let mlplAS = document.querySelector("#mdpl-as");
        mdplFP.style.backgroundColor = mdplCC;
        mdplSP.style.borderColor = mdplCC;
        mdplTT.textContent = mdplTN.substring(3);
        mdplIT.value = mdplCC;
        mdplTT.style.color = mdplCC;
        let drakula = ["600", "700", "800", "900"];
        if (drakula.includes(key)) {
            mdplBX.classList.add("light");
        }
        else {
            mdplBX.classList.remove("light");
        }
        mdplAC.onclick = _ => {
            let clipboard = require("clipboard");
            clipboard.copyText(materialcolors[mainkey][key]);
            mdplAC.textContent = "Copied.";
            setTimeout(() => { mdplAC.textContent = "Copy"; }, 500);
        };
        if (func_1.IsUnSupported(selection)) {
            mdplAF.style.visibility = "hidden";
            mlplAS.style.visibility = "hidden";
        }
        mdplAF.onclick = _ => {
            var validelements = ["Rectangle", "Ellipse", "Path", "Artboard", "Text"];
            selection.items.forEach(element => {
                if (validelements.includes(element.constructor.name)) {
                    element.fill = new Color(materialcolors[mainkey][key]);
                }
            });
            dialog.close('ok');
        };
        mlplAS.onclick = _ => {
            var validelements = ["Rectangle", "Ellipse", "Path", "Text", "Line"];
            selection.items.forEach(element => {
                if (validelements.includes(element.constructor.name)) {
                    element.stroke = new Color(materialcolors[mainkey][key]);
                }
                else {
                }
            });
            dialog.close('ok');
        };
    }
    let iconSize = 18;
    let icon = 'plugin-icon';
    let width = 500;
    let height = 'auto';
    let title = 'Material Palette';
    try {
        if (!manifest) {
            manifest = await getManifest();
        }
    }
    catch (err) {
    }
    let usingPluginIcon = false;
    if (icon === 'plugin-icon') {
        if (manifest.icons) {
            usingPluginIcon = true;
            iconSize = 24;
            icon = getNearestIcon(manifest, iconSize);
        }
    }
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
<style>
    form {
        width: ${width}px;
    }
    .h1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .h1 img {
        width: ${iconSize}px;
        height: ${iconSize}px;
        flex: 0 0 ${iconSize}px;
        padding: 0;
        margin: 0;
    }
    img.plugin-icon {
        border-radius: 4px;
        overflow: hidden;
    }
.material-pallete-box{display:flex;width:480px;height:430px;padding:5px}.material-pallete-box .material-pallete-color-preview{display:flex;align-items:flex-end}.material-pallete-box .material-pallete-content{width:200px;overflow:hidden;margin-left:2px;padding:20px}.material-pallete-box .material-pallete-content .material-pallete-btn-preview{margin-top:10px}.material-pallete-box .front-preview{width:70px;height:70px;border-radius:15px}.material-pallete-box .stroke-preview{width:20px;height:20px;border:2px solid #455A64;border-radius:5px;margin-bottom:5px;margin-left:10px}.material-pallete-box .text-name{margin-top:5px;margin-bottom:5px}.material-pallete-box .value-preview input{padding:10px;width:100px;font-size:20px}.material-pallete-box .material-pallete-value-preview{margin:0}.material-pallete-box .btnA{padding:10px;border-radius:20px;margin-top:10px;text-align:center;width:110px;user-select:none}.material-pallete-box .btnA:hover{cursor:pointer;opacity:.9}.material-pallete-box .btnA.normal{border:1px solid black;background:#039be5}.material-pallete-box .btnAtext{margin-top:10px;user-select:none;cursor:pointer;transition:.33s;color:#039be5}.material-pallete-box{transition:.5s;background-color:#455A64}.material-pallete-box .front-preview{background-color:#B0BEC5}.material-pallete-box .stroke-preview{border:2px solid #B0BEC5}.material-pallete-box .text-name{text-shadow:1px 1px 5px rgba(255,255,255,0.5)}.material-pallete-box .btnA.fill{color:#000000;background-color:#B0BEC5}.material-pallete-box .btnA.stroke{color:#ffffff;border:1px solid #B0BEC5}.material-pallete-box .btnAtext:hover{color:white}.light.material-pallete-box{background-color:#B0BEC5}.light.material-pallete-box .front-preview{background-color:#455A64}.light.material-pallete-box .stroke-preview{border:2px solid #455A64}.light.material-pallete-box .text-name{text-shadow:1px 1px 5px rgba(0,0,0,0.5)}.light.material-pallete-box .btnA.fill{color:#ffffff;background:#455A64}.light.material-pallete-box .btnA.stroke{color:#000000;border:1px solid #455A64}.light.material-pallete-box .btnA.normal{color:white}.container{overflow-x:hidden;overflow-y:auto;height:400px}.material-pallete-pallete{padding:5px;min-width:304px}.color-box-row,.mtpl-d0{display:flex;font-size:10px;align-items:center}.mtpl-d1{width:70px;text-align:center}.color-item{width:20px;height:20px;display:flex;align-items:center;justify-content:center}
    </style>
<form method="dialog">
    <h1 class="h1">
        <span>${title}</span>
        ${icon ? `<img ${usingPluginIcon ? `class="plugin-icon" title="${manifest.name}"` : ''} src="${icon}" />` : ''}
</h1><hr /><div id="material-pallete-container" class="container"><div id="mdpl-bx" class="material-pallete-box dark"><div class="material-pallete-pallete"></div><div class="material-pallete-content"><div class="material-pallete-preview"><div class="material-pallete-color-preview"><div id="mdpl-fp" class="front-preview"></div><div id="mdpl-sp" class="stroke-preview"></div></div><div id="mdpl-tt" class="text-name">select color </div><div class="value-preview"> <input readonly="readonly" lass="material-pallete-value-preview"  id="mdpl-it" type="text" value="no color"> </div></div><div class="material-pallete-btn-preview"><div id="mdpl-af" class="btnA fill">Set as Fill</div><div id="mdpl-as" class="btnA stroke">Set as Border</div><!--div class="btnAtext ">Add to Assets</div--><div id="mdpl-ac" class="btnAtext ">Copy</div><div id="mdpl-close-request" class="btnA normal">Close</div></div></div></div></div><footer></footer><div><a style="margin:10px;color:silver" href="https://github.com/savedata-space/xd-material-palette">need help ?</a></div></form>`;
    let okButtonIdx = -1;
    let cancelButtonIdx = -1;
    let clickedButtonIdx = -1;
    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');
    try {
        document.appendChild(dialog);
        setTimeout(() => {
            container = document.querySelector(".material-pallete-pallete");
            Object.keys(materialcolors)
                .forEach(keymain => {
                var onc = document.createElement("div");
                container.appendChild(onc);
                onc.className = "mtpl-d0";
                var colorBox = document.createElement("div");
                onc.appendChild(colorBox);
                colorBox.className = "color-box-row";
                Object.keys(materialcolors[keymain])
                    .forEach(key => {
                    var col2 = document.createElement("div");
                    col2.style.backgroundColor = materialcolors[keymain][key];
                    col2.className = "color-item";
                    colorBox.appendChild(col2);
                    col2.onclick = _ => {
                        overflow(keymain, key);
                    };
                });
            });
            let closerequest = document.querySelector("#mdpl-close-request");
            closerequest.onclick = _ => {
                dialog.close('reasonCanceled');
            };
        }, 100);
        overflow("bluegrey", "200");
        const response = await dialog.showModal();
        if (response === 'reasonCanceled') {
            return { which: cancelButtonIdx, value: '' };
        }
        else {
            if (clickedButtonIdx === -1) {
                clickedButtonIdx = okButtonIdx;
            }
            return { which: clickedButtonIdx, value: prompt ? dialog.querySelector('#prompt').value : '' };
        }
    }
    catch (err) {
        return { which: cancelButtonIdx, value: '' };
    }
    finally {
        dialog.remove();
    }
}
async function ShowMaterialPallete(selection) {
    return createDialog(selection);
}
module.exports = {
    createDialog,
    ShowMaterialPallete,
};
