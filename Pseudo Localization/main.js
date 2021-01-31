/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

const { Artboard, Rectangle, Ellipse, Text, Color } = require("scenegraph");

const {showAlert, showError} = require("./dialog_function.js");

const convert = require("./js_core_convert_script.js");

////////////////////////////////////////////////////////////
//Starts the convert function
////////////////////////////////////////////////////////////
function StartLocalization(selection, documentRoot) {
    
    var strg = 'convert me',
        new_strg = '',
        text = '',
        node = '',
        strg = '',
        node_cache = '',
        elements_to_scan = selection.items,
        text_array = '',
        group_node = '',
        text_string = '',
        Group = '';

        console.log('Start Localization');
        // console.log('started localization'+selection.constructor.name)
        // console.log(selection.items);
    //Start a for each function for each element the user selected
    __constructor(elements_to_scan, documentRoot);
    
    if(elements_to_scan.length == 0) {
        console.log('läuft nicht');
        showAlert('No Text Element Selected', 'Select a text element to convert it into a pseudo localization');
    } else {
        console.log('läuft');
    }

    function __constructor(elements_to_scan, documentRoot) { 
        console.log('start constructor');
        console.log(elements_to_scan);
        //await showAlert();
        elements_to_scan.forEach( node => { // [1]
            if (node instanceof Artboard) {
                let artboard = node; 
                //Collect all Text elements inside the selection
                let text = artboard.children.filter(artboardChild => {
                    return artboardChild instanceof Text;
                });
                
                //Scanns the text array and change the name of them
                console.log(text)
                text.forEach(node_text => {
                    text_string = node_text.text;
                    new_strg = convert(text_string);
                    node_text.text = new_strg;
                })
            } else if (node.constructor.name == "Group") {
                console.log('Group Found!!! Not supported yet :/');
                showAlert('Groups are not supported yet', 'Select a text element to convert it into a pseudo localization');
                // let group_node = node; 
                // //Collect all Text elements inside the selection
                // let text = group_node.children.filter(group_nodeChild => {
                //     return group_nodeChild instanceof Text; 
                // });
                // //Scanns the text array and change the name of them
                // text.forEach(node_text => {
                //     console.log('Group Item');
                //     text_string = node_text.text;
                //     new_strg = convert(text_string);
                //     node_text.text = new_strg;
                // })
            
            } else {
                //TODO: Build a recrusive function which checks for groups and  re do the magic. So that also groups can be translated
                if(node instanceof Text) {
                    console.log('node.text')
                    strg = node.text;
                    new_strg = convert(strg);
                    node.text = new_strg;
                } else {
                    console.log('Selected element "'+node.name+'" didn\'t look like text '+node.constructor.name)
                    showAlert();
                    // StartLocalization();
                }
            }
            // }
        }); 
    }
    
}



module.exports = {
    commands: {
        StartLocalization: StartLocalization
    }
};
