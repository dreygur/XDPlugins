"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XamlChecker {
    ButtonComponent(child) {
        if (!child.children)
            return false;
        return (child.name.trim().toLowerCase() == "button" && child.children.length == 1);
    }
    InputComponent(child) {
        if (!["input", "textbox", "text-box", "input-box", "textarea"].includes(child.name.trim().toLowerCase())) {
            return false;
        }
        if (!child.children)
            return false;
        return true;
    }
    IsGraphicElement(obj) {
        return ["Artboard", "Rectangle", "Ellipse", "Line", "Path", "Text", "Polygon"].includes(obj.constructor.name);
    }
}
exports.XamlChecker = XamlChecker;
