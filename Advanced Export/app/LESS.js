"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CSS_RGBA(Cl) {
    var obj = Cl.toRgba();
    return `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`;
}
exports.CSS_RGBA = CSS_RGBA;
function XAML_HEX(Cl) {
    var obj = Cl.toRgba();
    return `#${obj.a.toString(16)}${Cl.toHex(true).substring(1)}`;
}
exports.XAML_HEX = XAML_HEX;
