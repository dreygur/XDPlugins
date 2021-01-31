"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LESS_1 = require("../app/LESS");
class XamlProvider {
    getColorEfectForXaml(obj, bg, fg = "") {
        let res = "";
        if (obj.fillEnabled && obj.fill && obj.fill.value)
            res += ` ${bg}="${LESS_1.XAML_HEX(obj.fill)}"`;
        if (fg.length > 0 && obj.stroke && obj.stroke && obj.stroke.value)
            res += ` ${fg}="${LESS_1.XAML_HEX(obj.stroke)}"`;
        return res;
    }
    XamlSingleElement(obj, isforgrid = false) {
        let elname = "Border";
        let addinfo = "";
        if (obj.constructor.name == "Rectangle") {
            let rec = obj;
            elname = "Border";
            addinfo += ` Width="${rec.width}" Height="${rec.height}"`;
            addinfo += this.getColorEfectForXaml(rec, "Background", "BorderBrush");
        }
        if (obj.constructor.name == "Ellipse") {
            let rec = obj;
            elname = "Ellipse";
            addinfo += ` Width="${rec.radiusX * 2}" Height="${rec.radiusY * 2}"`;
            addinfo += this.getColorEfectForXaml(rec, "Fill", "Stroke");
        }
        if (obj.constructor.name == "Path") {
            let rec = obj;
            elname = "Path";
            addinfo += ` Width="${Math.floor(rec.localBounds.width)}" Height="${Math.floor(rec.localBounds.height)}"`;
            addinfo += ` Stretch="uniform" Data="${rec.pathData}"`;
            addinfo += this.getColorEfectForXaml(rec, "Fill", "Stroke");
        }
        if (obj.constructor.name == "Text") {
            let rec = obj;
            elname = "TextBlock";
            addinfo += ` Text="${rec.text}"`;
            addinfo += ` FontFamily="${rec.fontFamily}"  FontSize="${rec.fontSize}"`;
            addinfo += this.getColorEfectForXaml(rec, "Foreground");
        }
        if (isforgrid) {
            let objpoint = obj.topLeftInParent;
            addinfo += ` Margin="${objpoint.x},${objpoint.y},0,0" HorizontalAlignment="Left" VerticalAlignment="Top"`;
        }
        return `<${elname} ${addinfo} />`;
    }
}
exports.XamlProvider = XamlProvider;
