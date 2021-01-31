/*
 * Developed by ZiyeLu for Adobe XD.
 *
 * Function: Add and renaming color assets from selection layers, automatically ignoring text & image.
 */


const {Rectangle, Color} = require("scenegraph"); 
const { alert } = require("./lib/dialogs.js");

function ColorAddHandlerFunction(selection) { 
    var newColorNum=0, renameColorNum=0;
    var assets = require("assets");
    let colors = selection.items;
    colors.forEach((node) => {
        if (node.constructor.name == "Rectangle" && node.fill.constructor.name == "Color"){
            if (assets.colors.delete(new Color(node.fill))==1) {
                console.log("color deleted")
                renameColorNum++;
                newColorNum--;
            }
            assets.colors.add({name: node.name, color: node.fill});
            console.log("color " + node.name + " is added");
            newColorNum++;
        }
    })
    showAlert(newColorNum, renameColorNum);

}
async function showAlert(newColorNum, renameColorNum){
    await alert(newColorNum + " colors has been added to Assets", //[1]
    "And " + renameColorNum + " existed colors has been renamed.",
    "Go to Assets Panel to see your colors :D"); //[2]
}

module.exports = {
    commands: {
        addColors: ColorAddHandlerFunction
    }
};
