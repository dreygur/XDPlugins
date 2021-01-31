/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

const { Text, Color } = require("scenegraph");
const commands = require("commands"); 
const { alert, error } = require("./lib/dialogs.js");

function colordetails(selection, documentRoot) { 
    if(selection.items.length !== 0){
        try{
            selection.items.forEach(item => {
        
                const node = item;
                let x = node.globalBounds.x;
                let y = node.globalBounds.y;
        
                const hex = new Text();
                hex.text = String(node.fill.toHex(true))
                hex.fill = new Color("#000000")
                hex.fontSize=node.globalBounds.height / 2;
                hex.moveInParentCoordinates(x+node.globalBounds.width,y+node.globalBounds.height)
                console.log(hex.globalBounds);
                const rgb = new Text();
                rgb.text = "rgb(" + String(node.fill.r) + ","+ String(node.fill.g) + "," + + String(node.fill.b) + ")";
                rgb.fill = new Color("#000000")
                rgb.fontSize=node.globalBounds.height / 2;
                rgb.moveInParentCoordinates(x+node.globalBounds.width,y+(node.globalBounds.height/2))
                console.log(rgb.globalBounds);
                
                documentRoot.addChild(hex,1);
                documentRoot.addChild(rgb,1);
        
            });
        }
        catch{
            error("Make sure you have selected one or more rectangles that have a fill")
        }
        
    }
    else{
        alert("Please select one or more rectangles filled with a color");
    }

}

module.exports = {
    commands: {
        colordetails
    }
};
