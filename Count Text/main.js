const { Text } = require("scenegraph");
const { alert, error } = require("./lib/dialogs");

/**
 * Entry point for the plugin
 *
 * @param {!Selection} selection
 */
async function countText(selection) {
    let wc = 0, cc = 0, textLayersSelected = false;

    selection.items.forEach(node => {
        if (node instanceof Text) {
            let text = node.text.trim();

            textLayersSelected = true;

            wc += countWords(text);
            cc += text.length;
        }
    });

    // Handle error cases
    if (textLayersSelected === false) {
        await error("Count Text - Error", "No text layers selected");
        return ;
    }

    await alert("Count Text", `Word Count: ${wc}`, `Character Count: ${cc}`);
}

/**
 * Counts the number of words in the string
 * @param {!string} str
 * @returns {Number} no of words in the string
 */
function countWords(str) {
    return str.split(/\s+/).length;
}

module.exports.commands = {
    countText
};