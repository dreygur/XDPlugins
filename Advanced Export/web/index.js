"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageBox_1 = require("../system/MessageBox");
class WebGenerator {
    GenerateFromArtboard(Artboard) {
        if (Artboard.children && Artboard.children.at(0).name == "[web-layout]") {
            var guid = Artboard.children.at(0);
            var tops = guid.children.map(c => c.globalBounds.y);
            new MessageBox_1.MessageBox().ShowMessage(tops.toString());
        }
    }
}
exports.WebGenerator = WebGenerator;
