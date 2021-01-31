// Add this to the top of your main.js file
const { Artboard, Rectangle, Ellipse, Text, Color } = require("scenegraph");
const { alert, error } = require('./lib/dialogs.js');

var shouldShowDialog = true;

function createStyledTextHandlerFunction(selection, documentRoot) {
    shouldShowDialog = true;
    recursiveStyling(documentRoot);

    if (shouldShowDialog) {
        showError();
    }
}

function recursiveStyling(node) {
    node.children.forEach(children => {
        if (children instanceof Text) {
            changeStyle(children);
        }
        recursiveStyling(children);
    });
}

async function showError() {
  await error("Styling failed",
      "HTML Style Applicator did not find any text inside HTML tags.");
}

const commands = ["<b>", "<i>", "<u>"];

function changeStyle(text) {
    var data = [];
    var structure = prepareStructure(text.text, data, true);

    if (data.length == 0) {
        return;
    }

    text.text = structure.map(item => item.text).join("");

    text.styleRanges = structure.map(item => ({
        length: item.text.length,
        fontStyle: getFontStyleFromItem(item),
        underline: item.underline
    }));
}

function getFontStyleFromItem(item) {
    var style = ""

    if (item.bold) {
        style += "Bold";
    }
    if (item.italic) {
        if (style.length != 0) {
           style += " ";
        }
        style += "Italic";
    }
    if (item.length == 0) {
        style += "Regular ";
    }

    return style;
}

function prepareStructure(text, structure, start) {
    if (text.length == 0) {
        return structure;
    }

    var startLess = text.indexOf("<")
    var command = text.substring(startLess, startLess + 3)

    if (start && !commands.includes(command)) {
        return structure
    }

    shouldShowDialog = false;

    if (commands.includes(command)) {
        var beforeText = text.substring(0, startLess);
        structure.push( { text: beforeText, bold: false, italic: false, underline: false } );
    } else {
        structure.push( { text: text, bold: false, italic: false, underline: false } );
        return structure;
    }

    var newStart = -1;
    switch (command) {
        case "<b>":
            var endLess = text.indexOf("</b>")
            var sub = text.substring(startLess + 3, endLess);
            var obj = { text: sub, bold: true, italic: false, underline: false }
            newStart = endLess + 4;
            processInnerTags(obj);
            structure.push(obj);
            break;
        case "<i>":
            var endLess = text.indexOf("</i>")
            var sub = text.substring(startLess + 3, endLess);
            var obj = { text: sub, bold: false, italic: true, underline: false }
            newStart = endLess + 4;
            processInnerTags(obj);
            structure.push(obj);
            break;
        case "<u>":
            var endLess = text.indexOf("</u>")
            var sub = text.substring(startLess + 3, endLess);
            var obj = { text: sub, bold: false, italic: false, underline: true }
            newStart = endLess + 4;
            processInnerTags(obj);
            structure.push(obj);
            break;
    }

    text = text.substring(newStart);
    return prepareStructure(text, structure, false);
}

function processInnerTags(obj) {

}

module.exports = {
    commands: {
        "createStyledTextCommand": createStyledTextHandlerFunction
    }
};
