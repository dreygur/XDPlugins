// to do: 
//check if positioning works with previous rotate objects
//check if artboard can be moved and resized according to another object (resize artboard to object)




/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

 
const commands = require("commands");
const {alert, error} = require("./lib/dialogs.js");
const clipboard = require("clipboard");


//initialize bounds value !!! very important
let xvalue, yvalue, wvalue, hvalue; 
let isArtboard;
let dialog;

//  lazy load the dialog
function createDialog() {
    if (dialog == null) {
        //  create the dialog
        dialog = document.createElement("dialog");

        //  create the form element
        //  the form element has default styling and spacing
        let form = document.createElement("form");
        dialog.appendChild(form);
        //  don't forget to set your desired width
        form.style.width = 200;

        //  add your content
        let hello = document.createElement("h1");
        hello.textContent = "Hello World";
        form.appendChild(hello);

        let text = document.createElement("p");
        text.textContent = "This is a paragraph";
        form.appendChild(text)

        //  create a footer to hold your form submit and cancel buttons
        let footer = document.createElement("footer");
        form.appendChild(footer)
        //  include at least one way to close the dialog
        let closeButton = document.createElement("button");
        closeButton.uxpVariant = "cta";
        closeButton.textContent = "Close";
        closeButton.onclick = (e) => dialog.close();
        footer.appendChild(closeButton);
    }
    return dialog;
}

// it is not added to the module.exports !!!!!!!!!!!
async function insert() {
    // ADD this back in manifest.json: 
    // {
    //     "label" : "Insert Bounds [Ctrl+Alt+8]",
    //     "type" : "menu",
    //     "commandId" : "insert",
    //     "shortcut" : {"win": "Ctrl+Alt+8"}
    // },
    document.body.appendChild(createDialog()).showModal();
}


// async function insert(message) {

//     //MAKE A DIALOG (inspired by plugin 669f929b Adjust size by shorcut -> Nudge Size Setting...)

//     // Contruct the prompt
//     const feedback = await prompt(
//         "Insert position coordonates", //[title]
//         "These values will update the x and y of the paste object.", //[msg]
//         //console.log('insert works'),  //[prompt]
//         ['Dismiss', 'Save values']);

//     // Detect user action
//     switch (feedback.which) {
//         case 0:
//             // User canceled
//             break;
//         case 1:
//             // User confirmed
//             // Get the value the user submitted
//             //prefs.largeNudge = feedback.value;

//             // Save user preferences to settings.json
//             //savePrefs();
//             break;
//         case 2: 
//         //
//     }
// }

function showAlert() {
    error("No selection!", "First select at least one element, one group, or multiple individual elements and then click on the Copy Bounds button.\nAfter that you can apply those bounds to any elements.");
}

function transfer(x, y, w, h) {
    xvalue = x;
    yvalue = y;
    wvalue = w;
    hvalue = h;
}

function copy(selection) { 
    if(selection.items.length > 0) {
        //console.log(selection.items[0].boundsInParent.x);
        commands.group();
        let x = selection.items[0].boundsInParent.x;
        let y = selection.items[0].boundsInParent.y;
        let w = selection.items[0].boundsInParent.width;
        let h = selection.items[0].boundsInParent.height;
        // console.log("X is: " + x);
        // console.log("Y is: " + y);
        // console.log("Width is: " + w);
        // console.log("Height is: " + h);
        clipboard.copyText(x);
        commands.ungroup();
        transfer(x, y, w, h);
        
        // isArtboard = (selection.items[0].constructor.name == "Artboard") ? true : false;

    } else {
        showAlert();
        return;
    }
}

function pastePosition(selection) { 
    //console.log(selection.items[0]);
   //if no previous copy, abort:
    if(!xvalue) {
        error("No bounds copied", "First select one or more items and click on Copy Bounds button");
        //console.log("nothing to paste"); 
        return;   
    }

   if(selection.items.length == 0) {
       alert("Select one or more items");
       return;
       //console.log("nothing to paste");     
   }

// WHY DOESN'T THIS WORK ???  
// selection.items[0].placeInParentCoordinates( {x: 50, y: 100}, selection.items[0].parent.topLeftInParent);

// [ ] should work for: Artboard, Rectangle, Ellipse, Polygon, Line, Path, Text, Group, BooleanGroup, MaskedGroup, SymbolInstance, RepeatGrid, LinkedGraphic RootNode
// [ ] test for multiple on same artboard && multiple artboards !!!!!!!!!
    selection.items.forEach(item => {
        //clear rotation of elements until the object moves to the new position, then revert back:
        let originalItemRotation = item.rotation; //console.log(originalItemRotation);
        
        // DO NOT ROTATE IF IS NOT AN ARTBOARD:
        if(item.constructor.name !== "Artboard") { 
             //make rotation == 0:
            item.rotateAround(180 - item.rotation + 180, item.localCenterPoint);
        }

        var x = xvalue; var y = yvalue;
        if (item.constructor.name=="Text") {
            item.translation={x: x + item.localBounds.x * -1, y: y + item.localBounds.y * -1};
            return;
        } else if(item.constructor.name=="Group") {
            commands.alignLeft();
            commands.alignTop();  
            //node.boundsInParent (??? - https://adobexdplatform.com/plugin-docs/reference/scenegraph.html#SceneNode-boundsInParent)
            //item.placeInParentCoordinates( {x: item.localBounds.x -x , y: item.localBounds.y -y}, item.topLeftInParent); // this one works also(!) 
            //item.translation = {x: item.localBounds.x -x , y: item.localBounds.y -y};
            item.moveInParentCoordinates(x,y); 
            return;
        } else if (item.constructor.name=="BooleanGroup") {
            item.translation={x: x + item.localBounds.x * -1, y: y + item.localBounds.y * -1};
            return;
        } else if (item.constructor.name=="Path") {
            commands.alignLeft();
            commands.alignTop();
            item.moveInParentCoordinates(x,y);
            //item.translation={x:x, y:y}
            //paths are SOMETIMES positioned with a 0.5 offset == need to fix it!!!! try to find when it makes the offset (?)
            return;
        } 
   
         //anything else:
        item.translation={x:x, y:y};
            
        //revert back the orginal rotation of element IF IS NOT AN ARTBOARD:
        if(item.constructor.name !== "Artboard") {
            item.rotateAround(originalItemRotation, item.localCenterPoint);
        }
    })

}

function pasteSize(selection) {
    //if no previous copy, abort:
    if(!xvalue) {
        error("No bounds copied", "First select an item and click on the Copy Bounds button to copy x, y, with and height of the selection.");
        //console.log("nothing to paste"); 
        return;   
    }

    if(selection.items.length == 0) {
        alert("Select one or more items");
        return;
    //console.log("nothing to paste");     
    }

    selection.items.forEach(item => {
        var w = wvalue; var h = hvalue;
        item.resize(w, h); //anything else than group
    })
}

function pasteBounds(selection) {
    //if no previous copy 
    pasteSize(selection);
    pastePosition(selection);
    
}


// ADD "insert" function below
module.exports = {
    commands: {
        copy,
        pastePosition,
        pasteSize,
        pasteBounds
    }
};
