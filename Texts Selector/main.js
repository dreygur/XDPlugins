const {Rectangle, Color, Text, Artboard} = require("scenegraph");
const {alert} = require("./lib/dialogs.js");
const { appLanguage } = require("application");
const strings = require("./strings.json");

let selections = [];

async function selectTextsFunction(selection) {
    selections = [];
    for (let i = 0; i < selection.items.length; i++) {
        let node = selection.items[i];
        digIntoGroup(node);
    }
    selection.items = null;
    selection.items = selections;

    if (selections.length > 0) {
        alert(strings[appLanguage].yay_title, selections.length + strings[appLanguage].yay_body);
    } else {
        alert(strings[appLanguage].whoops_title, [strings[appLanguage].whoops_body]);
    }
}

function digIntoGroup(node) {
    if (node.constructor.name === "Group") {
        node.children.forEach(function (childNode) {
            digIntoGroup(childNode);
        });
    }
    if (node.constructor.name === "Text" && node) {
        selections.push(node);
    }
}

module.exports = {
    commands: {
        selectTexts: selectTextsFunction
    }
};