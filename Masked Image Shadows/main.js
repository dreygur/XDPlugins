/*
* Masked Image Shadows
* v0.0.6
*
* Add a drop shadow to selected Mask Groups.
* The plugin will create a shape layer below the mask group with a shadow applied.
* The name of the new shadow layer will be the that of the original mask group with "-shadow" appended.
*
* Jonathan Ellis
*
* Distributed under the MIT license. See LICENSE file for details.
*/

const { Color, Shadow, scenegraph } = require("scenegraph");
const { alert, createDialog } = require("./lib/dialogs.js");
let commands = require("commands");

const DIALOG_CANCELLED = "reasonCancelled";

// Initialise settings
let colorR = 0;
let colorG = 0;
let colorB = 0;
let colorA = 0.16;
let positionX = 0;
let positionY = 3;
let blur = 6;

/*
* Execute the createShadows() function using the previous settings
*/
function createDropShadow(selection) {
    // Access selected Mask Group/s, record user's initial selection
    let initialSelection = selection.items.map(i => i)
    let node = selection.items;
    
    // If there is no current selection, send an alert modal
    if (!selection.hasArtwork) {
        alert("Incorrect selection", "In order to function correctly, this plugin works when only Mask Groups have been selected. If the Mask Group is within a symbol or grouped with other objects, make sure to select the Mask Group separately.");
        return;
    } else {
        // Run the createShadows() function using previous settings
        createShadows(selection, colorR, colorG, colorB, colorA, positionX, positionY, blur);
    }
    
    // Reset selection in the document to the user's initial selection before plugin execution
    selection.items = initialSelection;
}

/*
* Show the dialog modal and get user's settings
* Execute the createShadows() function using the chosen settings
*/
function createDropShadowSetup(selection) {
    // Access selected Mask Group/s, record user's initial selection
    let initialSelection = selection.items.map(i => i)
    let node = selection.items;
    
    // If there is no current selection, send an alert modal
    if (!selection.hasArtwork) {
        alert("Incorrect selection", "In order to function correctly, this plugin works when only Mask Groups have been selected. If the Mask Group is within a symbol or grouped with other objects, make sure to select the Mask Group separately.");
        return;
    } else {
        // Reset settings to defaults
        colorR = 0;
        colorG = 0;
        colorB = 0;
        colorA = 0.16;
        positionX = 0;
        positionY = 3;
        blur = 6;
        
        // Show the settings modal dialog
        return showSettings().then(function(properties) {
            if (properties) {
                // Retrieve input values for shadow properties
                colorR = properties[0];
                colorG = properties[1];
                colorB = properties[2];
                colorA = properties[3];
                positionX = properties[4];
                positionY = properties[5];
                blur = properties[6];

                // Run the createShadows() function with specified properties
                createShadows(selection, colorR, colorG, colorB, colorA, positionX, positionY, blur);
            } // else dialog was canceled or input wasn't a number
        });
    }
    
    // Reset selection in the document to the user's initial selection before plugin execution
    selection.items = initialSelection;
}

/*
* Get all selected Mask Groups
* For each Mask Group:
* Duplicate original image and mask shape
* Delete the original image
* Set duplicated mask shape fill to white, add default drop shadow, and send backward
*/
function createShadows(selection, colorR, colorG, colorB, colorA, positionX, positionY, blur) {
    let node = selection.items;
    for (let i = 0; i < node.length; i++) {
        // Select each Mask Group node
        selection.items = node[i];
        let current = selection.items[0];
        
        // Duplicate and ungroup Mask Group
        commands.duplicate();
        commands.ungroup();
        
        // Delete the duplicated image
        let unusedImage = selection.items[0]
        unusedImage.removeFromParent();
        
        // Edit the duplicated mask shape -- rename new shadow layer, white fill, no stroke
        let shadowBox = selection.items[1]
        shadowBox.name = `${node[i].name}-shadow`;
        shadowBox.fill = new Color({r:255, g:255, b:255, a:255});
        shadowBox.fillEnabled = true;
        shadowBox.stroke = null;
        shadowBox.strokeEnabled = false;
        
        // Add the drop shadow using values chosen by user
        let userRValue = colorR;
        let userGValue = colorG;
        let userBValue = colorB;
        let userAValue = colorA;
        let userPosX = positionX;
        let userPosY = positionY;
        let userBlur = blur;
        let shadowColor = new Color({r:userRValue, g:userGValue, b:userBValue, a:(userAValue * 255)});
        shadowColor.toRgba();
        shadowBox.shadow = new Shadow(userPosX, userPosY, userBlur, shadowColor);
        
        // Send the shadow behind the original Mask Group
        commands.sendBackward();
    }
}

/*
* Create a dialog modal for user to choose settings for drop shadow
*/
function showSettings() {
    var dialog = document.createElement("dialog");
    dialog.innerHTML = `
        <style>
            .h1 {
                align-items: center;
                justify-content: space-between;
                display: flex;
                flex-direction: row;
            }

            .icon {
                width: 32px;
                height: 32px;
                overflow: hidden;
            }

            .intro-text {
                margin: 32px 0 20px 6px;
            }

            .row {
                display: flex;
                align-items: center;
                margin: 8px 0 20px 0;
            }

            .plugin-logo {
                width: 32px;
                height: 32px;
                display: inline;
            }

        </style>
        <form method="dialog">
            <h1 class="h1">
                <span>Masked Image Shadows</span>
                <img class="icon" src="images/icon.png" />
            </h1>
            <hr>
            <p class="intro-text">Select options for the drop shadow.</p>
            <h2>Color</h2>
            <div class="row">
                <div class="col">
                    <label>
                        <span>R Value (0-255):</span>
                        <input type="number" id="colorRInput" min="0" max="255" value="${colorR}" />
                    </label>
                </div>
                <div class="col">
                    <label>
                        <span>G Value (0-255):</span>
                    <input type="number" id="colorGInput" min="0" max="255" value="${colorG}" />
                    </label>
                </div>
                <div class="col">
                    <label>
                        <span>B Value (0-255):</span>
                        <input type="number" id="colorBInput" min="0" max="255" value="${colorB}" />
                    </label>
                </div>
                <div class="col">
                    <label>
                        <span>A Value (0.0-1.0):</span>
                        <input type="number" id="colorAInput" min="0" max="1" value="${colorA}" />
                    </label>
                </div>
            </div>
            <h2>Shadow Properties</h2>
            <div class="row">
                <div class="col">
                    <label>
                        <span>X Position:</span>
                        <input type="number" id="positionXInput" value="${positionX}" />
                    </label>
                </div>
                <div class="col">
                    <label>
                        <span>Y Position:</span>
                        <input type="number" id="positionYInput" value="${positionY}" />
                    </label>
                </div>
                <div class="col">
                    <label>
                        <span>Blur:</span>
                        <input type="number" id="blurInput" value="${blur}" />
                    </label>                   
                </div>
            </div>
            <footer>
                <button id="cancel" type="reset" uxp-variant="secondary">Cancel</button>
                <button id="ok" type="submit" uxp-variant="cta">Create Drop Shadow</button>
            </footer>
        </form>`;
    
    document.appendChild(dialog);

    // Ok button & Enter key automatically 'submit' the form
    // Cancel button has no default behavior
    // Esc key automatically cancels
    document.getElementById("cancel").onclick = () => dialog.close(DIALOG_CANCELLED);
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
            dialog.close(DIALOG_CANCELLED);
        }
    });

    return dialog.showModal().then(function(reason) {
        dialog.remove();

        if (reason === DIALOG_CANCELLED) {
            return null;
        } else {
            // Return the values of the input boxes
            return [parseInt(dialog.querySelector("#colorRInput").value), parseInt(dialog.querySelector("#colorGInput").value), parseInt(dialog.querySelector("#colorBInput").value), parseFloat(dialog.querySelector("#colorAInput").value), parseInt(dialog.querySelector("#positionXInput").value), parseInt(dialog.querySelector("#positionYInput").value), parseInt(dialog.querySelector("#blurInput").value)];
        }
    });
}

module.exports = {
    commands: {
        createDropShadow: createDropShadow,
        createDropShadowSetup: createDropShadowSetup
    }
};