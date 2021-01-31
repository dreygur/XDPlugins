"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageBox_1 = require("../system/MessageBox");
class WebGenerator {
    constructor() {
        this.Warining = [];
    }
    GenerateFromArtboard(Artboard) {
        var GB = Artboard.globalBounds;
        if (Artboard.children && Artboard.children.at(Artboard.children.length - 1).name == "[web-layout]") {
            console.log("web :", "enter circle");
            var guid = Artboard.children.at(Artboard.children.length - 1);
            var tops = [];
            var lefts = [];
            var styles = [];
            guid.children.forEach(c => {
                var y = c.globalBounds.y - GB.y;
                var x = c.globalBounds.x - GB.x;
                if (!tops.includes(y))
                    tops.push(y);
                if (!lefts.includes(x))
                    lefts.push(x);
            });
            let columns = "", rows = "";
            new MessageBox_1.MessageBox().ShowMessage(lefts.toString() + " - " + tops.toString());
            let arrlefts = lefts.sort((a, b) => a - b);
            for (let i = 0; i < arrlefts.length; i++) {
                if (arrlefts[i] == 0)
                    continue;
            }
            var style = `
body{
    display:grid;
    grid-template-colums:${columns} ;
    grid-template-rows:${rows} ;
}`;
            styles.push(style);
        }
    }
}
exports.WebGenerator = WebGenerator;
