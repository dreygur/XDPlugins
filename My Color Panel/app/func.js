"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IsUnSupported(selection) {
    var invalid = true;
    if (selection.items.length == 0)
        return invalid;
    var unsupportedTag = ["Group", "SymbolInstance", "BooleanGroup", "RepeatGrid", "LinkedGraphic"];
    selection.items.forEach(element => {
        if (!unsupportedTag.includes(element.constructor.name)) {
            invalid = false;
        }
    });
    return invalid;
}
exports.IsUnSupported = IsUnSupported;
