const viewport = require("viewport")
const { error } = require("./lib/dialogs")

/**
 * Entry point for the plugin
 *
 * @param {!Selection} selection
 */
async function scrollToArtboard(selection) {  
        
    let Layerselected = false

    
    var destinationArtboard;        

    selection.items.forEach(node => {
        if (node) {
            Layerselected = true
            node.triggeredInteractions.forEach(interaction => {
                destinationArtboard = interaction.action.destination
            });
        }        
    });

    // Handle error cases
    if (Layerselected === false) {
        showNoLayerSelectedError();
        return;
    }    
     
    viewport.scrollIntoView(destinationArtboard)             
}

async function zoomToArtboard(selection) {


    let Layerselected = false


    var destinationArtboard;    

    selection.items.forEach(node => {
        if (node) {
            Layerselected = true
            node.triggeredInteractions.forEach(interaction => {
                destinationArtboard = interaction.action.destination
            });
        }
    });

    // Handle error cases
    if (Layerselected === false) {
        showNoLayerSelectedError();
        return;
    }

    viewport.zoomToRect(destinationArtboard)
}


async function showNoLayerSelectedError() {
    await error("Go to Destination Artboard - Error", "No layer selected.");
}

module.exports = {
    commands: {
        scrollToArtboard,
        zoomToArtboard,
        showNoLayerSelectedError
    }
};