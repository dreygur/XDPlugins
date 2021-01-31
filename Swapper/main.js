var {LinkedGraphic, SymbolInstance, BooleanGroup, RepeatGrid, Group, Text, Artboard} = require("scenegraph");
const { alert, error } = require("./lib/dialogs.js");
var commands = require("commands");

function swappCommand(selection, documentRoot) {

    if(selection.items.length == 2) {
        // get items references
        var item1 = selection.items[0];
        var item2 = selection.items[1];
        // get their Z indices
        var index1 = getIndex(item1);
        var index2 = getIndex(item2);
        // get their parents references
        var parent1 = item1.parent;
        var parent2 = item2.parent;

        // if elements are on different artboards
        if(parent1.guid != parent2.guid) {
            // check beforehand if children are containers
            var swapSupported = checkForSwapSupport(item1) && checkForSwapSupport(item2);
            if(!swapSupported) {
                showSwapAlert();
                return;
            } else {
                if(item1 instanceof Group) {
                    selection.items = [item1];
                    var tmpItem1 = fosterGroup(selection, parent2);
                    if(tmpItem1 == null) {
                        showSwapAlert();
                        return;
                    } else {
                        item1 = tmpItem1;
                    }
                    selection.items = [item1, item2];
                } else {
                    item1.removeFromParent();
                    parent2.addChild(item1);
                }
                if(item2 instanceof Group) {
                    selection.items = [item2];
                    var tmpItem2 = fosterGroup(selection, parent1);
                    if(tmpItem2 == null) {
                        showSwapAlert();
                    } else {
                        item2 = tmpItem2;
                    }
                    selection.items = [item1, item2];
                } else {
                    item2.removeFromParent();
                    parent1.addChild(item2);
                }
            }
        }
        var artboardsNotInvolved = true;
        if(item1 instanceof Artboard || item2 instanceof Artboard) {
            artboardsNotInvolved = false;
        }
        if(artboardsNotInvolved) {
            // store rotation and remove it for a while
            var item1Rotation = item1.rotation;
            var item2Rotation = item2.rotation;
            item1.rotateAround(-item1Rotation, item1.localCenterPoint);
            item2.rotateAround(-item2Rotation, item2.localCenterPoint);
        }
        let pos1 = {x:0, y:0};
        let pos2 = {x:0, y:0};
        let bounds1 = item1.boundsInParent;
        let bounds2 = item2.boundsInParent;
        var type = "Generic";
        if(item1 instanceof Text && item2 instanceof Text) {
            type = "Texts";
        } else if(item1 instanceof Text || item2 instanceof Text) {
            type = "Mixed";
        }
        var goToPos1 = {x:0, y:0};
        var goToPos2 = {x:0, y:0};
        var localBounds1 = item1.localBounds;
        var localBounds2 = item2.localBounds;
        var hOffset1 = (bounds2.width-bounds1.width)/2;
        var hOffset2 = (bounds1.width-bounds2.width)/2;
        var vOffset1 = (bounds2.height-bounds1.height)/2;
        var vOffset2 = (bounds1.height-bounds2.height)/2;      
        switch(type) {
            case "Generic":
                break;
            case "Texts":
                // both texts are PointTexts         
                /*if(item1.areaBox == null && item2.areaBox == null) {
                    var constrainTo = "Center";
                    if(localBounds1.x == 0 && localBounds2.x == 0) {
                        constrainTo = "Left";
                        hOffset1 = bounds2.x-bounds1.x;
                        hOffset2 = bounds1.x-bounds2.x;
                    } else if(Math.abs(localBounds1.x) == localBounds1.width && Math.abs(localBounds2.x) == localBounds2.width) {
                        constrainTo = "Right";
                        hOffset1 = bounds1.x-bounds2.x;
                        hOffset2 = bounds2.x-bounds1.x;
                    }
                    trace(constrainTo);
                }*/
                break;
            case "Mixed":
                break;
        }
        goToPos1 = {x:bounds2.x + hOffset1 - localBounds1.x , y:bounds2.y + vOffset1 - localBounds1.y};
        goToPos2 = {x:bounds1.x + hOffset2 - localBounds2.x, y:bounds1.y + vOffset2 - localBounds2.y};
        item1.placeInParentCoordinates(pos2, goToPos1);
        item2.placeInParentCoordinates(pos1, goToPos2);
        if(artboardsNotInvolved) {
            // restore rotation
            item1.rotateAround(item1Rotation, item1.localCenterPoint);
            item2.rotateAround(item2Rotation, item2.localCenterPoint);
        }
        // placing object at the right Z indexes
        setIndex(item1, index2, selection);
        setIndex(item2, index1, selection);
        return;
    } else {
        showSelectionAlert();
    }
}

function getIndex(item) {
    var parent = item.parent;
    var len = parent.children.length;
    for(var i=0; i<len; i++) {
        var childNode = parent.children.at(i);
        if(childNode.guid == item.guid) {
            return i;
        }
    }
    return len-1;
}

function setIndex(item, index, selection) {
    var maxLength = item.parent.children.length-1
    if(index > maxLength) {
        index = maxLength;
    }
    var currentIndex = getIndex(item);
    var selected = selection.items;
    selection.items = [item];
    while(currentIndex != index) {
        if(currentIndex < index) {
            commands.bringForward();
        } else if(currentIndex > index) { 
            commands.sendBackward();
        }
        currentIndex = getIndex(item);
    }
    selection.items = selected;
}

function checkForSwapSupport(item) {
    // we can's swap nested Groups, BooleanGroups, SymbolInstances, LinkedGraphics and RepeatGrids that belong to different Artboards
    if(item instanceof Group) {
        var len = item.children.length;
        for(var i=0; i<len; i++) {
            var childNode = item.children.at(i);
            if(childNode.isContainer == true) {
                return false;
            }
        }
    } else if(  item instanceof BooleanGroup || 
                item instanceof RepeatGrid || 
                item instanceof SymbolInstance || 
                item instanceof LinkedGraphic)  
    {
        return false;
    }
    return true;
}

function fosterGroup(selection, p) {
    commands.ungroup();
    selection.items.forEach(function (childNode, i) {
        childNode.removeFromParent();
        p.addChild(childNode);
    });
    commands.group();
    return selection.items[0];
}
function fosterGroupAttempt(selection, g, p) {
    selection.items = null;
    g.children.forEach(function (childNode, i) {
        if(childNode.isContainer) {
            p.addChild(fosterGroup(childNode));
        } else {
            childNode.removeFromParent();
            p.addChild(childNode);
            selection.items.push(childNode);
        }
    });
    commands.group();
    return selection.items[0];
}

function trace(msg) {
    console.log(msg)
}

async function showSelectionAlert() {
    await alert("Select exactly 2 items", //[1]
        "In order to function properly, Swapper requires a selection of exactly 2 items.",
        "Please select the items you want to swap and keep on swapping!"); //[2]
}

async function showSwapAlert() {
    await alert("Selected items are too complex", //[1]
        "Swapper currently can't swap one or both of the selected items.",
        "Please try again with different items."); //[2]
}

module.exports = {
    commands: {
        swappCommand: swappCommand
    }
};