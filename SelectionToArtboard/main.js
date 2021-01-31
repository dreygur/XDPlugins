/**
 * Selection to Artboard Plugin
 */

var scenegraph = require('scenegraph');
var commands = require('commands');
var nrArt = 0;

/**
* Shorthand for creating Elements.
* @param {*} tag The tag name of the element.
* @param {*} [props] Optional props.
* @param {*} children Child elements or strings
*/
function h(tag, props, ...children) {
    let element = document.createElement(tag);
    if (props) {
        if (props.nodeType || typeof props !== "object") {
            children.unshift(props);
        }
        else {
            for (let name in props) {
                let value = props[name];
                if (name == "style") {
                    Object.assign(element.style, value);
                }
                else {
                    element.setAttribute(name, value);
                    element[name] = value;
                }
            }
        }
    }
    for (let child of children) {
        element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
    }
    return element;
}

let dialog;
function getDialog() {
    if (dialog == null) {
        dialog =
            h("dialog",
                h("form", { style: { width: 360 } },
                    h("h1", "Selection to Artboard Plugin"),
                    h("hr", ""),
                    h("p", ""),
                    h("p", "Please select one or more layers."),
                    h("p", ""),
                    h("footer",
                        h("button", { uxpVariant:"cta", type:"submit", onclick() { dialog.close() } }, "OK")
                    )
                )
            )
    }
    return dialog;
}


// Global coordinates of Top Left Corner of Selection
function findTopLeftCornerOfSelection(userSelection) {
    var minX = userSelection[0].globalBounds.x,
        minY = userSelection[0].globalBounds.y;
    userSelection.forEach(function(node) {
        minX = node.globalBounds.x < minX ? node.globalBounds.x : minX;
        minY = node.globalBounds.y < minY ? node.globalBounds.y : minY;
    });
    return {x: minX, y: minY};
}

// Global coordinates of Bottom Right Corner of Selection
function findBottomRightCornerOfSelection(userSelection) {
    var maxX = userSelection[0].globalBounds.x + userSelection[0].globalBounds.width,
        maxY = userSelection[0].globalBounds.y + userSelection[0].globalBounds.height;
    userSelection.forEach(function(node) {
        maxX = node.globalBounds.x + node.globalBounds.width > maxX ? node.globalBounds.x + node.globalBounds.width : maxX;
        maxY = node.globalBounds.y + node.globalBounds.height > maxY ? node.globalBounds.y + node.globalBounds.height : maxY;
    });
    return {x: maxX, y: maxY};
}

// Check if any elements of the Selection are positioned on Artboard
function checkParentArtboard(selection, root) {
    return selection.items.reduce((acc, node) => {
        while (!(node instanceof scenegraph.Artboard) && node != root) {
            node = node.parent;
        }
        return acc || (node != root);
    }, false);
}

function execution (selection, root) {
    if (selection.items.length == 0 || selection.items[0] instanceof scenegraph.Artboard) {
        document.body.appendChild(getDialog()).showModal();
        return;
    }

    var topLeft = findTopLeftCornerOfSelection(selection.items),
        bottomRight = findBottomRightCornerOfSelection(selection.items);
    // The selection will be copied on a new custom sized Artboard
    if (checkParentArtboard(selection, root)) {
        var userSelection = selection.items;
        var artboard = new scenegraph.Artboard();
        artboard.fill = new scenegraph.Color('white');
        artboard.width = 375;
        artboard.height = 667;
        nrArt++;
        // Artboard must be placed lowest in the Z order
        root.addChildBefore(artboard, root.children.at(0));
        selection.items = [artboard];
        commands.duplicate();
        var newArtboard = selection.items[0],
            newArtboardBounds = newArtboard.globalBounds;
        newArtboard.name = 'Artboard - ' + nrArt;
        artboard.removeFromParent();
        selection.items = userSelection;
        // The selection is duplicated
        commands.duplicate();
        // Each duplicated element is positioned on the new Artboard
        selection.items.forEach(function(node) {
            node.moveInParentCoordinates(newArtboardBounds.x - topLeft.x, newArtboardBounds.y - topLeft.y);
        });
        // The new Artboard is resized to fit the selection
        newArtboard.resize(bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    } else {
        // All the selected elements are placed on Pasteboard
        // A new Artboard will be placed under the selection
        var artboard = new scenegraph.Artboard();
        artboard.fill = new scenegraph.Color('white');
        artboard.width = 375;
        artboard.height = 667;
        nrArt++;
        artboard.name = 'Artboard - ' + nrArt;
        // Artboard must be placed lowest in the Z order
        root.addChildBefore(artboard, root.children.at(0));
        var artboardTopLeft = {x: artboard.localBounds.x, y: artboard.localBounds.y};
        artboard.placeInParentCoordinates(artboardTopLeft, topLeft);
        artboard.resize(bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }
}

module.exports = {
    commands: {
        execution
    }
};