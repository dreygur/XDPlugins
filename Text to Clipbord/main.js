/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

const { Text, Artboard } = require("scenegraph");
const clipboard = require("clipboard")
const { confirm } = require("./lib/dialogs/dialogs.js");
const { alert, createToast } = require("./lib/toast/index.js");

function arrayForEach(arr) {
    if (arr.forEach) {
        return arr
    }
    return Array.prototype.slice.call(arr, 0);
}
function filterTextElements(items, elements = []) {
    items.forEach( node => {
        if (node instanceof Text) {
            elements.push(node)
        } else if (node.children.length > 0) { // group
            elements = filterTextElements(node.children, elements);
        }
    });
    return elements;
}
function getArtboardTransition(node, translation = {x: 0, y: 0}) {
    if (node.parent instanceof Artboard) {
        translation.x += node.translation.x;
        translation.y += node.translation.y;
        return translation
    } else {
        translation.x += node.translation.x;
        translation.y += node.translation.y;
        return getArtboardTransition(node.parent, translation)
    }
}
async function normalCopy(selection) {
    let texts = [];

    // テキストレイヤーだけ
    if (selection.items.length === 0) return;
    const textElements = filterTextElements(selection.items);
    if (textElements.length === 0) return;


    if (textElements.length === 1) {
        clipboard.copyText(textElements[0].text);
        alert({ msg: textElements[0].text });
        return
    } else {
        const feedback = await confirm(
            "position?",
            "position or Selected order.",
            ["position", "selected"]);
        // console.log(feedback);
        if (feedback.which === 0) {
            textElements.sort((a, b) => {
                const aTran = getArtboardTransition(a)
                const bTran = getArtboardTransition(b)
                // console.log("com ----");
                // console.log(aTran);
                // console.log(bTran);
                // console.log(`${a.text} y: ${aTran.y}`);
                // console.log(`${b.text} y: ${bTran.y}`);
                if (aTran.y <= bTran.y) {
                    if(aTran.y === bTran.y){
                        if(aTran.x > bTran.x){
                            return 1;
                        }
                        return -1;
                    }
                    return -1;
                }
                return 1;
            });
            arrayForEach(textElements).forEach(textElement => {
                texts.push(textElement.text);
            });
        } else {
            arrayForEach(textElements).forEach(textElement => {
                texts.push(textElement.text);
            });
        }
        const resultText = texts.join("\n");
        // console.log(`result`);
        // console.log(resultText);
        clipboard.copyText(resultText);
        createToast({ msgs: texts});
    }

    return
}
module.exports = {
    commands: {
        normalCopy: normalCopy,
    }
};
