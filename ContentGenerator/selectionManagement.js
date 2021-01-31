var scenegraph = require('scenegraph');

function getShapes(selection) {
    return selection.items.filter(item => (item instanceof scenegraph.Rectangle 
                                            || item instanceof scenegraph.Ellipse
                                            || item instanceof scenegraph.Path));
}

function getText(selection) {
    return selection.items.filter(item => item instanceof scenegraph.Text);
}

// Keeps from 'entries' just the images: the files which have a .jpg or .png extension
function getImages(entries) {
    var regex = /.*\.jpg|.*\.png/;
    return entries.filter(entry => regex.test(entry.name));
}

// Returns an Array of items from Canvas that aim to be modified
function getOperableSelection(selection, getItems, operableSelection) {
    if (selection.items[0].parent.parent instanceof scenegraph.RepeatGrid) {
        operableSelection = [];
        var node = selection.items[0],
            group = node.parent,
            repeatGrid = node.parent.parent;
        for (var selectedNode = 0; selectedNode < group.children.length; selectedNode++)
            if (group.children.at(selectedNode) == node)
                break;
        for (var i = 0; i < repeatGrid.children.length; i++) {
            operableSelection.push(repeatGrid.children.at(i).children.at(selectedNode));
        }
    } else {
        operableSelection = getItems(selection);
    }
    return operableSelection;
}

module.exports = {
    getShapes,
    getText,
    getImages,
    getOperableSelection
}