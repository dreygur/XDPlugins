"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LESS_1 = require("../app/LESS");
const parentsystem_1 = require("./public/parentsystem");
class XamlProvider {
    GetAttr(child, parentmode) {
        let thisBound = child.globalBounds;
        let ParentBound = child.parent.globalBounds;
        switch (parentmode) {
            case parentsystem_1.ParentSystem.G:
                return ` Margin="${thisBound.x - ParentBound.x},${thisBound.y - ParentBound.y},0,0" HorizontalAlignment="Left" VerticalAlignment="Top"`;
            case parentsystem_1.ParentSystem.C:
                return ` Canvas.Left="${thisBound.x - ParentBound.x}" Canvas.Top="${thisBound.y - ParentBound.y}" `;
        }
        return "";
    }
    GetSize(artboard) {
        if (artboard.localBounds)
            return ` Width="${Math.floor(artboard.localBounds.width)}" Height="${Math.floor(artboard.localBounds.height)}"`;
    }
    GetTheme(obj, bg, fg = "") {
        let res = "";
        if (obj.fillEnabled && obj.fill && obj.fill.value)
            res += ` ${bg}="${LESS_1.XAML_HEX(obj.fill)}"`;
        if (fg.length > 0 && obj.stroke && obj.stroke && obj.stroke.value)
            res += ` ${fg}="${LESS_1.XAML_HEX(obj.stroke)}"`;
        return res;
    }
    GraphicElement(obj, parentmode = parentsystem_1.ParentSystem.C) {
        let elname = "Border";
        let addinfo = "";
        if (obj.constructor.name == "Rectangle") {
            let rec = obj;
            elname = "Border";
            addinfo += ` Width="${rec.width}" Height="${rec.height}"`;
            addinfo += this.GetTheme(rec, "Background", "BorderBrush");
        }
        if (obj.constructor.name == "Ellipse") {
            let rec = obj;
            elname = "Ellipse";
            addinfo += ` Width="${rec.radiusX * 2}" Height="${rec.radiusY * 2}"`;
            addinfo += this.GetTheme(rec, "Fill", "Stroke");
        }
        if (obj.constructor.name == "Polygon") {
            if (obj.pathData.indexOf("C") >= 0) {
                let rec = obj;
                elname = "Path";
                addinfo += ` Width="${Math.floor(rec.localBounds.width)}" Height="${Math.floor(rec.localBounds.height)}"`;
                addinfo += ` Stretch="uniform" Data="${rec.pathData}"`;
                addinfo += this.GetTheme(rec, "Fill", "Stroke");
            }
            else {
                let rec = obj;
                elname = "Polygon";
                addinfo += ` Width="${Math.floor(rec.localBounds.width)}" Height="${Math.floor(rec.localBounds.height)}"`;
                addinfo += ` Stretch="uniform"`;
                if (rec.points)
                    addinfo += ` Points="${rec.points.map(r => `${r.x},${r.y} `)}"`;
                else {
                    var str = rec.pathData.replace("M ", "").replace(" Z", "");
                    let points = str.split("L");
                    let data = [];
                    points.forEach(p => {
                        data.push(p.trim().split(" ").join(","));
                    });
                    addinfo += ` Points="${data.join(" ")}"`;
                }
                addinfo += this.GetTheme(rec, "Fill", "Stroke");
            }
        }
        if (obj.constructor.name == "Path") {
            let rec = obj;
            elname = "Path";
            addinfo += ` Width="${Math.floor(rec.localBounds.width)}" Height="${Math.floor(rec.localBounds.height)}"`;
            addinfo += ` Stretch="uniform" Data="${rec.pathData}"`;
            addinfo += this.GetTheme(rec, "Fill", "Stroke");
        }
        if (obj.constructor.name == "Line") {
            let rec = obj;
            elname = "Line";
            if (rec.start)
                addinfo += ` X1="${Math.floor(rec.start.x)}" Y1="${Math.floor(rec.start.y)}"`;
            if (rec.end)
                addinfo += ` X2="${Math.floor(rec.end.x)}" Y2="${Math.floor(rec.end.y)}"`;
            addinfo += this.GetTheme(rec, "Fill", "Stroke");
        }
        if (obj.constructor.name == "Text") {
            let rec = obj;
            elname = "TextBlock";
            addinfo += ` Text="${rec.text}"`;
            addinfo += ` TextAlignment="${rec.textAlign}"`;
            addinfo += ` FontFamily="${rec.fontFamily}"  FontSize="${rec.fontSize}"`;
            if (rec.areaBox)
                addinfo += ` Width="${rec.areaBox.width}" Height="${rec.areaBox.height}" TextWrapping="Wrap"`;
            addinfo += this.GetTheme(rec, "Foreground");
        }
        addinfo += this.GetAttr(obj, parentmode);
        return `<${elname} ${addinfo} />`;
    }
    InputElement(gp, parentmode) {
        console.log("i :", 1);
        if (!gp.children)
            return "";
        console.log("i :", 2);
        let attr = "";
        attr += this.GetAttr(gp, parentmode);
        class inputstructue {
        }
        var inp = new inputstructue();
        gp.children.forEach(element => {
            if (element.constructor.name == "Rectangle") {
                inp.bg = element;
                return;
            }
            if (element.constructor.name == "Text") {
                inp.text = element;
                return;
            }
        });
        if (inp.bg) {
            attr += this.GetSize(inp.bg);
            attr += this.GetTheme(inp.bg, "Background", "BorderBrush");
        }
        if (inp.text) {
            attr += this.GetTheme(inp.text, "Foreground");
            attr += ` Text="${inp.text.text}" FontFamily="${inp.text.fontFamily}"  FontSize="${inp.text.fontSize}"`;
        }
        if (inp.bg && inp.text) {
            let thisBound = inp.text.globalBounds;
            let ParentBound = inp.bg.globalBounds;
            if (thisBound.x > ParentBound.x)
                attr += ` Padding="${thisBound.x - ParentBound.x},0"`;
        }
        return `<TextBox VerticalContentAlignment="Center" ${attr} />`;
    }
}
exports.XamlProvider = XamlProvider;
