"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func_1 = require("../app/func");
const manifest_1 = require("../app/manifest");
const MaterialSource_1 = require("../panelmode/MaterialSource");
const { Color } = require("scenegraph");
let clipboard = require("clipboard");
async function createDialog(selection) {
    var container;
    let ne = (n = "div") => document.createElement(n);
    let setup = (n, r) => n.className = r;
    let mdplCC = "";
    function overflow(mainkey, key) {
        let mdplTN = `MD-${mainkey}-${key}`;
        mdplCC = MaterialSource_1.MaterialSource[mainkey][key];
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
            clipboard.copyText(MaterialSource_1.MaterialSource[mainkey][key]);
            mdplAC.textContent = "Copied.";
            setTimeout(() => { mdplAC.textContent = "Copy"; }, 500);
        };
        if (func_1.IsUnSupported(selection)) {
            mdplAF.style.visibility = "hidden";
            mlplAS.style.visibility = "hidden";
        }
        mdplAF.onclick = _ => {
            console.log("click :", "launched");
            var validelements = ["Rectangle", "Ellipse", "Path", "Artboard", "Text", "Polygon"];
            selection.items.forEach(element => {
                if (validelements.includes(element.constructor.name)) {
                    console.log("try to fill :", element.constructor.name, MaterialSource_1.MaterialSource[mainkey][key]);
                    element.fill = new Color(MaterialSource_1.MaterialSource[mainkey][key]);
                }
            });
            dialog.close('ok');
        };
        mlplAS.onclick = _ => {
            var validelements = ["Rectangle", "Ellipse", "Path", "Text", "Line", "Polygon"];
            selection.items.forEach(element => {
                if (validelements.includes(element.constructor.name)) {
                    element.stroke = new Color(MaterialSource_1.MaterialSource[mainkey][key]);
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
    let title = 'Material Palette';
    if (!manifest_1.manifest)
        manifest_1.fixManifest();
    let usingPluginIcon = false;
    if (manifest_1.manifest && manifest_1.manifest.icons) {
        usingPluginIcon = true;
        iconSize = 24;
        icon = manifest_1.getNearestIcon(manifest_1.manifest, iconSize);
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
.is-selected{border:1px dashed black;box-sizing:border-box}.light .is-selected{border:1px dashed white}.material-pallete-box{display:flex;width:480px;height:430px;padding:5px}.material-pallete-box .material-pallete-color-preview{display:flex;align-items:flex-end}.material-pallete-box .material-pallete-content{width:200px;overflow:hidden;margin-left:2px;padding:20px}.material-pallete-box .material-pallete-content .material-pallete-btn-preview{margin-top:10px}.material-pallete-box .front-preview{width:70px;height:70px;border-radius:15px}.material-pallete-box .stroke-preview{width:20px;height:20px;border:2px solid #455A64;border-radius:5px;margin-bottom:5px;margin-left:10px}.material-pallete-box .text-name{margin-top:5px;margin-bottom:5px}.material-pallete-box .value-preview input{padding:10px;width:100px;font-size:20px}.material-pallete-box .material-pallete-value-preview{margin:0}.material-pallete-box .btnA{padding:10px;border-radius:20px;margin-top:10px;text-align:center;width:110px;user-select:none}.material-pallete-box .btnA:hover{cursor:pointer;opacity:.9}.material-pallete-box .btnA.normal{border:1px solid black;background:#039be5}.material-pallete-box .btnAtext{margin-top:10px;user-select:none;cursor:pointer;transition:.33s;color:#039be5}.material-pallete-box{transition:.5s;background-color:#455A64}.material-pallete-box .front-preview{background-color:#B0BEC5}.material-pallete-box .stroke-preview{border:2px solid #B0BEC5}.material-pallete-box .text-name{text-shadow:1px 1px 5px rgba(255,255,255,0.5)}.material-pallete-box .btnA.fill{color:#000000;background-color:#B0BEC5}.material-pallete-box .btnA.stroke{color:#ffffff;border:1px solid #B0BEC5}.material-pallete-box .btnAtext:hover{color:white}.light.material-pallete-box{background-color:#B0BEC5}.light.material-pallete-box .front-preview{background-color:#455A64}.light.material-pallete-box .stroke-preview{border:2px solid #455A64}.light.material-pallete-box .text-name{text-shadow:1px 1px 5px rgba(0,0,0,0.5)}.light.material-pallete-box .btnA.fill{color:#ffffff;background:#455A64}.light.material-pallete-box .btnA.stroke{color:#000000;border:1px solid #455A64}.light.material-pallete-box .btnA.normal{color:white}.container{overflow-x:hidden;overflow-y:auto;height:400px}.material-pallete-pallete{padding:5px;min-width:304px}.color-box-row,.mtpl-d0{display:flex;font-size:10px;align-items:center}.mtpl-d1{width:70px;text-align:center}.color-item{width:20px;height:20px;display:flex;align-items:center;justify-content:center}
    </style>
<form method="dialog">
    <h1 class="h1">
        <span>${title}</span>
        ${icon ? `<img class="plugin-icon" title="Matrial palette" src="${icon}" />` : ''}
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
            Object.keys(MaterialSource_1.MaterialSource)
                .forEach(keymain => {
                var onc = document.createElement("div");
                container.appendChild(onc);
                onc.className = "mtpl-d0";
                var colorBox = document.createElement("div");
                onc.appendChild(colorBox);
                colorBox.className = "color-box-row";
                Object.keys(MaterialSource_1.MaterialSource[keymain])
                    .forEach(key => {
                    var col2 = document.createElement("div");
                    col2.style.backgroundColor = MaterialSource_1.MaterialSource[keymain][key];
                    col2.className = "color-item";
                    if (MaterialSource_1.MaterialSource[keymain][key] == mdplCC)
                        col2.classList.add("is-selected");
                    colorBox.appendChild(col2);
                    col2.onclick = _ => {
                        let pvs = document.querySelector(".is-selected");
                        if (pvs)
                            pvs.classList.remove("is-selected");
                        col2.classList.add("is-selected");
                        console.log("cls", col2.className, col2.outerHTML);
                        overflow(keymain, key);
                    };
                });
            });
            let closerequest = document.querySelector("#mdpl-close-request");
            closerequest.onclick = _ => {
                dialog.close('reasonCanceled');
            };
        }, 100);
        var notfound = true;
        if (selection.items.length == 1 && selection.items[0].fillEnabled && selection.items[0].fill.value) {
            var fillcolor = selection.items[0].fill.toHex();
            Object.keys(MaterialSource_1.MaterialSource)
                .forEach(keymain => {
                Object.keys(MaterialSource_1.MaterialSource[keymain])
                    .forEach(key => {
                    if (fillcolor == MaterialSource_1.MaterialSource[keymain][key]) {
                        console.log(fillcolor, MaterialSource_1.MaterialSource[keymain][key], fillcolor == MaterialSource_1.MaterialSource[keymain][key]);
                        overflow(keymain, key);
                        notfound = false;
                    }
                });
            });
        }
        if (notfound)
            overflow("bluegrey", "200");
        const response = await dialog.showModal();
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
