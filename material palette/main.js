"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ShowMaterialPallete } = require("./lib/dialogs.js");
async function MaterialPalleteCall(selection) {
    await ShowMaterialPallete(selection);
}
module.exports = {
    commands: {
        MaterialPalleteCall: MaterialPalleteCall
    }
};
