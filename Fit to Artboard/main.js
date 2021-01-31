// **-------------** Fit To Artboard **-------------**
// A simple and time saving XD plugin made by Valentin de Bruyn
// @valentindb | http://etaminstudio.com


var commands = require("commands", "scenegraph");
var nodeTopLeft;
var nodeBounds;
var currentNode;
var artboardWidth;
var artboardHeight;


function FitWidthToArtboard(selection) {
    currentNode = selection.items[0];
    artboardWidth = selection.focusedArtboard.width;
    console.log(currentNode.parent.width);
    console.log(currentNode.isContainer);
    console.log(selection.focusedArtboard);

    currentNode.width = artboardWidth;
    nodeBounds = currentNode.localBounds;  // node's bounds in its own local coordinates
    nodeTopLeft = {x: nodeBounds.x, y: nodeBounds.y};  // node's top left corner in its own local coordinates
    currentNode.placeInParentCoordinates(nodeTopLeft, {x: 0,y: currentNode.topLeftInParent.y});
}


function FitHeightToArtboard(selection) {
    currentNode = selection.items[0];
    artboardHeight = selection.focusedArtboard.height;

    console.log(currentNode.parent.height);
    console.log(currentNode.isContainer);

    currentNode.height = artboardHeight;
    nodeBounds = currentNode.localBounds;  // node's bounds in its own local coordinates
    nodeTopLeft = {x: nodeBounds.x, y: nodeBounds.y};  // node's top left corner in its own local coordinates
    currentNode.placeInParentCoordinates(nodeTopLeft, {y: 0,x: currentNode.topLeftInParent.x});
}


module.exports = {
    commands: {
        fitWidthToArtboard: FitWidthToArtboard,
        fitHeightToArtboard: FitHeightToArtboard
    }
};
