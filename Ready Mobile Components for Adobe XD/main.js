//API Imports
const Scenegraph = require('scenegraph');
const Command = require('commands');

//Custom Imports
const object = require('./dialogs/dialog');
const Components = require('./components/components');
const Events = require('./dialogs/events');

//Globals
var dialog;

async function startPlugin(selection, documentRoot) {
    var option, i=0;
    var art = new Array();
    
    var dialog;

    documentRoot.children.forEach(node => {                                          
        if(node instanceof Scenegraph.Artboard){
            if(node.width <= 414 && node.width >= 320 ){
                art.push(node);
            }
        }
    });
    if(art.length == 0){
        var nullDialog = document.createElement("dialog");
        document.body.appendChild(nullDialog);
        nullDialog.innerHTML = `<h1>Please add some Mobile artboards to proceed!</h1>`;
        setTimeout( () => {nullDialog.close()}, 1500);
        await nullDialog.showModal();
    }
    else{
        dialog = createDialog(1);
        var events = new Events(document, selection, art);
        events.bindEvents();

        for(i=0;i<art.length;i++){
            option += `<option>`+art[i].name+`</option>`;
        }
        document.getElementById("options").innerHTML = option;
        await dialog.showModal();
    }
}

function createDialog(type){
    if(dialog){
        return dialog;
    }
    //Creating the dialog.
    dialog = document.createElement("dialog");
    dialog.id = "dialog";
    document.body.appendChild(dialog);
    dialog.innerHTML = object.showIntro();
    return dialog;
}


module.exports = {
    commands: {
        startPlugin
    }
};