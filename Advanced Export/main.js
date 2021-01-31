"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func_1 = require("./app/func");
const LESS_1 = require("./app/LESS");
const xaml_generator_1 = require("./xaml/xaml-generator");
const MessageBox_1 = require("./system/MessageBox");
const xaml_provider_1 = require("./xaml/xaml-provider");
const xaml_checker_1 = require("./xaml/xaml-checker");
const WebGenerator_1 = require("./web/WebGenerator");
async function CopyForAndroidValue(selection) {
    let outtext = "";
    let DataCounter = 1;
    if (selection.items.length > 0) {
        outtext += "<!-- COLOR FROM SELECTED ITEMS -->\n";
        var validelements = ["Rectangle", "Ellipse", "Path", "Artboard"];
        selection.items.forEach(element => {
            if (validelements.includes(element.constructor.name)) {
                if (element.fillEnabled) {
                    var Fillcolor = element.fill;
                    if (Fillcolor.value) {
                        let rgbatext = Fillcolor.toHex();
                        outtext += `<color name="color_${func_1.GetName(element.constructor.name + "_" + element.name)}_bg">${rgbatext}</color>\n`;
                        DataCounter++;
                    }
                }
                if (element.strokeEnabled) {
                    var color = element.stroke;
                    if (color.value) {
                        let rgbatext = color.toHex();
                        outtext += `<color name="color_${func_1.GetName(element.constructor.name + "_" + element.name)}_fg">${rgbatext}</color>\n`;
                        DataCounter++;
                    }
                }
            }
            else {
                console.log("invalid name", element.constructor.name);
            }
        });
    }
    outtext += "\n\n<!-- COLOR FROM ASSETS PANEL -->\n";
    var allColors = require("assets").colors.get();
    allColors.forEach((ic) => {
        if (ic.color) {
            let rgbatext = ic.color.toHex();
            outtext += `<color name="color_${func_1.GetName(ic.name ? ic.name : "assets-" + DataCounter)}">${rgbatext}</color>\n`;
            DataCounter++;
        }
    });
    if (DataCounter > 1) {
        let clipboard = require("clipboard");
        clipboard.copyText(outtext);
        new MessageBox_1.MessageBox().ShowMessage("Exported colors for 'Android' is now available on the clipboard.");
    }
    else {
        new MessageBox_1.MessageBox().ShowWarning("Please add your color to the asset panel or select at least one object.");
    }
}
function CopyForCSSValue(selection) {
    let outtext = ":root {";
    let DataCounter = 1;
    if (selection.items.length > 0) {
        outtext += "/* COLOR FROM SELECTED ITEMS */\n";
        var validelements = ["Rectangle", "Ellipse", "Path", "Artboard"];
        selection.items.forEach(element => {
            if (validelements.includes(element.constructor.name)) {
                if (element.fillEnabled) {
                    var color = element.fill;
                    if (color.value) {
                        let rgbatext = LESS_1.CSS_RGBA(color);
                        outtext += `--color_${func_1.GetName(element.constructor.name + "_" + element.name)}_bg: ${rgbatext};\n`;
                        DataCounter++;
                    }
                }
                if (element.strokeEnabled) {
                    var strokecolor = element.stroke;
                    if (strokecolor && strokecolor.value) {
                        let rgbatext = LESS_1.CSS_RGBA(strokecolor);
                        outtext += `--color_${func_1.GetName(element.constructor.name + "_" + element.name)}_border: ${rgbatext};\n`;
                        DataCounter++;
                    }
                }
            }
            else {
                console.log("invalid name", element.constructor.name);
            }
        });
    }
    outtext += "\n\n/* COLOR FROM ASSETS PANEL */\n";
    var allColors = require("assets").colors.get();
    allColors.forEach((ic) => {
        if (ic.color) {
            let rgbatext = LESS_1.CSS_RGBA(ic.color);
            outtext += `--color_${func_1.GetName(ic.name ? ic.name : "assets-" + DataCounter)}: ${rgbatext};\n`;
            DataCounter++;
        }
    });
    outtext += "\n}";
    if (DataCounter > 1) {
        let clipboard = require("clipboard");
        clipboard.copyText(outtext);
        new MessageBox_1.MessageBox().ShowMessage("Exported colors for 'CSS' is now available on the clipboard.");
    }
    else {
        new MessageBox_1.MessageBox().ShowWarning("Please add your color to the asset panel or select at least one object.");
    }
}
function CopyForLESSValue(selection) {
    let outtext = "";
    let DataCounter = 1;
    if (selection.items.length > 0) {
        outtext += "// COLOR FROM SELECTED ITEMS \n";
        var validelements = ["Rectangle", "Ellipse", "Path", "Artboard"];
        selection.items.forEach(element => {
            if (validelements.includes(element.constructor.name)) {
                if (element.fillEnabled) {
                    var color = element.fill;
                    if (color.value) {
                        let rgbatext = LESS_1.CSS_RGBA(color);
                        outtext += `@color_${func_1.GetName(element.constructor.name + "_" + element.name)}_bg: ${rgbatext};\n`;
                        DataCounter++;
                    }
                }
                if (element.strokeEnabled) {
                    var color = element.stroke;
                    if (color.value) {
                        let rgbatext = LESS_1.CSS_RGBA(color);
                        outtext += `@color_${func_1.GetName(element.constructor.name + "_" + element.name)}_border: ${rgbatext};\n`;
                        DataCounter++;
                    }
                }
            }
            else {
                console.log("invalid name", element.constructor.name);
            }
        });
    }
    outtext += "\n\n// COLOR FROM ASSETS PANEL \n";
    var allColors = require("assets").colors.get();
    allColors.forEach((ic) => {
        if (ic.color) {
            let rgbatext = LESS_1.CSS_RGBA(ic.color);
            outtext += `@color_${func_1.GetName(ic.name ? ic.name : "assets-" + DataCounter)}: ${rgbatext};\n`;
            DataCounter++;
        }
    });
    if (DataCounter > 1) {
        let clipboard = require("clipboard");
        clipboard.copyText(outtext);
        new MessageBox_1.MessageBox().ShowMessage("Exported colors for 'LESS' is now available on the clipboard.");
    }
    else {
        new MessageBox_1.MessageBox().ShowWarning("Please add your color to the asset panel or select at least one object.");
    }
}
function CopyForSCSSValue(selection) {
    let outtext = "";
    let DataCounter = 1;
    if (selection.items.length > 0) {
        outtext += "// COLOR FROM SELECTED ITEMS \n";
        var validelements = ["Rectangle", "Ellipse", "Path", "Artboard"];
        selection.items.forEach(element => {
            if (validelements.includes(element.constructor.name)) {
                if (element.fillEnabled) {
                    var color = element.fill;
                    if (color.value) {
                        let rgbatext = LESS_1.CSS_RGBA(color);
                        outtext += `$color_${func_1.GetName(element.constructor.name + "_" + element.name)}_bg: ${rgbatext};\n`;
                        DataCounter++;
                    }
                }
                if (element.strokeEnabled) {
                    var color = element.stroke;
                    if (color.value) {
                        let rgbatext = LESS_1.CSS_RGBA(color);
                        outtext += `$color_${func_1.GetName(element.constructor.name + "_" + element.name)}_border: ${rgbatext};\n`;
                        DataCounter++;
                    }
                }
            }
            else {
                console.log("invalid name", element.constructor.name);
            }
        });
    }
    outtext += "\n\n// COLOR FROM ASSETS PANEL \n";
    var allColors = require("assets").colors.get();
    allColors.forEach((ic) => {
        if (ic.color) {
            let rgbatext = LESS_1.CSS_RGBA(ic.color);
            outtext += `$color_${func_1.GetName(ic.name ? ic.name : "assets-" + DataCounter)}: ${rgbatext};\n`;
            DataCounter++;
        }
    });
    if (DataCounter > 1) {
        let clipboard = require("clipboard");
        clipboard.copyText(outtext);
        new MessageBox_1.MessageBox().ShowMessage("Exported colors for 'SCSS' is now available on the clipboard.");
    }
    else {
        new MessageBox_1.MessageBox().ShowWarning("Please add your color to the asset panel or select at least one object.");
    }
}
function noAction(selection) {
}
function CopyForXamlObject(selection) {
    console.log(selection.items.length, `name:[${selection.items[0].constructor.name}]`);
    if (selection.items.length == 1) {
        var obj = selection.items[0];
        if (new xaml_checker_1.XamlChecker().IsGraphicElement(obj)) {
            let outtext = new xaml_provider_1.XamlProvider().GraphicElement(obj);
            let clipboard = require("clipboard");
            clipboard.copyText(outtext);
            return;
        }
        if (obj.constructor.name == "Group") {
            let gp = obj;
            let canvaspoint = gp.topLeftInParent;
            let canvasBound = gp.boundsInParent;
            if (["input", "textbox", "text-box", "input-box", "textarea"].includes(obj.name.toLowerCase())) {
                if (gp.children && gp.children.length == 2) {
                    let outtext = `<TextBox VerticalContentAlignment="Center"`;
                    if (gp.children.at(0).constructor.name == "Rectangle") {
                        let border = gp.children.at(0);
                        outtext += ` Width="${border.width}" Height="${border.height}"`;
                        outtext += new xaml_provider_1.XamlProvider().GetTheme(border, "Background", "BorderBrush");
                    }
                    if (gp.children.at(1).constructor.name == "Text") {
                        let txt = gp.children.at(1);
                        let objpoint = txt.topLeftInParent;
                        outtext += ` Padding="${objpoint.x - canvaspoint.x},0"`;
                        outtext += new xaml_provider_1.XamlProvider().GetTheme(txt, "Foreground");
                        outtext += ` Text="${txt.text}"`;
                        outtext += ` FontFamily="${txt.fontFamily}"  FontSize="${txt.fontSize}"`;
                    }
                    outtext += "/>";
                    let clipboard = require("clipboard");
                    clipboard.copyText(outtext);
                    return;
                }
            }
            if (gp.name.toLowerCase().trim() == "button") {
                if (gp.children && gp.children.length == 1) {
                    let outtext = "<Button >";
                    if (gp.children.at(0).constructor.name == "Group") {
                        outtext += new xaml_generator_1.XamlGenerator().GetXamlAsCanvas(gp.children.at(0));
                    }
                    if (new xaml_checker_1.XamlChecker().IsGraphicElement(gp.children.at(0))) {
                        outtext += new xaml_provider_1.XamlProvider().GraphicElement(gp.children.at(0));
                    }
                    outtext += "</Button>";
                    let clipboard = require("clipboard");
                    clipboard.copyText(outtext);
                    return;
                }
            }
            let outtext = new xaml_generator_1.XamlGenerator().GetXamlAsCanvas(gp);
            let clipboard = require("clipboard");
            clipboard.copyText(outtext);
            return;
        }
    }
}
function getColorEfectForStyle(obj, bg, fg = "") {
    let res = "";
    if (obj.fillEnabled && obj.fill && obj.fill.value)
        res += `\n    ${bg}:${LESS_1.CSS_RGBA(obj.fill)};`;
    if (fg.length > 0 && obj.stroke && obj.stroke && obj.stroke.value)
        res += `\n    ${fg}:${LESS_1.CSS_RGBA(obj.stroke)};`;
    return res;
}
function StyleSingleElement(obj) {
    let elname = "Nothing";
    let addinfo = "";
    if (obj.constructor.name == "Rectangle") {
        let rec = obj;
        elname = "div";
        addinfo += `\n    width:${rec.width}px;\n    Height=${rec.height}px;`;
        addinfo += getColorEfectForStyle(rec, "background-color", "border-color");
    }
    if (obj.constructor.name == "Text") {
        let rec = obj;
        elname = "p";
        addinfo += `\n    font-family:${rec.fontFamily};\n    font-size:${rec.fontSize}px;`;
        addinfo += getColorEfectForStyle(rec, "color");
    }
    return `${elname}{ ${addinfo}\n}`;
}
function CopyForStyle(selection) {
    console.log(selection.items.length, `name:[${selection.items[0].constructor.name}]`);
    if (selection.items.length == 1) {
        var obj = selection.items[0];
        if (new xaml_checker_1.XamlChecker().IsGraphicElement(obj)) {
            let outtext = StyleSingleElement(obj);
            let clipboard = require("clipboard");
            clipboard.copyText(outtext);
            return;
        }
        if (obj.constructor.name == "Group") {
            let gp = obj;
            let canvaspoint = gp.topLeftInParent;
            let canvasBound = gp.boundsInParent;
            if (["input", "textbox", "text-box", "input-box", "textarea"].includes(obj.name.toLowerCase())) {
                if (gp.children && gp.children.length == 2) {
                    let outtext = `<TextBox VerticalContentAlignment="Center"`;
                    if (gp.children.at(0).constructor.name == "Rectangle") {
                        let border = gp.children.at(0);
                        outtext += ` Width="${border.width}" Height="${border.height}"`;
                        outtext += new xaml_provider_1.XamlProvider().GetTheme(border, "Background", "BorderBrush");
                    }
                    if (gp.children.at(1).constructor.name == "Text") {
                        let txt = gp.children.at(1);
                        let objpoint = txt.topLeftInParent;
                        outtext += ` Padding="${objpoint.x - canvaspoint.x},0"`;
                        outtext += new xaml_provider_1.XamlProvider().GetTheme(txt, "Foreground");
                        outtext += ` Text="${txt.text}"`;
                        outtext += ` FontFamily="${txt.fontFamily}"  FontSize="${txt.fontSize}"`;
                    }
                    outtext += "/>";
                    let clipboard = require("clipboard");
                    clipboard.copyText(outtext);
                    return;
                }
            }
            if (gp.name.toLowerCase().trim() == "button") {
                if (gp.children && gp.children.length == 1) {
                    let outtext = "<Button>";
                    if (gp.children.at(0).constructor.name == "Group") {
                        outtext += new xaml_generator_1.XamlGenerator().GetXamlAsCanvas(gp.children.at(0));
                    }
                    if (new xaml_checker_1.XamlChecker().IsGraphicElement(gp.children.at(0))) {
                        outtext += new xaml_provider_1.XamlProvider().GraphicElement(gp.children.at(0));
                    }
                    outtext += "</Button>";
                    let clipboard = require("clipboard");
                    clipboard.copyText(outtext);
                    return;
                }
            }
            let outtext = new xaml_generator_1.XamlGenerator().GetXamlAsCanvas(gp);
            let clipboard = require("clipboard");
            clipboard.copyText(outtext);
            return;
        }
    }
}
function XamlExportArtboard(selection) {
    if (selection.items.length != 1 || selection.items[0].constructor.name != "Artboard") {
        new MessageBox_1.MessageBox().ShowWarning("Please Select One Artboard to Export" + selection.items[0].constructor.name);
        console.log("'" + selection.items[0].pathData + "'");
        return;
    }
    var XG = new xaml_generator_1.XamlGenerator();
    var c = XG.GenerateFromArtboard(selection.items[0]);
    let clipboard = require("clipboard");
    clipboard.copyText(c);
    new MessageBox_1.MessageBox().ShowMessage(`<div><span style="color:#1e88e5;">Xaml - Artbord Mockup Codes is now available on the clipboard. </span>`
        + "<span>You Can Paste Your Code To Your Xaml Editor</span>"
        + (XG.Warining.length > 0 ? `<div> <span >Warning: Export For ${XG.Warining.toString()} is not Available in this Version </span></div>` : ""));
}
function InfoArtboardNames(selection, documentRoot) {
    var ArtList = [];
    if (documentRoot.children)
        documentRoot.children.forEach(item => {
            if (item.constructor.name == "Artboard") {
                ArtList.push(item.name);
            }
        });
    let clipboard = require("clipboard");
    clipboard.copyText(ArtList.join("\n"));
    new MessageBox_1.MessageBox().ShowMessage(`<div><span style="color:#1e88e5;">[Info - Name of Artboards] is now available on the clipboard. </span>`
        + "<span>You Can Paste it into Your Text Editor</span>");
}
function WebExportArtboard(selection, documentRoot) {
    console.log("start :", "");
    if (selection.items.length != 1 || selection.items[0].constructor.name != "Artboard") {
        new MessageBox_1.MessageBox().ShowWarning("Please Select One Artboard to Export " + selection.items[0].constructor.name);
        console.log(selection.items[0]);
        return;
    }
    console.log("check :", "");
    var WG = new WebGenerator_1.WebGenerator();
    var c = WG.GenerateFromArtboard(selection.items[0]);
}
module.exports = {
    commands: {
        CopyForAndroidValue: CopyForAndroidValue,
        CopyForCSSValue: CopyForCSSValue,
        CopyForLESSValue: CopyForLESSValue,
        CopyForSCSSValue: CopyForSCSSValue,
        CopyForStyle: CopyForStyle,
        CopyForXamlObject: CopyForXamlObject,
        XamlExportArtboard: XamlExportArtboard,
        WebExportArtboard: WebExportArtboard,
        InfoArtboardNames: InfoArtboardNames,
        noAction: noAction
    }
};
