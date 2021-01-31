const { Text, Color } = require("scenegraph");
const { alert, error } = require("./lib/dialogs.js");

async function randomQuote() {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    return data;
}

async function quoteHandlerFunction(selection) {
    try {
        const quote = await randomQuote();

        const node = new Text();
        node.text = `${quote.content} - ${quote.author}`;
        node.fill = new Color().clone();
        node.fontSize = 18;
        node.areaBox = { width: 800, height: 200 };

        selection.insertionParent.addChild(node);
        node.moveInParentCoordinates(20, 20);
    } catch (ex) {
        console.log("Detailed error: ", ex);
        await error("Oops", "Please check your network connection.");
    }
}

module.exports = {
    commands: {
        getQuote: quoteHandlerFunction
    }
};
