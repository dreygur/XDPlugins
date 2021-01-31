const {prompt} = require("./lib/dialogs.js");
const {selection} = require("scenegraph");

async function showPrompt() {
    const res = await prompt("Export as Webcomponent", "Please enter a name for your Component and select a folder", "select folder", "Webcomponent name", ["Cancel", "OK"]);

    switch (res.which) {
        case 0:
            console.log("Abbrechen");
            // return alert("Abbrechen", "Export wurde abgebrochen");
            break;
        case 1:
            console.log("Save");
            //return alert("Save Webcomponent", `dein Export wurde in ${res.value} gespeichert!`);
            break;
    }
}

module.exports = {
    commands: {
        showPrompt,
    }
};