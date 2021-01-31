"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MaterialPanel_1 = require("./panelmode/MaterialPanel");
let panel;
async function createMaterialpanel(event) {
    console.log("showing");
    if (!panel) {
        panel = new MaterialPanel_1.MaterialPanelClass();
        await panel.make();
        event.node.appendChild(await panel.DialogBox());
    }
}
function hide() {
    console.log("hide");
}
async function update(selection) {
    panel.HandleSelection(selection);
}
module.exports = {
    panels: {
        MyColorPanel: {
            show: createMaterialpanel,
            hide,
            update
        }
    }
};
