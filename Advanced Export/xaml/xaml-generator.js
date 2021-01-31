"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xaml_provider_1 = require("./xaml-provider");
const xaml_checker_1 = require("./xaml-checker");
const parentsystem_1 = require("./public/parentsystem");
class XamlGenerator {
    constructor() {
        this.Warining = [];
        this.XAP = new xaml_provider_1.XamlProvider();
        this.XAC = new xaml_checker_1.XamlChecker();
    }
    GenerateFromArtboard(artboard) {
        let content = "";
        if (artboard.children) {
            artboard.children.forEach(child => {
                content += this.GetElement(child, parentsystem_1.ParentSystem.G);
            });
        }
        let addinfo = this.XAP.GetSize(artboard);
        addinfo += this.XAP.GetTheme(artboard, "Background");
        var totaltext = `<Grid Uid="${artboard.name}" ${addinfo} ClipToBounds="True" >${content}</Grid>`;
        return totaltext;
    }
    GetElement(child, parentmode = parentsystem_1.ParentSystem.C) {
        if (new xaml_checker_1.XamlChecker().IsGraphicElement(child))
            return this.XAP.GraphicElement(child, parentmode);
        let addinfo = this.XAP.GetSize(child);
        addinfo += this.XAP.GetAttr(child, parentmode);
        if (child.constructor.name == "RepeatGrid") {
            let content = "";
            if (child.children) {
                child.children.forEach(child => {
                    content += this.GetElement(child, parentsystem_1.ParentSystem.G);
                });
            }
            return `<Grid  Uid="${child.name}" ${addinfo} ClipToBounds="True">${content}</Grid>`;
        }
        if (child.constructor.name == "BooleanGroup") {
            if (!this.Warining.includes("Combined shapes(Boolean Operations)"))
                this.Warining.push("Combined shapes(Boolean Operations)");
        }
        if (child.constructor.name == "Group" && child.mask) {
            if (!this.Warining.includes("Mask Layer"))
                this.Warining.push("Mask Layer");
        }
        if (child.constructor.name == "Group" && this.XAC.InputComponent(child)) {
            return this.XAP.InputElement(child, parentmode);
        }
        if (child.constructor.name == "Group" && this.XAC.ButtonComponent(child)) {
            let content = "";
            if (child.children)
                content += this.GetElement(child.children.at(0));
            return `<Button ${addinfo}>${content}</Button>`;
        }
        let content = "";
        if (child.children) {
            child.children.forEach(child => {
                content += this.GetElement(child);
            });
        }
        return `<Canvas ${addinfo}>${content}</Canvas>`;
    }
    GetXamlAsCanvas(rec) {
        let canvaspoint = rec.topLeftInParent;
        let canvasBound = rec.boundsInParent;
        let outtext = `<Canvas Width="${canvasBound.width}" Height="${canvasBound.height}" >`;
        rec.children.forEach(function (childNode, i) {
            if (new xaml_checker_1.XamlChecker().IsGraphicElement(childNode)) {
                let objpoint = childNode.topLeftInParent;
                let itemx = new xaml_provider_1.XamlProvider().GraphicElement(childNode);
                itemx = itemx.substring(0, itemx.lastIndexOf(" "));
                itemx += ` Canvas.Left="${objpoint.x - canvaspoint.x}" Canvas.Top="${objpoint.y - canvaspoint.y}" />`;
                outtext += `\n    ${itemx}`;
            }
        });
        outtext += "\n</Canvas>";
        return outtext;
    }
}
exports.XamlGenerator = XamlGenerator;
