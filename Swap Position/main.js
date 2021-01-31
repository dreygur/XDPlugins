const { alert } = require("./lib/dialogs");

/**
 * Entry point for the plugin
 *
 * @param {!Selection} selection
 */
async function swapPosition(selection) {
    if (selection.items.length === 0) {
        await alert("Swap Position", "No nodes selected. Please select 2 nodes");
        return ;
    }

    if (selection.items.length === 1) {
        await alert("Swap Position", "Only one node selected. Please select 2 nodes");
        return ;
    }

   


    // Rotate selected items's positions. Works for any number of elements.
    let selectedItems = selection.items;
    let firstNodeBounds = selectedItems[0].boundsInParent;
    let length = selectedItems.length;
    let localBounds;

    // Move ith node to (i + 1)th node's position
    for (let i = 0; i < length - 1; ++i) {
        let node = selectedItems[i];
        localBounds = {
            x: node.localBounds.x,
            y: node.localBounds.y
        };

        node.placeInParentCoordinates(localBounds, selectedItems[i + 1].boundsInParent);
    }

    // Move last node to first node's position
    let lastNode = selectedItems[length - 1];

    localBounds = {
        x: lastNode.localBounds.x,
        y: lastNode.localBounds.y
    };

    lastNode.placeInParentCoordinates(localBounds, firstNodeBounds);
}

module.exports = {
    commands: {
        swapPosition
    }
};